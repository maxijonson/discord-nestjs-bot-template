import { Events } from "discord.js";
import fs from "node:fs";
import path from "node:path";
import { toCamel, toKebab, toPascal } from "src/common/utils/string.utils";
import { Project, QuoteKind, SyntaxKind } from "ts-morph";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { ensureDir, escapeForStringLiteral, formatWithPrettier } from "./utils/script-utils";
import { ROOT } from "./utils/scripts.constants";

const getClientEventParams = (eventName: string): string[] => {
  const project = new Project();
  const importsFile = project.createSourceFile(
    "imports.ts",
    `import { ClientEvents } from "discord.js"; interface X extends ClientEvents {}`,
  );

  const eventValueDecl = importsFile
    .getInterfaceOrThrow("X")
    .getType()
    .getPropertyOrThrow(eventName)
    .getValueDeclarationOrThrow();
  const eventValueDeclText = eventValueDecl.getText();

  const tupleMatch = eventValueDeclText.match(/\[(.*)\]/s);
  if (!tupleMatch) return [];

  const params = tupleMatch[1].split(",").map((p) => p.trim());
  const paramNames: string[] = params.map((p) => p.split(":")[0].trim());

  return paramNames;
};

yargs(hideBin(process.argv))
  .scriptName("create:listener")
  .command(
    "$0 <name> <event>",
    "Create a new event listener",
    (yargs) => {
      return yargs
        .positional("name", {
          type: "string",
          describe: "event name (kebab or simple word)",
          demandOption: true,
        })
        .positional("event", {
          type: "string",
          describe: "Discord.js event name (e.g., messageCreate, guildMemberAdd)",
          demandOption: true,
        });
    },
    // --- LISTENER HANDLER ---
    async ({ name, event }) => {
      if (!Object.values(Events).includes(event as Events)) {
        console.error(`❌ Invalid event name "${event}". Please provide a valid Discord.js event name.`);
        console.info("Valid events are:");
        console.info(
          Object.values(Events)
            .map((e) => ` - ${e}`)
            .join("\n"),
        );
        process.exit(1);
      }

      const folder = name.includes("/") ? path.join(...name.split("/").slice(0, -1)) : "";
      name = name.includes("/") ? name.split("/").slice(-1)[0] : name;

      // ---------- Paths ----------
      const listenersRoot = path.join(ROOT, "src", "listeners");
      const listenersDir = path.join(listenersRoot, "handlers", folder);
      const listenerFilePath = path.join(listenersDir, `${name}.listener.ts`);
      const listenersModulePath = path.join(listenersRoot, "listeners.module.ts");

      // ---------- `name` casing ----------
      const kebabName = toKebab(name);
      const pascalName = toPascal(name);
      const _camelName = toCamel(name);

      if (!/^[a-z][a-z0-9-]*$/.test(kebabName)) {
        console.error("❌ Invalid name. Use letters, numbers, and dashes, starting with a letter.");
        process.exit(1);
      }

      const className = pascalName + "Listener";

      // ---------- Scaffolding ----------
      ensureDir(listenersDir);
      if (fs.existsSync(listenerFilePath)) {
        console.error(`❌ ${path.relative(ROOT, listenerFilePath)} already exists.`);
        process.exit(1);
      }

      const project = new Project({
        tsConfigFilePath: fs.existsSync(path.join(ROOT, "tsconfig.json"))
          ? path.join(ROOT, "tsconfig.json")
          : undefined,
        manipulationSettings: { quoteKind: QuoteKind.Double },
      });

      // 1) Create the handler source via AST
      const sf = project.createSourceFile(listenerFilePath, "", { overwrite: false });

      sf.addImportDeclaration({
        moduleSpecifier: "@nestjs/common",
        namedImports: ["Injectable"],
      });

      sf.addImportDeclaration({
        moduleSpecifier: "necord",
        namedImports: ["Context", { isTypeOnly: true, name: "ContextOf" }, "On"],
      });

      const eventParamNames = getClientEventParams(event);
      sf.addClass({
        isExported: true,
        name: className,
        decorators: [{ name: "Injectable", arguments: [] }],
        methods: [
          {
            name: toCamel("handle", pascalName),
            isAsync: true,
            decorators: [
              {
                name: "On",
                arguments: [`"${escapeForStringLiteral(event)}"`],
              },
            ],
            parameters: [
              {
                name: `@Context() [${eventParamNames.join(", ")}]`,
                type: `ContextOf<"${escapeForStringLiteral(event)}">`,
              },
            ],
            statements: [`// TODO: Implement ${event} logic`],
          },
        ],
      });

      // 2) Wire into listeners.module.ts -> add import + add to HANDLERS
      const listenersModule = project.addSourceFileAtPath(listenersModulePath);
      const importPath = `./${path.relative(path.dirname(listenersModulePath), listenerFilePath)}`.slice(0, -3);

      const alreadyImported = !!listenersModule.getImportDeclarations().find((imp) => {
        return (
          imp.getModuleSpecifierValue() === importPath && imp.getNamedImports().some((ni) => ni.getName() === className)
        );
      });

      if (!alreadyImported) {
        listenersModule.addImportDeclaration({
          moduleSpecifier: importPath,
          namedImports: [className],
        });
      }

      const handlersDecl = listenersModule.getVariableDeclaration("HANDLERS");
      if (!handlersDecl) {
        console.error(
          "❌ Could not find HANDLERS variable in src/listeners/listeners.module.ts. " +
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
        await formatWithPrettier([listenerFilePath, listenersModulePath]);
        console.info(`✅ Created ${path.relative(ROOT, listenerFilePath)}`);
        console.info(`✅ Updated ${path.relative(ROOT, listenersModulePath)} (HANDLERS + import)`);
      } catch (err) {
        console.error("❌ Failed to save project:", err);
        process.exit(1);
      }
    },
  )
  .help()
  .parse();
