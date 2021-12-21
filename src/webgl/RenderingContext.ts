import { WebGLObject } from "./WebGLObject.js";
import { UnsupportedError } from "../utility/UnsupportedError.js";
import { WebGLConstant, BlendEquation, BlendFunction, PolygonFace, DepthFunction } from "./WebGLConstant.js";
import { Color } from "../utility/Color.js";

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

	// Width and height are not cached because the canvas size may be modified externally.

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
		if (value != this.#x) {
			this.#x = value;
			this.#updateInternal();
		}
	}

	#y?: number;
	/** The vertical coordinate of the lower left corner of this scissor box. */
	get y(): number {
		if (!this.#y) { this.#updateCache(); }
		return this.#y as number;
	}
	set y(value: number) {
		if (value != this.#y) {
			this.#y = value;
			this.#updateInternal();
		}
	}

	#width?: number;
	/** The width of this scissor box. */
	get width(): number {
		if (!this.#width) { this.#updateCache(); }
		return this.#width as number;
	}
	set width(value: number) {
		if (value != this.#width) {
			this.#width = value;
			this.#updateInternal();
		}
	}

	#height?: number;
	/** The height of this scissor box. */
	get height(): number {
		if (!this.#height) { this.#updateCache(); }
		return this.#height as number;
	}
	set height(value: number) {
		if (value != this.#height) {
			this.#height = value;
			this.#updateInternal();
		}
	}

	/**
	 * Sets all values in this scissor box.
	 * @param x - The horizontal coordinate of the lower left corner of this scissor box.
	 * @param y - The vertical coordinate of the lower left corner of this scissor box.
	 * @param width - The width of this scissor box.
	 * @param height - The height of this scissor box.
	 */
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
		if (value != this.#enabled) {
			(value ? this.#gl.enable : this.#gl.disable)(WebGLConstant.SCISSOR_TEST);
			this.#enabled = value;
		}
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

	/**
	 * Creates a viewport.
	 * @param gl - The standard context interface.
	 */
	constructor(gl: WebGL2RenderingContext) {
		this.#gl = gl;
		[this.maxWidth, this.maxHeight] = this.#gl.getParameter(WebGLConstant.MAX_VIEWPORT_DIMS);
	}

	readonly #gl: WebGL2RenderingContext;

	#x?: number;
	/** The horizontal coordinate of the lower left corner of this viewport's origin. */
	get x(): number {
		if (!this.#x) { this.#updateCache(); }
		return this.#x as number;
	}
	set x(value: number) {
		if (value != this.#x) {
			this.#x = value;
			this.#updateInternal();
		}
	}

	#y?: number;
	/** The vertical coordinate of the lower left corner of this viewport's origin. */
	get y(): number {
		if (!this.#y) { this.#updateCache(); }
		return this.#y as number;
	}
	set y(value: number) {
		if (value != this.#y) {
			this.#y = value;
			this.#updateInternal();
		}
	}

	#width?: number;
	/** The width of this viewport. */
	get width(): number {
		if (!this.#width) { this.#updateCache(); }
		return this.#width as number;
	}
	set width(value: number) {
		if (value != this.#width) {
			if (value > this.maxWidth) { 	throw new Error("Width is greater than maximum width."); }
			this.#width = value;
			this.#updateInternal();
		}
	}

	#height?: number;
	/** The height of this viewport. */
	get height(): number {
		if (!this.#height) { this.#updateCache(); }
		return this.#height as number;
	}
	set height(value: number) {
		if (value != this.#height) {
			if (value > this.maxHeight) { throw new Error("Height is greater than maximum height."); }
			this.#height = value;
			this.#updateInternal();
		}
	}

	/**
	 * Sets all values in this viewport.
	 * @param x - The horizontal coordinate of the lower left corner of this viewport's origin.
	 * @param y - The vertical coordinate of the lower left corner of this viewport's origin.
	 * @param width - The width of this viewport.
	 * @param height - The height of this viewport.
	 */
	setAll(x: number, y: number, width: number, height: number): void {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	/** The maximum allowed width of this viewport. */
	readonly maxWidth: number;

	/** The maximum allowed height of this viewport. */
	readonly maxHeight: number;
}

/** The blend color of a rendering context. */
export class BlendColor {
	#updateCache(): void {
		[this.#red, this.#green, this.#blue, this.#alpha] = this.#gl.getParameter(WebGLConstant.BLEND_COLOR);
	}

	#updateInternal(): void {
		this.#gl.blendColor(this.red, this.green, this.blue, this.alpha);
	}

	/**
	 * Creates a blend color.
	 * @param gl - The standard context interface.
	 */
	constructor(gl: WebGL2RenderingContext) {
		this.#gl = gl;
	}

	readonly #gl: WebGL2RenderingContext;

	// TODO: Clamp RGBA values between 0 and 1.

	#red?: number;
	/** The red component of the source and destination blending factors of this blend color. */
	get red(): number {
		if (!this.#red) { this.#updateCache(); }
		return this.#red as number;
	}
	set red(value: number) {
		if (value != this.#red) {
			this.#red = value;
			this.#updateInternal();
		}
	}

	#green?: number;
	/** The green component of the source and destination blending factors of this blend color. */
	get green(): number {
		if (!this.#green) { this.#updateCache(); }
		return this.#green as number;
	}
	set green(value: number) {
		if (value != this.#green) {
			this.#green = value;
			this.#updateInternal();
		}
	}

	#blue?: number;
	/** The blue component of the source and destination blending factors of this blend color. */
	get blue(): number {
		if (!this.#blue) { this.#updateCache(); }
		return this.#blue as number;
	}
	set blue(value: number) {
		if (value != this.#blue) {
			this.#blue = value;
			this.#updateInternal();
		}
	}

	#alpha?: number;
	/** The alpha component of the source and destination blending factors of this blend color. */
	get alpha(): number {
		if (!this.#alpha) { this.#updateCache(); }
		return this.#alpha as number;
	}
	set alpha(value: number) {
		if (value != this.#alpha) {
			this.#alpha = value;
			this.#updateInternal();
		}
	}

	/**
	 * Sets all values in this blend color.
	 * @param red - The red component of the source and destination blending factors of this blend color.
	 * @param green - The green component of the source and destination blending factors of this blend color.
	 * @param blue - The blue component of the source and destination blending factors of this blend color.
	 * @param alpha - The alpha component of the source and destination blending factors of this blend color.
	 */
	setAll(red: number, green: number, blue: number, alpha: number): void {
		this.red = red;
		this.green = green;
		this.blue = blue;
		this.alpha = alpha;
	}
}

/** The blend equations of a rendering context. */
export class BlendEquations {
	#updateInternal(): void {
		this.#gl.blendEquationSeparate(this.rgb, this.alpha);
	}

	/**
	 * Creates a blend equation.
	 * @param gl - The standard context interface.
	 */
	constructor(gl: WebGL2RenderingContext) {
		this.#gl = gl;
	}

	#gl: WebGL2RenderingContext;

	#rgb?: BlendEquation;
	/** The RGB blend equation of the rendering context. */
	get rgb(): BlendEquation {
		this.#rgb ??= this.#gl.getParameter(WebGLConstant.BLEND_EQUATION_RGB);
		return this.#rgb as BlendEquation;
	}
	set rgb(value: BlendEquation) {
		if (value != this.#rgb) {
			this.#rgb = value;
			this.#updateInternal();
		}
	}

	#alpha?: BlendEquation;
	/** The RGB blend equation of the rendering context. */
	get alpha(): BlendEquation {
		this.#alpha ??= this.#gl.getParameter(WebGLConstant.BLEND_EQUATION_ALPHA);
		return this.#alpha as BlendEquation;
	}
	set alpha(value: BlendEquation) {
		if (value != this.#alpha) {
			this.#alpha = value;
			this.#updateInternal();
		}
	}

	/** The RGB and alpha blend equations of the rendering context. */
	get both(): BlendEquation {
		if (this.rgb == this.alpha) { return this.rgb; }
		throw new Error("The RGB and alpha blend equations are different.");
	}
	set both(value: BlendEquation) {
		this.rgb = value;
		this.alpha = value;
	}
}

/** The blend functions of a rendering context. */
export class BlendFunctions {
	#updateInternal(): void {
		this.#gl.blendFuncSeparate(this.sourceRGB, this.destinationRGB, this.sourceAlpha, this.destinationAlpha);
	}

	/**
	 * Creates a blend function.
	 * @param gl - The standard context interface.
	 */
	constructor(gl: WebGL2RenderingContext) {
		this.#gl = gl;
	}

	readonly #gl: WebGL2RenderingContext;

	#sourceRGB?: BlendFunction;
	/** The function used for blending pixel arithmetic for the red, green, and blue source blending factors. */
	get sourceRGB(): BlendFunction {
		this.#sourceRGB ??= this.#gl.getParameter(WebGLConstant.BLEND_SRC_RGB);
		return this.#sourceRGB as BlendFunction;
	}
	set sourceRGB(value: BlendFunction) {
		if (value != this.#sourceRGB) {
			this.#sourceRGB = value;
			this.#updateInternal();
		}
	}

	#destinationRGB?: BlendFunction;
	/** The function used for blending pixel arithmetic for the red, green, and blue destination blending factors. */
	get destinationRGB(): BlendFunction {
		this.#destinationRGB ??= this.#gl.getParameter(WebGLConstant.BLEND_DST_RGB);
		return this.#destinationRGB as BlendFunction;
	}
	set destinationRGB(value: BlendFunction) {
		if (value != this.#destinationRGB) {
			this.#destinationRGB = value;
			this.#updateInternal();
		}
	}

	#sourceAlpha?: BlendFunction;
	/** The function used for blending pixel arithmetic for the alpha source blending factor. */
	get sourceAlpha(): BlendFunction {
		this.#sourceAlpha ??= this.#gl.getParameter(WebGLConstant.BLEND_SRC_ALPHA);
		return this.#sourceAlpha as BlendFunction;
	}
	set sourceAlpha(value: BlendFunction) {
		if (value != this.#sourceAlpha) {
			this.#sourceAlpha = value;
			this.#updateInternal();
		}
	}

	#destinationAlpha?: BlendFunction;
	/** The function used for blending pixel arithmetic for the alpha destination blending factor. */
	get destinationAlpha(): BlendFunction {
		this.#destinationAlpha ??= this.#gl.getParameter(WebGLConstant.BLEND_DST_ALPHA);
		return this.#destinationAlpha as BlendFunction;
	}
	set destinationAlpha(value: BlendFunction) {
		if (value != this.#destinationAlpha) {
			this.#destinationAlpha = value;
			this.#updateInternal();
		}
	}

	/** The RGB and alpha blending functions for the source. */
	get source(): BlendFunction {
		if (this.sourceRGB == this.sourceAlpha) { return this.sourceRGB; }
		throw new Error("The source RGB and alpha blending functions do not match.");
	}
	set source(value: BlendFunction) {
		this.sourceRGB = value;
		this.sourceAlpha = value;
	}

	/** The RGB and alpha blending functions for the destination. */
	get destination(): BlendFunction {
		if (this.destinationRGB == this.destinationAlpha) { return this.destinationRGB; }
		throw new Error("The destination RGB and alpha blending functions do not match.");
	}
	set destination(value: BlendFunction) {
		this.destinationRGB = value;
		this.destinationAlpha = value;
	}
}

/** The color mask of a rendering context. */
export class ColorMask {
	#updateCache(): void {
		[this.#red, this.#green, this.#blue, this.#alpha] = this.#gl.getParameter(WebGLConstant.COLOR_WRITEMASK);
	}

	#updateInternal(): void {
		this.#gl.colorMask(this.red, this.green, this.blue, this.alpha);
	}

	/**
	 * Creates a color mask.
	 * @param gl - The standard context interface.
	 */
	constructor(gl: WebGL2RenderingContext) {
		this.#gl = gl;
	}

	readonly #gl: WebGL2RenderingContext;

	#red?: boolean;
	/** Whether or not the red color component can be written into the frame buffer for this context. */
	get red(): boolean {
		if (!this.#red) { this.#updateCache(); }
		return this.#red as boolean;
	}
	set red(value: boolean) {
		if (value != this.#red) {
			this.#red = value;
			this.#updateInternal();
		}
	}

	#green?: boolean;
	/** Whether or not the green color component can be written into the frame buffer for this context. */
	get green(): boolean {
		if (!this.#green) { this.#updateCache(); }
		return this.#green as boolean;
	}
	set green(value: boolean) {
		if (value != this.#green) {
			this.#green = value;
			this.#updateInternal();
		}
	}

	#blue?: boolean;
	/** Whether or not the blue color component can be written into the frame buffer for this context. */
	get blue(): boolean {
		if (!this.#blue) { this.#updateCache(); }
		return this.#blue as boolean;
	}
	set blue(value: boolean) {
		if (value != this.#blue) {
			this.#blue = value;
			this.#updateInternal();
		}
	}

	#alpha?: boolean;
	/** Whether or not the alpha color component can be written into the frame buffer for this context. */
	get alpha(): boolean {
		if (!this.#alpha) { this.#updateCache(); }
		return this.#alpha as boolean;
	}
	set alpha(value: boolean) {
		if (value != this.#alpha) {
			this.#alpha = value;
			this.#updateInternal();
		}
	}

	/**
	 * Sets all values in this color mask.
	 * @param red - Whether or not the red color component can be written into the frame buffer for this context.
	 * @param green - Whether or not the green color component can be written into the frame buffer for this context.
	 * @param blue - Whether or not the blue color component can be written into the frame buffer for this context.
	 * @param alpha - Whether or not the alpha color component can be written into the frame buffer for this context.
	 */
	setAll(red: boolean, green: boolean, blue: boolean, alpha: boolean): void {
		this.red = red;
		this.green = green;
		this.blue = blue;
		this.alpha = alpha;
	}
}

/** The depth range of a rendering context. */
export class DepthRange {
	#updateCache(): void {
		[this.#near, this.#far] = this.#gl.getParameter(WebGLConstant.DEPTH_RANGE);
	}

	#updateInternal(): void {
		this.#gl.depthRange(this.near, this.far);
	}

	/**
	 * Creates a depth range.
	 * @param gl - The standard context interface.
	 */
	constructor(gl: WebGL2RenderingContext) {
		this.#gl = gl;
	}

	#gl: WebGL2RenderingContext;

	// TODO: Clamp near and far to 0 to 1.

	#near?: number;
	/** The mapping of the near clipping pane to window or viewport coordinates for this rendering context. */
	get near(): number {
		if (!this.#near) { this.#updateCache(); }
		return this.#near as number;
	}
	set near(value: number) {
		if (value != this.#near) {
			this.#near = value;
			this.#updateInternal();
		}
	}

	#far?: number;
	/** The mapping of the far clipping pane to window or viewport coordinates for this rendering context. */
	get far(): number {
		if (!this.#far) { this.#updateCache(); }
		return this.#far as number;
	}
	set far(value: number) {
		if (value != this.#far) {
			this.#far = value;
			this.#updateInternal();
		}
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

		// Context
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

		// Viewing and clipping
		this.scissorBox = new ScissorBox(gl);
		this.viewport = new Viewport(gl);

		// State information
		this.maxTextureUnits = gl.getParameter(WebGLConstant.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
		this.blendColor = new BlendColor(gl);
		this.blendEquations = new BlendEquations(gl);
		this.blendFunctions = new BlendFunctions(gl);
		this.depthRange = new DepthRange(gl);
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

	// TODO: Add XR support once the WebXR API is standardized. gl.makeXRCompatible();

	/** The scissor box of this context. */
	readonly scissorBox: ScissorBox;

	/** The viewport of this context. */
	readonly viewport: Viewport;

	#activeTexture?: number;
	/** The active texture unit of the rendering context. */
	get activeTexture(): number {
		this.#activeTexture ??= (this.internal as WebGL2RenderingContext).getParameter(WebGLConstant.ACTIVE_TEXTURE);
		return this.#activeTexture as number;
	}
	set activeTexture(value: number) {
		if (value != this.#activeTexture) {
			if (value > this.maxTextureUnits) { throw new Error("Texture unit is greater than maximum texture units."); }
			(this.internal as WebGL2RenderingContext).activeTexture(value);
			this.#activeTexture = value;
		}
	}

	/** The maximum number of texture units for this rendering context. */
	readonly maxTextureUnits: number;

	/** The source and destination blending factors for this rendering context. */
	readonly blendColor: BlendColor;

	/** The RGB and alpha blend equations for this rendering context. */
	readonly blendEquations: BlendEquations;

	/** The source and destination blend functions for this rendering context. */
	readonly blendFunctions: BlendFunctions;

	#clearColor?: Color;
	/** The color to be used when clearing this rendering context. */
	get clearColor(): Color {
		this.#clearColor ??= new Color([...(this.internal as WebGL2RenderingContext).getParameter(WebGLConstant.COLOR_CLEAR_VALUE)]);
		return this.#clearColor;
	}
	set clearColor(value: Color) {
		if (value != this.#clearColor) {
			(this.internal as WebGL2RenderingContext).clearColor(value[0] as number, value[1] as number, value[2] as number, value[3] as number);
			this.#clearColor = value;
		}
	}

	// TODO: Clamp clear depth between 0 and 1.

	#clearDepth?: number;
	/** The depth value to use when clearing this rendering context. */
	get clearDepth(): number {
		this.#clearDepth ??= (this.internal as WebGL2RenderingContext).getParameter(WebGLConstant.DEPTH_CLEAR_VALUE);
		return this.#clearDepth as number;
	}
	set clearDepth(value: number) {
		if (value != this.#clearDepth) {
			(this.internal as WebGL2RenderingContext).clearDepth(value);
			this.#clearDepth = value;
		}
	}

	#clearStencil?: number;
	/** The depth value to use when clearing this rendering context. */
	get clearStencil(): number {
		this.#clearStencil ??= (this.internal as WebGL2RenderingContext).getParameter(WebGLConstant.STENCIL_CLEAR_VALUE);
		return this.#clearStencil as number;
	}
	set clearStencil(value: number) {
		if (value != this.#clearStencil) {
			(this.internal as WebGL2RenderingContext).clearStencil(value);
			this.#clearStencil = value;
		}
	}

	#cullFace?: PolygonFace;
	/** Whether front- and/or back-facing polygons can be culled. */
	get cullFace(): PolygonFace {
		this.#cullFace ??= (this.internal as WebGL2RenderingContext).getParameter(WebGLConstant.CULL_FACE_MODE);
		return this.#cullFace as PolygonFace;
	}
	set cullFace(value: PolygonFace) {
		if (value != this.#cullFace) {
			(this.internal as WebGL2RenderingContext).cullFace(value);
			this.#cullFace = value;
		}
	}

	#depthFunction?: DepthFunction;
	/** The function that compares incoming pixel depth to the current depth buffer value for this rendering context. */
	get depthFunction(): DepthFunction {
		this.#depthFunction ??= (this.internal as WebGL2RenderingContext).getParameter(WebGLConstant.DEPTH_FUNC);
		return this.#depthFunction as DepthFunction;
	}
	set depthFunction(value: DepthFunction) {
		if (value != this.#depthFunction) {
			(this.internal as WebGL2RenderingContext).depthFunc(value);
			this.#depthFunction = value;
		}
	}

	#depthMask?: boolean;
	/** Whether writing into the depth buffer is enabled for this rendering context. */
	get depthMask(): boolean {
		this.#depthMask ??= (this.internal as WebGL2RenderingContext).getParameter(WebGLConstant.DEPTH_WRITEMASK);
		return this.#depthMask as boolean;
	}
	set depthMask(value: boolean) {
		if (value != this.#depthMask) {
			(this.internal as WebGL2RenderingContext).depthMask(value);
			this.#depthMask = value;
		}
	}

	/** The depth range of this rendering context. */
	readonly depthRange: DepthRange;
}
