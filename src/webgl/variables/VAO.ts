import type Program from "../Program.js";
import type AttributeState from "./AttributeState.js";
import Buffer from "../Buffer.js";
import { BufferTarget, Primitive } from "../WebGLConstant.js";
import type { default as Uniform, UniformValue } from "./Uniform.js";
import type { UintTypedArray } from "../../index.js";

/** A collection of attribute state; a vertex attribute array. */
export default class VAO {
	/**
	 * Creates a vertex array object.
	 * @param program The program that the VAO is used with.
	 * @param attributes The attributes associated with the VAO.
	 * @param indices The indices to supply to the element array buffer of this VAO if the data should be indexed.
	 */
	public constructor(program: Program, attributes: Array<AttributeState> = [], indices?: UintTypedArray) {
		this.program = program;
		this.gl = program.gl;

		const vao: WebGLVertexArrayObject | null = this.gl.createVertexArray();
		if (!vao) { throw new Error("Failed to create VAO."); }
		this.vao = vao;

		this.attributesPrivate = [];
		for (const attribute of attributes) { this.addAttribute(attribute); }

		this.indices = indices;
	}

	/** The rendering context of this VAO. */
	public readonly gl: WebGL2RenderingContext;

	/** The program that this VAO is used with. */
	public readonly program: Program;

	/** The WebGL API interface of this VAO. */
	public readonly vao: WebGLVertexArrayObject;

	/** The attributes associated with this VAO. */
	private attributesPrivate: Array<AttributeState>;

	/** The attributes associated with this VAO. */
	public get attributes(): ReadonlyArray<AttributeState> {
		return this.attributesPrivate;
	}

	/** The element array buffer of this VAO if its data is indexed. */
	private elementArrayBuffer: Buffer | undefined;

	/** The indices in the element array buffer of this VAO if the data is indexed. */
	public get indices(): UintTypedArray | undefined {
		return this.elementArrayBuffer?.data as UintTypedArray;
	}

	public set indices(value: UintTypedArray | undefined) {
		this.bind();
		if (value) {
			this.elementArrayBuffer = new Buffer(this.gl, value, BufferTarget.ELEMENT_ARRAY_BUFFER);
		} else {
			this.elementArrayBuffer = undefined;
		}
	}

	/** Makes this the active VAO. */
	public bind(): void {
		this.gl.bindVertexArray(this.vao);
	}

	/**
	 * Adds an attribute to this VAO.
	 * @param attribute The attribute to add.
	 */
	public addAttribute(attribute: AttributeState): void {
		this.bind();
		attribute.use(this.program);
		this.attributesPrivate.push(attribute);
	}

	/**
	 * Rasterizes the vertex data stored in this VAO.
	 * @param uniforms A map of uniform variable names to their values to use when rasterizing.
	 * @param primitive The type of primitive to rasterize.
	 * @param offset The number of elements to skip when rasterizing arrays.
	 */
	public draw(uniforms?: UniformSource, primitive: Primitive = Primitive.TRIANGLES, offset = 0): void {
		this.program.use();

		this.bind();

		if (uniforms) {
			if (uniforms instanceof Map) {
				for (const [key, value] of uniforms.entries()) {
					const uniform: Uniform | undefined = this.program.uniforms.get(key);
					if (uniform) { uniform.value = value; }
				}
			} else {
				for (const key in uniforms) {
					const uniform: Uniform | undefined = this.program.uniforms.get(key);
					if (uniform) { uniform.value = (uniforms[key] as UniformValue); }
				}
			}
		}

		if (this.elementArrayBuffer) {
			this.gl.drawElements(primitive, this.elementArrayBuffer.data.length, this.elementArrayBuffer.type, 0);
		} else {
			const firstAttribute: AttributeState | undefined = this.attributes[0];
			if (!firstAttribute) { return; }
			const dataLength: number = firstAttribute.buffer.data.length;
			const dataSize: number = firstAttribute.size;

			this.gl.drawArrays(primitive, offset, dataLength / dataSize);
		}
	}
}

/** An object with property names and values corresponding to uniform names and values. */
export interface UniformSourceObject {
	/** The property which holds the value for the uniform with the same name. */
	[key: string]: UniformValue;
}

/** A source for uniform values. */
export type UniformSource = Map<string, UniformValue> | UniformSourceObject;
