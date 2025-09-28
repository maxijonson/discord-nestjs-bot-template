import path from "path";
import prettier from "prettier";
import fs from "fs";

export const ROOT = path.join(__dirname, "..");

export const toKebab = (...inputs: string[]) =>
  inputs
    .join(" ")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();

export const toPascal = (...inputs: string[]) =>
  inputs
    .join(" ")
    .split(/[-_ ]+/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
    .join("");

export const toCamel = (...inputs: string[]) => {
  const p = toPascal(...inputs);
  return p.charAt(0).toLowerCase() + p.slice(1);
};

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
