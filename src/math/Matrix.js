import { sigma } from "./sigma.js";
import { degreesToRadians } from "./degreesToRadians.js";
import { Vector } from "./Vector.js";

export class Matrix extends Array {
  set(...data) {
    while (this.length > 0) {
      this.pop();
    }
    for (const value of data) {
      this.push(value);
    }

    return this;
  }

  getPoint(x, y, width = this.dim) {
    return this[y * width + x];
  }

  setPoint(x, y, value, width = this.dim) {
    this[y * width + x] = value;
  }

  multiply(matrix, m = this.dim) {
    matrix = new Matrix(...matrix);

    const n = this.length / m;
    const p = matrix.length / m;

    return this.set(
      ...Matrix.fromRule(n, p, (i, j) =>
        sigma(0, m - 1, (k) => this.getPoint(i, k) * matrix.getPoint(k, j))
      )
    );
  }

  translate(x, y, z) {
    return this.multiply([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]);
  }

  pitch(degrees) {
    const radians = degreesToRadians(degrees);
    const cosine = Math.cos(radians);
    const sine = Math.sin(radians);

    return this.multiply([
      1,
      0,
      0,
      0,
      0,
      cosine,
      sine,
      0,
      0,
      -sine,
      cosine,
      0,
      0,
      0,
      0,
      1,
    ]);
  }

  yaw(degrees) {
    const radians = degreesToRadians(degrees);
    const cosine = Math.cos(radians);
    const sine = Math.sin(radians);

    return this.multiply([
      cosine,
      0,
      -sine,
      0,
      0,
      1,
      0,
      0,
      sine,
      0,
      cosine,
      0,
      0,
      0,
      0,
      1,
    ]);
  }

  roll(degrees) {
    const radians = degreesToRadians(degrees);
    const cosine = Math.cos(radians);
    const sine = Math.sin(radians);

    return this.multiply([
      cosine,
      sine,
      0,
      0,
      -sine,
      cosine,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
    ]);
  }

  rotate(x, y, z) {
    return this.pitch(x).yaw(y).roll(z);
  }

  scale(x, y, z) {
    return this.multiply([x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1]);
  }

  // Based on work by Andrew Ippoliti.
  invert() {
    const dim = this.dim;

    if (dim ** 2 != this.length) {
      throw new Error("Cannot invert a non-square matrix.");
    }

    const identity = Matrix.identity(dim);
    const copy = new Matrix(...this);

    for (let i = 0; i < dim; i++) {
      let diagonal = copy.getPoint(i, i);

      if (diagonal == 0) {
        for (let ii = i + 1; ii < dim; ii++) {
          if (copy.getPoint(ii, i) != 0) {
            for (let j = 0; j < dim; j++) {
              [copy, identity].forEach((matrix) => {
                let temp = matrix.getPoint(i, j);
                matrix.setPoint(i, j, matrix.getPoint(ii, j));
                matrix.setPoint(ii, j, temp);
              });
            }

            break;
          }
        }

        diagonal = copy.getPoint(i, i);
        if (diagonal == 0) {
          throw new Error("Matrix is not invertible.");
        }
      }

      for (let j = 0; j < dim; j++) {
        [copy, identity].forEach((matrix) =>
          matrix.setPoint(i, j, matrix.getPoint(i, j) / diagonal)
        );
      }

      for (let ii = 0; ii < dim; ii++) {
        if (ii == i) {
          continue;
        }

        let temp = copy.getPoint(ii, i);

        for (let j = 0; j < dim; j++) {
          [copy, identity].forEach((matrix) =>
            matrix.setPoint(
              ii,
              j,
              matrix.getPoint(ii, j) - temp * matrix.getPoint(i, j)
            )
          );
        }
      }
    }

    return this.set(...identity);
  }

  transpose(width = this.dim) {
    return this.set(
      ...Vector.fromRule(this.length, (i) =>
        this.getPoint(
          Math.floor(i / (this.length / width)),
          i % (this.length / width),
          width
        )
      )
    );
  }

  orthographic(left, right, top, bottom, near, far) {
    return this.multiply([
      2 / (right - left),
      0,
      0,
      0,
      0,
      2 / (top - bottom),
      0,
      0,
      0,
      0,
      2 / (near - far),
      0,
      (left + right) / (left - right),
      (bottom + top) / (bottom - top),
      (near + far) / (near - far),
      1,
    ]);
  }

  perspective(fov, aspectRatio, near, far) {
    const f = Math.tan(Math.PI * 0.5 - 0.5 * degreesToRadians(fov));
    const range = 1.0 / (near - far);

    return this.multiply([
      f / aspectRatio,
      0,
      0,
      0,
      0,
      f,
      0,
      0,
      0,
      0,
      (near + far) * range,
      -1,
      0,
      0,
      near * far * range * 2,
      0,
    ]);
  }

  lookAt(position, target, up = [0, 1, 0]) {
    const zAxis = new Vector(...position)
      .operate(target, (a, b) => a - b)
      .normalize();
    const xAxis = new Vector(...up).cross(zAxis).normalize();
    const yAxis = new Vector(...zAxis).cross(xAxis).normalize();

    return this.multiply([
      ...xAxis,
      0,
      ...yAxis,
      0,
      ...zAxis,
      0,
      ...position,
      1,
    ]);
  }

  get dim() {
    return Math.sqrt(this.length);
  }
}
Matrix.fromRule = (width, height, rule) => {
  let data = [];
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      data[y * width + x] = rule(x, y);
    }
  }
  return new Matrix(...data);
};
Matrix.identity = (dim = 4) =>
  Matrix.fromRule(dim, dim, (x, y) => (x == y ? 1 : 0));
