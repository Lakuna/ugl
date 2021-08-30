/** @external {Event} https://developer.mozilla.org/en-US/docs/Web/API/Event */

import { Vector } from "../math/Vector.js";

/** Unifies mouse and touchscreen input. */
export class Pointer {
	#canvas;

	/**
	 * Create a new pointer.
	 * @param {HTMLCanvasElement} canvas - The canvas that the pointer is tracked in relation to.
	 */
	constructor(canvas) {
		if (typeof window == "undefined") { throw new Error("Cannot use window events in a headless environment."); }
		
		/** @ignore */ this.#canvas = canvas;

		/**
		 * The position of the pointer on the screen.
		 * @type {Vector}
		 */
		this.position = new Vector();

		/**
		 * Whether the pointer is being held down.
		 * @type {boolean}
		 */
		this.isDown = false;

		/**
		 * A function to call when the pointer is pressed.
		 * @type {function<Event>}
		 */
		this.onDown = undefined;

		/**
		 * A function to call when the pointer is released.
		 * @type {function<Event>}
		 */
		this.onUp = undefined;

		const moveHandler = (event) => {
			this.position = event.targetTouches?.length
				? new Vector(event.targetTouches[0].pageX - canvas.offsetLeft, event.targetTouches[0].pageY - canvas.offsetTop)
				: new Vector(event.pageX - event.target.offsetLeft, event.pageY - event.target.offsetTop);
			event.preventDefault();
		};
		addEventListener("mousemove", moveHandler);
		addEventListener("touchmove", moveHandler);

		const downHandler = (event) => {
			if (!this.isDown) { this.onDown?.(event); }
			this.isDown = true;
			event.preventDefault();
		};
		addEventListener("mousedown", downHandler);
		addEventListener("touchstart", downHandler);

		const upHandler = (event) => {
			if (this.isDown) { this.onUp?.(event); }
			this.isDown = false;
			event.preventDefault();
		};
		addEventListener("mouseup", upHandler);
		addEventListener("touchend", upHandler);
	}

	/**
	 * The canvas that the pointer is tracked in relation to.
	 * @type {HTMLCanvasElement}
	 */
	get canvas() {
		return this.#canvas;
	}
}