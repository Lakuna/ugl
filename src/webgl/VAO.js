/** @external {WebGLVertexArrayObject} https://developer.mozilla.org/en-US/docs/Web/API/WebGLVertexArrayObject */

import { Attribute } from "./Attribute.js";
import { Buffer } from "./Buffer.js";
import { Framebuffer } from "./Framebuffer.js";
import { ELEMENT_ARRAY_BUFFER, UNSIGNED_BYTE, TRIANGLES } from "./constants.js";

/** Class representing a WebGL vertex array object. */
export class VAO {
	#indices;
	#attributes;

	/**
	 * Create a VAO from a geometry.
	 * @param {Program} program - The program of the VAO.
	 * @param {Geometry} geometry - The geometry to use as the base.
	 * @param {string} [positionAttributeName="a_position"] - The name of the vertex position attribute, if it exists.
	 * @param {string} [texcoordAttributeName="a_texcoord"] - The name of the texture coordinate attribute, if it exists.
	 * @param {string} [normalAttributeName="a_normal"] - The name of the normal attribute, if it exists.
	 */
	static fromGeometry(program, geometry, positionAttributeName = "a_position", texcoordAttributeName = "a_texcoord", normalAttributeName = "a_normal") {
		const attributes = [];
		if (positionAttributeName) {
			attributes.push(new Attribute(positionAttributeName, new Buffer(program.gl, new Float32Array([].concat(...geometry.positions)))));
		}
		if (texcoordAttributeName) {
			attributes.push(new Attribute(texcoordAttributeName, new Buffer(program.gl, new Float32Array([].concat(...geometry.texcoords))), 2));
		}
		if (normalAttributeName) {
			attributes.push(new Attribute(normalAttributeName, new Buffer(program.gl, new Float32Array([].concat(...geometry.normals)))));
		}

		return new VAO(program, attributes, geometry.indices);
	}

	/**
	 * Create a vertex array object.
	 * @param {Program} program - The program that this VAO is used with.
	 * @param {Attribute[]} attributes - The attributes associated with this VAO.
	 * @param {number[]} indexData - The data to pass to the ELEMENT_ARRAY_BUFFER for this VAO.
	 */
	constructor(program, attributes, indexData) {
		/**
		 * The program that this VAO is used with.
		 * @type {Program}
		 */
		this.program = program;

		/**
		 * The rendering context of this VAO.
		 * @type {WebGLRenderingContext}
		 */
		this.gl = program.gl;

		/**
		 * The VAO used by WebGL.
		 * @type {WebGLVertexArrayObject}
		 */
		this.vao = this.gl.createVertexArray();

		/** @ignore */ this.#attributes = [];
		attributes.forEach((attribute) => this.addAttribute(attribute));

		this.indexData = indexData; // Use setter.
	}

	/**
	 * Add an attribute to this VAO.
	 * @param {Attribute} attribute - The attribute to add.
	 */
	addAttribute(attribute) {
		this.bind();
		attribute.use(this.program);
		this.#attributes.push(attribute);
	}

	/**
	 * A list of attributes attached to this VAO. Note that this returns a copy of the list, so modifying it directly doesn't do anything.
	 * @type {Attribute[]}
	 */
	get attributes() {
		return [...this.#attributes];
	}

	/**
	 * The ELEMENT_ARRAY_BUFFER attribute of this VAO.
	 * @type {Attribute}
	 */
	get indices() {
		return this.#indices;
	}

	/**
	 * The data of the ELEMENT_ARRAY_BUFFER attribute of this VAO.
	 * @type {number[]}
	 */
	set indexData(value) {
		this.bind();
		/** @ignore */ this.#indices = value
			? this.#indices = new Attribute(null, new Buffer(this.gl, new Uint8Array(value), ELEMENT_ARRAY_BUFFER), 1, UNSIGNED_BYTE)
			: null;
	}

	/**
	 * Binds this VAO.
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/bindVertexArray
	 */
	bind() {
		this.gl.bindVertexArray(this.vao);
	}

	/**
	 * Draws the vertex data stored in this VAO.
	 * @param {number} [mode=TRIANGLES] - The mode to use when drawing the data.
	 * @param {number} [offset=0] - The number of elements to skip when drawing arrays.
	 * @param {Framebuffer} [framebuffer] - The framebuffer to draw to, if any.
	 * @param {Vector} [sizeMax] - The width and height of the viewport. Uses values from framebuffer/canvas if not set.
	 * @param {Vector} [sizeMin] - The x and y coordinates of the viewport. Uses values from framebuffer/canvas if not set.
	 */
	draw(mode = TRIANGLES, offset = 0, framebuffer, sizeMax, sizeMin) {
		this.program.use();
		this.bind();

		if (framebuffer) {
			framebuffer.bind();
			this.gl.viewport(sizeMin?.x ?? 0, sizeMin?.y ?? 0, sizeMax?.x ?? framebuffer.size.x, sizeMax?.y ?? framebuffer.size.y);
		} else {
			Framebuffer.unbind(this.gl);
			this.gl.viewport(sizeMin?.x ?? 0, sizeMin?.y ?? 0, sizeMax?.x ?? this.gl.canvas.width, sizeMax?.y ?? this.gl.canvas.height);
		}

		if (this.indices) {
			this.gl.drawElements(mode, this.indices.buffer.data.length, this.indices.type, this.indices.offset);
		} else {
			this.gl.drawArrays(mode, offset, this.attributes?.[0].buffer.data.length / this.attributes?.[0].size ?? 0);
		}
	}
}