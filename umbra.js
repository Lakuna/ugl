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
		// if (typeof _setup != "function") { throw new Error("_setup must be a function."); }
		// if (typeof _load != "function" && typeof _load != "undefined") { throw new Error("_load must be a function or undefined."); }
		// if (typeof _title != "string") { throw new Error("_title must be a string."); }
		// if (!Array.isArray(assetPaths)) { throw new Error("assetPaths must be an array."); }
		// if (typeof _fps != "number") { throw new Error("_fps must be a number"); }
		// if (typeof _bounds != "object") { throw new Error("_bounds must be an object."); }

		// Public properties.
		this.assets = [];
		this.canvas = document.createElement("canvas");
		this.context = this.canvas.getContext("2d");
		this.audioContext = new AudioContext();
		this.scene = new Sprite(this);
		this.pointer = new Pointer(this);
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
				// TODO capturePreviousSpritePositions if necessary - ga.js line 297
				_update();
				_lag -= _frameDuration;
			}

			// Render scene with offset to match between-frame time.
			this.scene.render(_lag / _frameDuration);
		}
		const _update = () => {
			// Update clickables.
			if (this.clickables.length > 0) {
				this.canvas.style.cursor = "auto";
				for (let i = this.clickables.length - 1; i >= 0; i--) { // Iterate from top to bottom so that the top element is checked first.
					const clickable = this.clickables[i];
					clickable.update();
					if (clickable.state == "over" || clickable.state == "down") { this.canvas.style.cursor = "pointer"; }
				}
			}

			// Update draggables.
			if (this.draggables.length > 0) { this.pointer.dragUpdate(); }

			// Run user-defined update functions.
			if (!this.paused) { this.updates.forEach((update) => update()); }
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
						this[source] = image; // assets["path/to/image.png"] will point to the image.
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
					this[source] = audio; // assets["path/to/audio.ogg"] will point to the audio.
				} else if (_jsonExtensions.indexOf(extension) > -1) {
					// JSON.
					const req = new XMLHttpRequest();
					req.open("GET", source);
					req.addEventListener("readystatechange", () => {
						if (req.status != 200 || req.readyState != 4) { return; }
						const json = JSON.parse(req.responseText);
						this[source] = json;
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

		// Setup.
		document.title = _title;
		document.body.style = `margin:0;`;
		document.body.appendChild(this.canvas);
		this.canvas.style = `width:${_bounds.x};height:${_bounds.y};background-color:black;touch-action:none;`;
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

// TODO make sprite class. Most of the original can be left out. Use global position as normal, and relative position as special. - ga.js line 493
class Sprite {
	constructor(_umbra) {
		// Parameter checkers.
		// if (!_umbra instanceof Umbra) throw new Error("_umbra must be an Umbra.");

		// Public properties.

		// Private properties.

		// Private methods.

		// Setup.
		// TODO sort children by layer - ga.js line 2692

	}

	// Getter methods.

	// Setter methods.

	// Other methods.
	render(offset) {
		// Render sprite onto canvas.
		// TODO - ga.js line 1934
	}
	update() {
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