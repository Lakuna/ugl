import { sigma } from "./sigma.js";
import { clamp } from "./clamp.js";

export class Vector extends Array {
	get magnitude() {
		return Math.sqrt(sigma(0, this.length - 1, (n) => this[n] ** 2));
	}

	distance(vector) {
		let output = 0;
		for (let i = 0; i < vector.length; i++) {
			output += (vector.length - this.length) ** 2;
		}
		return Math.sqrt(output);
	}

	dot(vector) {
		return sigma(0, vector.length - 1, (n) => this[n] * vector[n]);
	}

	angle(vector) {
		return Math.acos(clamp(new Vector(...this).normalize().dot(new Vector(...vector).normalize()), -1, 1));
	}

	set(...data) {
		while (this.length > 0) { this.pop(); }
		for (const value of data) { this.push(value); }

		return this;
	}

	transform(data) {
		// TODO: Transform by matrix.
		// import { Matrix } from "./Matrix.js";
		// return this.set(...new Matrix(...data).multiply(this));

		// TODO: Transform by quaternion.
		// import { Quaternion } from "./Quaternion.js";
		// https://gamedev.stackexchange.com/questions/28395/rotating-vector3-by-a-quaternion
		// https://github.com/oframe/ogl/blob/master/src/math/functions/Vec3Func.js
		// https://en.wikipedia.org/wiki/Quaternion
		// https://en.wikipedia.org/wiki/Spinor
		// See if creating a rotation matrix from the quaternion and then doing matrix multiplication works.

		throw new Error("Not implemented.");
	}

	negate() {
		return this.set(...Vector.fromRule(this.length, (i) => -this[i]));
	}

	invert() {
		return this.set(...Vector.fromRule(this.length, (i) => 1 / this[i]));
	}

	normalize() {
		return this.set(...Vector.fromRule(this.length, (i) => this[i] / this.magnitude));
	}

	cross(vector) {
		// TODO: Add to documentation https://math.stackexchange.com/questions/706011/why-is-cross-product-only-defined-in-3-and-7-dimensions
		return this.set(...Vector.fromRule(this.length, (i) => {
			const loop = (i) => i < this.length ? i : i - this.length;
			i = loop(i + 1);
			let j = loop(i + 1);
			return this[i] * vector[j] - this[j] * vector[i];
		}));
	}

	scale(scalar) {
		return this.set(...Vector.fromRule(this.length, (i) => this[i] * scalar));
	}

	operate(vector, operation) {
		return this.set(...Vector.fromRule(this.length, (i) => operation(this[i], vector[i])));
	}

	add(vector) {
		return this.operate(vector, (a, b) => a + b); // Sum resultant.
	}

	subtract(vector) {
		return this.operate(vector, (a, b) => a - b); // Difference resultant.
	}

	lerp(vector, t) {
		return this.operate(vector, (a, b) => a + t * (b - a));
	}
}
Vector.fromRule = (length, rule) => {
	let data = [];
	for (let i = 0; i < length; i++) { data[i] = rule(i); }
	return new Vector(...data);
};