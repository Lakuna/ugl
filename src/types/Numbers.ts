import { Rectangle } from "./Rectangle.js";
import { Matrix2 } from "../math/matrix/Matrix2.js";

/** Two numbers. */
export type Numbers1x2 = [number, number];

/** Three numbers. */
export type Numbers1x3 = [number, number, number];

/** Four numbers. */
export type Numbers1x4 = Rectangle | [number, number, number, number];

/** Two rows of two numbers. */
export type Numbers2x2 = Matrix2 | [
  number, number,
  number, number
];

/** Three rows of three numbers. */
export type Numbers3x3 = [
  number, number, number,
  number, number, number,
  number, number, number
];

/** Four rows of four numbers. */
export type Numbers4x4 = [
  number, number, number, number,
  number, number, number, number,
  number, number, number, number,
  number, number, number, number
];
