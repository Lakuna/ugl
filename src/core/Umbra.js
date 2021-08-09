import { makeFullscreenCanvas } from "../utilities/makeFullscreenCanvas.js";
import { Component } from "./Component.js";

export class Umbra {
	#scene;

	constructor(canvas = makeFullscreenCanvas(), updatesPerSecond = 30) {
		const gl = canvas.getContext("webgl2");
		if (!gl) { throw new Error("WebGL2 is not supported by your browser."); }

		Object.defineProperties(this, {
			canvas: { value: canvas },
			updatesPerSecond: { value: updatesPerSecond },
			gl: { value: gl },
			deltaTime: { value: 0, writable: true },
			paused: { value: false, writable: true }
		});

		let then = 0; // Used to calculate frame rate.

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
		}, 1000 / updatesPerSecond);
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
			.sort((a, b) => a.priority > b.priority ? 1 : -1) // Trigger events in order of priority.
			.forEach((component) => component[event](this));
	}
}