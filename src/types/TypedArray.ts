import type { UintTypedArray } from "#UintTypedArray";
import type { IntTypedArray } from "#IntTypedArray";
import type { FloatTypedArray } from "#FloatTypedArray";

/** Array-like objects that provide a mechanism for reading and writing raw binary data in memory buffers. */
export type TypedArray = UintTypedArray | IntTypedArray | FloatTypedArray;
