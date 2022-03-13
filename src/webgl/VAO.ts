import { Program } from "./Program.js";
import { AttributeState } from "./AttributeState.js";
import { Buffer } from "./Buffer.js";
import { BufferTarget, Primitive } from "./WebGLConstant.js";
import { Geometry } from "../utility/Geometry.js"
import { Framebuffer } from "./Framebuffer.js";

/** A collection of attribute state; a vertex attribute array. */
export class VAO {
  /**
   * Creates a vertex array object from a shape.
   * @param program - The program that the VAO is used with.
   * @param geometry - The shape to create the VAO from.
   * @param positionAttributeName - The name of the attribute that position data will be supplied to.
   * @param texcoordAttributeName - The name of the attribute that texture coordinate data will be supplied to.
   * @param normalAttributeName - The name of the attribute that normal data will be supplied to.
   */
  static fromGeometry(program: Program, geometry: Geometry, positionAttributeName: string, texcoordAttributeName?: string, normalAttributeName?: string): VAO {
    const attributes: AttributeState[] = [];
    attributes.push(new AttributeState(positionAttributeName, new Buffer(program.gl, geometry.positions)));
    if (texcoordAttributeName && geometry.texcoords?.length) {
      attributes.push(new AttributeState(texcoordAttributeName, new Buffer(program.gl, geometry.texcoords)));
    }
    if (normalAttributeName && geometry.normals?.length) {
      attributes.push(new AttributeState(normalAttributeName, new Buffer(program.gl, geometry.normals)));
    }
    return new VAO(program, attributes, geometry.indices);
  }

  /**
   * Creates a vertex array object.
   * @param program - The program that the VAO is used with.
   * @param attributes - The attributes associated with the VAO.
   * @param indices - The indices to supply to the element array buffer of this VAO if the data should be indexed.
   */
  constructor(program: Program, attributes: AttributeState[] = [], indices?: Uint8Array) {
    this.program = program;
    this.gl = program.gl;

    const vao: WebGLVertexArrayObject | null = this.gl.createVertexArray();
    if (!vao) { throw new Error("Failed to create VAO."); }
    this.vao = vao;

    this.#attributes = [];
    for (const attribute of attributes) { this.addAttribute(attribute); }

    this.indices = indices;
  }

  /** The rendering context of this VAO. */
  readonly gl: WebGL2RenderingContext;

  /** The program that this VAO is used with. */
  readonly program: Program;

  /** The WebGL API interface of this VAO. */
  readonly vao: WebGLVertexArrayObject;

  /** The attributes associated with this VAO. */
  #attributes: AttributeState[];

  /** The attributes associated with this VAO. */
  get attributes(): ReadonlyArray<AttributeState> {
    return this.#attributes;
  }

  /** The element array buffer of this VAO if its data is indexed. */
  #elementArrayBuffer: Buffer | undefined;

  /** The indices in the element array buffer of this VAO if the data is indexed. */
  get indices(): Uint8Array | undefined {
    return this.#elementArrayBuffer?.data as Uint8Array;
  }
  set indices(value: Uint8Array | undefined) {
    this.bind();
    if (value) {
      this.#elementArrayBuffer = new Buffer(this.gl, value, BufferTarget.ELEMENT_ARRAY_BUFFER);
    } else {
      this.#elementArrayBuffer = undefined;
    }
  }

  /** Makes this the active VAO. */
  bind(): void {
    this.gl.bindVertexArray(this.vao);
  }

  /**
   * Adds an attribute to this VAO.
   * @param attribute - The attribute to add.
   */
  addAttribute(attribute: AttributeState): void {
    this.bind();
    attribute.use(this.program);
    this.#attributes.push(attribute);
  }

  /**
   * Draws the vertex data stored in this VAO.
   * @param primitive - The type of primitive to draw.
   * @param offset - The number of elements to skip when drawing arrays.
   * @param framebuffer - The framebuffer to draw to, if any. Draws to the canvas if not set.
   * @param updateViewport - Whether to automatically update the viewport.
   */
  draw(primitive: Primitive = Primitive.TRIANGLES, offset = 0, framebuffer: Framebuffer, updateViewport = true): void {
    this.program.use();
    this.bind();

    if (framebuffer) {
      framebuffer.bind();
      if (updateViewport) { this.gl.viewport(0, 0, framebuffer.width, framebuffer.height); }
    } else {
      Framebuffer.unbind(this.gl);
      if (updateViewport) { this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height); }
    }

    if (this.#elementArrayBuffer) {
      this.gl.drawElements(primitive, this.#elementArrayBuffer.data.length, this.#elementArrayBuffer.type, 0);
    } else {
      const firstAttribute: AttributeState | undefined = this.attributes[0];
      if (!firstAttribute) { return; }
      const dataLength: number = firstAttribute.buffer.data.length;
      const dataSize: number = firstAttribute.size;

      this.gl.drawArrays(primitive, offset, dataLength / dataSize);
    }
  }
}
