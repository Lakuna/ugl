import { BUFFER_SIZE, BUFFER_USAGE } from "../../constants/constants.js";
import BufferTarget from "../../constants/BufferTarget.js";
import BufferUsage from "../../constants/BufferUsage.js";
import type Context from "../Context.js";
import ContextDependent from "../internal/ContextDependent.js";
import DataType from "../../constants/DataType.js";
import type VertexBuffer from "./VertexBuffer.js";
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
		data: T | number | VertexBuffer = 0,
		usage?: BufferUsage,
		offset?: number,
		length?: number,
		isHalf = false,
		target: BufferTarget = BufferTarget.ARRAY_BUFFER
	) {
		super(context);

		this.internal = this.gl.createBuffer();
		this.targetCache = target;
		this.isHalfCache = isHalf;
		this.isCacheValid = false;

		this.setData(data as T, usage, offset, length, isHalf);
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
	protected dataCache?: T;

	/**
	 * Whether or not the data in the buffer cache hasn't been modified by μGL since it was last cached.
	 * @internal
	 */
	protected isCacheValid: boolean;

	/**
	 * The data contained in this buffer.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/getBufferSubData | getBufferSubData}
	 */
	public abstract get data(): Readonly<T>;

	public abstract set data(value);

	/**
	 * Clear this buffer's data cache.
	 * @internal
	 */
	public clearDataCache(): void {
		this.isCacheValid = false;
	}

	/**
	 * The type of the data in this buffer.
	 * @internal
	 */
	private typeCache?: DataType;

	/** The type of the data in this buffer. */
	public get type(): DataType {
		return (this.typeCache ??= DataType.UNSIGNED_BYTE);
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
		data: T | VertexBuffer,
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
		data: T | VertexBuffer,
		_?: unknown,
		offset?: number,
		length?: number,
		__?: unknown,
		replaceOffset?: number
	): void;

	public setData(
		data: T | number | VertexBuffer,
		usage?: BufferUsage,
		offset?: number,
		length?: number,
		isHalf: boolean = this.isHalf,
		replaceOffset?: number
	) {
		// Default to `STATIC_DRAW`, but remember if the user passed it or not.
		const realUsage = usage ?? BufferUsage.STATIC_DRAW;

		// Update regardless of cached value because the data in the `ArrayBufferView` might have changed.
		this.bind();

		// Set size of buffer (empty data).
		if (typeof data === "number") {
			this.gl.bufferData(this.target, data, realUsage);
			this.dataCache = new Uint8Array(data) as unknown as T;
			this.typeCache = DataType.UNSIGNED_BYTE;
			this.sizeCache = data;
			this.usageCache = realUsage;
			this.isHalfCache = isHalf;
			this.isCacheValid = true;
			return;
		}

		// Copy data from another buffer.
		if (data instanceof Buffer) {
			// The buffers do not need to be bound to `COPY_READ_BUFFER` and `COPY_WRITE_BUFFER`, but they must be bound to different binding points.
			this.bind();
			if (this.target !== data.target) {
				data.bind();
			} else if (this.target === BufferTarget.COPY_WRITE_BUFFER) {
				data.bind(BufferTarget.COPY_READ_BUFFER);
			} else {
				data.bind(BufferTarget.COPY_WRITE_BUFFER);
			}

			// Initialize and copy entire other buffer. Special case to support copying from a buffer in the constructor while also allowing setting a usage pattern.
			const realDstOffset = replaceOffset ?? 0;
			const realLength = length ?? data.size;
			if (usage) {
				this.gl.bufferData(this.target, realDstOffset + realLength, usage);
				this.usageCache = usage;
				this.sizeCache = realDstOffset + realLength;
			}

			this.gl.copyBufferSubData(
				data.target,
				this.target,
				offset ?? 0,
				realDstOffset,
				realLength
			);
			this.isCacheValid = false;
			this.typeCache = data.type;
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
			this.isCacheValid = false;
			return;
		}

		// Replace the data in the buffer.
		this.gl.bufferData(
			this.target,
			data,
			realUsage,
			offset as unknown as number,
			length
		);
		this.isCacheValid = false; // Don't save a reference to the given array buffer in case the user modifies it for other reasons.
		this.typeCache = getDataTypeForTypedArray(data, this.isHalf);
		this.sizeCache = data.byteLength;
		this.usageCache = realUsage;
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
