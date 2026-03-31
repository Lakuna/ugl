import type { AttributeMap } from "../types/AttributeMap.js";
import type AttributeValue from "../types/AttributeValue.js";
import type VertexBuffer from "./buffers/VertexBuffer.js";
import type Context from "./Context.js";
import type Program from "./Program.js";

import { VERTEX_ARRAY_BINDING } from "../constants/constants.js";
import BadValueError from "../utility/BadValueError.js";
import ElementBuffer from "./buffers/ElementBuffer.js";
import ContextDependent from "./internal/ContextDependent.js";

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
	private static readonly bindingsCache = new Map<
		WebGL2RenderingContext,
		null | WebGLVertexArrayObject
	>();

	/**
	 * The API interface of this VAO.
	 * @internal
	 */
	public readonly internal: WebGLVertexArrayObject;

	/** The shader program associated with this VAO. */
	public readonly program: Program;

	/**
	 * The values of attributes in this VAO.
	 * @internal
	 */
	public get attributes(): ReadonlyMap<string, AttributeValue> {
		return this.attributesCache;
	}

	/** The element buffer object that is attached to this VAO. */
	public get ebo(): ElementBuffer | undefined {
		return this.eboCache;
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
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
	 * The values of attributes in this VAO.
	 * @internal
	 */
	private readonly attributesCache: Map<string, AttributeValue>;

	/**
	 * The element buffer object of this VAO.
	 * @internal
	 */
	private eboCache?: ElementBuffer;

	/**
	 * Create a VAO.
	 * @param program - The shader program associated with the VAO.
	 * @param attributes - The attributes to attach to the VAO.
	 * @param ebo - The element buffer object to attach to the VAO.
	 * @throws {@link BadValueError} if an attribute is passed `undefined` as a value or if an unknown attribute is specified.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/createVertexArray | createVertexArray}
	 */
	public constructor(
		// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
		program: Program,
		// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
		attributes?: AttributeMap,
		// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
		ebo?: ElementBuffer
	) {
		super(program.context);
		this.program = program;

		this.internal = this.gl.createVertexArray();

		// Set the initial attribute values.
		this.attributesCache = new Map();
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

	/**
	 * Bind a VAO.
	 * @param context - The rendering context.
	 * @param vao - The VAO.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/bindVertexArray | bindVertexArray}
	 * @internal
	 */
	public static bindGl(
		// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
		context: Context,
		vao: null | WebGLVertexArrayObject
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
	 * Get the currently-bound VAO.
	 * @param context - The rendering context.
	 * @internal
	 */
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	public static getBound(context: Context): null | WebGLVertexArrayObject {
		return VertexArray.bindingsCache.getOrInsertComputed(context.gl, () => {
			const value: unknown =
				context.doPrefillCache ? null : (
					context.gl.getParameter(VERTEX_ARRAY_BINDING)
				);
			if (value !== null && !(value instanceof WebGLVertexArrayObject)) {
				throw new Error(
					"An incorrectly-typed value was returned for `VERTEX_ARRAY_BINDING`."
				);
			}

			return value;
		});
	}

	/**
	 * Unbind the VAO that is bound.
	 * @param context - The rendering context.
	 * @param vao - The VAO to unbind, or `undefined` to unbind any VAO.
	 * @internal
	 */
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	public static unbindGl(context: Context, vao?: WebGLVertexArrayObject): void {
		// Do nothing if the VAO is already unbound.
		if (vao && VertexArray.getBound(context) !== vao) {
			return;
		}

		// Unbind the VAO.
		VertexArray.bindGl(context, null);
	}

	/**
	 * Bind this VAO.
	 * @internal
	 */
	public bind(): void {
		VertexArray.bindGl(this.context, this.internal);
	}

	/**
	 * Set the value of an attribute in this VAO.
	 * @param name - The name of the attribute.
	 * @param value - The value to pass to the attribute.
	 * @throws {@link BadValueError} if an unknown attribute is specified.
	 */
	public setAttribute(
		name: string,
		// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
		value: AttributeValue | VertexBuffer
	): void {
		const attribute = this.program.attributes.get(name);
		if (!attribute) {
			throw new BadValueError(`No attribute named \`${name}\`.`);
		}

		this.bind();
		const realValue = "vbo" in value ? value : { vbo: value };
		attribute.value = realValue;
		this.attributesCache.set(name, realValue);
	}

	/**
	 * Unbind this VAO.
	 * @internal
	 */
	public unbind(): void {
		VertexArray.unbindGl(this.context, this.internal);
	}
}
