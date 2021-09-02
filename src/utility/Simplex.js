// Implementation of https://github.com/jwagner/simplex-noise.js

import { Alea } from "./Alea.js";
import { Vector } from "../math/Vector.js";

/** JavaScript implementation of OpenSimplex noise. */
export class Simplex {
	static #buildPermutationTable(...seeds) {
		const alea = new Alea(seeds);
		const p = new Uint8Array(0x100);
		for (let i = 0; i < 0x100; i++) { p[i] = i; }
		for (let i = 0; i < 0xFF; i++) {
			const r = i + ~~(alea.random() * (0x100 - i));
			const aux = p[i];
			p[i] = p[r];
			p[r] = aux;
		}

		return p;
	}

	static #F2 = 0.5 * (Math.sqrt(3) - 1);
	static #F3 = 1 / 3;
	static #F4 = (Math.sqrt(5) - 1) / 4;

	static #G2 = (3 - Math.sqrt(3)) / 6;
	static #G3 = 1 / 6;
	static #G4 = (5 - Math.sqrt(5)) / 20;

	static #grad3 = new Float32Array([1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0,
		1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, -1, 0, 1, 1, 0, -1, 1, 0, 1, -1, 0,
		-1, -1]);
	static #grad4 = new Float32Array([0, 1, 1, 1, 0, 1, 1, -1, 0, 1, -1, 1, 0,
		1, -1, -1, 0, -1, 1, 1, 0, -1, 1, -1, 0, -1, -1, 1, 0, -1, -1, -1, 1,
		0, 1, 1, 1, 0, 1, -1, 1, 0, -1, 1, 1, 0, -1, -1, -1, 0, 1, 1, -1, 0, 1,
		-1, -1, 0, -1, 1, -1, 0, -1, -1, 1, 1, 0, 1, 1, 1, 0, -1, 1, -1, 0, 1,
		1, -1, 0, -1, -1, 1, 0, 1, -1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, -1,
		1, 1, 1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, -1, 0, -1, 1, 1, 0, -1, 1,
		-1, 0, -1, -1, 1, 0, -1, -1, -1, 0]);

	#p;
	#perm;
	#permMod12;

	/**
	 * Create an OpenSimplex noise generator.
	 * @param {number[]} [...seeds=[Date.now()]] - The seed(s) of the generator.
	 */
	constructor(...seeds) {
		/** @ignore */ this.#p = Simplex.#buildPermutationTable(seeds);
		/** @ignore */ this.#perm = new Uint8Array(0x200);
		/** @ignore */ this.#permMod12 = new Uint8Array(0x200);
		for (let i = 0; i < 0x200; i++) {
			this.#perm[i] = this.#p[i & 0xFF];
			this.#permMod12[i] = this.#perm[i] % 12;
		}
	}

	/**
	 * Samples the noise field.
	 * @param {Vector} vector - The value of the noise at the given point.
	 * @return {number} A number in the interval [-1, 1];
	 */
	noise(vector) {
		// TODO: This function can be minified drastically.

		vector = new Vector(...vector);

		const x = vector.x;
		const y = vector.y;
		const z = vector.z;
		const w = vector.w;

		// Define variables here because ESLint doesn't like it when you do it inside of a switch statement.
		let n0, n1, n2, n3, n4, s, i, j, k, l, t, X0, Y0, Z0, W0, x0, y0, z0,
			w0, rankx, ranky, rankz, rankw, i1, j1, k1, l1, i2, j2, k2, l2, i3,
			j3, k3, l3, x1, y1, z1, w1, x2, y2, z2, w2, x3, y3, z3, w3, x4, y4,
			z4, w4, ii, jj, kk, ll, t0, gi0, t1, gi1, t2, gi2, t3, gi3, t4, gi4;

		switch (vector.length) {
			case 2:
				// Noise contributions from the three corners.
				n0 = 0;
				n1 = 0;
				n2 = 0;

				// Skew the input space to determine which Simplex cell we're in.
				s = (x + y) * Simplex.#F2; // Factor for 2D skewing.
				i = Math.floor(x + s);
				j = Math.floor(y + s);
				t = (i + j) * Simplex.#G2; // Factor for 2D unskewing.

				// Unskew the cell origin back to (x, y) space.
				X0 = i - t;
				Y0 = j - t;

				// The x, y distances from the cell origin.
				x0 = x - X0;
				y0 = y - Y0;

				// For the 2D case, the Simplex shape is an equilateral triangle.
				// Determine which Simplex we are in.
				// Offsets for second (middle) corner of Simplex in (i, j) coordinates.
				if (x0 > y0) {
					// Lower triangle. XY order.
					i1 = 1;
					j1 = 0;
				} else {
					// Upper triangle. YX order.
					i1 = 0;
					j1 = 1;
				}

				// Offsets for the middle corner in (x, y) unskewed coordinates.
				x1 = x0 - i1 + Simplex.#G2;
				y1 = y0 - j1 + Simplex.#G2;

				// Offsets for the last corner in (x, y) unskewed coordinates.
				x2 = x0 - 1 + 2 * Simplex.#G2;
				y2 = y0 - 1 + 2 * Simplex.#G2;

				// Work out the hashed gradient indices of the three Simplex corners.
				ii = i & 0xFF;
				jj = j & 0xFF;

				// Calculate the contribution from the three corners.
				t0 = 0.5 - x0 * x0 - y0 * y0;
				if (t0 >= 0) {
					gi0 = this.#permMod12[ii + this.#perm[jj]] * 3;
					t0 *= t0;
					n0 = t0 * t0 * (Simplex.#grad3[gi0] * x0 + Simplex.#grad3[gi0 + 1] * y0); // (x, y) coordinates of grad3 used for 2D gradient.
				}

				t1 = 0.5 - x1 * x1 - y1 * y1;
				if (t1 >= 0) {
					gi1 = this.#permMod12[ii + i1 + this.#perm[jj + j1]] * 3;
					t1 *= t1;
					n1 = t1 * t1 * (Simplex.#grad3[gi1] * x1 + Simplex.#grad3[gi1 + 1] * y1);
				}

				t2 = 0.5 - x2 * x2 - y2 * y2;
				if (t2 >= 0) {
					gi2 = this.#permMod12[ii + 1 + this.#perm[jj + 1]] * 3;
					t2 *= t2;
					n2 = t2 * t2 * (Simplex.#grad3[gi2] * x2 + Simplex.#grad3[gi2 + 1] * y2);
				}

				// Add contributions from each corner to get the final noise value.
				return 70 * (n0 + n1 + n2);
			case 3:
				// Noise contributions from the four corners.
				n0 = 0;
				n1 = 0;
				n2 = 0;
				n3 = 0;

				// Skew the input space to determine which Simplex cell we're in.
				s = (x + y + z) * Simplex.#F3; // Factor for 3D skewing.
				i = Math.floor(x + s);
				j = Math.floor(y + s);
				k = Math.floor(z + s);
				t = (i + j + k) * Simplex.#G3; // Factor for 3D unskewing.

				// Unskew the cell origin back to (x, y, z) space.
				X0 = i - t;
				Y0 = j - t;
				Z0 = k - t;

				// The x, y, z distances from the cell origin.
				x0 = x - X0;
				y0 = y - Y0;
				z0 = z - Z0;

				// For the 3D case, the Simplex shape is a slightly irregular tetrahedron.
				// Determine which Simplex we are in.
				// Offsets for second and third corners of Simplex in (i, j, k) coordinates.
				if (x0 >= y0) {
					if (y0 >= z0) {
						// XYZ order.
						i1 = 1;
						j1 = 0;
						k1 = 0;
						i2 = 1;
						j2 = 1;
						k2 = 0;
					} else if (x0 >= z0) {
						// XZY order.
						i1 = 1;
						j1 = 0;
						k1 = 0;
						i2 = 1;
						j2 = 0;
						k2 = 1;
					} else {
						// ZXY order.
						i1 = 0;
						j1 = 0;
						k1 = 1;
						i2 = 1;
						j2 = 0;
						k2 = 1;
					}
				} else {
					if (y0 < z0) {
						// ZYX order.
						i1 = 0;
						j1 = 0;
						k1 = 1;
						i2 = 0;
						j2 = 1;
						k2 = 1;
					} else if (x0 < z0) {
						// YZX order.
						i1 = 0;
						j1 = 1;
						k1 = 0;
						i2 = 0;
						j2 = 1;
						k2 = 1;
					} else {
						// YXZ order.
						i1 = 0;
						j1 = 1;
						k1 = 0;
						i2 = 1;
						j2 = 1;
						k2 = 0;
					}
				}

				// Offsets for the second corner in (x, y, z) coordinates.
				x1 = x0 - i1 + Simplex.#G3;
				y1 = y0 - j1 + Simplex.#G3;
				z1 = z0 - k1 + Simplex.#G3;

				// Offsets for the third corner in (x, y, z) coordinates.
				x2 = x0 - i2 + 2 * Simplex.#G3;
				y2 = y0 - j2 + 2 * Simplex.#G3;
				z2 = z0 - k2 + 2 * Simplex.#G3;

				// Offsets for the last corner in (x, y, z) coordinates.
				x2 = x0 - 1 + 3 * Simplex.#G3;
				y3 = y0 - 1 + 3 * Simplex.#G3;
				z3 = z0 - 1 + 3 * Simplex.#G3;

				// Work out the hashed gradient indices of the four Simplex corners.
				ii = i & 0xFF;
				jj = j & 0xFF;
				kk = k & 0xFF;

				// Calculate the contribution from the four corners.
				t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
				if (t0 >= 0) {
					gi0 = this.#permMod12[ii + this.#perm[jj + this.#perm[kk]]] * 3;
					t0 *= t0;
					n0 = t0 * t0 * (Simplex.#grad3[gi0] * x0 + Simplex.#grad3[gi0 + 1] * y0 + Simplex.#grad3[gi0 + 2] * z0);
				}

				t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
				if (t1 >= 0) {
					gi1 = this.#permMod12[ii + i1 + this.#perm[jj + j1 + this.#perm[kk + k1]]] * 3;
					t1 *= t1;
					n1 = t1 * t1 * (Simplex.#grad3[gi1] * x1 + Simplex.#grad3[gi1 + 1] * y1 + Simplex.#grad3[gi1 + 2] * z1);
				}

				t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
				if (t2 >= 0) {
					gi2 = this.#permMod12[ii + i2 + this.#perm[jj + j2 + this.#perm[kk + k2]]] * 3;
					t2 *= t2;
					n2 = t2 * t2 * (Simplex.#grad3[gi2] * x2 + Simplex.#grad3[gi2 + 1] * y2 + Simplex.#grad3[gi2 + 2] * z2);
				}

				t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
				if (t3 >= 0) {
					gi3 = this.#permMod12[ii + 1 + this.#perm[jj + 1 + this.#perm[kk + 1]]] * 3;
					t3 *= t3;
					n3 = t3 * t3 * (Simplex.#grad3[gi3] * x3 + Simplex.#grad3[gi3 + 1] * y3 + Simplex.#grad3[gi3 + 2] * z3);
				}

				// Add contributions from each corner to get the final noise value.
				return 32 * (n0 + n1 + n2 + n3);
			case 4:
				// Noise contributions from the five corners.
				n0 = 0;
				n1 = 0;
				n2 = 0;
				n3 = 0;
				n4 = 0;

				// Skew the (x, y, z, w) space to determine which cell of 24 Simplices we're in.
				s = (x + y + z + w) * Simplex.#F4; // Factor for 4D skewing.
				i = Math.floor(x + s);
				j = Math.floor(y + s);
				k = Math.floor(z + s);
				l = Math.floor(w + s);
				t = Math.floor(i + j + k + l) * Simplex.#G4; // Factor for 4D unskewing.

				// Unskew the cell origin back to (x, y, z, w) space.
				X0 = i - t;
				Y0 = j - t;
				Z0 = k - t;
				W0 = l - t;

				// The x, y, z, w distances from the cell origin.
				x0 = x - X0;
				y0 = y - Y0;
				z0 = z - Z0;
				w0 = w - W0;

				// For the 4D case, the Simplex is a 4D shape.
				// Determine which Simplex we are in.
				// Offsets for second, third, and fourth corners of Simplex in (i, j, k, l) coordinates.
				rankx = 0;
				ranky = 0;
				rankz = 0;
				rankw = 0;
				if (x0 > y0) { rankx++; } else { ranky++; }
				if (x0 > z0) { rankx++; } else { rankz++; }
				if (x0 > w0) { rankx++; } else { rankw++; }
				if (y0 > z0) { ranky++; } else { rankz++; }
				if (y0 > w0) { ranky++; } else { rankw++; }
				if (z0 > w0) { rankz++; } else { rankw++; }

				// The integer offsets for the second Simplex corner.
				i1 = rankx >= 3 ? 1 : 0;
				j1 = ranky >= 3 ? 1 : 0;
				k1 = rankz >= 3 ? 1 : 0;
				l1 = rankw >= 3 ? 1 : 0;

				// The integer offsets for the third Simplex corner.
				i2 = rankx >= 2 ? 1 : 0;
				j2 = ranky >= 2 ? 1 : 0;
				k2 = rankz >= 2 ? 1 : 0;
				l2 = rankw >= 2 ? 1 : 0;

				// The integer offsets for the fourth Simplex corner.
				i3 = rankx >= 1 ? 1 : 0;
				j3 = ranky >= 1 ? 1 : 0;
				k3 = rankz >= 1 ? 1 : 0;
				l3 = rankw >= 1 ? 1 : 0;

				// Offsets for the second corner in (x, y, z, w) coordinates.
				x1 = x0 - i1 + Simplex.#G4;
				y1 = y0 - j1 + Simplex.#G4;
				z1 = z0 - k1 + Simplex.#G4;
				w1 = w0 - l1 + Simplex.#G4;

				// Offsets for the third corner in (x, y, z, w) coordinates.
				x2 = x0 - i2 + 2 * Simplex.#G4;
				y2 = y0 - j2 + 2 * Simplex.#G4;
				z2 = z0 - k2 + 2 * Simplex.#G4;
				w2 = w0 - l2 + 2 * Simplex.#G4;

				// Offsets for the fourth corner in (x, y, z, w) coordinates.
				x3 = x0 - i3 + 3 * Simplex.#G4;
				y3 = y0 - j3 + 3 * Simplex.#G4;
				z3 = z0 - k3 + 3 * Simplex.#G4;
				w3 = w0 - l3 + 3 * Simplex.#G4;

				// Offsets for the fourth corner in (x, y, z, w) coordinates.
				x4 = x0 - 1 + 4 * Simplex.#G4;
				y4 = y0 - 1 + 4 * Simplex.#G4;
				z4 = z0 - 1 + 4 * Simplex.#G4;
				w4 = w0 - 1 + 4 * Simplex.#G4;

				// Work out the hashed gradient indices of the five Simplex corners.
				ii = i & 0xFF;
				jj = j & 0xFF;
				kk = k & 0xFF;
				ll = l & 0xFF;

				// Calculate the contribution from the five corners.
				t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0 - w0 * w0;
				if (t0 >= 0) {
					gi0 = (this.#perm[ii + this.#perm[jj + this.#perm[kk + this.#perm[ll]]]] % 32) * 4;
					t0 *= t0;
					n0 = t0 * t0 * (Simplex.#grad4[gi0] * x0 + Simplex.#grad4[gi0 + 1] * y0 + Simplex.#grad4[gi0 + 2] * z0 + Simplex.#grad4[gi0 + 3] * w0);
				}

				t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1 - w1 * w1;
				if (t1 >= 0) {
					gi1 = (this.#perm[ii + i1 + this.#perm[jj + j1 + this.#perm[kk + k1 + this.#perm[ll + l1]]]] % 32) * 4;
					t1 *= t1;
					n1 = t1 * t1 * (Simplex.#grad4[gi1] * x1 + Simplex.#grad4[gi1 + 1] * y1 + Simplex.#grad4[gi1 + 2] * z1 + Simplex.#grad4[gi1 + 3] * w1);
				}

				t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2 - w2 * w2;
				if (t2 >= 0) {
					gi2 = (this.#perm[ii + i2 + this.#perm[jj + j2 + this.#perm[kk + k2 + this.#perm[ll + l2]]]] % 32) * 4;
					t2 *= t2;
					n2 = t2 * t2 * (Simplex.#grad4[gi2] * x2 + Simplex.#grad4[gi2 + 1] * y2 + Simplex.#grad4[gi2 + 2] * z2 + Simplex.#grad4[gi2 + 3] * w2);
				}

				t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3 - w3 * w3;
				if (t3 >= 0) {
					gi3 = (this.#perm[ii + i3 + this.#perm[jj + j3 + this.#perm[kk + k3 + this.#perm[ll + l3]]]] % 32) * 4;
					t3 *= t3;
					n3 = t3 * t3 * (Simplex.#grad4[gi3] * x3 + Simplex.#grad4[gi3 + 1] * y2 + Simplex.#grad4[gi3 + 2] * z3 + Simplex.#grad4[gi3 + 3] * w3);
				}

				t4 = 0.6 - x4 * x4 - y4 * y4 - z4 * z4 - w4 * w4;
				if (t4 >= 0) {
					gi4 = (this.#perm[ii + 1 + this.#perm[jj + 1 + this.#perm[kk + 1 + this.#perm[ll + 1]]]] % 32) * 4;
					t4 *= t4;
					n4 = t4 * t4 * (Simplex.#grad4[gi4] * x4 + Simplex.#grad4[gi4 + 1] * y4 + Simplex.#grad4[gi4 + 2] * z4 + Simplex.#grad4[gi4 + 3] * w4);
				}

				// Add contributions from each corner to get the final noise value.
				return 27 * (n0 + n1 + n2 + n3 + n4);
			default:
				throw new Error("Invalid dimension for OpenSimplex noise. Supported dimensions are 2, 3, and 4.");
		}
	}
}