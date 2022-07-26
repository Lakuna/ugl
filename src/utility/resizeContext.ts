/**
 * Resizes a canvas' drawing buffer to match its physical size.
 * @param gl The rendering context to resize.
 * @returns Whether the drawing buffer was resized.
 */
function resizeContext(gl: WebGL2RenderingContext): boolean {
	// Physical size.
	const displayWidth: number = gl.canvas.clientWidth;
	const displayHeight: number = gl.canvas.clientHeight;

	if (gl.canvas.width != displayWidth || gl.canvas.height != displayHeight) {
		gl.canvas.width = displayWidth;
		gl.canvas.height = displayHeight;

		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

		return true;
	}

	return false;
}

export default resizeContext;
