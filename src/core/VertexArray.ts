import type { AttributeMap } from "../types/AttributeMap.js";
import type AttributeValue from "../types/AttributeValue.js";
import BadValueError from "../utility/BadValueError.js";
import Context from "./Context.js";
import ContextDependent from "./internal/ContextDependent.js";
import ElementBuffer from "./buffers/ElementBuffer.js";
import Framebuffer from "./Framebuffer.js";
import FramebufferTarget from "../constants/FramebufferTarget.js";
import Primitive from "../constants/Primitive.js";
import type Program from "./Program.js";
import type { UniformMap } from "../types/UniformMap.js";
import { VERTEX_ARRAY_BINDING } from "../constants/constants.js";
import type VertexBuffer from "./buffers/VertexBuffer.js";
import getSizeOfDataType from "../utility/internal/getSizeOfDataType.js";

/**
 * A vertex attribute array; a collection of attribute state.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLVertexArrayObject | WebGLVertexArrayObject}
 * @public
 */
export default class VertexArray extends ContextDependent {
	/**
	 * The currently-bound VAO cache.
	 * @internal
	 */
	private static bindingsCache = new Map<
		WebGL2RenderingContext,
		WebGLVertexArrayObject | null
	>();

	/**
	 * Get the currently-bound VAO.
	 * @param context - The rendering context.
	 * @internal
	 */
	public static getBound(context: Context): WebGLVertexArrayObject | null {
		// Get the bound VAO.
		let boundVao = VertexArray.bindingsCache.get(context.gl);
		if (typeof boundVao === "undefined") {
			boundVao = context.doPrefillCache
				? null
				: (context.gl.getParameter(
						VERTEX_ARRAY_BINDING
					) as WebGLVertexArrayObject | null);
			VertexArray.bindingsCache.set(context.gl, boundVao);
		}

		return boundVao;
	}

	/**
	 * Bind a VAO.
	 * @param context - The rendering context.
	 * @param vao - The VAO.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/bindVertexArray | bindVertexArray}
	 * @internal
	 */
	public static bindGl(
		context: Context,
		vao: WebGLVertexArrayObject | null
	): void {
		// Do nothing if the binding is already correct.
		if (VertexArray.getBound(context) === vao) {
			return;
		}

		// Bind the VAO.
		context.gl.bindVertexArray(vao);
		VertexArray.bindingsCache.set(context.gl, vao);
	}

	/**
	 * Unbind the VAO that is bound.
	 * @param context - The rendering context.
	 * @param vao - The VAO to unbind, or `undefined` to unbind any VAO.
	 * @internal
	 */
	public static unbindGl(context: Context, vao?: WebGLVertexArrayObject): void {
		// Do nothing if the VAO is already unbound.
		if (vao && VertexArray.getBound(context) !== vao) {
			return;
		}

		// Unbind the VAO.
		VertexArray.bindGl(context, null);
	}

	/**
	 * Create a VAO.
	 * @param program - The shader program associated with the VAO.
	 * @param attributes - The attributes to attach to the VAO.
	 * @param ebo - The element buffer object to attach to the VAO.
	 * @throws {@link BadValueError} if an attribute is passed `undefined` as a value or if an unknown attribute is specified.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/createVertexArray | createVertexArray}
	 */
	public constructor(
		program: Program,
		attributes?: AttributeMap,
		ebo?: ElementBuffer
	) {
		super(program.context);
		this.program = program;

		this.internal = this.gl.createVertexArray();

		// Set the initial attribute values.
		this.attributeCache = new Map<string, AttributeValue>();
		if (attributes) {
			for (const [key, value] of Object.entries(attributes)) {
				if (!Object.hasOwn(attributes, key)) {
					continue;
				}

				this.setAttribute(key, value);
			}
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
	public readonly internal: WebGLVertexArrayObject;

	/**
	 * The values of attributes in this VAO.
	 * @internal
	 */
	private readonly attributeCache;

	/**
	 * Get the value of an attribute in this VAO.
	 * @param name - The name of the attribute.
	 * @returns The vertex buffer that is bound to the specified attribute.
	 */
	public getAttribute(name: string): VertexBuffer | undefined {
		return this.attributeCache.get(name)?.vbo;
	}

	/**
	 * Set the value of an attribute in this VAO.
	 * @param name - The name of the attribute.
	 * @param value - The value to pass to the attribute.
	 * @throws {@link BadValueError} if an unknown attribute is specified.
	 */
	public setAttribute(
		name: string,
		value: AttributeValue | VertexBuffer
	): void {
		const attribute = this.program.attributes.get(name);
		if (!attribute) {
			throw new BadValueError(`No attribute named \`${name}\`.`);
		}

		this.bind();
		const realValue = "vbo" in value ? value : { vbo: value };
		if (attribute.setValue(realValue)) {
			this.attributeCache.set(name, realValue);
		}
	}

	/**
	 * The element buffer object of this VAO.
	 * @internal
	 */
	private eboCache?: ElementBuffer;

	/** The element buffer object that is attached to this VAO. */
	public get ebo(): ElementBuffer | undefined {
		return this.eboCache;
	}

	public set ebo(value) {
		if (value === this.ebo) {
			return;
		}

		// Remove EBO.
		if (!value) {
			ElementBuffer.unbindGl(this.context, this.internal);
			delete this.eboCache;
			return;
		}

		// Add or update EBO.
		value.bind(this);
		this.eboCache = value;
	}

	/**
	 * Rasterize the vertex data contained within this VAO.
	 * @param uniforms - A collection of uniform values to set prior to rasterization.
	 * @param primitive - The type of primitive to rasterize.
	 * @param offset - The number of elements to skip when rasterizing arrays, or the number of indices to skip when rasterizing elements.
	 * @param framebuffer - The framebuffer to rasterize to, or `null` for the default framebuffer (canvas).
	 * @param countOverride - The number of indices or elements to be rendered. Automatically renders all supplied data if `undefined`.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawArrays | drawArrays}
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawElements | drawElements}
	 * @throws {@link BadValueError} if a uniform is passed `undefined` as a value or if an unknown uniform is specified.
	 */
	public draw(
		uniforms?: UniformMap,
		primitive: Primitive = Primitive.TRIANGLES,
		offset = 0,
		framebuffer: Framebuffer | null = null,
		countOverride: number | undefined = void 0
	): void {
		// Bind the correct framebuffer.
		if (framebuffer) {
			framebuffer.bind(FramebufferTarget.DRAW_FRAMEBUFFER);
		} else {
			Framebuffer.unbindGl(this.context, FramebufferTarget.DRAW_FRAMEBUFFER);
		}

		// Bind the correct shader program.
		this.program.bind();

		// Set uniforms.
		if (uniforms) {
			for (const [key, value] of Object.entries(uniforms)) {
				if (!Object.hasOwn(uniforms, key)) {
					continue;
				}

				const uniform = this.program.uniforms.get(key);
				if (!uniform) {
					throw new BadValueError(`No uniform named \`${key}\`.`);
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
			this.gl.drawArrays(
				primitive,
				offset,
				countOverride ?? elementCount / elementsPerIndex
			);
			return;
		}

		// EBO exists. Rasterize elements.
		const indexSize = getSizeOfDataType(this.ebo.type);
		const indexCount = this.ebo.size / indexSize;
		const byteOffset = offset * indexSize;
		this.gl.drawElements(
			primitive,
			countOverride ?? indexCount,
			this.ebo.type,
			byteOffset
		);
	}

	/**
	 * Bind this VAO.
	 * @internal
	 */
	public bind(): void {
		VertexArray.bindGl(this.context, this.internal);
	}

	/**
	 * Unbind this VAO.
	 * @internal
	 */
	public unbind(): void {
		VertexArray.unbindGl(this.context, this.internal);
	}
}
