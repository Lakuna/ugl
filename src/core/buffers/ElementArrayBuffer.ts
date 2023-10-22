import BufferParent from "#BufferParent";
import type Context from "#Context";
import type { TypedArray } from "#TypedArray";
import BufferUsage from "#BufferUsage";
import BufferTarget from "#BufferTarget";

/**
 * An array of binary data to be used for an element array buffer.
 * @see [`WebGLBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLBuffer)
 */
export default class Buffer extends BufferParent {
	/**
	 * Creates a buffer to be used as an element array buffer.
	 * @param context The rendering context.
	 * @param data The initial data contained in this buffer or the size of
	 * this buffer's data store in bytes.
	 * @param usage The intended usage of the buffer.
	 * @param offset The index of the element to start reading the buffer at.
	 * @see [`createBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createBuffer)
	 * @throws {@link WebglError}
	 */
	public constructor(
		context: Context,
		data: TypedArray | number,
		usage: BufferUsage = BufferUsage.STATIC_DRAW,
		offset = 0
	) {
		super(context, data, usage, offset, BufferTarget.ELEMENT_ARRAY_BUFFER);
	}
}
