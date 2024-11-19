import type { AttributeMap } from "../types/AttributeMap.js";
import type AttributeValue from "../types/AttributeValue.js";
import BadValueError from "../utility/BadValueError.js";
import ContextDependent from "./internal/ContextDependent.js";
import Ebo from "./buffers/Ebo.js";
import Framebuffer from "./Framebuffer.js";
import FramebufferTarget from "../constants/FramebufferTarget.js";
import Primitive from "../constants/Primitive.js";
import type Program from "./Program.js";
import type { UniformMap } from "../types/UniformMap.js";
import UnsupportedOperationError from "../utility/UnsupportedOperationError.js";
import { VERTEX_ARRAY_BINDING } from "../constants/constants.js";
import type Vbo from "./buffers/Vbo.js";
import getSizeOfDataType from "../utility/internal/getSizeOfDataType.js";

/**
 * A vertex attribute array; a collection of attribute state.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLVertexArrayObject | WebGLVertexArrayObject}
 * @public
 */
export default class Vao extends ContextDependent {
	/**
	 * The currently-bound VAO cache.
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
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/bindVertexArray | bindVertexArray}
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
	 * @internal
	 */
	public static unbindGl(
		gl: WebGL2RenderingContext,
		vao?: WebGLVertexArrayObject
	) {
		// Do nothing if the VAO is already unbound.
		if (vao && Vao.getBound(gl) !== vao) {
			return;
		}

		// Unbind the VAO.
		Vao.bindGl(gl, null);
	}

	/**
	 * Create a VAO.
	 * @param program - The shader program associated with the VAO.
	 * @param attributes - The attributes to attach to the VAO.
	 * @param ebo - The element buffer object to attach to the VAO.
	 * @throws {@link UnsupportedOperationError} if a VAO cannot be created.
	 * @throws {@link BadValueError} if an attribute is passed `undefined` as a value or if an unknown attribute is specified.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/createVertexArray | createVertexArray}
	 */
	public constructor(program: Program, attributes?: AttributeMap, ebo?: Ebo) {
		super(program.context);
		this.program = program;

		const vao = this.gl.createVertexArray();
		if (vao === null) {
			throw new UnsupportedOperationError(
				"The environment does not support VAOs."
			);
		}
		this.internal = vao;

		// Set the initial attribute values.
		this.attributeCache = new Map<string, AttributeValue>();
		for (const name in attributes) {
			if (!Object.hasOwn(attributes, name)) {
				continue;
			}

			const value = attributes[name];
			if (!value) {
				throw new BadValueError("Cannot pass `undefined` to an attribute.");
			}
			this.setAttribute(name, value);
		}

		// Set the initial EBO.
		this.ebo = ebo;
	}

	/** The shader program associated with this VAO. */
	public readonly program: Program;

	/**
	 * The API interface of this VAO.
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
	 * @throws {@link BadValueError} if an unknown attribute is specified.
	 */
	public setAttribute(name: string, value: AttributeValue | Vbo): void {
		const attribute = this.program.attributes.get(name);
		if (!attribute) {
			throw new BadValueError(`No attribute named \`${name}\`.`);
		}

		this.bind();
		attribute.setValue(value);
		this.attributeCache.set(name, "vbo" in value ? value : { vbo: value });
	}

	/**
	 * The element buffer object of this VAO.
	 * @internal
	 */
	private eboCache?: Ebo;

	/** The element buffer object that is attached to this VAO. */
	public get ebo(): Ebo | undefined {
		return this.eboCache;
	}

	public set ebo(value) {
		this.bind();

		// Remove EBO.
		if (!value) {
			Ebo.unbindGl(this.gl, this.internal);
			delete this.eboCache;
			return;
		}

		// Add or update EBO.
		value.bind();
		this.eboCache = value;
	}

	/**
	 * Rasterize the vertex data contained within this VAO.
	 * @param uniforms - A collection of uniform values to set prior to rasterization.
	 * @param primitive - The type of primitive to rasterize.
	 * @param offset - The number of elements to skip when rasterizing arrays, or the number of indices to skip when rasterizing elements.
	 * @param framebuffer - The framebuffer to rasterize to, or `null` for the default framebuffer (canvas).
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawArrays | drawArrays}
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawElements | drawElements}
	 * @throws {@link BadValueError} if a uniform is passed `undefined` as a value or if an unknown uniform is specified.
	 */
	public draw(
		uniforms?: UniformMap,
		primitive: Primitive = Primitive.TRIANGLES,
		offset = 0,
		framebuffer: Framebuffer | null = null
	): void {
		// Bind the correct framebuffer.
		if (framebuffer === null) {
			Framebuffer.unbindGl(this.gl, FramebufferTarget.DRAW_FRAMEBUFFER);
		} else {
			Framebuffer.bindGl(
				this.gl,
				FramebufferTarget.DRAW_FRAMEBUFFER,
				framebuffer.internal
			);
		}

		// Bind the correct shader program.
		this.program.bind();

		// Set uniforms.
		if (uniforms) {
			for (const name in uniforms) {
				if (!Object.hasOwn(uniforms, name)) {
					continue;
				}

				const uniform = this.program.uniforms.get(name);
				if (!uniform) {
					throw new BadValueError(`No uniform named \`${name}\`.`);
				}
				const value = uniforms[name];
				if (typeof value === "undefined") {
					throw new BadValueError("Cannot pass `undefined` to a uniform.");
				}
				uniform.value = value;
			}
		}

		// Bind this VAO.
		this.bind();

		// Rasterize.
		if (!this.ebo) {
			// No EBO; must determine the proper number of elements to rasterize.
			const [firstAttribute] = this.attributeCache.values();

			// No attributes; just return since nothing would be rasterized anyway.
			if (!firstAttribute) {
				return;
			}

			// Determine the shape of the data.
			const elementCount =
				firstAttribute.vbo.size / getSizeOfDataType(firstAttribute.vbo.type);
			const elementsPerIndex = firstAttribute.size ?? 3;

			// Rasterize arrays.
			this.gl.drawArrays(primitive, offset, elementCount / elementsPerIndex);
			return;
		}

		// EBO exists. Rasterize elements.
		const indexSize = getSizeOfDataType(this.ebo.type);
		const indexCount = this.ebo.size / indexSize;
		const byteOffset = offset * indexSize;
		this.gl.drawElements(primitive, indexCount, this.ebo.type, byteOffset);
	}

	/**
	 * Bind this VAO.
	 * @internal
	 */
	public bind() {
		Vao.bindGl(this.gl, this.internal);
	}

	/**
	 * Unbind this VAO.
	 * @internal
	 */
	public unbind() {
		Vao.unbindGl(this.gl, this.internal);
	}
}
