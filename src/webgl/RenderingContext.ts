import { WebGLObject } from "./WebGLObject.js";
import { UnsupportedError } from "../utility/UnsupportedError.js";
import { WebGLConstant } from "./WebGLConstant.js";

/** GPU configurations for a rendering context. */
export enum PowerPreference {
	/** Lets the user agent decide which GPU configuration is most suitable. */
	Default = "default",

	/** Prioritizes rendering performance over power consumption. */
	HighPerformance = "high-performance",

	/** Prioritizes power saving over rendering performance. */
	LowPower = "low-power"
}

/** The drawing buffer of a rendering context. */
export class DrawingBuffer {
	/**
	 * Creates a drawing buffer.
	 * @param gl - The standard context interface.
	 */
	constructor(gl: WebGL2RenderingContext) {
		this.#gl = gl;
	}

	readonly #gl: WebGL2RenderingContext;

	/** The width of this drawing buffer. */
	get width(): number {
		return this.#gl.drawingBufferWidth;
	}
	set width(value: number) {
		this.#gl.canvas.width = value;
	}

	/** The height of this drawing buffer. */
	get height(): number {
		return this.#gl.drawingBufferHeight;
	}
	set height(value: number) {
		this.#gl.canvas.height = value;
	}
}

/** The scissor box of a rendering context. */
export class ScissorBox {
	#updateCache(): void {
		[this.#x, this.#y, this.#width, this.#height] = this.#gl.getParameter(WebGLConstant.SCISSOR_BOX);
	}

	#updateInternal(): void {
		this.#gl.scissor(this.x, this.y, this.width, this.height);
	}

	/**
	 * Creates a scissor box.
	 * @param gl - The standard context interface.
	 */
	constructor(gl: WebGL2RenderingContext) {
		this.#gl = gl;
	}

	readonly #gl: WebGL2RenderingContext;

	#x?: number;
	/** The horizontal coordinate of the lower left corner of this scissor box. */
	get x(): number {
		if (!this.#x) { this.#updateCache(); }
		return this.#x as number;
	}
	set x(value: number) {
		this.#x = value;
		this.#updateInternal();
	}

	#y?: number;
	/** The vertical coordinate of the lower left corner of this scissor box. */
	get y(): number {
		if (!this.#y) { this.#updateCache(); }
		return this.#y as number;
	}
	set y(value: number) {
		this.#y = value;
		this.#updateInternal();
	}

	#width?: number;
	/** The width of this scissor box. */
	get width(): number {
		if (!this.#width) { this.#updateCache(); }
		return this.#width as number;
	}
	set width(value: number) {
		this.#width = value;
		this.#updateInternal();
	}

	#height?: number;
	/** The height of this scissor box. */
	get height(): number {
		if (!this.#height) { this.#updateCache(); }
		return this.#height as number;
	}
	set height(value: number) {
		this.#height = value;
		this.#updateInternal();
	}

	/** Sets all values in this scissor box. */
	setAll(x: number, y: number, width: number, height: number): void {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	#enabled?: boolean;
	/** Whether this scissor box is enabled. */
	get enabled(): boolean {
		this.#enabled ??= this.#gl.isEnabled(WebGLConstant.SCISSOR_TEST);
		return this.#enabled;
	}
	set enabled(value: boolean) {
		(value ? this.#gl.enable : this.#gl.disable)(WebGLConstant.SCISSOR_TEST);
		this.#enabled = value;
	}
}

/** The viewport of a rendering context. */
export class Viewport {
	#updateCache(): void {
		[this.#x, this.#y, this.#width, this.#height] = this.#gl.getParameter(WebGLConstant.VIEWPORT);
	}

	#updateInternal(): void {
		this.#gl.viewport(this.x, this.y, this.width, this.height);
	}

	#updateMaxValueCache(): void {
		[this.#maxWidth, this.#maxHeight] = this.#gl.getParameter(WebGLConstant.MAX_VIEWPORT_DIMS);
	}

	/**
	 * Creates a viewport.
	 * @param gl - The standard context interface.
	 */
	constructor(gl: WebGL2RenderingContext) {
		this.#gl = gl;
	}

	readonly #gl: WebGL2RenderingContext;

	#x?: number;
	/** The horizontal coordinate of the lower left corner of this viewport's origin. */
	get x(): number {
		if (!this.#x) { this.#updateCache(); }
		return this.#x as number;
	}
	set x(value: number) {
		this.#x = value;
		this.#updateInternal();
	}

	#y?: number;
	/** The vertical coordinate of the lower left corner of this viewport's origin. */
	get y(): number {
		if (!this.#y) { this.#updateCache(); }
		return this.#y as number;
	}
	set y(value: number) {
		this.#y = value;
		this.#updateInternal();
	}

	#width?: number;
	/** The width of this viewport. */
	get width(): number {
		if (!this.#width) { this.#updateCache(); }
		return this.#width as number;
	}
	set width(value: number) {
		this.#width = value;
		this.#updateInternal();
	}

	#height?: number;
	/** The height of this viewport. */
	get height(): number {
		if (!this.#height) { this.#updateCache(); }
		return this.#height as number;
	}
	set height(value: number) {
		this.#height = value;
		this.#updateInternal();
	}

	/** Sets all values in this viewport. */
	setAll(x: number, y: number, width: number, height: number): void {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	#maxWidth?: number;
	/** The maximum allowed width of this viewport. */
	get maxWidth(): number {
		if (!this.#maxWidth) { this.#updateMaxValueCache(); }
		return this.#maxWidth as number;
	}

	#maxHeight?: number;
	/** The maximum allowed height of this viewport. */
	get maxHeight(): number {
		if (!this.#maxHeight) { this.#updateMaxValueCache(); }
		return this.#maxHeight as number;
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

		this.drawingBuffer = new DrawingBuffer(gl);

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

		this.scissorBox = new ScissorBox(gl);
		this.viewport = new Viewport(gl);
	}

	/** The canvas that this rendering context belongs to. */
	readonly canvas: HTMLCanvasElement;

	/** The actual size of the drawing buffer. */
	readonly drawingBuffer: DrawingBuffer;

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

	/** The scissor box of this context. */
	readonly scissorBox: ScissorBox;

	/** The viewport of this context. */
	readonly viewport: Viewport;
}
