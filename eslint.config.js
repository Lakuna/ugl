import { config, configs, parser, plugin } from "typescript-eslint";
import eslint from "@eslint/js";
import prettier from "eslint-plugin-prettier/recommended";
import tsdoc from "eslint-plugin-tsdoc";

export default config(
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
			parserOptions: {
				ecmaVersion: "latest",
				project: true,
				tsconfigRootDir: "."
			}
		},
		plugins: {
			"@typescript-eslint": plugin
		},
		rules: {
			"@typescript-eslint/no-shadow": "error"
		}
	},

	// Enable the TSDoc plugin.
	{
		plugins: {
			tsdoc
		},
		rules: {
			"tsdoc/syntax": "error"
		}
	},

	// Enable the Prettier plugin.
	prettier // Includes `eslint-config-prettier` and `eslint-plugin-prettier`.
);
