import { sigma } from "./sigma.js";
import { clamp } from "./clamp.js";
import { Matrix } from "./Matrix.js";

/** Class representing a vector. */
export class Vector extends Array {
	/**
	 * Create a vector from a rule.
	 * @param {number} length - The length of the resulting vector.
	 * @param {function<number>} rule - The rule to follow to calculate values in the vector.
	 * @return {Vector} A vector which conforms to the supplied rule.
	 */
	static fromRule(length, rule) {
		let data = [];
		for (let i = 0; i < length; i++) { data[i] = rule(i); }
		return new Vector(...data);
	}

	/**
	 * The length of the vector.
	 * @type {number}
	 */
	get magnitude() {
		return Math.sqrt(sigma(0, this.length - 1, (n) => this[n] ** 2));
	}

	/**
	 * The first value of the vector.
	 * @type {number}
	 */
	get x() {
		return this[0] ?? 0;
	}

	/**
	 * The first value of the vector.
	 * @type {number}
	 */
	set x(value) {
		/** @ignore */ this[0] = value;
	}

	/**
	 * The second value of the vector.
	 * @type {number}
	 */
	get y() {
		return this[1] ?? 0;
	}

	/**
	 * The second value of the vector.
	 * @type {number}
	 */
	set y(value) {
		/** @ignore */ this[1] = value;
	}

	/**
	 * The third value of the vector.
	 * @type {number}
	 */
	get z() {
		return this[2] ?? 0;
	}

	/**
	 * The third value of the vector.
	 * @type {number}
	 */
	set z(value) {
		/** @ignore */ this[2] = value;
	}

	/**
	 * The fourth value of the vector.
	 * @type {number}
	 */
	get w() {
		return this[3] ?? 0;
	}

	/**
	 * The fourth value of the vector.
	 * @type {number}
	 */
	set w(value) {
		/** @ignore */ this[3] = value;
	}

	/**
	 * Calculate the distance between two vectors.
	 * @param {Vector} vector - The other vector.
	 * @return {number} The distance between this and another vector.
	 */
	distance(vector) {
		let output = 0;
		for (let i = 0; i < Math.max(this.length, vector.length); i++) {
			output += ((this[i] ?? 0) - (vector[i] ?? 0)) ** 2;
		}
		return Math.sqrt(output);
	}

	/**
	 * Calculate the dot product of two vectors.
	 * @param {Vector} vector - The other vector.
	 * @return {number} The dot product of the vectors.
	 * @see https://en.wikipedia.org/wiki/Dot_product
	 */
	dot(vector) {
		return sigma(0, Math.max(this.length, vector.length) - 1, (n) => (this[n] ?? 0) * (vector[n] ?? 0));
	}

	/**
	 * Calculate the angle between two vectors.
	 * @param {Vector} vector - The other vector.
	 * @return {number} The angle between the vectors.
	 */
	angle(vector) {
		return Math.acos(clamp(new Vector(...this).normalize().dot(new Vector(...vector).normalize()), -1, 1));
	}

	/**
	 * Fill this vector with the supplied data.
	 * @param {...number} data - The data to fill the vector with.
	 * @return {Vector} Self.
	 */
	set(...data) {
		while (this.length > 0) { this.pop(); }
		for (const value of data) { this.push(value); }
		return this;
	}

	/**
	 * Multiply this vector by a matrix to transform it.
	 * @param {Matrix} matrix - The transformation matrix.
	 * @return {Vector} Self.
	 */
	transform(matrix) {
		return this.set(...new Matrix(...matrix).multiply(this));
	}

	/**
	 * Negate this vector.
	 * @return {Vector} Self.
	 */
	negate() {
		return this.set(...Vector.fromRule(this.length, (i) => -this[i]));
	}

	/**
	 * Invert this vector.
	 * @return {Vector} Self.
	 */
	invert() {
		return this.set(...Vector.fromRule(this.length, (i) => 1 / this[i]));
	}

	/**
	 * Normalize this vector.
	 * @return {Vector} Self.
	 */
	normalize() {
		return this.set(...Vector.fromRule(this.length, (i) => this[i] / this.magnitude));
	}

	/**
	 * Cross this vector with another.
	 * @param {Vector} vector - The other vector.
	 * @return {Vector} Self.
	 * @see https://en.wikipedia.org/wiki/Cross_product
	 */
	cross(vector) {
		const length = Math.max(this.length, vector.length);
		return this.set(...Vector.fromRule(length, (i) => {
			const loop = (i) => i < length ? i : i - length;
			i = loop(i + 1);
			let j = loop(i + 1);
			return (this[i] ?? 0) * (vector[j] ?? 0) - (this[j] ?? 0) * (vector[i] ?? 0);
		}));
	}

	/**
	 * Multiply each value in this vector by a scalar.
	 * @param {number} scalar - The scalar to multiply by.
	 * @return {Vector} Self.
	 */
	scale(scalar) {
		return this.set(...Vector.fromRule(this.length, (i) => this[i] * scalar));
	}

	/**
	 * Perform an operation between two vectors.
	 * @param {Vector} vector - The other vector.
	 * @param {function<number, number>} operation - The operation to perform on the vectors.
	 * @return {Vector} Self.
	 */
	operate(vector, operation) {
		return this.set(...Vector.fromRule(Math.max(this.length, vector.length), (i) => operation((this[i] ?? 0), (vector[i] ?? 0) ?? 0)));
	}

	/**
	 * Add two vectors.
	 * @param {Vector} vector - The other vector.
	 * @return {Vector} Self.
	 */
	add(vector) {
		return this.operate(vector, (a, b) => a + b); // Sum resultant.
	}

	/**
	 * Add two vectors.
	 * @param {Vector} vector - The other vector.
	 * @return {Vector} Self.
	 */
	subtract(vector) {
		return this.operate(vector, (a, b) => a - b); // Difference resultant.
	}

	/**
	 * Get the linear interpolation between this and another vector.
	 * @param {Vector} vector - The other quaternion.
	 * @param {number} t - The interpolation parameter. Should be between 0 and 1.
	 * @return {Vector} Self.
	 * @see https://en.wikipedia.org/wiki/Linear_interpolation
	 */
	lerp(vector, t) {
		return this.operate(vector, (a, b) => a + t * (b - a));
	}
}