import { Attribute } from "./Attribute.js";
import { Matrix } from "../math/Matrix.js";
import { Texture } from "./Texture.js";
import { Vector } from "../math/Vector.js";

/** Types of data that can be stored in a variable. */
export type VariableValue = number | number[] | Vector | Vector[] | Matrix | Matrix[] | Texture | Texture[] | Attribute;