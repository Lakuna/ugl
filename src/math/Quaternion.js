import { degreesToRadians } from "./degreesToRadians.js";
import { Vector } from "./Vector.js";

/*
TODO: Remove references.
https://blog.hamaluik.ca/posts/quaternions-as-four-dimensional-complex-numbers/
https://arxiv.org/ftp/arxiv/papers/2009/2009.00425.pdf
https://www.sciencedirect.com/topics/computer-science/quaternion-multiplication
https://github.com/infusion/Quaternion.js/blob/master/quaternion.js
*/

export class Quaternion extends Array {
	constructor(...data) {
		super(...(data || Quaternion.identity())); // Default to identity.
		// TODO: Use the nullish coalescing operator (??) if it works with bundlephobia
	}

	set(...data) {
		while (this.length > 0) { this.pop(); }
		for (const value of data) { this.push(value); }

		return this;
	}

	setAngle(axis, degrees) {
		const radians = degreesToRadians(degrees) * 0.5;
		const sine = Math.sin(radians);
		this[0] *= sine;
		this[1] *= sine;
		this[2] *= sine;
		this[3] = Math.cos(radians);
		return this;
	}

	multiply(quaternion) {
		// Real scalar values.
		const w1 = this[0];
		const w2 = quaternion[0];

		// Imaginary 3D vector values.
		const v = (quaternion) => Vector.fromRule(3, (i) => quaternion[i + 1]);
		const v1 = () => v(this);
		const v2 = () => v(quaternion);

		return this.set(
			w1 * w2 - v1().dot(v2()), // w1 * w2 + dot(v1, v2)
			...v2().scale(w1).add(v1().scale(w2)).add(v1().cross(v2())) // w1 * v2 + w2 * v1 + cross(v1, v2)
		);
	}
}
Quaternion.fromRule = (length, rule) => {
	let data = [];
	for (let i = 0; i < length; i++) { data[i] = rule(i); }
	return new Quaternion(...data);
};
Quaternion.identity = () => new Quaternion(1, 0, 0, 0);