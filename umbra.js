class Umbra {
	// Umbra Framework version.
	static version = '3.0';

	// The active Scene.
	#scene;

	// Used internally to trigger events on Components on active GameObjects within the active Scene.
	#trigger = (event) => {
		if (this.#scene) {
			this.#scene.gameObjects
				.filter((gameObject) => gameObject.enabled)
				.forEach((gameObject) => gameObject.components
					.forEach((component) => {
						if (component[event]) {
							component[event].call(gameObject);
						}
					})
				);
		}
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
		this.ctx = canvas.getContext('webgl');

		// Update loop; variable frequency.
		const update = () => {
			requestAnimationFrame(update);
			if (!this.paused) { this.#trigger(Component.events.UPDATE);; }
		};
		update();

		// Fixed update loop; fixed frequency.
		setInterval(() => {
			if (!this.paused) { this.#trigger(Component.events.FIXED);; }
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

class Scene {
	constructor() {
		this.gameObjects = [];
	}
}

class GameObject {
	#scene;

	constructor(scene, enabled = true) {
		this.#scene = scene;
		this.#scene.gameObjects.push(this);

		this.enabled = enabled;
		this.components = [];
	}

	get scene() {
		return this.#scene;
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

	constructor(gameObject) {
		this.#gameObject = gameObject;
		this.#gameObject.components.push(this);
	}

	get gameObject() {
		return this.#gameObject;
	}
}
