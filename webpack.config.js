export default {
	mode: "production",
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