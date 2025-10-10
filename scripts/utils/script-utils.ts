import path from "path";
import prettier from "prettier";
import fs from "fs";
import { ROOT } from "./scripts.constants";

export const ensureDir = (dir: string) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

export const escapeForStringLiteral = (s: string) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

export const formatWithPrettier = async (files: string[]) => {
  const config = await prettier.resolveConfig(path.join(ROOT, ".prettierrc"));
  for (const file of files) {
    const source = await fs.promises.readFile(file, "utf8");
    const formatted = await prettier.format(source, {
      ...config,
      filepath: file,
    });
    await fs.promises.writeFile(file, formatted, "utf8");
  }
};
