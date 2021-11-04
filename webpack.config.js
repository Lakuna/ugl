export default [
	// With Babel
	{
		mode: "production",
		entry: "./src/index.ts",
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
					test: /\.tsx?$/,
					exclude: /node_modules/,
					use: [
						{ loader: "babel-loader" },
						{ loader: "ts-loader" }
					]
				},
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: [
						{ loader: "source-map-loader" }
					],
					enforce: "pre"
				}
			]
		},
		resolve: {
			extensions: [
				".ts"
			]
		}
	},

	// Without Babel
	{
		mode: "production",
		entry: "./src/index.ts",
		output: {
			library: {
				type: "module"
			},
			filename: "main.js"
		},
		experiments: {
			outputModule: true
		},
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					exclude: /node_modules/,
					use: [
						{ loader: "ts-loader" }
					]
				},
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: [
						{ loader: "source-map-loader" }
					],
					enforce: "pre"
				}
			]
		},
		resolve: {
			extensions: [
				".ts"
			]
		}
	}
];