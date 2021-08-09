import { FLOAT, FLOAT_VEC2, FLOAT_VEC3, FLOAT_VEC4, INT, INT_VEC2, INT_VEC3, INT_VEC4, UNSIGNED_INT, UNSIGNED_INT_VEC2,
	UNSIGNED_INT_VEC3, UNSIGNED_INT_VEC4, BOOL, BOOL_VEC2, BOOL_VEC3, BOOL_VEC4, FLOAT_MAT2, FLOAT_MAT3, FLOAT_MAT4,
	SAMPLER_2D, SAMPLER_3D, SAMPLER_CUBE, SAMPLER_2D_SHADOW, SAMPLER_2D_ARRAY, SAMPLER_2D_ARRAY_SHADOW, SAMPLER_CUBE_SHADOW,
	INT_SAMPLER_2D, INT_SAMPLER_3D, INT_SAMPLER_CUBE, INT_SAMPLER_2D_ARRAY, UNSIGNED_INT_SAMPLER_2D, UNSIGNED_INT_SAMPLER_3D,
	UNSIGNED_INT_SAMPLER_CUBE, UNSIGNED_INT_SAMPLER_2D_ARRAY, TEXTURE0, FLOAT_MAT2x3, FLOAT_MAT2x4, FLOAT_MAT3x2, FLOAT_MAT3x4,
	FLOAT_MAT4x2, FLOAT_MAT4x3 } from "./constants.js";

export class Variable {
	static types = {
		ATTRIBUTE: Symbol("Attribute"),
		UNIFORM: Symbol("Uniform"),
		VARYING: Symbol("Varying")
	};

	#value;

	constructor(program, type, index) {
		const gl = program.gl;
		const activeInfo =
			type == Variable.types.ATTRIBUTE ? gl.getActiveAttrib(program.program, index) : (
			type == Variable.types.UNIFORM ? gl.getActiveUniform(program.program, index) : (
			type == Variable.types.VARYING ? gl.getTransformFeedbackVarying(program.program, index) :
			null));

		Object.defineProperties(this, {
			program: { value: program },
			variableType: { value: type },
			gl: { value: gl },
			activeInfo: { value: activeInfo },
			location: {
				value:
					type == Variable.types.ATTRIBUTE ? gl.getAttribLocation(program.program, activeInfo.name) : (
					type == Variable.types.UNIFORM ? gl.getUniformLocation(program.program, activeInfo.name) :
					null)
			}
		});
	}

	get name() {
		return this.activeInfo.name;
	}

	get size() {
		return this.activeInfo.size;
	}

	get type() {
		return this.activeInfo.type;
	}

	get value() {
		return this.#value;
	}

	set value(value) {
		this.#value = value;

		// Declare some variables which might be used later here, since ESLint disapproves of declaring variables within cases.
		let first, size, count, stride, texture;

		switch (this.variableType) {
			case (Variable.types.ATTRIBUTE):
				value.buffer.bind();
				this.gl.enableVertexAttribArray(this.location);
				switch (this.type) {
					case FLOAT:
					case FLOAT_VEC2:
					case FLOAT_VEC3:
					case FLOAT_VEC4:					this.gl.vertexAttribPointer(this.location, value.size, value.type, value.normalized, value.stride, value.offset); break;
					case INT:
					case INT_VEC2:
					case INT_VEC3:
					case INT_VEC4:
					case UNSIGNED_INT:
					case UNSIGNED_INT_VEC2:
					case UNSIGNED_INT_VEC3:
					case UNSIGNED_INT_VEC4:	
					case BOOL:
					case BOOL_VEC2:
					case BOOL_VEC3:
					case BOOL_VEC4:						this.gl.vertexAttribIPointer(this.location, value.size, value.type, value.normalized, value.stride, value.offset); break;
					case FLOAT_MAT2:
					case FLOAT_MAT3:
					case FLOAT_MAT4:
						first = value.buffer.data?.[0];
						size = first?.length ?? 0;
						count = first?.width ?? 0;
						stride = size * value.size ?? 0;
						for (let i = 0; i < count; i++) {
							this.gl.enableVertexAttribArray(this.location + i);
							this.gl.vertexAttribPointer(this.location + i, value.size / count, value.type, value.normalized, stride, value.offset + (stride / count) * i);
						}
						break;
					default:
						throw new Error("Unknown attribute type.");
				}
				break;
			case (Variable.types.UNIFORM):
				switch (this.type) {
					case FLOAT:							value.length ? this.gl.uniform1fv(this.location, value) : this.gl.uniform1f(this.location, value); break;
					case FLOAT_VEC2:					this.gl.uniform2fv(this.location, value); break;
					case FLOAT_VEC3:					this.gl.uniform3fv(this.location, value); break;
					case FLOAT_VEC4:					this.gl.uniform4fv(this.location, value); break;
					case SAMPLER_2D:
					case SAMPLER_3D:
					case SAMPLER_CUBE:
					case SAMPLER_2D_SHADOW:
					case SAMPLER_2D_ARRAY:
					case SAMPLER_2D_ARRAY_SHADOW:
					case SAMPLER_CUBE_SHADOW:
					case INT_SAMPLER_2D:
					case INT_SAMPLER_3D:
					case INT_SAMPLER_CUBE:
					case INT_SAMPLER_2D_ARRAY:
					case UNSIGNED_INT_SAMPLER_2D:
					case UNSIGNED_INT_SAMPLER_3D:
					case UNSIGNED_INT_SAMPLER_CUBE:
					case UNSIGNED_INT_SAMPLER_2D_ARRAY:
						texture = value;
						value = this.program.textureUnits.get(this); // Set the value to the texture unit.

						if (value.length) {
							const units = new Int32Array(value.length);
							for (let i = 0; i < value.length; i++) {
								units[i] = value + i;
							}

							this.gl.uniform1iv(this.location, units);

							for (const [i, texture] of texture.entries()) {
								texture.update(TEXTURE0 + units[i]);
							}
						} else {
							this.gl.uniform1i(this.location, value);
							texture.update(value);
						}
						break;
					case BOOL:
					case INT:							value.length ? this.gl.uniform1iv(this.location, value) : this.gl.uniform1i(this.location, value); break;
					case BOOL_VEC2:
					case INT_VEC2:						this.gl.uniform2iv(this.location, value); break;
					case BOOL_VEC3:
					case INT_VEC3:						this.gl.uniform3iv(this.location, value); break;
					case BOOL_VEC4:
					case INT_VEC4:						this.gl.uniform4iv(this.location, value); break;
					case UNSIGNED_INT:					value.length ? this.gl.uniform1uiv(this.location, value) : this.gl.uniform1ui(this.location, value); break;
					case UNSIGNED_INT_VEC2:				this.gl.uniform2uiv(this.location, value); break;
					case UNSIGNED_INT_VEC3:				this.gl.uniform3uiv(this.location, value); break;
					case UNSIGNED_INT_VEC4:				this.gl.uniform4uiv(this.location, value); break;
					case FLOAT_MAT2:					this.gl.uniformMatrix2fv(this.location, false, value); break;
					case FLOAT_MAT3:					this.gl.uniformMatrix3fv(this.location, false, value); break;
					case FLOAT_MAT4:					this.gl.uniformMatrix4fv(this.location, false, value); break;
					case FLOAT_MAT2x3:					this.gl.uniformMatrix2x3fv(this.location, false, value); break;
					case FLOAT_MAT2x4:					this.gl.uniformMatrix2x4fv(this.location, false, value); break;
					case FLOAT_MAT3x2:					this.gl.uniformMatrix3x2fv(this.location, false, value); break;
					case FLOAT_MAT3x4:					this.gl.uniformMatrix3x4fv(this.location, false, value); break;
					case FLOAT_MAT4x2:					this.gl.uniformMatrix4x2fv(this.location, false, value); break;
					case FLOAT_MAT4x3:					this.gl.uniformMatrix4x3fv(this.location, false, value); break;
					default:
						throw new Error("Unknown uniform type.");
				}
				break;
			default:
				throw new Error("Unknown or unsettable variable type.");
		}
	}
}