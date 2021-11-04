/**
 * Creates a fullscreen canvas. Automatically destroys all other content in the DOM.
 * @returns A fullscreen canvas.
 */
export function makeFullscreenCanvas(): HTMLCanvasElement {
	if (typeof document == "undefined") {
		throw new Error("Cannot create a canvas in a headless environment.");
	}

	const canvas: HTMLCanvasElement = document.createElement("canvas");
	canvas.style.touchAction = "none";

	document.body = document.createElement("body");
	document.body.appendChild(canvas);

	const recursiveFullscreen = (element: HTMLElement): void => {
		element.style.width = "100%";
		element.style.height = "100%";
		element.style.margin = "0px";
		element.style.padding = "0px";

		if (element.parentElement) {
			recursiveFullscreen(element.parentElement);
		}
	};
	recursiveFullscreen(canvas);

	return canvas;
}