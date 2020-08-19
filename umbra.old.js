class Umbra {
	constructor(setup, title = "Umbra", assetPaths = [], fps = 60, bounds = { x: innerWidth, y: innerHeight }) {
		// Save parameters.
		this.setup = setup; // The function to be run after all assets are loaded and the game loop has started. The starting point for a game.
		this.assetPaths = assetPaths; // Paths to files that are to be loaded as assets.
		this.frameDuration = 1000 / fps; // The duration of a frame in milliseconds.

		// Setup document.
		document.title = title;
		document.body.style = "margin:0;";

		// Setup canvas.
		this.canvas = document.createElement("canvas"); // The canvas that the game is drawn on.
		this.context = this.canvas.getContext("2d"); // The context that the game is drawn on.
		this.canvas.style = `width:${bounds.x};height:${bounds.y};background-color:#000;touch-action:none;`;
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
		this.camera = new Camera(this.canvas); // The main viewpoint from which the game is rendered.

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

			// Progress bar. Requires RectSprite.
			// TODO - plugins.js line 2102.


			if (loaded >= this.assetPaths.length) {
				this.state = undefined;
				if (this.setup) { this.setup(); } // Run setup method when all assets are loaded.
			}
		}

		// Load assets.
		for (let i = 0; i < this.assetPaths.length; i++) {
			const source = this.assetPaths[i];
			const extension = source.split('.').pop();

			if (imageExtensions.indexOf(extension) > -1) {
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
			} else if (audioExtensions.indexOf(extension) > -1) {
				// Load audio.
				const audio = new SoundAsset(this.audioContext, source, onLoad);
				this.assets[source] = audio; // assets["path/to/audio.ogg"] will point to the audio.
			} else if (jsonExtensions.indexOf(extension) > -1) {
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
	constructor(canvas) {
		// Setup position and size of viewport.
		this.pos = { x: 0, y: 0 }; // Center position of the screen.
		this.range = { x: canvas.width, y: canvas.height }; // View size of camera.
	}
}

class Sprite {
	constructor(umbra) {
		// Save parameter.
		this.umbra = umbra; // The instance of Umbra which this Sprite belongs to.

		// Properties.
		this.pos = { x: 0, y: 0 }; // Global position value. Only set through setPosition().
		this.prev = undefined; // Previous position.
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
		this.sPos = { x: 0, x: 0 }; // Position on screen.
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
		if (this.prev) { this.prev = this.pos; } else { this.prev = position; }
		this.pos = position;
	}

	setScreenPosition = (position) => {
		const camera = this.umbra.camera;
		this.setPosition({
			x: (camera.pos.x - camera.range.x) + position.x,
			y: (camera.pos.y - camera.range.y) + position.y
		});
	}

	setParent = (parent) => {
		if (this.parent) {
			this.parent.children.splice(this.parent.children.indexOf(this), 1);
			this.parent.children.forEach((child) => child.setParent(this.parent)); // Redefine childBox recursively.
		}
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
		this.draggable = draggable;
		if (this.draggable) { this.umbra.draggables.push(this); } else { this.umbra.draggables.splice(this.umbra.draggables.indexOf(this), 1); }
	}

	setLayer = (layer) => {
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
		this.interactive = interactive;
		if (this.interactive) { this.umbra.clickables.push(this); } else { this.umbra.clickables.splice(this.umbra.clickables.indexOf(this), 1); }
	}

	// Other methods.
	display(offset) {
		// Save variables to shorter name due to usage frequency here.
		const ctx = this.umbra.context;
		const cam = this.umbra.camera;

		// Check if sprite is visible by the camera.
		if (
			!this.visible ||
			this.childBox.min.x > cam.pos.x + cam.range.x ||
			this.childBox.max.x < cam.pos.x ||
			this.childBox.min.y > cam.pos.y + cam.range.y ||
			this.childBox.max.y < cam.pos.y
		) { return; }

		// Save current context state.
		ctx.save();

		// Get screen position.
		let iPos;
		if (this.prev) {
			iPos = { // Get interpolated position of sprite.
				x: (this.pos.x - this.prev.x) * offset + this.prev.x,
				y: (this.pos.y - this.prev.y) * offset + this.prev.y
			};
		} else { iPos = this.pos; }
		this.sPos = { // Get screen position of sprite.
			x: iPos.x - (this.umbra.camera.pos.x - this.umbra.camera.range.x / 2),
			y: iPos.y - (this.umbra.camera.pos.y - this.umbra.camera.range.y / 2)
		};

		// Temporary log.
		if (this != this.umbra.scene) {
			console.log(`
					Display:\n\t
					Position: (${this.pos.x}, ${this.pos.y})\n\t
					Previous position: (${this.prev})\n\t
					Interpolated position: (${iPos.x}, ${iPos.y})\n\t
					Screen position: (${this.sPos.x}, ${this.sPos.y})\n\t
			`);
		}

		// Draw the sprite.
		ctx.translate(this.sPos.x + (this.size.x * this.pivot.x), this.sPos.y + (this.size.y * this.pivot.y));
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

class Shape extends Sprite {
	constructor (umbra) {
		super(umbra);

		// Render properties.
		this.clip = false;
		this.color = "#fff";
		this.outlineColor = "#fff";
		this.outlineThickness = 0;

		// Add to scene.
		this.setParent(this.umbra.scene);
	}
}

class RectSprite extends Shape {
	constructor(umbra) {
		super(umbra);

		// Make render function.
		super.render = () => {
			const context = this.umbra.context; // Shorten due to call frequency.

			context.strokeStyle = this.outlineColor;
			context.lineWidth = this.outlineThickness;
			context.fillStyle = this.color;
			context.beginPath();

			// Draw rectangle around the context's center point.
			context.rect(-this.size.x * this.pivot.x, -this.size.y * this.pivot.y, this.size.x, this.size.y);
			if (this.clip) { context.clip(); } else {
				if (this.outlineColor) { context.stroke(); }
				if (this.color) { context.fill(); }
			}
		}
	}
}

class CircleSprite extends Shape {
	constructor(umbra) {
		super(umbra);

		super.render = () => {
			const context = this.umbra.context; // Shorten due to call frequency.

			// Setup size variables.
			const d = Math.max(this.size.x, this.size.y);
			const r = d / 2;

			context.strokeStyle = this.outlineColor;
			context.lineWidth = this.outlineThickness;
			context.fillStyle = this.color;
			context.beginPath();

			context.arc(r + (-d * this.pivot.x), r + (-d * this.pivot.y), r, 0, 2 * Math.PI);
			if (this.clip) { context.clip(); } else {
				if (this.outlineColor) { context.stroke(); }
				if (this.color) { context.fill(); }
			}
		}
	}
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

class Pointer {
	constructor(umbra) {
		// Save parameter.
		this.umbra = umbra; // Umbra instance that this pointer belongs to.

		// Pointer state variables.
		this.pos = { x: 0, y: 0 }; // Position of pointer.
		this.down = false; // Whether the pointer is being held down.
		this.tapped = false; // Whether the pointer was down for a short moment.
		this.downTime = undefined; // Time pointer became held down.
		this.elapsedTime = 0; // Time pointer has currently been held down.

		// Pointer events.
		this.press = undefined; // User-definable press function.
		this.release = undefined; // User-definable release function.
		this.tap = undefined; // User-definable tap function.

		// Drag-and-drop variables.
		this.draggedSprite = null; // Currently drag-and-dropping sprite.
		this.dragOffset = { x: 0, y: 0 }; // Offset of currently drag-and-dropping sprite.

		// Private methods.
		const eventPosition = (e) => { // Returns position of pointer event.
			if (e.targetTouches) {
				return {
						x: e.targetTouches[0].pageX - umbra.canvas.offsetLeft,
						y: e.targetTouches[0].pageY - umbra.canvas.offsetTop
				};
			}
			return {
					x: e.pageX - e.target.offsetLeft,
					y: e.pageY - e.target.offsetTop
			};
		}
		const moveHandler = (e) => {
			this.pos = eventPosition(e);
			e.preventDefault(); // Prevent the user from selecting the canvas.
		}
		const downHandler = (e) => {
			this.pos = eventPosition(e);
			this.down = true;
			this.tapped = false;
			this.downTime = Date.now();
			if (this.press) { this.press(); } // Run user-defined press function.
			e.preventDefault(); // Prevent the user from selecting the canvas.
		}
		const upHandler = (e) => {
			this.elapsedTime = Math.abs(this.downTime - Date.now());
			if (this.elapsedTime <= 200) { // Counts as a tap if less than 200ms.
				this.tapped = true;
				if (this.tap) { this.tap(); } // Run user-defined tap function.
			}
			this.down = false;
			if (this.release) { this.release(); } // Run user-defined release function.
			e.preventDefault(); // Prevent the user from selecting the canvas.
		}

		// Bind handlers for mouse events.
		umbra.canvas.addEventListener("mousemove", moveHandler); // Mouse move.
		umbra.canvas.addEventListener("touchmove", moveHandler); // Touchscreen move.
		umbra.canvas.addEventListener("mousedown", downHandler); // Mouse down.
		umbra.canvas.addEventListener("touchstart", downHandler); // Touchscreen down.
		window.addEventListener("mouseup", upHandler); // Mouse up.
		window.addEventListener("touchend", upHandler); // Touchscreen up.
	}

	touchingSprite(sprite) {
		return
				this.pos.x > sprite.sPos.x &&
				this.pos.x < sprite.sPos.x + sprite.size.x &&
				this.pos.y > sprite.sPos.y &&
				this.pos.y < sprite.sPos.y + sprite.size.y;
	}

	dragUpdate() {
		if (this.down) {
			if (this.draggedSprite) {
				// Move currently dragged sprite.
				this.draggedSprite.setScreenPosition({ x: this.pos.x - this.dragOffset.x, y: this.pos.y - this.dragOffset.y });
			} else {
				// Acquire a new dragged sprite.
				for (let i = this.umbra.draggables.length; i >= 0; i++) { // Iterate backwards to get the top sprite.
					const sprite = this.umbra.draggables[i];
					if (sprite.draggable && this.touchingSprite(sprite)) {
						this.dragOffset = { x: this.pos.x - sprite.sPos.x, y: this.pos.y - sprite.sPos.y };
						this.draggedSprite = sprite;
						sprite.setParent(sprite.parent); // Moves the sprite to the end of its parent's children array.
						umbra.draggables.splice(umbra.draggables.indexOf(sprite), 1);
						umbra.draggables.push(sprite); // Does the same thing to the draggable sprites array.
						break;
					}
				}
			}
		} else { this.draggedSprite = null; } // Drop dragged sprite if pointer is up.

		// Change mouse to a hand if it's over a draggable sprite.
		umbra.draggables.some((sprite) => {
			if (sprite.draggable && this.touchingSprite(sprite)) {
				umbra.canvas.style.cursor = "pointer";
				return true;
			} else {
				umbra.canvas.style.cursor = "auto";
				return false;
			}
		});
	}
}

class Key {
	constructor(code) {
		// State properties.
		this.down = false; // Whether the key is being held down.

		// User-defined functions.
		this.press = undefined; // Keypress function.
		this.release = undefined; // Key release function.

		// Events
		window.addEventListener("keydown", (e) => {
			if (e.keyCode != code) { return; }
			if (!this.down && this.press) { this.press(); } // Run user-defined press function.
			this.down = true;
			e.preventDefault();
		});

		// Keyup event handler.
		window.addEventListener("keyup", (e) => {
			if (e.keyCode != code) { return; }
			if (this.down && this.release) { this.release(); } // Run user-defined release function.
			this.down = false;
			e.preventDefault();
		});
	}
}

// TODO try mimic SoundAsset with asset loading - ga.js line 1396
class ImageAsset {
	constructor() { }
}

class SoundAsset {
	constructor(context, source, onload) {
		// Save parameter.
		this.context = context;

		// Sound nodes.
		this.volumeNode = this.context.createGain(); // Controls volume.
		this.soundNode = null; // Controls everything else.
		this.buffer = null; // Loaded sound data.

		// Load audio.
		const req = new XMLHttpRequest();
		req.open("GET", source);
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