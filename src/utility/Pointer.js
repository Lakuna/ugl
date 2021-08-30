import { Vector } from "../math/Vector.js";

/** Unifies mouse and touchscreen input. */
export class Pointer {
	#canvas;

	/**
	 * Create a new pointer.
	 * @param {HTMLCanvasElement} canvas - The canvas that the pointer is tracked in relation to.
	 */
	constructor(canvas) {
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
		 * @type {?function}
		 */
		this.onDown = undefined;

		/**
		 * A function to call when the pointer is released.
		 * @type {?function}
		 */
		this.onUp = undefined;

		const moveHandler = (event) => {
			this.position = this.#eventPosition(event);
			event.preventDefault();
		};

		const downHandler = (event) => {
			this.isDown = true;
			this.onDown?.();
			event.preventDefault();
		};

		const upHandler = (event) => {
			this.isDown = false;
			this.onUp?.();
			event.preventDefault();
		};

		canvas.addEventListener("mousemove", moveHandler);
		canvas.addEventListener("touchmove", moveHandler);
		canvas.addEventListener("mousedown", downHandler);
		canvas.addEventListener("touchstart", downHandler);
		canvas.addEventListener("mouseup", upHandler);
		canvas.addEventListener("touchend", upHandler);
	}

	/**
	 * The canvas that the pointer is tracked in relation to.
	 * @type {HTMLCanvasElement}
	 */
	get canvas() {
		return this.#canvas;
	}

	#eventPosition(event) {
		return event.targetTouches
			? new Vector(event.targetTouches[0].pageX - this.canvas.offsetLeft, event.targetTouches[0].pageY - this.canvas.offsetTop)
			: new Vector(event.pageX - event.target.offsetLeft, event.pageY - event.target.offsetTop);
	}
}