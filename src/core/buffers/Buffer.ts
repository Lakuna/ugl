import { BUFFER_SIZE, BUFFER_USAGE } from "../../constants/constants.js";
import BufferTarget from "../../constants/BufferTarget.js";
import BufferUsage from "../../constants/BufferUsage.js";
import type Context from "../Context.js";
import ContextDependent from "../internal/ContextDependent.js";
import DataType from "../../constants/DataType.js";
import getDataTypeForTypedArray from "../../utility/internal/getDataTypeForTypedArray.js";

/**
 * An array of binary data.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLBuffer | WebGLBuffer}
 * @public
 */
export default abstract class Buffer<
	T extends ArrayBufferView
> extends ContextDependent {
	/**
	 * Create a buffer.
	 * @param context - The rendering context.
	 * @param data - The initial data contained in this buffer or the size of this buffer's data store in bytes.
	 * @param usage - The intended usage of the buffer.
	 * @param offset - The index of the element to start reading the initial data at.
	 * @param length - The length of the initial data to read into the buffer.
	 * @param isHalf - Whether or not the data contains half floats if it contains floats.
	 * @param target - The target binding point of the buffer.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createBuffer | createBuffer}
	 * @internal
	 */
	protected constructor(
		context: Context,
		data: T | number,
		usage: BufferUsage = BufferUsage.STATIC_DRAW,
		offset: number | undefined = void 0,
		length: number | undefined = void 0,
		isHalf = false,
		target: BufferTarget = BufferTarget.ARRAY_BUFFER
	) {
		super(context);

		this.internal = this.gl.createBuffer();
		this.targetCache = target;
		this.usageCache = usage;
		this.isHalfCache = isHalf;
		if (typeof data === "number") {
			this.sizeCache = data;
			this.dataCache = new Uint8Array(data) as unknown as T;
		} else {
			this.sizeCache = data.byteLength;
			this.dataCache = data;
		}

		this.setData(this.data, this.usage, offset, length, this.isHalf);
	}

	/**
	 * The API interface of this buffer.
	 * @internal
	 */
	public readonly internal: WebGLBuffer;

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
	private usageCache?: BufferUsage;

	/** The intended usage of this buffer. */
	public get usage(): BufferUsage {
		return (this.usageCache ??= this.gl.getBufferParameter(
			this.target,
			BUFFER_USAGE
		));
	}

	/**
	 * The data contained in this buffer.
	 * @internal
	 */
	private dataCache?: T;

	/**
	 * The data contained in this buffer.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/getBufferSubData | getBufferSubData}
	 */
	public get data(): T {
		// TODO: If the data cache isn't set, read the buffer data with `getBufferSubData`. If the buffer's usage isn't a `READ` type, it must first be copied through a `STREAM_READ` buffer.
		return (this.dataCache ??= new Uint8Array() as unknown as T);
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
	 * The size of this buffer's data store in bytes.
	 * @internal
	 */
	private sizeCache?: number;

	/** The size of this buffer's data store in bytes. */
	public get size(): number {
		return (this.sizeCache ??= this.gl.getBufferParameter(
			this.target,
			BUFFER_SIZE
		));
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
	 * Replace the data in this buffer.
	 * @param data - The data to store in this buffer or the size to set this buffer's data store to in bytes.
	 * @param usage - The intended usage of the buffer.
	 * @param offset - The index of the element to start reading the supplied data at.
	 * @param length - The length of the supplied data to read.
	 * @param isHalf - Whether or not the data contains 16-bit floating-point data if it contains floating-point data.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData | bufferData}
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferSubData | bufferSubData}
	 */
	public setData(
		data: T,
		usage?: BufferUsage,
		offset?: number,
		length?: number,
		isHalf?: boolean
	): void;

	/**
	 * Set the size of this buffer, clearing its data.
	 * @param data - The data to store in this buffer or the size to set this buffer's data store to in bytes.
	 * @param usage - The intended usage of the buffer.
	 * @param _ - An unused value.
	 * @param __ - An unused value.
	 * @param isHalf - Whether or not the data contains 16-bit floating-point data if it contains floating-point data.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData | bufferData}
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferSubData | bufferSubData}
	 */
	public setData(
		data: number,
		usage?: BufferUsage,
		_?: unknown,
		__?: unknown,
		isHalf?: boolean
	): void;

	/**
	 * Update a subset of the data in this buffer.
	 * @param data - The data to store in this buffer.
	 * @param _ - An ignored value.
	 * @param offset - The index of the element to start reading the supplied data at.
	 * @param length - The length of the supplied data to read.
	 * @param __ - An ignored value.
	 * @param replaceOffset - The offset in bytes to start replacing data at.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData | bufferData}
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferSubData | bufferSubData}
	 */
	public setData(
		data: T,
		_?: unknown,
		offset?: number,
		length?: number,
		__?: unknown,
		replaceOffset?: number
	): void;

	public setData(
		data: T | number,
		usage: BufferUsage = this.usage,
		offset: number | undefined = void 0,
		length: number | undefined = void 0,
		isHalf: boolean = this.isHalf,
		replaceOffset: number | undefined = void 0
	) {
		// Update regardless of cached value because the data in the `ArrayBufferView` might have changed.
		this.bind();

		// Set size of buffer (empty data).
		if (typeof data === "number") {
			this.gl.bufferData(this.target, data, usage);
			this.dataCache = new Uint8Array(data) as unknown as T;
			this.typeCache = DataType.UNSIGNED_BYTE;
			this.sizeCache = data;
			this.usageCache = usage;
			this.isHalfCache = isHalf;
			return;
		}

		// Update a portion of the buffer.
		if (typeof replaceOffset === "number") {
			this.gl.bufferSubData(
				this.target,
				replaceOffset,
				data,
				offset as unknown as number,
				length
			);
			delete this.dataCache;
			return;
		}

		// Replace the data in the buffer.
		this.gl.bufferData(
			this.target,
			data,
			usage,
			offset as unknown as number,
			length
		);
		this.dataCache = data;
		this.typeCache = getDataTypeForTypedArray(data);
		this.sizeCache = data.byteLength;
		this.usageCache = usage;
		this.isHalfCache = isHalf;
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
