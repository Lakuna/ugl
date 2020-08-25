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
// UTAGDEF SIZE POINTER ???

// UTAGDEF DESC KEYBOARD Keyboard input from the user.
// UTAGDEF SIZE KEYBOARD ???

// UTAGDEF DESC ASSETS Import JSON objects from files.
// UTAGDEF SIZE ASSETS ???

// UTAGDEF DESC RECT Rectangle preset object type.
// UTAGDEF REQU RECT GRAPHICS
// UTAGDEF SIZE RECT ???

// UTAGDEF DESC CIRCLE Circle preset object type.
// UTAGDEF REQU CIRCLE GRAPHICS
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
			x = 0, // First value.
			y = 0 // Second value.
	) {
		this.x = x;
		this.y = y;

		this.translate = (offset) => {
			this.x += offset.x;
			this.y += offset.y;
		}

		Object.defineProperties(this, {
			range: { get: () => Math.abs(this.x - this.y) }
		});
	}
}

class Bounds {
	// Used to specify a range between two points.
	constructor(
			min = new Vector2(), // First point.
			max = new Vector2() // Second point.
	) {
		this.min = min;
		this.max = max;

		// Check if the boundary contains a point.
		this.contains = (point) => {
			return point.x >= this.min.x && point.x <= this.max.x && point.y >= this.min.y && point.y <= this.max.y;
		}

		// Check if the boundary shares any points with another boundary.
		this.intersects = (boundary) => {
			return boundary.min.x <= this.max.x && boundary.max.x >= this.min.x && boundary.min.y <= this.max.y && boundary.max.y >= this.min.y;
		}

		// Move all corners of the bounds.
		this.translate = (offset) => {
			this.min.translate(offset);
			this.max.translate(offset);
		}

		Object.defineProperties(this, {
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
			}
		});
	}
}

class Umbra {
	// An instance of a game.
	constructor(
			_setup, // The function to run when the framework is ready.
			_loadState, // The function to use as the state while loading.
			_title = "Umbra", // The title of the window.
			_assetPaths = [], // List of paths to assets that should be loaded.
			_fps = 60, // Target frames per second of the game loop.
			_size = new Vector2(innerWidth, innerHeight) // The size of the canvas.
	) {
		// Define global instance.
		Umbra.instance = this;

		// Game state properties.
		this.state; // The main function to run in the game loop.
		this.isPaused = false; // Whether the game loop should run the main function.

		// Frame time properties.
		let _lastFrameTime = Date.now(); // Time that the last frame happened.
		let _frameDuration = _fps / 1000; // Target duration of one frame.
		let _lag = 0; // Lag time to be made up for with updates.

		// Game loop properties.
		this.updates = []; // Updates to be run in the game loop.

		// The main game loop.
		this.gameLoop = () => {
			requestAnimationFrame(this.gameLoop, this.canvas);

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

			this.camera.render(_lag / _frameDuration);
		}

		// Setup document.
		document.title = _title;
		document.body.style = "margin:0;";
		// UTAGSET END REQUIRED

		// UTAGSET START GRAPHICS
		// Canvas setup.
		this.canvas = document.createElement("canvas"); // The canvas on which the game is rendered.
		this.context = this.canvas.getContext('2d'); // The context of the canvas on which the game is rendered.
		this.canvas.style = `background-color:#000;touch-action:none;`;
		this.canvas.width = _size.x;
		this.canvas.height = _size.y;
		document.body.appendChild(this.canvas);
		this.scene = new UObject(); // The scene to render on the canvas.
		this.camera; // The main camera from which to render the canvas. Defined after canvas is made public.
		// UTAGSET END GRAPHICS

		// UTAGSET START AUDIO
		this.actx = new AudioContext();
		if (this.actx.state == "suspended") {
			// Create a button to ask the user to enable audio.
			const _button = document.createElement("button");
			_button.style = "position:fixed;top:0;left:0;width:10%;height:10%;";
			_button.innerHTML = "Click to enable audio.";
			_button.onclick = () => this.actx.resume().then(() => document.body.removeChild(_button));
			document.body.appendChild(_button);
		}
		// UTAGSET END AUDIO

		// UTAGSET START POINTER
		// Unified mouse and touchscreen input.
		this.pointer; // The main pointer.
		this.interactableObjects = []; // List of all objects that can be interacted with.
		// UTAGSET END POINTER

		// UTAGSET START ASSETS
		// Loading assets from files.
		this.assets = { }; // Object with references to all loaded assets.
		// UTAGSET END ASSETS

		// Start the framework.
		this.start = () => { // UTAGSET LINE REQUIRED
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
			} // UTAGSET LINE ASSETS

			// UTAGSET START REQUIRED
			// Start the game loop.
			this.gameLoop();
		}
		// UTAGSET END REQUIRED

		// UTAGSET START GRAPHICS
		// Define camera after canvas is made public.
		this.camera = new UCamera();
		// UTAGSET END GRAPHICS

		// UTAGSET START POINTER
		// Define pointer after canvas is made public.
		this.pointer = new UPointer();
		// UTAGSET END POINTER
	} // UTAGSET LINE REQUIRED
} // UTAGSET LINE REQUIRED

// UTAGSET START GRAPHICS
class UCamera {
	constructor(
			bounds = new Bounds(new Vector2(), new Vector2(Umbra.instance.canvas.width, Umbra.instance.canvas.height)) // The default boundaries of the camera.
	) {
		this.bounds = bounds;

		// Convert a screen point to a global point.
		this.sPToG = (point) => {
			const offset = this.bounds.min;

			return new Vector2(
					(point.x / this.scale.x) + offset.x,
					(point.y / this.scale.y) + offset.y
			);
		}

		// Convert a global point to a screen point.
		this.gPToS = (point) => {
			const offset = this.bounds.min;

			return new Vector2(
					(point.x - offset.x) * this.scale.x,
					(point.y - offset.y) * this.scale.y
			);
		}

		// Convert a screen bounds to a global bounds.
		this.sBToG = (bounds) => {
			return new Bounds(this.sPToG(bounds.min), this.sPToG(bounds.max));
		}

		// Convert a global bounds to a screen bounds.
		this.gBToS = (bounds) => {
			return new Bounds(this.gPToS(bounds.min), this.gPToS(bounds.max));
		}

		// Render all UObjects within the bounds.
		this.render = (offset) => {
			const canvas = Umbra.instance.canvas;
			Umbra.instance.context.clearRect(0, 0, canvas.width, canvas.height);

			Umbra.instance.scene.display(offset);
		}

		Object.defineProperties(this, {
			scale: { get: () => new Vector2(Umbra.instance.canvas.width / this.bounds.width, Umbra.instance.canvas.height / this.bounds.height) }
		});
	}
}

class UShadow {
	constructor(
			color = "rgba(100, 100, 100, 0.5)", // Color of the shadow.
			offset = new Vector2(3, 3), // Offset of the shadow from the caster.
			blur = 3 // Blur value.
	) {
		this.color = color;
		this.offset = offset;
		this.blur = blur;
	}
}

class UObject {
	constructor(
			_bounds = new Bounds(), // Min and max coordinates of object.
			_parent = undefined // Parent object.
	) {
		// Rendering properties.
		this.isActive = true; // Whether the object should be rendered.
		let _layer = 0; // The z-layer of the object. Higher values are displayed over lower ones.
		this.doClip = false; // Whether to use this object to clip the context.
		this.fillColor = "white"; // Color to fill the object.
		this.lineColor = "white"; // Color of the object's outline.
		this.lineWidth = 1; // Width of the object's outline.

		// Move object.
		this.translate = (offset) => {
			this.bounds.translate(offset);

			// Reposition children and resize childbox.
			this.childBox = this.bounds;
			this.children.forEach((child) => {
				child.translate(offset);
				this.childBox.min.x = Math.min(this.childBox.min.x, child.childBox.min.x);
				this.childBox.min.y = Math.min(this.childBox.min.y, child.childBox.min.y);
				this.childBox.max.x = Math.max(this.childBox.max.x, child.childBox.max.x);
				this.childBox.max.y = Math.max(this.childBox.max.y, child.childBox.max.y);
			});
		}

		// Parent-child hierarchy properties.
		this.children = []; // List of children.
		this.childBox = this.bounds; // Bounds of this object and its children.
		if (this.parent) { this.parent.children.push(this); } // Add to parent's children array.

		// Display the sprite on the canvas.
		this.display = (offset) => {
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
		this.render; // Function to use when rendering the object.
		// UTAGSET END GRAPHICS

		// UTAGSET START ADVGRAPH
		// Advanced rendering properties.
		this.scale = new Vector2(1, 1); // Width/height multiplier.
		this.shadow; // Shadow cast by the object.
		this.compositeOperation; // Global composite operation used when rendering this object.
		this.alpha = 1; // Opacity.
		// UTAGSET END ADVGRAPH

		// UTAGSET START GRAPHICS
		// Interactability properties.
		this.isDown = false;
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
					const offset = new Vector2(value.min.x - this.bounds.min.x, value.min.y - this.bounds.min.y);
					this.translate(offset);
				}
			},
			layer: {
				get: () => _layer,
				set: (value) => {
					_layer = value;

					// Sort children by layer.
					this.parent.children.sort((a, b) => a.layer < b.layer ? -1 : 1);
				}
			},
			parent: {
				get: () => _parent,
				set: (value) => {
					if (this.parent) { this.parent.children.splice(this.parent.children.indexOf(this), 1); }
					_parent = value;
					if (this.parent) { this.parent.children.push(this); }
				}
			},
			onClick: {
				get: () => _onClick,
				set: (value) => {
					_onClick = value;
					_addToInteractables();
				}
			},
			onRelease: {
				get: () => _onRelease,
				set: (value) => {
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

		this.lineJoin; // How the context should join the line.

		// Set render function.
		this.render = (ctx) => {
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
			text, // Text displayed on the object.
			_bounds = new Bounds(), // Passed to UObject parent constructor.
			_parent = Umbra.instance.scene // Passed to UObject parent constructor.
	) {
		super(_bounds, _parent);

		this.text = text;

		// Display properties.
		this.font = "20px courier"; // String representation of the font.
		this.baseline = "top"; // Baseline.

		this.render = (ctx) => {
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
			source, // Image source.
			frameSize = new Vector2() // Dimensions of one frame on the spritesheet.
	) {
		this.source = source;
		this.frameSize = frameSize;

		// Spritesheet properties.
		this.positions = []; // Corner point of each frame.
		this.size = new Vector2(this.source.width / this.frameSize.x, this.source.height / this.frameSize.y); // Number of columns, rows in the spritesheet.

		// Find frame positions.
		for (var x = 0; x < this.size.x; x++) {
			for (var y = 0; y < this.size.y; y++) { this.positions.push(new Vector2(x * this.frameSize.x, y * this.frameSize.y)); }
		}
	}
}

class USprite extends UObject {
	constructor(
			sheet, // The spritesheet to draw frames from.
			_bounds = new Bounds(), // Passed to UObject parent constructor.
			_parent = Umbra.instance.scene // Passed to UObject parent constructor.
	) {
		super(_bounds, _parent);

		this.sheet = sheet;

		// Display properties.
		let _doLoop = false; // Whether to run the animation on a loop.
		this.loopRange = new Vector2(0, _sheet.positions.length); // Range of frames between which to loop.
		this.fps = 1; // Spritesheet frames per second when animated.
		let _frame = 0; // Index of the current frame in the spritesheet.
		let _current = _sheet.positions[_frame]; // Set current coordinates on the sheet.
		let _interval; // Interval for animation.

		Object.defineProperties(this, {
			doLoop: {
				get: () => _doLoop,
				set: (value) => {
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
			frame: {
				get: () => _frame,
				set: (value) => {
					_frame = value;

					// Set current position.
					_current = this.sheet.positions[this.frame];
				}
			}
		});

		this.render = (ctx) => {
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
		this.pos = new Vector2(); // The position of the pointer on the screen.
		this.isDown = false; // Whether the pointer is being held down.
		this.isTapped = false; // Whether the pointer was tapped.
		const _canvas = Umbra.instance.canvas; // Shorten to reduce character count.

		// User-defined event functions.
		this.onPress; // Pointer became pressed.
		this.onRelease; // Pointer stopped being pressed.

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
			this.pos = _eventPosition(e);
			e.preventDefault(); // Prevent the user from selecting the canvas.
		}
		const _downHandler = (e) => {
			this.pos = _eventPosition(e);
			this.isDown = true;
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
			this.isDown = false;
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
		this.isTouching = (object) => {
			return Umbra.instance.camera.gBToS(object.bounds).contains(this.pos);
		}
	}
}
// UTAGSET END POINTER

// UTAGSET START KEYBOARD
class UKey {
	constructor(
			_code // ASCII key code.
	) {
		// State properties.
		this.isDown = false; // Whether the key is being held down.

		// User-defined event functions.
		this.onPress; // Key is pressed.
		this.onRelease; // Key is released.

		// Event handlers.
		window.addEventListener("keydown", (e) => {
			if (e.keyCode != _code) { return; }
			if (!this.isDown && this.onPress) { this.onPress(); }
			this.isDown = true;
			e.preventDefault();
		});
		window.addEventListener("keyup", (e) => {
			if (e.keyCode != _code) { return; }
			if (this.isDown && this.onRelease) { this.onRelease(); }
			this.isDown = false;
			e.preventDefault();
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
		// Setup nodes.
		let _actx = Umbra.instance.actx;
		this.delay = _actx.createDelay(); // Delay node.
		this.delay.delayTime.value = _delayValue;
		this.feedback = _actx.createGain(); // Feedback gain node.
		this.feedback.gain.value = _feedbackValue;
		this.filter = _actx.createBiquadFilter(); // Biquad filter node.
		this.filter.frequency.value = _filterValue;
	}
}
// UTAGSET END ADVAUDIO

// UTAGSET START AUDIO
class USound {
	constructor(
			_source, // Path to the source file.
			_onLoad // Function to run when file is loaded.
	) {
		// Audio properties.
		const _actx = Umbra.instance.actx; // Bound audio context.
		this.volume = _actx.createGain(); // Volume node.
		this.sound; // Audio source.
		let _buffer; // Audio data.
		let _isPlaying = false; // Whether the audio is playing.
		// UTAGSET END AUDIO

		// UTAGSET START ADVAUDIO
		// Advanced audio properties.
		this.pan = _actx.createPanner(); // Controls audio in 3D space.
		this.convolver = _actx.createConvolver(); // Adds convolution effects.
		this.echo; // Echo properties.
		this.reverb; // Reverb audio buffer.
		// UTAGSET END ADVAUDIO

		// UTAGSET START AUDIO
		Object.defineProperties(this, {
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
			}
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
