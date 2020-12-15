rem Requires NPM packages: browserify, tinyify, uglify-es, and uglifyjs-folder.
START "Uglify-ES" /d ".." /b uglifyjs-folder "js-max" -o "js" -e -x ".js" -p "**/*.js,!builder/**"
START "Browserify" /d "../js-max/builder" /b browserify "index.js" -o "../../js/builder.js" -p "tinyify"