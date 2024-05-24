import type Framebuffer from "#Framebuffer";

/** A portion of a framebuffer starting at `(x, y)`. */
export default interface OffsetFramebuffer {
	/** The framebuffer. */
	framebuffer: Framebuffer;

	/** The horizontal offset. */
	x: number;

	/** The vertical offset. */
	y: number;
}
