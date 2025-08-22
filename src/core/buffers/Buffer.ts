import { BUFFER_SIZE, BUFFER_USAGE } from "../../constants/constants.js";
import type BufferTarget from "../../constants/BufferTarget.js";
import type BufferUsage from "../../constants/BufferUsage.js";
import type Context from "../Context.js";
import ContextDependent from "../internal/ContextDependent.js";
import DataType from "../../constants/DataType.js";

/**
 * An array of binary data.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLBuffer | WebGLBuffer}
 * @public
 */
export default abstract class Buffer<
	T extends ArrayBufferView = ArrayBufferView
> extends ContextDependent {
	/**
	 * Create a buffer.
	 * @param context - The rendering context.
	 * @param usage - The intended usage of the buffer.
	 * @param offset - The index of the element to start reading the initial data at.
	 * @param length - The length of the initial data to read into the buffer.
	 * @param target - The target binding point of the buffer.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createBuffer | createBuffer}
	 * @internal
	 */
	protected constructor(context: Context) {
		super(context);

		this.internal = this.gl.createBuffer();
		this.isCacheValid = false;
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
	public abstract get target(): BufferTarget;

	/**
	 * The intended usage of this buffer.
	 * @internal
	 */
	protected usageCache?: BufferUsage;

	/** The intended usage of this buffer. */
	public get usage(): BufferUsage {
		if (this.usageCache) {
			return this.usageCache;
		}

		this.bind();
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
	public abstract get data(): T;

	public abstract set data(value: T);

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
	protected typeCache?: DataType;

	/** The type of the data in this buffer. */
	public get type(): DataType {
		return (this.typeCache ??= DataType.UNSIGNED_BYTE);
	}

	/**
	 * The size of this buffer's data store in bytes.
	 * @internal
	 */
	protected sizeCache?: number;

	/** The size of this buffer's data store in bytes. */
	public get size(): number {
		if (typeof this.sizeCache === "number") {
			return this.sizeCache;
		}

		this.bind();
		return (this.sizeCache ??= this.gl.getBufferParameter(
			this.target,
			BUFFER_SIZE
		));
	}

	/**
	 * Set the size of this buffer, clearing its data.
	 * @param data - The size to set this buffer's data store to in bytes.
	 * @param usage - The intended use case of the buffer.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData | bufferData}
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferSubData | bufferSubData}
	 */
	public abstract setData(data: number, usage?: BufferUsage): void;

	/**
	 * Replace all of or update a subset of the data in this buffer.
	 * @param data - The data to store in this buffer.
	 * @param usage - The intended use case of the buffer.
	 * @param srcOffset - The index of the element to start reading the supplied data at.
	 * @param length - The length of the supplied data to read.
	 * @param dstOffset - The offset in bytes to start replacing data at. If this value is set, a subset of the data in the buffer is updated rather than replacing all of the data in the buffer and the usage pattern of the buffer is not updated.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData | bufferData}
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferSubData | bufferSubData}
	 */
	public abstract setData(
		data: T,
		usage?: BufferUsage,
		srcOffset?: number,
		length?: number,
		dstOffset?: number
	): void;

	/**
	 * Delete this buffer.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/deleteBuffer | deleteBuffer}
	 */
	public delete(): void {
		this.gl.deleteBuffer(this.internal);
	}

	/**
	 * Bind this buffer to its binding point.
	 * @internal
	 */
	public abstract bind(): void;

	/**
	 * Unbind this buffer from its binding point.
	 * @internal
	 */
	public abstract unbind(): void;
}
