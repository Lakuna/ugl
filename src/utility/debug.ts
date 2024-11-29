/**
 * Replace each method on the given `WebGL2RenderingContext` with a version that logs diagnostic information to the given console.
 * @param gl - The rendering context to debug.
 * @param out - The console to log diagnostic information to.
 */
export default function debug(
	gl: WebGL2RenderingContext,
	out: Console = console
): void {
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

	const stringify = (value: unknown, isEnum = false) => {
		switch (typeof value) {
			case "undefined":
				return "undefined";
			case "function":
				return "function";
			case "object":
				if (value === null) {
					return "null";
				}

				if (Array.isArray(value)) {
					return `[${value.toString()}]`;
				}

				if (value instanceof Int8Array) {
					return `Int8Array[${value.toString()}]`;
				}

				if (value instanceof Uint8Array) {
					return `Uint8Array[${value.toString()}]`;
				}

				if (value instanceof Int16Array) {
					return `Int16Array[${value.toString()}]`;
				}

				if (value instanceof Uint16Array) {
					return `Uint16Array[${value.toString()}]`;
				}

				if (value instanceof Int32Array) {
					return `Int32Array[${value.toString()}]`;
				}

				if (value instanceof Float32Array) {
					return `Float32Array[${value.toString()}]`;
				}

				if (value instanceof Float64Array) {
					return `Float64Array[${value.toString()}]`;
				}

				if (Symbol.iterator in value) {
					try {
						return `Iterable[${[...(value as Iterable<unknown>)].toString()}]`;
					} catch {
						// Not iterable; proceed to other guesses.
					}
				}

				if (value instanceof WebGLActiveInfo) {
					if (!activeInfos.includes(value)) {
						activeInfos.push(value);
					}

					return `WebGLActiveInfo[${activeInfos.indexOf(value).toString()}]`;
				}

				if (value instanceof WebGLBuffer) {
					if (!buffers.includes(value)) {
						buffers.push(value);
					}

					return `WebGLBuffer[${buffers.indexOf(value).toString()}]`;
				}

				if (value instanceof WebGLContextEvent) {
					if (!contextEvents.includes(value)) {
						contextEvents.push(value);
					}

					return `WebGLContextEvent[${contextEvents.indexOf(value).toString()}]`;
				}

				if (value instanceof WebGLFramebuffer) {
					if (!framebuffers.includes(value)) {
						framebuffers.push(value);
					}

					return `WebGLFramebuffer[${framebuffers.indexOf(value).toString()}]`;
				}

				if (value instanceof WebGLProgram) {
					if (!programs.includes(value)) {
						programs.push(value);
					}

					return `WebGLProgram[${programs.indexOf(value).toString()}]`;
				}

				if (value instanceof WebGLQuery) {
					if (!queries.includes(value)) {
						queries.push(value);
					}

					return `WebGLQuery[${queries.indexOf(value).toString()}]`;
				}

				if (value instanceof WebGLRenderbuffer) {
					if (!renderbuffers.includes(value)) {
						renderbuffers.push(value);
					}

					return `WebGLRenderbuffer[${renderbuffers.indexOf(value).toString()}]`;
				}

				if (value instanceof WebGL2RenderingContext) {
					if (!renderingContext2s.includes(value)) {
						renderingContext2s.push(value);
					}

					return `WebGL2RenderingContext[${renderingContext2s.indexOf(value).toString()}]`;
				}

				if (value instanceof WebGLRenderingContext) {
					if (!renderingContexts.includes(value)) {
						renderingContexts.push(value);
					}

					return `WebGLRenderingContext[${renderingContexts.indexOf(value).toString()}]`;
				}

				if (value instanceof WebGLSampler) {
					if (!samplers.includes(value)) {
						samplers.push(value);
					}

					return `WebGLSampler[${samplers.indexOf(value).toString()}]`;
				}

				if (value instanceof WebGLShader) {
					if (!shaders.includes(value)) {
						shaders.push(value);
					}

					return `WebGLShader[${shaders.indexOf(value).toString()}]`;
				}

				if (value instanceof WebGLShaderPrecisionFormat) {
					if (!shaderPrecisionFormats.includes(value)) {
						shaderPrecisionFormats.push(value);
					}

					return `WebGLShaderPrecisionFormat[${shaderPrecisionFormats.indexOf(value).toString()}]`;
				}

				if (value instanceof WebGLSync) {
					if (!syncs.includes(value)) {
						syncs.push(value);
					}

					return `WebGLSync[${syncs.indexOf(value).toString()}]`;
				}

				if (value instanceof WebGLTexture) {
					if (!textures.includes(value)) {
						textures.push(value);
					}

					return `WebGLTexture[${textures.indexOf(value).toString()}]`;
				}

				if (value instanceof WebGLTransformFeedback) {
					if (!transformFeedbacks.includes(value)) {
						transformFeedbacks.push(value);
					}

					return `WebGLTransformFeedback[${transformFeedbacks.indexOf(value).toString()}]`;
				}

				if (value instanceof WebGLUniformLocation) {
					if (!uniformLocations.includes(value)) {
						uniformLocations.push(value);
					}

					return `WebGLUniformLocation[${uniformLocations.indexOf(value).toString()}]`;
				}

				if (value instanceof WebGLVertexArrayObject) {
					if (!vertexArrayObjects.includes(value)) {
						vertexArrayObjects.push(value);
					}

					return `WebGLVertexArrayObject[${vertexArrayObjects.indexOf(value).toString()}]`;
				}

				if (!objects.includes(value)) {
					objects.push(value);
				}

				return `Object[${objects.indexOf(value).toString()}]`;
			case "string":
				return `"${value}"`;
			case "number":
				if (!isEnum) {
					return value.toString();
				}

				switch (value) {
					case 0x00000100:
						return "DEPTH_BUFFER_BIT";
					case 0x00000400:
						return "STENCIL_BUFFER_BIT";
					case 0x00004000:
						return "COLOR_BUFFER_BIT";
					case 0x0000:
					case 0:
						return "POINTS/ZERO";
					case 0x0001:
					case 1:
						return "LINES/ONE";
					case 0x0002:
						return "LINE_LOOP";
					case 0x0003:
						return "LINE_STRIP";
					case 0x0004:
						return "TRIANGLES";
					case 0x0005:
						return "TRIANGLE_STRIP";
					case 0x0006:
						return "TRIANGLE_FAN";
					case 0x0300:
						return "SRC_COLOR";
					case 0x0301:
						return "ONE_MINUS_SRC_COLOR";
					case 0x0302:
						return "SRC_ALPHA";
					case 0x0303:
						return "ONE_MINUS_SRC_ALPHA";
					case 0x0304:
						return "DST_ALPHA";
					case 0x0305:
						return "ONE_MINUS_DST_ALPHA";
					case 0x0306:
						return "DST_COLOR";
					case 0x0307:
						return "ONE_MINUS_DST_COLOR";
					case 0x0308:
						return "SRC_ALPHA_SATURATE";
					case 0x8001:
						return "CONSTANT_COLOR";
					case 0x8002:
						return "ONE_MINUS_CONSTANT_COLOR";
					case 0x8003:
						return "CONSTANT_ALPHA";
					case 0x8004:
						return "ONE_MINUS_CONSTANT_ALPHA";
					case 0x8006:
						return "FUNC_ADD";
					case 0x800a:
						return "FUNC_SUBTRACT";
					case 0x800b:
						return "FUNC_REVERSE_SUBTRACT";
					// TODO: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants#getting_gl_parameter_information
					default:
						return value.toString();
				}
			case "bigint":
				return `${value.toString()}n`;
			case "boolean":
			case "symbol":
				return value.toString();
			default:
				if (!unknowns.includes(value)) {
					unknowns.push(value);
				}

				return `unknown[${unknowns.indexOf(value).toString()}]`;
		}
	};

	const activeTexture = gl.activeTexture.bind(gl);
	gl.activeTexture = (texture: number) => {
		out.log(`activeTexture ${stringify(texture, true)}`);
		activeTexture(texture);
	};

	const attachShader = gl.attachShader.bind(gl);
	gl.attachShader = (program: WebGLProgram, shader: WebGLShader) => {
		out.log(`attachShader ${stringify(program)} ${stringify(shader)}`);
		attachShader(program, shader);
	};

	const bindAttribLocation = gl.bindAttribLocation.bind(gl);
	gl.bindAttribLocation = (
		program: WebGLProgram,
		index: number,
		name: string
	) => {
		out.log(
			`bindAttribLocation ${stringify(program)} ${stringify(index)} ${stringify(name)}`
		);
		bindAttribLocation(program, index, name);
	};

	const bindBuffer = gl.bindBuffer.bind(gl);
	gl.bindBuffer = (target: number, buffer: WebGLBuffer | null) => {
		out.log(`bindBuffer ${stringify(target, true)} ${stringify(buffer)}`);
		bindBuffer(target, buffer);
	};

	const bindFramebuffer = gl.bindFramebuffer.bind(gl);
	gl.bindFramebuffer = (
		target: number,
		framebuffer: WebGLFramebuffer | null
	) => {
		out.log(
			`bindFramebuffer ${stringify(target, true)} ${stringify(framebuffer)}`
		);
		bindFramebuffer(target, framebuffer);
	};

	const bindRenderbuffer = gl.bindRenderbuffer.bind(gl);
	gl.bindRenderbuffer = (
		target: number,
		renderbuffer: WebGLRenderbuffer | null
	) => {
		out.log(
			`bindRenderbuffer ${stringify(target, true)} ${stringify(renderbuffer)}`
		);
		bindRenderbuffer(target, renderbuffer);
	};

	const bindTexture = gl.bindTexture.bind(gl);
	gl.bindTexture = (target: number, texture: WebGLTexture | null) => {
		out.log(`bindTexture ${stringify(target, true)} ${stringify(texture)}`);
		bindTexture(target, texture);
	};

	const blendColor = gl.blendColor.bind(gl);
	gl.blendColor = (red: number, green: number, blue: number, alpha: number) => {
		out.log(
			`blendColor ${stringify(red)} ${stringify(green)} ${stringify(blue)} ${stringify(alpha)}`
		);
		blendColor(red, green, blue, alpha);
	};

	const blendEquation = gl.blendEquation.bind(gl);
	gl.blendEquation = (mode: number) => {
		out.log(`blendEquation ${stringify(mode, true)}`);
		blendEquation(mode);
	};

	const blendEquationSeparate = gl.blendEquationSeparate.bind(gl);
	gl.blendEquationSeparate = (modeRgb: number, modeAlpha: number) => {
		out.log(
			`blendEquationSeparate ${stringify(modeRgb, true)} ${stringify(modeAlpha, true)}`
		);
		blendEquationSeparate(modeRgb, modeAlpha);
	};

	const blendFunc = gl.blendFunc.bind(gl);
	gl.blendFunc = (sFactor: number, dFactor: number) => {
		out.log(
			`blendFunc ${stringify(sFactor, true)} ${stringify(dFactor, true)}`
		);
		blendFunc(sFactor, dFactor);
	};

	const blendFuncSeparate = gl.blendFuncSeparate.bind(gl);
	gl.blendFuncSeparate = (
		srcRgb: number,
		dstRgb: number,
		srcAlpha: number,
		dstAlpha: number
	) => {
		out.log(
			`blendFuncSeparate ${stringify(srcRgb, true)} ${stringify(dstRgb, true)} ${stringify(srcAlpha, true)} ${stringify(dstAlpha, true)}`
		);
		blendFuncSeparate(srcRgb, dstRgb, srcAlpha, dstAlpha);
	};

	const bufferData = gl.bufferData.bind(gl);
	gl.bufferData = (
		target: number,
		sizeOrSrcData: number | AllowSharedBufferSource | null | ArrayBufferView,
		usage: number,
		srcOffset?: number,
		length?: number
	) => {
		out.log(
			typeof srcOffset === "undefined"
				? `bufferData ${stringify(target, true)} ${stringify(sizeOrSrcData)} ${stringify(usage, true)}`
				: `bufferData ${stringify(target, true)} ${stringify(sizeOrSrcData)} ${stringify(usage, true)} ${stringify(srcOffset)} ${stringify(length)}`
		);

		bufferData(
			target,
			sizeOrSrcData as ArrayBufferView,
			usage,
			srcOffset as unknown as number,
			length
		);
	};

	// TODO: https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext
	// TODO: https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext
}
