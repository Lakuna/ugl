import { RenderbufferFormat } from "./WebGLConstant.js";
import { RENDERBUFFER } from "./WebGLConstant.js";

/** A buffer that can contain an image or be the source or target of a rendering operation. */
export class Renderbuffer {
	/**
	 * Creates a renderbuffer.
	 * @param gl The rendering context of the renderbuffer.
	 * @param format The format of the renderbuffer.
	 * @param width The width of the renderbuffer.
	 * @param height The height of the renderbuffer.
	 */
	public constructor(gl: WebGL2RenderingContext, format: RenderbufferFormat, width: number, height: number) {
		this.gl = gl;
		this.format = format;
		this.width = width;
		this.height = height;

		const renderbuffer: WebGLRenderbuffer | null = gl.createRenderbuffer();
		if (!renderbuffer) { throw new Error("Failed to create a renderbuffer."); }
		this.renderbuffer = renderbuffer;

		this.bind();
		gl.renderbufferStorage(RENDERBUFFER, format, width, height);
	}

	/** The rendering context of this renderbuffer. */
	public readonly gl: WebGL2RenderingContext;

	/** The WebGL API interface of this renderbuffer. */
	public readonly renderbuffer: WebGLRenderbuffer;

	/** The format of this renderbuffer. */
	public readonly format: RenderbufferFormat;

	/** The width of this renderbuffer. */
	public readonly width: number;

	/** The height of this renderbuffer. */
	public readonly height: number;

	/** Binds this renderbuffer. */
	public bind(): void {
		this.gl.bindRenderbuffer(RENDERBUFFER, this.renderbuffer);
	}
}
