import { defineConfig } from "eslint/config";
import eslint from "@eslint/js";
import prettier from "eslint-plugin-prettier/recommended";
import tsdoc from "eslint-plugin-tsdoc";
import tseslint from "typescript-eslint";

/*
// Old
export default defineConfig(
	// Enable all ESLint rules.
	eslint.configs.all,

	// Disable specific rules.
	{
		rules: {
			// Possible Problems
			// N/A

			// Suggestions
			complexity: "off",
			"id-length": "off",
			"max-depth": "off",
			"max-lines": "off",
			"max-lines-per-function": "off",
			"max-nested-callbacks": "off",
			"max-params": "off",
			"max-statements": "off",
			"no-bitwise": "off",
			"no-continue": "off",
			"no-div-regex": "off",
			"no-inline-comments": "off",
			"no-label-var": "off",
			"no-labels": "off",
			"no-magic-numbers": "off",
			"no-nested-ternary": "off",
			"no-plusplus": "off",
			"no-shadow": "off", // Must use `@typescript-eslint/no-shadow` instead.
			"no-ternary": "off",
			"no-undef-init": "off",
			"no-void": "off",
			"no-warning-comments": "off",
			"one-var": ["error", "never"]

			// Layout and Formatting
			// N/A
		}
	},

	// Enable type checking and related rules.
	...configs.strictTypeChecked,
	...configs.stylisticTypeChecked,
	{
		languageOptions: {
			parser,
			parserOptions: { ecmaVersion: "latest", project: true }
		},
		plugins: { "@typescript-eslint": plugin },
		rules: { "@typescript-eslint/no-shadow": "error" }
	},

	// Enable the TSDoc plugin.
	{ plugins: { tsdoc }, rules: { "tsdoc/syntax": "error" } },

	// Enable the Prettier plugin.
	prettier // Includes `eslint-config-prettier` and `eslint-plugin-prettier`.
);
*/

export default defineConfig(
	eslint.configs.all,
	tseslint.configs.all,
	{
		languageOptions: {
			parserOptions: {
				ecmaVersion: "latest",
				projectService: { allowDefaultProject: ["eslint.config.js"] }
			}
		}
	},
	{ plugins: { tsdoc }, rules: { "tsdoc/syntax": "error" } },
	prettier,

	// Disable or configure specific rules.
	{
		rules: {
			"@typescript-eslint/max-params": "off",
			"@typescript-eslint/naming-convention": [
				"error",
				{ format: ["strictCamelCase"], selector: "default" },
				{ format: ["strictCamelCase", "StrictPascalCase"], selector: "import" },
				{ format: ["strictCamelCase", "UPPER_CASE"], selector: "variable" },
				{ format: ["StrictPascalCase"], selector: "typeLike" },
				{ format: ["UPPER_CASE"], selector: "enumMember" }
			],
			"@typescript-eslint/no-magic-numbers": "off", // WebGL is basically all magic numbers...
			"@typescript-eslint/prefer-readonly-parameter-types": "off", // Many μGL functions modify DOM elements and/or WebGL contexts.
			"@typescript-eslint/strict-boolean-expressions": "off",
			"@typescript-eslint/switch-exhaustiveness-check": [
				"error",
				{ considerDefaultExhaustiveForUnions: true }
			],
			complexity: "off",
			"id-length": "off",
			"max-lines": "off",
			"max-lines-per-function": "off",
			"max-statements": "off",
			"no-bitwise": "off",
			"no-continue": "off",
			"no-inline-comments": "off",
			"no-nested-ternary": "off",
			"no-plusplus": "off",
			"no-ternary": "off",
			"no-void": "off",
			"one-var": ["error", "never"]
		}
	}
);
