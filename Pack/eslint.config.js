// eslint.config.js
import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default [
  js.configs.recommended,
  prettier,
  {
    plugins: {
      "jsx-a11y": jsxA11y
    },
    rules: {
      "no-unused-vars": "warn"
    }
  }
];
