/** Any standard interface of the WebGL API. */
export type WebGLAny =
  WebGLRenderingContext
  | WebGL2RenderingContext
  | WebGLActiveInfo
  | WebGLBuffer
  | WebGLContextEvent
  | WebGLFramebuffer
  | WebGLProgram
  | WebGLQuery
  | WebGLRenderbuffer
  | WebGLSampler
  | WebGLShader
  | WebGLShaderPrecisionFormat
  | WebGLSync
  | WebGLTexture
  | WebGLTransformFeedback
  | WebGLUniformLocation
  | WebGLVertexArrayObject;

/** The base class of all object-oriented WebGL classes. */
export class WebGLObject {
  static readonly #map: Map<WebGLAny, WebGLObject> = new Map();

  /**
   * Converts a standard WebGL interface to its existing object-oriented version.
   * @param internal - The standard WebGL object.
   * @returns An object-oriented WebGL object.
   */
  static getObject(internal: WebGLAny) {
    const out: WebGLObject | undefined = WebGLObject.#map.get(internal);
    if (out) { return out; }
    throw new Error("The given WebGL interface does not have an existing object-oriented representation.");
  }

  /**
   * Creates an object-oriented WebGL object.
   * @param internal - The standard WebGL object to wrap.
   */
  constructor(internal: WebGLAny) {
    this.internal = internal;
    WebGLObject.#map.set(internal, this);
  }

  /** The standard WebGL interface represented by this object. */
  internal: WebGLAny;
}
