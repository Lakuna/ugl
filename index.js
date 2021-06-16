import { UTernion, SceneGraphNode } from "@umbra-engine/uternion";

export const makeFullscreenCanvas = () => {
	const canvas = document.createElement("canvas");
	canvas.style = "touch-action:none;width:100%;height:100%";
	/* CSS
	canvas {
		touch-action: none;
		width: 100%;
		height: 100%;
	}
	*/

	document.body = document.createElement("body"); // Clear document body.
	document.body.appendChild(canvas);
	document.body.style = "margin:0";
	/* CSS
	body {
		margin: 0px;
	}
	*/

	return canvas;
};

export class Umbra {
	#scene;

	constructor(canvas = makeFullscreenCanvas(), ups = 30) {
		this.canvas = canvas;
		const gl = canvas.getContext("webgl2");
		if (!gl) {
			throw new Error("WebGL2 is not supported by your browser.");
		}

		this.uTernion = new UTernion(gl);

		let then = 0; // Used for deltaTime calculation.

		// Update loop; variable frequency.
		const update = (now) => {
			requestAnimationFrame(update);

			// fps = 1 / deltaTime
			this.deltaTime = (now - then) * 0.001;
			then = now;

			if (!this.paused) {
				this.trigger(Component.events.UPDATE);
			}
		};
		requestAnimationFrame(update);

		// Fixed update loop; fixed frequency.
		setInterval(() => {
			if (!this.paused) {
				this.trigger(Component.events.FIXED_UPDATE);
			}
		}, 1000 / ups);

		this.gl = gl;
		// this.paused = undefined;
		// this.deltaTime = undefined;
	}

	get scene() {
		return this.#scene;
	}

	set scene(value) {
		this.#scene = value;
		this.trigger(Component.events.LOAD);
	}

	trigger(event) {
		const getComponentsRecursive = (gameObject, output = []) => {
			if (!gameObject?.enabled) {
				return output;
			}

			gameObject.components
				.filter((component) => component[event]) // Only include components that have a trigger for this event type.
				.forEach((component) => output.push(component));

			for (const child of gameObject.children) {
				getComponentsRecursive(child, output);
			}

			return output;
		};

		getComponentsRecursive(this.scene)
			.sort((a, b) => a.priority > b.priority ? 1 : -1) // Run events in order of priority.
			.forEach((component) => component[event](this));
	}
}

export class GameObject extends SceneGraphNode {
	constructor(enabled = true) {
		this.enabled = enabled;
		this.components = [];
	}

	getComponent = (type) => this.components.find((component) => component instanceof type);
}

export class Component {
	static events = {
		LOAD: 0, // Called when this component's scene is loaded.
		UPDATE: 1, // Called on each animation frame.
		FIXED_UPDATE: 2 // Called on a fixed timer.
	};

	#gameObject;

	constructor(gameObject, priority = 0) {
		this.#gameObject = gameObject;
		gameObject.components.push(this);

		this.priority = priority;
	}

	get gameObject() {
		return this.#gameObject;
	}
}