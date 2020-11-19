Umbra Builder
=============
Umbra Builder is a tool that can be used to make custom distributions of Umbra, so that you don't have to waste a bunch of project size on useless features.

The newest version can always be downloaded from the releases page on GitHub. (https://github.com/T3Lakuna/Umbra-Builder/releases/latest).

Usage
-----
Upon starting Umbra Builder, it will get the newest version of the Umbra script directly from the repository. You will be prompted to choose the version of Umbra you want to use.

- The versions will be listed on-screen in the format release-version (i.e. 1-production for the production version of Umbra v1.0).
- Most releases will have both a production and development version. Both operate the same, except that the development version includes extra logging utilities. Anything that can be done with the development version will work exactly the same in the production version, so it is recommended that you use a development version while developing your game, then switch to the equivalent production version (which is both smaller and faster) for release.
- Simply pressing enter will automatically choose the recommended version, which will typically be the production version of the newest release.

Umbra Builder will then search the selected file for tags, and prompt the user to select tags.

- The REQUIRED tag will always be included, regardless of user input.
- Including a tag will automatically also include any tags that it requires.
- A list of tags and their features can be found on the tags page.

After a version and tags are selected, Umbra Builder will compile your unique distribution to umbra.js in Umbra Builder's directory.
umbra.js is automatically uglified for maximum efficiency.
