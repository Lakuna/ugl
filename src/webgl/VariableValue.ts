import { Attribute, Matrix, Texture, Vector } from "../index.js";

/** Types of data that can be stored in a variable. */
export type VariableValue = number | number[] | Vector | Vector[] | Matrix | Matrix[] | Texture | Texture[] | Attribute;