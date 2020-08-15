// Umbra game engine by Travis Martin. Based on Ga.

const UMBRA = {}; // Export.

UMBRA.Umbra = class {
	constructor(
			setup, load = undefined, assetPaths = [], fps = 60,
			bounds = { x: window.innerWidth, y: window.innerHeight },
			title = "Umbra", fovDegrees = 45
	) {
		// Setup DOM.
		this.canvas = document.createElement("canvas"); // Canvas.
		this.canvas.style = `width:${bounds.x};height:${bounds.y};background-color:black;touch-action:none;`; // Stylize canvas.
		this.context = this.canvas.getContext("2d"); // 2D context.
		document.title = title;
		document.body.style = `margin:0;`; // Remove default margins on page.
		document.body.appendChild(this.canvas); // Add canvas to page.

		// Public properties.
		this.scene = new UMBRA.Sprite(this);
		this.scene.size = { x: this.canvas.width, y: this.canvas.height };
		this.drag = false; // Whether or not drag-and-drop is enabled.
		this.draggables = []; // Sprites that can be drag-and-dropped.
		this.clickables = []; // Sprites that can be clicked.
		this.tweens = []; // Tweening functions.
		this.state = undefined; // Game state.
		this.load = load; // Load state.
		this.setup = setup; // Setup state.
		this.assetPaths = assetPaths; // Paths to assets that must be loaded.
		this.paused = false; // Whether the game is paused.
		this.interpolate = true; // Sprite rendering position interpolation.
		this.updateFunctions = []; // Functions to run inside of the main update game loop.

		// Private properties.
		let _fps = fps; // See fps.
		let _startTime = Date.now(); // See fps.
		let _frameDuration = 1000 / _fps; // See fps.
		let _lag = 0; // Lag offset used to render sprites.

		// Private methods.
		const _gameLoop = () => {
			// Loop.
			requestAnimationFrame(gameLoop, this.canvas);

			// Timer stuff.
			const now = Date.now();
			const elapsed = now - _startTime;
			if (elapsed > 1000) { elapsed = _frameDuration; }
			_startTime = now;
			_lag += elapsed;

			// Update frame while lag duration is greater than frame duration.
			while (_lag >= _frameDuration) {
				_update();
				_lag -= _frameDuration;
			}

			// Render scene.
			this.scene.render(_lag / _frameDuration);
		}
		const _update = () => {
			if (this.clickables.length > 0) {
				this.canvas.style.cursor = "auto";
				for (let i = this.clickables.length - 1; i >= 0; i--) {
					const clickable = this.clickables[i];
					clickable.update()
				}
			}
		}
	}

	get fps() { return _fps; }
	set fps(value) {
		_fps = value; // Frames per second.
		_startTime = Date.now(); // Start time for this frame. For interpolation.
		_frameDuration = 1000 / _fps; // Duration in milliseconds of a frame.
	}
}

UMBRA.Sprite = class {
	constructor(umbra) {
		// Public properties.
		this.v = { x: 0, y: 0 }; // Velocity of sprite.
		this.size = { x: 0, y: 0 }; // Width and height of sprite.
		this.scale = { x: 1, y: 1 }; // Width and height scale of sprite.
		this.pivot = { x: 0.5, y: 0.5 }; // Center of rotation of sprite.
		this.rotation = 0; // Rotation of sprite.
		this.visible = true; // Visibility of sprite.
		this.shadow = {
			visible: false, // Whether the sprite emits a shadow.
			color: "rgba(100, 100, 100, 0.5)", // Color of sprite's shadow.
			offset: { x: 3, y: 3 }, // Offset of sprite's shadow.
			blur: 3 // Blur of sprite's shadow.
		};
		this.alpha = 1; // Opacity of sprite.
		this.layer = 0; // Depth layer of sprite. Higher values go over lower values.
		this.children = []; // Sprites that have this sprite as a parent.

		// Private properties.
		let _pos = { x: 0, y: 0 }; // See pos.
		let _parent = undefined; // See parent.
		let _draggable = false; // See draggable.
		let _interactive = false; // See interactive.
		let _prevPos = { x: 0, y: 0 }; // Position of sprite last frame.
		let _renderPos = { x: 0, y: 0 }; // Render position of sprite.
	}

	// Position of sprite relative to parent.
	get pos() { return _pos; }
	set pos(value) {
		_prevPos = _pos;
		_pos = value;
	}

	// Global position of sprite.
	get gPos() {
		if (_parent) { return { x: _pos.x + _parent.x, y: _pos.y + _parent.y }; }
		return _pos;
	}

	// Parent of sprite.
	get parent() { return _parent; }
	set parent(value) {
		if (_parent) { _parent.children.splice(_parent.children.indexOf(this), 1); }
		_parent = value;
		if (_parent) { _parent.children.push(this); }
	}

	// Whether the sprite can be drag-and-dropped.
	get draggable() { return _draggable; }
	set draggable(value) {
		_draggable = value;
		if (value) {
			umbra.draggables.push(this);
			umbra.drag = true;
		} else { umbra.draggables.splice(umbra.draggables.indexOf(this), 1); }
	}

	// Whether the sprite is clickable.
	get interactive() { return _interactive; }
	set interactive(value) {
		_interactive = value;
		if (value) {
			umbra.clickables.push(this);
		} else { umbra.clickables.splice(umbra.clickables.indexOf(this), 1); }
	}

	render(lagOffset) {
		if (!(
				this.visible &&
				this.gPos.x < umbra.canvas.width + this.size.x &&
				this.gPos.x + this.size.x >= -this.size.x &&
				this.gPos.y < umbra.canvas.height + this.size.y &&
				this.gPos.y + this.size.y >= -this.size.y
		)) { return; } // Don't render if not visible on screen.

		if (umbra.interpolate) {
			_renderPos = {
					x: (_pos.x - _prevPos.x) * lagOffset + _prevPos.x,
					y: (_pos.y - _prevPos.y) * lagOffset + _prevPos.y
			};
		} else { _renderPos = _pos; }

		// TODO
	}
}

UMBRA.Pointer = class {
	constructor(umbra) {
		// Public properties.
		this.press = undefined; // User-definable press function.
		this.release = undefined; // User-definable release function.
		this.tap = undefined; // User-definable tap function.

		// Private properties.
		let _pos = { x: 0, y: 0 }; // Position of pointer.
		let _down = false; // Whether the pointer is being held down.
		let _tapped = false; // Whether the pointer was down for a short moment.
		let _downTime = undefined; // Time pointer became held down.
		let _elapsedTime = 0; // Time pointer has currently been held down.
		let _draggedSprite = null; // Currently drag-and-dropping sprite.
		let _dragOffset = { x: 0, y: 0 }; // Offset of currently drag-and-dropping sprite.

		// Private methods.
		const _eventPosition = (e) => { // Returns position of pointer event.
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
		const _moveHandler = (e) => {
			_pos = _eventPosition(e);
			e.preventDefault(); // Prevent the user from selecting the canvas.
		}
		const _downHandler = (e) => {
			_pos = _eventPosition(e);
			_down = true;
			_tapped = false;
			_downTime = Date.now();
			if (this.press) { this.press(); } // Run user-defined press function.
			e.preventDefault(); // Prevent the user from selecting the canvas.
		}
		const _upHandler = (e) => {
			_elapsedTime = Math.abs(_downTime - Date.now());
			if (_elapsedTime <= 200) { // Counts as a tap if less than 200ms.
				_tapped = true;
				if (this.tap) { this.tap(); } // Run user-defined tap function.
			}
			_down = false;
			if (this.release) { this.release(); } // Run user-defined release function.
			e.preventDefault(); // Prevent the user from selecting the canvas.
		}

		// Bind handlers for mouse events.
		umbra.canvas.addEventListener("mousemove", _moveHandler); // Mouse move.
		umbra.canvas.addEventListener("touchmove", _moveHandler); // Touchscreen move.
		umbra.canvas.addEventListener("mousedown", _downHandler); // Mouse down.
		umbra.canvas.addEventListener("touchstart", _downHandler); // Touchscreen down.
		window.addEventListener("mouseup", _upHandler); // Mouse up.
		window.addEventListener("touchend", _upHandler); // Touchscreen up.
	}

	get pos() { return _pos; }
	get down() { return _down; }
	get tapped() { return _tapped; }
	get elapsedTime() { return _elapsedTime; }
	get draggedSprite() { return _draggedSprite; }
	get dragOffset() { return _dragOffset; }

	touchingSprite(sprite) {
		return
				_pos.x > sprite.gPos.x &&
				_pos.x < sprite.gPos.x + sprite.size.x &&
				_pos.y > sprite.gPos.y &&
				_pos.y < sprite.gPos.y + sprite.size.y;
	}

	dragUpdate() {
		if (_down) {
			if (_draggedSprite) {
				// Move currently dragged sprite.
				_draggedSprite.pos = { x: _pos.x - _dragOffset.x, y: _pos.y - _dragOffset.y };
			} else {
				// Acquire a new dragged sprite.
				for (let i = umbra.draggables.length; i >= 0; i++) { // Iterate backwards to get the top sprite.
					const sprite = umbra.draggables[i];
					if (sprite.draggable && this.touchingSprite(sprite)) {
						_dragOffset = { x: _pos.x - sprite.gPos.x, y: _pos.y - sprite.gPos.y };
						_draggedSprite = sprite;
						sprite.parent = sprite.parent; // Moves the sprite to the end of its parent's children array.
						umbra.draggables.splice(umbra.draggables.indexOf(sprite), 1);
						umbra.draggables.push(sprite); // Does the same thing to the draggable sprites array.
						break;
					}
				}
			}
		} else { _draggedSprite = null; } // Drop dragged sprite if pointer is up.

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

UMBRA.Key = class {
	constructor(code) {
		// Public properties.
		this.code = code; // ASCII key code.
		this.press = undefined; // User-definable press function.
		this.release = undefined; // User-definable release function.

		// Private properties.
		let _down = false; // Whether the key is being held down.

		// Keydown event handler.
		window.addEventListener("keydown", (e) => {
			if (e.keyCode != this.code) { return; }
			if (!_down && this.press) { this.press(); } // Run user-defined press function.
			_down = true;
			e.preventDefault();
		});

		// Keyup event handler.
		window.addEventListener("keyup", (e) => {
			if (e.keyCode != this.code) { return; }
			if (_down && this.release) { this.release(); } // Run user-defined release function.
			_down = false;
			e.preventDefault();
		});
	}

	get down() { return _down; }
}

exports = UMBRA;