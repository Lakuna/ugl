import UnsupportedOperationError from "./UnsupportedOperationError.js";

const recursiveFullscreen = (element: HTMLElement): void => {
	element.style.width = "100%";
	element.style.height = "100%";
	element.style.margin = "0px";
	element.style.padding = "0px";
	element.style.display = "block";

	if (element.parentElement) {
		recursiveFullscreen(element.parentElement);
	}
};

/**
 * Create a canvas that fills the entire browser window, destroying all other content in the document body in the process.
 * @returns A canvas that fills the entire browser window.
 * @throws {@link UnsupportedOperationError} if called in a headless environment.
 * @public
 */
export default function makeFullscreenCanvas(): HTMLCanvasElement {
	if (!(document as Document | undefined)) {
		throw new UnsupportedOperationError(
			"Cannot make a fullscreen canvas in a headless environment."
		);
	}

	const canvas = document.createElement("canvas");
	canvas.style.touchAction = "none";

	document.body = document.createElement("body");
	document.body.appendChild(canvas);

	recursiveFullscreen(canvas);

	return canvas;
}
