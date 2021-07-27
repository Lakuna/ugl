export default {
	mode: "production",
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