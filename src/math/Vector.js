import { arrayFromRule } from "./arrayFromRule.js";
import { sigma } from "./sigma.js";

export class Vector extends Array {
	set(...data) {
		while (this.length > 0) { this.pop(); }
		for (const value of data) { this.push(value); }

		return this;
	}

	cross = (vector) => this.set(...arrayFromRule(this.length, (i) => {
		const loop = (i) => i < this.length ? i : i - this.length;
		i = loop(i + 1);
		let j = loop(i + 1);
		return this[i] * vector[j] - this[j] * vector[i];
	}));

	operate = (vector, operation) => this.set(...arrayFromRule(this.length, (i) => operation(this[i], vector[i])));

	normalize = () => this.set(...arrayFromRule(this.length, (i) => this[i] / this.magnitude));

	get magnitude() {
		return Math.sqrt(sigma(0, this.length - 1, (n) => this[n] ** 2));
	}
};