// Implementation of https://github.com/jwagner/simplex-noise.js

import { Alea } from "./Alea.js";
import { Vector } from "../math/Vector.js";

/** JavaScript implementation of OpenSimplex noise. */
export class Simplex {
	static #buildPermutationTable(...seeds) {
		const alea = new Alea(...seeds);
		const p = new Uint8Array(256);
		for (let i = 0; i < 256; i++) {
			p[i] = i;
		}
		for (let i = 0; i < 255; i++) {
			const r = i + ~~(alea.random() * (256 - i));
			const aux = p[i];
			p[i] = p[r];
			p[r] = aux;
		}
		return p;
	}

	static #F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
	static #F3 = 1.0 / 3.0;
	static #F4 = (Math.sqrt(5.0) - 1.0) / 4.0;

	static #G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
	static #G3 = 1.0 / 6.0;
	static #G4 = (5.0 - Math.sqrt(5.0)) / 20.0;

	static #grad3 = new Float32Array([
		1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 1, 0, 1, -1, 0, 1, 1, 0, -1, -1,
		0, -1, 0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1
	]);
	static #grad4 = new Float32Array([
		0, 1, 1, 1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, -1, 0, -1, 1, 1, 0, -1,
		1, -1, 0, -1, -1, 1, 0, -1, -1, -1, 1, 0, 1, 1, 1, 0, 1, -1, 1, 0, -1,
		1, 1, 0, -1, -1, -1, 0, 1, 1, -1, 0, 1, -1, -1, 0, -1, 1, -1, 0, -1, -1,
		1, 1, 0, 1, 1, 1, 0, -1, 1, -1, 0, 1, 1, -1, 0, -1, -1, 1, 0, 1, -1, 1,
		0, -1, -1, -1, 0, 1, -1, -1, 0, -1, 1, 1, 1, 0, 1, 1, -1, 0, 1, -1, 1,
		0, 1, -1, -1, 0, -1, 1, 1, 0, -1, 1, -1, 0, -1, -1, 1, 0, -1, -1, -1, 0
	]);

	#p;
	#perm;
	#permMod12;

	/**
	 * Create an OpenSimplex noise generator.
	 * @param {number[]} [...seeds=[Date.now()]] - The seed(s) of the generator.
	 */
	constructor(...seeds) {
		/** @ignore */ this.#p = Simplex.#buildPermutationTable(...seeds);
		/** @ignore */ this.#perm = new Uint8Array(512);
		/** @ignore */ this.#permMod12 = new Uint8Array(512);
		for (let i = 0; i < 512; i++) {
			this.#perm[i] = this.#p[i & 255];
			this.#permMod12[i] = this.#perm[i] % 12;
		}
	}

	/**
	 * Samples the noise field.
	 * @param {Vector} vector - The coordinates to sample.
	 * @return {number} A number in the interval [-1, 1];
	 */
	noise(vector) {
		vector = new Vector(...vector);

		switch (vector.length) {
			case 2:
				return this.noise2D(vector.x, vector.y);
			case 3:
				return this.noise3D(vector.x, vector.y, vector.z);
			case 4:
				return this.noise4D(vector.x, vector.y, vector.z, vector.w);
			default:
				throw new Error("Invalid dimensions for OpenSimplex noise. Valid dimensions are 2, 3, and 4.");
		}
	}

	/**
	 * Samples the noise field.
	 * @param {number} x - The x coordinate to sample.
	 * @param {number} y - The y coordinate to sample.
	 * @return {number} A number in the interval [-1, 1];
	 */
	noise2D(x, y) {
		// TODO: This method can be minified drastically.

		const permMod12 = this.#permMod12;
		const perm = this.#perm;
		let n0 = 0;
		let n1 = 0;
		let n2 = 0;
		const s = (x + y) * Simplex.#F2;
		const i = Math.floor(x + s);
		const j = Math.floor(y + s);
		const t = (i + j) * Simplex.#G2;
		const X0 = i - t;
		const Y0 = j - t;
		const x0 = x - X0;
		const y0 = y - Y0;
		let i1, j1;
		if (x0 > y0) {
			i1 = 1;
			j1 = 0;
		} else {
			i1 = 0;
			j1 = 1;
		}
		const x1 = x0 - i1 + Simplex.#G2;
		const y1 = y0 - j1 + Simplex.#G2;
		const x2 = x0 - 1.0 + 2.0 * Simplex.#G2;
		const y2 = y0 - 1.0 + 2.0 * Simplex.#G2;
		const ii = i & 255;
		const jj = j & 255;
		let t0 = 0.5 - x0 * x0 - y0 * y0;
		if (t0 >= 0) {
			const gi0 = permMod12[ii + perm[jj]] * 3;
			t0 *= t0;
			n0 =
				t0 *
				t0 *
				(Simplex.#grad3[gi0] * x0 + Simplex.#grad3[gi0 + 1] * y0);
		}
		let t1 = 0.5 - x1 * x1 - y1 * y1;
		if (t1 >= 0) {
			const gi1 = permMod12[ii + i1 + perm[jj + j1]] * 3;
			t1 *= t1;
			n1 =
				t1 *
				t1 *
				(Simplex.#grad3[gi1] * x1 + Simplex.#grad3[gi1 + 1] * y1);
		}
		let t2 = 0.5 - x2 * x2 - y2 * y2;
		if (t2 >= 0) {
			const gi2 = permMod12[ii + 1 + perm[jj + 1]] * 3;
			t2 *= t2;
			n2 =
				t2 *
				t2 *
				(Simplex.#grad3[gi2] * x2 + Simplex.#grad3[gi2 + 1] * y2);
		}
		return 70.0 * (n0 + n1 + n2);
	}

	/**
	 * Samples the noise field.
	 * @param {number} x - The x coordinate to sample.
	 * @param {number} y - The y coordinate to sample.
	 * @param {number} z - The z coordinate to sample.
	 * @return {number} A number in the interval [-1, 1];
	 */
	noise3D(x, y, z) {
		// TODO: This method can be minified drastically.

		const permMod12 = this.#permMod12;
		const perm = this.#perm;
		let n0, n1, n2, n3;
		const s = (x + y + z) * Simplex.#F3;
		const i = Math.floor(x + s);
		const j = Math.floor(y + s);
		const k = Math.floor(z + s);
		const t = (i + j + k) * Simplex.#G3;
		const X0 = i - t;
		const Y0 = j - t;
		const Z0 = k - t;
		const x0 = x - X0;
		const y0 = y - Y0;
		const z0 = z - Z0;
		let i1, j1, k1;
		let i2, j2, k2;
		if (x0 >= y0) {
			if (y0 >= z0) {
				i1 = 1;
				j1 = 0;
				k1 = 0;
				i2 = 1;
				j2 = 1;
				k2 = 0;
			} else if (x0 >= z0) {
				i1 = 1;
				j1 = 0;
				k1 = 0;
				i2 = 1;
				j2 = 0;
				k2 = 1;
			} else {
				i1 = 0;
				j1 = 0;
				k1 = 1;
				i2 = 1;
				j2 = 0;
				k2 = 1;
			}
		} else {
			if (y0 < z0) {
				i1 = 0;
				j1 = 0;
				k1 = 1;
				i2 = 0;
				j2 = 1;
				k2 = 1;
			} else if (x0 < z0) {
				i1 = 0;
				j1 = 1;
				k1 = 0;
				i2 = 0;
				j2 = 1;
				k2 = 1;
			} else {
				i1 = 0;
				j1 = 1;
				k1 = 0;
				i2 = 1;
				j2 = 1;
				k2 = 0;
			}
		}
		const x1 = x0 - i1 + Simplex.#G3;
		const y1 = y0 - j1 + Simplex.#G3;
		const z1 = z0 - k1 + Simplex.#G3;
		const x2 = x0 - i2 + 2.0 * Simplex.#G3;
		const y2 = y0 - j2 + 2.0 * Simplex.#G3;
		const z2 = z0 - k2 + 2.0 * Simplex.#G3;
		const x3 = x0 - 1.0 + 3.0 * Simplex.#G3;
		const y3 = y0 - 1.0 + 3.0 * Simplex.#G3;
		const z3 = z0 - 1.0 + 3.0 * Simplex.#G3;
		const ii = i & 255;
		const jj = j & 255;
		const kk = k & 255;
		let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
		if (t0 < 0) n0 = 0.0;
		else {
			const gi0 = permMod12[ii + perm[jj + perm[kk]]] * 3;
			t0 *= t0;
			n0 =
				t0 *
				t0 *
				(Simplex.#grad3[gi0] * x0 +
					Simplex.#grad3[gi0 + 1] * y0 +
					Simplex.#grad3[gi0 + 2] * z0);
		}
		let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
		if (t1 < 0) n1 = 0.0;
		else {
			const gi1 = permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]] * 3;
			t1 *= t1;
			n1 =
				t1 *
				t1 *
				(Simplex.#grad3[gi1] * x1 +
					Simplex.#grad3[gi1 + 1] * y1 +
					Simplex.#grad3[gi1 + 2] * z1);
		}
		let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
		if (t2 < 0) n2 = 0.0;
		else {
			const gi2 = permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]] * 3;
			t2 *= t2;
			n2 =
				t2 *
				t2 *
				(Simplex.#grad3[gi2] * x2 +
					Simplex.#grad3[gi2 + 1] * y2 +
					Simplex.#grad3[gi2 + 2] * z2);
		}
		let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
		if (t3 < 0) n3 = 0.0;
		else {
			const gi3 = permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]] * 3;
			t3 *= t3;
			n3 =
				t3 *
				t3 *
				(Simplex.#grad3[gi3] * x3 +
					Simplex.#grad3[gi3 + 1] * y3 +
					Simplex.#grad3[gi3 + 2] * z3);
		}
		return 32.0 * (n0 + n1 + n2 + n3);
	}

	/**
	 * Samples the noise field.
	 * @param {number} x - The x coordinate to sample.
	 * @param {number} y - The y coordinate to sample.
	 * @param {number} z - The z coordinate to sample.
	 * @param {number} w - The w coordinate to sample.
	 * @return {number} A number in the interval [-1, 1];
	 */
	noise4D(x, y, z, w) {
		// TODO: This method can be minified drastically.
		
		const perm = this.#perm;

		let n0, n1, n2, n3, n4;
		const s = (x + y + z + w) * Simplex.#F4;
		const i = Math.floor(x + s);
		const j = Math.floor(y + s);
		const k = Math.floor(z + s);
		const l = Math.floor(w + s);
		const t = (i + j + k + l) * Simplex.#G4;
		const X0 = i - t;
		const Y0 = j - t;
		const Z0 = k - t;
		const W0 = l - t;
		const x0 = x - X0;
		const y0 = y - Y0;
		const z0 = z - Z0;
		const w0 = w - W0;
		let rankx = 0;
		let ranky = 0;
		let rankz = 0;
		let rankw = 0;
		if (x0 > y0) rankx++;
		else ranky++;
		if (x0 > z0) rankx++;
		else rankz++;
		if (x0 > w0) rankx++;
		else rankw++;
		if (y0 > z0) ranky++;
		else rankz++;
		if (y0 > w0) ranky++;
		else rankw++;
		if (z0 > w0) rankz++;
		else rankw++;
		const i1 = rankx >= 3 ? 1 : 0;
		const j1 = ranky >= 3 ? 1 : 0;
		const k1 = rankz >= 3 ? 1 : 0;
		const l1 = rankw >= 3 ? 1 : 0;
		const i2 = rankx >= 2 ? 1 : 0;
		const j2 = ranky >= 2 ? 1 : 0;
		const k2 = rankz >= 2 ? 1 : 0;
		const l2 = rankw >= 2 ? 1 : 0;
		const i3 = rankx >= 1 ? 1 : 0;
		const j3 = ranky >= 1 ? 1 : 0;
		const k3 = rankz >= 1 ? 1 : 0;
		const l3 = rankw >= 1 ? 1 : 0;
		const x1 = x0 - i1 + Simplex.#G4;
		const y1 = y0 - j1 + Simplex.#G4;
		const z1 = z0 - k1 + Simplex.#G4;
		const w1 = w0 - l1 + Simplex.#G4;
		const x2 = x0 - i2 + 2.0 * Simplex.#G4;
		const y2 = y0 - j2 + 2.0 * Simplex.#G4;
		const z2 = z0 - k2 + 2.0 * Simplex.#G4;
		const w2 = w0 - l2 + 2.0 * Simplex.#G4;
		const x3 = x0 - i3 + 3.0 * Simplex.#G4;
		const y3 = y0 - j3 + 3.0 * Simplex.#G4;
		const z3 = z0 - k3 + 3.0 * Simplex.#G4;
		const w3 = w0 - l3 + 3.0 * Simplex.#G4;
		const x4 = x0 - 1.0 + 4.0 * Simplex.#G4;
		const y4 = y0 - 1.0 + 4.0 * Simplex.#G4;
		const z4 = z0 - 1.0 + 4.0 * Simplex.#G4;
		const w4 = w0 - 1.0 + 4.0 * Simplex.#G4;
		const ii = i & 255;
		const jj = j & 255;
		const kk = k & 255;
		const ll = l & 255;
		let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0 - w0 * w0;
		if (t0 < 0) n0 = 0.0;
		else {
			const gi0 = (perm[ii + perm[jj + perm[kk + perm[ll]]]] % 32) * 4;
			t0 *= t0;
			n0 =
				t0 *
				t0 *
				(Simplex.#grad4[gi0] * x0 +
					Simplex.#grad4[gi0 + 1] * y0 +
					Simplex.#grad4[gi0 + 2] * z0 +
					Simplex.#grad4[gi0 + 3] * w0);
		}
		let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1 - w1 * w1;
		if (t1 < 0) n1 = 0.0;
		else {
			const gi1 =
				(perm[ii + i1 + perm[jj + j1 + perm[kk + k1 + perm[ll + l1]]]] %
					32) *
				4;
			t1 *= t1;
			n1 =
				t1 *
				t1 *
				(Simplex.#grad4[gi1] * x1 +
					Simplex.#grad4[gi1 + 1] * y1 +
					Simplex.#grad4[gi1 + 2] * z1 +
					Simplex.#grad4[gi1 + 3] * w1);
		}
		let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2 - w2 * w2;
		if (t2 < 0) n2 = 0.0;
		else {
			const gi2 =
				(perm[ii + i2 + perm[jj + j2 + perm[kk + k2 + perm[ll + l2]]]] %
					32) *
				4;
			t2 *= t2;
			n2 =
				t2 *
				t2 *
				(Simplex.#grad4[gi2] * x2 +
					Simplex.#grad4[gi2 + 1] * y2 +
					Simplex.#grad4[gi2 + 2] * z2 +
					Simplex.#grad4[gi2 + 3] * w2);
		}
		let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3 - w3 * w3;
		if (t3 < 0) n3 = 0.0;
		else {
			const gi3 =
				(perm[ii + i3 + perm[jj + j3 + perm[kk + k3 + perm[ll + l3]]]] %
					32) *
				4;
			t3 *= t3;
			n3 =
				t3 *
				t3 *
				(Simplex.#grad4[gi3] * x3 +
					Simplex.#grad4[gi3 + 1] * y3 +
					Simplex.#grad4[gi3 + 2] * z3 +
					Simplex.#grad4[gi3 + 3] * w3);
		}
		let t4 = 0.6 - x4 * x4 - y4 * y4 - z4 * z4 - w4 * w4;
		if (t4 < 0) n4 = 0.0;
		else {
			const gi4 =
				(perm[ii + 1 + perm[jj + 1 + perm[kk + 1 + perm[ll + 1]]]] %
					32) *
				4;
			t4 *= t4;
			n4 =
				t4 *
				t4 *
				(Simplex.#grad4[gi4] * x4 +
					Simplex.#grad4[gi4 + 1] * y4 +
					Simplex.#grad4[gi4 + 2] * z4 +
					Simplex.#grad4[gi4 + 3] * w4);
		}
		return 27.0 * (n0 + n1 + n2 + n3 + n4);
	}
}
