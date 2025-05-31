import type { AttributeMap } from "../types/AttributeMap.js";
import type AttributeValue from "../types/AttributeValue.js";
import BadValueError from "../utility/BadValueError.js";
import Context from "./Context.js";
import ContextDependent from "./internal/ContextDependent.js";
import ElementBuffer from "./buffers/ElementBuffer.js";
import type Program from "./Program.js";
import { VERTEX_ARRAY_BINDING } from "../constants/constants.js";
import type VertexBuffer from "./buffers/VertexBuffer.js";

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
	private readonly attributeCache: Map<string, AttributeValue>;

	/**
	 * The values of attributes in this VAO.
	 * @internal
	 */
	public get attributes(): ReadonlyMap<string, AttributeValue> {
		return this.attributeCache;
	}

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

	public set ebo(value: ElementBuffer | undefined) {
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
