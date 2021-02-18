class Umbra {
	// Umbra Framework version.
	static version = '3.0';

	// Active scene.
	#scene;

	// Used internally to trigger events on Components.
	#trigger = (event) => {
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
			.forEach((component) => component[event].call(component.gameObject));
	};

	constructor(
		// Creates a fullscreen canvas by default.
		canvas = (() => {
			const canvas = document.createElement('canvas');
			canvas.style = 'touch-action:none;width:100%;height:100%;';

			document.body.style = 'margin:0;padding:0;';
			document.body.appendChild(canvas);

			return canvas;
		})(),

		// Updates per second for the fixed update loop.
		ups = 30
	) {
		this.cnv = canvas;
		this.ctx = this.cnv.getContext('webgl');

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
		LOAD: 'load', // Called when the Scene containing the GameObject this Component belongs to is loaded.
		UPDATE: 'update', // Called on each animation frame; varies in frequency based on lag.
		FIXED: 'fixed' // Called by a fixed timer; 30 times per second by default.
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
