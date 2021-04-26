// Umbra Web Framework version 3.0
// Copyright (c) Travis Martin 2021
// MIT License

class Umbra {
	// Umbra Framework version.
	static version = '3.0';

	// Active scene.
	#scene;

	constructor(
		// Creates a fullscreen canvas by default.
		canvas = (() => {
			const canvas = document.createElement('canvas');
			canvas.style = 'touch-action:none;width:100%;height:100%;';
			/* CSS
			canvas {
				touch-action: none;
				width: 100%;
				height: 100%;
			}
			*/

			document.body.appendChild(canvas);
			document.body.style = 'margin:0;';
			/* CSS
			body {
				margin: 0px;
			}
			*/

			return canvas;
		})(),

		// Updates per second for the fixed update loop.
		ups = 30
	) {
		this.canvas = canvas;
		this.gl = this.canvas.getContext('webgl2');
		if (!this.gl) {
			console.error('WebGL2 is not supported by your browser.');
		}

		let then = 0; // Used for deltaTime calculations.

		// Update loop; variable frequency.
		const update = (now) => {
			requestAnimationFrame(update);

			// Calculate time between frames in seconds. fps = 1 / deltaTime
			this.deltaTime = (now - then) * 0.001 || 0;
			then = now;
			
			if (!this.paused) {
				this.trigger(Component.events.UPDATE);
			}
		};
		update();

		// Fixed update loop; fixed frequency.
		setInterval(() => {
			if (!this.paused) {
				this.trigger(Component.events.FIXED);
			}
		}, 1000 / ups);
	}

	get scene() {
		return this.#scene;
	}

	set scene(value) {
		this.#scene = value;
		this.trigger(Component.events.LOAD);
	}

	// Used to trigger events on Components.
	trigger(event) {
		const getComponentsRecursive = (gameObject, output = []) => {
			if (!gameObject || !gameObject.enabled) {
				return output;
			}

			[...gameObject.components]
				.filter((component) => component[event])
				.forEach((component) => output.push(component));

			for (const child of gameObject.children) {
				getComponentsRecursive(child, output);
			}

			return output;
		};

		getComponentsRecursive(this.#scene)
			.sort((a, b) => a.priority > b.priority ? 1 : -1)
			.forEach((component) => component[event](this));
	}
}

// Represents anything that exists within the scene (and the scene itself).
class GameObject {
	#parent;
	#children;

	constructor(enabled = true) {
		this.enabled = enabled;
		this.#children = new UArray();
		this.components = new UArray();
	}

	get parent() {
		return this.#parent;
	}

	set parent(value) {
		if (this.#parent) {
			this.#parent.children.remove(this);
		}
		
		this.#parent = value;
		this.#parent.children.push(this);
	}

	// Returns a UArray of children.
	get children() {
		return this.#children.copy(); // Returns a copy so that the children cannot be modified except through setting the parent of each child.
	}

	// Gets the first component of type type.
	getComponent = (type) => this.components.find((component) => component instanceof type);
}

// A script which can be attached to GameObjects to give them a purpose.
class Component {
	// Enumeration of events.
	static events = {
		LOAD: 0, // Called when the Scene containing the GameObject this Component belongs to is loaded.
		UPDATE: 1, // Called on each animation frame; varies in frequency based on lag.
		FIXED: 2 // Called by a fixed timer; 30 times per second by default.
	};

	#gameObject;

	constructor(gameObject, priority = 0) {
		this.#gameObject = gameObject;
		this.#gameObject.components.push(this);

		this.priority = priority;
	}

	get gameObject() {
		return this.#gameObject;
	}
}

// A premade Component which resizes a canvas' drawing buffer to match its actual size on the screen.
// Only useful for canvases with size set based on screen size (i.e. "width: 100%;").
class CanvasResizer extends Component {
	constructor(gameObject, priority = -2) {
		super(gameObject, priority);

		this[Component.events.UPDATE] = (umbra) => {
			const canvas = umbra.canvas;

			const displayWidth = canvas.clientWidth;
			const displayHeight = canvas.clientHeight;

			if (canvas.width != displayWidth || canvas.height != displayHeight) {
				canvas.width = displayWidth;
				canvas.height = displayHeight;

				umbra.gl.viewport(0, 0, canvas.width, canvas.height);
			}
		}
	}
}

// A premade Component which clears the screen and sets the background to a specified color.
class Background extends Component {
	constructor(gameObject, r = 0, g = 0, b = 0, a = 1, priority = -1) {
		super(gameObject, priority);

		this[Component.events.LOAD] = (umbra) => umbra.gl.clearColor(r, g, b, a);
		this[Component.events.UPDATE] = (umbra) => umbra.gl.clear(umbra.gl.COLOR_BUFFER_BIT | umbra.gl.DEPTH_BUFFER_BIT);
	}
}

// Contains the transform information to generate a WebGL view projection Matrix.
class Camera {
	// TODO
}