import BufferTarget from "#BufferTarget";
import BufferUsage from "#BufferUsage";
import type Context from "#Context";
import ContextDependent from "#ContextDependent";
import type DataType from "#DataType";
import UnsupportedOperationError from "#UnsupportedOperationError";
import getDataTypeForTypedArray from "#getDataTypeForTypedArray";
import getParameterForBufferTarget from "#getParameterForBufferTarget";

/**
 * An array of binary data.
 * @see [`WebGLBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLBuffer)
 */
export default abstract class BufferParent extends ContextDependent {
	/**
	 * The currently-bound buffer cache.
	 * @see [`bindBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer)
	 * @internal
	 */
	private static bindingsCache?: Map<
		WebGL2RenderingContext,
		Map<BufferTarget, WebGLBuffer | null>
	>;

	/**
	 * Get the buffer bindings cache.
	 * @returns The buffer bindings cache.
	 * @internal
	 */
	private static getBindingsCache() {
		return (BufferParent.bindingsCache ??= new Map());
	}

	/**
	 * Get the buffer bindings cache for a rendering context.
	 * @param gl - The rendering context.
	 * @returns The buffer bindings cache.
	 * @internal
	 */
	private static getContextBindingsCache(gl: WebGL2RenderingContext) {
		// Get the full bindings cache.
		const bindingsCache = BufferParent.getBindingsCache();

		// Get the context bindings cache.
		let contextBindingsCache = bindingsCache.get(gl);
		if (typeof contextBindingsCache === "undefined") {
			contextBindingsCache = new Map();
			bindingsCache.set(gl, contextBindingsCache);
		}

		return contextBindingsCache;
	}

	/**
	 * Get the currently-bound buffer for a binding point.
	 * @param gl - The rendering context.
	 * @param target - The binding point.
	 * @returns The buffer.
	 * @see [`bindBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer)
	 * @internal
	 */
	public static getBound(gl: WebGL2RenderingContext, target: BufferTarget) {
		// Get the context bindings cache.
		const contextBindingsCache = BufferParent.getContextBindingsCache(gl);

		// Get the bound buffer.
		let boundBuffer = contextBindingsCache.get(target);
		if (typeof boundBuffer === "undefined") {
			boundBuffer = gl.getParameter(
				getParameterForBufferTarget(target)
			) as WebGLBuffer | null;
			contextBindingsCache.set(target, boundBuffer);
		}
		return boundBuffer;
	}

	/**
	 * Bind a buffer to a binding point.
	 * @param gl - The rendering context.
	 * @param target - The binding point.
	 * @param buffer - The buffer.
	 * @see [`bindBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer)
	 * @internal
	 */
	public static bindGl(
		gl: WebGL2RenderingContext,
		target: BufferTarget,
		buffer: WebGLBuffer | null
	) {
		// Do nothing if the binding is already correct.
		if (BufferParent.getBound(gl, target) === buffer) {
			return;
		}

		// Get the context bindings cache.
		const contextBindingsCache = BufferParent.getContextBindingsCache(gl);

		// Unbind the buffer from all other targets.
		if (buffer !== null) {
			for (const [otherTarget, otherBuffer] of contextBindingsCache) {
				if (target === otherTarget || buffer !== otherBuffer) {
					continue;
				}

				gl.bindBuffer(otherTarget, null);
				contextBindingsCache.set(otherTarget, null);
			}
		}

		// Bind the buffer to the target.
		gl.bindBuffer(target, buffer);
		contextBindingsCache.set(target, buffer);
	}

	/**
	 * Unbind the buffer that is bound to the given binding point.
	 * @param gl - The rendering context.
	 * @param target - The binding point.
	 * @param buffer - The buffer to unbind, or `undefined` for any buffer.
	 * @see [`bindBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer)
	 * @internal
	 */
	public static unbindGl(
		gl: WebGL2RenderingContext,
		target: BufferTarget,
		buffer?: WebGLBuffer
	) {
		// Do nothing if the buffer is already unbound.
		if (
			typeof buffer !== "undefined" &&
			BufferParent.getBound(gl, target) !== buffer
		) {
			return;
		}

		// Unbind the buffer.
		BufferParent.bindGl(gl, target, null);
	}

	/**
	 * Create a buffer.
	 * @param context - The rendering context.
	 * @param data - The initial data contained in this buffer or the size of this buffer's data store in bytes.
	 * @param usage - The intended usage of the buffer.
	 * @param offset - The index of the element to start reading the buffer at.
	 * @param isHalf - Whether the data contains half floats if it contains floats.
	 * @param target - The target binding point of the buffer.
	 * @see [`createBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createBuffer)
	 * @throws {@link UnsupportedOperationError}
	 * @internal
	 */
	protected constructor(
		context: Context,
		data: ArrayBufferView | number,
		usage = BufferUsage.STATIC_DRAW,
		offset = 0,
		isHalf = false,
		target = BufferTarget.ARRAY_BUFFER
	) {
		super(context);

		const buffer = this.gl.createBuffer();
		if (buffer === null) {
			throw new UnsupportedOperationError();
		}
		this.internal = buffer;
		this.targetCache = target;
		this.usageCache = usage;
		this.offsetCache = offset;
		this.sizeCache = 0;
		this.isHalfCache = isHalf;
		this.setData(data, usage, offset, isHalf);
	}

	/**
	 * The API interface of this buffer.
	 * @see [`WebGLBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLBuffer)
	 * @internal
	 */
	public readonly internal;

	/**
	 * The binding point of this buffer.
	 * @see [`bindBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer)
	 * @internal
	 */
	private targetCache;

	/**
	 * Get the binding point of this buffer.
	 * @see [`bindBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer)
	 * @internal
	 */
	public get target() {
		return this.targetCache;
	}

	/**
	 * Set the binding point of this buffer.
	 * @see [`bindBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer)
	 * @internal
	 */
	public set target(value) {
		if (this.target === value) {
			return;
		}

		this.unbind();
		this.targetCache = value;
	}

	/**
	 * The intended usage of this buffer.
	 * @see [`bufferData`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData)
	 * @internal
	 */
	private usageCache;

	/**
	 * Get the intended usage of this buffer.
	 * @see [`bufferData`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData)
	 */
	public get usage() {
		return this.usageCache;
	}

	/**
	 * The data contained in this buffer.
	 * @see [`bufferData`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData)
	 * @internal
	 */
	private dataCache?: ArrayBufferView;

	/**
	 * Get the data contained in this buffer.
	 * @see [`bufferData`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData)
	 */
	public get data() {
		// If the data cache isn't set, read the buffer.
		if (typeof this.dataCache === "undefined") {
			this.bind();
			this.dataCache = new Float32Array(this.size);
			this.gl.getBufferSubData(this.target, 0, this.dataCache, this.size);
		}

		return this.dataCache;
	}

	/**
	 * Set the data contained in this buffer.
	 * @see [`bufferData`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData)
	 */
	public set data(value) {
		this.setData(value);
	}

	/**
	 * The type of the data in this buffer.
	 * @internal
	 */
	private typeCache?: DataType;

	/** Get the type of the data in this buffer. */
	public get type() {
		return (this.typeCache ??= getDataTypeForTypedArray(this.data));
	}

	/**
	 * The element index offset at which to start reading this buffer.
	 * @see [`bufferData`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData)
	 * @internal
	 */
	private offsetCache;

	/**
	 * Get the element index offset at which to start reading this buffer.
	 * @see [`bufferData`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData)
	 */
	public get offset() {
		return this.offsetCache;
	}

	/**
	 * The size of this buffer's data store in bytes.
	 * @internal
	 */
	private sizeCache;

	/** Get the size of this buffer's data store in bytes. */
	public get size() {
		return this.sizeCache;
	}

	/**
	 * Whether or not this buffer contains 16-bit floating-point data if it contains floating-point data.
	 * @internal
	 */
	private isHalfCache;

	/** Get whether or not this buffer contains 16-bit floating-point data if it contains floating-point data. */
	public get isHalf() {
		return this.isHalfCache;
	}

	/**
	 * Sets the data in this buffer.
	 * @param data - The data to store in this buffer or the size to set this buffer's data store to in bytes.
	 * @param usage - The intended usage of the buffer.
	 * @param offset - The index of the element to start reading the supplied data at.
	 * @param isHalf - Whether the data contains 16-bit floating-point data if it contains floating-point data.
	 * @throws {@link WebglError}
	 */
	public setData(
		data: ArrayBufferView | number,
		usage?: BufferUsage,
		offset?: number,
		isHalf?: boolean
	): void;

	/**
	 * Updates a subset of the data in this buffer.
	 * @param data - The data to store in this buffer.
	 * @param _ - An ignored value.
	 * @param offset - The index of the element to start reading the supplied data at.
	 * @param __ - An ignored value.
	 * @param replaceOffset - The offset in bytes to start replacing data at.
	 * @throws {@link WebglError}
	 */
	public setData(
		data: ArrayBufferView,
		_: never,
		offset: number,
		__: never,
		replaceOffset: number
	): void;

	public setData(
		data: ArrayBufferView | number,
		usage = BufferUsage.STATIC_DRAW,
		offset = 0,
		isHalf = false,
		replaceOffset: number | undefined = void 0
	) {
		// Update regardless of cached value because the data in the `ArrayBufferView` might have changed.
		if (typeof data === "number") {
			this.gl.bufferData(this.target, data, usage);
			delete this.dataCache;
			delete this.typeCache;
			this.sizeCache = data;
			this.usageCache = usage;
			this.isHalfCache = isHalf;
		} else if (typeof replaceOffset === "number") {
			this.gl.bufferSubData(this.target, replaceOffset, data, offset);
			delete this.dataCache;
		} else {
			this.gl.bufferData(this.target, data, usage, offset);
			this.dataCache = data;
			this.typeCache = getDataTypeForTypedArray(data);
			this.sizeCache = data.byteLength;
			this.usageCache = usage;
			this.isHalfCache = isHalf;
		}
		this.context.throwIfError();
		this.offsetCache = offset;
	}

	/**
	 * Delete this buffer.
	 * @see [`deleteBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/deleteBuffer)
	 */
	public delete() {
		this.gl.deleteBuffer(this.internal);
	}

	/**
	 * Bind this buffer to its binding point.
	 * @param target - The new binding point to bind to, or `undefined` for the previous binding point.
	 * @see [`bindBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer)
	 * @internal
	 */
	public bind(target?: BufferTarget) {
		if (typeof target !== "undefined") {
			this.target = target;
		}

		BufferParent.bindGl(this.gl, this.target, this.internal);
	}

	/**
	 * Unbind this buffer from its binding point.
	 * @see [`bindBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer)
	 * @internal
	 */
	public unbind() {
		BufferParent.unbindGl(this.gl, this.target, this.internal);
	}
}
