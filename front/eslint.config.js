// @ts-check
const eslint = require("@eslint/js");
const { defineConfig } = require("eslint/config");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = defineConfig([
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      // This app predates angular-eslint and mostly uses bare selectors
      // (explorer, tabs, sidenav, json-card, ...) rather than an "app-"
      // prefix; only a handful of page components use "app-". Enforce
      // kebab-case/camelCase, but don't require a prefix that most of the
      // codebase was never written with.
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: [],
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: [],
          style: "kebab-case",
        },
      ],
      // Empty methods are the standard shape for a spy target in a test
      // host component (e.g. `onClickOutside(): void {}`), not a mistake.
      "@typescript-eslint/no-empty-function": ["error", { allow: ["methods"] }],
      // Mock functions matching a real interface (e.g. ParamMap.get) often
      // ignore the argument on purpose; keep flagging genuinely unused
      // variables/params, just allow the conventional "_" escape hatch.
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      angular.configs.templateRecommended,
      angular.configs.templateAccessibility,
    ],
    rules: {},
  }
]);
