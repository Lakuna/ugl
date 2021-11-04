import { clamp } from "./clamp";
import { Matrix } from "./Matrix";
import { sigma } from "./sigma";

/** A quantity with direction and magnitude. */
export class Vector extends Array<number> {
	/**
	 * Creates a vector from a rule.
	 * @param length - The length of the vector.
	 * @param rule - The rule to apply to each index of the vector.
	 * @returns A vector with values based on the supplied rule.
	 */
	static fromRule(length: number, rule: (number: number) => number): Vector {
		const data: number[] = [];
		for (let i = 0; i < length; i++) {
			data[i] = rule(i);
		}
		return new Vector(...data);
	}

	/**
	 * Creates a vector.
	 * @param data - The initial data to supply to the vector.
	 */
	constructor(...data: Array<number>) {
		super(...data);
	}

	/** The magnitude (size) of this vector. */
	get magnitude(): number {
		return Math.sqrt(sigma(0, this.length - 1, (n: number): number => this[n] ** 2));
	}

	/** The first value of this vector. */
	get x(): number {
		return this[0] ?? 0;
	}

	set x(value: number) {
		this[0] = value;
	}

	/** The second value of this vector. */
	get y(): number {
		return this[1] ?? 0;
	}

	set y(value: number) {
		this[1] = value;
	}

	/** The third value of this vector. */
	get z(): number {
		return this[2] ?? 0;
	}

	set z(value: number) {
		this[2] = value;
	}

	/** The fourth value of this vector. */
	get w(): number {
		return this[3] ?? 0;
	}

	set w(value: number) {
		this[3] = value;
	}

	/** A copy of this vector. */
	get copy(): Vector {
		return new Vector(...this);
	}

	/**
	 * Calculates the distance between two vectors.
	 * @param vector - The other vector.
	 * @returns The distance between this vector and `vector`.
	 */
	distance(vector: Vector): number {
		let output = 0;
		for (let i = 0; i < Math.max(this.length, vector.length); i++) {
			output += ((this[i] ?? 0) - (vector[i] ?? 0)) ** 2;
		}
		return Math.sqrt(output);
	}

	/**
	 * Calculates the dot product of two vectors.
	 * @param vector - The other vector.
	 * @returns The dot product of this vector and `vector`.
	 */
	dot(vector: Vector): number {
		return sigma(0, Math.max(this.length, vector.length) - 1, (n: number): number => (this[n] ?? 0) * (vector[n] ?? 0));
	}

	/**
	 * Calculates the angle between two vectors.
	 * @param vector - The other vector.
	 * @returns The angle between this vector and `vector`.
	 */
	angle(vector: Vector): number {
		return Math.acos(clamp(this.copy.normalize().dot(vector.copy.normalize()), -1, 1));
	}

	/**
	 * Fills this vector with the supplied data.
	 * @param data - The data to fill this vector with.
	 * @returns This vector.
	 */
	set(...data: Array<number>): Vector {
		while (this.length > 0) {
			this.pop();
		}

		for (const value of data) {
			this.push(value);
		}

		return this;
	}

	/**
	 * Multiplies this vector by a matrix to transform it.
	 * @param matrix - The transformation matrix.
	 * @returns This vector.
	 */
	transform(matrix: Matrix): Vector {
		return this.set(...matrix.copy.multiply(new Matrix(...this)));
	}

	/**
	 * Negates this vector.
	 * @returns This vector.
	 */
	negate(): Vector {
		return this.set(...Vector.fromRule(this.length, (i: number): number => -this[i]));
	}

	/**
	 * Inverts this vector.
	 * @returns This vector.
	 */
	invert(): Vector {
		return this.set(...Vector.fromRule(this.length, (i: number): number => 1 / this[i]));
	}

	/**
	 * Normalizes this vector.
	 * @returns This vector.
	 */
	normalize(): Vector {
		return this.set(...Vector.fromRule(this.length, (i: number): number => this[i] / this.magnitude));
	}

	/**
	 * Calculates the cross product of two vectors.
	 * @param vector - The other vector.
	 * @returns This vector.
	 */
	cross(vector: Vector): Vector {
		const length: number = Math.max(this.length, vector.length);
		return this.set(...Vector.fromRule(length, (i: number): number => {
			const loop = (i: number): number => i < length ? i : i - length;
			i = loop(i + 1);
			const j: number = loop(i + 1);
			return (this[i] ?? 0) * (vector[j] ?? 0) - (this[j] ?? 0) * (vector[i] ?? 0);
		}));
	}

	/**
	 * Multiply each value in this vector by a scalar.
	 * @param scalar - The scalar.
	 * @returns This vector.
	 */
	scale(scalar: number): Vector {
		return this.set(...Vector.fromRule(this.length, (i: number): number => this[i] * scalar));
	}

	/**
	 * Performs an operation between two vectors.
	 * @param vector - The other vector.
	 * @returns This vector.
	 */
	operate(vector: Vector, operation: (a: number, b: number) => number): Vector {
		return this.set(...Vector.fromRule(Math.max(this.length, vector.length),
			(i: number): number => operation((this[i] ?? 0), (vector[i] ?? 0))
		));
	}

	/**
	 * Adds two vectors.
	 * @param vector - The other vector.
	 * @returns This vector.
	 */
	add(vector: Vector): Vector {
		return this.operate(vector, (a: number, b: number): number => a + b); // Sum resultant
	}

	/**
	 * Subtracts a vector from this vector.
	 * @param vector - The other vector.
	 * @returns This vector.
	 */
	subtract(vector: Vector): Vector {
		return this.operate(vector, (a, b): number => a - b); // Difference resultant
	}

	/**
	 * Performs a linear interpolation betweem two vectors.
	 * @param vector - The other vector.
	 * @param t - The interpolation parameter. Should be between 0 and 1.
	 * @returns This vector.
	 */
	lerp(vector: Vector, t: number): Vector {
		return this.operate(vector, (a: number, b: number): number => a + t * (b - a));
	}
}