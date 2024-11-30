import {
	COLOR_BUFFER_BIT,
	DEPTH_BUFFER_BIT,
	STENCIL_BUFFER_BIT
} from "../constants/constants.js";

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
					return `Int8Array[${stringify([...value])}]`;
				}

				if (value instanceof Uint8Array) {
					return `Uint8Array[${stringify([...value])}]`;
				}

				if (value instanceof Int16Array) {
					return `Int16Array[${stringify([...value])}]`;
				}

				if (value instanceof Uint16Array) {
					return `Uint16Array[${stringify([...value])}]`;
				}

				if (value instanceof Int32Array) {
					return `Int32Array[${stringify([...value])}]`;
				}

				if (value instanceof Float32Array) {
					return `Float32Array[${stringify([...value])}]`;
				}

				if (value instanceof Float64Array) {
					return `Float64Array[${stringify([...value])}]`;
				}

				if (Symbol.iterator in value) {
					try {
						return `Iterable[${stringify([...(value as Iterable<unknown>)])}]`;
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

				return `unknown#${stringify(unknowns.indexOf(value))}`;
		}
	};

	// TODO: There has to be a better way to write all of this, but I haven't found it yet.

	const activeTexture = gl.activeTexture.bind(gl);
	gl.activeTexture = (texture: number) => {
		out.log(`activeTexture(${stringify(texture, true)})`);
		activeTexture(texture);
	};

	const attachShader = gl.attachShader.bind(gl);
	gl.attachShader = (program: WebGLProgram, shader: WebGLShader) => {
		out.log(`attachShader(${stringify(program)}, ${stringify(shader)})`);
		attachShader(program, shader);
	};

	const bindAttribLocation = gl.bindAttribLocation.bind(gl);
	gl.bindAttribLocation = (
		program: WebGLProgram,
		index: number,
		name: string
	) => {
		out.log(
			`bindAttribLocation(${stringify(program)}, ${stringify(index)}, ${stringify(name)})`
		);
		bindAttribLocation(program, index, name);
	};

	const bindBuffer = gl.bindBuffer.bind(gl);
	gl.bindBuffer = (target: number, buffer: WebGLBuffer | null) => {
		out.log(`bindBuffer(${stringify(target, true)}, ${stringify(buffer)})`);
		bindBuffer(target, buffer);
	};

	const bindFramebuffer = gl.bindFramebuffer.bind(gl);
	gl.bindFramebuffer = (
		target: number,
		framebuffer: WebGLFramebuffer | null
	) => {
		out.log(
			`bindFramebuffer(${stringify(target, true)}, ${stringify(framebuffer)})`
		);
		bindFramebuffer(target, framebuffer);
	};

	const bindRenderbuffer = gl.bindRenderbuffer.bind(gl);
	gl.bindRenderbuffer = (
		target: number,
		renderbuffer: WebGLRenderbuffer | null
	) => {
		out.log(
			`bindRenderbuffer(${stringify(target, true)}, ${stringify(renderbuffer)})`
		);
		bindRenderbuffer(target, renderbuffer);
	};

	const bindTexture = gl.bindTexture.bind(gl);
	gl.bindTexture = (target: number, texture: WebGLTexture | null) => {
		out.log(`bindTexture(${stringify(target, true)}, ${stringify(texture)})`);
		bindTexture(target, texture);
	};

	const blendColor = gl.blendColor.bind(gl);
	gl.blendColor = (red: number, green: number, blue: number, alpha: number) => {
		out.log(
			`blendColor(${stringify(red)}, ${stringify(green)}, ${stringify(blue)}, ${stringify(alpha)})`
		);
		blendColor(red, green, blue, alpha);
	};

	const blendEquation = gl.blendEquation.bind(gl);
	gl.blendEquation = (mode: number) => {
		out.log(`blendEquation(${stringify(mode, true)})`);
		blendEquation(mode);
	};

	const blendEquationSeparate = gl.blendEquationSeparate.bind(gl);
	gl.blendEquationSeparate = (modeRgb: number, modeAlpha: number) => {
		out.log(
			`blendEquationSeparate(${stringify(modeRgb, true)} ${stringify(modeAlpha, true)})`
		);
		blendEquationSeparate(modeRgb, modeAlpha);
	};

	const blendFunc = gl.blendFunc.bind(gl);
	gl.blendFunc = (sFactor: number, dFactor: number) => {
		out.log(
			`blendFunc(${stringify(sFactor, true)}, ${stringify(dFactor, true)})`
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
			`blendFuncSeparate(${stringify(srcRgb, true)}, ${stringify(dstRgb, true)}, ${stringify(srcAlpha, true)}, ${stringify(dstAlpha, true)})`
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
			`bufferData(${stringify(target, true)}, ${stringify(sizeOrSrcData)}, ${stringify(usage, true)}, ${stringify(srcOffset)}, ${stringify(length)})`
		);

		bufferData(
			target,
			sizeOrSrcData as ArrayBufferView,
			usage,
			srcOffset as unknown as number,
			length
		);
	};

	const bufferSubData = gl.bufferSubData.bind(gl);
	gl.bufferSubData = (
		target: number,
		dstByteOffset: number,
		srcData: AllowSharedBufferSource | ArrayBufferView,
		srcOffset?: number,
		length?: number
	) => {
		out.log(
			`bufferSubData(${stringify(target, true)}, ${stringify(dstByteOffset)}, ${stringify(srcData)}, ${stringify(srcOffset)}, ${stringify(length)})`
		);
		bufferSubData(
			target,
			dstByteOffset,
			srcData as ArrayBufferView,
			srcOffset as unknown as number,
			length
		);
	};

	const checkFramebufferStatus = gl.checkFramebufferStatus.bind(gl);
	gl.checkFramebufferStatus = (target: number): number => {
		const result = checkFramebufferStatus(target);
		out.log(
			`${stringify(result)} = checkFramebufferStatus(${stringify(target, true)})`
		);
		return result;
	};

	const clear = gl.clear.bind(gl);
	gl.clear = (mask: number) => {
		out.log(
			`clear(${stringify(mask & COLOR_BUFFER_BIT)} | ${stringify(mask & DEPTH_BUFFER_BIT)} | ${stringify(mask & STENCIL_BUFFER_BIT)})`
		);
		clear(mask);
	};

	const clearColor = gl.clearColor.bind(gl);
	gl.clearColor = (red: number, green: number, blue: number, alpha: number) => {
		out.log(
			`clearColor(${stringify(red)}, ${stringify(green)}, ${stringify(blue)}, ${stringify(alpha)})`
		);
		clearColor(red, green, blue, alpha);
	};

	const clearDepth = gl.clearDepth.bind(gl);
	gl.clearDepth = (depth: number) => {
		out.log(`clearDepth(${stringify(depth)})`);
		clearDepth(depth);
	};

	const clearStencil = gl.clearStencil.bind(gl);
	gl.clearStencil = (s: number) => {
		out.log(`clearStencil(${stringify(s)})`);
		clearStencil(s);
	};

	const colorMask = gl.colorMask.bind(gl);
	gl.colorMask = (
		red: boolean,
		green: boolean,
		blue: boolean,
		alpha: boolean
	) => {
		out.log(
			`colorMask(${stringify(red)}, ${stringify(green)}, ${stringify(blue)}, ${stringify(alpha)})`
		);
		colorMask(red, green, blue, alpha);
	};

	const compileShader = gl.compileShader.bind(gl);
	gl.compileShader = (shader: WebGLShader) => {
		out.log(`compileShader(${stringify(shader)})`);
		compileShader(shader);
	};

	const compressedTexImage2D = gl.compressedTexImage2D.bind(gl);
	gl.compressedTexImage2D = (
		target: number,
		level: number,
		internalFormat: number,
		width: number,
		height: number,
		border: number,
		imageSizeOrSrcData: number | ArrayBufferView,
		offsetOrSrcOffset?: number,
		srcLengthOverride?: number
	) => {
		out.log(
			`compressedTexImage2D(${stringify(target, true)}, ${stringify(level)}, ${stringify(internalFormat, true)}, ${stringify(width)}, ${stringify(height)}, ${stringify(border)}, ${stringify(imageSizeOrSrcData)}, ${stringify(offsetOrSrcOffset)}, ${stringify(srcLengthOverride)})`
		);
		compressedTexImage2D(
			target,
			level,
			internalFormat,
			width,
			height,
			border,
			imageSizeOrSrcData as ArrayBufferView,
			offsetOrSrcOffset,
			srcLengthOverride
		);
	};

	const compressedTexSubImage2D = gl.compressedTexSubImage2D.bind(gl);
	gl.compressedTexSubImage2D = (
		target: number,
		level: number,
		xOffset: number,
		yOffset: number,
		width: number,
		height: number,
		format: number,
		imageSizeOrSrcData: number | ArrayBufferView,
		offsetOrSrcOffset?: number,
		srcLengthOverride?: number
	) => {
		out.log(
			`compressedTexSubImage2D(${stringify(target, true)}, ${stringify(level)}, ${stringify(xOffset)}, ${stringify(yOffset)}, ${stringify(width)}, ${stringify(height)}, ${stringify(format, true)}, ${stringify(imageSizeOrSrcData)}, ${stringify(offsetOrSrcOffset)}, ${stringify(srcLengthOverride)})`
		);
		compressedTexSubImage2D(
			target,
			level,
			xOffset,
			yOffset,
			width,
			height,
			format,
			imageSizeOrSrcData as ArrayBufferView,
			offsetOrSrcOffset,
			srcLengthOverride
		);
	};

	const copyTexImage2D = gl.copyTexImage2D.bind(gl);
	gl.copyTexImage2D = (
		target: number,
		level: number,
		internalFormat: number,
		x: number,
		y: number,
		width: number,
		height: number,
		border: number
	) => {
		out.log(
			`copyTexImage2D(${stringify(target, true)}, ${stringify(level)}, ${stringify(internalFormat, true)}, ${stringify(x)}, ${stringify(y)}, ${stringify(width)}, ${stringify(height)}, ${stringify(border)})`
		);
		copyTexImage2D(target, level, internalFormat, x, y, width, height, border);
	};

	const copyTexSubImage2D = gl.copyTexSubImage2D.bind(gl);
	gl.copyTexSubImage2D = (
		target: number,
		level: number,
		xOffset: number,
		yOffset: number,
		x: number,
		y: number,
		width: number,
		height: number
	) => {
		out.log(
			`copyTexSubImage2D(${stringify(target, true)}, ${stringify(level)}, ${stringify(xOffset)}, ${stringify(yOffset)}, ${stringify(x)}, ${stringify(y)}, ${stringify(width)}, ${stringify(height)})`
		);
		copyTexSubImage2D(target, level, xOffset, yOffset, x, y, width, height);
	};

	const createBuffer = gl.createBuffer.bind(gl);
	gl.createBuffer = (): WebGLBuffer => {
		const result = createBuffer();
		out.log(`${stringify(result)} = createBuffer()`);
		return result;
	};

	const createFramebuffer = gl.createFramebuffer.bind(gl);
	gl.createFramebuffer = (): WebGLFramebuffer => {
		const result = createFramebuffer();
		out.log(`${stringify(result)} = createFramebuffer()`);
		return result;
	};

	const createProgram = gl.createProgram.bind(gl);
	gl.createProgram = (): WebGLProgram => {
		const result = createProgram();
		out.log(`${stringify(result)} = createProgram()`);
		return result;
	};

	const createRenderbuffer = gl.createRenderbuffer.bind(gl);
	gl.createRenderbuffer = (): WebGLRenderbuffer => {
		const result = createRenderbuffer();
		out.log(`${stringify(result)} = createRenderbuffer()`);
		return result;
	};

	const createShader = gl.createShader.bind(gl);
	gl.createShader = (type: number): WebGLShader | null => {
		const result = createShader(type);
		out.log(`${stringify(result)} = createShader(${stringify(type, true)})`);
		return result;
	};

	const createTexture = gl.createTexture.bind(gl);
	gl.createTexture = (): WebGLTexture => {
		const result = createTexture();
		out.log(`${stringify(result)} = createTexture()`);
		return result;
	};

	const cullFace = gl.cullFace.bind(gl);
	gl.clearStencil = (mode: number) => {
		out.log(`cullFace(${stringify(mode)})`);
		cullFace(mode);
	};

	const deleteBuffer = gl.deleteBuffer.bind(gl);
	gl.deleteBuffer = (buffer: WebGLBuffer | null) => {
		out.log(`deleteBuffer(${stringify(buffer)})`);
		deleteBuffer(buffer);
	};

	const deleteFramebuffer = gl.deleteFramebuffer.bind(gl);
	gl.deleteFramebuffer = (framebuffer: WebGLFramebuffer | null) => {
		out.log(`deleteFramebuffer(${stringify(framebuffer)})`);
		deleteFramebuffer(framebuffer);
	};

	const deleteProgram = gl.deleteProgram.bind(gl);
	gl.deleteProgram = (program: WebGLProgram | null) => {
		out.log(`deleteProgram(${stringify(program)})`);
		deleteProgram(program);
	};

	const deleteRenderbuffer = gl.deleteRenderbuffer.bind(gl);
	gl.deleteRenderbuffer = (renderbuffer: WebGLRenderbuffer | null) => {
		out.log(`deleteRenderbuffer(${stringify(renderbuffer)})`);
		deleteRenderbuffer(renderbuffer);
	};

	const deleteShader = gl.deleteShader.bind(gl);
	gl.deleteShader = (shader: WebGLShader | null) => {
		out.log(`deleteShader(${stringify(shader)})`);
		deleteShader(shader);
	};

	const deleteTexture = gl.deleteTexture.bind(gl);
	gl.deleteTexture = (texture: WebGLTexture | null) => {
		out.log(`deleteTexture(${stringify(texture)})`);
		deleteTexture(texture);
	};

	const depthFunc = gl.depthFunc.bind(gl);
	gl.depthFunc = (func: number) => {
		out.log(`depthFunc(${stringify(func, true)})`);
		depthFunc(func);
	};

	const depthMask = gl.depthMask.bind(gl);
	gl.depthMask = (flag: boolean) => {
		out.log(`depthMask(${stringify(flag)})`);
		depthMask(flag);
	};

	const depthRange = gl.depthRange.bind(gl);
	gl.depthRange = (zNear: number, zFar: number) => {
		out.log(`depthRange(${stringify(zNear)}, ${stringify(zFar)})`);
		depthRange(zNear, zFar);
	};

	const detachShader = gl.detachShader.bind(gl);
	gl.detachShader = (program: WebGLProgram, shader: WebGLShader) => {
		out.log(`detachShader(${stringify(program)}, ${stringify(shader)})`);
		detachShader(program, shader);
	};

	const disable = gl.disable.bind(gl);
	gl.disable = (cap: number) => {
		out.log(`disable(${stringify(cap, true)})`);
		disable(cap);
	};

	const disableVertexAttribArray = gl.disableVertexAttribArray.bind(gl);
	gl.disableVertexAttribArray = (index: number) => {
		out.log(`disableVertexAttribArray(${stringify(index)})`);
		disableVertexAttribArray(index);
	};

	const drawArrays = gl.drawArrays.bind(gl);
	gl.drawArrays = (mode: number, first: number, count: number) => {
		out.log(
			`drawArrays(${stringify(mode, true)}, ${stringify(first)}, ${stringify(count)})`
		);
		drawArrays(mode, first, count);
	};

	const drawElements = gl.drawElements.bind(gl);
	gl.drawElements = (
		mode: number,
		count: number,
		type: number,
		offset: number
	) => {
		out.log(
			`drawElements(${stringify(mode, true)}, ${stringify(count)}, ${stringify(type, true)}, ${stringify(offset)})`
		);
		drawElements(mode, count, type, offset);
	};

	const enable = gl.enable.bind(gl);
	gl.enable = (cap: number) => {
		out.log(`enable(${stringify(cap, true)})`);
		enable(cap);
	};

	const enableVertexAttribArray = gl.enableVertexAttribArray.bind(gl);
	gl.enableVertexAttribArray = (index: number) => {
		out.log(`enableVertexAttribArray(${stringify(index)})`);
		enableVertexAttribArray(index);
	};

	const finish = gl.finish.bind(gl);
	gl.finish = () => {
		out.log(`finish()`);
		finish();
	};

	const flush = gl.flush.bind(gl);
	gl.flush = () => {
		out.log(`flush()`);
		flush();
	};

	const framebufferRenderbuffer = gl.framebufferRenderbuffer.bind(gl);
	gl.framebufferRenderbuffer = (
		target: number,
		attachment: number,
		renderbufferTarget: number,
		renderbuffer: WebGLRenderbuffer | null
	) => {
		out.log(
			`framebufferRenderbuffer(${stringify(target, true)}, ${stringify(attachment, true)}, ${stringify(renderbufferTarget, true)}, ${stringify(renderbuffer)})`
		);
		framebufferRenderbuffer(
			target,
			attachment,
			renderbufferTarget,
			renderbuffer
		);
	};

	const framebufferTexture2D = gl.framebufferTexture2D.bind(gl);
	gl.framebufferTexture2D = (
		target: number,
		attachment: number,
		texTarget: number,
		texture: WebGLTexture | null,
		level: number
	) => {
		out.log(
			`framebufferTexture2D(${stringify(target, true)}, ${stringify(attachment, true)}, ${stringify(texTarget, true)}, ${stringify(texture)}, ${stringify(level)})`
		);
		framebufferTexture2D(target, attachment, texTarget, texture, level);
	};

	const frontFace = gl.frontFace.bind(gl);
	gl.frontFace = (mode: number) => {
		out.log(`frontFace(${stringify(mode, true)})`);
		frontFace(mode);
	};

	const generateMipmap = gl.generateMipmap.bind(gl);
	gl.generateMipmap = (target: number) => {
		out.log(`generateMipmap(${stringify(target, true)})`);
		generateMipmap(target);
	};

	const getActiveAttrib = gl.getActiveAttrib.bind(gl);
	gl.getActiveAttrib = (
		program: WebGLProgram,
		index: number
	): WebGLActiveInfo | null => {
		const result = getActiveAttrib(program, index);
		out.log(
			`${stringify(result)} = getActiveAttrib(${stringify(program)}, ${stringify(index)})`
		);
		return result;
	};

	const getActiveUniform = gl.getActiveUniform.bind(gl);
	gl.getActiveUniform = (
		program: WebGLProgram,
		index: number
	): WebGLActiveInfo | null => {
		const result = getActiveUniform(program, index);
		out.log(
			`${stringify(result)} = getActiveUniform(${stringify(program)}, ${stringify(index)})`
		);
		return result;
	};

	const getAttachedShaders = gl.getAttachedShaders.bind(gl);
	gl.getAttachedShaders = (program: WebGLProgram): WebGLShader[] | null => {
		const result = getAttachedShaders(program);
		out.log(`${stringify(result)} = getAttachedShaders(${stringify(program)})`);
		return result;
	};

	const getAttribLocation = gl.getAttribLocation.bind(gl);
	gl.getAttribLocation = (program: WebGLProgram, name: string): number => {
		const result = getAttribLocation(program, name);
		out.log(
			`${stringify(result)} = getAttribLocation(${(stringify(program), stringify(name))})`
		);
		return result;
	};

	const getBufferParameter = gl.getBufferParameter.bind(gl);
	gl.getBufferParameter = (target: number, pName: number): unknown => {
		const result: unknown = getBufferParameter(target, pName);
		out.log(
			`${stringify(result)} = getBufferParameter(${stringify(target, true)}, ${stringify(pName, true)})`
		);
		return result;
	};

	const getContextAttributes = gl.getContextAttributes.bind(gl);
	gl.getContextAttributes = (): WebGLContextAttributes | null => {
		const result = getContextAttributes();
		out.log(`${stringify(result)} = getContextAttributes()`);
		return result;
	};

	const getError = gl.getError.bind(gl);
	gl.getError = (): number => {
		const result = getError();
		out.log(`${stringify(result, true)} = getError()`);
		return result;
	};

	// TODO: https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext
	// TODO: https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext
}
