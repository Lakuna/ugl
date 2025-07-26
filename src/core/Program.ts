import {
	ACTIVE_ATTRIBUTES,
	ACTIVE_UNIFORMS,
	ATTACHED_SHADERS,
	CURRENT_PROGRAM,
	DELETE_STATUS,
	INTERLEAVED_ATTRIBS,
	LINK_STATUS,
	SEPARATE_ATTRIBS,
	TRANSFORM_FEEDBACK_VARYINGS,
	VALIDATE_STATUS
} from "../constants/constants.js";
import type Attribute from "./variables/attributes/Attribute.js";
import Context from "./Context.js";
import ContextDependent from "./internal/ContextDependent.js";
import ProgramLinkError from "../utility/ProgramLinkError.js";
import Shader from "./Shader.js";
import ShaderType from "../constants/ShaderType.js";
import type Uniform from "./variables/uniforms/Uniform.js";
import Varying from "./variables/Varying.js";
import createAttribute from "./variables/attributes/createAttribute.js";
import createUniform from "./variables/uniforms/createUniform.js";

/**
 * A WebGL2 shader program.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLProgram | WebGLProgram}
 * @public
 */
export default class Program extends ContextDependent {
	/**
	 * The currently-bound program cache.
	 * @internal
	 */
	private static bindingsCache = new Map<
		WebGL2RenderingContext,
		WebGLProgram | null
	>();

	/**
	 * Get the currently-bound program.
	 * @param context - The rendering context.
	 * @internal
	 */
	public static getBound(context: Context): WebGLProgram | null {
		// Get the bound program.
		let boundProgram = Program.bindingsCache.get(context.gl);
		if (typeof boundProgram === "undefined") {
			boundProgram = context.doPrefillCache
				? null
				: (context.gl.getParameter(CURRENT_PROGRAM) as WebGLProgram | null);
			Program.bindingsCache.set(context.gl, boundProgram);
		}

		return boundProgram;
	}

	/**
	 * Bind a program.
	 * @param context - The rendering context.
	 * @param program - The program.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/useProgram | useProgram}
	 * @internal
	 */
	public static bindGl(context: Context, program: WebGLProgram | null): void {
		// Do nothing if the binding is already correct.
		if (Program.getBound(context) === program) {
			return;
		}

		// Bind the program.
		context.gl.useProgram(program);
		Program.bindingsCache.set(context.gl, program);
	}

	/**
	 * Unbind the program that is bound.
	 * @param context - The rendering context.
	 * @param program - The program to unbind, or `undefined` to unbind any program.
	 * @internal
	 */
	public static unbindGl(context: Context, program?: WebGLProgram): void {
		// Do nothing if the program is already unbound.
		if (program && Program.getBound(context) !== program) {
			return;
		}

		// Unbind the VAO.
		Program.bindGl(context, null);
	}

	/**
	 * Create a shader program from the given shader source code.
	 * @param context - The rendering context.
	 * @param vss - The vertex shader's source code.
	 * @param fss - The fragment shader's source code.
	 * @param attributeLocations - A map of attribute names to their desired locations.
	 * @param feedbackVaryings - The names of the varyings that should be tracked for transform feedback.
	 * @param feedbackInterleaved - Whether to use interleaved attributes (as opposed to separate attributes) when capturing transform feedback varyings.
	 * @throws {@link ProgramLinkError} if the shaders have different contexts, if either shader is not the correct type, or if there is an issue when linking the shader program.
	 * @throws {@link UnsupportedOperationError} if a shader program cannot be created.
	 * @throws {@link UnsupportedOperationError} if a shader cannot be created.
	 * @throws {@link ShaderCompileError} if a shader fails to compile.
	 * @returns The shader program.
	 */
	public static fromSource(
		context: Context,
		vss: string,
		fss: string,
		attributeLocations?: ReadonlyMap<string, number>,
		feedbackVaryings?: Iterable<string>,
		feedbackInterleaved?: boolean
	): Program {
		const vs = new Shader(context, ShaderType.VERTEX_SHADER, vss);
		const fs = new Shader(context, ShaderType.FRAGMENT_SHADER, fss);

		const out = new Program(
			context,
			[vs, fs],
			attributeLocations,
			feedbackVaryings,
			feedbackInterleaved
		);

		vs.delete();
		fs.delete();

		return out;
	}

	/**
	 * Create a shader program.
	 * @param context - The rendering context.
	 * @param shaders - The shaders to attach to the shader program. If a valid set of shaders is given, the program will be linked automatically.
	 * @param attributeLocations - A map of attribute names to their desired locations.
	 * @param feedbackVaryings - The names of the varyings that should be tracked for transform feedback.
	 * @param feedbackInterleaved - Whether to use interleaved attributes (as opposed to separate attributes) when capturing transform feedback varyings.
	 * @throws {@link ProgramLinkError} if there is an issue when linking the shader program.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createProgram | createProgram}
	 */
	public constructor(
		context: Context,
		shaders?: readonly Shader[],
		attributeLocations?: ReadonlyMap<string, number>,
		feedbackVaryings?: Iterable<string>,
		feedbackInterleaved = false
	) {
		super(context);

		// Create the shader program.
		this.internal = this.gl.createProgram();

		// Attach the given shaders.
		if (!shaders) {
			return;
		}

		for (const shader of shaders) {
			this.attachShader(shader);
		}

		// Link the shader program only if two shaders of different types were given.
		if (
			this.attachedShadersCount !== 2 ||
			this.attachedShaders[0]?.type === this.attachedShaders[1]?.type
		) {
			return;
		}

		// Bind the attributes to their specified locations, if any.
		if (attributeLocations) {
			for (const [name, location] of attributeLocations) {
				this.bindAttributeLocation(location, name);
			}
		}

		// Specify the transform feedback varying names, if any.
		if (feedbackVaryings) {
			this.setTransformFeedbackVaryings(feedbackVaryings, feedbackInterleaved);
		}

		// Link the shader program.
		this.link();
	}

	/**
	 * The API interface of this shader program.
	 * @internal
	 */
	public readonly internal: WebGLProgram;

	/**
	 * The shaders that are attached to this shader program.
	 * @internal
	 */
	private attachedShadersCache?: Shader[];

	/**
	 * The shaders that are attached to this shader program.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getAttachedShaders | getAttachedShaders}
	 */
	public get attachedShaders(): readonly Shader[] {
		return (this.attachedShadersCache ??= this.context.doPrefillCache
			? []
			: (this.gl.getAttachedShaders(this.internal) ?? []).map((shader) =>
					Shader.get(this.context, shader)
				));
	}

	/**
	 * The number of shaders that are attached to this shader program.
	 * @internal
	 */
	private attachedShadersCountCache?: number;

	/** The number of shaders that are attached to this shader program. */
	public get attachedShadersCount(): number {
		return (this.attachedShadersCountCache ??=
			this.attachedShadersCache?.length ??
			(this.context.doPrefillCache
				? 0
				: (this.gl.getProgramParameter(
						this.internal,
						ATTACHED_SHADERS
					) as number)));
	}

	/**
	 * Attach a shader to this shader program.
	 * @param shader - The shader.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/attachShader | attachShader}
	 */
	public attachShader(shader: Shader): void {
		if (this.attachedShaders.includes(shader)) {
			return;
		}

		this.gl.attachShader(this.internal, shader.internal);
		(this.attachedShaders as Shader[]).push(shader);
		if (typeof this.attachedShadersCountCache === "number") {
			this.attachedShadersCountCache++;
		}
	}

	/**
	 * Detach the given shader from this shader program.
	 * @param shader - The shader to detach.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/detachShader | detachShader}
	 */
	public detachShader(shader: Shader): void {
		if (!this.attachedShaders.includes(shader)) {
			return;
		}

		this.gl.detachShader(this.internal, shader.internal);
		(this.attachedShaders as Shader[]).splice(
			this.attachedShaders.indexOf(shader),
			1
		);
		if (typeof this.attachedShadersCountCache === "number") {
			this.attachedShadersCountCache--;
		}
	}

	/**
	 * The number of active attribute variables in this shader program.
	 * @internal
	 */
	private activeAttributesCache?: number;

	/** The number of active attribute variables in this shader program. */
	public get activeAttributes(): number {
		return (this.activeAttributesCache ??=
			this.attributesCache?.size ??
			(this.gl.getProgramParameter(
				this.internal,
				ACTIVE_ATTRIBUTES
			) as number));
	}

	/**
	 * The attributes in this shader program.
	 * @internal
	 */
	private attributesCache?: Map<string, Attribute>;

	/**
	 * The attributes in this shader program.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getActiveAttrib | getActiveAttrib}
	 */
	public get attributes(): ReadonlyMap<string, Attribute> {
		if (!this.attributesCache) {
			const { activeAttributes } = this;
			this.attributesCache = new Map();
			for (let i = 0; i < activeAttributes; i++) {
				const attribute = createAttribute(this, i);
				this.attributesCache.set(attribute.name, attribute);
			}
		}

		return this.attributesCache;
	}

	/**
	 * Bind a generic vertex index to an attribute variable. Doing this after linking this program has no effect.
	 * @param index - The index of the generic vertex to bind.
	 * @param name - The name of the variable to bind to the generic vertex index.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bindAttribLocation | bindAttribLocation}
	 */
	public bindAttributeLocation(index: number, name: string): void {
		this.gl.bindAttribLocation(this.internal, index, name);
	}

	/**
	 * The number of active uniform variables in this shader program.
	 * @internal
	 */
	private activeUniformsCache?: number;

	/** The number of active uniform variables in this shader program. */
	public get activeUniforms(): number {
		return (this.activeUniformsCache ??=
			this.uniformsCache?.size ??
			(this.gl.getProgramParameter(this.internal, ACTIVE_UNIFORMS) as number));
	}

	/**
	 * The uniforms in this shader program.
	 * @internal
	 */
	private uniformsCache?: Map<string, Uniform>;

	/**
	 * The uniforms in this shader program.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getActiveAttrib | getActiveAttrib}
	 */
	public get uniforms(): ReadonlyMap<string, Uniform> {
		if (!this.uniformsCache) {
			const { activeUniforms } = this;
			this.uniformsCache = new Map();
			for (let i = 0; i < activeUniforms; i++) {
				const uniform = createUniform(this, i);
				this.uniformsCache.set(uniform.name, uniform);
			}
		}

		return this.uniformsCache;
	}

	/**
	 * The number of transform feedback varying variables in this shader program.
	 * @internal
	 */
	private transformFeedbackVaryingsCache?: number;

	/** The number of transform feedback varying variables in this shader program. */
	public get transformFeedbackVaryings(): number {
		return (this.transformFeedbackVaryingsCache ??=
			this.varyingsCache?.size ??
			(this.gl.getProgramParameter(
				this.internal,
				TRANSFORM_FEEDBACK_VARYINGS
			) as number));
	}

	/**
	 * The transform feedback varyings in this shader program.
	 * @internal
	 */
	private varyingsCache?: Map<string, Varying>;

	/**
	 * The transform feedback varyings in this shader program.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getActiveAttrib | getActiveAttrib}
	 */
	public get varyings(): ReadonlyMap<string, Varying> {
		if (!this.varyingsCache) {
			this.varyingsCache = new Map();
			for (let i = 0; i < this.transformFeedbackVaryings; i++) {
				const varying = new Varying(this, i);
				this.varyingsCache.set(varying.name, varying);
			}
		}

		return this.varyingsCache;
	}

	/**
	 * Specify the values to record in transform feedback buffers. Doing this after linking this program has no effect.
	 * @param varyings - The names of the varyings to use for transform feedback.
	 * @param interleaved - Whether to use interleaved attributes (as opposed to separate attributes) when capturing transform feedback varyings.
	 */
	public setTransformFeedbackVaryings(
		varyings: Iterable<string>,
		interleaved: boolean
	): void {
		this.gl.transformFeedbackVaryings(
			this.internal,
			varyings,
			interleaved ? INTERLEAVED_ATTRIBS : SEPARATE_ATTRIBS
		);
		this.transformFeedbackVaryingsCache = [...varyings].length;
	}

	/** The linking status of this shader program. */
	public get linkStatus(): boolean {
		return this.gl.getProgramParameter(this.internal, LINK_STATUS) as boolean;
	}

	/**
	 * Link this shader program.
	 * @throws {@link ProgramLinkError} if there is an issue when linking the shader program.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/linkProgram | linkProgram}
	 */
	public link(): void {
		this.gl.linkProgram(this.internal);

		// Clear variable caches. Don't clear number of transform feedback varyings because that is set manually, but do still clear varyings because their metadata may change.
		delete this.activeAttributesCache;
		delete this.activeUniformsCache;
		delete this.attributesCache;
		delete this.uniformsCache;
		delete this.varyingsCache;

		if (!this.linkStatus) {
			throw new ProgramLinkError(this.infoLog ?? void 0);
		}
	}

	/**
	 * The information log of this shader program.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getProgramInfoLog | getProgramInfoLog}
	 */
	public get infoLog(): string | null {
		return this.gl.getProgramInfoLog(this.internal);
	}

	/** The deletion status of this shader program. */
	public get deleteStatus(): boolean {
		return this.gl.getProgramParameter(this.internal, DELETE_STATUS) as boolean;
	}

	/**
	 * Delete this shader program.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/deleteProgram | deleteProgram}
	 */
	public delete(): void {
		this.gl.deleteProgram(this.internal);
	}

	/** The validation status of this shader program. */
	public get validateStatus(): boolean {
		return this.gl.getProgramParameter(
			this.internal,
			VALIDATE_STATUS
		) as boolean;
	}

	/**
	 * Bind this program.
	 * @internal
	 */
	public bind(): void {
		Program.bindGl(this.context, this.internal);
	}

	/**
	 * Unbind this program.
	 * @internal
	 */
	public unbind(): void {
		Program.unbindGl(this.context, this.internal);
	}
}
