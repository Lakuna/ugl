import { Geometry, AttributeType, BufferTarget, DrawMode, Attribute, Buffer,
	Program, Framebuffer, Vector } from "../index.js";

/** A collection of attribute state. */
export class VAO {
	static fromGeometry(program: Program, geometry: Geometry, positionAttributeName = "a_position",
		texcoordAttributeName = "a_texcoord", normalAttributeName = "a_normal") {
		const attributes: Attribute[] = [];
		if (positionAttributeName && geometry.positions.length) {
			attributes.push(new Attribute(positionAttributeName, new Buffer(program.gl, new Float32Array([].concat(...geometry.positions as never[])))));
		}
		if (texcoordAttributeName && geometry.texcoords.length) {
			attributes.push(new Attribute(texcoordAttributeName, new Buffer(program.gl, new Float32Array([].concat(...geometry.texcoords as never[])))));
		}
		if (normalAttributeName && geometry.normals.length) {
			attributes.push(new Attribute(normalAttributeName, new Buffer(program.gl, new Float32Array([].concat(...geometry.normals as never[])))));
		}
		return new VAO(program, attributes, geometry.indices);
	}

	#indices?: Attribute;
	#attributes: Attribute[];

	/**
	 * Creates a vertex array object.
	 * @param program - The program that the VAO is used with.
	 * @param attributes - The attributes associated with the VAO.
	 * @param indexData - THe data to pass to the element array buffer for the VAO.
	 */
	constructor(program: Program, attributes: Attribute[], indexData: number[] | undefined) {
		this.program = program;
		this.gl = program.gl;

		const vao: WebGLVertexArrayObject | null = this.gl.createVertexArray();
		if (vao) {
			this.vao = vao;
		} else {
			throw new Error("Failed to create a WebGL vertex array object.");
		}
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
	get indices(): Attribute | undefined {
		return this.#indices;
	}

	/** The data of the element array buffer attribute of this VAO. */
	set indexData(value: number[] | undefined) {
		this.bind();
		if (value) {
			this.#indices = this.#indices = new Attribute(
				"",
				new Buffer(this.gl, new Uint8Array(value), BufferTarget.ELEMENT_ARRAY_BUFFER),
				1,
				AttributeType.UNSIGNED_BYTE);
		}
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
			const firstAttribute: Attribute | undefined = this.attributes[0];
			const dataLength: number = firstAttribute ? (firstAttribute.buffer.data as number[]).length : 0;
			const dataSize: number = firstAttribute ? firstAttribute.size : 1;
			this.gl.drawArrays(
				mode,
				offset,
				dataLength / dataSize);
		}
	}
}