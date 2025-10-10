export const toKebab = (...inputs: string[]) =>
  inputs
    .join(" ")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();

export const toPascal = (...inputs: string[]) => {
  const k = toKebab(...inputs);
  return k
    .split(/[-]+/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
    .join("");
};

export const toCamel = (...inputs: string[]) => {
  const k = toKebab(...inputs);
  const p = toPascal(k);
  return p.charAt(0).toLowerCase() + p.slice(1);
};
