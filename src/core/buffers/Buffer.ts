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
		target: BufferTarget = BufferTarget.ARRAY_BUFFER
	) {
		super(context);

		this.internal = this.gl.createBuffer();
		this.targetCache = target;
		this.isCacheValid = false;

		this.setData(data as T, usage, offset, length); // Use `as` to cheat and reduce file size - the method will already behave properly regardless of which type of `data` is passed.
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
	private targetCache: BufferTarget;

	/**
	 * The binding point of this buffer.
	 * @internal
	 */
	public get target(): BufferTarget {
		return this.targetCache;
	}

	/** @internal */
	public set target(value: BufferTarget) {
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

	public abstract set data(value: Readonly<T>);

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
	 * Set the size of this buffer, clearing its data.
	 * @param data - The data to store in this buffer or the size to set this buffer's data store to in bytes.
	 * @param usage - The intended usage of the buffer.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData | bufferData}
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferSubData | bufferSubData}
	 */
	public setData(data: number, usage?: BufferUsage): void;

	/**
	 * Replace all of or update a subset of the data in this buffer.
	 * @param data - The data to store in this buffer or the size to set this buffer's data store to in bytes.
	 * @param usage - The intended usage of the buffer.
	 * @param srcOffset - The index of the element to start reading the supplied data at.
	 * @param length - The length of the supplied data to read.
	 * @param dstOffset - The offset in bytes to start replacing data at. If this value is set, a subset of the data in the buffer is updated rather than replacing all of the data in the buffer and the usage pattern of the buffer is not updated.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData | bufferData}
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferSubData | bufferSubData}
	 */
	public setData(
		data: T | VertexBuffer,
		usage?: BufferUsage,
		srcOffset?: number,
		length?: number,
		dstOffset?: number
	): void;

	public setData(
		data: number | T | VertexBuffer,
		usage?: BufferUsage,
		srcOffset?: number,
		length?: number,
		dstOffset?: number
	): void {
		// Default to `STATIC_DRAW`, but remember if the user passed it or not.
		const realUsage = usage ?? BufferUsage.STATIC_DRAW;

		// Update regardless of cached value because the data in the `ArrayBufferView` might have changed.
		this.bind();

		// Set size of buffer (empty data).
		if (typeof data === "number") {
			this.gl.bufferData(this.target, data, realUsage);
			this.dataCache = new Uint8Array(data) as Uint8Array & T;
			this.typeCache = DataType.UNSIGNED_BYTE;
			this.sizeCache = data;
			this.usageCache = realUsage;
			this.isCacheValid = true;
			return;
		}

		// Copy data from another buffer.
		if (data instanceof Buffer) {
			// The buffers do not need to be bound to `COPY_READ_BUFFER` and `COPY_WRITE_BUFFER`, but they must be bound to different binding points.
			this.bind();
			if (this.target !== data.target) {
				data.bind();
			} else if (this.target === BufferTarget.COPY_READ_BUFFER) {
				data.bind(BufferTarget.COPY_WRITE_BUFFER);
			} else {
				data.bind(BufferTarget.COPY_READ_BUFFER);
			}

			// Initialize and copy entire other buffer. Special case to support copying from a buffer in the constructor while also allowing setting a usage pattern.
			const realDstOffset = dstOffset ?? 0;
			const realLength = length ?? data.size;
			if (usage) {
				this.gl.bufferData(this.target, realDstOffset + realLength, usage);
				this.usageCache = usage;
				this.sizeCache = realDstOffset + realLength;
			}

			this.gl.copyBufferSubData(
				data.target,
				this.target,
				srcOffset ?? 0,
				realDstOffset,
				realLength
			);
			this.isCacheValid = false;
			this.typeCache = data.type;
			return;
		}

		// Update a portion of the buffer.
		if (typeof dstOffset === "number") {
			this.gl.bufferSubData(
				this.target,
				dstOffset,
				data,
				srcOffset ?? 0,
				length
			);
			this.isCacheValid = false;
			return;
		}

		// Replace the data in the buffer.
		this.gl.bufferData(this.target, data, realUsage, srcOffset ?? 0, length);
		this.isCacheValid = false; // Don't save a reference to the given array buffer in case the user modifies it for other reasons.
		this.typeCache = getDataTypeForTypedArray(data);
		this.sizeCache = data.byteLength;
		this.usageCache = realUsage;
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
