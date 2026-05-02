import type BlendFunction from "../constants/BlendFunction.js";
import type BlendFunctionFullSet from "../types/BlendFunctionFullSet.js";

/**
 * Make a blend function full set.
 * @param srcRgb - The source RGB blend function.
 * @param dstRgb - The destination RGB blend function.
 * @param srcAlpha - The source alpha blend function. Uses the source RGB blend function if undefined.
 * @param dstAlpha - The destination alpha blend function. Uses the destination RGB blend function if undefined.
 * @returns The blend function full set.
 * @public
 */
export default function makeBlendFunctionFullSet(
	srcRgb: BlendFunction,
	dstRgb: BlendFunction,
	srcAlpha?: BlendFunction,
	dstAlpha?: BlendFunction
): BlendFunctionFullSet & Uint8Array {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
	return new Uint8Array([
		srcRgb,
		dstRgb,
		srcAlpha ?? srcRgb,
		dstAlpha ?? dstRgb
	]) as BlendFunctionFullSet & Uint8Array;
}
