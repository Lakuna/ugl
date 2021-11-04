import { Attribute, AttributeType, Buffer, BufferTarget, Framebuffer, Program, Vector, WebGLConstant } from "../index";

export enum DrawMode {
	POINTS = WebGLConstant.POINTS,
	LINE_STRIP = WebGLConstant.LINE_STRIP,
	LINE_LOOP = WebGLConstant.LINE_LOOP,
	LINES = WebGLConstant.LINES,
	TRIANGLE_STRIP = WebGLConstant.TRIANGLE_STRIP,
	TRIANGLE_FAN = WebGLConstant.TRIANGLE_FAN,
	TRIANGLES = WebGLConstant.TRIANGLES
}

/** A collection of attribute state. */
export class VAO {
	#indices: Attribute;
	#attributes: Attribute[];

	/**
	 * Creates a vertex array object.
	 * @param program - The program that the VAO is used with.
	 * @param attributes - The attributes associated with the VAO.
	 * @param indexData - THe data to pass to the element array buffer for the VAO.
	 */
	constructor(program: Program, attributes: Attribute[], indexData: number[]) {
		this.program = program;
		this.gl = program.gl;

		this.vao = this.gl.createVertexArray();
		this.#attributes = [];
		attributes.forEach((attribute: Attribute): void => this.addAttribute(attribute));
		this.indexData = indexData;
	}

	/** The program that this VAO is used with. */
	readonly program: Program;

	/** The rendering context of this VAO. */
	readonly gl: WebGL2RenderingContext;

	/** The WebGL VAO that this VAO represents. */
	readonly vao: WebGLVertexArrayObject;

	/** A list of attributes attached to this VAO. */
	get attributes(): ReadonlyArray<Attribute> {
		return [...this.#attributes];
	}

	/** The element array buffer attribute of this VAO. */
	get indices(): Attribute {
		return this.#indices;
	}

	/** The data of the element array buffer attribute of this VAO. */
	set indexData(value: number[]) {
		this.bind();
		this.#indices = value
			? this.#indices = new Attribute(
				null,
				new Buffer(this.gl, new Uint8Array(value), BufferTarget.ELEMENT_ARRAY_BUFFER),
				1,
				AttributeType.UNSIGNED_BYTE)
			: null;
	}

	/** Binds this VAO. */
	bind(): void {
		this.gl.bindVertexArray(this.vao);
	}

	/** Adds an attribute to this VAO. */
	addAttribute(attribute: Attribute): void {
		this.bind();
		attribute.use(this.program);
		this.#attributes.push(attribute);
	}

	/**
	 * Draws the vertex data stored in this VAO.
	 * @param mode - The mode to use when drawing the data.
	 * @param offset - The number of elements to skip when drawing arrays.
	 * @param framebuffer - The framebuffer to draw to.
	 * @param sizeMax - The width and height of the viewport.
	 * @param sizeMin - The x and y coordinates of the viewport.
	 */
	draw(mode: DrawMode = DrawMode.TRIANGLES, offset = 0, framebuffer?: Framebuffer, sizeMax?: Vector, sizeMin?: Vector): void {
		this.program.use();
		this.bind();

		if (framebuffer) {
			framebuffer.bind();
			this.gl.viewport(
				sizeMin?.x ?? 0,
				sizeMin?.y ?? 0,
				sizeMax?.x ?? framebuffer.size.x,
				sizeMax?.y ?? framebuffer.size.y);
		} else {
			Framebuffer.unbind(this.gl);
			this.gl.viewport(
				sizeMin?.x ?? 0,
				sizeMin?.y ?? 0,
				sizeMax?.x ?? this.gl.canvas.width,
				sizeMax?.y ?? this.gl.canvas.height);
		}

		if (this.indices) {
			this.gl.drawElements(
				mode,
				(this.indices.buffer.data as number[]).length,
				this.indices.type,
				this.indices.offset);
		} else {
			this.gl.drawArrays(
				mode,
				offset,
				(this.attributes?.[0].buffer.data as number[]).length / this.attributes?.[0].size ?? 0);
		}
	}
}