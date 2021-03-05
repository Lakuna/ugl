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
			/*
			 * CSS
			 *
			 * touch-action: none;
			 * width: 100%;
			 * height: 100%;
			 */

			document.body.appendChild(canvas);
			document.body.style = 'margin:0;';
			/*
			 * CSS
			 *
			 * margin: 0;
			 * padding: 0;
			 */

			return canvas;
		})(),

		// Updates per second for the fixed update loop.
		ups = 30
	) {
		this.canvas = canvas;
		this.gl = this.canvas.getContext('webgl2');

		// Update loop; variable frequency.
		const update = () => {
			requestAnimationFrame(update);
			
			if (!this.paused) {
				this.#trigger(Component.events.UPDATE);
			}
		};
		update();

		// Fixed update loop; fixed frequency.
		setInterval(() => {
			if (!this.paused) {
				this.#trigger(Component.events.FIXED);
			}
		}, 1000 / ups);
	}

	get scene() {
		return this.#scene;
	}

	set scene(value) {
		this.#scene = value;
		this.#trigger(Component.events.LOAD);
	}

	// Used internally to trigger events on Components.
	#trigger(event) {
		const getComponentsRecursive = (gameObject, output = []) => {
			if (!gameObject || !gameObject.enabled) {
				return output;
			}

			gameObject.components
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
	};
}

class GameObject {
	#parent;
	#children;

	constructor(enabled = true) {
		this.enabled = enabled;
		this.#children = [];
		this.components = [];
	}

	get parent() {
		return this.#parent;
	}

	set parent(value) {
		if (this.#parent) {
			this.#parent.children.splice(this.#parent.children.indexOf(this), 1);
		}
		
		this.#parent = value;
		this.#parent.children.push(this);
	}

	get children() {
		return this.#children;
	}
}

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
		};
	}
}

class Background extends Component {
	constructor(gameObject, r = 0, g = 0, b = 0, a = 1, priority = -1) {
		super(gameObject, priority);

		this[Component.events.LOAD] = (umbra) => umbra.gl.clearColor(r, g, b, a);
		this[Component.events.UPDATE] = (umbra) => umbra.gl.clear(umbra.gl.COLOR_BUFFER_BIT);
	}
}

class Point {
	constructor(...dimensions) {
		this.dimensions = dimensions;
	}
}

class Area {
	constructor(min = new Point(), max = new Point()) {
		this.min = min;
		this.max = max;
	}

	// Check whether a point is within the boundaries of the area.
	contains(point) {
		for (let dimension = 0; dimension < point.dimensions.length; dimension++) {
			if (!(point.dimensions[dimension] >= this.min.dimensions[dimension]
				&& point.dimensions[dimension] <= this.max.dimensions[dimension])) {
				return false;
			}
		}
		return true;
	}
}

// Summation/Sigma Notation
const sigma = (min, max, equation, output = 0) => output += equation(min) + (min < max ? sigma(min + 1, max, equation, output) : 0);

// Multiply matrices via the iterative algorithm.
const multiplyMatrices = (a, b, m = 3) => {
	// Matrix dimensions.
	const n = a.length / m;
	const p = b.length / m;

	// The product C (n * p) is defined if and only if the number of columns in A (n * m) equals the number of rows in B (m * p).
	let c = [];

	for (let i = 0; i < n; i++) {
		for (let j = 0; j < p; j++) {
			c[i * p + j] = sigma(0, m - 1, (k) => a[i * m + k] * b[k * p + j]);
		}
	}

	return c;
};
