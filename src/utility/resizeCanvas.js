// Recommended usage: window.onresize = () => resizeCanvas(canvas);
export const resizeCanvas = (canvas) => {
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
};