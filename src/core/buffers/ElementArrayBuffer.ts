import BufferParent from "#BufferParent";
import BufferTarget from "#BufferTarget";
import BufferUsage from "#BufferUsage";
import type Context from "#Context";
import Vao from "#Vao";

/**
 * An array of binary data to be used as an element array buffer. Must contain unsigned integers.
 * @see [`WebGLBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLBuffer)
 */
export default class ElementArrayBuffer extends BufferParent {
	/**
	 * Create a buffer to be used as an element array buffer.
	 * @param context - The rendering context.
	 * @param data - The initial data contained in this buffer or the size of this buffer's data store in bytes.
	 * @param usage - The intended usage of the buffer.
	 * @param offset - The index of the element to start reading the buffer at.
	 * @see [`createBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createBuffer)
	 * @throws {@link UnsupportedOperationError}
	 */
	public constructor(
		context: Context,
		data: Uint8Array | Uint16Array | Uint32Array | number,
		usage = BufferUsage.STATIC_DRAW,
		offset = 0
	) {
		// Ensure that the indices for a VAO aren't overwritten. Overwriting the indices of the default VAO is fine since μGL doesn't support using the default VAO anyway.
		Vao.unbindGl(context.gl);

		super(
			context,
			data,
			usage,
			offset,
			false,
			BufferTarget.ELEMENT_ARRAY_BUFFER
		);
	}
}
