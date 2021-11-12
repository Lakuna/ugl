import { WebGLConstant } from "./WebGLConstant.js";
import { RenderbufferMode } from "./RenderbufferMode.js";
import { Vector } from "../math/Vector.js";

/** A buffer that can contain an image or be the source or target of a rendering operation. */
export class Renderbuffer {
	/**
	 * Creates a renderbuffer.
	 * @param gl - The rendering context of the renderbuffer.
	 * @param format - The format of the renderbuffer.
	 * @param size - The width and height of the renderbuffer.
	 */
	constructor(gl: WebGL2RenderingContext, format: RenderbufferMode, size: Vector) {
		this.gl = gl;
		this.format = format;
		this.size = size;

		const renderbuffer: WebGLRenderbuffer | null = gl.createRenderbuffer();
		if (renderbuffer) {
			this.renderbuffer = renderbuffer;
		} else {
			throw new Error("Failed to create a WebGL renderbuffer.");
		}
		this.bind();
		gl.renderbufferStorage(WebGLConstant.RENDERBUFFER, format, size.x, size.y);
	}

	/** The rendering context of this renderbuffer. */
	readonly gl: WebGL2RenderingContext;

	/** The WebGL renderbuffer that this renderbuffer represents. */
	readonly renderbuffer: WebGLRenderbuffer;

	/** The format of this renderbuffer. */
	readonly format: RenderbufferMode;

	/** The width and height of this renderbuffer. */
	readonly size: Vector;

	/** Binds this renderbuffer. */
	bind(): void {
		this.gl.bindRenderbuffer(WebGLConstant.RENDERBUFFER, this.renderbuffer);
	}
}