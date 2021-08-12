/**
 * Create a fullscreen canvas. Note that executing this function will automatically destroy all other content in the DOM.
 * @return {HTMLCanvasElement} A fullscreen canvas.
 */
export const makeFullscreenCanvas = () => {
	if (typeof document == "undefined") { throw new Error("Cannot create a canvas in a headless environment."); }

	const canvas = document.createElement("canvas");
	canvas.style.touchAction = "none";
	/* CSS
	canvas {
		touch-action: none;
	}
	*/

	document.body = document.createElement("body"); // Clear document body.
	document.body.appendChild(canvas);

	// Recursively make all parents of the canvas fullscreen.
	const recursiveFullscreen = (element) => {
		element.style.width = "100%";
		element.style.height = "100%";
		element.style.margin = "0px";
		element.style.padding = "0px";
		/* CSS
		* {
			width: 100%;
			height: 100%;
			margin: 0px;
			padding: 0px;
		}
		*/

		if (element.parentElement) {
			recursiveFullscreen(element.parentElement);
		}
	}
	recursiveFullscreen(canvas);

	return canvas;
};