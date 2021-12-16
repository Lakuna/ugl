import { WebGLObject } from "./WebGLObject.js";
import { UnsupportedError } from "../utility/UnsupportedError.js";

/** GPU configurations for a rendering context. */
export enum PowerPreference {
	/** Lets the user agent decide which GPU configuration is most suitable. */
	Default = "default",

	/** Prioritizes rendering performance over power consumption. */
	HighPerformance = "high-performance",

	/** Prioritizes power saving over rendering performance. */
	LowPower = "low-power"
}

/** The size of a drawing buffer. */
export class DrawingBufferSize {
	/**
	 * Creates a drawing buffer size.
	 * @param gl - The standard context interface.
	 */
	constructor(gl: WebGL2RenderingContext) {
		this.#gl = gl;
	}

	readonly #gl: WebGL2RenderingContext;

	/** The width of the drawing buffer. */
	get width(): number {
		return this.#gl.drawingBufferWidth;
	}

	/** The height of the drawing buffer. */
	get height(): number {
		return this.#gl.drawingBufferHeight;
	}
}

/** A WebGL2 rendering context. */
export class RenderingContext extends WebGLObject {
	/**
	 * Creates a rendering context.
	 * @param canvas - The canvas that the context should belong to.
	 * @param allowAlpha - Whether the canvas should contain an alpha buffer.
	 * @param allowDepth - Whether the drawing buffer should be requested to have at least a 16-bit depth buffer.
	 * @param allowStencil - Whether the drawing buffer should be requested to have at least an 8-bit stencil buffer.
	 * @param desynchronized - Whether the user agent should reduce latency by desynchronizing the canvas paint cycle from the event loop.
	 * @param allowAntiAliasing - Whether to perform anti-aliasing if possible.
	 * @param requirePerformantHardware - Whether the context should be created if the system performance is low or if no hardware GPU is available.
	 * @param powerPreference - How the GPU should be configured for the context.
	 * @param assumePremultipliedAlpha - Whether the page compositor should assume that the drawing buffer contains colors with pre-multiplied alpha.
	 * @param preserveDrawingBuffer - Whether buffers should preserve their values until cleared or overwritten by the author.
	 */
	constructor(
		canvas: HTMLCanvasElement,
		allowAlpha = true,
		allowDepth = true,
		allowStencil = false,
		desynchronized = true,
		allowAntiAliasing = true,
		requirePerformantHardware = false,
		powerPreference: PowerPreference = PowerPreference.Default,
		assumePremultipliedAlpha = true,
		preserveDrawingBuffer = false
	) {
		const gl: WebGL2RenderingContext | null = canvas.getContext("webgl2", {
			alpha: allowAlpha,
			depth: allowDepth,
			stencil: allowStencil,
			desynchronized: desynchronized,
			antialias: allowAntiAliasing,
			failIfMajorPerformanceCaveat: requirePerformantHardware,
			powerPreference,
			premultipliedAlpha: assumePremultipliedAlpha,
			preserveDrawingBuffer
			// xrCompatible is not set because its use is discouraged.
		});
		if (gl) { super(gl); } else { throw new UnsupportedError("WebGL2 is not supported by your browser."); }

		this.canvas = canvas;

		this.drawingBufferSize = new DrawingBufferSize(gl);

		// Context attributes
		this.allowAlpha = allowAlpha;
		this.allowDepth = allowDepth;
		this.allowStencil = allowStencil;
		this.desynchronized = desynchronized;
		this.allowAntiAliasing = allowAntiAliasing;
		this.requirePerformantHardware = requirePerformantHardware;
		this.powerPreference = powerPreference;
		this.assumePremultipliedAlpha = assumePremultipliedAlpha;
		this.preserveDrawingBuffer = preserveDrawingBuffer;
	}

	/** The canvas that this rendering context belongs to. */
	readonly canvas: HTMLCanvasElement;

	/** The actual size of the drawing buffer. */
	readonly drawingBufferSize: DrawingBufferSize;

	/** Whether the canvas contains an alpha buffer. */
	readonly allowAlpha: boolean;

	/** Whether the drawing buffer has been requested to have at least a 16-bit depth buffer. */
	readonly allowDepth: boolean;

	/** Whether the drawing buffer should be requested to have at least an 8-bit stencil buffer. */
	readonly allowStencil: boolean;

	/** Whether the user agent reduces latency by desynchronizing the canvas paint cycle from the event loop. */
	readonly desynchronized: boolean;

	/** Whether this context performs anti-aliasing if possible. */
	readonly allowAntiAliasing: boolean;

	/** Whether the context should have been created if the system performance is low or if no hardware GPU is available. */
	readonly requirePerformantHardware: boolean;

	/** How the GPU has been configured for the context. */
	readonly powerPreference: PowerPreference;

	/** Whether the page compositor assumes that the drawing buffer contains colors with pre-multiplied alpha. */
	readonly assumePremultipliedAlpha: boolean;

	/** Whether buffers preserve their values until cleared or overwritten by the author. */
	readonly preserveDrawingBuffer: boolean;

	/** Whether this context is lost. */
	get isLost(): boolean {
		return (this.internal as WebGL2RenderingContext).isContextLost();
	}

	// TODO: Add XR support once the WebXR API is standardized.
}
