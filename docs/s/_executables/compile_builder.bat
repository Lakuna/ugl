@echo off
rem Requires NPM packages: browserify, tinyify.
start "" /D "../js-max/builder" /W /B browserify index.js -o "../builder.js" -p "tinyify"