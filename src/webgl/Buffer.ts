import { TypedArray } from "../types/TypedArray.js";
import { BufferTarget, BufferUsage, BufferDataType } from "./WebGLConstant.js";

/** A data stucture that supplies per-vertex data to the GPU. */
export class Buffer {
  /**
   * Creates a buffer.
   * @param gl - The rendering context of the buffer.
   * @param data - The data to store in the buffer.
   * @param target - The binding point to bind the buffer to.
   * @param usage - The usage pattern of the buffer's data store.
   */
  constructor(gl: WebGL2RenderingContext, data: TypedArray, target: BufferTarget = BufferTarget.ARRAY_BUFFER, usage: BufferUsage = BufferUsage.STATIC_DRAW) {
    if (target == BufferTarget.ELEMENT_ARRAY_BUFFER && !(data instanceof Uint8Array)) { throw new Error("The element array buffer must contain 8-bit unsigned integers."); }

    this.gl = gl;
    this.#data = data;
    this.target = target;
    this.usage = usage;
    this.#type = BufferDataType.BYTE;

    const buffer: WebGLBuffer | null = gl.createBuffer();
    if (!buffer) { throw new Error("Failed to create buffer."); }
    this.buffer = buffer;

    this.data = data;
  }

  /** The rendering context of this buffer. */
  readonly gl: WebGL2RenderingContext;

  /** The binding point to bind this buffer to. */
  target: BufferTarget;

  /** The usage pattern of this buffer's data store. */
  usage: BufferUsage;

  /** The WebGL API interface of this buffer. */
  readonly buffer: WebGLBuffer;

  /** The data contained within this buffer. */
  #data: TypedArray;

  /** The data contained within this buffer. */
  get data(): TypedArray {
    return this.#data;
  }
  set data(value: TypedArray) {
    this.bind();
    this.gl.bufferData(this.target, value, this.usage);
    this.#data = value;

    if (value instanceof Int8Array) {
      this.#type = BufferDataType.BYTE;
    } else if (value instanceof Uint8Array
      || value instanceof Uint8ClampedArray) {
      this.#type = BufferDataType.UNSIGNED_BYTE;
    } else if (value instanceof Uint16Array) {
      this.#type = BufferDataType.UNSIGNED_SHORT;
    } else if (value instanceof Int16Array) {
      this.#type = BufferDataType.SHORT;
    } else {
      this.#type = BufferDataType.FLOAT;
    }
  }

  /** The type of each component in this buffer. */
  #type: BufferDataType;

  /** The type of each component in this buffer. */
  get type(): BufferDataType {
    return this.#type;
  }

  /** Binds this buffer to its target binding point. */
  bind(): void {
    this.gl.bindBuffer(this.target, this.buffer);
  }
}
