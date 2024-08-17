// TODO: Ensure that parameters are never set over their limits; warn if set over the common level of support: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices#understand_system_limits.
// TODO: Remove various checks for production builds: https://webpack.js.org/plugins/define-plugin/.

// Constants
export { default as BlendEquation } from "./constants/BlendEquation.js";
export { default as BlendFunction } from "./constants/BlendFunction.js";
export { default as BufferUsage } from "./constants/BufferUsage.js";
export { default as CubeFace } from "./constants/CubeFace.js";
export { default as DataType } from "./constants/DataType.js";
export { default as ErrorCode } from "./constants/ErrorCode.js";
export { default as Extension } from "./constants/Extension.js";
export { default as Face } from "./constants/Face.js";
export { default as FramebufferAttachment } from "./constants/FramebufferAttachment.js";
export { default as FramebufferStatus } from "./constants/FramebufferStatus.js";
export { default as MergeOrder } from "./constants/MergeOrder.js";
export { default as Orientation } from "./constants/Orientation.js";
export { default as Primitive } from "./constants/Primitive.js";
export { default as RenderbufferFormat } from "./constants/RenderbufferFormat.js";
export { default as ShaderType } from "./constants/ShaderType.js";
export { default as TestFunction } from "./constants/TestFunction.js";
export { default as TextureCompareMode } from "./constants/TextureCompareMode.js";
export { default as TextureDataType } from "./constants/TextureDataType.js";
export { default as TextureFilter } from "./constants/TextureFilter.js";
export { default as TextureFormat } from "./constants/TextureFormat.js";
export { default as VariableType } from "./constants/VariableType.js";
export { default as WrapMode } from "./constants/WrapMode.js";

// Core - Buffers
export { default as Ebo } from "./core/buffers/Ebo.js";
export { default as GlBuffer } from "./core/buffers/GlBuffer.js";
export { default as Vbo } from "./core/buffers/Vbo.js";

// Core - Internal
export { default as ApiInterface } from "./core/internal/ApiInterface.js";
export { default as ContextDependent } from "./core/internal/ContextDependent.js";

// Core - Textures
export { default as Texture } from "./core/textures/Texture.js";
export { default as Texture2d } from "./core/textures/Texture2d.js";
export { default as Texture2dArray } from "./core/textures/Texture2dArray.js";
export { default as Texture3d } from "./core/textures/Texture3d.js";
export { default as TextureCubemap } from "./core/textures/TextureCubemap.js";

// Core - Variables
export { default as Attribute } from "./core/variables/attributes/Attribute.js";
export { default as Uniform } from "./core/variables/uniforms/Uniform.js";
export { default as Variable } from "./core/variables/Variable.js";
export { default as Varying } from "./core/variables/Varying.js";

// Core
export { default as Context } from "./core/Context.js";
export { default as Framebuffer } from "./core/Framebuffer.js";
export { default as Program } from "./core/Program.js";
export { default as Renderbuffer } from "./core/Renderbuffer.js";
export { default as Shader } from "./core/Shader.js";
export { default as Vao } from "./core/Vao.js";

// Types
export type { AttributeMap } from "./types/AttributeMap.js";
export type { default as AttributeValue } from "./types/AttributeValue.js";
export type { default as BlendEquationSet } from "./types/BlendEquationSet.js";
export type { default as BlendFunctionFullSet } from "./types/BlendFunctionFullSet.js";
export type { default as BlendFunctionSet } from "./types/BlendFunctionSet.js";
export type { default as Color } from "./types/Color.js";
export type { default as ColorMask } from "./types/ColorMask.js";
export type { ExtensionObject } from "./types/ExtensionObject.js";
export type { default as Prism } from "./types/Prism.js";
export type { default as Rectangle } from "./types/Rectangle.js";
export type { default as Stencil } from "./types/Stencil.js";
export type { UniformMap } from "./types/UniformMap.js";
export type { UniformValue } from "./types/UniformValue.js";

// Utility
export { default as BadValueError } from "./utility/BadValueError.js";
export { default as ImmutableError } from "./utility/ImmutableError.js";
export { default as getContext } from "./utility/getContext.js";
export { default as makeFullscreenCanvas } from "./utility/makeFullscreenCanvas.js";
export { default as ProgramLinkError } from "./utility/ProgramLinkError.js";
export { default as ShaderCompileError } from "./utility/ShaderCompileError.js";
export { default as TextureFormatError } from "./utility/TextureFormatError.js";
export { default as UnsupportedOperationError } from "./utility/UnsupportedOperationError.js";
export { default as WebglError } from "./utility/WebglError.js";
