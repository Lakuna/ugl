class Umbra {
	constructor(setup, load, title = "Umbra", assetPaths = [], fps = 60, bounds = { x: innerWidth, y: innerHeight }) {
		// Check parameters.
		if (typeof setup != "function" && typeof setup != "undefined") { throw new Error("setup must be a function or undefined."); }
		if (typeof load != "function" && typeof load != "undefined") { throw new Error("load must be a function or undefined."); }
		if (typeof title != "string") { throw new Error("title must be a string."); }
		if (!Array.isArray(assetPaths)) { throw new Error("assetPaths must be an array."); }
		if (typeof fps != "number") { throw new Error("fps must be a number"); }
		if (typeof bounds != "object") { throw new Error("bounds must be an object."); }
		if (!"x" in bounds) { throw new Error("bounds must have an x value."); }
		if (!"y" in bounds) { throw new Error("bounds must have a y value."); }

		// Save parameters.
		this.setup = setup; // The function to be run after all assets are loaded and the game loop has started. The starting point for a game.
		this.load = load; // The function to loop while loading. Useful for making a loading progress bar.
		this.assetPaths = assetPaths; // Paths to files that are to be loaded as assets.
		this.frameDuration = 1000 / fps; // The duration of a frame in milliseconds.

		// Setup document.
		document.title = title;
		document.body.style = "margin:0;";

		// Setup canvas.
		this.canvas = document.createElement("canvas"); // The canvas that the game is drawn on.
		this.context = this.canvas.getContext("2d"); // The context that the game is drawn on.
		this.canvas.style = `width:${bounds.x};height:${bounds.y};background-color:black;touch-action:none;`;
		document.body.appendChild(this.canvas);

		// Create scene.
		this.scene = new Sprite(this); // The main object which holds all others that are currently active.

		// Setup audio.
		this.audioContext = new AudioContext(); // The context used to play all game audio.
		if (this.audioContext.state == "suspended") {
			// Create button to ask user to enable audio.
			const button = document.createElement("button");
			button.style = "position:fixed;top:0;left:0;width:150;height:50;";
			button.innerHTML = "Click to enable audio.";
			button.onclick = () => this.audioContext.resume().then(() => document.body.removeChild(button));
			document.body.appendChild(button);
		}

		// Setup pointer.
		this.pointer = new Pointer(this); // Mouse pointer and touchscreen unifier.

		// Load assets.
		this.assets = {}; // List of loaded assets in object form, so that assets can be retrieved through assets["path/to/asset"].

		// Setup camera.
		this.camera = new Camera(this); // The main viewpoint from which the game is rendered.

		// Create lists of objects.
		this.draggables = []; // Drag-and-drop-enabled sprites.
		this.clickables = []; // Click-enabled sprites.

		// Setup timing stuff.
		this.lastFrameTime = Date.now(); // Start time of the last frame.
		this.lag = 0; // Current lag time to be made up for with updates next frame.

		// Setup main game loop.
		this.paused = false; // Whether the game is paused.
		this.state = undefined; // The main function to run in the game loop.
		this.updates = []; // Functions to run inside of the game loop, outside of primary functionality.
	}

	// Start the game.
	start = () => {
		if (this.assetPaths.length > 0) { this.loadAssets(); } else {
			if (this.setup) { this.setup(); }
		}
		this.gameLoop();
	}

	// Game loop.
	gameLoop = () => {
		// Repeat function.
		requestAnimationFrame(this.gameLoop, this.canvas);

		// Space out frames correctly.
		const now = Date.now();
		let elapsed = now - this.lastFrameTime;
		if (elapsed > 1000) { elapsed = this.frameDuration; }
		this.lastFrameTime = now;
		this.lag += elapsed;

		// Update as many times as necessary to make up for lag time.
		while (this.lag >= this.frameDuration) {
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

			// Run user-defined update functions.
			this.updates.forEach((update) => update());

			// Run the main functionality of the game.
			if (!this.paused && this.state) { this.state(); }

			this.lag -= this.frameDuration;
		}

		// Clear screen.
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// Render the scene with an offset based on the time between frames (for interpolation).
		this.scene.display(this.lag / this.frameDuration);
	}

	loadAssets = () => {
		// Define file types.
		const imageExtensions = ["png", "jpg", "gif", "webp"];
		const fontExtensions = ["ttf", "otf", "ttc", "woff"];
		const audioExtensions = ["mp3", "ogg", "wav", "webm"];
		const jsonExtensions = ["json"];

		// Begin counting loaded assets.
		let loaded = 0; // Number of assets loaded.

		// Define a function to run when an asset is loaded.
		const onLoad = () => {
			loaded++;
			if (loaded >= this.assetPaths.length) {
				this.state = undefined;
				if (this.setup) { this.setup(); } // Run setup method when all assets are loaded.
			}
		}

		// Run loading function while loading.
		this.state = this.load;

		// Load assets.
		for (let i = 0; i < this.assetPaths.length; i++) {
			const source = this.assetPaths[i];
			const extenson = source.split('.').pop();

			if (imageExtensions.indexOf(extenson) > -1) {
				// Make an image.
				const image = new Image(); // Equivalent to document.createElement("img");

				// Define a handler for after the image loads.
				image.addEventListener("load", () => {
					// When image finishes loading.
					this.assets[source] = image; // assets["path/to/image.png"] will point to the image.
					onLoad();
				});

				// Define image source so that it starts loading.
				image.src = source;
			} else if (fontExtensions.indexOf(extension) > -1) {
				// Set fontFamily name to font file name.
				const fontFamily = source.split("/").pop().split(".")[0];

				// Append a new @font-face style rule.
				const style = document.createElement('style');
				style.innerHTML = `@font-face{font-family:${fontFamily};src:url(${source});}`;
				document.head.appendChild(style);

				// When font finishes loading.
				onLoad();
			} else if (_audioExtensions.indexOf(extension) > -1) {
				// Load audio.
				const audio = new SoundAsset(this.audioContext, source, onLoad);
				this.assets[source] = audio; // assets["path/to/audio.ogg"] will point to the audio.
			} else if (_jsonExtensions.indexOf(extension) > -1) {
				// JSON.
				const req = new XMLHttpRequest();
				req.open("GET", source);
				req.addEventListener("readystatechange", () => {
					if (req.status != 200 || req.readyState != 4) { return; }
					const json = JSON.parse(req.responseText);
					this.assets[source] = json;
					onLoad();
				});
				req.send();
			}
		}
	}
}

class Camera {
	constructor(umbra) {
		// Parameter checker.
		if (!umbra instanceof Umbra) throw new Error("umbra must be an Umbra.");

		// Save parameter.
		this.umbra = umbra; // Instance of Umbra which this camera is attached to.

		// Setup position and size of viewport.
		this.pos = { x: 0, y: 0 }; // Center position of the screen.
		this.range = { x: umbra.canvas.width, y: umbra.canvas.height }; // View size of camera.
	}
}

class Sprite {
	constructor(umbra) {
		// Parameter checker.
		if (!umbra instanceof Umbra) throw new Error("umbra must be an Umbra.");

		// Save parameter.
		this.umbra = umbra; // The instance of Umbra which this Sprite belongs to.

		// Properties.
		this.pos = { x: 0, y: 0 }; // Global position value. Only set through setPosition().
		this.prev = { x: 0, y: 0 }; // Previous position.
		this.v = { x: 0, y: 0 }; // Velocity.
		this.size = { x: 0, y: 0 }; // Width and height.

		// Setup relationships.
		this.children = []; // Children Sprites.
		this.parent = undefined; // Parent Sprite. Only set through setParent().
		this.layer = 0; // Higher layer values are drawn over lower ones. Only set through setLayer().
		this.childBox = {
			min: { x: 0, y: 0 }, // Upper-left corner of outermost child.
			max: { x: 0, y: 0 } // Bottom-right corner of outermost child.
		};

		// Setup rendering variables.
		this.render = undefined; // Render function. Typically defined by subclasses.
		this.scale = { x: 1, y: 1 }; // Scale.
		this.pivot = { x: 0.5, y: 0.5 }; // Center of rotation for sprite. 0.01 - 0.99.
		this.rotation = 0; // Rotation of sprite in radians (clockwise).
		this.visible = true; // Whether the Sprite is visible.
		this.shadow = {
			enabled: false, // Whether the sprite emits a shadow.
			color: "rgba(100, 100, 100, 0.5)", // Color of the shadow.
			offset: { x: 3, y: 3 }, // Offset of the shadow.
			blur: 3 // Blur of the shadow.
		}
		this.compositeOperation = undefined; // context.globalCompositeOperation to use when rendering this sprite.
		this.alpha = 1; // Opacity value.

		// Setup interactivity variables.
		this.draggable = false; // Whether this sprite can be drag-and-dropped. Only set through setDraggable().
		this.interactive = false; // Whether this sprite can be interacted with by the pointer.
		this.state = "up"; // State of this Sprite in relation to the pointer.
		this.press = undefined; // User-defined function to run on click if interactive.
		this.release = undefined; // User-defined function to run on releasing a click if interactive.
		this.over = undefined; // User-defined function to run on mouseover if interactive.
		this.out = undefined; // User-defined function to run on leaving mouseover if interactive.
		this.tap = undefined; // User-defined function to run on quick click if interactive.
	}

	setPosition = (position) => {
		// Parameter checkers.
		if (!"x" in position) { throw new Error("position must have an x value."); }
		if (!"y" in position) { throw new Error("position must have a y value."); }

		this.prev = this.pos;
		this.pos = position;
	}

	setParent = (parent) => {
		// Parameter checker.
		if (!parent instanceof Sprite && typeof parent != "undefined") { throw new Error("parent must be an instance of Sprite or undefined."); }

		if (this.parent) { this.parent.children.splice(this.parent.children.indexOf(this), 1); }
		this.parent = parent;
		if (this.parent) {
			this.parent.children.push(this);
			this.parent.childBox.min.x = Math.min(this.parent.childBox.min.x, this.x);
			this.parent.childBox.min.y = Math.min(this.parent.childBox.min.y, this.y);
			this.parent.childBox.max.x = Math.max(this.parent.childBox.max.x, this.x + this.width);
			this.parent.childBox.max.y = Math.max(this.parent.childBox.max.y, this.y + this.height);
		}
	}

	setDraggable = (draggable) => {
		// Parameter checker.
		if (typeof draggable != "boolean") { throw new Error("draggable must be a boolean."); }

		this.draggable = draggable;
		if (this.draggable) { this.umbra.draggables.push(this); } else { this.umbra.draggables.splice(this.umbra.draggables.indexOf(this), 1); }
	}

	setLayer = (layer) => {
		// Parameter checker.
		if (typeof layer != "number") { throw new Error("layer must be a number."); }

		this.layer = layer;
		if (this.parent) {
			// Sort parent's children by layer.
			this.parent.children.sort((a, b) => {
				if (a.layer < b.layer) { return -1; }
				return 1;
			});
		}
	}

	setInteractive = (interactive) => {
		// Parameter checker.
		if (typeof interactive != "boolean") { throw new Error("interactive must be a boolean."); }

		this.interactive = interactive;
		if (this.interactive) { this.umbra.clickables.push(this); } else { this.umbra.clickables.splice(this.umbra.clickables.indexOf(this), 1); }
	}

	// Other methods.
	display(offset) {
		// Parameter checker.
		if (typeof offset != "number") { throw new Error("offset must be a number."); }

		// Save context to shorter variable name due to usage frequency here.
		const ctx = this.umbra.context;

		// Check if sprite is visible by the camera.
		if (
			!this.visible || (
				this.pos.x + this.size.x < this.childBox.min.x &&
				this.pos.x > this.childBox.max.x
			) || (
				this.pos.y + this.size.y < this.childBox.min.y &&
				this.pos.y > this.childBox.max.y
			)
		) { return; }

		// Save current context state.
		ctx.save();

		const iPos = { // Get interpolated position of sprite.
			x: (this.pos.x - this.prev.x) * offset + this.prev.x,
			y: (this.pos.y - this.prev.y) * offset + this.prev.y
		};
		const sPos = { // Get screen position of sprite.
			x: iPos.x - (this.umbra.camera.pos.x - this.umbra.camera.range.x / 2),
			y: iPos.y - (this.umbra.camera.pos.y - this.umbra.camera.range.y / 2)
		};

		// Draw the sprite.
		ctx.translate(sPos.x + (this.size.x * this.pivot.x), sPos.y + (this.size.y * this.pivot.y));
		ctx.globalAlpha = this.alpha;
		ctx.rotate(this.rotation);
		ctx.scale(this.scale.x, this.scale.y);

		// Draw the shadow.
		if (this.shadow.enabled) {
			ctx.shadowColor = this.shadow.color;
			ctx.shadowOffsetX = this.shadow.offset.x;
			ctx.shadowOffsetY = this.shadow.offset.y;
			ctx.shadowBlur = this.shadow.blur;
		}

		// Add the blend mode.
		if (this.compositeOperation) { ctx.globalCompositeOperation = this.compositeOperation; }

		// Render the sprite.
		if (this.render) { this.render(); }

		// Display children.
		this.children.forEach((child) => child.display(offset));

		// Restore context after children have been rendered so that they have the same rotation and alpha.
		ctx.restore();
	}
	checkPointer() {
		// Detect if pointer is interacting with clickable.
		// TODO - ga.js line 1629, 1650, 1685
	}
}

// TODO - ga.js line 1182
class RectSprite extends Sprite {
	constructor() { }
}

// TODO - ga.js line 1284
class LineSprite extends Sprite {
	constructor() { }
}

// TODO - ga.js line 1330
class TextSprite extends Sprite {
	constructor() { }
}

// TODO - ga.js line 1468, 1798
class ImageSprite extends Sprite {
	constructor() { }
}

// TODO - ga.js line 2298
class Pointer {
	constructor(umbra) { }

	dragUpdate() {
		// Update drag-and-drop functionality.
		// TODO - ga.js line 2527
	}
}

// TODO - ga.js line 2617
class Key {
	constructor() { }
}

// TODO try mimic SoundAsset with asset loading - ga.js line 1396
class ImageAsset {
	constructor() { }
}

class SoundAsset {
	constructor(context, source, onload) {
		// Parameter checkers.
		if (!context instanceof AudioContext) throw new Error("context must be an AudioContext.");
		if (typeof source != "string") { throw new Error("source must be a string."); }
		if (typeof onload != "function" && typeof onload != "undefined") { throw new Error("onload must be a function or undefined."); }

		// Save parameter.
		this.context = context;

		// Sound nodes.
		this.volumeNode = this.context.createGain(); // Controls volume.
		this.soundNode = null; // Controls everything else.
		this.buffer = null; // Loaded sound data.

		// Load audio.
		const req = new XMLHttpRequest();
		req.open("GET", this.source);
		req.responseType = "arraybuffer";
		req.addEventListener("load", () => {
			this.context.decodeAudioData(req.response, (buffer) => {
				this.buffer = buffer;
				if (onload) { onload(); }
			});
		});
		req.send();
	}

	play() {
		this.soundNode = this.context.createBufferSource();
		this.soundNode.buffer = this.buffer; // Set sound node buffer to loaded sound.

		// Connect sound node to audio output.
		this.soundNode.connect(this.volumeNode); // Enable volume transforms.
		this.volumeNode.connect(this.context.destination);

		// Play the audio.
		this.soundNode.start();
	}
}