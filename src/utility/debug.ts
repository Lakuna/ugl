import type DebugInfo from "../types/DebugInfo.js";

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
					return `Int8Array${stringify([...value])}`;
				}

				if (value instanceof Uint8Array) {
					return `Uint8Array${stringify([...value])}`;
				}

				if (value instanceof Int16Array) {
					return `Int16Array${stringify([...value])}`;
				}

				if (value instanceof Uint16Array) {
					return `Uint16Array${stringify([...value])}`;
				}

				if (value instanceof Int32Array) {
					return `Int32Array${stringify([...value])}`;
				}

				if (value instanceof Float32Array) {
					return `Float32Array${stringify([...value])}`;
				}

				if (value instanceof Float64Array) {
					return `Float64Array${stringify([...value])}`;
				}

				if (Symbol.iterator in value) {
					try {
						return `Iterable${stringify([...(value as Iterable<unknown>)])}`;
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
				for (const arg of args) {
					report += `${stringify(arg, true)}${argumentDivider}`;
				}

				// TODO: Only set `isEnum` to `true` if the specific argument being passed is supposed to be an enumeration value.

				// Cut off the last argument divider, close the parentheses, and report the return value, if any.
				report = `${report.endsWith(argumentDivider) ? report.slice(0, report.length - argumentDivider.length) : report})`;
				if (typeof returnValue !== "undefined") {
					report += ` => ${stringify(returnValue, true)}`;
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
