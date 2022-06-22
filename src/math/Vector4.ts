import { Vector } from "./Vector.js";
import { Quaternion } from "./Quaternion.js";

/** A collection of numbers arranged in one column with four rows. */
export class Vector4 extends Vector {
  /**
   * Creates a 4x1 vector with the given values.
   * @param x The first value.
   * @param y The second value.
   * @param z The third value.
   * @param w The fourth value.
   */
  public constructor(x = 0, y = 0, z = 0, w = 0) {
    super(4);
    this[0] = x;
    this[1] = y;
    this[2] = z;
    this[3] = w;
  }

  /**
   * Creates a new matrix with the same values as this one.
   * @returns A matrix.
   */
  public override clone(): Vector4 {
    return new Vector4(...(this as ArrayLike<number> as [number, number, number, number]));
  }

  /**
   * Multiplies this vector by a quaternion.
   * @param b The quaternion.
   * @returns The product.
   */
  public multiplyQuaternion(b: Quaternion): this {
    const qx: number = b[0] as number;
    const qy: number = b[1] as number;
    const qz: number = b[2] as number;
    const qw: number = b[3] as number;
    const x: number = this[0] as number;
    const y: number = this[1] as number;
    const z: number = this[2] as number;

    const ix: number = qw * x + qy * z - qz * y;
    const iy: number = qw * y + qz * x - qx * z;
    const iz: number = qw * z + qx * y - qy * x;
    const iw: number = -qx * x - qy * y - qz * z;

    this[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    this[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    this[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;

    return this;
  }
}
