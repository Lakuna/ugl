@echo off
rem Requires NPM packages: terser.
for %%f in (../js-max/*.js) do ( start "" /B terser "../js-max/"%%f -o "../js/"%%f )