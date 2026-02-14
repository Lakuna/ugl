import Buffer from "./Buffer.js";
import BufferTarget from "../../constants/BufferTarget.js";
import BufferUsage from "../../constants/BufferUsage.js";
import type Context from "../Context.js";
import DataType from "../../constants/DataType.js";
import Sync from "../Sync.js";
import getDataTypeForTypedArray from "../../utility/internal/getDataTypeForTypedArray.js";
import getParameterForBufferTarget from "../../utility/internal/getParameterForBufferTarget.js";
import getSizeOfDataType from "../../utility/internal/getSizeOfDataType.js";
import getTypedArrayConstructorForDataType from "../../utility/internal/getTypedArrayConstructorForTextureDataType.js";
import isReadable from "../../utility/isReadable.js";

/**
 * An array of binary data to be used as a vertex buffer object.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLBuffer | WebGLBuffer}
 * @public
 */
export default class VertexBuffer extends Buffer {
	/**
	 * The currently-bound buffer cache.
	 * @internal
	 */
	private static readonly bindingsCache = new Map<
		WebGL2RenderingContext,
		Map<BufferTarget, WebGLBuffer | null>
	>();

	/**
	 * The binding point of this buffer.
	 * @internal
	 */
	private targetCache: BufferTarget;

	/**
	 * Create a buffer to be used as anything other than an element array buffer.
	 * @param context - The rendering context.
	 * @param data - The initial data contained in this buffer or the size of this buffer's data store in bytes.
	 * @param usage - The intended usage of the buffer.
	 * @param offset - The index of the element to start reading the initial data at.
	 * @param length - The length of the initial data to read into the buffer.
	 * @throws {@link UnsupportedOperationError} if a buffer cannot be created.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createBuffer | createBuffer}
	 */
	public constructor(
		context: Context,
		data: ArrayBufferView | number | VertexBuffer = 0,
		usage?: BufferUsage,
		offset?: number,
		length?: number
	) {
		super(context);
		this.targetCache = BufferTarget.ARRAY_BUFFER;
		this.setData(data, usage, offset, length);
	}

	/**
	 * The binding point of this buffer.
	 * @internal
	 */
	public override get target(): BufferTarget {
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
	 * The data contained in this buffer.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/getBufferSubData | getBufferSubData}
	 */
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public get data(): ArrayBufferView {
		// Cache case.
		if (this.dataCache && this.isCacheValid) {
			return this.dataCache;
		}

		// Create a new typed array to store the data cache if it has been resized.
		if (this.dataCache?.byteLength !== this.size) {
			this.dataCache = new (getTypedArrayConstructorForDataType(this.type))(
				this.size / getSizeOfDataType(this.type)
			);
		}

		// If the buffer's usage isn't a `READ` type, it must first be copied through a `STREAM_READ` buffer in order to avoid pipeline stalls.
		const readableBuffer =
			isReadable(this.usage) ? this : (
				new VertexBuffer(this.context, this, BufferUsage.STREAM_READ)
			);

		// Reading from a buffer without checking for previous command completion likely causes pipeline stalls.
		this.context.finish(); // Use `finish` rather than `fenceSync` to make this synchronous. In general, it's better to use the asynchronous version.

		// Read the buffer data into a typed array.
		readableBuffer.bind();
		readableBuffer.gl.getBufferSubData(
			readableBuffer.target,
			0,
			this.dataCache
		);

		return this.dataCache;
	}

	public set data(value: ArrayBufferView) {
		this.setData(value);
	}

	/**
	 * Get the currently-bound buffer for a binding point.
	 * @param context - The rendering context.
	 * @param target - The binding point.
	 * @returns The buffer.
	 * @internal
	 */
	public static getBound(
		context: Context,
		target: BufferTarget
	): WebGLBuffer | null {
		// Get the context bindings cache.
		const contextBindingsCache = VertexBuffer.getContextBindingsCache(
			context.gl
		);

		// Get the bound buffer.
		let boundBuffer = contextBindingsCache.get(target);
		if (typeof boundBuffer === "undefined") {
			boundBuffer =
				context.doPrefillCache ?
					null // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
				:	(context.gl.getParameter(
						getParameterForBufferTarget(target)
					) as WebGLBuffer | null);
			contextBindingsCache.set(target, boundBuffer);
		}

		return boundBuffer;
	}

	/**
	 * Bind a buffer to a binding point.
	 * @param context - The rendering context.
	 * @param target - The binding point.
	 * @param buffer - The buffer.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindBuffer | bindBuffer}
	 * @internal
	 */
	public static bindGl(
		context: Context,
		target: BufferTarget,
		buffer: WebGLBuffer | null
	): void {
		// Do nothing if the binding is already correct.
		if (VertexBuffer.getBound(context, target) === buffer) {
			return;
		}

		// Get the context bindings cache.
		const contextBindingsCache = VertexBuffer.getContextBindingsCache(
			context.gl
		);

		// Unbind the buffer from all other targets.
		if (buffer) {
			for (const [otherTarget, otherBuffer] of contextBindingsCache) {
				if (target === otherTarget || buffer !== otherBuffer) {
					continue;
				}

				context.gl.bindBuffer(otherTarget, null);
				contextBindingsCache.set(otherTarget, null);
			}
		}

		// Bind the buffer to the target.
		context.gl.bindBuffer(target, buffer);
		contextBindingsCache.set(target, buffer);
	}

	/**
	 * Unbind the buffer that is bound to the given binding point.
	 * @param context - The rendering context.
	 * @param target - The binding point.
	 * @param buffer - The buffer to unbind, or `undefined` for any buffer.
	 * @internal
	 */
	public static unbindGl(
		context: Context,
		target: BufferTarget,
		buffer?: WebGLBuffer
	): void {
		// Do nothing if the buffer is already unbound.
		if (buffer && VertexBuffer.getBound(context, target) !== buffer) {
			return;
		}

		// Unbind the buffer.
		VertexBuffer.bindGl(context, target, null);
	}

	/**
	 * Get the buffer bindings cache for a rendering context.
	 * @param gl - The rendering context.
	 * @returns The buffer bindings cache.
	 * @internal
	 */
	private static getContextBindingsCache(
		gl: WebGL2RenderingContext
	): Map<BufferTarget, WebGLBuffer | null> {
		// Get the context bindings cache.
		let contextBindingsCache = VertexBuffer.bindingsCache.get(gl);
		if (!contextBindingsCache) {
			contextBindingsCache = new Map();
			VertexBuffer.bindingsCache.set(gl, contextBindingsCache);
		}

		return contextBindingsCache;
	}

	/**
	 * Get the data contained in this buffer.
	 * @returns The data contained in this buffer.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/getBufferSubData | getBufferSubData}
	 */
	public async getData(): Promise<ArrayBufferView> {
		// Cache case.
		if (this.dataCache && this.isCacheValid) {
			return this.dataCache;
		}

		// Create a new typed array to store the data cache if it has been resized.
		if (this.dataCache?.byteLength !== this.size) {
			this.dataCache = new (getTypedArrayConstructorForDataType(this.type))(
				this.size / getSizeOfDataType(this.type)
			);
		}

		// If the buffer's usage isn't a `READ` type, it must first be copied through a `STREAM_READ` buffer in order to avoid pipeline stalls.
		const readableBuffer =
			isReadable(this.usage) ? this : (
				new VertexBuffer(this.context, this, BufferUsage.STREAM_READ)
			);

		// Reading from a buffer without checking for previous command completion likely causes pipeline stalls.
		const sync = new Sync(this.context);
		await sync.clientWaitUntil();
		sync.delete();

		// Read the buffer data into a typed array.
		readableBuffer.bind();
		readableBuffer.gl.getBufferSubData(
			readableBuffer.target,
			0,
			this.dataCache
		);

		return this.dataCache;
	}

	public override setData(
		data: number | ArrayBufferView | VertexBuffer,
		usage?: BufferUsage,
		srcOffset?: number,
		length?: number,
		dstOffset?: number
	): void {
		// Update regardless of cached value because the data in the `ArrayBufferView` might have changed.
		const realUsage = usage ?? this.usage;
		const realSrcOffset = srcOffset ?? 0;

		// Copy data from another buffer.
		if (data instanceof VertexBuffer) {
			// The buffers do not need to be bound to `COPY_READ_BUFFER` and `COPY_WRITE_BUFFER`, but they must be bound to different binding points.
			this.bind(BufferTarget.COPY_WRITE_BUFFER, false);
			data.bind(
				this.target === BufferTarget.COPY_READ_BUFFER ?
					BufferTarget.COPY_WRITE_BUFFER
				:	BufferTarget.COPY_READ_BUFFER,
				this.target === data.target
			);

			// Initialize and copy entire other buffer. Special case to support copying from a buffer in the constructor while also allowing setting a usage pattern. Also resize if necessary.
			const realDstOffset = dstOffset ?? 0;
			const realLength = length ?? data.size;
			if (realUsage !== this.usage || this.size < realDstOffset + realLength) {
				this.gl.bufferData(this.target, realDstOffset + realLength, realUsage);
				this.usageCache = realUsage;
				this.sizeCache = realDstOffset + realLength;
			}

			this.gl.copyBufferSubData(
				data.target,
				this.target,
				realSrcOffset,
				realDstOffset,
				realLength
			);
			this.isCacheValid = false;
			this.typeCache = data.type;
			return;
		}

		this.bind();

		// Set size of buffer (empty data).
		if (typeof data === "number") {
			this.gl.bufferData(this.target, data, realUsage);
			this.dataCache = new Uint8Array(data) as Uint8Array;
			this.typeCache = DataType.UNSIGNED_BYTE;
			this.sizeCache = data;
			this.usageCache = realUsage;
			this.isCacheValid = true;
			return;
		}

		// Update a portion of the buffer.
		if (typeof dstOffset === "number") {
			this.gl.bufferSubData(
				this.target,
				dstOffset,
				data,
				realSrcOffset,
				length
			);
			this.isCacheValid = false;
			return;
		}

		// Replace the data in the buffer.
		this.gl.bufferData(this.target, data, realUsage, realSrcOffset, length);
		this.isCacheValid = false; // Don't save a reference to the given array buffer in case the user modifies it for other reasons.
		this.typeCache = getDataTypeForTypedArray(data);
		this.sizeCache = data.byteLength;
		this.usageCache = realUsage;
	}

	/**
	 * Bind this buffer to its binding point.
	 * @param target - The new binding point to bind to, or `undefined` for the previous binding point.
	 * @param strict - Bind to the given binding point even if this buffer is already bound to another binding point.
	 * @internal
	 */
	public override bind(target?: BufferTarget, strict = true): void {
		if (
			target &&
			(strict ||
				VertexBuffer.getBound(this.context, this.target) !== this.internal)
		) {
			this.target = target;
		}

		VertexBuffer.bindGl(this.context, this.target, this.internal);
	}

	/**
	 * Unbind this buffer from its binding point.
	 * @internal
	 */
	public override unbind(): void {
		VertexBuffer.unbindGl(this.context, this.target, this.internal);
	}
}
