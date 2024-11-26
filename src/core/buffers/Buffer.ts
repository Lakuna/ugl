import BufferTarget from "../../constants/BufferTarget.js";
import BufferUsage from "../../constants/BufferUsage.js";
import type Context from "../Context.js";
import ContextDependent from "../internal/ContextDependent.js";
import type DataType from "../../constants/DataType.js";
import UnsupportedOperationError from "../../utility/UnsupportedOperationError.js";
import getDataTypeForTypedArray from "../../utility/internal/getDataTypeForTypedArray.js";

/**
 * An array of binary data.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLBuffer | WebGLBuffer}
 * @public
 */
export default abstract class Buffer extends ContextDependent {
	/**
	 * Create a buffer.
	 * @param context - The rendering context.
	 * @param data - The initial data contained in this buffer or the size of this buffer's data store in bytes.
	 * @param usage - The intended usage of the buffer.
	 * @param offset - The index of the element to start reading the buffer at.
	 * @param isHalf - Whether or not the data contains half floats if it contains floats.
	 * @param target - The target binding point of the buffer.
	 * @throws {@link UnsupportedOperationError} if a buffer cannot be created.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createBuffer | createBuffer}
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
			throw new UnsupportedOperationError(
				"The environment does not support buffers."
			);
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
	 * @internal
	 */
	public readonly internal;

	/**
	 * The binding point of this buffer.
	 * @internal
	 */
	private targetCache;

	/**
	 * The binding point of this buffer.
	 * @internal
	 */
	public get target(): BufferTarget {
		return this.targetCache;
	}

	/** @internal */
	public set target(value) {
		if (this.target === value) {
			return;
		}

		this.unbind();
		this.targetCache = value;
	}

	/**
	 * The intended usage of this buffer.
	 * @internal
	 */
	private usageCache;

	/** The intended usage of this buffer. */
	public get usage(): BufferUsage {
		return this.usageCache;
	}

	/**
	 * The data contained in this buffer.
	 * @internal
	 */
	private dataCache?: ArrayBufferView;

	/**
	 * The data contained in this buffer.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/getBufferSubData | getBufferSubData}
	 */
	public get data(): ArrayBufferView {
		// If the data cache isn't set, read the buffer.
		if (!this.dataCache) {
			this.bind();
			this.dataCache = new Float32Array(this.size); // TODO: Don't assume `Float32Array` type.
			this.gl.getBufferSubData(this.target, 0, this.dataCache, this.size); // TODO: "WebGL warning: `getBufferSubData`: Reading from a buffer with usage other than `*_READ` causes pipeline stalls. Copy through a `STREAM_READ` buffer."
			// TODO: Add a `getData` method with more control over calling `getBufferSubData`.
		}

		return this.dataCache;
	}

	public set data(value) {
		this.setData(value);
	}

	/**
	 * The type of the data in this buffer.
	 * @internal
	 */
	private typeCache?: DataType;

	/** The type of the data in this buffer. */
	public get type(): DataType {
		return (this.typeCache ??= getDataTypeForTypedArray(this.data));
	}

	/**
	 * The element index offset at which to start reading this buffer.
	 * @internal
	 */
	private offsetCache;

	/** The element index offset at which to start reading this buffer. */
	public get offset(): number {
		return this.offsetCache;
	}

	/**
	 * The size of this buffer's data store in bytes.
	 * @internal
	 */
	private sizeCache;

	/** The size of this buffer's data store in bytes. */
	public get size(): number {
		return this.sizeCache;
	}

	/**
	 * Whether or not this buffer contains 16-bit floating-point data if it contains floating-point data.
	 * @internal
	 */
	private isHalfCache;

	/** Whether or not this buffer contains 16-bit floating-point data if it contains floating-point data. */
	public get isHalf(): boolean {
		return this.isHalfCache;
	}

	/**
	 * Sets the data in this buffer.
	 * @param data - The data to store in this buffer or the size to set this buffer's data store to in bytes.
	 * @param usage - The intended usage of the buffer.
	 * @param offset - The index of the element to start reading the supplied data at.
	 * @param isHalf - Whether or not the data contains 16-bit floating-point data if it contains floating-point data.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData | bufferData}
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferSubData | bufferSubData}
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
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData | bufferData}
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferSubData | bufferSubData}
	 */
	public setData(
		data: ArrayBufferView,
		_: unknown,
		offset: number,
		__: unknown,
		replaceOffset: number
	): void;

	public setData(
		data: ArrayBufferView | number,
		usage: BufferUsage = this.usage,
		offset: number = this.offset,
		isHalf: boolean = this.isHalf,
		replaceOffset: number | undefined = void 0
	) {
		// Update regardless of cached value because the data in the `ArrayBufferView` might have changed.
		this.bind();
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

		this.offsetCache = offset;
	}

	/**
	 * Delete this buffer.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/deleteBuffer | deleteBuffer}
	 */
	public delete(): void {
		this.gl.deleteBuffer(this.internal);
	}

	/**
	 * Bind this buffer to its binding point.
	 * @param target - The new binding point to bind to, or `undefined` for the previous binding point.
	 * @internal
	 */
	public abstract bind(): void;

	/**
	 * Unbind this buffer from its binding point.
	 * @internal
	 */
	public abstract unbind(): void;
}
