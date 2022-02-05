"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.Matrix2 = void 0;
var gl_matrix_1 = require("gl-matrix");
/** A 2x2 matrix. */
var Matrix2 = /** @class */ (function (_super) {
    __extends(Matrix2, _super);
    function Matrix2(x0y0, x0y1, x1y0, x1y1) {
        var _this = this;
        if (x0y0) {
            if (typeof x0y0 == "number") {
                _this = _super.call(this, [
                    x0y0, x0y1,
                    x1y0, x1y1
                ]) || this;
            }
            else {
                _this = _super.call(this, x0y0) || this;
            }
        }
        else {
            _this = _super.call(this, 4) || this;
            _this[0] = 1;
            _this[3] = 1;
        }
        return _this;
    }
    Object.defineProperty(Matrix2.prototype, "clone", {
        /** A clone of this matrix. */
        get: function () {
            return new Matrix2(this);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Copy the values from another matrix into this one.
     * @param m - The other matrix.
     * @returns This.
     */
    Matrix2.prototype.copy = function (m) {
        return gl_matrix_1.mat2.copy(this, m);
    };
    /**
     * Creates a copy of a matrix.
     * @param m - The matrix to copy.
     * @returns A copy of the matrix.
     */
    Matrix2.copy = function (m) {
        return new Matrix2(m);
    };
    /**
     * Resets this matrix to identity.
     * @returns This.
     */
    Matrix2.prototype.identity = function () {
        return gl_matrix_1.mat2.identity(this);
    };
    /**
     * Creates an identity matrix.
     * @returns An identity matrix.
     */
    Matrix2.identity = function () {
        return new Matrix2();
    };
    /**
     * Creates a 2x2 matrix from values.
     * @param x0y0 - The value in the first row and first column.
     * @param x0y1 - The value in the second row and first column.
     * @param x1y0 - The value in the first row and second column.
     * @param x1y1 - The value in the second row and second column.
     * @returns A matrix.
     */
    Matrix2.fromValues = function (x0y0, x0y1, x1y0, x1y1) {
        return new Matrix2(x0y0, x0y1, x1y0, x1y1);
    };
    /**
     * Sets the values in this matrix.
     * @param x0y0 - The value in the first row and first column.
     * @param x0y1 - The value in the second row and first column.
     * @param x1y0 - The value in the first row and second column.
     * @param x1y1 - The value in the second row and second column.
     * @returns This.
     */
    Matrix2.prototype.setValues = function (x0y0, x0y1, x1y0, x1y1) {
        return gl_matrix_1.mat2.set(this, x0y0, x0y1, x1y0, x1y1);
    };
    /**
     * Transposes this matrix.
     * @returns This.
     */
    Matrix2.prototype.transpose = function () {
        return gl_matrix_1.mat2.transpose(this, this);
    };
    /**
     * Inverts this matrix.
     * @returns This.
     */
    Matrix2.prototype.invert = function () {
        return gl_matrix_1.mat2.invert(this, this);
    };
    /**
     * Calculates the adjugate of this matrix.
     * @returns This.
     */
    Matrix2.prototype.adjoint = function () {
        return gl_matrix_1.mat2.adjoint(this, this);
    };
    Object.defineProperty(Matrix2.prototype, "determinant", {
        /** The determinant of this matrix. */
        get: function () {
            return gl_matrix_1.mat2.determinant(this);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Multiplies two matrices together.
     * @param m - The other matrix.
     * @returns This.
     */
    Matrix2.prototype.multiply = function (m) {
        return gl_matrix_1.mat2.multiply(this, this, m);
    };
    /**
     * Rotates this matrix by the given angle.
     * @param r - The angle to rotate by in radians.
     * @returns This.
     */
    Matrix2.prototype.rotate = function (r) {
        return gl_matrix_1.mat2.rotate(this, this, r);
    };
    /**
     * Scales this matrix by the given dimensions.
     * @param v - The vector to scale by.
     * @returns This.
     */
    Matrix2.prototype.scale = function (v) {
        return gl_matrix_1.mat2.scale(this, this, v);
    };
    /**
     * Sets the values of this matrix from a rotation.
     * @param r - The angle of rotation in radians.
     * @returns This.
     */
    Matrix2.prototype.fromRotation = function (r) {
        return gl_matrix_1.mat2.fromRotation(this, r);
    };
    /**
     * Creates a matrix from a rotation.
     * @param r - The angle of rotation in radians.
     * @returns A matrix.
     */
    Matrix2.fromRotation = function (r) {
        return new Matrix2().fromRotation(r);
    };
    /**
     * Sets the values of this matrix from a vector scaling.
     * @param v - The scaling vector.
     * @returns This.
     */
    Matrix2.prototype.fromScaling = function (v) {
        return gl_matrix_1.mat2.fromScaling(this, v);
    };
    /**
     * Creates a matrix from a vector scaling.
     * @param v - The scaling vector.
     * @returns A matrix.
     */
    Matrix2.fromScaling = function (v) {
        return new Matrix2().fromScaling(v);
    };
    Object.defineProperty(Matrix2.prototype, "frob", {
        /** The Frobenius normal of this matrix. */
        get: function () {
            return gl_matrix_1.mat2.frob(this);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Adds two matrices.
     * @param m - The other matrix.
     * @returns This.
     */
    Matrix2.prototype.add = function (m) {
        return gl_matrix_1.mat2.add(this, this, m);
    };
    /**
     * Subtracts another matrix from this one.
     * @param m - The other matrix.
     * @returns This.
     */
    Matrix2.prototype.subtract = function (m) {
        return gl_matrix_1.mat2.subtract(this, this, m);
    };
    /**
     * Checks if two matrices are equivalent.
     * @param m - The other matrix.
     * @return Whether the matrices are equivalent.
     */
    Matrix2.prototype.equals = function (m) {
        return gl_matrix_1.mat2.equals(this, m);
    };
    /**
     * Multiplies each element of this matrix by a scalar.
     * @param s - The scalar.
     * @returns This.
     */
    Matrix2.prototype.multiplyScalar = function (s) {
        return gl_matrix_1.mat2.multiplyScalar(this, this, s);
    };
    return Matrix2;
}(Float32Array));
exports.Matrix2 = Matrix2;
