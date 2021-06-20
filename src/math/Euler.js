import { Matrix } from "./Matrix.js";

/*
Not implemented from OGL:
- fromRotationMatrix	TODO
- fromQuaternion		TODO
- onChange				TODO
- order

Renamed from OGL:
- fromRotationMatrix	Matrix.toEuler
- fromQuaternion		Quaternion.toEuler
*/

// TODO: Check against: https://www.andre-gaschler.com/rotationconverter/

export class Euler extends Array { }