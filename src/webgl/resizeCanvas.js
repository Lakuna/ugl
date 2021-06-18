export const resizeCanvas = (canvas) => {
	if (canvas.width != canvas.clientWidth || canvas.height != canvas.clientHeight) {
		canvas.width = canvas.clientWidth;
		canvas.height = canvas.clientHeight;
	}
};