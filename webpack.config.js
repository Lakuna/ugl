export default {
	mode: "production",
	entry: "./src/index.js",
	output: {
		library: {
			type: "module"
		},
		filename: "main.js"
	},
	experiments: {
		outputModule: true
	}
};