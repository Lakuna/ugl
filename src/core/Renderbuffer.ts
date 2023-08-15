import type Context from "#Context";
import { RENDERBUFFER, RENDERBUFFER_BINDING } from "#constants";
import type RenderbufferFormat from "#RenderbufferFormat";
import UnsupportedOperationError from "#UnsupportedOperationError";

/**
 * A buffer that can contain an image or be the source or target of a rendering operation.
 * @see [Tutorial](https://www.lakuna.pw/a/webgl/framebuffers)
 */
export default class Renderbuffer {
	/**
	 * Unbinds all renderbuffers from the given rendering context.
	 * @param context The rendering context.
	 */
	public static unbind(context: Context): void {
		Renderbuffer.bind(context, null);
	}

	/**
	 * Binds the given renderbuffer.
	 * @param context The rendering context.
	 * @param renderbuffer The renderbuffer.
	 */
	private static bind(context: Context, renderbuffer: WebGLRenderbuffer | null): void {
		context.internal.bindRenderbuffer(RENDERBUFFER, renderbuffer);
	}

	/**
	 * Gets the currently-bound renderbuffer.
	 * @param context The rendering context.
	 * @returns The renderbuffer.
	 */
	private static getBoundRenderbuffer(context: Context): WebGLRenderbuffer | null {
		return context.internal.getParameter(RENDERBUFFER_BINDING);
	}

	/**
	 * Creates a renderbuffer.
	 * @param context The rendering context of the renderbuffer.
	 * @param format The format of the renderbuffer.
	 * @param width The width of the renderbuffer.
	 * @param height The height of the renderbuffer.
	 */
	public constructor(context: Context, format: RenderbufferFormat, width: number, height: number) {
		this.context = context;
		this.format = format;
		this.width = width;
		this.height = height;

		const renderbuffer: WebGLRenderbuffer | null = context.internal.createRenderbuffer();
		if (!renderbuffer) { throw new UnsupportedOperationError(); }
		this.internal = renderbuffer;

		this.with((renderbuffer: this): void => {
			renderbuffer.context.internal.renderbufferStorage(RENDERBUFFER, renderbuffer.format, renderbuffer.width, renderbuffer.height);
		})
	}

	/** The rendering context of this renderbuffer. */
	public readonly context: Context;

	/** The WebGL API interface of this renderbuffer. */
	public readonly internal: WebGLRenderbuffer;

	/** The format of this renderbuffer. */
	public readonly format: RenderbufferFormat;

	/** The width of this renderbuffer. */
	public readonly width: number;

	/** The height of this renderbuffer. */
	public readonly height: number;

	/** Binds this renderbuffer. */
	public bind(): void {
		Renderbuffer.bind(this.context, this.internal);
	}

	/**
	 * Executes the given function with this renderbuffer bound, then re-binds the previously-bound renderbuffer.
	 * @param f The function to execute.
	 * @returns The return value of the executed function.
	 */
	public with<T>(f: (renderbuffer: this) => T): T {
		const previousBinding: WebGLRenderbuffer | null = Renderbuffer.getBoundRenderbuffer(this.context);
		this.bind();
		const out: T = f(this);
		Renderbuffer.bind(this.context, previousBinding);
		return out;
	}

	/** Deletes this renderbuffer. */
	public delete(): void {
		this.context.internal.deleteRenderbuffer(this.internal);
	}
}
