import eslintPluginAstro from "eslint-plugin-astro";

export default [
  { ignores: ["coverage/**"] },
  ...eslintPluginAstro.configs.recommended,
];
