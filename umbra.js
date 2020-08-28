/*
 * Documentation Links
 * JSDoc:				https://jsdoc.app
 * Sphinx:				https://www.sphinx-doc.org/
 * sphinx-js:			https://github.com/mozilla/sphinx-js
 * Read the Docs:		https://readthedocs.org/
 * reStructuredText:	https://docutils.sourceforge.io/rst.html
 */

/**
 * @author Travis Martin
 * @copyright Travis Martin 2020
 * @file All of the code for the Umbra Framework.
 * @license APGL-3.0-or-later
 */

// Umbra tag definitions. Used by the Umbra Builder to create customized distributions.
// UTAGDEF DESC REQUIRED Minimal Umbra framework functionality.
// UTAGDEF SIZE REQUIRED 724b

// UTAGDEF DESC GRAPHICS Basic features that allow interaction with the screen.
// UTAGDEF SIZE GRAPHICS 821b

// UTAGDEF DESC ADVGRAPH Advanced features that allow interaction with the screen.
// UTAGDEF REQU ADVGRAPH GRAPHICS
// UTAGDEF SIZE ADVGRAPH 117b

// UTAGDEF DESC POINTER Unified mouse and touchscreen input.
// UTAGDEF REQU POINTER GRAPHICS
// UTAGDEF SIZE POINTER 279b

// UTAGDEF DESC KEYBOARD Keyboard input from the user.
// UTAGDEF SIZE KEYBOARD 109b

// UTAGDEF DESC ASSETS Import JSON objects from files.
// UTAGDEF SIZE ASSETS 250b

// UTAGDEF DESC RECT Rectangle preset object type.
// UTAGDEF REQU RECT GRAPHICS
// UTAGDEF SIZE RECT 41b

// UTAGDEF DESC CIRCLE Circle preset object type.
// UTAGDEF REQU CIRCLE GRAPHICS
// UTAGDEF SIZE CIRCLE 64b

// UTAGDEF DESC LINE Line preset object type.
// UTAGDEF REQU LINE GRAPHICS
// UTAGDEF SIZE LINE 55b

// UTAGDEF DESC TEXT Import and use fonts.
// UTAGDEF REQU TEXT GRAPHICS
// UTAGDEF REQU TEXT ASSETS
// UTAGDEF SIZE TEXT 217b

// UTAGDEF DESC IMAGE Import and display images from files.
// UTAGDEF REQU IMAGE GRAPHICS
// UTAGDEF REQU IMAGE ASSETS
// UTAGDEF SIZE IMAGE 347b

// UTAGDEF DESC AUDIO Import and play audio from files.
// UTAGDEF REQU AUDIO ASSETS
// UTAGDEF SIZE AUDIO 376b

// UTAGDEF DESC ADVAUDIO Advanced audio transformations.
// UTAGDEF REQU ADVAUDIO AUDIO
// UTAGDEF SIZE ADVAUDIO 203b

// Note: Package sizes are approximate.

// Code start.

// UTAGSET START GRAPHICS

/**
 * @class
 * @classdesc Contains two numerical values which represent a coordinate or range.
 * @namespace
 * @readonly
 * @since 1.0
 */
class Vector2 {
	/**
	 * @constructs Vector2
	 * @description Creates a Vector2.
	 * @param {!number} [x = 0] - The lowest value in a range or the horizontal component of a coordinate.
	 * @param {!number} [y = 0] - The highest value in a range or the vertical component of a coordinate.
	 * @since 1.0
	 */
	constructor(
			_x = 0,
			_y = 0
	) {
		if (typeof _x != "number") { throw new Error("_x must be a number."); }
		if (typeof _y != "number") { throw new Error("_y must be a number."); }

		const _translate = (offset) => {
			if (!offset instanceof Vector2) { throw new Error("offset must be a Vector2."); }

			this.x += offset.x;
			this.y += offset.y;
		}

		Object.defineProperties(this, {
			/**
			 * @default 0
			 * @description The lowest value in a range or the horizontal component of a coordinate.
			 * @member {!number} x
			 * @memberof Vector2
			 * @since 1.0
			 */
			x: {
				get: () => _x,
				set: (value) => {
					if (typeof value != "number") { throw new Error("value must be a number."); }
					_x = value;
				}
			},

			/**
			 * @default 0
			 * @description The highest value in a range or the vertical component of a coordinate.
			 * @member {!number} y
			 * @memberof Vector2
			 * @since 1.0
			 */
			y: {
				get: () => _y,
				set: (value) => {
					if (typeof value != "number") { throw new Error("value must be a number."); }
					_y = value;
				}
			},

			/**
			 * @description The difference between the minimum and maximum values in a range.
			 * @member {!number} range
			 * @memberof Vector2
			 * @readonly
			 * @since 1.0
			 */
			range: { get: () => Math.abs(this.x - this.y) },

			/**
			 * @description Apply a translation effect.
			 * @function
			 * @memberof Vector2
			 * @param {Vector2} offset - The values by which this point should be translated.
			 * @readonly
			 * @since 1.0
			 */
			translate: { get: () => _translate }
		});
	}
}

/**
 * @class
 * @classdesc Contains two Vector2s which represent an area.
 * @namespace
 * @readonly
 * @since 1.0
 */
class Bounds {
	/**
	 * @constructs Bounds
	 * @description Create a Bounds.
	 * @param {!Vector2} [min = new Vector2()] - The upper-left corner of a boundary.
	 * @param {!Vector2} [max = new Vector2()] - The lower-right corner of a boundary.
	 * @since 1.0
	 */
	constructor(
			_min = new Vector2(), // First point.
			_max = new Vector2() // Second point.
	) {
		if (!_min instanceof Vector2) { throw new Error("_min must be a Vector2."); }
		if (!_max instanceof Vector2) { throw new Error("_max must be a Vector2."); }

		// Check if the boundary contains a point.
		const _contains = (point) => {
			if (!point instanceof Vector2) { throw new Error("point must be a Vector2."); }

			return point.x >= this.min.x && point.x <= this.max.x && point.y >= this.min.y && point.y <= this.max.y;
		}

		// Check if the boundary shares any points with another boundary.
		const _intersects = (boundary) => {
			if (!boundary instanceof Bounds) { throw new Error("boundary must be a Bounds."); }

			return boundary.min.x <= this.max.x && boundary.max.x >= this.min.x && boundary.min.y <= this.max.y && boundary.max.y >= this.min.y;
		}

		// Move all corners of the bounds.
		const _translate = (offset) => {
			if (!offset instanceof Vector2) { throw new Error("offset must be a Vector2."); }

			this.min.translate(offset);
			this.max.translate(offset);
		}

		Object.defineProperties(this, {
			/**
			 * @default new Vector2();
			 * @description The upper-left corner of the boundary.
			 * @member {!Vector2} min
			 * @memberof Bounds
			 * @since 1.0
			 */
			min: {
				get: () => _min,
				set: (value) => {
					if (!value instanceof Vector2) { throw new Error("value must be a Vector2."); }

					_min = value;
				}
			},

			/**
			 * @default new Vector2();
			 * @description The lower-right corner of the boundary.
			 * @member {!Vector2} max
			 * @memberof Bounds
			 * @since 1.0
			 */
			max: {
				get: () => _max,
				set: (value) => {
					if (!value instanceof Vector2) { throw new Error("value must be a Vector2."); }

					_max = value;
				}
			},

			/**
			 * @description The difference between the upper and lower horizontal coordinates.
			 * @member {!number} width
			 * @memberof Bounds
			 * @readonly
			 * @since 1.0
			 */
			width: {
				get: () => this.max.x - this.min.x,
				set: (value) => {
					if (typeof value != "number") { throw new Error("value must be a number."); }

					this.max.x = this.min.x + value;
				}
			},

			/**
			 * @description The difference between the upper and lower vertical coordinates.
			 * @member {!number} height
			 * @memberof Bounds
			 * @readonly
			 * @since 1.0
			 */
			height: {
				get: () => this.max.y - this.min.y,
				set: (value) => {
					if (typeof value != "number") { throw new Error("value must be a number."); }

					this.max.y = this.min.y + value;
				}
			},

			/**
			 * @description Check whether a point falls within the boundary.
			 * @function
			 * @memberof Bounds
			 * @param {!Vector2} [point] - The point to check.
			 * @readonly
			 * @returns {!boolean} Whether the boundary contains the point.
			 * @since 1.0
			 */
			contains: { get: () => _contains },

			/**
			 * @description Check whether two boundaries touch each other.
			 * @function
			 * @memberof Bounds
			 * @param {!Bounds} boundary - The boundary to check.
			 * @readonly
			 * @returns {!boolean} Whether the boundaries share any points.
			 * @since 1.0
			 */
			intersects: { get: () => _intersects },

			/**
			 * @description Translate an entire boundary.
			 * @function
			 * @memberof Bounds
			 * @param {!Vector2} offset - The values to translate the boundary by.
			 * @readonly
			 * @see Vector2.translate
			 * @since 1.0
			 */
			translate: { get: () => _translate }
		});
	}
}

// UTAGSET END GRAPHICS
// UTAGSET START REQUIRED

/**
 * @class
 * @classdesc Represents an instance of a game.
 * @namespace
 * @readonly
 * @since 1.0
 */
class Umbra {
	/**
	 * @constructs Umbra
	 * @description Create an Umbra instance.
	 * @param {!function} setup - The function to run when the framework is ready to start.
	 * @param {!function} loadState - The game state to use while loading assets.
	 * @param {!string} title - The tab title.
	 * @param {!string[]} assetPaths - List of paths to asset files to preload.
	 * @param {!number} fps - The target frames per second of the game loop.
	 * @param {!Vector2} size - The size of the canvas.
	 * @since 1.0
	 */
	constructor(
			_setup, // The function to run when the framework is ready.
			_loadState, // The function to use as the state while loading.
			_title = "Umbra", // The title of the window.
			_assetPaths = [], // List of paths to assets that should be loaded.
			_fps = 60, // Target frames per second of the game loop.
			_size = { x: innerWidth, y: innerHeight } // The size of the canvas. Not a Vector2 so that Vector2 isn't REQUIRED - but can be a Vector2.
	) {
		if (typeof _setup != "function" && _setup != undefined) { throw new Error("_setup must be a function."); }
		if (typeof _loadState != "function" && _loadState != undefined) { throw new Error("_loadState must be a function."); }
		if (typeof _title != "string") { throw new Error("_title must be a string."); }
		if (!Array.isArray(_assetPaths)) { throw new Error("_assetPaths must be an array."); }
		_assetPaths.forEach(value => { if (typeof value != "string") { throw new Error("_assetPaths must contain only strings."); } });
		if (typeof _fps != "number") { throw new Error("_fps must be a number."); }
		if (typeof _size != "object") { throw new Error("_size must be an object."); }
		if (typeof _size.x == "undefined") { throw new Error("_size must have an x value."); }
		if (typeof _size.y == "undefined") { throw new Error("_size must have a y value."); }

		// Define global instance.
		if (Umbra.instance) { throw new Error("There is already an instance of Umbra running."); }
		Umbra.instance = this;

		// Game state properties.
		let _state; // The main function to run in the game loop.
		let _isPaused = false; // Whether the game loop should run the main function.

		// Frame time properties.
		let _lastFrameTime = Date.now(); // Time that the last frame happened.
		let _frameDuration = _fps / 1000; // Target duration of one frame.
		let _lag = 0; // Lag time to be made up for with updates.

		// Game loop properties.
		let _updates = []; // Updates to be run in the game loop.

		// The main game loop.
		const _gameLoop = () => {
			requestAnimationFrame(_gameLoop, this.canvas);

			// Frame timing.
			const now = Date.now();
			let elapsed = now - _lastFrameTime;
			if (elapsed > 1000) { elapsed = _frameDuration; }
			_lastFrameTime = now;
			_lag += elapsed;

			// Update to make up for lag time.
			while (_lag > _frameDuration) {
				this.updates.forEach((update) => update());

				if (!this.paused && this.state) { this.state(); }

				_lag -= _frameDuration;
			}

			// UTAGSET END REQUIRED
			// UTAGSET START GRAPHICS

			// Render the viewport of the camera.
			this.camera.render();

			// UTAGSET END GRAPHICS
			// UTAGSET START REQUIRED

		}

		// Setup document.
		document.title = _title;
		document.body.style = "margin:0;";

		// UTAGSET END REQUIRED
		// UTAGSET START GRAPHICS

		// Canvas setup.
		const _canvas = document.createElement("canvas"); // The canvas on which the game is rendered.
		const _context = _canvas.getContext('2d'); // The context of the canvas on which the game is rendered.
		_canvas.style = `background-color:#000;touch-action:none;`;
		_canvas.width = _size.x;
		_canvas.height = _size.y;
		document.body.appendChild(_canvas);
		let _scene = new UObject(); // The scene to render on the canvas.
		let _camera; // The main camera from which to render the canvas. Defined after canvas is made public.

		// UTAGSET END GRAPHICS
		// UTAGSET START AUDIO

		const _actx = new AudioContext();
		if (_actx.state == "suspended") {
			// Create a button to ask the user to enable audio.
			const _button = document.createElement("button");
			_button.style = "position:fixed;top:0;left:0;width:10%;height:10%;";
			_button.innerHTML = "Click to enable audio.";
			_button.onclick = () => _actx.resume().then(() => document.body.removeChild(_button));
			document.body.appendChild(_button);
		}

		// UTAGSET END AUDIO
		// UTAGSET START POINTER

		// Unified mouse and touchscreen input.
		let _pointer; // The main pointer.
		let _interactableObjects = []; // List of all objects that can be interacted with.

		// UTAGSET END POINTER
		// UTAGSET START ASSETS

		// Loading assets from files.
		const _assets = { }; // Object with references to all loaded assets.

		// UTAGSET END ASSETS
		// UTAGSET START REQUIRED

		// Start the framework.
		const _start = () => { 

			// UTAGSET END REQUIRED
			// UTAGSET START ASSETS

			// Load assets.
			const _loadAssets = () => {
				this.state = _loadState;
				let loaded = 0; // Number of assets that have been loaded.

				// Run when an asset is loaded.
				const _onLoad = () => {
					loaded++;

					if (loaded >= _assetPaths.length) {
						this.state = undefined;
						if (_setup) { _setup(); }
					}
				}

				// Define file types.
				const jsonExtensions = ["json"]; // JSON file extensions.
				const fontExtensions = ["ttf", "otf", "ttc", "woff"]; // Font file extensions.
				const imageExtensions = ["png", "jpg", "gif", "webp"]; // Image file extensions.
				const audioExtensions = ["mp3", "ogg", "wav", "webm"]; // Audio file extensions.

				// Load assets.
				for (let i = 0; i < _assetPaths.length; i++) {
					const source = _assetPaths[i];
					const extension = source.split('.').pop();

					if (jsonExtensions.indexOf(extension) > -1) {
						// Load JSON objects.
						const req = new XMLHttpRequest();
						req.open("GET", source);
						req.addEventListener("readystatechange", () => {
							if (req.status != 200 || req.readyState != 4) { return; }
							this.assets[source] = JSON.parse(req.responseText);
							_onLoad();
						});
						req.send();
					}

					// UTAGSET END ASSETS
					// UTAGSET START TEXT

					else if (fontExtensions.indexOf(extension) > -1) {
						// Load fonts.
						const fontFamily = source.split("/").pop().split(".")[0];
						const style = document.createElement("style");
						style.innerHTML = `@font-face{font-family:${fontFamily};src:url(${source});}`;
						document.head.appendChild(style);
						_onLoad();
					}

					// UTAGSET END TEXT
					// UTAGSET START IMAGE

					else if (imageExtensions.indexOf(extension) > -1) {
						// Load images.
						const image = new Image();
						image.addEventListener("load", () => {
							this.assets[source] = image;
							_onLoad();
						});
						image.src = source; // Start loading the image.
					}

					// UTAGSET END IMAGE
					// UTAGSET START AUDIO

					else if (audioExtensions.indexOf(extension) > -1) {
						const audio = new USound(source, _onLoad);
						this.assets[source] = audio;
					}

					// UTAGSET END AUDIO
					// UTAGSET START ASSETS

					else { throw new Error("Tried to load an asset with an unknown extension."); }
				}
			}

			// Start loading assets.
			if (_assetPaths.length > 0) { _loadAssets(); } else {

				// UTAGSET END ASSETS
				// UTAGSET START REQUIRED

				// Run the startup function.
				if (_setup) { _setup(); }

				// UTAGSET END REQUIRED
				// UTAGSET START ASSETS
			}

			// UTAGSET END ASSETS
			// UTAGSET START REQUIRED

			// Start the game loop.
			_gameLoop();
		}

		Object.defineProperties(this, {
			/**
			 * @description The main function run in the game loop.
			 * @member {!function} state
			 * @memberof Umbra
			 * @since 1.0
			 */
			state: {
				get: () => _state,
				set: (value) => {
					if (typeof value != "function" && value != undefined) { throw new Error("value must be a function."); }

					_state = value;
				}
			},

			/**
			 * @default false
			 * @description Whether the state should be run in the game loop.
			 * @member {!boolean} isPaused
			 * @memberof Umbra
			 * @since 1.0
			 */
			isPaused: {
				get: () => _isPaused,
				set: (value) => {
					if (typeof value != "boolean") { throw new Error("value must be a boolean."); }

					_isPaused = value;
				}
			},

			/**
			 * @default []
			 * @description A list of functions to run in the game loop even while paused.
			 * @member {!function[]} updates
			 * @memberof Umbra
			 * @since 1.0
			 */
			updates: { get: () => _updates },

			// UTAGSET END REQUIRED
			// UTAGSET START GRAPHICS

			/**
			 * @default document.createElement("canvas")
			 * @description The canvas that the game is drawn on.
			 * @member {!HTMLCanvasElement} canvas
			 * @memberof Umbra
			 * @readonly
			 * @since 1.0
			 */
			canvas: { get: () => _canvas },

			/**
			 * @default this.canvas.getContext("2d")
			 * @description The 2D context that the game is drawn on.
			 * @member {!CanvasRenderingContext2D} context
			 * @memberof Umbra
			 * @readonly
			 * @since 1.0
			 */
			context: { get: () => _context },

			/**
			 * @default new UObject()
			 * @description The currently-loaded scene.
			 * @member {!UObject} scene
			 * @memberof Umbra
			 * @since 1.0
			 */
			scene: {
				get: () => _scene,
				set: (value) => {
					if (!value instanceof UObject) { throw new Error("value must be a UObject."); }

					_scene = value;
				}
			},

			/**
			 * @default new UCamera()
			 * @description The main camera to render the scene from.
			 * @member {!UCamera} camera
			 * @memberof Umbra
			 * @since 1.0
			 */
			camera: {
				get: () => _camera,
				set: (value) => {
					if (!value instanceof UCamera) { throw new Error("value must be a UCamera."); }

					_camera = value;
				}
			},

			// UTAGSET END GRAPHICS
			// UTAGSET START AUDIO

			/**
			 * @default new AudioContext()
			 * @description The context from which all game audio is played.
			 * @member {!AudioContext} actx
			 * @memberof Umbra
			 * @readonly
			 * @since 1.0
			 */
			actx: { get: () => _actx },

			// UTAGSET END AUDIO
			// UTAGSET START POINTER

			/**
			 * @default new UPointer()
			 * @description The main integrated touch/mouse pointer for the game.
			 * @member {!UPointer} pointer
			 * @memberof Umbra
			 * @readonly
			 * @since 1.0
			 */
			pointer: { get: () => _pointer },

			/**
			 * @default []
			 * @description A list of objects which can be clicked.
			 * @member {!UObject[]} interactableObjects
			 * @memberof Umbra
			 * @since 1.0
			 */
			interactableObjects: { get: () => _interactableObjects },

			// UTAGSET END POINTER
			// UTAGSET START ASSETS

			/**
			 * @default {}
			 * @description An object which holds all of the preloaded assets.
			 * @member {!object} assets
			 * @memberof Umbra
			 * @readonly
			 * @since 1.0
			 */
			assets: { get: () => _assets },

			// UTAGSET END ASSETS
			// UTAGSET START REQUIRED

			/**
			 * @description The method which must be called to start the game.
			 * @function
			 * @memberof Umbra
			 * @readonly
			 * @since 1.0
			 */
			start: { get: () => _start }
		});

		// UTAGSET END REQUIRED
		// UTAGSET START GRAPHICS

		// Define camera after canvas is made public.
		_camera = new UCamera();

		// UTAGSET END GRAPHICS
		// UTAGSET START POINTER

		// Define pointer after canvas is made public.
		_pointer = new UPointer();

		// UTAGSET END POINTER
		// UTAGSET START REQUIRED
	}
}

// UTAGSET END REQUIRED
// UTAGSET START GRAPHICS

/**
 * @class
 * @classdesc A viewport to render the game from.
 * @namespace
 * @readonly
 * @since 1.0
 */
class UCamera {
	/**
	 * @constructs UCamera
	 * @description Create a camera.
	 * @param {!Bounds} bounds - Initial size of the camera's viewport.
	 * @since 1.0
	 */
	constructor(
			_bounds = new Bounds(new Vector2(), new Vector2(Umbra.instance.canvas.width, Umbra.instance.canvas.height)) // The default boundaries of the camera.
	) {
		if (!_bounds instanceof Bounds) { throw new Error("_bounds must be a Bounds."); }

		// Convert a screen point to a global point.
		const _sPToG = (point) => {
			if (!point instanceof Vector2) { throw new Error("point must be a Vector2."); }

			const offset = this.bounds.min;

			return new Vector2(
					(point.x / this.scale.x) + offset.x,
					(point.y / this.scale.y) + offset.y
			);
		}

		// Convert a global point to a screen point.
		const _gPToS = (point) => {
			if (!point instanceof Vector2) { throw new Error("point must be a Vector2."); }

			const offset = this.bounds.min;

			return new Vector2(
					(point.x - offset.x) * this.scale.x,
					(point.y - offset.y) * this.scale.y
			);
		}

		// Convert a screen bounds to a global bounds.
		const _sBToG = (bounds) => {
			if (!bounds instanceof Bounds) { throw new Error("bounds must be a Bounds."); }

			return new Bounds(this.sPToG(bounds.min), this.sPToG(bounds.max));
		}

		// Convert a global bounds to a screen bounds.
		const _gBToS = (bounds) => {
			if (!bounds instanceof Bounds) { throw new Error("bounds must be a Bounds."); }

			return new Bounds(this.gPToS(bounds.min), this.gPToS(bounds.max));
		}

		// Render all UObjects within the bounds.
		const _render = () => {
			const canvas = Umbra.instance.canvas;
			Umbra.instance.context.clearRect(0, 0, canvas.width, canvas.height);

			Umbra.instance.scene.display();
		}

		Object.defineProperties(this, {
			/**
			 * @default new Bounds(new Vector2(), new Vector2(Umbra.instance.canvas.width, Umbra.instance.canvas.height)
			 * @description The viewport boundary.
			 * @member {!Bounds} bounds
			 * @memberof UCamera
			 * @since 1.0
			 */
			bounds: {
				get: () => _bounds,
				set: (value) => {
					if (!value instanceof Bounds) { throw new Error("value must be a Bounds."); }

					_bounds = value;
				}
			},

			/**
			 * @description The scale at which objects are rendered due to the size of the viewport compared to the canvas.
			 * @member {!Vector2} scale
			 * @memberof UCamera
			 * @readonly
			 * @since 1.0
			 */
			scale: { get: () => new Vector2(Umbra.instance.canvas.width / this.bounds.width, Umbra.instance.canvas.height / this.bounds.height) },

			/**
			 * @description Convert a screen point to a global point.
			 * @function
			 * @memberof UCamera
			 * @param {!Vector2} point - The screen point to convert.
			 * @readonly
			 * @returns {!Vector2} The global point.
			 * @since 1.0
			 */
			sPToG: { get: () => _sPToG },

			/**
			 * @description Convert a global point to a screen point.
			 * @function
			 * @memberof UCamera
			 * @param {!Vector2} point - The global point to convert.
			 * @readonly
			 * @returns {!Vector2} The screen point.
			 * @since 1.0
			 */
			gPToS: { get: () => _gPToS },

			/**
			 * @description Convert a screen boundary to a global boundary.
			 * @function
			 * @memberof UCamera
			 * @param {!Bounds} bounds - The screen boundary to convert.
			 * @readonly
			 * @returns {!Bounds} The global bounds.
			 * @since 1.0
			 */
			sBToG: { get: () => _sBToG },

			/**
			 * @description Convert a global boundary to a screen boundary.
			 * @function
			 * @memberof UCamera
			 * @param {!Bounds} bounds - The global boundary to convert.
			 * @readonly
			 * @returns {!Bounds} The screen bounds.
			 * @since 1.0
			 */
			gBToS: { get: () => _gBToS },

			/**
			 * @description Render all objects in the scene within the viewport onto the canvas.
			 * @function
			 * @memberof UCamera
			 * @readonly
			 * @see UObject.display
			 * @since 1.0
			 */
			render: { get: () => _render }
		});
	}
}

/**
 * @class
 * @classdesc A shadow that follows an object.
 * @namespace
 * @readonly
 * @since 1.0
 */
class UShadow {
	/**
	 * @constructs UShadow
	 * @description Create a shadow for an object.
	 * @param {!string} [color = "rgba(100, 100, 100, 0.5)"] - Shadow color.
	 * @param {!Vector2} [offset = new Vector2(3, 3)] - Offset of the shadow from its caster.
	 * @param {!number} [blur = 3] - How blurred the shadow is.
	 * @since 1.0
	 */
	constructor(
			_color = "rgba(100, 100, 100, 0.5)", // Color of the shadow.
			_offset = new Vector2(3, 3), // Offset of the shadow from the caster.
			_blur = 3 // Blur value.
	) {
		if (typeof _color != "string") { throw new Error("_color must be a string."); }
		if (!_offset instanceof Vector2) { throw new Error("_offset must be a Vector2."); }
		if (typeof _blur != "number") { throw new Error("_blur must be a number."); }

		Object.defineProperties(this, {
			/**
			 * @default "rgba(100, 100, 100, 0.5)"
			 * @description The color of the shadow.
			 * @member {!string} color
			 * @memberof UShadow
			 * @since 1.0
			 */
			color: {
				get: () => _color,
				set: (value) => {
					if (typeof value != "string") { throw new Error("value must be a string."); }

					_color = value;
				}
			},

			/**
			 * @default new Vector2(3, 3)
			 * @description The shadow's offset from the caster object.
			 * @member {!Vector2} offset
			 * @memberof UShadow
			 * @since 1.0
			 */
			offset: {
				get: () => _offset,
				set: (value) => {
					if (!value instanceof Vector2) { throw new Error("value must be a Vector2."); }

					_offset = value;
				}
			},

			/**
			 * @default 3
			 * @description The amount of blur to apply to the shadow.
			 * @member {!number} blur
			 * @memberof UShadow
			 * @since 1.0
			 */
			blur: {
				get: () => _blur,
				set: (value) => {
					if (typeof value != "number") { throw new Error("value must be a number."); }

					_blur = value;
				}
			}
		});
	}
}

/**
 * @class
 * @classdesc An object in a game scene.
 * @namespace
 * @readonly
 * @since 1.0
 */
class UObject {
	/**
	 * @constructs UObject
	 * @description Create a new object.
	 * @param {!Bounds} [bounds = new Bounds()] - The inital size and position of the object.
	 * @param {UObject} parent - The initial parent object of the object.
	 * @since 1.0
	 */
	constructor(
			_bounds = new Bounds(), // Min and max coordinates of object.
			_parent = undefined // Parent object.
	) {
		if (!_bounds instanceof Bounds) { throw new Error("_bounds must be a Bounds."); }
		if (!_parent instanceof UObject && _parent != undefined) { throw new Error("_parent must be a UObject."); }

		// Rendering properties.
		let _isActive = true; // Whether the object should be rendered.
		let _layer = 0; // The z-layer of the object. Higher values are displayed over lower ones.
		let _doClip = false; // Whether to use this object to clip the context.
		let _fillColor = "white"; // Color to fill the object.
		let _lineColor = "white"; // Color of the object's outline.
		let _lineWidth = 1; // Width of the object's outline.

		// Move object.
		const _translate = (offset) => {
			if (!offset instanceof Vector2) { throw new Error("offset must be a Vector2."); }

			this.bounds.translate(offset);

			// Reposition children and resize childbox.
			_childBox = this.bounds;
			this.children.forEach((child) => {
				child.translate(offset);
				_childBox.min.x = Math.min(_childBox.min.x, child.childBox.min.x);
				_childBox.min.y = Math.min(_childBox.min.y, child.childBox.min.y);
				_childBox.max.x = Math.max(_childBox.max.x, child.childBox.max.x);
				_childBox.max.y = Math.max(_childBox.max.y, child.childBox.max.y);
			});
		}

		// Parent-child hierarchy properties.
		let _children = []; // List of children.
		let _childBox = _bounds; // Bounds of this object and its children.
		if (_parent) { _parent.children.push(this); } // Add to parent's children array.

		// Display the sprite on the canvas.
		const _display = () => {
			// Shorten variable names to save characters.
			const cam = Umbra.instance.camera;
			const ctx = Umbra.instance.context;
			const d = Umbra.instance.camera.gBToS(this.bounds);

			// Check if object is visible.
			if (!(this.isActive && new Bounds(new Vector2(), new Vector2(ctx.canvas.width, ctx.canvas.height)).intersects(this.childBox))) { return; }

			// Save context so that it can be returned to - to have different settings for each object.
			ctx.save();

			// UTAGSET END GRAPHICS
			// UTAGSET START ADVGRAPH

			// Set opacity.
			ctx.globalAlpha = this.alpha;

			// Set rotation.
			ctx.rotate(this.rotation);

			// Set scale.
			ctx.scale(this.scale.x, this.scale.y);

			// Setup shadow.
			if (this.shadow) {
				ctx.shadowColor = this.shadow.color;
				ctx.shadowOffsetX = this.shadow.offset.x;
				ctx.shadowOffsetY = this.shadow.offset.y;
				ctx.shadowBlur = this.shadow.blur;
			}

			// Setup advanced rendering options.
			if (this.compositeOperation) { ctx.globalCompositeOperation = this.compositeOperation; }

			// UTAGSET END ADVGRAPH
			// UTAGSET START GRAPHICS

			// Color object.
			ctx.strokeStyle = this.lineColor;
			ctx.lineWidth = this.lineWidth;
			ctx.fillStyle = this.fillColor;

			// Draw the object.
			ctx.beginPath();
			if (this.render) { this.render(ctx); }
			if (this.doClip) { ctx.clip(); } else {
				if (this.lineColor != "none") { ctx.stroke(); }
				if (this.fillColor != "none") { ctx.fill(); }
			}
			ctx.stroke();

			// Draw children.
			this.children.forEach((child) => child.display());

			// Restore context state after children are drawn so that traits are inherited.
			ctx.restore();
		}
		let _render; // Function to use when rendering the object.

		// UTAGSET END GRAPHICS
		// UTAGSET START ADVGRAPH

		// Advanced rendering properties.
		let _scale = new Vector2(1, 1); // Width/height multiplier.
		let _shadow; // Shadow cast by the object.
		let _compositeOperation; // Global composite operation used when rendering this object.
		let _alpha = 1; // Opacity.

		// UTAGSET END ADVGRAPH
		// UTAGSET START GRAPHICS

		// Interactability properties.
		let _isDown = false;
		let _onClick; // Function to run when the sprite is pressed.
		let _onRelease; // Function to run when the sprite is released.
		const _addToInteractables = () => {
			if (this.onClick || this.onRelease) {
				Umbra.instance.interactableObjects.push(this);
			} else {
				Umbra.instance.interactableObjects.splice(Umbra.instance.interactableObjects.indexOf(this), 1);
			}
		}

		Object.defineProperties(this, {
			/**
			 * @default new Bounds()
			 * @description The size of the object.
			 * @member {!Bounds} bounds
			 * @memberof UObject
			 * @since 1.0
			 */
			bounds: {
				get: () => _bounds,
				set: (value) => {
					if (!value instanceof Bounds) { throw new Error("value must be a Bounds."); }

					const offset = new Vector2(value.min.x - this.bounds.min.x, value.min.y - this.bounds.min.y);
					this.translate(offset);
				}
			},

			/**
			 * @description Translate the object by global coordinates.
			 * @function
			 * @memberof UObject
			 * @param {!Vector2} offset - The offset to translate the object by.
			 * @readonly
			 * @see Bounds.translate
			 * @since 1.0
			 */
			translate: { get: () => _translate },

			/**
			 * @default true
			 * @description Whether the object should be rendered.
			 * @member {!boolean} isActive
			 * @memberof UObject
			 * @since 1.0
			 */
			isActive: {
				get: () => _isActive,
				set: (value) => {
					if (typeof value != "boolean") { throw new Error("value must be a boolean."); }

					_isActive = value;
				}
			},

			/**
			 * @default 0
			 * @description The z-layer of the object. Higher values display above lower ones.
			 * @member {!number} layer
			 * @memberof UObject
			 * @since 1.0
			 */
			layer: {
				get: () => _layer,
				set: (value) => {
					if (typeof value != "number") { throw new Error("value must be a number."); }

					_layer = value;

					// Sort children by layer.
					this.parent.children.sort((a, b) => a.layer < b.layer ? -1 : 1);
				}
			},

			/**
			 * @default false
			 * @description Whether to use this shape to clip the canvas.
			 * @member {!boolean} doClip
			 * @memberof UObject
			 * @since 1.0
			 */
			doClip: {
				get: () => _doClip,
				set: (value) => {
					if (typeof value != "boolean") { throw new Error("value must be a boolean."); }

					_doClip = value;
				}
			},

			/**
			 * @default "white"
			 * @description Color of the object.
			 * @member {string} fillColor
			 * @memberof UObject
			 * @since 1.0
			 */
			fillColor: {
				get: () => _fillColor,
				set: (value) => {
					if (typeof value != "string") { throw new Error("value must be a string."); }

					_fillColor = value;
				}
			},

			/**
			 * @default "white"
			 * @description Color of the outline.
			 * @member {string} lineColor
			 * @memberof UObject
			 * @since 1.0
			 */
			lineColor: {
				get: () => _lineColor,
				set: (value) => {
					if (typeof value != "string") { throw new Error("value must be a string."); }

					_lineColor = value;
				}
			},

			/**
			 * @default 1
			 * @description Width of the outline.
			 * @member {number} lineWidth
			 * @memberof UObject
			 * @since 1.0
			 */
			lineWidth: {
				get: () => _lineWidth,
				set: (value) => {
					if (typeof value != "number") { throw new Error("value must be a number."); }

					_lineWidth = value;
				}
			},

			/**
			 * @description The parent object.
			 * @member {UObject} parent
			 * @memberof UObject
			 * @since 1.0
			 */
			parent: {
				get: () => _parent,
				set: (value) => {
					if (!value instanceof UObject) { throw new Error("value must be a UObject."); }

					if (this.parent) { this.parent.children.splice(this.parent.children.indexOf(this), 1); }
					_parent = value;
					if (this.parent) { this.parent.children.push(this); }
				}
			},

			/**
			 * @default []
			 * @description A list of objects to which this is a parent.
			 * @member {UObject[]} children
			 * @memberof UObject
			 * @readonly
			 * @since 1.0
			 */
			children: { get: () => _children },

			/**
			 * @default this.bounds
			 * @description Outer bounds of this object and its children.
			 * @member {!Bounds} childBox
			 * @memberof UObject
			 * @readonly
			 * @since 1.0
			 */
			childBox: { get: () => _childBox },

			/**
			 * @description Setup the canvas to display this object.
			 * @function
			 * @memberof UObject
			 * @readonly
			 * @see UCamera.render
			 * @see UObject.render
			 * @since 1.0
			 */
			display: { get: () => _display },

			/**
			 * @description Draw the object on the screen.
			 * @function
			 * @memberof UObject
			 * @see UObject.display
			 * @since 1.0
			 */
			render: {
				get: () => _render,
				set: (value) => {
					if (typeof value != "function") { throw new Error("value must be a function."); }

					_render = value;
				}
			},

			// UTAGSET END GRAPHICS
			// UTAGSET START ADVGRAPH

			/**
			 * @default new Vector2(1, 1)
			 * @description Multiplier for object size.
			 * @member {!Vector2} scale
			 * @memberof UObject
			 * @since 1.0
			 */
			scale: {
				get: () => _scale,
				set: (value) => {
					if (!value instanceof Vector2) { throw new Error("value must be a Vector2."); }

					_scale = value;
				}
			},

			/**
			 * @description The shadow emitted by this object.
			 * @member {UShadow} shadow
			 * @memberof UObject
			 * @since 1.0
			 */
			shadow: {
				get: () => _shadow,
				set: (value) => {
					if (!value instanceof UShadow) { throw new Error("value must be a UShadow."); }

					_shadow = value;
				}
			},

			/**
			 * @description The composite operation of the context when rendering this object.
			 * @member {string} compositeOperation
			 * @memberof UObject
			 * @since 1.0
			 */
			compositeOperation: {
				get: () => _compositeOperation,
				set: (value) => {
					if (typeof value != "string") { throw new Error("value must be a string."); }

					_compositeOperation = value;
				}
			},

			/**
			 * @default 1
			 * @description Opacity of the object.
			 * @member {!number} alpha
			 * @memberof UObject
			 * @since 1.0
			 */
			alpha: {
				get: () => _alpha,
				set: (value) => {
					if (typeof value != "number") { throw new Error("value must be a number."); }

					_alpha = value;
				}
			},

			// UTAGSET END ADVGRAPH
			// UTAGSET START GRAPHICS

			/**
			 * @default false
			 * @description Whether the object is being clicked/pressed.
			 * @member {!boolean} isDown
			 * @memberof UObject
			 * @readonly
			 * @since 1.0
			 */
			isDown: {
				get: () => _isDown,
				set: (value) => {
					if (!typeof value == "boolean") { throw new Error("value must be a boolean."); }

					_isDown = value;
				}
			},

			/**
			 * @description The function to run when this object is clicked.
			 * @member {function} onClick
			 * @memberof UObject
			 * @since 1.0
			 */
			onClick: {
				get: () => _onClick,
				set: (value) => {
					if (typeof value != "function") { throw new Error("value must be a function."); }

					_onClick = value;
					_addToInteractables();
				}
			},

			/**
			 * @description The function to run when this object is released.
			 * @member {function} onRelease
			 * @memberof UObject
			 * @since 1.0
			 */
			onRelease: {
				get: () => _onRelease,
				set: (value) => {
					if (typeof value != "function") { throw new Error("value must be a function."); }

					_onRelease = value;
					_addToInteractables();
				}
			}
		});
	}
}

// UTAGSET END GRAPHICS
// UTAGSET START RECT

/**
 * @augments UObject
 * @class
 * @classdesc A rectangle.
 * @readonly
 * @since 1.0
 */
class URect extends UObject {
	/**
	 * @constructs URect
	 * @description Create a rectangle.
	 * @param {!Bounds} [bounds = new Bounds()] - The initial size and position of this object.
	 * @param {UObject} [parent = Umbra.instance.scene] - The initial parent object of this object.
	 * @since 1.0
	 */
	constructor(
			_bounds = new Bounds(), // Passed to parent constructor.
			_parent = Umbra.instance.scene // Passed to parent constructor.
	) {
		super(_bounds, _parent);

		this.render = (ctx) => {
			if (!ctx instanceof CanvasRenderingContext2D) { throw new Error("ctx must be a CanvasRenderingContext2D."); }

			const d = Umbra.instance.camera.gBToS(this.bounds);
			ctx.rect(d.min.x, d.min.y, d.width, d.height);
		}
	}
}

// UTAGSET END RECT
// UTAGSET START CIRCLE

/**
 * @augments UObject
 * @class
 * @classdesc A circle.
 * @readonly
 * @since 1.0
 */
class UCircle extends UObject {
	/**
	 * @constructs UCircle
	 * @description Create a circle.
	 * @param {!Bounds} [bounds = new Bounds()] - The initial size and position of this object.
	 * @param {UObject} [parent = Umbra.instance.scene] - The initial parent object of this object.
	 * @since 1.0
	 */
	constructor(
			_bounds = new Bounds(), // Passed to parent constructor.
			_parent = Umbra.instance.scene // Passed to parent constructor.
	) {
		super(_bounds, _parent);

		this.render = (ctx) => {
			if (!ctx instanceof CanvasRenderingContext2D) { throw new Error("ctx must be a CanvasRenderingContext2D."); }

			const d = Umbra.instance.camera.gBToS(this.bounds);
			const r = Math.max(d.width, d.height) / 2;
			ctx.arc(d.min.x + r, d.min.y + r, r, 0, Math.PI * 2);
		}
	}
}

// UTAGSET END CIRCLE
// UTAGSET START LINE

/**
 * @augments UObject
 * @class
 * @classdesc A line.
 * @readonly
 * @since 1.0
 */
class ULine extends UObject {
	/**
	 * @constructs ULine
	 * @description Create a line.
	 * @param {!Bounds} [bounds = new Bounds()] - The initial size and position of this object.
	 * @param {UObject} [parent = Umbra.instance.scene] - The initial parent object of this object.
	 * @since 1.0
	 */
	constructor(
			_bounds = new Bounds(), // Passed to UObject parent constructor.
			_parent = Umbra.instance.scene // Passed to UObject parent constructor.
	) {
		super(_bounds, _parent);

		// Set render function.
		this.render = (ctx) => {
			if (!ctx instanceof CanvasRenderingContext2D) { throw new Error("ctx must be a CanvasRenderingContext2D."); }

			const d = Umbra.instance.camera.gBToS(this.bounds);
			ctx.moveTo(d.min.x, d.min.y);
			ctx.lineTo(d.max.x, d.max.y);
		}
	}
}

// UTAGSET END LINE
// UTAGSET START TEXT

/**
 * @augments UObject
 * @class
 * @classdesc A paragraph of text.
 * @namespace
 * @readonly
 * @since 1.0
 */
class UText extends UObject {
	/**
	 * @constructs UText
	 * @description Create a paragraph of text.
	 * @param {!string} text - Text to display on the object.
	 * @param {!Bounds} [bounds = new Bounds()] - The initial size and position of this object.
	 * @param {UObject} [parent = Umbra.instance.scene] - The initial parent object of this object.
	 * @since 1.0
	 */
	constructor(
			_text, // Text displayed on the object.
			_bounds = new Bounds(), // Passed to UObject parent constructor.
			_parent = Umbra.instance.scene // Passed to UObject parent constructor.
	) {
		super(_bounds, _parent);

		if (typeof _text != "string") { throw new Error("_text must be a string."); }

		// Display properties.
		let _font = "20px courier"; // String representation of the font.
		let _baseline = "top"; // Baseline.

		Object.defineProperties(this, {
			/**
			 * @description Text displayed on the object.
			 * @member {!string} text
			 * @memberof UText
			 * @since 1.0
			 */
			text: {
				get: () => _text,
				set: (value) => {
					if (typeof value != "string") { throw new Error("value must be a string."); }

					_text = value;
				}
			},

			/**
			 * @default "20px courier"
			 * @description The font to use when displaying the object.
			 * @member {!string} font
			 * @memberof UText
			 * @since 1.0
			 */
			font: {
				get: () => _font,
				set: (value) => {
					if (typeof value != "string") { throw new Error("value must be a string."); }

					_font = value;
				}
			},

			/**
			 * @default "top"
			 * @description The baseline to use when displaying the object.
			 * @member {!string} baseline
			 * @memberof UText
			 * @since 1.0
			 */
			baseline: {
				get: () => _baseline,
				set: (value) => {
					if (typeof value != "string") { throw new Error("value must be a string."); }

					_baseline = value;
				}
			}
		});

		this.render = (ctx) => {
			if (!ctx instanceof CanvasRenderingContext2D) { throw new Error("ctx must be a CanvasRenderingContext2D."); }

			// Shorten variable names to save characters.
			const d = Umbra.instance.camera.gBToS(this.bounds);

			// Resize text object based on content.
			d.width = ctx.measureText(this.text).width;
			d.height = ctx.measureText("M").width;

			ctx.font = this.font;
			ctx.textBaseline = this.baseline;

			ctx.fillText(this.text, d.min.x, d.min.y);
		}
	}
}

// UTAGSET END TEXT
// UTAGSET START IMAGE

/**
 * @class
 * @classdesc A loaded image.
 * @namespace
 * @readonly
 * @since 1.0
 */
class USpritesheet {
	/**
	 * @constructs USpritesheet
	 * @description Load an image.
	 * @param {!HTMLImageElement} source - The image to load.
	 * @param {!Vector2} frameSize - The size of each frame in the image.
	 * @since 1.0
	 */
	constructor(
			_source, // Image source.
			_frameSize = new Vector2() // Dimensions of one frame on the spritesheet.
	) {
		if (!_source instanceof HTMLImageElement) { throw new Error("_source must be an HTMLImageElement"); }
		if (!_frameSize instanceof Vector2) { throw new Error("_frameSize must be a Vector2."); }

		// Spritesheet properties.
		let _positions = []; // Corner point of each frame.
		let _size = new Vector2(_source.width / _frameSize.x, _source.height / _frameSize.y); // Number of columns, rows in the spritesheet.

		// Find frame positions.
		for (var x = 0; x < _size.x; x++) {
			for (var y = 0; y < _size.y; y++) { _positions.push(new Vector2(x * _frameSize.x, y * _frameSize.y)); }
		}

		Object.defineProperties(this, {
			/**
			 * @description The image to load.
			 * @member {!HTMLImageElement} source
			 * @memberof USpritesheet
			 * @readonly
			 * @since 1.0
			 */
			source: { get: () => _source },

			/**
			 * @description The size of each frame in the image.
			 * @member {!Vector2} frameSize
			 * @memberof USpritesheet
			 * @readonly
			 * @since 1.0
			 */
			frameSize: { get: () => _frameSize },

			/**
			 * @default []
			 * @description The coordinates on the image of each frame.
			 * @member {!Vector2[]} positions
			 * @memberof USpritesheet
			 * @readonly
			 * @since 1.0
			 */
			positions: { get: () => _positions },

			/**
			 * @default new Vector2(this.source.width / this.frameSize.x, this.source.height / this.frameSize.y)
			 * @description The number of columns and rows in the image.
			 * @member {!Vector2} size
			 * @memberof USpritesheet
			 * @readonly
			 * @since 1.0
			 */
			size: { get: () => _size }
		});
	}
}

/**
 * @augments UObject
 * @class
 * @classdesc A displayable loaded image.
 * @namespace
 * @readonly
 * @since 1.0
 */
class USprite extends UObject {
	/**
	 * @constructs USprite
	 * @description Make an object out of an image.
	 * @param {!USpritesheet} sheet - The spritesheet to draw frames from.
	 * @param {!Bounds} [bounds = new Bounds()] - The initial size and position of this object.
	 * @param {UObject} [parent = Umbra.instance.scene] - The initial parent object of this object.
	 * @since 1.0
	 */
	constructor(
			_sheet, // The spritesheet to draw frames from.
			_bounds = new Bounds(), // Passed to UObject parent constructor.
			_parent = Umbra.instance.scene // Passed to UObject parent constructor.
	) {
		super(_bounds, _parent);

		if (!_sheet instanceof USpritesheet) { throw new Error("_sheet must be a USpritesheet."); }

		// Display properties.
		let _doLoop = false; // Whether to run the animation on a loop.
		let _loopRange = new Vector2(0, _sheet.positions.length); // Range of frames between which to loop.
		let _fps = 1; // Spritesheet frames per second when animated.
		let _frame = 0; // Index of the current frame in the spritesheet.
		let _current = _sheet.positions[_frame]; // Set current coordinates on the sheet.
		let _interval; // Interval for animation.

		Object.defineProperties(this, {
			/**
			 * @description The spritesheet to draw frames from.
			 * @member {!USpritesheet} sheet
			 * @memberof USprite
			 * @readonly
			 * @since 1.0
			 */
			sheet: { get: () => _sheet },

			/**
			 * @default false
			 * @description Whether to loop the animation.
			 * @member {!boolean} doLoop
			 * @memberof USprite
			 * @since 1.0
			 */
			doLoop: {
				get: () => _doLoop,
				set: (value) => {
					if (typeof value != "boolean") { throw new Error("value must be a boolean."); }

					_doLoop = value;

					// Set/clear interval.
					if (this.doLoop) {
						_interval = setInterval(() => {
							let temp = this.frame;
							if (temp > this.sheet.positions.length) { temp = 0; }
							this.frame = temp;
						}, 1000 / this.fps);
					} else { clearInterval(_interval); }
				}
			},

			/**
			 * @default new Vector2(0, this.sheet.positions.length)
			 * @description The range of frames to loop through.
			 * @member {!Vector2} loopRange
			 * @memberof USprite
			 * @since 1.0
			 */
			loopRange: {
				get: () => _loopRange,
				set: (value) => {
					if (!value instanceof Vector2) { throw new Error("value must be a Vector2."); }
					if (value.x < 0 || value > this.sheet.positions.length) { throw new Error(`value.x (${value.x}) is out of bounds (0 - ${this.sheet.positions.length})`); }
					if (value.y < 0 || value > this.sheet.positions.length) { throw new Error(`value.y (${value.y}) is out of bounds (0 - ${this.sheet.positions.length})`); }

					_loopRange = value;
				}
			},

			/**
			 * @default 1
			 * @description How many frames of the animation to play per second.
			 * @member {!number} fps
			 * @memberof USprite
			 * @since 1.0
			 */
			fps: {
				get: () => _fps,
				set: (value) => {
					if (typeof value != "number") { throw new Error("value must be a number."); }

					_fps = value;
				}
			},

			/**
			 * @default 0
			 * @description The current animation frame.
			 * @member {!number} frame
			 * @memberof USprite
			 * @since 1.0
			 */
			frame: {
				get: () => _frame,
				set: (value) => {
					if (typeof value != "number") { throw new Error("value must be a number."); }
					if (value < 0 || value > this.sheet.positions.length) { throw new Error(`value (${value}) is out of bounds (0 - ${this.sheet.positions.length})`); }

					_frame = value;

					// Set current position.
					_current = this.sheet.positions[this.frame];
				}
			}
		});

		this.render = (ctx) => {
			if (!ctx instanceof CanvasRenderingContext2D) { throw new Error("ctx must be a CanvasRenderingContext2D."); }

			// Shorten variable names to save characters.
			const d = Umbra.instance.camera.gBToS(this.bounds);

			ctx.drawImage(
					this.sheet.source,
					_current.x,
					_current.y,
					this.sheet.frameSize.x,
					this.sheet.frameSize.y,
					d.min.x,
					d.min.y,
					d.width,
					d.height
			);
		}
	}
}

// UTAGSET END IMAGE
// UTAGSET START POINTER

/**
 * @class
 * @classdesc Unified mouse/touchscreen input device.
 * @namespace
 * @readonly
 * @since 1.0
 */
class UPointer {
	/**
	 * @constructs UPointer
	 * @description Make a pointer.
	 * @since 1.0
	 */
	constructor() {
		// Pointer state variables.
		let _pos = new Vector2(); // The position of the pointer on the screen.
		let _isDown = false; // Whether the pointer is being held down.
		let _isTapped = false; // Whether the pointer was tapped.
		const _canvas = Umbra.instance.canvas; // Shorten to reduce character count.

		// User-defined event functions.
		let _onPress; // Pointer became pressed.
		let _onRelease; // Pointer stopped being pressed.

		// Mouse and touchscreen event handlers.
		const _eventPosition = (e) => {
			if (e.targetTouches) {
				// Touchscreen.
				return Vector2(e.targetTouches[0].pageX - _canvas.offsetLeft, e.targetTouches[0].pageY - _canvas.offsetTop);
			}

			// Mouse.
			return new Vector2(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop);
		}
		const _moveHandler = (e) => {
			_pos = _eventPosition(e);
			e.preventDefault(); // Prevent the user from selecting the canvas.
		}
		const _downHandler = (e) => {
			_pos = _eventPosition(e);
			_isDown = true;
			if (this.onPress) { this.onPress(); }
			Umbra.instance.interactableObjects.forEach((object) => {
				if (this.isTouching(object) && !object.isDown) {
					object.isDown = true;
					if (object.onClick) { object.onClick(); }
				}
			});
			e.preventDefault(); // Prevent the user from selecting the canvas.
		}
		const _upHandler = (e) => {
			_isDown = false;
			if (this.onRelease) { this.onRelease(); }
			Umbra.instance.interactableObjects.forEach((object) => {
				if (this.isTouching(object) && object.isDown) {
					object.isDown = false;
					if (object.onRelease) { object.onRelease(); }
				}
			});
			e.preventDefault(); // Prevent the user from selecting the canvas.
		}

		// Bind handlers for mouse events.
		_canvas.addEventListener("mousemove", _moveHandler); // Mouse move.
		_canvas.addEventListener("touchmove", _moveHandler); // Touchscreen move.
		_canvas.addEventListener("mousedown", _downHandler); // Mouse down.
		_canvas.addEventListener("touchstart", _downHandler); // Touchscreen down.
		window.addEventListener("mouseup", _upHandler); // Mouse up.
		window.addEventListener("touchend", _upHandler); // Touchscreen up.

		// Check if mouse is touching an object.
		const _isTouching = (object) => {
			if (!object instanceof UObject) { throw new Error("object must be a UObject."); }

			return Umbra.instance.camera.gBToS(object.bounds).contains(this.pos);
		}

		Object.defineProperties(this, {
			/**
			 * @default new Vector2()
			 * @description The current position of the pointer.
			 * @member {!Vector2} pos
			 * @memberof UPointer
			 * @readonly
			 * @since 1.0
			 */
			pos: { get: () => _pos },

			/**
			 * @default false
			 * @description Whether the pointer has been pressed quickly.
			 * @member {!boolean} isTapped
			 * @memberof UPointer
			 * @readonly
			 * @since 1.0
			 */
			isTapped: { get: () => _isTapped },

			/**
			 * @default false
			 * @description Whether the pointer is being pressed.
			 * @member {!boolean} isDown
			 * @memberof UPointer
			 * @readonly
			 * @since 1.0
			 */
			isDown: { get: () => _isDown },

			/**
			 * @description The function to run when the pointer is pressed.
			 * @member {function} onPress
			 * @memberof UPointer
			 * @since 1.0
			 */
			onPress: {
				get: () => _onPress,
				set: (value) => {
					if (typeof value != "function") { throw new Error("value must be a function."); }

					_onPress = value;
				}
			},

			/**
			 * @description The function to run when the pointer is released.
			 * @member {function} onRelease
			 * @memberof UPointer
			 * @since 1.0
			 */
			onRelease: {
				get: () => _onRelease,
				set: (value) => {
					if (typeof value != "function") { throw new Error("value must be a function."); }

					_onRelease = value;
				}
			},

			/**
			 * @description Check if the pointer is touching an object.
			 * @function
			 * @memberof UPointer
			 * @param {!UObject} object - Object to check for contact.
			 * @readonly
			 * @returns {!boolean} Whether the pointer is touching the object.
			 * @since 1.0
			 */
			isTouching: { get: () => _isTouching }
		});
	}
}

// UTAGSET END POINTER
// UTAGSET START KEYBOARD

/**
 * @class
 * @classdesc A key on the keyboard.
 * @namespace
 * @readonly
 * @since 1.0
 */
class UKey {
	/**
	 * @constructs UKey
	 * @description Assign a key to an object.
	 * @param {!number} code - The ASCII key code of the key.
	 * @since 1.0
	 */
	constructor(
			_code // ASCII key code.
	) {
		if (typeof _code != "number") { throw new Error("_code must be a number."); }

		// State properties.
		let _isDown = false; // Whether the key is being held down.

		// User-defined event functions.
		let _onPress; // Key is pressed.
		let _onRelease; // Key is released.

		// Event handlers.
		window.addEventListener("keydown", (e) => {
			if (e.keyCode != _code) { return; }
			if (!this.isDown && this.onPress) { this.onPress(); }
			_isDown = true;
			e.preventDefault();
		});
		window.addEventListener("keyup", (e) => {
			if (e.keyCode != _code) { return; }
			if (this.isDown && this.onRelease) { this.onRelease(); }
			_isDown = false;
			e.preventDefault();
		});

		Object.defineProperties(this, {
			/**
			 * @default false
			 * @description Whether the key is being pressed.
			 * @member {!boolean} isDown
			 * @memberof UKey
			 * @readonly
			 * @since 1.0
			 */
			isDown: { get: () => _isDown },

			/**
			 * @description The function to run when the key is pressed.
			 * @member {function} onPress
			 * @memberof UKey
			 * @since 1.0
			 */
			onPress: {
				get: () => _onPress,
				set: (value) => {
					if (typeof value != "function") { throw new Error("value must be a function."); }

					_onPress = value;
				}
			},

			/**
			 * @description The function to run when the key is released.
			 * @member {function} onRelease
			 * @memberof UKey
			 * @since 1.0
			 */
			onRelease: {
				get: () => _onRelease,
				set: (value) => {
					if (typeof value != "function") { throw new Error("value must be a function."); }

					_onRelease = value;
				}
			}
		});
	}
}

// UTAGSET END KEYBOARD
// UTAGSET START ADVAUDIO

/**
 * @class
 * @classdesc An echo on audio.
 * @namespace
 * @readonly
 * @since 1.0
 */
class UEcho {
	/**
	 * @constructs UEcho
	 * @description Make an echo.
	 * @param {!number} delayValue - The amount of delay on the echo.
	 * @param {!number} feedbackValue - The volume of the echo.
	 * @param {!number} filterValue - Frequency filter of the echo.
	 * @since 1.0
	 */
	constructor(
			_delayValue = 0.3, // Delay until echo starts.
			_feedbackValue = 0.3, // Feedback volume.
			_filterValue = 0 // Filter value.
	) {
		if (typeof _delayValue != "number") { throw new Error("_delayValue must be a number."); }
		if (typeof _feedbackValue != "number") { throw new Error("_feedbackValue must be a number."); }
		if (typeof _filterValue != "number") { throw new Error("_filterValue must be a number."); }

		// Setup nodes.
		let _actx = Umbra.instance.actx;
		let _delay = _actx.createDelay(); // Delay node.
		_delay.delayTime.value = _delayValue;
		let _feedback = _actx.createGain(); // Feedback gain node.
		_feedback.gain.value = _feedbackValue;
		let _filter = _actx.createBiquadFilter(); // Biquad filter node.
		_filter.frequency.value = _filterValue;

		Object.defineProperties(this, {
			/**
			 * @default Umbra.instance.actx.createDelay()
			 * @description Delay node on the echo.
			 * @member {!DelayNode} delay
			 * @memberof UEcho
			 * @readonly
			 * @since 1.0
			 */
			delay: { get: () => _delay },

			/**
			 * @default Umbra.instance.actx.createGain()
			 * @description Volume node on the echo.
			 * @member {!GainNode} feedback
			 * @memberof UEcho
			 * @readonly
			 * @since 1.0
			 */
			feedback: { get: () => _feedback },

			/**
			 * @default Umbra.instance.actx.createBiquadFilter()
			 * @description Biquad filter node on the echo.
			 * @member {!BiquadFilterNode} filter
			 * @memberof UEcho
			 * @readonly
			 * @since 1.0
			 */
			filter: { get: () => _filter }
		});
	}
}

// UTAGSET END ADVAUDIO
// UTAGSET START AUDIO

/**
 * @class
 * @classdesc An audio asset.
 * @namespace
 * @readonly
 * @since 1.0
 */
class USound {
	/**
	 * @constructs USound
	 * @description Load an audio asset.
	 * @param {!string} source - Path to the source file.
	 * @param {!function} onLoad - Callback function on loaded.
	 * @since 1.0
	 */
	constructor(
			_source, // Path to the source file.
			_onLoad // Function to run when file is loaded.
	) {
		if (typeof _source != "string") { throw new Error("_source must be a string."); }
		if (typeof _onLoad != "function") { throw new Error("_onLoad must be a function."); }

		// Audio properties.
		const _actx = Umbra.instance.actx; // Bound audio context.
		let _volume = _actx.createGain(); // Volume node.
		let _sound; // Audio source.
		let _buffer; // Audio data.
		let _isPlaying = false; // Whether the audio is playing.

		// UTAGSET END AUDIO
		// UTAGSET START ADVAUDIO

		// Advanced audio properties.
		let _pan = _actx.createPanner(); // Controls audio in 3D space.
		let _convolver = _actx.createConvolver(); // Adds convolution effects.
		let _echo; // Echo properties.
		let _reverb; // Reverb audio buffer.

		// UTAGSET END ADVAUDIO
		// UTAGSET START AUDIO

		Object.defineProperties(this, {
			/**
			 * @default Umbra.instance.actx.createGain()
			 * @description Volume controller of the audio.
			 * @member {!GainNode} volume
			 * @memberof USound
			 * @readonly
			 * @since 1.0
			 */
			volume: { get: () => _volume },

			/**
			 * @description Main audio controller.
			 * @member {!AudioBufferSourceNode} sound
			 * @memberof USound
			 * @readonly
			 * @since 1.0
			 */
			sound: { get: () => _sound },

			/**
			 * @default false
			 * @description Whether the audio is playing or not.
			 * @member {!boolean} isPlaying
			 * @memberof USound
			 * @since 1.0
			 */
			isPlaying: {
				get: () => _isPlaying,
				set: (value) => {
					if (typeof value != "boolean") { throw new Error("value must be a boolean."); }

					_isPlaying = value;

					// Play/pause audio.
					if (this.isPlaying) {
						_sound = _actx.createBufferSource();
						this.sound.buffer = _buffer;
						this.sound.connect(this.volume);

						// UTAGSET END AUDIO
						// UTAGSET START ADVAUDIO

						if (this.reverb) {
							this.volume.connect(this.convolver);
							this.convolver.connect(this.pan);
							this.convolver.buffer = this.reverb;
						} else { this.volume.connect(this.pan); }
						if (this.pan) { this.pan.connect(_actx.destination); } else {

							// UTAGSET END ADVAUDIO
							// UTAGSET START AUDIO

							this.volume.connect(_actx.destination);

							// UTAGSET END AUDIO
							// UTAGSET START ADVAUDIO

						}
						if (this.echo) {
							this.echo.delay.connect(this.echo.feedback);
							if (this.echo.filter.frequency.value > 0) {
								this.echo.feedback.connect(this.echo.filter);
								this.echo.filter.connect(this.delay);
							} else { this.echo.feedback.connect(this.delay); }
							this.volume.connect(this.echo.delay);
							this.echo.delay.connect(this.pan);
						}

						// UTAGSET END ADVAUDIO
						// UTAGSET START AUDIO

						this.sound.start();
					} else { this.sound.stop(); }
				}
			},

			// UTAGSET END AUDIO
			// UTAGSET START ADVAUDIO

			/**
			 * @default Umbra.instance.actx.createPanner()
			 * @description Controller for audio in a 3D space.
			 * @member {!PannerNode} pan
			 * @memberof USound
			 * @readonly
			 * @since 1.0
			 */
			pan: { get: () => _pan },

			/**
			 * @default Umbra.instance.actx.createConvolver()
			 * @description Reverb controller for audio.
			 * @member {!ConvolverNode} convolver
			 * @memberof USound
			 * @readonly
			 * @since 1.0
			 */
			convolver: { get: () => _convolver },

			/**
			 * @description Audio echo.
			 * @member {UEcho} echo
			 * @memberof USound
			 * @since 1.0
			 */
			echo: {
				get: () => _echo,
				set: (value) => {
					if (!value instanceof UEcho) { throw new Error("value must be a UEcho."); }

					_echo = value;
				}
			},

			/**
			 * @description Reverb buffer for audio.
			 * @member {!AudioBuffer} reverb
			 * @memberof USound
			 * @since 1.0
			 */
			reverb: {
				get: () => _reverb,
				set: (value) => {
					if (!value instanceof AudioBuffer) { throw new Error("value must be an AudioBuffer"); }

					_reverb = value;
				}
			}

			// UTAGSET END ADVAUDIO
			// UTAGSET START AUDIO

		});

		const req = new XMLHttpRequest();
		req.open("GET", _source);
		req.responseType = "arraybuffer";
		req.addEventListener("load", () => {
			_actx.decodeAudioData(req.response, (buffer) => {
				_buffer = buffer;
				if (_onLoad) { _onLoad(); }
			});
		});
		req.send();
	}
}

// UTAGSET END AUDIO
