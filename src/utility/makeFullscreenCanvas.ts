import { HeadlessError } from "./HeadlessError.js";

function recursiveFullscreen(element: HTMLElement): void {
	element.style.width = "100%";
	element.style.height = "100%";
	element.style.margin = "0px";
	element.style.padding = "0px";

	if (element.parentElement) {
		recursiveFullscreen(element.parentElement);
	}
}

/**
 * Destroys all content in the DOM and creates a fullscreen canvas.
 * @returns A fullscreen canvas.
 */
export function makeFullscreenCanvas(): HTMLCanvasElement {
	if (typeof document == "undefined") {
		throw new HeadlessError("Failed to create a canvas.");
	}

	const canvas: HTMLCanvasElement = document.createElement("canvas");
	canvas.style.touchAction = "none";

	document.body = document.createElement("body");
	document.body.appendChild(canvas);

	recursiveFullscreen(canvas);

	return canvas;
}