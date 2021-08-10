/** @external {HTMLCanvasElement} https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement */
/** @external {WebGL2RenderingContext} https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext */

import { makeFullscreenCanvas } from "../utility/makeFullscreenCanvas.js";
import { Component } from "./Component.js";

/** Class representing a game (or other program which utilizes Umbra). */
export class Umbra {
	#scene;

	/**
	 * Create an instance of Umbra.
	 * @param {HTMLCanvasElement} [canvas=makeFullscreenCanvas()] - The canvas for the instance to render to.
	 * @param {number} [updatesPerSecond=30] - How many times per second to run fixed updates.
	 */
	constructor(canvas = makeFullscreenCanvas(), updatesPerSecond = 30) {
		/**
		 * The rendering context of this instance.
		 * @type {WebGL2RenderingContext}
		 */
		this.gl = canvas.getContext("webgl2");
		if (!this.gl) { throw new Error("WebGL2 is not supported by your browser."); }

		/**
		 * The time in seconds between this frame and the last.
		 * @type {number}
		 */
		this.deltaTime = 0;

		/**
		 * Whether to trigger events on components on objects in the scene.
		 * @type {boolean}
		 */
		this.paused = false;

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

	/**
	 * The top-level object which represents the current scene.
	 * @type {GameObject}
	 */
	get scene() {
		return this.#scene;
	}

	/**
	 * The top-level object which represents the current scene.
	 * @type {GameObject}
	 */
	set scene(value) {
		/** @ignore */ this.#scene = value;
		this.trigger(Component.events.LOAD);
	}

	/**
	 * Triggers the chosen event on every component on every object in the current scene.
	 * @param {Symbol} event - The event to trigger.
	 */
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