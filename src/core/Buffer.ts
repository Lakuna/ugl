import type Context from "#Context";
import BufferTarget from "#BufferTarget";
import {
	ARRAY_BUFFER_BINDING,
	COPY_READ_BUFFER_BINDING,
	COPY_WRITE_BUFFER_BINDING,
	ELEMENT_ARRAY_BUFFER_BINDING,
	PIXEL_PACK_BUFFER_BINDING,
	PIXEL_UNPACK_BUFFER_BINDING,
	TRANSFORM_FEEDBACK_BUFFER_BINDING,
	UNIFORM_BUFFER_BINDING
} from "#constants";
import type { UintTypedArray } from "#UintTypedArray";
import type { TypedArray } from "#TypedArray";
import BufferUsage from "#BufferUsage";
import UnsupportedOperationError from "#UnsupportedOperationError";
import BufferDataType from "#BufferDataType";

/**
 * A data stucture that supplies per-vertex data to the GPU.
 * @see [Attributes](https://www.lakuna.pw/a/webgl/attributes)
 */
export default class Buffer {
	/**
	 * Unbinds the buffer from the given binding point.
	 * @param context The rendering context.
	 * @param target The target.
	 */
	public static unbind(context: Context, target: BufferTarget): void {
		Buffer.bind(context, target, null);
	}

	/**
	 * Gets the internal representation of the currently-bound buffer.
	 * @param context The context that the buffer is bound to.
	 * @param target The target that the buffer is bound to.
	 * @returns The currently-bound buffer.
	 */
	private static getBoundBuffer(
		context: Context,
		target: BufferTarget
	): WebGLBuffer | null {
		switch (target) {
			case BufferTarget.ARRAY_BUFFER:
				return context.internal.getParameter(ARRAY_BUFFER_BINDING);
			case BufferTarget.COPY_READ_BUFFER:
				return context.internal.getParameter(COPY_READ_BUFFER_BINDING);
			case BufferTarget.COPY_WRITE_BUFFER:
				return context.internal.getParameter(COPY_WRITE_BUFFER_BINDING);
			case BufferTarget.ELEMENT_ARRAY_BUFFER:
				return context.internal.getParameter(ELEMENT_ARRAY_BUFFER_BINDING);
			case BufferTarget.PIXEL_PACK_BUFFER:
				return context.internal.getParameter(PIXEL_PACK_BUFFER_BINDING);
			case BufferTarget.PIXEL_UNPACK_BUFFER:
				return context.internal.getParameter(PIXEL_UNPACK_BUFFER_BINDING);
			case BufferTarget.TRANSFORM_FEEDBACK_BUFFER:
				return context.internal.getParameter(TRANSFORM_FEEDBACK_BUFFER_BINDING);
			case BufferTarget.UNIFORM_BUFFER:
				return context.internal.getParameter(UNIFORM_BUFFER_BINDING);
		}
	}

	/**
	 * Binds a buffer to a binding point.
	 * @param context The rendering context of the buffer.
	 * @param target The target binding point.
	 * @param buffer The buffer.
	 */
	private static bind(
		context: Context,
		target: BufferTarget,
		buffer: WebGLBuffer | null
	): void {
		context.internal.bindBuffer(target, buffer);
	}

	/**
	 * Creates an element array buffer.
	 * @param context The rendering context of the buffer.
	 * @param data The data to store in the buffer.
	 * @param target The binding point to bind the buffer to.
	 * @param usage The usage pattern of the buffer's data store.
	 */
	public constructor(
		context: Context,
		data: UintTypedArray,
		target?: BufferTarget.ELEMENT_ARRAY_BUFFER,
		usage?: BufferUsage
	);

	/**
	 * Creates a buffer.
	 * @param context The rendering context of the buffer.
	 * @param data The data to store in the buffer.
	 * @param target The binding point to bind the buffer to.
	 * @param usage The usage pattern of the buffer's data store.
	 */
	public constructor(
		context: Context,
		data: TypedArray,
		target?: BufferTarget,
		usage?: BufferUsage
	);

	public constructor(
		context: Context,
		data: TypedArray,
		target: BufferTarget = BufferTarget.ARRAY_BUFFER,
		usage: BufferUsage = BufferUsage.STATIC_DRAW
	) {
		if (
			target == BufferTarget.ELEMENT_ARRAY_BUFFER &&
			!(
				data instanceof Uint8Array ||
				data instanceof Uint8ClampedArray ||
				data instanceof Uint16Array ||
				data instanceof Uint32Array
			)
		) {
			throw new UnsupportedOperationError(
				"The element array buffer does not contain unsigned integers."
			);
		}

		this.context = context;
		this.dataPrivate = data;
		this.target = target;
		this.usage = usage;
		this.typePrivate = BufferDataType.BYTE;

		const buffer: WebGLBuffer | null = context.internal.createBuffer();
		if (!buffer) {
			throw new UnsupportedOperationError();
		}
		this.internal = buffer;

		this.data = data;
	}

	/** The rendering context of this buffer. */
	public readonly context: Context;

	/** The binding point to bind this buffer to. */
	public target: BufferTarget;

	/** The usage pattern of this buffer's data store. */
	public usage: BufferUsage;

	/** The WebGL API interface of this buffer. */
	public readonly internal: WebGLBuffer;

	/** The data contained within this buffer. */
	private dataPrivate: TypedArray;

	/** The data contained within this buffer. */
	public get data(): TypedArray {
		return this.dataPrivate;
	}

	/** The data contained within this buffer. */
	public set data(value: TypedArray) {
		this.with((buffer: this): void => {
			buffer.context.internal.bufferData(buffer.target, value, buffer.usage);
			buffer.dataPrivate = value;

			if (value instanceof Int8Array) {
				buffer.typePrivate = BufferDataType.BYTE;
			} else if (
				value instanceof Uint8Array ||
				value instanceof Uint8ClampedArray
			) {
				buffer.typePrivate = BufferDataType.UNSIGNED_BYTE;
			} else if (value instanceof Uint16Array) {
				buffer.typePrivate = BufferDataType.UNSIGNED_SHORT;
			} else if (value instanceof Int16Array) {
				buffer.typePrivate = BufferDataType.SHORT;
			} else {
				buffer.typePrivate = BufferDataType.FLOAT;
			}
		});
	}

	/** The size of each element in this buffer in bytes. */
	public get elementSize(): number {
		switch (this.type) {
			case BufferDataType.BYTE:
			case BufferDataType.UNSIGNED_BYTE:
				return 1;
			case BufferDataType.HALF_FLOAT:
			case BufferDataType.UNSIGNED_SHORT:
			case BufferDataType.SHORT:
				return 2;
			case BufferDataType.FLOAT:
				return 4;
		}
	}

	/** The type of each component in this buffer. */
	private typePrivate: BufferDataType;

	/** The type of each component in this buffer. */
	public get type(): BufferDataType {
		return this.typePrivate;
	}

	/** Binds this buffer to its target binding point. */
	public bind(): void {
		Buffer.bind(this.context, this.target, this.internal);
	}

	/**
	 * Executes the given function with this buffer bound, then re-binds the
	 * previously-bound buffer.
	 * @param f The function to execute.
	 * @returns The return value of the executed function.
	 */
	public with<T>(f: (buffer: this) => T): T {
		const previousBinding: WebGLBuffer | null = Buffer.getBoundBuffer(
			this.context,
			this.target
		);
		this.bind();
		const out: T = f(this);
		Buffer.bind(this.context, this.target, previousBinding);
		return out;
	}

	/** Deletes this buffer. */
	public delete(): void {
		this.context.internal.deleteBuffer(this.internal);
	}
}
