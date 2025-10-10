import path from "node:path";
import fs from "node:fs";
import { Project, QuoteKind, SyntaxKind, Writers } from "ts-morph";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { ensureDir, escapeForStringLiteral, formatWithPrettier } from "./utils/script-utils";
import { ROOT } from "./utils/scripts.constants";
import { toCamel, toKebab, toPascal } from "src/common/utils/string.utils";

yargs(hideBin(process.argv))
  .scriptName("create:command")
  .command(
    "$0 <name> [description]",
    "Create a new slash command handler",
    (yargs) => {
      return yargs
        .positional("name", {
          type: "string",
          describe: "command name (kebab or simple word)",
          demandOption: true,
        })
        .options({
          description: {
            type: "string",
            describe: "command description",
          },
        });
    },
    // --- COMMAND HANDLER ---
    async ({ name, description }) => {
      const folder = name.includes("/") ? path.join(...name.split("/").slice(0, -1)) : "";
      name = name.includes("/") ? name.split("/").slice(-1)[0] : name;

      // ---------- Paths ----------
      const commandsRoot = path.join(ROOT, "src", "commands");
      const cmdDir = path.join(commandsRoot, "handlers", folder);
      const cmdFilePath = path.join(cmdDir, `${name}.command.ts`);
      const commandsModulePath = path.join(commandsRoot, "commands.module.ts");

      // ---------- `name` casing ----------
      const kebabName = toKebab(name);
      const pascalName = toPascal(name);
      const _camelName = toCamel(name);

      if (!/^[a-z][a-z0-9-]*$/.test(kebabName)) {
        console.error("❌ Invalid name. Use letters, numbers, and dashes, starting with a letter.");
        process.exit(1);
      }

      const className = pascalName + "Command";

      // ---------- Scaffolding ----------
      ensureDir(cmdDir);
      if (fs.existsSync(cmdFilePath)) {
        console.error(`❌ ${path.relative(ROOT, cmdFilePath)} already exists.`);
        process.exit(1);
      }

      const project = new Project({
        tsConfigFilePath: fs.existsSync(path.join(ROOT, "tsconfig.json"))
          ? path.join(ROOT, "tsconfig.json")
          : undefined,
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
        namedImports: ["SlashCommand", "Context", { isTypeOnly: true, name: "SlashCommandContext" }],
      });

      cmdSource.addClass({
        isExported: true,
        name: className,
        decorators: [{ name: "Injectable", arguments: [] }],
        methods: [
          {
            name: toCamel("handle", pascalName),
            isAsync: true,
            decorators: [
              {
                name: "SlashCommand",
                arguments: [
                  Writers.object({
                    name: `"${escapeForStringLiteral(kebabName)}"`,
                    description: description
                      ? `"${escapeForStringLiteral(description)}"`
                      : `"Runs the '${kebabName}' command"`,
                  }),
                ],
              },
            ],
            parameters: [
              {
                name: "@Context() [interaction]",
                type: "SlashCommandContext",
              },
            ],
            statements: [`await interaction.reply("Pong from ${kebabName}!");`],
          },
        ],
      });

      // 2) Wire into commands.module.ts -> add import + add to HANDLERS
      const commandsModule = project.addSourceFileAtPath(commandsModulePath);
      const importPath = `./${path.relative(path.dirname(commandsModulePath), cmdFilePath)}`.slice(0, -3);

      const alreadyImported = !!commandsModule.getImportDeclarations().find((imp) => {
        return (
          imp.getModuleSpecifierValue() === importPath && imp.getNamedImports().some((ni) => ni.getName() === className)
        );
      });

      if (!alreadyImported) {
        commandsModule.addImportDeclaration({
          moduleSpecifier: importPath,
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

      try {
        await project.save();
        await formatWithPrettier([cmdFilePath, commandsModulePath]);
        console.info(`✅ Created ${path.relative(ROOT, cmdFilePath)}`);
        console.info(`✅ Updated ${path.relative(ROOT, commandsModulePath)} (HANDLERS + import)`);
      } catch (err) {
        console.error("❌ Failed to save project:", err);
        process.exit(1);
      }
    },
  )
  .help()
  .parse();
