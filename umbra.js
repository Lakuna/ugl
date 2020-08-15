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
	constructor(_setup, _title = "Umbra", _assetPaths = [], _fps = 60, _bounds = { x: innerWidth, y: innerHeight }) {
		// Parameter checkers.
		// if (typeof _setup != "function") { throw new Error("_setup must be a function."); }
		// if (typeof _title != "string") { throw new Error("_title must be a string."); }
		// if (!Array.isArray(_assetPaths)) { throw new Error("_assetPaths must be an array."); }
		// if (typeof _fps != "number") { throw new Error("_fps must be a number"); }
		// if (typeof _bounds != "object") { throw new Error("_bounds must be an object."); }

		// Public properties.
		this.canvas = document.createElement("canvas");
		this.context = this.canvas.getContext("2d");
		this.scene = new Sprite(this);
		this.pointer = new Pointer(this);
		this.draggables = []; // Drag-and-drop-enabled sprites.
		this.clickables = []; // Click-enabled sprites.
		this.state = undefined; // Game state.
		this.updates = []; // Functions to run inside of the main game loop.

		// Private properties.
		let _startTime = Date.now(); // Start time of the current frame.
		const _frameDuration = 1000 / _fps; // Duration of a frame in milliseconds.
		let _lag = 0; // Time to make up for with updates.

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

			// Run current state function.
			if (this.state) { this.state(); } // TODO see if this is actually necessary.

			// Run user-defined update functions.
			this.updates.forEach(update => update());
		}

		// Setup.
		document.title = _title;
		document.body.style = `margin:0;`;
		document.body.appendChild(this.canvas);
		this.canvas.style = `width:${_bounds.x};height:${_bounds.y};background-color:black;touch-action:none;`;
		this.scene.size = { x: this.canvas.width, y: this.canvas.height };
	}

	// Getter methods.

	// Setter methods.

	// Other methods.
	start() {
		// Start the game.
		// TODO - ga.js line 373, 2071
	}
}

// TODO make sprite class. Most of the original can be left out. Use global position as normal, and relative position as special. - ga.js line 493
class Sprite {
	constructor(umbra) {
		// Parameter checkers.
		// if (!umbra instanceof Umbra) throw new Error("umbra must be an Umbra.");

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
class Rectangle extends Sprite {
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
class Line extends Sprite {
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
class Text extends Sprite {
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

// TODO - ga.js line 1396
class Image {
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
	constructor(umbra) {
		// Parameter checkers.
		// if (!umbra instanceof Umbra) throw new Error("umbra must be an Umbra.");

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