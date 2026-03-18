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
			// `arrow-body-style` is incompatible with `eslint-plugin-prettier`.
			"block-scoped-var": "error",
			// `camelcase` is superseded by `@typescript-eslint/naming-convention`.
			"capitalized-comments": "error",
			// `class-methods-use-this` is superseded by `@typescript-eslint/class-methods-use-this`.
			// `complexity`
			// `consistent-return` is superseded by TypeScript's `noImplicitReturns`. See `@typescript-eslint/consistent-return`.
			"consistent-this": "error",
			curly: "error",
			"default-case": "error",
			"default-case-last": "error",
			// `default-param-last` is superseded by `@typescript-eslint/default-param-last`.
			// `dot-notation` is superseded by `@typescript-eslint/dot-notation`.
			eqeqeq: "error",
			"func-name-matching": "error",
			"func-names": "error",
			"func-style": "error",
			// `grouped-accessor-pairs` is superseded by `perfectionist/sort-classes`.
			"guard-for-in": "error",
			// `id-denylist`
			// `id-length`
			// `id-match`
			// `init-declarations` is superseded by `@typescript-eslint/init-declarations`.
			"logical-assignment-operators": "error",
			// `max-classes-per-file`
			// `max-depth`
			// `max-lines`
			// `max-lines-per-function`
			// `max-nested-callbacks`
			// `max-params` is superseded by `@typescript-eslint/max-params`.
			// `max-statements`
			"new-cap": "error",
			"no-alert": "error",
			// `no-array-constructor` is superseded by `@typescript-eslint/no-array-constructor`.
			"no-await-in-loop": "error",
			// `no-bitwise`
			"no-caller": "error",
			"no-console": "error",
			// `no-continue`
			"no-constructor-return": "error",
			"no-div-regex": "error",
			"no-dupe-class-members": "off", // Recommended but automatically checked by the TypeScript compiler. See `@typescript-eslint/no-dupe-class-members`.
			"no-duplicate-imports": "error",
			"no-else-return": "error",
			// `no-empty-function` is superseded by `@typescript-eslint/no-empty-function`.
			"no-eq-null": "error",
			"no-eval": "error",
			"no-extend-native": "error",
			"no-extra-bind": "error",
			"no-extra-label": "error",
			"no-implicit-coercion": "error",
			"no-implicit-globals": "error",
			// `no-implied-eval` is superseded by `@typescript-eslint/no-implied-eval`.
			// `no-inline-comments`
			"no-inner-declarations": "error",
			// `no-invalid-this` is automatically checked by the TypeScript compiler. See `@typescript-eslint/no-invalid-this`.
			"no-iterator": "error",
			"no-label-var": "error",
			"no-labels": "error",
			"no-lone-blocks": "error",
			"no-lonely-if": "error",
			// `no-loop-func` is superseded by `@typescript-eslint/no-loop-func`.
			// `no-magic-numbers` is superseded by `@typescript-eslint/no-magic-numbers`.
			"no-multi-assign": "error",
			"no-multi-str": "error",
			"no-negated-condition": "error",
			// `no-nested-ternary`
			"no-new": "error",
			"no-new-func": "error",
			"no-new-wrappers": "error",
			"no-object-constructor": "error",
			"no-octal-escape": "error",
			"no-param-reassign": "error",
			// `no-plusplus`
			"no-promise-executor-return": "error",
			"no-proto": "error",
			"no-redeclare": "off", // Recommended but automatically checked by the TypeScript compiler. See `@typescript-eslint/no-redeclare`.
			// `no-restricted-exports`
			// `no-restricted-globals`
			// `no-restricted-imports` is superseded by `@typescript-eslint/no-restricted-imports`.
			// `no-restricted-properties`
			// `no-restricted-syntax`
			"no-return-assign": "error",
			"no-script-url": "error",
			"no-self-compare": "error",
			"no-sequences": "error",
			// `no-shadow` is superseded by `@typescript-eslint/no-shadow`.
			"no-template-curly-in-string": "error",
			// `no-ternary`
			// `no-throw-literal` is superseded by `@typescript-eslint/only-throw-error`.
			"no-undef-init": "error",
			"no-undefined": "error",
			// `no-underscore-dangle` is superseded by `@typescript-eslint/naming-convention`.
			"no-unmodified-loop-condition": "error",
			"no-unneeded-ternary": "error",
			"no-unreachable-loop": "error",
			"no-unused-expressions": "error",
			"no-unused-private-class-members": "off", // Recommended but superseded by `@typescript-eslint/no-unused-private-class-members`.
			"no-unused-vars": "off", // Recommended but superseded by `@typescript-eslint/no-unused-vars`.
			// `no-use-before-define` is superseded by `@typescript-eslint/no-use-before-define`.
			"no-useless-call": "error",
			"no-useless-computed-key": "error",
			"no-useless-concat": "error",
			// `no-useless-constructor` is superseded by `@typescript-eslint/no-useless-constructor`.
			"no-useless-rename": "error",
			"no-useless-return": "error",
			"no-var": "error",
			// `no-void`
			"no-warning-comments": "error",
			"object-shorthand": "error",
			"one-var": ["error", "never"],
			"operator-assignment": "error",
			// `prefer-arrow-callback` is incompatible with `eslint-plugin-prettier`.
			"prefer-const": "error",
			// `prefer-destructuring` is superseded by `@typescript-eslint/prefer-destructuring`.
			"prefer-exponentiation-operator": "error",
			"prefer-named-capture-group": "error",
			"prefer-numeric-literals": "error",
			"prefer-object-has-own": "error",
			"prefer-object-spread": "error",
			// `prefer-promise-reject-errors` is superseded by `@typescript-eslint/prefer-promise-reject-errors`.
			"prefer-regex-literals": "error",
			"prefer-rest-params": "error",
			"prefer-spread": "error",
			"prefer-template": "error",
			radix: "error",
			"require-atomic-updates": "error",
			// `require-await` is superseded by `@typescript-eslint/require-await`.
			"require-unicode-regexp": "error",
			// `sort-imports` is superseded by `perfectionist/sort-imports` and `perfectionist/sort-named-imports`.
			// `sort-keys` is superseded by `perfectionist/sort-objects`.
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
			"@typescript-eslint/adjacent-overload-signatures": "off", // Recommended but superseded by `perfectionist/sort-interfaces` and `perfectionist/sort-object-types`.
			"@typescript-eslint/class-methods-use-this": "error",
			// `@typescript-eslint/consistent-return` is superseded by TypeScript's `noImplicitReturns`.
			"@typescript-eslint/consistent-type-exports": "error",
			"@typescript-eslint/consistent-type-imports": "error",
			"@typescript-eslint/default-param-last": "error",
			"@typescript-eslint/explicit-function-return-type": "error",
			"@typescript-eslint/explicit-member-accessibility": "error",
			"@typescript-eslint/explicit-module-boundary-types": "error",
			"@typescript-eslint/init-declarations": "error",
			// `@typescript-eslint/max-params`
			// `@typescript-eslint/member-ordering` is superseded by `perfectionist/sort-classes`.
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
			// `@typescript-eslint/no-dupe-class-members` is automatically checked by the TypeScript compiler.
			"@typescript-eslint/no-import-type-side-effects": "error",
			// `@typescript-eslint/no-invalid-this` is automatically checked by the TypeScript compiler.
			"@typescript-eslint/no-loop-func": "error",
			// `@typescript-eslint/no-magic-numbers`
			// `@typescript-eslint/no-redeclare` is automatically checked by the TypeScript compiler.
			// `@typescript-eslint/no-restricted-imports`
			// `@typescript-eslint/no-restricted-types`
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
			// `@typescript-eslint/prefer-readonly-parameter-types`
			"@typescript-eslint/promise-function-async": "error",
			"@typescript-eslint/require-array-sort-compare": "error",
			// `@typescript-eslint/strict-boolean-expressions`
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
	perfectionist.configs["recommended-natural"],
	prettier
);
