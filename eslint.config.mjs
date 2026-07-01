import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),

  // Component structural guardrails (see .cursor/rules/code-quality.mdc)
  {
    files: ["components/**/*.tsx", "app/**/*.tsx"],
    ignores: ["app/api/**"],
    rules: {
      // Flag files approaching God Component territory
      "max-lines": [
        "warn",
        { max: 150, skipComments: true, skipBlankLines: true },
      ],
      // Flag useEffect + fetch together — wrong data-fetching pattern in UI files
      "no-restricted-syntax": [
        "warn",
        {
          selector:
            "CallExpression[callee.name='useEffect'] CallExpression[callee.name='fetch']",
          message:
            "Don't fetch inside useEffect. Use a server component for server data, or a custom hook in lib/hooks/ for client data.",
        },
      ],
    },
  },

  // Service and utility layer purity
  {
    files: ["lib/services/**/*.ts", "lib/utils/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "react",
              message:
                "lib/services and lib/utils are plain TypeScript. No React imports.",
            },
            {
              name: "react-dom",
              message:
                "lib/services and lib/utils are plain TypeScript. No React imports.",
            },
          ],
          patterns: [
            {
              group: ["react/*", "react-dom/*"],
              message:
                "lib/services and lib/utils are plain TypeScript. No React imports.",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
