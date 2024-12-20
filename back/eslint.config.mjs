import globals from "globals";
import pluginJs from "@eslint/js";
import jestPlugin from "eslint-plugin-jest";

export default [
  {
    languageOptions: { globals: { ...globals.node, ...globals.jest } },
    ...pluginJs.configs.recommended,
    plugins: { jest: jestPlugin },
  },
];
