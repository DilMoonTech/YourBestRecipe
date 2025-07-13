import js from "@eslint/js";
import vue from "eslint-plugin-vue";

export default [
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      ".quasar/**",
      "quasar.config.js.temp*",
    ],
  },
  js.configs.recommended,
  ...vue.configs["flat/recommended"],
  {
    languageOptions: {
      ecmaVersion: "latest",
      globals: {
        process: "readonly",
        Capacitor: "readonly",
        chrome: "readonly",
        document: "readonly",
        window: "readonly",
        console: "readonly"
      },
    },
  },
];
