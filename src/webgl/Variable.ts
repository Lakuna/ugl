import { VariableLocation } from "./VariableLocation.js";
import { VariableType } from "./VariableType.js";
import { VariableValueType } from "./VariableValueType.js";
import { Attribute } from "./Attribute.js";
import { VariableValue } from "./VariableValue.js";
import { Program } from "./Program.js";
import { Matrix } from "../math/Matrix.js";
import { Texture } from "./Texture.js";

/** A variable in a WebGL shader program. */
export class Variable {
	#value?: VariableValue;

	/**
	 * Creates a variable.
	 * @param program - The program that this variable belongs to.
	 * @param type - The type of this variable.
	 * @param index - The index of the variable in the program.
	 */
	constructor(program: Program, type: VariableType, index: number) {
		this.program = program;
		this.variableType = type;

		const gl: WebGL2RenderingContext = program.gl;
		this.gl = gl;

		let activeInfo: WebGLActiveInfo | null;
		let location: VariableLocation | null;
		switch (type) {
			case VariableType.Attribute:
				activeInfo = gl.getActiveAttrib(program.program, index);
				location = gl.getAttribLocation(program.program, activeInfo?.name ?? "");
				break;
			case VariableType.Uniform:
				activeInfo = gl.getActiveUniform(program.program, index);
				location = gl.getUniformLocation(program.program, activeInfo?.name ?? "");
				break;
			case VariableType.Varying:
				activeInfo = gl.getTransformFeedbackVarying(program.program, index);
				location = null;
				break;
			default:
				throw new Error("Cannot create a variable with an unknown type.");
		}
		if (activeInfo) {
			this.activeInfo = activeInfo;
		} else {
			throw new Error("Could not determine the active information of a WebGL variable.");
		}
		if (location) {
			this.location = location;
		}
	}

	/** The program that this variable belongs to. */
	readonly program: Program;

	/** The type of this variable. */
	readonly variableType: VariableType;

	/** The rendering context of this variable. */
	readonly gl: WebGL2RenderingContext;

	/** The active information of this variable. */
	readonly activeInfo: WebGLActiveInfo;

	/** The location of this variable in its program. */
	readonly location?: VariableLocation;

	/** The name of this variable. */
	get name(): string {
		return this.activeInfo.name;
	}

	/** The size of this variable in bytes. */
	get size(): number {
		return this.activeInfo.size;
	}

	/** The type of information that this variable stores. */
	get type(): VariableValueType {
		return this.activeInfo.type;
	}

	/** The value assigned to this variable. */
	get value(): VariableValue | undefined {
		return this.#value;
	}

	set value(value: VariableValue | undefined) {
		if (!value) {
			return;
		}

		this.#value = value;

		// Declare variables outside of switch block.
		let attribute: Attribute;
		let attributeLocation: number;
		let data: Matrix[]
		let size: number;
		let count: number;
		let stride: number;
		let uniform: VariableValue;
		let uniformLocation: WebGLUniformLocation;
		let textureUnit: number | undefined;
		let textures: Texture[];
		let textureUnits: Int32Array;
		let texture: Texture;

		switch (this.variableType) {
			case (VariableType.Attribute):
				attribute = value as Attribute;
				attributeLocation = this.location as number;

				attribute.buffer.bind();
				this.gl.enableVertexAttribArray(attributeLocation);
				switch (this.type) {
					case VariableValueType.FLOAT:
					case VariableValueType.FLOAT_VEC2:
					case VariableValueType.FLOAT_VEC3:
					case VariableValueType.FLOAT_VEC4:
						this.gl.vertexAttribPointer(
							attributeLocation,
							attribute.size,
							attribute.type,
							attribute.normalized,
							attribute.stride,
							attribute.offset);
						break;
					case VariableValueType.INT:
					case VariableValueType.INT_VEC2:
					case VariableValueType.INT_VEC3:
					case VariableValueType.INT_VEC4:
					case VariableValueType.UNSIGNED_INT:
					case VariableValueType.UNSIGNED_INT_VEC2:
					case VariableValueType.UNSIGNED_INT_VEC3:
					case VariableValueType.UNSIGNED_INT_VEC4:
					case VariableValueType.BOOL:
					case VariableValueType.BOOL_VEC2:
					case VariableValueType.BOOL_VEC3:
					case VariableValueType.BOOL_VEC4:
						this.gl.vertexAttribIPointer(
							attributeLocation,
							attribute.size,
							attribute.type,
							attribute.stride,
							attribute.offset);
						break;
					case VariableValueType.FLOAT_MAT2:
					case VariableValueType.FLOAT_MAT3:
					case VariableValueType.FLOAT_MAT4:
						data = attribute.buffer.data as Matrix[];
						size = data[0]?.length ?? 0;
						count = data[0]?.width ?? 1;
						stride = size * attribute.size ?? 0;
						for (let i = 0; i < count; i++) {
							this.gl.enableVertexAttribArray(attributeLocation + i);
							this.gl.vertexAttribPointer(
								attributeLocation + i,
								attribute.size / count,
								attribute.type,
								attribute.normalized,
								stride,
								attribute.offset + (stride / count) * i);
						}
						break;
					default:
						throw new Error("Unknown attribute type.");
				}
				break;
			case (VariableType.Uniform):
				uniform = value;
				uniformLocation = this.location as WebGLUniformLocation;

				switch (this.type) {
					case VariableValueType.FLOAT:
						if (Array.isArray(uniform)) {
							this.gl.uniform1fv(this.location as WebGLUniformLocation, value as number[])
						} else {
							this.gl.uniform1f(this.location as WebGLUniformLocation, value as number);
						}
						break;
					case VariableValueType.FLOAT_VEC2:
						this.gl.uniform2fv(this.location as WebGLUniformLocation, value as number[]);
						break;
					case VariableValueType.FLOAT_VEC3:
						this.gl.uniform3fv(this.location as WebGLUniformLocation, value as number[]);
						break;
					case VariableValueType.FLOAT_VEC4:
						this.gl.uniform4fv(this.location as WebGLUniformLocation, value as number[]);
						break;
					case VariableValueType.SAMPLER_2D:
					case VariableValueType.SAMPLER_3D:
					case VariableValueType.SAMPLER_CUBE:
					case VariableValueType.SAMPLER_2D_SHADOW:
					case VariableValueType.SAMPLER_2D_ARRAY:
					case VariableValueType.SAMPLER_2D_ARRAY_SHADOW:
					case VariableValueType.SAMPLER_CUBE_SHADOW:
					case VariableValueType.INT_SAMPLER_2D:
					case VariableValueType.INT_SAMPLER_3D:
					case VariableValueType.INT_SAMPLER_CUBE:
					case VariableValueType.INT_SAMPLER_2D_ARRAY:
						textureUnit = this.program.textureUnits.get(this) as number;

						if (Array.isArray(value)) {
							textures = value as Texture[];

							textureUnits = new Int32Array(textures.length);
							for (let i = 0; i < textures.length; i++) {
								textureUnits[i] = textureUnit + i;
							}

							this.gl.uniform1iv(uniformLocation, textureUnits);

							for (const [i, texture] of textures.entries()) {
								texture.update(textureUnits[i]);
							}
						} else {
							texture = value as Texture;
							this.gl.uniform1i(uniformLocation, textureUnit);
							texture.update(textureUnit);
						}
						break;
					case VariableValueType.BOOL:
					case VariableValueType.INT:
						if (Array.isArray(value)) {
							this.gl.uniform1iv(uniformLocation, value as number[]);
						} else {
							this.gl.uniform1i(uniformLocation, value as number);
						}
						break;
					case VariableValueType.BOOL_VEC2:
					case VariableValueType.INT_VEC2:
						this.gl.uniform2iv(uniformLocation, value as number[]);
						break;
					case VariableValueType.BOOL_VEC3:
					case VariableValueType.INT_VEC3:
						this.gl.uniform3iv(uniformLocation, value as number[]);
						break;
					case VariableValueType.BOOL_VEC4:
					case VariableValueType.INT_VEC4:
						this.gl.uniform4iv(uniformLocation, value as number[]);
						break;
					case VariableValueType.UNSIGNED_INT:
						if (Array.isArray(value)) {
							this.gl.uniform1uiv(uniformLocation, value as number[]);
						} else {
							this.gl.uniform1ui(uniformLocation, value as number);
						}
						break;
					case VariableValueType.UNSIGNED_INT_VEC2:
						this.gl.uniform2uiv(uniformLocation, value as number[]);
						break;
					case VariableValueType.UNSIGNED_INT_VEC3:
						this.gl.uniform3uiv(uniformLocation, value as number[]);
						break;
					case VariableValueType.UNSIGNED_INT_VEC4:
						this.gl.uniform4uiv(uniformLocation, value as number[]);
						break;
					case VariableValueType.FLOAT_MAT2:
						this.gl.uniformMatrix2fv(uniformLocation, false, value as number[]);
						break;
					case VariableValueType.FLOAT_MAT3:
						this.gl.uniformMatrix3fv(uniformLocation, false, value as number[]);
						break;
					case VariableValueType.FLOAT_MAT4:
						this.gl.uniformMatrix4fv(uniformLocation, false, value as number[]);
						break;
					case VariableValueType.FLOAT_MAT2x3:
						this.gl.uniformMatrix2x3fv(uniformLocation, false, value as number[]);
						break;
					case VariableValueType.FLOAT_MAT2x4:
						this.gl.uniformMatrix3x2fv(uniformLocation, false, value as number[]);
						break;
					case VariableValueType.FLOAT_MAT3x2:
						this.gl.uniformMatrix3x2fv(uniformLocation, false, value as number[]);
						break;
					case VariableValueType.FLOAT_MAT3x4:
						this.gl.uniformMatrix3x4fv(uniformLocation, false, value as number[]);
						break;
					case VariableValueType.FLOAT_MAT4x2:
						this.gl.uniformMatrix4x2fv(uniformLocation, false, value as number[]);
						break;
					case VariableValueType.FLOAT_MAT4x3:
						this.gl.uniformMatrix4x3fv(uniformLocation, false, value as number[]);
						break;
					default:
						throw new Error("Unknown or unsettable variable type.");
				}
				break;
			default:
				throw new Error("Unknown or unsettable variable type.");
		}
	}
}