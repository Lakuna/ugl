import { Mash } from "./Mash.js";

/** Seedable pseudo-random number generator by Johannes Baagøe. */
export class Alea {
	/**
	 * The version of Alea.
	 * @type {number}
	 */
	static version = 0.9;

	#s0;
	#s1;
	#s2;
	#c;

	/**
	* Create an instance of Alea.
	* @param {*[]} [...seeds=[new Date()]] - A list of seeds for the PRNG.
	*/
	constructor(...seeds) {
		seeds ||= [new Date()];

		/**
		 * The seeds of the instance.
		 * @type {*[]}
		 */
		this.seeds = seeds;

		const mash = new Mash();
		/** @ignore */ this.#s0 = mash.random(" ");
		/** @ignore */ this.#s1 = mash.random(" ");
		/** @ignore */ this.#s2 = mash.random(" ");
		/** @ignore */ this.#c = 1;
		for (let i = 0; i < seeds.length; i++) {
			this.#s0 -= mash.random(seeds[i]);
			if (this.#s0 < 0) { this.#s0 += 1; }

			this.#s1 -= mash.random(seeds[i]);
			if (this.#s1 < 0) { this.#s1 += 1; }

			this.#s2 -= mash.random(seeds[i]);
			if (this.#s2 < 0) { this.#s2 += 1; }
		}
	}

	/**
	 * Returns an unsigned random integer in the range [0, 2^32].
	 * @return {number} A pseudo-random number.
	 */
	integer() {
		return this.#random() * 0x100000000; // 2^32
	}

	/**
	 * Returns a 53-bit fraction in the range [0, 1]. This is slower than getting an integer.
	 * @return {number} A pseudo-random number.
	 */
	fraction() {
		return random() + (random() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
	}

	#random() {
		const t = 2091639 * this.#s0 + this.#c * 2.3283064365386963e-10; // 2^-32
		this.#s0 = this.#s1;
		this.#s1 = this.#s2;
		return this.#s2 = t - (this.#c = t | 0);
	}
}