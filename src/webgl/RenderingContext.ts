import { UnsupportedError } from "../utility/UnsupportedError.js";
import { ContextLostError } from "../utility/ContextLostError.js";
import { WebGLConstant, PolygonFace, TextureUnit, BlendEquation, BlendFunction, DepthFunction,
	FrontFaceDirection, ErrorType, HintTarget, HintValue, ColorspaceConversion } from "./WebGLConstant.js";

/** A WebGL2 rendering context. */
export class RenderingContext {
	/**
	 * Creates a rendering context.
	 * @param canvas - The canvas that the context should belong to.
	 */
	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		const gl: WebGL2RenderingContext | null = canvas.getContext("webgl2");
		if (gl) { this.internal = gl; } else { throw new UnsupportedError("WebGL2 is not supported by your browser."); }
	}

	/** The canvas that this rendering context belongs to. */
	readonly canvas: HTMLCanvasElement;

	/** The WebGL2 rendering context that this object wraps. */
	readonly internal: WebGL2RenderingContext;

	/** The actual width of this rendering context's current drawing buffer. */
	get drawingBufferWidth(): number {
		return this.internal.drawingBufferWidth;
	}

	/** The actual height of this rendering context's current drawing buffer. */
	get drawingBufferHeight(): number {
		return this.internal.drawingBufferHeight;
	}

	/** The context parameters of this rendering context. */
	get contextAttributes(): WebGLContextAttributes {
		const out: WebGLContextAttributes | null = this.internal.getContextAttributes();
		if (out) { return out; } else { throw new ContextLostError(); }
	}

	/** Whether this rendering context has been lost. */
	get isLost(): boolean {
		return this.internal.isContextLost();
	}

	/** The scissor box of this rendering context, which limits the drawing to a specified rectangle. Uses the form `[x, y, width, height]`, where `x` and `y` are the horizontal and vertical coordinate of the lower-left corner, respectively. */
	get scissorBox(): Int32Array {
		return this.internal.getParameter(WebGLConstant.SCISSOR_BOX);
	}

	set scissorBox(value: Int32Array) {
		this.internal.scissor(value[0] as number, value[1] as number, value[2] as number, value[3] as number);
	}

	/** The viewport of this rendering context, which specifies the affine transformation of x and y from normalized device coordinates to window coordinates. Uses the form `[x, y, width, height]`, where `x` and `y` are the horizontal and vertical coordinate of the lower-left corner, respectively. */
	get viewport(): Int32Array {
		return this.internal.getParameter(WebGLConstant.VIEWPORT);
	}

	set viewport(value: Int32Array) {
		this.internal.viewport(value[0] as number, value[1] as number, value[2] as number, value[3] as number);
	}

	/** The active texture unit of this rendering context. */
	get activeTexture(): TextureUnit {
		return this.internal.getParameter(WebGLConstant.ACTIVE_TEXTURE);
	}

	set activeTexture(value: TextureUnit) {
		this.internal.activeTexture(value);
	}

	/** The source and destination blending factors of this rendering context. Uses the form `[red, green, blue, alpha]`. */
	get blendColor(): Float32Array {
		return this.internal.getParameter(WebGLConstant.BLEND_COLOR);
	}

	set blendColor(value: Float32Array) {
		this.internal.blendColor(value[0] as number, value[1] as number, value[2] as number, value[3] as number);
	}

	/** The RGB and alpha blend equations of this rendering context, together. */
	get blendEquation(): BlendEquation {
		return this.internal.getParameter(WebGLConstant.BLEND_EQUATION);
	}

	set blendEquation(value: BlendEquation) {
		this.internal.blendEquation(value);
	}


	/** The RGB and alpha blend equations of this rendering context, separately. Uses the form `[RGB, alpha]`. */
	get blendEquationSeparate(): [BlendEquation, BlendEquation] {
		return [this.internal.getParameter(WebGLConstant.BLEND_EQUATION_RGB), this.internal.getParameter(WebGLConstant.BLEND_EQUATION_ALPHA)];
	}

	set blendEquationSeparate(value: [BlendEquation, BlendEquation]) {
		this.internal.blendEquationSeparate(value[0], value[1]);
	}

	/** The RGB and alpha blend functions (used for blending pixel arithmetic) of this rendering context, together. Uses the form `[source, destination]`. */
	get blendFunction(): [BlendFunction, BlendFunction] {
		return [this.internal.getParameter(WebGLConstant.BLEND_SRC_RGB), this.internal.getParameter(WebGLConstant.BLEND_DST_RGB)];
	}

	set blendFunction(value: [BlendFunction, BlendFunction]) {
		this.internal.blendFunc(value[0], value[1]);
	}

	/** The RGB and alpha blend functions (used for blending pixel arithmetic) of this rendering context, together. Uses the form `[sourceRGB, destinationRGB, sourceAlpha, destinationAlpha]`. */
	get blendFunctionSeparate(): [BlendFunction, BlendFunction, BlendFunction, BlendFunction] {
		return [
			this.internal.getParameter(WebGLConstant.BLEND_SRC_RGB),
			this.internal.getParameter(WebGLConstant.BLEND_DST_RGB),
			this.internal.getParameter(WebGLConstant.BLEND_SRC_ALPHA),
			this.internal.getParameter(WebGLConstant.BLEND_DST_ALPHA)];
	}

	set blendFunctionSeparate(value: [BlendFunction, BlendFunction, BlendFunction, BlendFunction]) {
		this.internal.blendFuncSeparate(value[0], value[1], value[2], value[3]);
	}

	/** The color values used when clearing color buffers. */
	get clearColor(): Float32Array {
		return this.internal.getParameter(WebGLConstant.COLOR_CLEAR_VALUE);
	}

	set clearColor(value: Float32Array) {
		this.internal.clearColor(value[0] as number, value[1] as number, value[2] as number, value[3] as number);
	}

	/** The clear value for the depth buffer of this rendering context. */
	get clearDepth(): number {
		return this.internal.getParameter(WebGLConstant.DEPTH_CLEAR_VALUE);
	}

	set clearDepth(value: number) {
		this.internal.clearDepth(value);
	}

	/** The clear value for the stencil buffer of this rendering context. */
	get clearStencil(): number {
		return this.internal.getParameter(WebGLConstant.STENCIL_CLEAR_VALUE);
	}

	set clearStencil(value: number) {
		this.internal.clearStencil(value);
	}

	/** The color components to enable or disable when drawing or rendering to a framebuffer for this rendering context. Uses the form `[red, green, blue, alpha]`. */
	get colorMask(): [boolean, boolean, boolean, boolean] {
		return this.internal.getParameter(WebGLConstant.COLOR_WRITEMASK);
	}

	set colorMask(value: [boolean, boolean, boolean, boolean]) {
		this.internal.colorMask(value[0], value[1], value[2], value[3]);
	}

	/** Determines which direction of polygons should be culled. */
	get cullFace(): PolygonFace {
		return this.internal.getParameter(WebGLConstant.CULL_FACE_MODE);
	}

	set cullFace(value: PolygonFace) {
		this.internal.cullFace(value);
	}

	/** A function that compares incoming pixel depth to the current depth buffer value for this rendering context. */
	get depthFunction(): DepthFunction {
		return this.internal.getParameter(WebGLConstant.DEPTH_FUNC);
	}

	set depthFunction(value: DepthFunction) {
		this.internal.depthFunc(value);
	}

	/** Whether writing into the depth buffer is enabled for this rendering context. */
	get depthMask(): boolean {
		return this.internal.getParameter(WebGLConstant.DEPTH_WRITEMASK);
	}

	set depthMask(value: boolean) {
		this.internal.depthMask(value);
	}

	/** The depth range mapping from normalized device coordinates to window or viewport coordinates for this rendering context. Uses the form `[near, far]`. */
	get depthRange(): Float32Array {
		return this.internal.getParameter(WebGLConstant.DEPTH_RANGE);
	}

	set depthRange(value: Float32Array) {
		this.internal.depthRange(value[0] as number, value[1] as number);
	}

	/** Whether to blend the computed fragment color values for this rendering context. */
	get doBlend(): boolean {
		return this.internal.isEnabled(WebGLConstant.BLEND);
	}

	set doBlend(value: boolean) {
		if (value) { this.internal.enable(WebGLConstant.BLEND); } else { this.internal.disable(WebGLConstant.BLEND); }
	}

	/** Whether to cull polygons for this rendering context. */
	get doCullFace(): boolean {
		return this.internal.isEnabled(WebGLConstant.CULL_FACE);
	}

	set doCullFace(value: boolean) {
		if (value) { this.internal.enable(WebGLConstant.CULL_FACE); } else { this.internal.disable(WebGLConstant.CULL_FACE); }
	}

	/** Whether to perform depth comparisons and update the depth buffer for this rendering context. */
	get doDepthTest(): boolean {
		return this.internal.isEnabled(WebGLConstant.DEPTH_TEST);
	}

	set doDepthTest(value: boolean) {
		if (value) { this.internal.enable(WebGLConstant.DEPTH_TEST); } else { this.internal.disable(WebGLConstant.DEPTH_TEST); }
	}

	/** Whether to dither color components before they get written to the color buffer for this rendering context. */
	get doDither(): boolean {
		return this.internal.isEnabled(WebGLConstant.DITHER);
	}

	set doDither(value: boolean) {
		if (value) { this.internal.enable(WebGLConstant.DITHER); } else { this.internal.disable(WebGLConstant.DITHER); }
	}

	/** Whether to add an offset to depth values of polygon fragments for this rendering context. */
	get doPolygonOffsetFill(): boolean {
		return this.internal.isEnabled(WebGLConstant.POLYGON_OFFSET_FILL);
	}

	set doPolygonOffsetFill(value: boolean) {
		if (value) { this.internal.enable(WebGLConstant.POLYGON_OFFSET_FILL); } else { this.internal.disable(WebGLConstant.POLYGON_OFFSET_FILL); }
	}

	/** Whether to compute a temporary coverage value determined by the alpha value of this rendering context. */
	get doSampleAlphaToCoverage(): boolean {
		return this.internal.isEnabled(WebGLConstant.SAMPLE_ALPHA_TO_COVERAGE);
	}

	set doSampleAlphaToCoverage(value: boolean) {
		if (value) { this.internal.enable(WebGLConstant.SAMPLE_ALPHA_TO_COVERAGE); } else { this.internal.disable(WebGLConstant.SAMPLE_ALPHA_TO_COVERAGE); }
	}

	/** Whether to check both the fragment's coverage and the temporary coverage value for this rendering context. */
	get doSampleCoverage(): boolean {
		return this.internal.isEnabled(WebGLConstant.SAMPLE_COVERAGE);
	}

	set doSampleCoverage(value: boolean) {
		if (value) { this.internal.enable(WebGLConstant.SAMPLE_COVERAGE); } else { this.internal.disable(WebGLConstant.SAMPLE_COVERAGE); }
	}

	/** Whether to use the scissor test that discards fragments that are outside of the scissor rectangle for this rendering context. */
	get doScissorTest(): boolean {
		return this.internal.isEnabled(WebGLConstant.SCISSOR_TEST);
	}

	set doScissorTest(value: boolean) {
		if (value) { this.internal.enable(WebGLConstant.SCISSOR_TEST); } else { this.internal.disable(WebGLConstant.SCISSOR_TEST); }
	}

	/** Whether to perform stencil testing and update the stencil buffer. */
	get doStencilTest(): boolean {
		return this.internal.isEnabled(WebGLConstant.STENCIL_TEST);
	}

	set doStencilTest(value: boolean) {
		if (value) { this.internal.enable(WebGLConstant.STENCIL_TEST); } else { this.internal.disable(WebGLConstant.STENCIL_TEST); }
	}

	/** Whether primitives should be discarded immidiately before the rasterization stage (after the optional transform feedback stage) for this rendering context. */
	get doRasterizerDiscard(): boolean {
		return this.internal.isEnabled(WebGLConstant.RASTERIZER_DISCARD);
	}

	set doRasterizerDiscard(value: boolean) {
		if (value) { this.internal.enable(WebGLConstant.RASTERIZER_DISCARD); } else { this.internal.disable(WebGLConstant.RASTERIZER_DISCARD); }
	}

	/** Whether polygons are front-facing or back-facing depending on window orientation for this rendering context. */
	get frontFace(): FrontFaceDirection {
		return this.internal.getParameter(WebGLConstant.FRONT_FACE);
	}

	set frontFace(value: FrontFaceDirection) {
		this.internal.frontFace(value);
	}

	/** Error information for this rendering context. */
	get error(): ErrorType {
		return this.internal.getError();
	}

	/** Specifies hints for certain behaviors on this rendering context. */
	hint(target: HintTarget, value: HintValue): void {
		this.internal.hint(target, value);
	}

	/** The width of rasterized lines for this rendering context. */
	get lineWidth(): number {
		return this.internal.getParameter(WebGLConstant.LINE_WIDTH);
	}

	set lineWidth(value: number) {
		this.internal.lineWidth(value);
	}

	/** The packing alignment of pixel data into memory for this rendering context. */
	get packAlignment(): 1 | 2 | 4 | 8 {
		return this.internal.getParameter(WebGLConstant.PACK_ALIGNMENT);
	}

	set packAlignment(value: 1 | 2 | 4 | 8) {
		this.internal.pixelStorei(WebGLConstant.PACK_ALIGNMENT, value);
	}

	/** The unpacking alignment of pixel data from memory for this rendering context. */
	get unpackAlignment(): 1 | 2 | 4 | 8 {
		return this.internal.getParameter(WebGLConstant.UNPACK_ALIGNMENT);
	}

	set unpackAlignment(value: 1 | 2 | 4 | 8) {
		this.internal.pixelStorei(WebGLConstant.UNPACK_ALIGNMENT, value);
	}

	/** Whether to flip source data along its vertical axis for this rendering context. */
	get unpackFlipY(): boolean {
		return this.internal.getParameter(WebGLConstant.UNPACK_FLIP_Y_WEBGL);
	}

	set unpackFlipY(value: boolean) {
		this.internal.pixelStorei(WebGLConstant.UNPACK_FLIP_Y_WEBGL, value);
	}

	/** Whether to multiply the alpha channel into the other color channels for this rendering context. */
	get unpackPremultiplyAlpha(): boolean {
		return this.internal.getParameter(WebGLConstant.UNPACK_PREMULTIPLY_ALPHA_WEBGL);
	}

	set unpackPremultiplyAlpha(value: boolean) {
		this.internal.pixelStorei(WebGLConstant.UNPACK_PREMULTIPLY_ALPHA_WEBGL, value);
	}

	/** Which type of color space conversion to use for this rendering context. */
	get unpackColorspaceConversion(): ColorspaceConversion {
		return this.internal.getParameter(WebGLConstant.UNPACK_COLORSPACE_CONVERSION_WEBGL);
	}

	set unpackColorspaceConversion(value: ColorspaceConversion) {
		this.internal.pixelStorei(WebGLConstant.UNPACK_COLORSPACE_CONVERSION_WEBGL, value);
	}

	/** The number of pixels in a row for this rendering context. */
	get packRowLength(): number {
		return this.internal.getParameter(WebGLConstant.PACK_ROW_LENGTH);
	}

	set packRowLength(value: number) {
		this.internal.pixelStorei(WebGLConstant.PACK_ROW_LENGTH, value);
	}

	/** The number of pixels skipped before the first pixel is written into memory for this rendering context. */
	get packSkipPixels(): number {
		return this.internal.getParameter(WebGLConstant.PACK_SKIP_PIXELS);
	}

	set packSkipPixels(value: number) {
		this.internal.pixelStorei(WebGLConstant.PACK_SKIP_PIXELS, value);
	}

	/** The number of rows of pixels skipped before the first pixel is written into memory for this rendering context. */
	get packSkipRows(): number {
		return this.internal.getParameter(WebGLConstant.PACK_SKIP_ROWS);
	}

	set packSkipRows(value: number) {
		this.internal.pixelStorei(WebGLConstant.PACK_SKIP_ROWS, value);
	}

	/** The number of pixels in a row for this rendering context. */
	get unpackRowLength(): number {
		return this.internal.getParameter(WebGLConstant.UNPACK_ROW_LENGTH);
	}

	set unpackRowLength(value: number) {
		this.internal.pixelStorei(WebGLConstant.UNPACK_ROW_LENGTH, value);
	}

	/** The image height used for reading pixel data from memory for this rendering context. */
	get unpackImageHeight(): number {
		return this.internal.getParameter(WebGLConstant.UNPACK_IMAGE_HEIGHT);
	}

	set unpackImageHeight(value: number) {
		this.internal.pixelStorei(WebGLConstant.UNPACK_IMAGE_HEIGHT, value);
	}

	/** The number of pixels skipped before the first pixel is read from memory for this rendering context. */
	get unpackSkipPixels(): number {
		return this.internal.getParameter(WebGLConstant.UNPACK_SKIP_PIXELS);
	}

	set unpackSkipPixels(value: number) {
		this.internal.pixelStorei(WebGLConstant.UNPACK_SKIP_PIXELS, value);
	}

	/** The number of rows of pixel locations skipped before the first pixel is read from memory for this rendering context. */
	get unpackSkipRows(): number {
		return this.internal.getParameter(WebGLConstant.UNPACK_SKIP_ROWS);
	}

	set unpackSkipRows(value: number) {
		this.internal.pixelStorei(WebGLConstant.UNPACK_SKIP_ROWS, value);
	}

	/** The number of pixel images skipped before the first pixel is read from memory for this rendering context. */
	get unpackSkipImages(): number {
		return this.internal.getParameter(WebGLConstant.UNPACK_SKIP_IMAGES);
	}

	set unpackSkipImages(value: number) {
		this.internal.pixelStorei(WebGLConstant.UNPACK_SKIP_IMAGES, value);
	}

	/** The scale factor for the variable depth offset for each polygon when calculating depth values with this rendering context. */
	get polygonOffsetFactor(): number {
		return this.internal.getParameter(WebGLConstant.POLYGON_OFFSET_FACTOR);
	}

	set polygonOffsetFactor(value: number) {
		this.internal.polygonOffset(value, this.polygonOffsetUnits);
	}

	/** The multiplier by which an implementation-specific value is multiplied to create a constant depth offset when calculating depth values with this rendering context. */
	get polygonOffsetUnits(): number {
		return this.internal.getParameter(WebGLConstant.POLYGON_OFFSET_UNITS);
	}

	set polygonOffsetUnits(value: number) {
		this.internal.polygonOffset(this.polygonOffsetFactor, value);
	}

	/** The multi-sample coverage value for anti-aliasing effects with this rendering context. */
	get sampleCoverageValue(): number {
		return this.internal.getParameter(WebGLConstant.SAMPLE_COVERAGE_VALUE);
	}

	set sampleCoverageValue(value: number) {
		this.internal.sampleCoverage(value, this.sampleCoverageInvert);
	}

	/** Whether the coverage masks should be inverted for anti-aliasing effects with this rendering context. */
	get sampleCoverageInvert(): boolean {
		return this.internal.getParameter(WebGLConstant.SAMPLE_COVERAGE_INVERT);
	}

	set sampleCoverageInvert(value: boolean) {
		this.internal.sampleCoverage(this.sampleCoverageValue, value);
	}

	// BELOW HERE IS FROM gl.getParameter(). TODO: DELETE THIS LINE.

	/** The range of available widths for a line. Uses the form `[low, high]`. */
	get aliasedLineWidthRange(): Float32Array {
		return this.internal.getParameter(WebGLConstant.ALIASED_LINE_WIDTH_RANGE);
	}

	/** The range of available sizes for a point. Uses the form `[low, high]`. */
	get aliasedPointSizeRange(): Float32Array {
		return this.internal.getParameter(WebGLConstant.ALIASED_POINT_SIZE_RANGE);
	}

	/** Alpha bit count for this rendering context. */
	get alphaBits(): number {
		return this.internal.getParameter(WebGLConstant.ALPHA_BITS);
	}
}