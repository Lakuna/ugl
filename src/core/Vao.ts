import type Context from "#Context";
import { VERTEX_ARRAY_BINDING } from "#constants";
import type Program from "#Program";
import type BufferInfo from "#BufferInfo";
import type { UintTypedArray } from "#UintTypedArray";
import UnsupportedOperationError from "#UnsupportedOperationError";
import Buffer from "#Buffer";
import BufferTarget from "#BufferTarget";
import type { UniformSource } from "#UniformSource";
import Primitive from "#Primitive";
import type Uniform from "#Uniform";
import type { UniformValue } from "#UniformValue";

/**
 * A collection of attribute state; a vertex attribute array.
 * @see [Tutorial](https://www.lakuna.pw/a/webgl/attributes)
 */
export default class Vao {
	/**
	 * Unbinds all vertex array objects from the given rendering context.
	 * @param context The rendering context.
	 */
	public static unbind(context: Context): void {
		Vao.bind(context, null);
	}

	/**
	 * Gets the currently-bound vertex array object.
	 * @param context The rendering context.
	 * @returns The vertex array object.
	 */
	private static getBoundVertexArrayObject(
		context: Context
	): WebGLVertexArrayObject | null {
		return context.internal.getParameter(VERTEX_ARRAY_BINDING);
	}

	/**
	 * Binds the given renderbuffer.
	 * @param context The rendering context.
	 * @param renderbuffer The renderbuffer.
	 */
	private static bind(
		context: Context,
		vao: WebGLVertexArrayObject | null
	): void {
		context.internal.bindVertexArray(vao);
	}

	/**
	 * Creates a vertex array object.
	 * @param program The program that the VAO is used with.
	 * @param attributes The attributes associated with the VAO.
	 * @param indices The indices to supply to the element array buffer of this VAO if the data should be indexed.
	 */
	public constructor(
		program: Program,
		attributes: Array<BufferInfo> = [],
		indices?: UintTypedArray
	) {
		this.program = program;
		this.context = program.context;

		const vao: WebGLVertexArrayObject | null =
			this.context.internal.createVertexArray();
		if (!vao) {
			throw new UnsupportedOperationError();
		}
		this.internal = vao;

		this.attributesPrivate = [];
		for (const attribute of attributes) {
			this.addAttribute(attribute);
		}

		this.indices = indices;
	}

	/** The rendering context of this VAO. */
	public readonly context: Context;

	/** The program that this VAO is used with. */
	public readonly program: Program;

	/** The WebGL API interface of this VAO. */
	public readonly internal: WebGLVertexArrayObject;

	/** The attributes associated with this VAO. */
	private attributesPrivate: Array<BufferInfo>;

	/** The attributes associated with this VAO. */
	public get attributes(): ReadonlyArray<BufferInfo> {
		return this.attributesPrivate;
	}

	/** The element array buffer of this VAO if its data is indexed. */
	private elementArrayBuffer: Buffer | undefined;

	/** The indices in the element array buffer of this VAO if the data is indexed. */
	public get indices(): UintTypedArray | undefined {
		return this.elementArrayBuffer?.data as UintTypedArray;
	}

	/** The indices in the element array buffer of this VAO if the data is indexed. */
	public set indices(value: UintTypedArray | undefined) {
		this.with((vao: this): void => {
			if (value) {
				vao.elementArrayBuffer = new Buffer(
					vao.context,
					value,
					BufferTarget.ELEMENT_ARRAY_BUFFER
				);
				vao.elementArrayBuffer.bind(); // Attached to the VAO; not global.
			} else {
				vao.elementArrayBuffer = undefined;
				Buffer.unbind(vao.context, BufferTarget.ELEMENT_ARRAY_BUFFER); // Attached to the VAO; not global.
			}
		});
	}

	/** Makes this the active VAO. */
	public bind(): void {
		Vao.bind(this.context, this.internal);
	}

	/**
	 * Executes the given function with this vertex array object bound, then re-binds the previously-bound vertex array object.
	 * @param f The function to execute.
	 * @returns The return value of the executed function.
	 */
	public with<T>(f: (vao: this) => T): T {
		const previousBinding: WebGLVertexArrayObject | null =
			Vao.getBoundVertexArrayObject(this.context);
		this.bind();
		const out: T = f(this);
		Vao.bind(this.context, previousBinding);
		return out;
	}

	/**
	 * Adds an attribute to this VAO.
	 * @param attribute The attribute to add.
	 */
	public addAttribute(attribute: BufferInfo): void {
		return this.with((vao: this): void => {
			attribute.use(vao.program);
			vao.attributesPrivate.push(attribute);
		});
	}

	/**
	 * Rasterizes the vertex data stored in this VAO.
	 * @param uniforms A map of uniform variable names to their values to use when rasterizing.
	 * @param primitive The type of primitive to rasterize.
	 * @param offset The number of elements to skip when rasterizing arrays.
	 */
	public draw(
		uniforms?: UniformSource,
		primitive: Primitive = Primitive.TRIANGLES,
		offset = 0
	): void {
		this.program.use();
		return this.with((vao: this): void => {
			if (uniforms) {
				if (uniforms instanceof Map) {
					for (const [key, value] of uniforms.entries()) {
						const uniform: Uniform | undefined = vao.program.uniforms.get(key);
						if (uniform) {
							uniform.value = value;
						}
					}
				} else {
					for (const key in uniforms) {
						const uniform: Uniform | undefined = vao.program.uniforms.get(key);
						if (uniform) {
							uniform.value = uniforms[key] as UniformValue;
						}
					}
				}
			}

			if (vao.elementArrayBuffer) {
				vao.context.internal.drawElements(
					primitive,
					vao.elementArrayBuffer.data.length,
					vao.elementArrayBuffer.type,
					0
				);
			} else {
				const firstAttribute: BufferInfo | undefined = vao.attributes[0];
				if (!firstAttribute) {
					return;
				}
				const dataLength: number = firstAttribute.buffer.data.length;
				const dataSize: number = firstAttribute.size;

				vao.context.internal.drawArrays(
					primitive,
					offset,
					dataLength / dataSize
				);
			}
		});
	}
}
