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
	 * @constructs
	 * @description Creates a Vector2.
	 * @example new Vector2(5, 10);
	 * @param {!number} [x = 0] - The lowest value in a range or the horizontal component of a coordinate.
	 * @param {!number} [y = 0] - The highest value in a range or the vertical component of a coordinate.
	 * @readonly
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
			x: {
				get: () => _x,
				set: (value) => {
					if (typeof value != "number") { throw new Error("value must be a number."); }
					_x = value;
				}
			},
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
			 * @example new Vector2(5, 10).translate(new Vector2(5, 10)); // Creates a new Vector2 at (10, 20).
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

class Bounds {
	// Used to specify a range between two points.
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
			min: {
				get: () => _min,
				set: (value) => {
					if (!value instanceof Vector2) { throw new Error("value must be a Vector2."); }

					_min = value;
				}
			},
			max: {
				get: () => _max,
				set: (value) => {
					if (!value instanceof Vector2) { throw new Error("value must be a Vector2."); }

					_max = value;
				}
			},
			width: {
				get: () => this.max.x - this.min.x,
				set: (value) => {
					if (typeof value != "number") { throw new Error("value must be a number."); }

					this.max.x = this.min.x + value;
				}
			},
			height: {
				get: () => this.max.y - this.min.y,
				set: (value) => {
					if (typeof value != "number") { throw new Error("value must be a number."); }

					this.max.y = this.min.y + value;
				}
			},
			contains: { get: () => _contains },
			intersects: { get: () => _intersects },
			translate: { get: () => _translate }
		});
	}
}

// UTAGSET END GRAPHICS
// UTAGSET START REQUIRED

class Umbra {
	// An instance of a game.
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
			this.camera.render(_lag / _frameDuration);

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
			state: {
				get: () => _state,
				set: (value) => {
					if (typeof value != "function" && value != undefined) { throw new Error("value must be a function."); }

					_state = value;
				}
			},
			isPaused: {
				get: () => _isPaused,
				set: (value) => {
					if (typeof value != "boolean") { throw new Error("value must be a boolean."); }

					_isPaused = value;
				}
			},
			updates: { get: () => _updates },

			// UTAGSET END REQUIRED
			// UTAGSET START GRAPHICS

			canvas: { get: () => _canvas },
			context: { get: () => _context },
			scene: {
				get: () => _scene,
				set: (value) => {
					if (!value instanceof UObject) { throw new Error("value must be a UObject."); }

					_scene = value;
				}
			},
			camera: {
				get: () => _camera,
				set: (value) => {
					if (!value instanceof UCamera) { throw new Error("value must be a UCamera."); }

					_camera = value;
				}
			},

			// UTAGSET END GRAPHICS
			// UTAGSET START AUDIO

			actx: { get: () => _actx },

			// UTAGSET END AUDIO
			// UTAGSET START POINTER

			pointer: { get: () => _pointer },
			interactableObjects: { get: () => _interactableObjects },

			// UTAGSET END POINTER
			// UTAGSET START ASSETS

			assets: { get: () => _assets },

			// UTAGSET END ASSETS
			// UTAGSET START REQUIRED

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

class UCamera {
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
		const _render = (offset) => {
			const canvas = Umbra.instance.canvas;
			Umbra.instance.context.clearRect(0, 0, canvas.width, canvas.height);

			Umbra.instance.scene.display(offset);
		}

		Object.defineProperties(this, {
			bounds: {
				get: () => _bounds,
				set: (value) => {
					if (!value instanceof Bounds) { throw new Error("value must be a Bounds."); }

					_bounds = value;
				}
			},
			scale: { get: () => new Vector2(Umbra.instance.canvas.width / this.bounds.width, Umbra.instance.canvas.height / this.bounds.height) },
			sPToG: { get: () => _sPToG },
			gPToS: { get: () => _gPToS },
			sBToG: { get: () => _sBToG },
			gBToS: { get: () => _gBToS },
			render: { get: () => _render }
		});
	}
}

class UShadow {
	constructor(
			_color = "rgba(100, 100, 100, 0.5)", // Color of the shadow.
			_offset = new Vector2(3, 3), // Offset of the shadow from the caster.
			_blur = 3 // Blur value.
	) {
		if (typeof _color != "string") { throw new Error("_color must be a string."); }
		if (!_offset instanceof Vector2) { throw new Error("_offset must be a Vector2."); }
		if (typeof _blur != "number") { throw new Error("_blur must be a number."); }

		Object.defineProperties(this, {
			color: {
				get: () => _color,
				set: (value) => {
					if (typeof value != "string") { throw new Error("value must be a string."); }

					_color = value;
				}
			},
			offset: {
				get: () => _offset,
				set: (value) => {
					if (!value instanceof Vector2) { throw new Error("value must be a Vector2."); }

					_offset = value;
				}
			},
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

class UObject {
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
		const _display = (offset) => {
			if (typeof offset != "number") { throw new Error("offset must be a number."); }

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
			this.children.forEach((child) => child.display(offset));

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
			bounds: {
				get: () => _bounds,
				set: (value) => {
					if (!value instanceof Bounds) { throw new Error("value must be a Bounds."); }

					const offset = new Vector2(value.min.x - this.bounds.min.x, value.min.y - this.bounds.min.y);
					this.translate(offset);
				}
			},
			translate: { get: () => _translate },
			isActive: {
				get: () => _isActive,
				set: (value) => {
					if (typeof value != "boolean") { throw new Error("value must be a boolean."); }

					_isActive = value;
				}
			},
			layer: {
				get: () => _layer,
				set: (value) => {
					if (typeof value != "number") { throw new Error("value must be a number."); }

					_layer = value;

					// Sort children by layer.
					this.parent.children.sort((a, b) => a.layer < b.layer ? -1 : 1);
				}
			},
			doClip: {
				get: () => _doClip,
				set: (value) => {
					if (typeof value != "boolean") { throw new Error("value must be a boolean."); }

					_doClip = value;
				}
			},
			fillColor: {
				get: () => _fillColor,
				set: (value) => {
					if (typeof value != "string") { throw new Error("value must be a string."); }

					_fillColor = value;
				}
			},
			lineColor: {
				get: () => _lineColor,
				set: (value) => {
					if (typeof value != "string") { throw new Error("value must be a string."); }

					_lineColor = value;
				}
			},
			lineWidth: {
				get: () => _lineWidth,
				set: (value) => {
					if (typeof value != "number") { throw new Error("value must be a number."); }

					_lineWidth = value;
				}
			},
			parent: {
				get: () => _parent,
				set: (value) => {
					if (!value instanceof UObject) { throw new Error("value must be a UObject."); }

					if (this.parent) { this.parent.children.splice(this.parent.children.indexOf(this), 1); }
					_parent = value;
					if (this.parent) { this.parent.children.push(this); }
				}
			},
			children: { get: () => _children },
			childBox: { get: () => _childBox },
			display: { get: () => _display },
			render: {
				get: () => _render,
				set: (value) => {
					if (typeof value != "function") { throw new Error("value must be a function."); }

					_render = value;
				}
			},

			// UTAGSET END GRAPHICS
			// UTAGSET START ADVGRAPH

			scale: {
				get: () => _scale,
				set: (value) => {
					if (!value instanceof Vector2) { throw new Error("value must be a Vector2."); }

					_scale = value;
				}
			},
			shadow: {
				get: () => _shadow,
				set: (value) => {
					if (!value instanceof UShadow) { throw new Error("value must be a UShadow."); }

					_shadow = value;
				}
			},
			compositeOperation: {
				get: () => _compositeOperation,
				set: (value) => {
					if (typeof value != "string") { throw new Error("value must be a string."); }

					_compositeOperation = value;
				}
			},
			alpha: {
				get: () => _alpha,
				set: (value) => {
					if (typeof value != "number") { throw new Error("value must be a number."); }

					_alpha = value;
				}
			},

			// UTAGSET END ADVGRAPH
			// UTAGSET START GRAPHICS

			isDown: {
				get: () => _isDown,
				set: (value) => {
					if (!typeof value == "boolean") { throw new Error("value must be a boolean."); }

					_isDown = value;
				}
			},
			onClick: {
				get: () => _onClick,
				set: (value) => {
					if (typeof value != "function") { throw new Error("value must be a function."); }

					_onClick = value;
					_addToInteractables();
				}
			},
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

class URect extends UObject {
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

class UCircle extends UObject {
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

class ULine extends UObject {
	constructor(
			_bounds = new Bounds(), // Passed to UObject parent constructor.
			_parent = Umbra.instance.scene // Passed to UObject parent constructor.
	) {
		super(_bounds, _parent);

		let _lineJoin; // How the context should join the line.

		Object.defineProperties(this, {
			lineJoin: {
				get: () => _lineJoin,
				set: (value) => {
					if (typeof value != "string") { throw new Error("value must be a string."); }

					_lineJoin = value;
				}
			}
		});

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

class UText extends UObject {
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
			text: {
				get: () => _text,
				set: (value) => {
					if (typeof value != "string") { throw new Error("value must be a string."); }

					_text = value;
				}
			},
			font: {
				get: () => _font,
				set: (value) => {
					if (typeof value != "string") { throw new Error("value must be a string."); }

					_font = value;
				}
			},
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

class USpritesheet {
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
			source: { get: () => _source },
			frameSize: { get: () => _frameSize },
			positions: { get: () => _positions },
			size: { get: () => _size }
		});
	}
}

class USprite extends UObject {
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
			sheet: { get: () => _sheet },
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
			loopRange: {
				get: () => _loopRange,
				set: (value) => {
					if (!value instanceof Vector2) { throw new Error("value must be a Vector2."); }
					if (value.x < 0 || value > this.sheet.positions.length) { throw new Error(`value.x (${value.x}) is out of bounds (0 - ${this.sheet.positions.length})`); }
					if (value.y < 0 || value > this.sheet.positions.length) { throw new Error(`value.y (${value.y}) is out of bounds (0 - ${this.sheet.positions.length})`); }

					_loopRange = value;
				}
			},
			fps: {
				get: () => _fps,
				set: (value) => {
					if (typeof value != "number") { throw new Error("value must be a number."); }

					_fps = value;
				}
			},
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

class UPointer {
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
			pos: { get: () => _pos },
			isTapped: { get: () => _isTapped },
			isDown: { get: () => _isDown },
			onPress: {
				get: () => _onPress,
				set: (value) => {
					if (typeof value != "function") { throw new Error("value must be a function."); }

					_onPress = value;
				}
			},
			onRelease: {
				get: () => _onRelease,
				set: (value) => {
					if (typeof value != "function") { throw new Error("value must be a function."); }

					_onRelease = value;
				}
			},
			isTouching: { get: () => _isTouching }
		});
	}
}

// UTAGSET END POINTER
// UTAGSET START KEYBOARD

class UKey {
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
			isDown: { get: () => _isDown },
			onPress: {
				get: () => _onPress,
				set: (value) => {
					if (typeof value != "function") { throw new Error("value must be a function."); }

					_onPress = value;
				}
			},
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

class UEcho {
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
			delay: { get: () => _delay },
			feedback: { get: () => _feedback },
			filter: { get: () => _filter }
		});
	}
}

// UTAGSET END ADVAUDIO
// UTAGSET START AUDIO

class USound {
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
			volume: { get: () => _volume },
			sound: { get: () => _sound },
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

			pan: { get: () => _pan },
			convolver: { get: () => _convolver },
			echo: {
				get: () => _echo,
				set: (value) => {
					if (!value instanceof UEcho) { throw new Error("value must be a UEcho."); }

					_echo = value;
				}
			},
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
