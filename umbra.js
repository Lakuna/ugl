// Umbra tag definitions. Used by the Umbra Builder to create customized distributions.
// UTAGDEF DESC REQUIRED Minimal Umbra framework functionality.
// UTAGDEF SIZE REQUIRED ???

// UTAGDEF DESC GRAPHICS Basic features that allow interaction with the screen.
// UTAGDEF SIZE GRAPHICS ???

// UTAGDEF DESC ADVGRAPH Advanced features that allow interaction with the screen.
// UTAGDEF REQU ADVGRAPH GRAPHICS
// UTAGDEF SIZE ADVGRAPH ???

// UTAGDEF DESC POINTER Unified mouse and touchscreen input.
// UTAGDEF REQU POINTER GRAPHICS
// UTAGDEF SIZE ???

// UTAGDEF DESC KEYBOARD Keyboard input from the user.
// UTAGDEF SIZE KEYBOARD ???

// UTAGDEF DESC INTERACT Create objects that can interact with the pointer.
// UTAGDEF REQU INTERACT POINTER
// UTAGDEF SIZE INTERACT ???

// UTAGDEF DESC DRAG Create objects that can be dragged by the pointer.
// UTAGDEF REQU DRAG POINTER
// UTAGDEF SIZE DRAG ???

// UTAGDEF DESC ASSETS Import JSON objects from files.
// UTAGDEF SIZE ASSETS ???

// UTAGDEF DESC SHAPE Shared functionality for preset shape object types.
// UTAGDEF REQU SHAPE GRAPHICS
// UTAGDEF SIZE SHAPE ???

// UTAGDEF DESC RECT Rectangle preset object type.
// UTAGDEF REQU RECT SHAPE
// UTAGDEF SIZE RECT ???

// UTAGDEF DESC CIRCLE Circle preset object type.
// UTAGDEF REQU CIRCLE SHAPE
// UTAGDEF SIZE CIRCLE ???

// UTAGDEF DESC LINE Line preset object type.
// UTAGDEF REQU LINE GRAPHICS
// UTAGDEF SIZE LINE ???

// UTAGDEF DESC TEXT Import and use fonts.
// UTAGDEF REQU TEXT GRAPHICS
// UTAGDEF SIZE TEXT ???

// UTAGDEF DESC IMAGE Import and display images from files.
// UTAGDEF REQU IMAGE GRAPHICS
// UTAGDEF REQU IMAGE ASSETS
// UTAGDEF SIZE IMAGE ???

// UTAGDEF DESC AUDIO Import and play audio from files.
// UTAGDEF REQU AUDIO ASSETS
// UTAGDEF SIZE AUDIO ???

// UTAGDEF DESC ADVAUDIO Advanced audio transformations.
// UTAGDEF REQU ADVAUDIO AUDIO
// UTAGDEF SIZE ADVAUDIO ???

// Code start.
// UTAGSET START REQUIRED
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
				// UTAGSET END REQUIRED

				// UTAGSET START INTERACT
				if (this.interactables.length > 0) {
					this.canvas.style.cursor = "auto";
					for (let i = this.interactables.length - 1; i >= 0; i--) {
						// Iterate from top to bottom so that the top element is checked first.
						const clickable = this.interactables[i];
						clickable.update();
						if (clickable.hovered) { this.canvas.style.cursor = "pointer"; }
					}
				}
				// UTAGSET END INTERACT

				// UTAGSET START DRAG
				if (this.draggables.length > 0) { this.pointer.update(); }
				// UTAGSET END DRAG

				// UTAGSET START REQUIRED
				this.updates.forEach((update) => update());

				if (!this.paused && this.state) { this.state(); }

				_lag -= _frameDuration;
			}
		}

		// Setup document.
		document.title = _title;
		document.body.style = "margin:0;";
		// UTAGSET END REQUIRED

		// UTAGSET START GRAPHICS
		// Canvas setup.
		const _canvas = document.createElement("canvas"); // The canvas on which the game is rendered.
		const _context = _canvas.getContext('2d'); // The context of the canvas on which the game is rendered.
		_canvas.style = `width:${_size.x};height:${_size.y};background-color:#000;touch-action:none;`;
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
		// UTAGSET END POINTER

		// UTAGSET START KEYBOARD
		// Keyboard input.
		const _keys = []; // List of bound keys.
		// UTAGSET END KEYBOARD

		// UTAGSET START INTERACT
		// Objects that can interact with the pointer.
		const _interactables = []; // List of interactable objects.
		// UTAGSET END INTERACT

		// UTAGSET START DRAG
		// Objects that can be dragged by the pointer.
		const _draggables = []; // List of draggable objects.
		// UTAGSET END DRAG

		// UTAGSET START ASSETS
		// Loading assets from files.
		const _assets = { }; // Object with references to all loaded assets.
		// UTAGSET END ASSETS

		// Start the framework.
		const _start = () => { // UTAGSET LINE REQUIRED
			// UTAGSET START ASSETS
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
						const audio = new SoundAsset(source, _onLoad);
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
			} // UTAGSET LINE ASSETS

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
			paused: {
				get: () => _paused,
				set: (value) => {
					if (typeof value != "boolean") { throw new Error("value must be a boolean."); }

					_paused = value;
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
			// UTAGSET END POINTER

			// UTAGSET START KEYBOARD
			keys: { get: () => _keys },
			// UTAGSET END KEYBOARD

			// UTAGSET START INTERACT
			interactables: { get: () => _interactables },
			// UTAGSET END INTERACT

			// UTAGSET START DRAG
			draggables: { get: () => _draggables },
			// UTAGSET END DRAG

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
	} // UTAGSET LINE REQUIRED
} // UTAGSET LINE REQUIRED

// UTAGSET START GRAPHICS
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
		let _active = true; // Whether the object should be rendered.
		let _layer = 0; // The z-layer of the object. Higher values are displayed over lower ones.
		let _prev; // The position of this object at the start of the frame.
		let _markPosition = () => _prev = this.bounds.min; // Set _prev.

		// Parent-child hierarchy properties.
		let _children = []; // List of children.
		let _childBox = _bounds; // Bounds of this object and its children.

		// Display the sprite on the canvas.
		let _display = (offset) => {
			if (typeof offset != "number") { throw new Error("offset must be a number."); }
			
			// TODO
		}
		let _render; // Function to use when rendering the object.
		// UTAGSET END GRAPHICS

		// UTAGSET START ADVGRAPH
		// Advanced rendering properties.
		let _scale = new Vector2(1, 1); // Width/height multiplier.
		let _pivot = new Vector2(0.5, 0.5); // Center of rotation.
		let _rotation = 0; // Rotation in radians (clockwise).
		let _shadow; // Shadow cast by the object.
		let _compositeOperation; // Global composite operation used when rendering this object.
		let _alpha = 1; // Opacity.
		// UTAGSET END ADVGRAPH

		// UTAGSET START DRAG
		// Drag-and-drop properties.
		let _draggable = false; // Whether the object can be dragged by the pointer.
		// UTAGSET END DRAG

		// UTAGSET START INTERACT
		// Pointer interaction properties.
		let _interactable = false; // Whether the pointer can interact with this object.
		let _press; // Function to run when the sprite is pressed.
		let _release; // Function to run when the sprite is released.
		let _over; // Function to run when the pointer is over the sprite.
		let _out; // Function to run when the pointer leaves the sprite.
		let _tap; // Function to run when the pointer quickly presses the sprite.
		let _down = false; // Whether the object is being pressed.
		let _hovered = false; // Whether the pointer is over the object.
		let _update = () => {
			// TODO
		}
		// UTAGSET END INTERACT

		// UTAGSET START GRAPHICS
		Object.defineProperties(this, {
			bounds: {
				get: () => _bounds,
				set: (value) => {
					if (!value instanceof Bounds) { throw new Error("value must be a Bounds."); }

					_bounds = value;

					// TODO: Reposition children, resize childBox.
				}
			},
			x: {
				get: () => this.bounds.min.x,
				set: (value) => {
					if (typeof value != "number") { throw new Error("value must be a number."); }

					this.bounds = new Bounds(new Vector2(value, this.bounds.min.y), this.bounds.max);
				}
			},
			y: {
				get: () => this.bounds.min.y,
				set: (value) => {
					if (typeof value != "number") { throw new Error("value must be a number."); }

					this.bounds = new Bounds(new Vector2(this.bounds.min.x, value), this.bounds.max);
				}
			},
			size: {
				get: () => new Vector2(this.bounds.max.x - this.bounds.min.x, this.bounds.max.y - this.bounds.min.y),
				set: (value) => {
					if (!value instanceof Vector2) { throw new Error("value must be a Vector2."); }

					this.bounds = new Bounds(this.bounds.min, new Vector2(this.bounds.min.x + value.x, this.bounds.min.y + value.y));
				}
			},
			active: {
				get: () => _active,
				set: (value) => {
					if (typeof value != "boolean") { throw new Error("value must be a boolean."); }

					_active = value;
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
			markPosition: { get: () => _markPosition },
			parent: {
				get: () => _parent,
				set: (value) => {
					if (!value instanceof UObject) { throw new Error("value must be a UObject."); }

					_parent = value;

					// TODO: Reorder parent children.
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
			pivot: {
				get: () => _pivot,
				set: (value) => {
					if (!value instanceof Vector2) { throw new Error("value must be a Vector2."); }

					_pivot = value;
				}
			},
			rotation: {
				get: () => _rotation,
				set: (value) => {
					if (typeof value != "number") { throw new Error("value must be a number."); }

					_rotation = value;
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

			// UTAGSET START DRAG
			draggable: {
				get: () => _draggable,
				set: (value) => {
					if (typeof value != "boolean") { throw new Error("value must be a boolean."); }

					_draggable = value;

					// TODO: Add to draggables array.
				}
			},
			// UTAGSET END DRAG

			// UTAGSET START INTERACT
			interactable: {
				get: () => _interactable,
				set: (value) => {
					if (typeof value != "boolean") { throw new Error("value must be a boolean."); }

					_interactable = value;

					// TODO: Add to interactables array.
				}
			},
			press: {
				get: () => _press,
				set: (value) => {
					if (typeof value != "function") { throw new Error("value must be a function."); }

					_press = value;
				}
			},
			release: {
				get: () => _release,
				set: (value) => {
					if (typeof value != "function") { throw new Error("value must be a function."); }

					_release = value;
				}
			},
			over: {
				get: () => _over,
				set: (value) => {
					if (typeof value != "function") { throw new Error("value must be a function."); }

					_over = value;
				}
			},
			out: {
				get: () => _out,
				set: (value) => {
					if (typeof value != "function") { throw new Error("value must be a function."); }

					_out = value;
				}
			},
			tap: {
				get: () => _tap,
				set: (value) => {
					if (typeof value != "function") { throw new Error("value must be a function."); }

					_tap = value;
				}
			},
			down: { get: () => _down },
			hovered: { get: () => _hovered },
			update: { get: () => _update }
			// UTAGSET END DRAG
		}); // UTAGSET LINE GRAPHICS
	} // UTAGSET LINE GRAPHICS
} // UTAGSET LINE GRAPHICS

// UTAGSET START SHAPE
class UShape extends UObject {
	constructor(
			_bounds = new Bounds(), // Passed to UObject parent constructor.
			_parent = Umbra.instance.scene // Passed to UObject parent constructor.
	) {
		super(bounds, parent);

		// Rendering properties.
		let _clip = false; // Whether to use this shape to clip the context.
		let _fillColor = "#fff"; // Color to fill the shape.
		let _lineColor = "none"; // Color of the shape's outline.
		let _lineWidth = 0; // Width of the shape's outline.

		Object.defineProperties(this, {
			clip: {
				get: () => _clip,
				set: (value) => {
					if (typeof value != "boolean") { throw new Error("value must be a boolean."); }

					_clip = value;
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
			}
		});
	}
}
// UTAGSET END SHAPE

// UTAGSET START RECT
class URect extends UShape {
	constructor(
			_bounds = new Bounds(), // Passed to parent constructor.
			_parent = Umbra.instance.scene // Passed to parent constructor.
	) {
		super(_bounds, _parent);

		super.render = () => {
			// TODO
		}
	}
}
// UTAGSET END RECT

// UTAGSET START CIRCLE
class UCircle extends UShape {
	constructor(
			_bounds = new Bounds(), // Passed to parent constructor.
			_parent = Umbra.instance.scene // Passed to parent constructor.
	) {
		super(_bounds, _parent);

		super.render = () => {
			// TODO
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

		// Rendering properties.
		let _color = "#fff"; // Font color.
		let _thickness = 0; // Width of the line.
		let _lineJoin; // How the context should join the line.

		Object.defineProperties(this, {
			color: {
				get: () => _color,
				set: (value) => {
					if (typeof value != "string") { throw new Error("value must be a string."); }

					_color = value;
				}
			},
			thickness: {
				get: () => _thickness,
				set: (value) => {
					if (typeof value != "number") { throw new Error("value must be a number."); }

					_thickness = value;
				}
			},
			lineJoin: {
				get: () => _lineJoin,
				set: (value) => {
					if (typeof value != "string") { throw new Error("value must be a string."); }

					_lineJoin = value;
				}
			}
		});

		// Set render function.
		super.render = () => {
			// TODO
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
		let _font = "12px courier"; // String representation of the font.
		let _color = "#fff"; // Font color.
		let _baseline = "top"; // Baseline.

		Object.defineProperties(this, {
			font: {
				get: () => _font,
				set: (value) => {
					if (typeof value != "string") { throw new Error("value must be a string."); }

					_font = value;
				}
			},
			color: {
				get: () => _color,
				set: (value) => {
					if (typeof value != "string") { throw new Error("value must be a string."); }

					_color = value;
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

		super.render = () => {
			// TODO
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
		let _loop = false; // Whether to run the animation on a loop.
		let _loopRange = new Vector2(0, _sheet.positions.length); // Range of frames between which to loop.
		let _fps = 1; // Spritesheet frames per second when animated.
		let _frame = 0; // Index of the current frame in the spritesheet.
		let _current = _sheet.positions[_frame]; // Set current coordinates on the sheet.
		let _interval; // Interval for animation.

		Object.defineProperties(this, {
			sheet: { get: () => _sheet },
			loop: {
				get: () => _loop,
				set: (value) => {
					if (typeof value != "boolean") { throw new Error("value must be a boolean."); }

					_loop = value;

					// Set/clear interval.
					if (this.loop) {
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

		super.render = () => {
			// TODO
		}
	}
}
// UTAGSET END IMAGE

// UTAGSET START POINTER
class UPointer {
	constructor() {
		// Pointer state variables.
		let _pos = new Vector2(); // THe position of the pointer.
		let _down = false; // Whether the pointer is being held down.
		let _downTime = 0; // Time that the pointer became pressed.
		let _elapsedTime = 0; // Time that the pointer has been pressed.
		const _canvas = Umbra.instance.canvas; // Shorten to reduce character count.

		// User-defined event functions.
		let _press; // Pointer became pressed.
		let _release; // Pointer stopped being pressed.
		let _tap; // Pointer was pressed quickly.

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
			_down = true;
			_downTime = Date.now();
			if (this.press) { this.press(); }
			e.preventDefault(); // Prevent the user from selecting the canvas.
		}
		const _upHandler = (e) => {
			_elapsedTime = Math.abs(_downTime - Date.now());
			if (_elapsedTime <= 200) {
				if (this.tap) { this.tap(); }
			}
			_down = false;
			if (this.release) { this.release(); }
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
		const _touching = (object) => {
			if (!object instanceof UObject) { throw new Error("object must be a UObject."); }

			return object.bounds.contains(this.pos);
		}
		// UTAGSET END POINTER

		// UTAGSET START DRAG
		// Drag-and-drop properties.
		let _draggedObject; // Currently dragging object.
		let _dragOffset = new Vector2(); // Distance current object has been dragged.

		// Update drag-and-drop.
		const _update = () => {
			// TODO
		}
		// UTAGSET END DRAG

		// UTAGSET START POINTER
		Object.defineProperties(this, {
			pos: { get: () => _pos },
			down: { get: () => _down },
			press: {
				get: () => _press,
				set: (value) => {
					if (typeof value != "function") { throw new Error("value must be a function."); }

					_press = value;
				}
			},
			release: {
				get: () => _release,
				set: (value) => {
					if (typeof value != "function") { throw new Error("value must be a function."); }

					_release = value;
				}
			},
			tap: {
				get: () => _tap,
				set: (value) => {
					if (typeof value != "function") { throw new Error("value must be a function."); }

					_tap = value;
				}
			},
			touching: { get: () => _touching },
			// UTAGSET END POINTER

			// UTAGSET START DRAG
			draggedObject: { get: () => _draggedObject },
			// UTAGSET END DRAG

			// UTAGSET START POINTER
			update: { get: () => _update }
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
		let _down = false; // Whether the key is being held down.

		// User-defined event functions.
		let _press; // Key is pressed.
		let _release; // Key is released.

		// Event handlers.
		window.addEventListener("keydown", (e) => {
			if (e.keyCode != _code) { return; }
			if (!this.down && this.press) { this.press(); }
			_down = true;
			e.preventDefault();
		});
		window.addEventListener("keyup", (e) => {
			if (e.keyCode != _code) { return; }
			if (this.down && this.release) { this.release(); }
			_down = false;
			e.preventDefault();
		});

		Object.defineProperties(this, {
			down: { get: () => _down },
			press: {
				get: () => _press,
				set: (value) => {
					if (typeof value != "function") { throw new Error("value must be a function."); }

					_press = value;
				}
			},
			release: {
				get: () => _release,
				set: (value) => {
					if (typeof value != "function") { throw new Error("value must be a function."); }

					_release = value;
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
		let _playing = false; // Whether the audio is playing.
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
			playing: {
				get: () => _playing,
				set: (value) => {
					if (typeof value != "boolean") { throw new Error("value must be a boolean."); }

					_playing = value;

					// Play/pause audio.
					if (this.playing) {
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
