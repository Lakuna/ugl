Getting Started
===============

Umbra Builder
-------------
In order to get started with Umbra, download the Umbra Builder. Find information about downloading and using it on the Umbra Builder page.

Project Structure
-----------------
An Umbra project contains a minumum of three files, plus as many assets and extra scripts as you want to load.

The following file names can be changed to whatever you want, as long as you update index.html to point to the correct scripts.
Note that the JS13KGames specifications require the main file to be called index.html.

index.html
~~~~~~~~~~
The first necessary file is the entry point, index.html. All this file needs to contain is references to the scripts.

.. code-block:: html

	<script src="umbra.js"></script>
	<script src="index.js"></script>

umbra.js
~~~~~~~~
The second necessary file is Umbra itself. This file will be exported by the Umbra Builder, and is specific to your project.

index.js
~~~~~~~~
The final necessary file is index.js, which contains the code specific to your project.

Minimal Game
------------
The Umbra class represents the game itself. It is the only class that must be used to utilize the basic features of the Umbra framework.

.. code-block:: javascript

	let umbra;

	onload = () => {
		umbra = new Umbra(setup, load, "Example");
		umbra.start();
	}

	setup = () => {
		// Start code here.

		umbra.state = main;
	}

	load = () => {
		// Loading code here.
	}

	main = () => {
		// Game loop code here.
	}

In this example:

- Start code is code that will be run as soon as the framework is ready.
- Loading code is code that will be run each game loop while assets are loading.
- Game loop code is code that will be run as fast as the computer can handle it.

Note that the fps of the game determines only the speed that the screen is rendered, not the speed that game loops happen. For this reason, it is very dangerous to use the console within the game loop.
