/**
 * Create a fullscreen canvas. Note that executing this function will automatically destroy all other content in the DOM.
 * @return {HTMLCanvasElement} A fullscreen canvas.
 */
export const makeFullscreenCanvas = () => {
	if (typeof document == "undefined") { throw new Error("Cannot create a canvas in a headless environment."); }

	const canvas = document.createElement("canvas");
	

	const style = document.createElement("style");
	style.innerHTML = "canvas{touch-action:none;width:100%;height:100%}body{margin:0}";
	/* CSS
	canvas {
		touch-action: none;
		width: 100%;
		height: 100%;
	}
	body {
		margin: 0px;
	}
	*/

	document.body = document.createElement("body"); // Clear document body.
	document.body.appendChild(canvas);
	document.body.appendChild(style);

	return canvas;
};