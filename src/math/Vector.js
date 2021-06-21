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

	transform(matrix) {
		this.set(...new Matrix(...matrix).multiply(this));
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