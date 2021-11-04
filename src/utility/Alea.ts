import { Mash, SeedData } from "../index";

/** Seedable pseudo-random number generator by Johannes Baagøe. */
export class Alea {
	/** The version of the algorithm. */
	static readonly version = 0.9;

	#s0: number;
	#s1: number;
	#s2: number;
	#c: number;

	/**
	 * Creates an instance of Alea.
	 * @param seeds - A list of seeds for the PRNG.
	 */
	constructor(...seeds: SeedData[]) {
		if (!seeds.length) {
			seeds = [Date.now()];
		}

		this.seeds = seeds;

		const mash: Mash = new Mash();
		this.#s0 = mash.random(" ");
		this.#s1 = mash.random(" ");
		this.#s2 = mash.random(" ");
		for (let i = 0; i < seeds.length; i++) {
			this.#s0 -= mash.random(seeds[i]);
			if (this.#s0 < 0) {
				this.#s0 += 1;
			}

			this.#s1 -= mash.random(seeds[i]);
			if (this.#s1 < 0) {
				this.#s1 += 1;
			}

			this.#s2 -= mash.random(seeds[i]);
			if (this.#s2 < 0) {
				this.#s2 += 1;
			}
		}
		this.#c = 1;
	}

	/** The seeds of the instance. */
	readonly seeds: ReadonlyArray<SeedData>;

	/**
	 * Returns a fraction in the interval [0, 1).
	 * @returns A pseudo-random number.
	 */
	random(): number {
		const t: number = 2091639 * this.#s0 + this.#c * 2.3283064365386963e-10; // 2^-32
		this.#s0 = this.#s1;
		this.#s1 = this.#s2;
		return this.#s2 = t - (this.#c = t | 0);
	}

	/**
	 * Returns an unsigned random integer in the interval [0, 2^32).
	 * @returns A pseudo-random number.
	 */
	integer(): number {
		return this.random() * 0x100000000; // 2^32
	}

	/**
	 * Returns a 53-bit fraction in the interval [0, 1). This is slower than getting an integer.
	 * @returns A pseudo-random number.
	 */
	fraction(): number {
		return this.random() + (this.random() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
	}
}