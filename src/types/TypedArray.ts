import type { FloatTypedArray } from "#FloatTypedArray";
import type { IntTypedArray } from "#IntTypedArray";
import type { UintTypedArray } from "#UintTypedArray";

/**
 * Array-like objects that provide a mechanism for reading and writing raw
 * binary data in memory buffers.
 */
export type TypedArray = UintTypedArray | IntTypedArray | FloatTypedArray;
