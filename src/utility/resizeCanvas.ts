/**
 * Resizes a canvas to ensure that the draw buffer matches its physical size.
 * @param canvas - The canvas to resize.
 */
export function resizeCanvas(canvas: HTMLCanvasElement): void {
	// Physical size (CSS).
	const displayWidth: number = canvas.clientWidth;
	const displayHeight: number = canvas.clientHeight;

	if (canvas.width != displayWidth || canvas.height != displayHeight) {
		canvas.width = displayWidth;
		canvas.height = displayHeight;
	}
}