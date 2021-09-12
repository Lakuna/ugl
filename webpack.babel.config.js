export default {
	mode: "production",
	entry: "./src/index.js",
	output: {
		library: {
			type: "module"
		},
		filename: "main.babel.js"
	},
	experiments: {
		outputModule: true
	},
	module: {
		rules: [
			{
				test: /.js/,
				loader: "babel-loader"
			}
		]
	}
};