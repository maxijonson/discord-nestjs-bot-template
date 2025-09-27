import path from "node:path";
import fs from "node:fs";
import { Project, QuoteKind, SyntaxKind, Writers } from "ts-morph";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import {
  ROOT,
  toKebab,
  toPascal,
  toCamel,
  ensureDir,
  escapeForStringLiteral,
  formatWithPrettier,
} from "./script-utils";

(async () => {
  // ---------- CLI ----------
  const argv = await yargs(hideBin(process.argv))
    .scriptName("create:command")
    .command("$0 <name>", "Create a command", (yargs) =>
      yargs
        .positional("name", {
          type: "string",
          describe: "command name (kebab or simple word)",
          demandOption: true,
          alias: "n",
        })
        .option("description", {
          alias: "d",
          type: "string",
          default: "Example command",
          describe: "slash command description",
        }),
    )
    .demandCommand()
    .help()
    .parseSync();

  const nameKebab = toKebab(argv.name as string);
  if (!/^[a-z][a-z0-9-]*$/.test(nameKebab)) {
    console.error("❌ Invalid name. Use letters, numbers, and dashes, starting with a letter.");
    process.exit(1);
  }

  const className = toPascal(nameKebab) + "Command";
  const methodName = toCamel(nameKebab);
  const description = String(argv.description);

  // ---------- Paths ----------
  const commandsRoot = path.join(ROOT, "src", "commands");
  const cmdDir = path.join(commandsRoot, "handlers");
  const cmdFilePath = path.join(cmdDir, `${nameKebab}.command.ts`);
  const commandsModulePath = path.join(commandsRoot, "commands.module.ts");

  // ---------- Scaffolding ----------
  ensureDir(cmdDir);
  if (fs.existsSync(cmdFilePath)) {
    console.error(`❌ ${path.relative(ROOT, cmdFilePath)} already exists.`);
    process.exit(1);
  }

  const project = new Project({
    tsConfigFilePath: fs.existsSync(path.join(ROOT, "tsconfig.json")) ? path.join(ROOT, "tsconfig.json") : undefined,
    manipulationSettings: { quoteKind: QuoteKind.Double },
  });

  // 1) Create the handler source via AST
  const cmdSource = project.createSourceFile(cmdFilePath, "", { overwrite: false });

  cmdSource.addImportDeclaration({
    moduleSpecifier: "@nestjs/common",
    namedImports: ["Injectable"],
  });

  cmdSource.addImportDeclaration({
    moduleSpecifier: "necord",
    namedImports: ["SlashCommand"],
  });

  cmdSource.addImportDeclaration({
    moduleSpecifier: "discord.js",
    namedImports: ["CommandInteraction"],
  });

  cmdSource.addClass({
    isExported: true,
    name: className,
    decorators: [{ name: "Injectable", arguments: [] }],
    methods: [
      {
        name: toCamel("handle", methodName),
        isAsync: true,
        decorators: [
          {
            name: "SlashCommand",
            arguments: [
              Writers.object({
                name: `"${escapeForStringLiteral(nameKebab)}"`,
                ...(description ? { description: `"${escapeForStringLiteral(description)}"` } : {}),
              }),
            ],
          },
        ],
        parameters: [
          {
            name: "interaction",
            type: "CommandInteraction",
          },
        ],
        statements: [`await interaction.reply("Pong from ${nameKebab}!");`],
      },
    ],
  });

  // 2) Wire into commands.module.ts -> add import + add to HANDLERS
  const commandsModule = project.addSourceFileAtPath(commandsModulePath);

  const alreadyImported = !!commandsModule.getImportDeclarations().find((imp) => {
    return (
      imp.getModuleSpecifierValue() === `./handlers/${nameKebab}.command` &&
      imp.getNamedImports().some((ni) => ni.getName() === className)
    );
  });

  if (!alreadyImported) {
    commandsModule.addImportDeclaration({
      moduleSpecifier: `./handlers/${nameKebab}.command`,
      namedImports: [className],
    });
  }

  const handlersDecl = commandsModule.getVariableDeclaration("HANDLERS");
  if (!handlersDecl) {
    console.error(
      "❌ Could not find HANDLERS variable in src/commands/commands.module.ts. " +
        "This template expects an exported HANDLERS array in that module.",
    );
    process.exit(1);
  }

  const arrLiteral = handlersDecl.getInitializerIfKindOrThrow(SyntaxKind.ArrayLiteralExpression);

  // add the class identifier if not present
  const hasEntry = arrLiteral.getElements().some((el) => {
    return el.getKind() === SyntaxKind.Identifier && el.getText() === className;
  });
  if (!hasEntry) {
    arrLiteral.addElement(className);
  }

  // Save all changes
  //   project
  //     .save()
  //     .then(() => {
  //       console.info(`✅ Created ${path.relative(ROOT, cmdFilePath)}`);
  //       console.info(`✅ Updated ${path.relative(ROOT, commandsModulePath)} (HANDLERS + import)`);
  //     })
  //     .catch((err) => {
  //       console.error("❌ Failed to save project:", err);
  //       process.exit(1);
  //     });
  try {
    await project.save();
    await formatWithPrettier([cmdFilePath, commandsModulePath]);
    console.info(`✅ Created ${path.relative(ROOT, cmdFilePath)}`);
    console.info(`✅ Updated ${path.relative(ROOT, commandsModulePath)} (HANDLERS + import)`);
  } catch (err) {
    console.error("❌ Failed to save project:", err);
    process.exit(1);
  }
})();
