import type { AttributeMap } from "../types/AttributeMap.js";
import type AttributeValue from "../types/AttributeValue.js";
import BadValueError from "../utility/BadValueError.js";
import type Buffer from "./buffers/Buffer.js";
import ContextDependent from "./internal/ContextDependent.js";
import type ElementArrayBuffer from "./buffers/ElementArrayBuffer.js";
import Primitive from "../constants/Primitive.js";
import type Program from "./Program.js";
import type { UniformMap } from "../types/UniformMap.js";
import UnsupportedOperationError from "../utility/UnsupportedOperationError.js";
import { VERTEX_ARRAY_BINDING } from "../constants/constants.js";
import getSizeOfDataType from "../utility/internal/getSizeOfDataType.js";

/** A vertex attribute array; a collection of attribute state. */
export default class Vao extends ContextDependent {
	/**
	 * The currently-bound VAO cache.
	 * @see [`bindVertexArray`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/bindVertexArray)
	 * @internal
	 */
	private static bindingsCache?: Map<
		WebGL2RenderingContext,
		WebGLVertexArrayObject | null
	>;

	/**
	 * Get the VAO bindings cache.
	 * @returns The VAO bindings cache.
	 * @internal
	 */
	private static getBindingsCache() {
		return (Vao.bindingsCache ??= new Map());
	}

	/**
	 * Get the currently-bound VAO.
	 * @param gl - The rendering context.
	 * @see [`bindVertexArray`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/bindVertexArray)
	 * @internal
	 */
	public static getBound(gl: WebGL2RenderingContext) {
		// Get the full bindings cache.
		const bindingsCache = Vao.getBindingsCache();

		// Get the bound VAO.
		let boundVao = bindingsCache.get(gl);
		if (typeof boundVao === "undefined") {
			boundVao = gl.getParameter(
				VERTEX_ARRAY_BINDING
			) as WebGLVertexArrayObject | null;
			bindingsCache.set(gl, boundVao);
		}
		return boundVao;
	}

	/**
	 * Bind a VAO.
	 * @param gl - The rendering context.
	 * @param vao - The VAO.
	 * @see [`bindVertexArray`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/bindVertexArray)
	 * @internal
	 */
	public static bindGl(
		gl: WebGL2RenderingContext,
		vao: WebGLVertexArrayObject | null
	) {
		// Do nothing if the binding is already correct.
		if (Vao.getBound(gl) === vao) {
			return;
		}

		// Bind the VAO.
		gl.bindVertexArray(vao);
		Vao.getBindingsCache().set(gl, vao);
	}

	/**
	 * Unbind the VAO that is bound.
	 * @param gl - The rendering context.
	 * @param vao - The VAO to unbind, or `undefined` to unbind any VAO.
	 * @see [`bindVertexArray`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/bindVertexArray)
	 * @internal
	 */
	public static unbindGl(
		gl: WebGL2RenderingContext,
		vao?: WebGLVertexArrayObject
	) {
		// Do nothing if the VAO is already unbound.
		if (typeof vao !== "undefined" && Vao.getBound(gl) !== vao) {
			return;
		}

		// Unbind the VAO.
		Vao.bindGl(gl, null);
	}

	/**
	 * Create a VAO.
	 * @param program - The shader program associated with the VAO.
	 * @param attributes - The attributes to attach to the VAO.
	 * @param indices - The indices to attach to the VAO.
	 * @see [`createVertexArray`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/createVertexArray)
	 * @throws {@link UnsupportedOperationError}
	 * @throws {@link BadValueError}
	 */
	public constructor(
		program: Program,
		attributes?: AttributeMap,
		indices?: ElementArrayBuffer
	) {
		super(program.context);
		this.program = program;

		const vao = this.gl.createVertexArray();
		if (vao === null) {
			throw new UnsupportedOperationError();
		}
		this.internal = vao;

		// Set the initial attribute values.
		this.attributeCache = new Map<string, AttributeValue>();
		for (const name in attributes) {
			const value = attributes[name];
			if (typeof value === "undefined") {
				throw new BadValueError();
			}
			this.setAttribute(name, value);
		}

		// Set the initial indices.
		if (typeof indices !== "undefined") {
			this.indices = indices;
		}
	}

	/** The shader program associated with this VAO. */
	public readonly program;

	/**
	 * The API interface of this VAO.
	 * @see [`WebGLVertexArrayObject`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLVertexArrayObject)
	 * @internal
	 */
	public readonly internal;

	/**
	 * The values of attributes in this VAO.
	 * @internal
	 */
	private readonly attributeCache;

	/**
	 * Set the value of an attribute in this VAO.
	 * @param name - The name of the attribute.
	 * @param value - The value to pass to the attribute.
	 * @throws {@link BadValueError}
	 */
	public setAttribute(name: string, value: AttributeValue | Buffer) {
		const attribute = this.program.attributes.get(name);
		if (typeof attribute === "undefined") {
			throw new BadValueError();
		}

		this.bind();
		attribute.value = value;
		this.attributeCache.set(
			name,
			"buffer" in value ? value : { buffer: value }
		);
	}

	/**
	 * The indices of this VAO.
	 * @internal
	 */
	private indicesCache?: ElementArrayBuffer;

	/** Get the indices of this VAO. */
	public get indices(): ElementArrayBuffer | undefined {
		return this.indicesCache;
	}

	/** Set the indices of this VAO. */
	public set indices(value: ElementArrayBuffer) {
		this.bind();
		value.bind();
		this.indicesCache = value;
	}

	/**
	 * Rasterize the vertex data contained within this VAO.
	 * @param uniforms - A collection of uniform values to set prior to rasterization.
	 * @param primitive - The type of primitive to rasterize.
	 * @param offset - The number of elements to skip when rasterizing arrays, or the number of indices to skip when rasterizing elements.
	 * @throws {@link BadValueError}
	 */
	public draw(
		uniforms?: UniformMap,
		primitive = Primitive.TRIANGLES,
		offset = 0
	) {
		// Bind the correct shader program.
		this.program.bind();

		// Bind this VAO.
		this.bind();

		// Set uniforms.
		if (typeof uniforms !== "undefined") {
			for (const name in uniforms) {
				const uniform = this.program.uniforms.get(name);
				const value = uniforms[name];
				if (typeof uniform === "undefined" || typeof value === "undefined") {
					throw new BadValueError();
				}
				uniform.value = value;
			}
		}

		// Rasterize.
		if (typeof this.indices === "undefined") {
			// No indices; must determine the proper number of elements to rasterize.
			let firstAttribute: AttributeValue | undefined = void 0;
			for (const value of this.attributeCache.values()) {
				if (typeof value === "undefined") {
					continue;
				}

				firstAttribute = value;
				break;
			}

			// No attributes; just return since nothing would be rasterized anyway.
			if (typeof firstAttribute === "undefined") {
				return;
			}

			// Determine the shape of the data.
			const elementCount =
				firstAttribute.buffer.size /
				getSizeOfDataType(firstAttribute.buffer.type);
			const elementsPerIndex = firstAttribute.size ?? 3;

			// Rasterize arrays.
			this.gl.drawArrays(primitive, offset, elementCount / elementsPerIndex);
			return;
		}

		// Indices exist. Rasterize elements.
		const indexSize = getSizeOfDataType(this.indices.type);
		const indexCount = this.indices.size / indexSize;
		const byteOffset = offset * indexSize;
		this.gl.drawElements(primitive, indexCount, this.indices.type, byteOffset);
	}

	/**
	 * Bind this VAO.
	 * @see [`bindVertexArray`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/bindVertexArray)
	 * @internal
	 */
	public bind() {
		Vao.bindGl(this.gl, this.internal);
	}

	/**
	 * Unbind this VAO.
	 * @see [`bindVertexArray`](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/bindVertexArray)
	 * @internal
	 */
	public unbind() {
		Vao.unbindGl(this.gl, this.internal);
	}
}
