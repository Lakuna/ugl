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
exports.Matrix3 = void 0;
var gl_matrix_1 = require("gl-matrix");
/** A 3x3 matrix. */
var Matrix3 = /** @class */ (function (_super) {
    __extends(Matrix3, _super);
    function Matrix3(x0y0, x0y1, x0y2, x1y0, x1y1, x1y2, x2y0, x2y1, x2y2) {
        var _this = this;
        if (x0y0) {
            if (typeof x0y0 == "number") {
                _this = _super.call(this, [
                    x0y0, x0y1, x0y2,
                    x1y0, x1y1, x1y2,
                    x2y0, x2y1, x2y2
                ]) || this;
            }
            else {
                _this = _super.call(this, x0y0) || this;
            }
        }
        else {
            _this = _super.call(this, 9) || this;
            _this[0] = 1;
            _this[4] = 1;
            _this[8] = 1;
        }
        return _this;
    }
    /**
     * Copies the upper-left 3x3 values of a 4x4 matrix into this matrix.
     * @param m - The 4x4 matrix.
     * @returns This.
     */
    Matrix3.prototype.fromMatrix4 = function (m) {
        return gl_matrix_1.mat3.fromMat4(this, m);
    };
    /**
     * Copies the upper-left 3x3 values of a 4x4 matrix into a new matrix.
     * @param m - The 4x4 matrix.
     * @returns A matrix.
     */
    Matrix3.fromMatrix4 = function (m) {
        return new Matrix3().fromMatrix4(m);
    };
    Object.defineProperty(Matrix3.prototype, "clone", {
        /**
         * Creates a clone of this matrix.
         * @returns A clone of this matrix.
         */
        get: function () {
            return new Matrix3(this);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Copy the values from another matrix into this one.
     * @param m - The other matrix.
     * @returns This.
     */
    Matrix3.prototype.copy = function (m) {
        return gl_matrix_1.mat3.copy(this, m);
    };
    /**
     * Creates a copy of a matrix.
     * @param m - The matrix to copy.
     * @returns A copy of the matrix.
     */
    Matrix3.copy = function (m) {
        return new Matrix3(m);
    };
    /**
     * Creates a 3x3 matrix from values.
     * @param x0y0 - The value in the first row and first column.
     * @param x0y1 - The value in the second row and first column.
     * @param x0y2 - The value in the third row and first column.
     * @param x1y0 - The value in the first row and second column.
     * @param x1y1 - The value in the second row and second column.
     * @param x1y2 - The value in the third row and second column.
     * @param x2y0 - The value in the first row and third column.
     * @param x2y1 - The value in the second row and third column.
     * @param x2y2 - The value in the third row and third column.
     * @returns A matrix.
     */
    Matrix3.fromValues = function (x0y0, x0y1, x0y2, x1y0, x1y1, x1y2, x2y0, x2y1, x2y2) {
        return new Matrix3(x0y0, x0y1, x0y2, x1y0, x1y1, x1y2, x2y0, x2y1, x2y2);
    };
    /**
     * Sets the values in this matrix.
     * @param x0y0 - The value in the first row and first column.
     * @param x0y1 - The value in the second row and first column.
     * @param x0y2 - The value in the third row and first column.
     * @param x1y0 - The value in the first row and second column.
     * @param x1y1 - The value in the second row and second column.
     * @param x1y2 - The value in the third row and second column.
     * @param x2y0 - The value in the first row and third column.
     * @param x2y1 - The value in the second row and third column.
     * @param x2y2 - The value in the third row and third column.
     * @returns This.
     */
    Matrix3.prototype.setValues = function (x0y0, x0y1, x0y2, x1y0, x1y1, x1y2, x2y0, x2y1, x2y2) {
        return gl_matrix_1.mat3.set(this, x0y0, x0y1, x0y2, x1y0, x1y1, x1y2, x2y0, x2y1, x2y2);
    };
    /**
     * Resets this matrix to identity.
     * @returns This.
     */
    Matrix3.prototype.identity = function () {
        return gl_matrix_1.mat3.identity(this);
    };
    /**
     * Creates an identity matrix.
     * @returns An identity matrix.
     */
    Matrix3.identity = function () {
        return new Matrix3();
    };
    /**
     * Transposes this matrix.
     * @returns This.
     */
    Matrix3.prototype.transpose = function () {
        return gl_matrix_1.mat3.transpose(this, this);
    };
    /**
     * Inverts this matrix.
     * @returns This.
     */
    Matrix3.prototype.invert = function () {
        return gl_matrix_1.mat3.invert(this, this);
    };
    /**
     * Calculates the adjugate of this matrix.
     * @returns This.
     */
    Matrix3.prototype.adjoint = function () {
        return gl_matrix_1.mat3.adjoint(this, this);
    };
    Object.defineProperty(Matrix3.prototype, "determinant", {
        /** The determinant of this matrix. */
        get: function () {
            return gl_matrix_1.mat3.determinant(this);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Multiplies two matrices together.
     * @param m - The other matrix.
     * @returns This.
     */
    Matrix3.prototype.multiply = function (m) {
        return gl_matrix_1.mat3.multiply(this, this, m);
    };
    /**
     * Translates this matrix by the given vector.
     * @param v - The vector to translate by.
     * @returns This.
     */
    Matrix3.prototype.translate = function (v) {
        return gl_matrix_1.mat3.translate(this, this, v);
    };
    /**
     * Rotates this matrix by the given angle.
     * @param r - The angle to rotate by in radians.
     * @returns This.
     */
    Matrix3.prototype.rotate = function (r) {
        return gl_matrix_1.mat3.rotate(this, this, r);
    };
    /**
     * Scales this matrix by the given dimensions.
     * @param v - The vector to scale by.
     * @returns This.
     */
    Matrix3.prototype.scale = function (v) {
        return gl_matrix_1.mat3.scale(this, this, v);
    };
    /**
     * Sets the values of this matrix from a vector translation.
     * @param v - The translation vector.
     * @returns This.
     */
    Matrix3.prototype.fromTranslation = function (v) {
        return gl_matrix_1.mat3.fromTranslation(this, v);
    };
    /**
     * Creates a matrix from a translation.
     * @param v - The translation vector.
     * @returns A matrix.
     */
    Matrix3.fromTranslation = function (v) {
        return new Matrix3().fromTranslation(v);
    };
    /**
     * Sets the values of this matrix from a rotation.
     * @param r - The angle of rotation in radians.
     * @returns This.
     */
    Matrix3.prototype.fromRotation = function (r) {
        return gl_matrix_1.mat3.fromRotation(this, r);
    };
    /**
     * Creates a matrix from a rotation.
     * @param r - The angle of rotation in radians.
     * @returns A matrix.
     */
    Matrix3.fromRotation = function (r) {
        return new Matrix3().fromRotation(r);
    };
    /**
     * Sets the values of this matrix from a vector scaling.
     * @param v - The scaling vector.
     * @returns This.
     */
    Matrix3.prototype.fromScaling = function (v) {
        return gl_matrix_1.mat3.fromScaling(this, v);
    };
    /**
     * Creates a matrix from a vector scaling.
     * @param v - The scaling vector.
     * @returns A matrix.
     */
    Matrix3.fromScaling = function (v) {
        return new Matrix3().fromScaling(v);
    };
    /**
     * Sets the values of this matrix from a quaternion.
     * @param q - The quaternion.
     * @returns This.
     */
    Matrix3.prototype.fromQuaternion = function (q) {
        return gl_matrix_1.mat3.fromQuat(this, q);
    };
    /**
     * Calculates a matrix from a quaternion.
     * @param q - The quaternion.
     * @returns A matrix.
     */
    Matrix3.fromQuaternion = function (q) {
        return new Matrix3().fromQuaternion(q);
    };
    /**
     * Sets the values of this matrix to the normal matrix of a 4x4 matrix.
     * @param m - The 4x4 matrix.
     * @returns This.
     */
    Matrix3.prototype.normalFromMatrix4 = function (m) {
        return gl_matrix_1.mat3.normalFromMat4(this, m);
    };
    /**
     * Calculates a normal matrix from a 4x4 matrix.
     * @param m - The 4x4 matrix.
     * @returns A normal matrix.
     */
    Matrix3.normalFromMatrix4 = function (m) {
        return new Matrix3().normalFromMatrix4(m);
    };
    /**
     * Sets the values of this matrix to a 2D projection matrix.
     * @param width - The width of the projection.
     * @param height - The height of the projection.
     * @returns This.
     */
    Matrix3.prototype.projection = function (width, height) {
        return gl_matrix_1.mat3.projection(this, width, height);
    };
    /**
     * Generates a 2D projection matrix.
     * @param width - The width of the projection.
     * @param height - The height of the projection.
     * @returns A projection matrix.
     */
    Matrix3.projection = function (width, height) {
        return new Matrix3().projection(width, height);
    };
    Object.defineProperty(Matrix3.prototype, "frob", {
        /** The Frobenius normal of this matrix. */
        get: function () {
            return gl_matrix_1.mat3.frob(this);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Adds two matrices.
     * @param m - The other matrix.
     * @returns This.
     */
    Matrix3.prototype.add = function (m) {
        return gl_matrix_1.mat3.add(this, this, m);
    };
    /**
     * Subtracts another matrix from this one.
     * @param m - The other matrix.
     * @returns This.
     */
    Matrix3.prototype.subtract = function (m) {
        return gl_matrix_1.mat3.subtract(this, this, m);
    };
    /**
     * Multiplies each element of this matrix by a scalar.
     * @param s - The scalar.
     * @returns This.
     */
    Matrix3.prototype.multiplyScalar = function (s) {
        return gl_matrix_1.mat3.multiplyScalar(this, this, s);
    };
    /**
     * Checks if two matrices are equivalent.
     * @param m - The other matrix.
     * @return Whether the matrices are equivalent.
     */
    Matrix3.prototype.equals = function (m) {
        return gl_matrix_1.mat3.equals(this, m);
    };
    return Matrix3;
}(Float32Array));
exports.Matrix3 = Matrix3;
