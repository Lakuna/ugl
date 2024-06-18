import eslint from "@eslint/js";
import prettier from "eslint-plugin-prettier/recommended";
import tsdoc from "eslint-plugin-tsdoc";
import tseslint from "typescript-eslint";

export default tseslint.config(
	eslint.configs.recommended, // TODO: Should `recommended` be changed to `all`?

	// Enable type checking.
	...tseslint.configs.strictTypeChecked,
	...tseslint.configs.stylisticTypeChecked,
	{
		languageOptions: {
			parserOptions: {
				project: true,
				tsconfigRootDir: "."
			}
		}
	},

	// Enable TSDoc plugin.
	{
		plugins: {
			tsdoc
		},
		rules: {
			"tsdoc/syntax": "error"
		}
	},

	prettier // Includes `eslint-config-prettier` and `eslint-plugin-prettier`.
);
