import type { TypedArray, UintTypedArray } from "#types/TypedArray";
import type Context from "#webgl/Context";
import UnsupportedOperationError from "#utility/UnsupportedOperationError";

/** The currently-bound array buffer. */
export const ARRAY_BUFFER_BINDING = 0x8894;

/** The currently-bound element array buffer. */
export const ELEMENT_ARRAY_BUFFER_BINDING = 0x8895;

/** The currently-bound copy read buffer. */
export const COPY_READ_BUFFER_BINDING = 0x8F36;

/** The currently-bound copy write buffer. */
export const COPY_WRITE_BUFFER_BINDING = 0x8F37;

/** The currently-bound transform feedback buffer. */
export const TRANSFORM_FEEDBACK_BUFFER_BINDING = 0x8C8F;

/** The currently-bound uniform buffer. */
export const UNIFORM_BUFFER_BINDING = 0x8A28;

/** The currently-bound pixel pack buffer. */
export const PIXEL_PACK_BUFFER_BINDING = 0x88ED;

/** The currently-bound pixel unpack buffer. */
export const PIXEL_UNPACK_BUFFER_BINDING = 0x88EF;

/** Binding points for buffers. */
export const enum BufferTarget {
	/** A buffer containing vertex attributes. */
	ARRAY_BUFFER = 0x8892,

	/** A buffer containing element indices. */
	ELEMENT_ARRAY_BUFFER = 0x8893,

	/** A buffer for copying from one buffer to another. */
	COPY_READ_BUFFER = 0x8F36,

	/** A buffer for copying from one buffer to another. */
	COPY_WRITE_BUFFER = 0x8F37,

	/** A buffer for transform feedback operations. */
	TRANSFORM_FEEDBACK_BUFFER = 0x8C8E,

	/** A buffer used for storing uniform blocks. */
	UNIFORM_BUFFER = 0x8A11,

	/** A buffer used for pixel transfer operations. */
	PIXEL_PACK_BUFFER = 0x88EB,

	/** A buffer used for pixel transfer operations. */
	PIXEL_UNPACK_BUFFER = 0x88EC
}

/** Usage patterns of a buffer's data store for optimization purposes. */
export const enum BufferUsage {
	/** The contents are intended to be specified once by the application, and used many times as the source for WebGL drawing and image specification commands. */
	STATIC_DRAW = 0x88E4,

	/** The contents are intended to be respecified repeatedly by the application, and used many times as the source for WebGL drawing and image specification commands. */
	DYNAMIC_DRAW = 0x88E8,

	/** The contents are intended to be specified once by the application, and used at most a few times as the source for WebGL drawing and image specification commands. */
	STREAM_DRAW = 0x88E0,

	/** The contents are intended to be specified once by reading data from WebGL, and queried many times by the application. */
	STATIC_READ = 0x88E5,

	/** The contents are intended to be respecified repeatedly by reading data from WebGL, and queried many times by the application. */
	DYNAMIC_READ = 0x88E9,

	/** The contents are intended to be specified once by reading data from WebGL, and queried at most a few times by the application. */
	STREAM_READ = 0x88E1,

	/** The contents are intended to be specified once by reading data from WebGL, and used many times as the source for WebGL drawing and image specification commands. */
	STATIC_COPY = 0x88E6,

	/** The contents are intended to be respecified repeatedly by reading data from WebGL, and used many times as the source for WebGL drawing and image specification commands. */
	DYNAMIC_COPY = 0x88EA,

	/** The contents are intended to be specified once by reading data from WebGL, and used at most a few times as the source for WebGL drawing and image specification commands. */
	STREAM_COPY = 0x88E2
}

/** Types of data that can be stored as components in a buffer. */
export const enum BufferDataType {
	/** An 8-bit signed integer. */
	BYTE = 0x1400,

	/** A 16-bit signed integer. */
	SHORT = 0x1402,

	/** An 8-bit unsigned integer. */
	UNSIGNED_BYTE = 0x1401,

	/** A 16-bit unsigned integer. */
	UNSIGNED_SHORT = 0x1403,

	/** A 32-bit signed floating-point number. */
	FLOAT = 0x1406,

	/** A 16-bit signed floating-point number. */
	HALF_FLOAT = 0x140B
}

/**
 * A data stucture that supplies per-vertex data to the GPU.
 * @see [Tutorial](https://www.lakuna.pw/a/webgl/attributes)
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
	private static getBoundBuffer(context: Context, target: BufferTarget): WebGLBuffer | null {
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
	private static bind(context: Context, target: BufferTarget, buffer: WebGLBuffer | null): void {
		context.internal.bindBuffer(target, buffer);
	}

	/**
	 * Creates an element array buffer.
	 * @param context The rendering context of the buffer.
	 * @param data The data to store in the buffer.
	 * @param target The binding point to bind the buffer to.
	 * @param usage The usage pattern of the buffer's data store.
	 */
	public constructor(context: Context, data: UintTypedArray, target?: BufferTarget.ELEMENT_ARRAY_BUFFER, usage?: BufferUsage);

	/**
	 * Creates a buffer.
	 * @param context The rendering context of the buffer.
	 * @param data The data to store in the buffer.
	 * @param target The binding point to bind the buffer to.
	 * @param usage The usage pattern of the buffer's data store.
	 */
	public constructor(context: Context, data: TypedArray, target?: BufferTarget, usage?: BufferUsage);

	public constructor(context: Context, data: TypedArray, target: BufferTarget = BufferTarget.ARRAY_BUFFER, usage: BufferUsage = BufferUsage.STATIC_DRAW) {
		if (target == BufferTarget.ELEMENT_ARRAY_BUFFER && !(data instanceof Uint8Array || data instanceof Uint8ClampedArray || data instanceof Uint16Array || data instanceof Uint32Array)) {
			throw new UnsupportedOperationError("The element array buffer does not contain unsigned integers.");
		}

		this.context = context;
		this.dataPrivate = data;
		this.target = target;
		this.usage = usage;
		this.typePrivate = BufferDataType.BYTE;

		const buffer: WebGLBuffer | null = context.internal.createBuffer();
		if (!buffer) { throw new UnsupportedOperationError(); }
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
			} else if (value instanceof Uint8Array
				|| value instanceof Uint8ClampedArray) {
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
	 * Executes the given function with this buffer bound, then re-binds the previously-bound buffer.
	 * @param f The function to execute.
	 * @returns The return value of the executed function.
	 */
	public with<T>(f: (buffer: this) => T): T {
		const previousBinding: WebGLBuffer | null = Buffer.getBoundBuffer(this.context, this.target);
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
