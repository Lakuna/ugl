export const makeFullscreenCanvas = () => {
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
	document.body.style = "margin:0";
	/* CSS
	body {
		margin: 0px;
	}
	*/

	return canvas;
};