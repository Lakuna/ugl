import {
	ACTIVE_TEXTURE,
	BLEND_DST_ALPHA,
	BLEND_DST_RGB,
	BLEND_EQUATION_ALPHA,
	BLEND_EQUATION_RGB,
	BLEND_SRC_ALPHA,
	BLEND_SRC_RGB,
	BUFFER_USAGE,
	COLOR_BUFFER_BIT,
	COMPRESSED_TEXTURE_FORMATS,
	CULL_FACE_MODE,
	DEPTH_BUFFER_BIT,
	DEPTH_FUNC,
	DRAW_BUFFER0,
	FRAGMENT_SHADER_DERIVATIVE_HINT,
	FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING,
	FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING_EXT,
	FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE,
	FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE,
	FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE,
	FRONT_FACE,
	GENERATE_MIPMAP_HINT,
	IMPLEMENTATION_COLOR_READ_FORMAT,
	IMPLEMENTATION_COLOR_READ_TYPE,
	OBJECT_TYPE,
	READ_BUFFER,
	RENDERBUFFER_INTERNAL_FORMAT,
	STENCIL_BACK_FAIL,
	STENCIL_BACK_FUNC,
	STENCIL_BACK_PASS_DEPTH_FAIL,
	STENCIL_BACK_PASS_DEPTH_PASS,
	STENCIL_BUFFER_BIT,
	STENCIL_FAIL,
	STENCIL_FUNC,
	STENCIL_PASS_DEPTH_FAIL,
	STENCIL_PASS_DEPTH_PASS,
	SYNC_CONDITION,
	SYNC_FLUSH_COMMANDS_BIT,
	SYNC_STATUS,
	TEXTURE_COMPARE_FUNC,
	TEXTURE_COMPARE_MODE,
	TEXTURE_MAG_FILTER,
	TEXTURE_MIN_FILTER,
	TEXTURE_WRAP_R,
	TEXTURE_WRAP_S,
	TEXTURE_WRAP_T,
	TRANSFORM_FEEDBACK_BUFFER_MODE,
	UNIFORM_TYPE,
	UNPACK_COLORSPACE_CONVERSION_WEBGL,
	VERTEX_ATTRIB_ARRAY_TYPE
} from "../constants/constants.js";
import type DebugInfo from "../types/DebugInfo.js";

// Map of WebGL API method names to lists of which of the corresponding methods' arguments (and/or return values) should be interpreted as enumerated values. `-1` indicates the method's return value.
const isEnumMap = new Map<string, { enums?: number[]; prefs?: string[] }>([
	["activeTexture", { enums: [0] }],
	[
		"bindBuffer",
		{ enums: [0], prefs: ["COPY_READ_BUFFER", "COPY_WRITE_BUFFER"] }
	],
	["bindFramebuffer", { enums: [0], prefs: ["FRAMEBUFFER_BINDING"] }],
	["bindRenderbuffer", { enums: [0] }],
	["bindTexture", { enums: [0] }],
	["blendEquation", { enums: [0], prefs: ["BLEND_EQUATION_RGB"] }],
	["blendEquationSeparate", { enums: [0, 1], prefs: ["BLEND_EQUATION_RGB"] }],
	["blendFunc", { enums: [0, 1], prefs: ["ZERO", "ONE"] }],
	["blendFuncSeparate", { enums: [0, 1, 2, 3], prefs: ["ZERO", "ONE"] }],
	[
		"bufferData",
		{ enums: [0, 2], prefs: ["COPY_READ_BUFFER", "COPY_WRITE_BUFFER"] }
	],
	[
		"bufferSubData",
		{ enums: [0], prefs: ["COPY_READ_BUFFER", "COPY_WRITE_BUFFER"] }
	],
	["checkFramebufferStatus", { enums: [-1, 0] }],
	["compressedTexImage2D", { enums: [0, 2] }],
	["compressedTexSubImage2D", { enums: [0, 6] }],
	["copyTexImage2D", { enums: [0, 2] }],
	["copyTexSubImage2D", { enums: [0] }],
	["createShader", { enums: [0] }],
	["cullFace", { enums: [0] }],
	["depthFunc", { enums: [0] }],
	["disable", { enums: [0] }],
	["drawArrays", { enums: [0], prefs: ["POINTS", "LINES"] }],
	["drawElements", { enums: [0, 2], prefs: ["POINTS", "LINES"] }],
	["enable", { enums: [0] }],
	["framebufferRenderbuffer", { enums: [0, 1, 2] }],
	["framebufferTexture2D", { enums: [0, 1, 2] }],
	["frontFace", { enums: [0] }],
	["generateMipmap", { enums: [0] }],
	[
		"getBufferParameter",
		{ enums: [0, 1], prefs: ["COPY_READ_BUFFER", "COPY_WRITE_BUFFER"] }
	],
	["getError", { enums: [-1], prefs: ["NO_ERROR"] }],
	["getFramebufferAttachmentParameter", { enums: [0, 1, 2], prefs: ["NONE"] }],
	[
		"getParameter",
		{
			enums: [0],
			prefs: [
				"NONE",
				"BLEND_EQUATION", // This is the only place where `BLEND_EQUATION` is used, and it means the same thing as `BLEND_EQUATION_RGB`.
				"BLEND_EQUATION_RGB",
				"DRAW_FRAMEBUFFER_BINDING", // This is the only place where `DRAW_FRAMEBUFFER_BINDING` is used, and it means the same thing as `FRAMEBUFFER_BINDING`.
				"FRAMEBUFFER_BINDING",
				"COPY_READ_BUFFER_BINDING",
				"COPY_WRITE_BUFFER_BINDING"
			]
		}
	],
	["getProgramParameter", { enums: [1] }],
	["getRenderbufferParameter", { enums: [0, 1] }],
	["getShaderParameter", { enums: [-1, 1] }], // Return value may not be enumerated but is never a non-enumerated number or array.
	["getShaderPrecisionFormat", { enums: [0, 1] }],
	["getTexParameter", { enums: [0, 1], prefs: ["NONE"] }],
	["getVertexAttrib", { enums: [1] }],
	["getVertexAttribOffset", { enums: [1] }],
	["hint", { enums: [0, 1] }],
	["isEnabled", { enums: [0] }],
	["pixelStorei", { prefs: ["NONE"] }],
	["readPixels", { enums: [4, 5] }],
	["renderbufferStorage", { enums: [0, 1] }],
	["stencilFunc", { enums: [0] }],
	["stencilFuncSeparate", { enums: [0, 1] }],
	["stencilMaskSeparate", { enums: [0] }],
	["stencilOp", { enums: [0, 1, 2], prefs: ["ZERO"] }],
	["stencilOpSeparate", { enums: [0, 1, 2, 3], prefs: ["ZERO"] }],
	["texParameterf", { prefs: ["NONE"] }],
	["texParameteri", { prefs: ["NONE"] }],
	["vertexAttribPointer", { enums: [2] }],
	["beginQuery", { enums: [0] }],
	["beginTransformFeedback", { enums: [0], prefs: ["POINTS", "LINES"] }],
	["bindBufferBase", { enums: [0] }],
	["bindBufferRange", { enums: [0] }],
	["bindTransformFeedback", { enums: [0] }],
	["clearBufferfv", { enums: [0] }],
	["clearBufferiv", { enums: [0] }],
	["clearBufferuiv", { enums: [0] }],
	["clearBufferfi", { enums: [0] }],
	["clientWaitSync", { enums: [-1], prefs: ["SYNC_FLUSH_COMMANDS_BIT"] }],
	["compressedTexImage3D", { enums: [0, 2] }],
	["compressedTexSubImage3D", { enums: [0, 8] }],
	[
		"copyBufferSubData",
		{ enums: [0, 1], prefs: ["COPY_READ_BUFFER", "COPY_WRITE_BUFFER"] }
	],
	["copyTexSubImage3D", { enums: [0] }],
	["drawArraysInstanced", { enums: [0], prefs: ["POINTS", "LINES"] }],
	["drawBuffers", { enums: [0], prefs: ["NONE"] }],
	["drawElementsInstanced", { enums: [0, 2], prefs: ["POINTS", "LINES"] }],
	["drawRangeElements", { enums: [0, 4], prefs: ["POINTS", "LINES"] }],
	["endQuery", { enums: [0] }],
	["fenceSync", { enums: [0] }], // Second argument is a bitfield but can only be zero.
	["framebufferTextureLayer", { enums: [0, 1] }],
	["getActiveUniformBlockParameter", { enums: [2] }],
	["getActiveUniforms", { enums: [2] }],
	[
		"getBufferSubData",
		{ enums: [0], prefs: ["COPY_READ_BUFFER", "COPY_WRITE_BUFFER"] }
	],
	["getIndexedParameter", { enums: [0], prefs: ["BLEND_EQUATION_RGB"] }],
	["getInternalFormatParameter", { enums: [0, 1, 2] }],
	["getQuery", { enums: [0, 1] }],
	["getQueryParameter", { enums: [1] }],
	["getSamplerParameter", { enums: [1] }],
	["getSyncParameter", { enums: [1] }],
	["invalidateFramebuffer", { enums: [0, 1] }],
	["invalidateSubFramebuffer", { enums: [0, 1] }],
	["readBuffer", { enums: [0], prefs: ["NONE"] }],
	["renderbufferStorageMultisample", { enums: [0, 2] }],
	["texImage3D", { enums: [0, 2, 7, 8] }],
	["texStorage2D", { enums: [0, 2] }],
	["texStorage3D", { enums: [0, 2] }],
	["texSubImage3D", { enums: [0, 8, 9] }],
	["transformFeedbackVaryings", { enums: [2] }],
	["vertexAttribIPointer", { enums: [2] }],
	["waitSync", { enums: [2] }] // Second argument is a bitfield but can only be zero.
]);

/**
 * Replace each method on the given `WebGL2RenderingContext` with a version that logs diagnostic information to the given console.
 * @param gl - The rendering context to debug.
 * @param out - The console to log diagnostic information to.
 * @returns An object that controls the debugger.
 * @public
 */
export default function debug(
	gl: WebGL2RenderingContext,
	out: Console = console
): DebugInfo {
	// Lists of previously-mentioned objects so that all WebGL objects can be uniquely identified.
	const activeInfos: WebGLActiveInfo[] = [];
	const buffers: WebGLBuffer[] = [];
	const contextEvents: WebGLContextEvent[] = [];
	const framebuffers: WebGLFramebuffer[] = [];
	const programs: WebGLProgram[] = [];
	const queries: WebGLQuery[] = [];
	const renderbuffers: WebGLRenderbuffer[] = [];
	const renderingContext2s: WebGL2RenderingContext[] = [gl];
	const renderingContexts: WebGLRenderingContext[] = [];
	const samplers: WebGLSampler[] = [];
	const shaders: WebGLShader[] = [];
	const shaderPrecisionFormats: WebGLShaderPrecisionFormat[] = [];
	const syncs: WebGLSync[] = [];
	const textures: WebGLTexture[] = [];
	const transformFeedbacks: WebGLTransformFeedback[] = [];
	const uniformLocations: WebGLUniformLocation[] = [];
	const vertexArrayObjects: WebGLVertexArrayObject[] = [];

	// An additional list for miscellaneous objects.
	const objects: object[] = [];

	// An additional list for miscellaneous unknown values.
	const unknowns: unknown[] = [];

	// Treat the rendering context as a `Record` so that we can access it unsafely. `Object.entries` does not work on `WebGL2RenderingContext`s.
	const object = gl as unknown as Record<string, unknown>;

	// Create a map of enumeration values to WebGL constant names.
	const enumMap = new Map<number, string[]>();
	for (const key in object) {
		// Skip known non-enumeration values.
		if (["drawingBufferWidth", "drawingBufferHeight"].includes(key)) {
			continue;
		}

		// Check if the value is a number.
		const value = object[key];
		if (typeof value !== "number") {
			continue;
		}

		// If the key already exists in the map, append the value to the existing value.
		const existingValue = enumMap.get(value);
		if (existingValue) {
			existingValue.push(key);
			continue;
		}

		enumMap.set(value, [key]);
	}

	const enumName = (value: number, prefs?: string[]): string => {
		/*
		A few WebGL constant names are mapped to the same value. It's more helpful if the name of the relevant constant is printed for affected functions, so they're tracked in `isEnumMap`. These constants are:
		- `0`: `POINTS`, `ZERO`, `NO_ERROR`, and `NONE`.
		- `1`: `SYNC_FLUSH_COMMANDS_BIT`, `LINES`, and `ONE`.
		- `32777`: `BLEND_EQUATION` and `BLEND_EQUATION_RGB`.
		- `36006`: `DRAW_FRAMEBUFFER_BINDING` and `FRAMEBUFFER_BINDING`.
		- `36662`: `COPY_READ_BUFFER` and `COPY_READ_BUFFER_BINDING`.
		- `36663`: `COPY_WRITE_BUFFER` and `COPY_WRITE_BUFFER_BINDING`.
		*/

		const names = enumMap.get(value);
		if (!names || names.length < 1) {
			return value.toString();
		}

		const preferredNames =
			prefs?.length ? names.filter((name) => prefs.includes(name)) : [];
		return (preferredNames.length > 0 ? preferredNames : names).join("/");
	};

	const stringify = (
		value: unknown,
		isEnum = false,
		prefs?: string[]
	): string => {
		switch (typeof value) {
			case "undefined":
				return "undefined";
			case "function":
				return "function";
			case "object":
				if (value === null) {
					return "null";
				}

				// Recursion base case for iterable values.
				if (Array.isArray(value)) {
					return `[${value.map((v) => stringify(v, isEnum, prefs)).join(", ")}]`;
				}

				if (value instanceof Int8Array) {
					return `Int8Array${stringify([...value], isEnum, prefs)}`;
				}

				if (value instanceof Uint8Array) {
					return `Uint8Array${stringify([...value], isEnum, prefs)}`;
				}

				if (value instanceof Uint8ClampedArray) {
					return `Uint8ClampedArray${stringify([...value], isEnum, prefs)}`;
				}

				if (value instanceof Int16Array) {
					return `Int16Array${stringify([...value], isEnum, prefs)}`;
				}

				if (value instanceof Uint16Array) {
					return `Uint16Array${stringify([...value], isEnum, prefs)}`;
				}

				if (value instanceof Int32Array) {
					return `Int32Array${stringify([...value], isEnum, prefs)}`;
				}

				if (value instanceof Uint32Array) {
					return `Uint32Array${stringify([...value], isEnum, prefs)}`;
				}

				if (value instanceof Float32Array) {
					return `Float32Array${stringify([...value], isEnum, prefs)}`;
				}

				if (value instanceof Float64Array) {
					return `Float64Array${stringify([...value], isEnum, prefs)}`;
				}

				if (value instanceof BigInt64Array) {
					return `BigInt64Array${stringify([...value], isEnum, prefs)}`;
				}

				if (value instanceof BigUint64Array) {
					return `BigUint64Array${stringify([...value], isEnum, prefs)}`;
				}

				if (Symbol.iterator in value) {
					try {
						return `Iterable${stringify([...(value as Iterable<unknown>)], isEnum, prefs)}`;
					} catch {
						// Not iterable; proceed to other guesses.
					}
				}

				if (value instanceof WebGLActiveInfo) {
					if (!activeInfos.includes(value)) {
						activeInfos.push(value);
					}

					return `WebGLActiveInfo#${stringify(activeInfos.indexOf(value))}`;
				}

				if (value instanceof WebGLBuffer) {
					if (!buffers.includes(value)) {
						buffers.push(value);
					}

					return `WebGLBuffer#${stringify(buffers.indexOf(value))}`;
				}

				if (value instanceof WebGLContextEvent) {
					if (!contextEvents.includes(value)) {
						contextEvents.push(value);
					}

					return `WebGLContextEvent#${stringify(contextEvents.indexOf(value))}`;
				}

				if (value instanceof WebGLFramebuffer) {
					if (!framebuffers.includes(value)) {
						framebuffers.push(value);
					}

					return `WebGLFramebuffer#${stringify(framebuffers.indexOf(value))}`;
				}

				if (value instanceof WebGLProgram) {
					if (!programs.includes(value)) {
						programs.push(value);
					}

					return `WebGLProgram#${stringify(programs.indexOf(value))}`;
				}

				if (value instanceof WebGLQuery) {
					if (!queries.includes(value)) {
						queries.push(value);
					}

					return `WebGLQuery#${stringify(queries.indexOf(value))}`;
				}

				if (value instanceof WebGLRenderbuffer) {
					if (!renderbuffers.includes(value)) {
						renderbuffers.push(value);
					}

					return `WebGLRenderbuffer#${stringify(renderbuffers.indexOf(value))}`;
				}

				if (value instanceof WebGL2RenderingContext) {
					if (!renderingContext2s.includes(value)) {
						renderingContext2s.push(value);
					}

					return `WebGL2RenderingContext#${stringify(renderingContext2s.indexOf(value))}`;
				}

				if (value instanceof WebGLRenderingContext) {
					if (!renderingContexts.includes(value)) {
						renderingContexts.push(value);
					}

					return `WebGLRenderingContext#${stringify(renderingContexts.indexOf(value))}`;
				}

				if (value instanceof WebGLSampler) {
					if (!samplers.includes(value)) {
						samplers.push(value);
					}

					return `WebGLSampler#${stringify(samplers.indexOf(value))}`;
				}

				if (value instanceof WebGLShader) {
					if (!shaders.includes(value)) {
						shaders.push(value);
					}

					return `WebGLShader#${stringify(shaders.indexOf(value))}`;
				}

				if (value instanceof WebGLShaderPrecisionFormat) {
					if (!shaderPrecisionFormats.includes(value)) {
						shaderPrecisionFormats.push(value);
					}

					return `WebGLShaderPrecisionFormat#${stringify(shaderPrecisionFormats.indexOf(value))}`;
				}

				if (value instanceof WebGLSync) {
					if (!syncs.includes(value)) {
						syncs.push(value);
					}

					return `WebGLSync#${stringify(syncs.indexOf(value))}`;
				}

				if (value instanceof WebGLTexture) {
					if (!textures.includes(value)) {
						textures.push(value);
					}

					return `WebGLTexture#${stringify(textures.indexOf(value))}`;
				}

				if (value instanceof WebGLTransformFeedback) {
					if (!transformFeedbacks.includes(value)) {
						transformFeedbacks.push(value);
					}

					return `WebGLTransformFeedback#${stringify(transformFeedbacks.indexOf(value))}`;
				}

				if (value instanceof WebGLUniformLocation) {
					if (!uniformLocations.includes(value)) {
						uniformLocations.push(value);
					}

					return `WebGLUniformLocation#${stringify(uniformLocations.indexOf(value))}`;
				}

				if (value instanceof WebGLVertexArrayObject) {
					if (!vertexArrayObjects.includes(value)) {
						vertexArrayObjects.push(value);
					}

					return `WebGLVertexArrayObject#${stringify(vertexArrayObjects.indexOf(value))}`;
				}

				if (!objects.includes(value)) {
					objects.push(value);
				}

				return `Object#${stringify(objects.indexOf(value))}`;
			case "string":
				return `"${value}"`;
			case "number":
				return isEnum ? enumName(value, prefs) : value.toString();
			case "bigint":
				return `${value.toString()}n`;
			case "boolean":
			case "symbol":
				return value.toString();
			default:
				if (!unknowns.includes(value)) {
					unknowns.push(value);
				}

				return `unknown#${stringify(unknowns.indexOf(value))}`;
		}
	};

	// Make an object for controlling the debugger.
	const debugInfo = { doLogErrors: true, isActive: true };

	// eslint-disable-next-line guard-for-in
	for (const key in object) {
		// Check each property to see if it's a method.
		const value = object[key];
		if (typeof value !== "function") {
			continue;
		}

		// For each method, call the method then log the method's name, arguments, and return value.
		const method = value.bind(gl) as (...args: unknown[]) => unknown;
		object[key] = (...args: unknown[]) => {
			if (!debugInfo.isActive) {
				// Just execute the original method.
				return method(...args);
			}

			// Build a report consisting of the method name and arguments list. Stringify arguments before calling the method in case the method modifies the arguments.
			let report = `${key}(`;
			const argumentDivider = ", ";
			const entry = isEnumMap.get(key);
			const enums = entry?.enums;
			const prefs = entry?.prefs;
			for (const [i, arg] of args.entries()) {
				let isEnum = enums?.includes(i) ?? false;

				// Handle special cases where specific arguments are bit fields or may or may not be enumerated values.
				switch (key) {
					case "clear": {
						if (i !== 0 || typeof arg !== "number") {
							break;
						}

						const parts = [];
						if (arg & COLOR_BUFFER_BIT) {
							parts.push("COLOR_BUFFER_BIT");
						}

						if (arg & DEPTH_BUFFER_BIT) {
							parts.push("DEPTH_BUFFER_BIT");
						}

						if (arg & STENCIL_BUFFER_BIT) {
							parts.push("STENCIL_BUFFER_BIT");
						}

						report += `${parts.length > 0 ? parts.join(" | ") : "0"}${argumentDivider}`;
						continue;
					}
					case "pixelStorei":
						isEnum =
							i === 0 ||
							(i === 1 && arg === UNPACK_COLORSPACE_CONVERSION_WEBGL);
						break;
					case "texImage2D":
						isEnum =
							i === 0 ||
							i === 2 ||
							(i === 3 && args.length === 6) ||
							(i === 4 && args.length === 6) ||
							i === 6 ||
							i === 7;
						break;
					case "texParameterf":
					case "texParameteri":
						isEnum =
							i === 0 ||
							i === 1 ||
							(i === 2 && args[1] === TEXTURE_MAG_FILTER) ||
							(i === 2 && args[1] === TEXTURE_MIN_FILTER) ||
							(i === 2 && args[1] === TEXTURE_WRAP_S) ||
							(i === 2 && args[1] === TEXTURE_WRAP_T) ||
							(i === 2 && args[1] === TEXTURE_COMPARE_FUNC) ||
							(i === 2 && args[1] === TEXTURE_COMPARE_MODE) ||
							(i === 2 && args[1] === TEXTURE_WRAP_R);
						break;
					case "texSubImage2D":
						isEnum =
							i === 0 ||
							(i === 4 && args.length === 7) ||
							(i === 5 && args.length === 7) ||
							i === 6 ||
							i === 7;
						break;
					case "blitFramebuffer": {
						if (i !== 8 || typeof arg !== "number") {
							isEnum = i === 9;
							break;
						}

						const parts = [];
						if (arg & COLOR_BUFFER_BIT) {
							parts.push("COLOR_BUFFER_BIT");
						}

						if (arg & DEPTH_BUFFER_BIT) {
							parts.push("DEPTH_BUFFER_BIT");
						}

						if (arg & STENCIL_BUFFER_BIT) {
							parts.push("STENCIL_BUFFER_BIT");
						}

						report += `${parts.length > 0 ? parts.join(" | ") : "0"}${argumentDivider}`;
						continue;
					}
					case "clientWaitSync":
						isEnum = i === 1 && arg === SYNC_FLUSH_COMMANDS_BIT;
						break;
					case "samplerParameteri":
					case "samplerParameterf":
						isEnum =
							i === 1 ||
							(i === 2 && args[1] === TEXTURE_COMPARE_FUNC) ||
							(i === 2 && args[1] === TEXTURE_COMPARE_MODE) ||
							(i === 2 && args[1] === TEXTURE_MAG_FILTER) ||
							(i === 2 && args[1] === TEXTURE_MIN_FILTER) ||
							(i === 2 && args[1] === TEXTURE_WRAP_R) ||
							(i === 2 && args[1] === TEXTURE_WRAP_S) ||
							(i === 2 && args[1] === TEXTURE_WRAP_T);
						break;
					default:
						break;
				}

				report += `${stringify(arg, isEnum, prefs)}${argumentDivider}`;
			}

			// Cut off the last argument divider and close the parentheses.
			report = `${report.endsWith(argumentDivider) ? report.slice(0, report.length - argumentDivider.length) : report})`;

			// Execute the original method.
			const returnValue = method(...args);

			// Report the return value, if any.
			if (typeof returnValue !== "undefined") {
				let isEnum = enums?.includes(-1) ?? false;

				// Handle special cases where the return value is a bit field or may or may not be an enumerated value.
				switch (key) {
					case "getBufferParameter":
						isEnum = args[1] === BUFFER_USAGE;
						break;
					case "getFramebufferAttachmentParameter":
						isEnum =
							args[2] === FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE ||
							args[2] === FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE ||
							args[2] === FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING ||
							args[2] === FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE ||
							args[2] === FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING_EXT;
						break;
					case "getParameter":
						isEnum =
							args[0] === ACTIVE_TEXTURE ||
							args[0] === BLEND_DST_ALPHA ||
							args[0] === BLEND_DST_RGB ||
							args[0] === BLEND_EQUATION_ALPHA ||
							args[0] === BLEND_EQUATION_RGB ||
							args[0] === BLEND_SRC_ALPHA ||
							args[0] === BLEND_SRC_RGB ||
							args[0] === COMPRESSED_TEXTURE_FORMATS ||
							args[0] === CULL_FACE_MODE ||
							args[0] === DEPTH_FUNC ||
							args[0] === FRONT_FACE ||
							args[0] === GENERATE_MIPMAP_HINT ||
							args[0] === IMPLEMENTATION_COLOR_READ_FORMAT ||
							args[0] === IMPLEMENTATION_COLOR_READ_TYPE ||
							args[0] === STENCIL_BACK_FAIL ||
							args[0] === STENCIL_BACK_FUNC ||
							args[0] === STENCIL_BACK_PASS_DEPTH_FAIL ||
							args[0] === STENCIL_BACK_PASS_DEPTH_PASS ||
							args[0] === STENCIL_FAIL ||
							args[0] === STENCIL_FUNC ||
							args[0] === STENCIL_PASS_DEPTH_FAIL ||
							args[0] === STENCIL_PASS_DEPTH_PASS ||
							args[0] === UNPACK_COLORSPACE_CONVERSION_WEBGL ||
							(typeof args[0] === "number" &&
								args[0] >= DRAW_BUFFER0 &&
								args[0] < DRAW_BUFFER0 + 16) ||
							args[0] === FRAGMENT_SHADER_DERIVATIVE_HINT ||
							args[0] === READ_BUFFER;
						break;
					case "getProgramParameter":
						isEnum = args[1] === TRANSFORM_FEEDBACK_BUFFER_MODE;
						break;
					case "getRenderbufferParameter":
						isEnum = args[1] === RENDERBUFFER_INTERNAL_FORMAT;
						break;
					case "getTexParameter":
					case "getSamplerParameter":
						isEnum =
							args[1] === TEXTURE_COMPARE_FUNC ||
							args[1] === TEXTURE_COMPARE_MODE ||
							args[1] === TEXTURE_MAG_FILTER ||
							args[1] === TEXTURE_MIN_FILTER ||
							args[1] === TEXTURE_WRAP_R ||
							args[1] === TEXTURE_WRAP_S ||
							args[1] === TEXTURE_WRAP_T;
						break;
					case "getVertexAttrib":
						isEnum = args[1] === VERTEX_ATTRIB_ARRAY_TYPE;
						break;
					case "getActiveUniforms":
						isEnum = args[2] === UNIFORM_TYPE;
						break;
					case "getIndexedParameter":
						isEnum =
							args[0] === BLEND_EQUATION_RGB ||
							args[0] === BLEND_EQUATION_ALPHA ||
							args[0] === BLEND_SRC_RGB ||
							args[0] === BLEND_SRC_ALPHA ||
							args[0] === BLEND_DST_RGB ||
							args[0] === BLEND_DST_ALPHA;
						break;
					case "getSyncParameter":
						isEnum =
							args[1] === OBJECT_TYPE ||
							args[1] === SYNC_STATUS ||
							args[1] === SYNC_CONDITION;
						break;
					default:
						break;
				}

				report += ` => ${stringify(returnValue, isEnum, prefs)}`;
			}

			// Log the report to the console.
			out.log(report);

			// Check for errors.
			if (debugInfo.doLogErrors) {
				// Don't log this call to `getError`.
				debugInfo.isActive = false;
				const error = gl.getError();
				debugInfo.isActive = true;

				if (error) {
					// Print the error code.
					out.error(enumName(error, isEnumMap.get("isError")?.prefs));

					// Disable error logging since otherwise this error will continue be logged after each method call.
					debugInfo.doLogErrors = false;
				}
			}

			// Return the return value.
			return returnValue;
		};
	}

	return debugInfo;
}
