export default [
	{
		mode: "production",
		entry: "./dist/index.js",
		output: {
			library: {
				type: "module"
			},
			filename: "main.js"
		},
		experiments: {
			outputModule: true
		}
	}
];