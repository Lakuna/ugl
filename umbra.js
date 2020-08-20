// Umbra tag definitions. Used by the Umbra Builder to create customized distributions.
// UMBRATAGDESC REQUIRED Minimal Umbra framework functionality.
// UMBRATAGDESC GRAPHICS Basic features that allow interaction with the screen.
// UMBRATAGDESC ADVGRAPH Advanced features that allow interaction with the screen.
// UMBRATAGREQ ADVGRAPH GRAPHICS
// UMBRATAGDESC POINTER Unified mouse and touchscreen input.
// UMBRATAGREQ POINTER GRAPHICS
// UMBRATAGDESC KEYBOARD Keyboard input from the user.
// UMBRATAGDESC INTERACT Create objects that can interact with the pointer.
// UMBRATAGREQ INTERACT POINTER
// UMBRATAGDESC DRAG Create objects that can be dragged by the pointer.
// UMBRATAGREQ DRAG POINTER
// UMBRATAGDESC ASSETS Import fonts and JSON objects from files.
// UMBRATAGDESC SHAPE Shared functionality for preset shape object types.
// UMBRATAGREQ SHAPE GRAPHICS
// UMBRATAGDESC RECT Rectangle preset object type.
// UMBRATAGREQ RECT SHAPE
// UMBRATAGDESC CIRCLE Circle preset object type.
// UMBRATAGREQ CIRCLE SHAPE
// UMBRATAGDESC LINE Line preset object type.
// UMBRATAGREQ LINE GRAPHICS
// UMBRATAGDESC TEXT Text preset object type.
// UMBRATAGREQ TEXT GRAPHICS
// UMBRATAGDESC IMAGE Import and display images from files.
// UMBRATAGREQ IMAGE GRAPHICS
// UMBRATAGREQ IMAGE ASSETS
// UMBRATAGDESC AUDIO Import and play audio from files.
// UMBRATAGREQ AUDIO ASSETS
// UMBRATAGDESC ADVAUDIO Advanced audio transformations.
// UMBRATAGREQ ADVAUDIO AUDIO

// Code start.
// UMBRATAGSTART REQUIRED
class Vector2 {
	// Used to specify a point or range.
	constructor(
			_x = 0, // First value.
			_y = 0 // Second value.
	) {
		if (typeof _x != "number") { throw new Error("_x must be a number."); }
		if (typeof _y != "number") { throw new Error("_y must be a number."); }

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
			contains: { get: () => _contains }
		});
	}
}

class Umbra {
	// The global instance of the game.
	static instance;

	// An instance of a game.
	constructor(
			_setup, // The function to run when the framework is ready.
			_load, // The function to use as the state while loading.
			_title = "Umbra", // The title of the window.
			_assetPaths = [], // List of paths to assets that should be loaded.
			_fps = 60, // Target frames per second of the game loop.
			_size = new Vector2(innerWidth, innerHeight) // The size of the canvas.
	) {
		if (typeof _setup != "function" && _setup != undefined) { throw new Error("_setup must be a function."); }
		if (typeof _load != "function" && _load != undefined) { throw new Error("_load must be a function."); }
		if (typeof _title != "string") { throw new Error("_title must be a string."); }
		if (!Array.isArray(_assetPaths)) { throw new Error("_assetPaths must be an array."); }
		_assetPaths.forEach(value => { if (typeof value != "string") { throw new Error("_assetPaths must contain only strings."); } });
		if (typeof _fps != "number") { throw new Error("_fps must be a number."); }
		if (!_size instanceof Vector2) { throw new Error("_size must be a Vector2."); }

		// Define global instance.
		if (Umbra.instance) { throw new Error("There is already an instance of Umbra running."); }
		Umbra.instance = this;

		// Game state properties.
		let _state; // The main function to run in the game loop.
		let _paused = false; // Whether the game loop should run the main function.

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
				// UMBRATAGEND REQUIRED

				// UMBRATAGSTART INTERACT
				// TODO - clickables
				// UMBRATAGEND INTERACT

				// UMBRATAGSTART DRAG
				// TODO - draggables
				// UMBRATAGEND DRAG

				// UMBRATAGSTART REQUIRED
				this.updates.forEach((update) => update());

				if (!this.paused && this.state) { this.state(); }

				_lag -= _frameDuration;
			}
		}

		// Setup document.
		document.title = _title;
		document.body.style = "margin:0;";
		// UMBRATAGEND REQUIRED

		// UMBRATAGSTART GRAPHICS
		// Canvas setup.
		const _canvas = document.createElement("canvas"); // The canvas on which the game is rendered.
		const _context = _canvas.getContext('2d'); // The context of the canvas on which the game is rendered.
		_canvas.style = `width:${_size.x};height:${_size.y};background-color:#000;touch-action:none;`;
		document.body.appendChild(_canvas);
		let _scene = new UObject(); // The scene to render on the canvas.
		let _camera; // The main camera from which to render the canvas. Defined after canvas is made public.
		// UMBRATAGEND GRAPHICS

		// UMBRATAGSTART AUDIO
		const _actx = new AudioContext();
		if (_actx.state == "suspended") {
			// Create a button to ask the user to enable audio.
			const _button = document.createElement("button");
			_button.style = "position:fixed;top:0;left:0;width:10%;height:10%;";
			_button.innerHTML = "Click to enable audio.";
			_button.onclick = () => _actx.resume().then(() => document.body.removeChild(_button));
			document.body.appendChild(_button);
		}
		// UMBRATAGEND AUDIO

		// UMBRATAGSTART POINTER
		// Unified mouse and touchscreen input.
		const _pointer = new UPointer(); // The main pointer.
		// UMBRATAGEND POINTER

		// UMBRATAGSTART KEYBOARD
		// Keyboard input.
		const _keys = []; // List of bound keys.
		// UMBRATAGEND KEYBOARD

		// UMBRATAGSTART INTERACT
		// Objects that can interact with the pointer.
		const _interactables = []; // List of interactable objects.
		// UMBRATAGEND INTERACT

		// UMBRATAGSTART DRAG
		// Objects that can be dragged by the pointer.
		const _draggables = []; // List of draggable objects.
		// UMBRATAGEND DRAG

		// UMBRATAGSTART ASSETS
		// Loading assets from files.
		const _assets = { }; // Object with references to all loaded assets.
		// UMBRATAGEND ASSETS

		// Start the framework.
		const _start = () => { // UMBRATAG REQUIRED
			// UMBRATAGSTART ASSETS
			// Load assets.
			const _loadAssets = () => {
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
				const fontExtensions = ["ttf", "otf", "ttc", "woff"]; // Font file extensions.
				const jsonExtensions = ["json"]; // JSON file extensions.
				const imageExtensions = ["png", "jpg", "gif", "webp"]; // Image file extensions.
				const audioExtensions = ["mp3", "ogg", "wav", "webm"]; // Audio file extensions.

				// Load assets.
				for (let i = 0; i < _assetPaths.length; i++) {
					const source = _assetPaths[i];
					const extension = source.split('.').pop();

					if (fontExtensions.indexOf(extension) > -1) {
						// Load fonts.
						const fontFamily = source.split("/").pop().split(".")[0];
						const style = document.createElement("style");
						style.innerHTML = `@font-face{font-family:${fontFamily};src:url(${source});}`;
						document.head.appendChild(style);
						_onLoad();
					} else if (jsonExtensions.indexOf(extension) > -1) {
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
					// UMBRATAGEND ASSETS

					// UMBRATAGSTART IMAGE
					else if (imageExtensions.indexOf(extension) > -1) {
						// Load images.
						const image = new Image();
						image.addEventListener("load", () => {
							this.assets[source] = image;
							_onLoad();
						});
						image.src = source; // Start loading the image.
					}
					// UMBRATAGEND IMAGE

					// UMBRATAGSTART AUDIO
					else if (audioExtensions.indexOf(extension) > -1) {
						const audio = new SoundAsset(source, _onLoad);
						this.assets[source] = audio;
					}
					// UMBRATAGEND AUDIO

					// UMBRATAGSTART ASSETS
					else { throw new Error("Tried to load an asset with an unknown extension."); }
				}
			}

			// Start loading assets.
			if (_assetPaths.length > 0) { _loadAssets(); } else {
				// UMBRATAGEND ASSETS

				// UMBRATAGSTART REQUIRED
				// Run the startup function.
				if (_setup) { _setup(); }
				// UMBRATAGEND REQUIRED
			} // UMBRATAG ASSETS

			// UMBRATAGSTART REQUIRED
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
			paused: {
				get: () => _paused,
				set: (value) => {
					if (typeof value != "boolean") { throw new Error("value must be a boolean."); }

					_paused = value;
				}
			},
			updates: { get: () => _updates },
			// UMBRATAGEND REQUIRED

			// UMBRATAGSTART GRAPHICS
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
			// UMBRATAGEND GRAPHICS

			// UMBRATAGSTART AUDIO
			actx: { get: () => _actx },
			// UMBRATAGEND AUDIO

			// UMBRATAGSTART POINTER
			pointer: { get: () => _pointer },
			// UMBRATAGEND POINTER

			// UMBRATAGSTART KEYBOARD
			keys: { get: () => _keys },
			// UMBRATAGEND KEYBOARD

			// UMBRATAGSTART INTERACT
			interactables: { get: () => _interactables },
			// UMBRATAGEND INTERACT

			// UMBRATAGSTART DRAG
			draggables: { get: () => _draggables },
			// UMBRATAGEND DRAG

			// UMBRATAGSTART ASSETS
			assets: { get: () => _assets },
			// UMBRATAGEND ASSETS

			// UMBRATAGSTART REQUIRED
			start: { get: () => _start }
		});
		// UMBRATAGEND REQUIRED

		// UMBRATAGSTART GRAPHICS
		// Define camera after canvas is made public.
		_camera = new UCamera();
		// UMBRATAGEND GRAPHICS
	} // UMBRATAG REQUIRED
} // UMBRATAG REQUIRED

// UMBRATAGSTART GRAPHICS
class UCamera {
	constructor(
			_bounds = new Bounds(new Vector2(), new Vector2(Umbra.instance.canvas.width, Umbra.instance.canvas.height)) // The default boundaries of the camera.
	) {
		if (!_bounds instanceof Bounds) { throw new Error("_bounds must be a Bounds."); }

		// Convert a screen point to a global point.
		const _sPosToPos = (point) => {
			// TODO
		}

		// Convert a global point to a screen point.
		const _posToSPos = (point) => {
			// TODO
		}

		// Render all UObjects within the bounds.
		const _render = (interpolationOffset) => {
			// TODO
		}

		Object.defineProperties(this, {
			bounds: {
				get: () => _bounds,
				set: (value) => {
					if (!value instanceof Bounds) { throw new Error("value must be a Bounds."); }

					_bounds = value;
				}
			},
			sPosToPos: { get: () => _sPosToPos },
			posToSPos: { get: () => _posToSPos },
			render: { get: () => _render }
		});
	}
}

class UShadow {
	// TODO
}

class UObject {
	// TODO
}

class UShape extends UObject {
	// TODO
}

class URect extends UShape {
	// TODO
}

class UCircle extends UShape {
	// TODO
}

class ULine extends UObject {
	// TODO
}

class UText extends UObject {
	// TODO
}

class USpritesheet {
	// TODO
}

class USprite extends UObject {
	// TODO
}

class UPointer {
	// TODO
}

class UKey {
	// TODO
}

class UEcho {
	// TODO
}

class USound {
	// TODO
}