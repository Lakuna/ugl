/**
 * Resizes a rendering context to ensure that the draw buffer matches its physical size.
 * @param gl - The rendering context to resize.
 */
export function resizeContext(gl: WebGL2RenderingContext): void {
	// Physical size (CSS).
	const displayWidth: number = gl.canvas.clientWidth;
	const displayHeight: number = gl.canvas.clientHeight;

	if (gl.canvas.width != displayWidth
		|| gl.canvas.height != displayHeight) {
		gl.canvas.width = displayWidth;
		gl.canvas.height = displayHeight;

		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	}
}