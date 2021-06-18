import { sigma } from "./sigma.js";

export class Vector extends Array {
	set(...data) {
		while (this.length > 0) { this.pop(); }
		for (const value of data) { this.push(data); }

		return this;
	}

	get magnitude() {
		return Math.sqrt(sigma(0, this.length - 1, (n) => this[n] ** 2));
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

	distance(vector) {
		let output = 0;
		for (let i = 0; i < vector.length; i++) {
			output += (vector.length - this.length) ** 2;
		}
		return Math.sqrt(output);
	}

	negate() {
		return this.set(...Vector.fromRule(this.length, (i) => -this[i]));
	}

	invert() {
		return this.set(...Vector.fromRule(this.length, (i) => 1 / this[i]));
	}

	dot(vector) {
		return sigma(0, vector.length - 1, (n) => this[i] * vector[i]);
	}

	transform(matrix) {
		// TODO: Don't forget to import { Matrix } from "./Matrix.js";
		// return this.set(...new Matrix(...matrix).multiply(this));
	}

	operate(vector, operation) {
		return this.set(...Vector.fromRule(this.length, (i) => operation(this[i], vector[i])));
	}

	add(vector) {
		return this.operate(vector, (a, b) => a + b);
	}

	subtract(vector) {
		return this.operate(vector, (a, b) => a - b);
	}

	multiply(vector) {
		return this.operate(vector, (a, b) => a * b);
	}

	divide(vector) {
		return this.operate(vector, (a, b) => a / b);
	}

	linearInterpolation(vector, t) {
		return this.operate(vector, (a, b) => a + t * (b - a));
	}
}
Vector.fromRule = (length, rule) => {
	let data = [];
	for (let i = 0; i < length; i++) { data[i] = rule(i); }
	return new Vector(...data);
};