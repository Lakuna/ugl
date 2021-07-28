import { sigma } from "./sigma.js";
import { clamp } from "./clamp.js";
import { Matrix } from "./Matrix.js";

export class Vector extends Array {
	static fromRule(length, rule) {
		let data = [];
		for (let i = 0; i < length; i++) { data[i] = rule(i); }
		return new Vector(...data);
	}

	get magnitude() {
		return Math.sqrt(sigma(0, this.length - 1, (n) => this[n] ** 2));
	}

	get x() {
		return this[0] ?? 0;
	}

	set x(value) {
		this[0] = value;
	}

	get y() {
		return this[1] ?? 0;
	}

	set y(value) {
		this[1] = value;
	}

	get z() {
		return this[2] ?? 0;
	}

	set z(value) {
		this[2] = value;
	}

	get w() {
		return this[3] ?? 0;
	}

	set w(value) {
		this[3] = value;
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