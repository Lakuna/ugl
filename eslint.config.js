import eslint from "@eslint/js";
import perfectionist from "eslint-plugin-perfectionist";
import prettier from "eslint-plugin-prettier/recommended";
import tsdoc from "eslint-plugin-tsdoc";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig(
	eslint.configs.recommended,
	{ languageOptions: { globals: globals.browser }, name: "Browser Globals" },
	{
		languageOptions: { parserOptions: { impliedStrict: true } },
		name: "Implied Strict"
	},
	{
		linterOptions: {
			reportUnusedDisableDirectives: "error",
			reportUnusedInlineConfigs: "error"
		},
		name: "Unused ESLint Directives"
	},
	{
		name: "Additional ESLint Rules",
		rules: {
			"accessor-pairs": "error",
			"array-callback-return": "error",
			"block-scoped-var": "error",
			"capitalized-comments": "error",
			"consistent-this": "error",
			curly: "error",
			"default-case": "error",
			"default-case-last": "error",
			eqeqeq: "error",
			"func-name-matching": "error",
			"func-names": "error",
			"func-style": "error",
			"guard-for-in": "error",
			"logical-assignment-operators": "error",
			"new-cap": "error",
			"no-alert": "error",
			"no-await-in-loop": "error",
			"no-caller": "error",
			"no-console": "error",
			"no-constructor-return": "error",
			"no-div-regex": "error",
			"no-dupe-class-members": "off", // Recommended but replaced by typescript-eslint extension.
			"no-duplicate-imports": "error",
			"no-else-return": "error",
			"no-eq-null": "error",
			"no-eval": "error",
			"no-extend-native": "error",
			"no-extra-bind": "error",
			"no-extra-label": "error",
			"no-implicit-coercion": "error",
			"no-implicit-globals": "error",
			"no-inner-declarations": "error",
			"no-iterator": "error",
			"no-label-var": "error",
			"no-labels": "error",
			"no-lone-blocks": "error",
			"no-lonely-if": "error",
			"no-multi-assign": "error",
			"no-multi-str": "error",
			"no-negated-condition": "error",
			"no-new": "error",
			"no-new-func": "error",
			"no-new-wrappers": "error",
			"no-object-constructor": "error",
			"no-octal-escape": "error",
			"no-param-reassign": "error",
			"no-promise-executor-return": "error",
			"no-proto": "error",
			"no-redeclare": "off", // Recommended but replaced by typescript-eslint extension.
			"no-return-assign": "error",
			"no-script-url": "error",
			"no-self-compare": "error",
			"no-sequences": "error",
			"no-template-curly-in-string": "error",
			"no-undef-init": "error",
			"no-undefined": "error",
			"no-unmodified-loop-condition": "error",
			"no-unneeded-ternary": "error",
			"no-unreachable-loop": "error",
			"no-unused-expressions": "error",
			"no-unused-private-class-members": "off", // Recommended but replaced by typescript-eslint extension.
			"no-unused-vars": "off", // Recommended but replaced by typescript-eslint extension.
			"no-useless-call": "error",
			"no-useless-computed-key": "error",
			"no-useless-concat": "error",
			"no-useless-rename": "error",
			"no-useless-return": "error",
			"no-var": "error",
			"no-warning-comments": "error",
			"object-shorthand": "error",
			"one-var": ["error", "never"],
			"operator-assignment": "error",
			"prefer-const": "error",
			"prefer-exponentiation-operator": "error",
			"prefer-named-capture-group": "error",
			"prefer-numeric-literals": "error",
			"prefer-object-has-own": "error",
			"prefer-object-spread": "error",
			"prefer-regex-literals": "error",
			"prefer-rest-params": "error",
			"prefer-spread": "error",
			"prefer-template": "error",
			radix: "error",
			"require-atomic-updates": "error",
			"require-unicode-regexp": "error",
			"sort-vars": "error",
			strict: "error",
			"symbol-description": "error",
			"unicode-bom": "error",
			"vars-on-top": "error",
			yoda: "error"
		}
	},
	tseslint.configs.strictTypeChecked,
	tseslint.configs.stylisticTypeChecked,
	{
		languageOptions: {
			parserOptions: {
				projectService: { allowDefaultProject: ["eslint.config.js"] }
			}
		},
		name: "Lint with Type Information"
	},
	{
		name: "Additional typescript-eslint Rules",
		rules: {
			"@typescript-eslint/adjacent-overload-signatures": "off", // Recommended but replaced by Perfectionist extension.
			"@typescript-eslint/class-methods-use-this": "error",
			"@typescript-eslint/consistent-type-exports": "error",
			"@typescript-eslint/consistent-type-imports": "error",
			"@typescript-eslint/default-param-last": "error",
			"@typescript-eslint/explicit-function-return-type": "error",
			"@typescript-eslint/explicit-member-accessibility": "error",
			"@typescript-eslint/explicit-module-boundary-types": "error",
			"@typescript-eslint/init-declarations": "error",
			"@typescript-eslint/method-signature-style": "error",
			"@typescript-eslint/naming-convention": [
				"error",
				{ format: ["strictCamelCase"], selector: "default" },
				{ format: ["StrictPascalCase"], selector: "typeLike" },
				{ format: ["strictCamelCase", "UPPER_CASE"], selector: "variableLike" },
				{ format: ["UPPER_CASE"], selector: "enumMember" },
				{
					format: ["strictCamelCase", "StrictPascalCase", "UPPER_CASE"],
					selector: "import"
				},
				{ format: [], selector: "objectLiteralProperty" }
			],
			"@typescript-eslint/no-import-type-side-effects": "error",
			"@typescript-eslint/no-loop-func": "error",
			"@typescript-eslint/no-shadow": "error",
			"@typescript-eslint/no-unnecessary-parameter-property-assignment":
				"error",
			"@typescript-eslint/no-unnecessary-qualifier": "error",
			"@typescript-eslint/no-unsafe-type-assertion": "error",
			"@typescript-eslint/no-unused-private-class-members": "error",
			"@typescript-eslint/no-use-before-define": "error",
			"@typescript-eslint/no-useless-empty-export": "error",
			"@typescript-eslint/parameter-properties": "error",
			"@typescript-eslint/prefer-destructuring": "error",
			"@typescript-eslint/prefer-enum-initializers": "error",
			"@typescript-eslint/prefer-readonly": "error",
			"@typescript-eslint/promise-function-async": "error",
			"@typescript-eslint/require-array-sort-compare": "error",
			"@typescript-eslint/strict-void-return": "error",
			"@typescript-eslint/switch-exhaustiveness-check": [
				"error",
				{ considerDefaultExhaustiveForUnions: true }
			]
		}
	},
	{
		name: "Use eslint-plugin-tsdoc",
		plugins: { tsdoc },
		rules: { "tsdoc/syntax": "error" }
	},
	perfectionist.configs["recommended-alphabetical"],
	prettier
);
