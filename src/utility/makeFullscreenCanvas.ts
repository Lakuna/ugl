import HeadlessEnvironmentError from "#HeadlessEnvironmentError";

/**
 * Recursively makes an element in the DOM fullscreen.
 * @param element The element to make fullscreen.
 */
function recursiveFullscreen(element: HTMLElement): void {
	element.style.width = "100%";
	element.style.height = "100%";
	element.style.margin = "0px";
	element.style.padding = "0px";
	element.style.display = "block";

	if (element.parentElement) {
		recursiveFullscreen(element.parentElement);
	}
}

/**
 * Creates a fullscreen rendering context. Destroys all other content in the DOM.
 * @returns A fullscreen rendering context.
 */
export default function makeFullscreenCanvas(): HTMLCanvasElement {
	if (typeof document == "undefined") {
		throw new HeadlessEnvironmentError();
	}

	const canvas: HTMLCanvasElement = document.createElement("canvas");
	canvas.style.touchAction = "none";

	document.body = document.createElement("body");
	document.body.appendChild(canvas);

	recursiveFullscreen(canvas);

	return canvas;
}
