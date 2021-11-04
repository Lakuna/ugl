import { Vector } from "../index";

/** Events which can trigger on a pointer. */
export type PointerEvent = MouseEvent | TouchEvent;

/** Unified mouse and touchscreen input. */
export class Pointer {
	/**
	 * Creates a new pointer.
	 * @param canvas - The canvas that the pointer is tracked on.
	 */
	constructor(canvas: HTMLCanvasElement, onDown: (event: PointerEvent) => void, onUp: (event: PointerEvent) => void) {
		if (typeof window == "undefined") {
			throw new Error("Cannot use window events in a headless environment.");
		}

		this.canvas = canvas;
		this.position = new Vector();
		this.isDown = false;
		this.onDown = onDown;
		this.onUp = onUp;

		const moveHandler: (event: PointerEvent) => void = (event: PointerEvent): void => {
			this.position = (event as TouchEvent).targetTouches?.length
				? new Vector(
					(event as TouchEvent).targetTouches[0].pageX - canvas.offsetLeft,
					(event as TouchEvent).targetTouches[0].pageY - canvas.offsetTop)
				: new Vector(
					(event as MouseEvent).pageX - (event.target as HTMLElement).offsetLeft,
					(event as MouseEvent).pageY - (event.target as HTMLElement).offsetTop);
		};
		addEventListener("mousemove", moveHandler);
		addEventListener("touchmove", moveHandler);

		const downHandler: (event: PointerEvent) => void = (event: PointerEvent): void => {
			if (!this.isDown) {
				this.onDown?.(event);
			}
			this.isDown = true;
			event.preventDefault();
		};
		addEventListener("mousedown", downHandler);
		addEventListener("touchstart", downHandler);

		const upHandler: (event: PointerEvent) => void = (event: PointerEvent): void => {
			if (this.isDown) {
				this.onUp?.(event);
			}
			this.isDown = false;
			event.preventDefault();
		}
		addEventListener("mouseup", upHandler);
		addEventListener("touchend", upHandler);
	}

	/** The position of this pointer on the canvas. */
	position: Vector;

	/** Whether this pointer is being held down. */
	isDown: boolean;

	/** The canvas that this pointer is tracked on. */
	readonly canvas: HTMLCanvasElement;

	/** A function to call whenever this pointer is pressed. */
	onDown?: (event: PointerEvent) => void;

	/** A function to call whenever this pointer is released. */
	onUp?: (event: PointerEvent) => void;
}