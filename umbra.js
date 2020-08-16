/*
class Name {
	constructor() {
		// Parameter checkers.

		// Public properties.

		// Private properties.

		// Private methods.

		// Setup.
	}

	// Getter methods.

	// Setter methods.

	// Other methods.
}
*/

class Umbra {
	constructor(_setup, _load, _title = "Umbra", _assetPaths = [], _fps = 60, _bounds = { x: innerWidth, y: innerHeight }) {
		// Parameter checkers.
		if (typeof _setup != "function") { throw new Error("_setup must be a function."); }
		if (typeof _load != "function" && typeof _load != "undefined") { throw new Error("_load must be a function or undefined."); }
		if (typeof _title != "string") { throw new Error("_title must be a string."); }
		if (!Array.isArray(assetPaths)) { throw new Error("assetPaths must be an array."); }
		if (typeof _fps != "number") { throw new Error("_fps must be a number"); }
		if (typeof _bounds != "object") { throw new Error("_bounds must be an object."); }
		if (!"x" in _bounds) { throw new Error("_bounds must have an x value."); }
		if (!"y" in _bounds) { throw new Error("_bounds must have a y value."); }

		// Public properties.
		this.assets = {}; // List of loaded assets in object form, so that assets can be retrieved through assets["path/to/asset"].
		this.canvas = document.createElement("canvas");
		this.context = this.canvas.getContext("2d");
		this.audioContext = new AudioContext();
		this.scene = new Sprite(this);
		this.pointer = new Pointer(this);
		this.camera = undefined; // Must be defined after the canvas is resized.
		this.draggables = []; // Drag-and-drop-enabled sprites.
		this.clickables = []; // Click-enabled sprites.
		this.updates = []; // Functions to run inside of the main game loop.
		this.paused = false; // Whether the game is paused.

		// Private properties.
		let _startTime = Date.now(); // Start time of the current frame.
		const _frameDuration = 1000 / _fps; // Duration of a frame in milliseconds.
		let _lag = 0; // Time to make up for with updates.
		const _imageExtensions = ["png", "jpg", "gif", "webp"];
		const _fontExtensions = ["ttf", "otf", "ttc", "woff"];
		const _audioExtensions = ["mp3", "ogg", "wav", "webm"];
		const _jsonExtensions = ["json"];
		let _loadedAssets = 0; // Number of assets loaded.

		// Private methods.
		const _gameLoop = () => {
			// Loop method.
			requestAnimationFrame(gameLoop, this.canvas);

			// Space out frames correctly.
			const now = Date.now();
			let elapsed = now - _startTime;
			if (elapsed > 1000) { elapsed = _frameDuration; }
			_startTime = now;
			_lag += elapsed;

			// Update as many times as necessary to make up for lag time.
			while (_lag >= _frameDuration) {
				_update();
				_lag -= _frameDuration;
			}

			// Render canvas.
			_render();
		}
		const _update = () => {
			// Update clickables.
			if (this.clickables.length > 0) {
				this.canvas.style.cursor = "auto";
				for (let i = this.clickables.length - 1; i >= 0; i--) { // Iterate from top to bottom so that the top element is checked first.
					const clickable = this.clickables[i];
					clickable.checkPointer();
					if (clickable.state == "over" || clickable.state == "down") { this.canvas.style.cursor = "pointer"; }
				}
			}

			// Update draggables.
			if (this.draggables.length > 0) { this.pointer.dragUpdate(); }

			// Parts of the update after this point should not run while the game is paused.
			if (this.paused) { return; }

			// Run user-defined update functions.
			this.updates.forEach((update) => update());
		}
		const _loadAssets = () => {
			// Load assets.
			for (let i = _loaded; i < _assetPaths.length; i++) {
				const source = _assetPaths[i];
				const extenson = source.split('.').pop();

				if (_imageExtensions.indexOf(extenson) > -1) {
					// Make an image.
					const image = new Image(); // Equivalent to document.createElement("img");

					// Define a handler for after the image loads.
					image.addEventListener("load", () => {
						// When image finishes loading.
						this.assets[source] = image; // assets["path/to/image.png"] will point to the image.
						_onAssetLoaded();
					});

					// Define image source so that it starts loading.
					image.src = source;
				} else if (_fontExtensions.indexOf(extension) > -1) {
					// Set fontFamily name to font file name.
					const fontFamily = source.split("/").pop().split(".")[0];

					// Append a new @font-face style rule.
					const style = document.createElement('style');
					style.innerHTML = `@font-face{font-family:${fontFamily};src:url(${source});}`;
					document.head.appendChild(style);

					// When font finishes loading.
					_onAssetLoaded();
				} else if (_audioExtensions.indexOf(extension) > -1) {
					// Load audio.
					const audio = new SoundAsset(this.audioContext, source, _onAssetLoaded);
					this.assets[source] = audio; // assets["path/to/audio.ogg"] will point to the audio.
				} else if (_jsonExtensions.indexOf(extension) > -1) {
					// JSON.
					const req = new XMLHttpRequest();
					req.open("GET", source);
					req.addEventListener("readystatechange", () => {
						if (req.status != 200 || req.readyState != 4) { return; }
						const json = JSON.parse(req.responseText);
						this.assets[source] = json;
						_onAssetLoaded();
					});
					req.send();
				}
			}
		}
		const _onAssetLoaded = () => {
			_loadedAssets++;
			if (_loadedAssets == _assetPaths.length) { _setup(); } // Run setup method when all assets are loaded.
		}
		const _render = () => {
			// Clear screen.
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

			// Render the scene with an offset based on the time between frames.
			this.scene.render(_lag / _frameDuration);
		}

		// Setup.
		document.title = _title;
		document.body.style = `margin:0;`;
		document.body.appendChild(this.canvas);
		this.canvas.style = `width:${_bounds.x};height:${_bounds.y};background-color:black;touch-action:none;`;
		this.camera = new Camera(this);
	}

	// Getter methods.

	// Setter methods.

	// Other methods.
	start() {
		// Start the game.
		if (_assetPaths.length > 0) { _loadAssets(); } else { _setup(); }
		_gameLoop();
	}
}

class Camera {
	constructor(_umbra) {
		// Parameter checkers.
		if (!_umbra instanceof Umbra) throw new Error("_umbra must be an Umbra.");

		// Public properties.
		this.pos = { x: 0, y: 0 }; // Center position of the screen.
		this.range = { x: _umbra.canvas.width, y: _umbra.canvas.height }; // View size of camera.

		// Private properties.

		// Private methods.

		// Setup.
	}

	// Getter methods.

	// Setter methods.

	// Other methods.
}

// TODO make sprite class. Most of the original can be left out. Use global position as normal, and relative position as special. - ga.js line 493
class Sprite {
	constructor(_umbra) {
		// Parameter checkers.
		if (!_umbra instanceof Umbra) throw new Error("_umbra must be an Umbra.");

		// Public properties.
		this.v = { x: 0, y: 0 }; // Velocity.
		this.size = { x: 0, y: 0 }; // Width and height.
		this.scale = { x: 1, y: 1 }; // Scale.
		this.pivot = { x: 0.5, y: 0.5 }; // Center of rotation for sprite. 0.01 - 0.99.
		this.rotation = 0; // Rotation of sprite.
		this.visible = true; // Whether the Sprite is visible.
		this.shadow = {
			enabled: false, // Whether the sprite emits a shadow.
			color: "rgba(100, 100, 100, 0.5)", // Color of the shadow.
			offset: { x: 3, y: 3 }, // Offset of the shadow.
			blur: 3 // Blur of the shadow.
		}
		this.compositeOperation = undefined; // context.globalCompositeOperation to use when rendering this sprite.
		this.alpha = 1; // Opacity value.
		this.layer = 0; // Higher layer values are drawn over lower ones.
		this.children = []; // Children Sprites.
		this.childBox = {
			min: { x: 0, y: 0 }, // Upper-left corner of outermost child.
			max: { x: 0, y: 0 } // Bottom-right corner of outermost child.
		};

		// Private properties.
		let _pos = { x: 0, y: 0 }; // See pos.
		let _rPos = { x: 0, y: 0 }; // See rPos.
		let _parent = undefined; // See parent.
		let _draggable = false; // See draggable.
		let _interactive = false; // See interactive.
		let _prev = { x: 0, y: 0 }; // Previous position.
		let _sPos = { x: 0, y: 0 }; // See sPos.

		// Private methods.

		// Setup.
		// TODO sort children by layer - ga.js line 2692
	}

	// Getter methods.
	get pos() { return _pos; } // Global position value.
	get rPos() { return _rPos; } // Position of Sprite relative to its parent (relative position).
	get parent() { return _parent; } // Parent Sprite.
	get draggable() { return _draggable; } // Whether this sprite can be drag-and-dropped.
	get interactive() { return _interactive; } // Whether this sprite can be interacted with by the pointer.
	get sPos() { return _sPos; } // The position of this sprite on the screen (screen position).

	// Setter methods.
	set pos(value) {
		// Parameter checkers.
		if (!"x" in value) { throw new Error("value must have an x value."); }
		if (!"y" in value) { throw new Error("value must have a y value."); }

		_prev = this.pos;
		_pos = value;
	}
	set rPos(value) {
		// Parameter checkers.
		if (!"x" in value) { throw new Error("value must have an x value."); }
		if (!"y" in value) { throw new Error("value must have a y value."); }

		_rPos = value;
		this.pos = { x: this.parent.pos.x + this.rPos.x, y: this.parent.pos.y + this.rPos.y };
	}
	set parent(value) {
		// Parameter checkers.
		if (!value instanceof Sprite && !typeof value == "undefined") { throw new Error("value must be an instance of Sprite or undefined."); }

		if (this.parent) { this.parent.children.splice(this.parent.children.indexOf(this), 1); }
		this.parent = value;
		if (this.parent) {
			this.parent.children.push(this);
			this.parent.childBox.min.x = Math.min(this.parent.childBox.min.x, this.x);
			this.parent.childBox.min.y = Math.min(this.parent.childBox.min.y, this.y);
			this.parent.childBox.max.x = Math.max(this.parent.childBox.max.x, this.x + this.width);
			this.parent.childBox.max.y = Math.max(this.parent.childBox.max.y, this.y + this.height);
		}
	}
	set draggable(value) {
		// Parameter checkers.
		if (!typeof value == "boolean") { throw new Error("value must be a boolean."); }

		_draggable = value;
		if (value) { _umbra.draggables.push(this); } else { _umbra.draggables.splice(_umbra.draggables.indexOf(this), 1); }
	}
	set interactive(value) {
		// Parameter checkers.
		if (!typeof value == "boolean") { throw new Error("value must be a boolean."); }

		_interactive = value;
		if (value) { _umbra.clickables.push(this); } else { _umbra.clickables.splice(_umbra.clickables.indexOf(this), 1); }
	}

	// Other methods.
	render(bounds, offset) {
		// Parameter checkers.
		if (!"min" in bounds) { throw new Error("bounds must have a min value."); }
		if (!"x" in bounds.min || typeof bounds.min.x != "number") { throw new Error("min must have a (number) x value."); }
		if (!"y" in bounds.min || typeof bounds.min.y != "number") { throw new Error("min must have a (number) y value."); }
		if (!"max" in bounds) { throw new Error("bounds must have a max value."); }
		if (!"x" in bounds.max || typeof bounds.max.x != "number") { throw new Error("max must have a (number) x value."); }
		if (!"y" in bounds.max || typeof bounds.max.y != "number") { throw new Error("max must have a (number) y value."); }
		if (!typeof value == "number") { throw new Error("offset must be a number."); }

		// Check if sprite is visible by the camera.
		if (
				this.visible && (
						this.pos.x + this.size.x >= bounds.min.x ||
						this.pos.x < bounds.max.x
				) && (
						this.pos.y + this.size.y >= bounds.min.y ||
						this.pos.y < bounds.max.y
				)
		) {
			// Render sprite onto canvas.
		}

		// Still try to render children if sprite isn't visible.

		// TODO - ga.js line 1934, 1951
	}
	checkPointer() {
		// Detect if pointer is interacting with clickable.
		// TODO - ga.js line 1629, 1650, 1685
	}
}

// TODO - ga.js line 1182
class RectSprite extends Sprite {
	constructor() {
		// Parameter checkers.

		// Public properties.

		// Private properties.

		// Private methods.

		// Setup.
	}

	// Getter methods.

	// Setter methods.

	// Other methods.
}

// TODO - ga.js line 1284
class LineSprite extends Sprite {
	constructor() {
		// Parameter checkers.

		// Public properties.

		// Private properties.

		// Private methods.

		// Setup.
	}

	// Getter methods.

	// Setter methods.

	// Other methods.
}

// TODO - ga.js line 1330
class TextSprite extends Sprite {
	constructor() {
		// Parameter checkers.

		// Public properties.

		// Private properties.

		// Private methods.

		// Setup.
	}

	// Getter methods.

	// Setter methods.

	// Other methods.
}

// TODO - ga.js line 1468, 1798
class ImageSprite extends Sprite {
	constructor() {
		// Parameter checkers.

		// Public properties.

		// Private properties.

		// Private methods.

		// Setup.
	}

	// Getter methods.

	// Setter methods.

	// Other methods.
}

// TODO - ga.js line 2298
class Pointer {
	constructor(_umbra) {
		// Parameter checkers.
		// if (!_umbra instanceof Umbra) throw new Error("_umbra must be an Umbra.");

		// Public properties.

		// Private properties.

		// Private methods.

		// Setup.
	}

	// Getter methods.

	// Setter methods.

	// Other methods.
	dragUpdate() {
		// Update drag-and-drop functionality.
		// TODO - ga.js line 2527
	}
}

// TODO - ga.js line 2617
class Key {
	constructor() {
		// Parameter checkers.

		// Public properties.

		// Private properties.

		// Private methods.

		// Setup.
	}

	// Getter methods.

	// Setter methods.

	// Other methods.
}

// TODO try mimic SoundAsset with asset loading - ga.js line 1396
class ImageAsset {
	constructor() {
		// Parameter checkers.

		// Public properties.

		// Private properties.

		// Private methods.

		// Setup.
	}

	// Getter methods.

	// Setter methods.

	// Other methods.
}

// TODO - plugins.js line 4758
class SoundAsset {
	constructor(_context, _source, _onload) {
		// Parameter checkers.
		// if (!_context instanceof AudioContext) throw new Error("_context must be an AudioContext.");
		// if (typeof _source != "string") { throw new Error("_source must be a string."); }
		// if (typeof _onload != "function" && typeof _onload != "undefined") { throw new Error("_onload must be a function or undefined."); }

		// Public properties.
		this.volumeNode = _context.createGain();
		this.soundNode = null;

		// Private properties.
		let _buffer = null; // Loaded sound.

		// Private methods.
		_load = () => {
			const req = new XMLHttpRequest();
			req.open("GET", _source);
			req.responseType = "arraybuffer";
			req.addEventListener("load", () => {
				_context.decodeAudioData(req.response, (buffer) => {
					_buffer = buffer;
					if (_onload) { _onload(); }
				});
			});
			req.send();
		}

		// Setup.
		_load();
	}

	// Getter methods.

	// Setter methods.

	// Other methods.
	play() {
		this.soundNode = _context.createBufferSource();
		this.soundNode.buffer = _buffer; // Set sound node buffer to loaded sound.

		// Connect sound node to audio output.
		this.soundNode.connect(this.volumeNode); // Enable volume transforms.
		this.volumeNode.connect(_context.destination);

		// Play the audio.
		this.soundNode.start();
	}
}