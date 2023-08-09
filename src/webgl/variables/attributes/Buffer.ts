import type { TypedArray, UintTypedArray } from "#types/TypedArray";
import type Context from "#webgl/Context";
import UnsupportedOperationError from "#utility/UnsupportedOperationError";

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
		this.bind();
		this.context.internal.bufferData(this.target, value, this.usage);
		this.dataPrivate = value;

		if (value instanceof Int8Array) {
			this.typePrivate = BufferDataType.BYTE;
		} else if (value instanceof Uint8Array
			|| value instanceof Uint8ClampedArray) {
			this.typePrivate = BufferDataType.UNSIGNED_BYTE;
		} else if (value instanceof Uint16Array) {
			this.typePrivate = BufferDataType.UNSIGNED_SHORT;
		} else if (value instanceof Int16Array) {
			this.typePrivate = BufferDataType.SHORT;
		} else {
			this.typePrivate = BufferDataType.FLOAT;
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
		this.context.internal.bindBuffer(this.target, this.internal);
	}

	/** Deletes this buffer. */
	public delete(): void {
		this.context.internal.deleteBuffer(this.internal);
	}
}
