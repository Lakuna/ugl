import { defineConfig } from "eslint/config";
import eslint from "@eslint/js";
import prettier from "eslint-plugin-prettier/recommended";
import tsdoc from "eslint-plugin-tsdoc";
import tseslint from "typescript-eslint";

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
				{ format: ["UPPER_CASE"], selector: "enumMember" },
				{ selector: ["objectLiteralMethod", "objectLiteralProperty"] }
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
