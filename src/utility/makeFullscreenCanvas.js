/**
 * Create a fullscreen canvas. Note that executing this function will automatically destroy all other content in the DOM.
 * @return {HTMLCanvasElement} A fullscreen canvas.
 */
export const makeFullscreenCanvas = () => {
	if (typeof document == "undefined") { throw new Error("Cannot create a canvas in a headless environment."); }

	const canvas = document.createElement("canvas");
	canvas.style = "touch-action:none;width:100%;height:100%";
	/* CSS
	canvas {
		touch-action: none;
		width: 100%;
		height: 100%;
	}
	*/

	document.body = document.createElement("body"); // Clear document body.
	document.body.appendChild(canvas);
	document.body.style = "margin:0;height:100%";
	/* CSS
	body {
		margin: 0px;
		height: 100%;
	}
	*/

	return canvas;
};