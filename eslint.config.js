import eslint from "@eslint/js";
import prettier from "eslint-plugin-prettier/recommended";
import tsdoc from "eslint-plugin-tsdoc";
import tseslint from "typescript-eslint";

export default tseslint.config(
	// Enable all ESLint rules.
	eslint.configs.all,

	// Disable specific rules.
	{
		rules: {
			"capitalized-comments": "off",
			complexity: "off",
			"guard-for-in": "off",
			"id-denylist": "off",
			"id-length": "off",
			"id-match": "off",
			"max-classes-per-file": "off",
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
			"no-magic-numbers": "off", // WebGL
			"no-nested-ternary": "off",
			"no-plusplus": "off",
			"no-restricted-exports": "off",
			"no-restricted-globals": "off",
			"no-restricted-imports": "off",
			"no-restricted-properties": "off",
			"no-restricted-syntax": "off",
			"no-shadow": "off", // Must use `@typescript-eslint/no-shadow` instead.
			"no-ternary": "off",
			"no-undef-init": "off",
			"no-void": "off",
			"no-warning-comments": "off",
			"one-var": ["error", "never"]
		}
	},

	// Enable type checking and related rules.
	...tseslint.configs.strictTypeChecked,
	...tseslint.configs.stylisticTypeChecked,
	{
		languageOptions: {
			parserOptions: {
				project: true,
				tsconfigRootDir: "."
			}
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
