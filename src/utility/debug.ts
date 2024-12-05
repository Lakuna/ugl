import type DebugInfo from "../types/DebugInfo.js";

// Map of WebGL API method names to lists of which of the corresponding methods' arguments (and/or return values) should be interpreted as enumerated values. `-1` indicates the method's return value.
const isEnumMap = new Map<string, number[]>([
	["activeTexture", [0]],
	["attachShader", [1]],
	["bindBuffer", [0, 1]],
	["bindFramebuffer", [0, 1]],
	["bindRenderbuffer", [0, 1]],
	["bindTexture", [0, 1]],
	["blendEquation", [0]],
	["blendEquationSeparate", [0, 1]],
	["blendFunc", [0, 1]],
	["blendFuncSeparate", [0, 1, 2, 3]],
	["bufferData", [0, 2]],
	["bufferSubData", [0]],
	["checkFramebufferStatus", [-1, 0]],
	["clear", [0]], // TODO: Special case.
	["activeTexture", [0]],
	["compressedTexImage2D", [0, 2]],
	["compressedTexSubImage2D", [0, 6]],
	["copyTexImage2D", [0, 2]],
	["copyTexSubImage2D", [0]],
	["createShader", [0]],
	["cullFace", [0]],
	["depthFunc", [0]],
	["disable", [0]],
	["drawArrays", [0]],
	["drawElements", [0, 2]],
	["enable", [0]],
	["framebufferRenderbuffer", [0, 1, 2]],
	["framebufferTexture2D", [0, 1, 2]],
	["frontFace", [0]],
	["generateMipmap", [0]],
	["getBufferParameter", [-1, 0, 1]], // Return value may or may not be an enumerated value.
	["getError", [-1]],
	["getFramebufferAttachmentParameter", [-1, 0, 1, 2]], // Return value may or may not be an enumerated value.
	["getParameter", [-1, 0]], // Return value may or may not be an enumerated value.
	["getProgramParameter", [-1, 1]], // Return value may or may not be an enumerated value.
	["getRenderbufferParameter", [-1, 0, 1]], // Return value may or may not be an enumerated value.
	["getShaderParameter", [-1, 1]],
	["getShaderPrecisionFormat", [0, 1]],
	["getTexParameter", [-1, 0, 1]], // Return value may or may not be an enumerated value.
	["getVertexAttrib", [-1, 1]], // Return value may or may not be an enumerated value.
	["getVertexAttribOffset", [1]],
	["hint", [0, 1]],
	["isEnabled", [0]],
	["pixelStorei", [0, 1]], // Second argument may or may not be an enumerated value.
	["readPixels", [4, 5]],
	["renderbufferStorage", [0, 1]],
	["stencilFunc", [0]],
	["stencilFuncSeparate", [0, 1]],
	["stencilMaskSeparate", [0]],
	["stencilOp", [0, 1, 2]],
	["stencilOpSeparate", [0, 1, 2, 3]],
	["texImage2D", [0, 2, 3, 4, 6, 7]], // Fourth and fifth arguments may or may not be enumerated values.
	["texParameterf", [0, 1, 2]], // Third argument may or may not be an enumerated value.
	["texParameteri", [0, 1, 2]], // Third argument may or may not be an enumerated value.
	["texSubImage2D", [0, 4, 5, 6, 7]], // Fifth and sixth arguments may or may not be enumerated values.
	["vertexAttribPointer", [2]],
	["beginQuery", [0]],
	["beginTransformFeedback", [0]],
	["bindBufferBase", [0]],
	["bindBufferRange", [0]],
	["bindTransformFeedback", [0]],
	["blitFramebuffer", [8, 9]], // TODO: Special case.
	["bufferData", [0, 2]],
	["bufferSubData", [0]],
	["clearBufferfv", [0]],
	["clearBufferiv", [0]],
	["clearBufferuiv", [0]],
	["clearBufferfi", [0]],
	["clientWaitSync", [-1, 1]],
	["compressedTexImage3D", [0, 2]],
	["compressedTexSubImage3D", [0, 8]],
	["copyBufferSubData", [0, 1]],
	["copyTexSubImage3D", [0]],
	["drawArraysInstanced", [0]],
	["drawBuffers", [0]],
	["drawElementsInstanced", [0, 2]],
	["drawRangeElements", [0, 4]],
	["endQuery", [0]],
	["fenceSync", [0]],
	["framebufferTextureLayer", [0, 1]],
	["getActiveUniformBlockParameter", [2]],
	["getActiveUniforms", [-1, 2]], // Return value may or may not be an enumerated value.
	["getBufferSubData", [0]],
	["getIndexedParameter", [-1, 0]], // Return value may or may not be an enumerated value.
	["getInternalFormatParameter", [0, 1, 2]],
	["getQuery", [0, 1]],
	["getQueryParameter", [1]],
	["getSamplerParameter", [-1, 1]], // Return value may or may not be an enumerated value.
	["getSyncParameter", [-1, 1]],
	["invalidateFramebuffer", [0, 1]],
	["invalidateSubFramebuffer", [0, 1]],
	["readBuffer", [0]],
	["renderbufferStorageMultisample", [0, 2]],
	["samplerParameteri", [1, 2]], // Third argument may or may not be an enumerated value.
	["texImage3D", [0, 2, 7, 8]],
	["texStorage2D", [0, 2]],
	["texStorage3D", [0, 2]],
	["texSubImage3D", [0, 8, 9]],
	["transformFeedbackVaryings", [2]],
	["vertexAttribIPointer", [2]],
	["waitSync", [2]]
]);

/**
 * Replace each method on the given `WebGL2RenderingContext` with a version that logs diagnostic information to the given console.
 * @param gl - The rendering context to debug.
 * @param out - The console to log diagnostic information to.
 * @returns An object that controls the debugger.
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

	// Treat the rendering context as a `Record` so that we can access it unsafely.
	// TODO: Refactor this function so that it is type-safe.
	const object = gl as unknown as Record<string, unknown>;

	// Create a map of enumeration values to WebGL constant names.
	const enumMap = new Map<number, string>();
	for (const key in object) {
		// Skip known non-enumeration values.
		if (["drawingBufferWidth", "drawingBufferHeight"].includes(key)) {
			continue;
		}

		// Check if the property is a number.
		const value = object[key];
		if (typeof value !== "number") {
			continue;
		}

		// If the key already exists in the map, append the value to the existing value.
		const existingValue = enumMap.get(value);
		if (existingValue) {
			enumMap.set(value, `${existingValue}/${key}`);
			continue;
		}

		enumMap.set(value, key);
	}

	const stringify = (value: unknown, isEnum = false): string => {
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
					return `[${value.map((v) => stringify(v, isEnum)).toString()}]`;
				}

				if (value instanceof Int8Array) {
					return `Int8Array${stringify([...value], isEnum)}`;
				}

				if (value instanceof Uint8Array) {
					return `Uint8Array${stringify([...value], isEnum)}`;
				}

				if (value instanceof Uint8ClampedArray) {
					return `Uint8ClampedArray${stringify([...value], isEnum)}`;
				}

				if (value instanceof Int16Array) {
					return `Int16Array${stringify([...value], isEnum)}`;
				}

				if (value instanceof Uint16Array) {
					return `Uint16Array${stringify([...value], isEnum)}`;
				}

				if (value instanceof Int32Array) {
					return `Int32Array${stringify([...value], isEnum)}`;
				}

				if (value instanceof Uint32Array) {
					return `Uint32Array${stringify([...value], isEnum)}`;
				}

				if (value instanceof Float32Array) {
					return `Float32Array${stringify([...value], isEnum)}`;
				}

				if (value instanceof Float64Array) {
					return `Float64Array${stringify([...value], isEnum)}`;
				}

				if (value instanceof BigInt64Array) {
					return `BigInt64Array${stringify([...value], isEnum)}`;
				}

				if (value instanceof BigUint64Array) {
					return `BigUint64Array${stringify([...value], isEnum)}`;
				}

				if (Symbol.iterator in value) {
					try {
						return `Iterable${stringify([...(value as Iterable<unknown>)], isEnum)}`;
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
				// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
				return (isEnum && enumMap.get(value)) || value.toString();
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
	const debugInfo = {
		doLogErrors: true,
		isActive: true
	};

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
			// Execute the original method.
			const returnValue = method(...args);

			// Build and log a report of the method execution if the debugger is active.
			if (debugInfo.isActive) {
				// Build a report consisting of the method name and arguments list.
				let report = `${key}(`;
				const argumentDivider = ", ";
				let argIndex = 0;
				const isEnumList = isEnumMap.get(key);
				for (const arg of args) {
					report += `${stringify(arg, isEnumList?.includes(argIndex++))}${argumentDivider}`;
				}

				// Cut off the last argument divider, close the parentheses, and report the return value, if any.
				report = `${report.endsWith(argumentDivider) ? report.slice(0, report.length - argumentDivider.length) : report})`;
				if (typeof returnValue !== "undefined") {
					report += ` => ${stringify(returnValue, isEnumList?.includes(-1))}`;
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
						out.error(enumMap.get(error));

						// Disable error logging since otherwise this error will continue be logged after each method call.
						debugInfo.doLogErrors = false;
					}
				}
			}

			// Return the return value.
			return returnValue;
		};
	}

	return debugInfo;
}
