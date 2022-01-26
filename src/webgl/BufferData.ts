import { Matrix } from "../math/Matrix.js";
import { Vector } from "../math/Vector.js";

/** Data that can be stored in a buffer. */
export type BufferData = number[] | Vector[] | Matrix[] | ArrayBuffer | ArrayBufferView | BufferSource;