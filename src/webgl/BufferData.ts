import { Matrix, Vector } from "../index.js";

/** Data that can be stored in a buffer. */
export type BufferData = number[] | Vector[] | Matrix[] | ArrayBuffer | ArrayBufferView | BufferSource;