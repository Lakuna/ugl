import { HeadlessError } from "./HeadlessError.js";
import { Vector2 } from "../math/Vector2.js";

export type PointerEvent = MouseEvent | TouchEvent;

/** Unified mouse and touchscreen input handler. */
export class Pointer {
	/**
	 * Creates a new pointer.
	 * @param canvas - The canvas that the pointer is tracked on.
	 */
	constructor(canvas: HTMLCanvasElement) {
		if (typeof window == "undefined") {
			throw new HeadlessError("Failed to create a pointer.");
		}

		this.canvas = canvas;
		this.position = new Vector2();
		this.isPressed = false;

		addEventListener("mousemove", this.#moveHandler);
		addEventListener("touchmove", this.#moveHandler);
		addEventListener("mousedown", this.#downHandler);
		addEventListener("touchstart", this.#downHandler);
		addEventListener("mouseup", this.#upHandler);
		addEventListener("touchend", this.#upHandler);
	}

	/** The position of this pointer on the canvas. */
	position: Vector2;

	/** Whether this pointer is being held down. */
	isPressed: boolean;

	/** The canvas that this pointer is tracked on. */
	readonly canvas: HTMLCanvasElement;

	/** The function that is called whenever this pointer is pressed. */
	onPress?: (event: PointerEvent) => void;

	/** The function that is called whenever this pointer is released. */
	onRelease?: (event: PointerEvent) => void;

	#moveHandler(event: PointerEvent): void {
		if (typeof (event as TouchEvent).targetTouches == "undefined") {
			// MouseEvent
			this.position = new Vector2(
				(event as MouseEvent).pageX - (event.target as HTMLElement).offsetLeft,
				(event as MouseEvent).pageY - (event.target as HTMLElement).offsetTop);
		} else {
			// TouchEvent
			if ((event as TouchEvent).targetTouches.length) {
				this.position = new Vector2(
					(((event as TouchEvent).targetTouches[0] as Touch).pageX) - this.canvas.offsetLeft,
					(((event as TouchEvent).targetTouches[0] as Touch).pageY) - this.canvas.offsetTop);
			}
		}
	}

	#downHandler(event: PointerEvent): void {
		if (!this.isPressed) {
			this.onPress?.(event);
		}
		this.isPressed = true;
		event.preventDefault();
	}

	#upHandler(event: PointerEvent): void {
		if (this.isPressed) {
			this.onRelease?.(event);
		}
		this.isPressed = false;
		event.preventDefault();
	}
}