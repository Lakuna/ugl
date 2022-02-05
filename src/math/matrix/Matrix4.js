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
exports.Matrix4 = void 0;
var gl_matrix_1 = require("gl-matrix");
var Vector3_js_1 = require("../vector/Vector3.js");
var Quaternion_js_1 = require("../Quaternion.js");
/** A 4x4 matrix. */
var Matrix4 = /** @class */ (function (_super) {
    __extends(Matrix4, _super);
    function Matrix4(x0y0, x0y1, x0y2, x0y3, x1y0, x1y1, x1y2, x1y3, x2y0, x2y1, x2y2, x2y3, x3y0, x3y1, x3y2, x3y3) {
        var _this = this;
        if (x0y0) {
            if (typeof x0y0 == "number") {
                _this = _super.call(this, [
                    x0y0, x0y1, x0y2, x0y3,
                    x1y0, x1y1, x1y2, x1y3,
                    x2y0, x2y1, x2y2, x2y3,
                    x3y0, x3y1, x3y2, x3y3
                ]) || this;
            }
            else {
                _this = _super.call(this, x0y0) || this;
            }
        }
        else {
            _this = _super.call(this, 9) || this;
            _this[0] = 1;
            _this[5] = 1;
            _this[10] = 1;
            _this[15] = 1;
        }
        return _this;
    }
    Object.defineProperty(Matrix4.prototype, "clone", {
        /**
         * Creates a clone of this matrix.
         * @returns A clone of this matrix.
         */
        get: function () {
            return new Matrix4(this);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Copy the values from another matrix into this one.
     * @param m - The other matrix.
     * @returns This.
     */
    Matrix4.prototype.copy = function (m) {
        return gl_matrix_1.mat4.copy(this, m);
    };
    /**
     * Creates a 3x3 matrix from values.
     * @param x0y0 - The value in the first row and first column.
     * @param x0y1 - The value in the second row and first column.
     * @param x0y2 - The value in the third row and first column.
     * @param x0y3 - The value in the fourth row and first column.
     * @param x1y0 - The value in the first row and second column.
     * @param x1y1 - The value in the second row and second column.
     * @param x1y2 - The value in the third row and second column.
     * @param x1y3 - The value in the fourth row and second column.
     * @param x2y0 - The value in the first row and third column.
     * @param x2y1 - The value in the second row and third column.
     * @param x2y2 - The value in the third row and third column.
     * @param x2y3 - The value in the fourth row and third column.
     * @param x3y0 - The value in the first row and fourth column.
     * @param x3y1 - The value in the second row and fourth column.
     * @param x3y2 - The value in the third row and fourth column.
     * @param x3y3 - The value in the fourth row and fourth column.
     * @returns A matrix.
     */
    Matrix4.fromValues = function (x0y0, x0y1, x0y2, x0y3, x1y0, x1y1, x1y2, x1y3, x2y0, x2y1, x2y2, x2y3, x3y0, x3y1, x3y2, x3y3) {
        return new Matrix4(x0y0, x0y1, x0y2, x0y3, x1y0, x1y1, x1y2, x1y3, x2y0, x2y1, x2y2, x2y3, x3y0, x3y1, x3y2, x3y3);
    };
    /**
     * Sets the values in this matrix.
     * @param x0y0 - The value in the first row and first column.
     * @param x0y1 - The value in the second row and first column.
     * @param x0y2 - The value in the third row and first column.
     * @param x0y3 - The value in the fourth row and first column.
     * @param x1y0 - The value in the first row and second column.
     * @param x1y1 - The value in the second row and second column.
     * @param x1y2 - The value in the third row and second column.
     * @param x1y3 - The value in the fourth row and second column.
     * @param x2y0 - The value in the first row and third column.
     * @param x2y1 - The value in the second row and third column.
     * @param x2y2 - The value in the third row and third column.
     * @param x2y3 - The value in the fourth row and third column.
     * @param x3y0 - The value in the first row and fourth column.
     * @param x3y1 - The value in the second row and fourth column.
     * @param x3y2 - The value in the third row and fourth column.
     * @param x3y3 - The value in the fourth row and fourth column.
     * @returns This.
     */
    Matrix4.prototype.setValues = function (x0y0, x0y1, x0y2, x0y3, x1y0, x1y1, x1y2, x1y3, x2y0, x2y1, x2y2, x2y3, x3y0, x3y1, x3y2, x3y3) {
        return gl_matrix_1.mat4.set(this, x0y0, x0y1, x0y2, x0y3, x1y0, x1y1, x1y2, x1y3, x2y0, x2y1, x2y2, x2y3, x3y0, x3y1, x3y2, x3y3);
    };
    /**
     * Resets this matrix to identity.
     * @returns This.
     */
    Matrix4.prototype.identity = function () {
        return gl_matrix_1.mat4.identity(this);
    };
    /**
     * Creates an identity matrix.
     * @returns An identity matrix.
     */
    Matrix4.identity = function () {
        return new Matrix4();
    };
    /**
     * Transposes this matrix.
     * @returns This.
     */
    Matrix4.prototype.transpose = function () {
        return gl_matrix_1.mat4.transpose(this, this);
    };
    /**
     * Inverts this matrix.
     * @returns This.
     */
    Matrix4.prototype.invert = function () {
        return gl_matrix_1.mat4.invert(this, this);
    };
    /**
     * Calculates the adjugate of this matrix.
     * @returns This.
     */
    Matrix4.prototype.adjoint = function () {
        return gl_matrix_1.mat4.adjoint(this, this);
    };
    Object.defineProperty(Matrix4.prototype, "determinant", {
        /** The determinant of this matrix. */
        get: function () {
            return gl_matrix_1.mat4.determinant(this);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Multiplies two matrices together.
     * @param m - The other matrix.
     * @returns This.
     */
    Matrix4.prototype.multiply = function (m) {
        return gl_matrix_1.mat4.multiply(this, this, m);
    };
    /**
     * Translates this matrix by the given vector.
     * @param v - The vector to translate by.
     * @returns This.
     */
    Matrix4.prototype.translate = function (v) {
        return gl_matrix_1.mat4.translate(this, this, v);
    };
    /**
     * Scales this matrix by the given dimensions.
     * @param v - The vector to scale by.
     * @returns This.
     */
    Matrix4.prototype.scale = function (v) {
        return gl_matrix_1.mat4.scale(this, this, v);
    };
    /**
     * Rotates this matrix by the given angle around the given axis.
     * @param r - The angle to rotate by in radians.
     * @param a - The axis to rotate around.
     * @returns This.
     */
    Matrix4.prototype.rotate = function (r, a) {
        return gl_matrix_1.mat4.rotate(this, this, r, a);
    };
    /**
     * Rotates this matrix by the given angle around the X axis.
     * @param r - The angle to rotate by in radians.
     * @returns This.
     */
    Matrix4.prototype.rotateX = function (r) {
        return gl_matrix_1.mat4.rotateX(this, this, r);
    };
    /**
     * Rotates this matrix by the given angle around the Y axis.
     * @param r - The angle to rotate by in radians.
     * @returns This.
     */
    Matrix4.prototype.rotateY = function (r) {
        return gl_matrix_1.mat4.rotateY(this, this, r);
    };
    /**
     * Rotates this matrix by the given angle around the Z axis.
     * @param r - The angle to rotate by in radians.
     * @returns This.
     */
    Matrix4.prototype.rotateZ = function (r) {
        return gl_matrix_1.mat4.rotateZ(this, this, r);
    };
    /**
     * Sets the values of this matrix from a vector translation.
     * @param v - The translation vector.
     * @returns This.
     */
    Matrix4.prototype.fromTranslation = function (v) {
        return gl_matrix_1.mat4.fromTranslation(this, v);
    };
    /**
     * Creates a matrix from a translation.
     * @param v - The translation vector.
     * @returns A matrix.
     */
    Matrix4.fromTranslation = function (v) {
        return new Matrix4().fromTranslation(v);
    };
    /**
     * Sets the values of this matrix from a vector scaling.
     * @param v - The scaling vector.
     * @returns This.
     */
    Matrix4.prototype.fromScaling = function (v) {
        return gl_matrix_1.mat4.fromScaling(this, v);
    };
    /**
     * Creates a matrix from a vector scaling.
     * @param v - The scaling vector.
     * @returns A matrix.
     */
    Matrix4.fromScaling = function (v) {
        return new Matrix4().fromScaling(v);
    };
    /**
     * Sets the values of this matrix from a rotation around the given axis.
     * @param r - The angle of rotation in radians.
     * @param a - The axis to rotate around.
     * @returns This.
     */
    Matrix4.prototype.fromRotation = function (r, a) {
        return gl_matrix_1.mat4.fromRotation(this, r, a);
    };
    /**
     * Creates a matrix from a rotation around the given axis.
     * @param r - The angle of rotation in radians.
     * @param a - The axis to rotate around.
     * @returns A matrix.
     */
    Matrix4.fromRotation = function (r, a) {
        return new Matrix4().fromRotation(r, a);
    };
    /**
     * Sets the values of this matrix from a rotation around the X axis.
     * @param r - The angle of rotation in radians.
     * @returns This.
     */
    Matrix4.prototype.fromXRotation = function (r) {
        return gl_matrix_1.mat4.fromXRotation(this, r);
    };
    /**
     * Creates a matrix from a rotation around the X axis.
     * @param r - The angle of rotation in radians.
     * @returns A matrix.
     */
    Matrix4.fromXRotation = function (r) {
        return new Matrix4().fromXRotation(r);
    };
    /**
     * Sets the values of this matrix from a rotation around the Y axis.
     * @param r - The angle of rotation in radians.
     * @returns This.
     */
    Matrix4.prototype.fromYRotation = function (r) {
        return gl_matrix_1.mat4.fromYRotation(this, r);
    };
    /**
     * Creates a matrix from a rotation around the Y axis.
     * @param r - The angle of rotation in radians.
     * @returns A matrix.
     */
    Matrix4.fromYRotation = function (r) {
        return new Matrix4().fromYRotation(r);
    };
    /**
     * Sets the values of this matrix from a rotation around the Z axis.
     * @param r - The angle of rotation in radians.
     * @returns This.
     */
    Matrix4.prototype.fromZRotation = function (r) {
        return gl_matrix_1.mat4.fromZRotation(this, r);
    };
    /**
     * Creates a matrix from a rotation around the Z axis.
     * @param r - The angle of rotation in radians.
     * @returns A matrix.
     */
    Matrix4.fromZRotation = function (r) {
        return new Matrix4().fromZRotation(r);
    };
    /**
     * Sets the values of this matrix from a quaternion rotation and a vector translation.
     * @param q - The rotation quaternion.
     * @param v - The translation vector.
     * @returns This.
     */
    Matrix4.prototype.fromRotationTranslation = function (q, v) {
        return gl_matrix_1.mat4.fromRotationTranslation(this, q, v);
    };
    /**
     * Creates a matrix from a quaternion rotation and a vector translation.
     * @param q - The rotation quaternion.
     * @param v - The translation vector.
     * @returns A matrix.
     */
    Matrix4.fromRotationTranslation = function (q, v) {
        return new Matrix4().fromRotationTranslation(q, v);
    };
    Object.defineProperty(Matrix4.prototype, "translation", {
        /** The translation vector component of a transformation matrix. */
        get: function () {
            return gl_matrix_1.mat4.getTranslation(new Vector3_js_1.Vector3(), this);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Matrix4.prototype, "scaling", {
        /** The scaling factor component of a transformation matrix. */
        get: function () {
            return gl_matrix_1.mat4.getScaling(new Vector3_js_1.Vector3(), this);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Matrix4.prototype, "rotation", {
        /** A quaternion representing the rotational component of a transformation matrix. */
        get: function () {
            return gl_matrix_1.mat4.getRotation(new Quaternion_js_1.Quaternion(), this);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Sets the values of this matrix from a quaternion rotation, a vector translation, and a vector scale.
     * @param q - The rotation quaternion.
     * @param v - The translation vector.
     * @param s - The scaling vector.
     * @returns This.
     */
    Matrix4.prototype.fromRotationTranslationScale = function (q, v, s) {
        return gl_matrix_1.mat4.fromRotationTranslationScale(this, q, v, s);
    };
    /**
     * Creates a matrix from a quaternion rotation, a vector translation, and a vector scale.
     * @param q - The rotation quaternion.
     * @param v - The translation vector.
     * @param s - The scaling vector.
     * @returns A matrix.
     */
    Matrix4.fromRotationTranslationScale = function (q, v, s) {
        return new Matrix4().fromRotationTranslationScale(q, v, s);
    };
    /**
     * Sets the values of this matrix from a quaternion rotation, a vector translation, and a vector scale. Rotated and scaled around an origin.
     * @param q - The rotation quaternion.
     * @param v - The translation vector.
     * @param s - The scaling vector.
     * @param o - The origin around which to scale and rotate.
     * @returns This.
     */
    Matrix4.prototype.fromRotationTranslationScaleOrigin = function (q, v, s, o) {
        return gl_matrix_1.mat4.fromRotationTranslationScaleOrigin(this, q, v, s, o);
    };
    /**
     * Creates a matrix from a quaternion rotation, a vector translation, and a vector scale. Rotated and scaled around an origin.
     * @param q - The rotation quaternion.
     * @param v - The translation vector.
     * @param s - The scaling vector.
     * @param o - The origin around which to scale and rotate.
     * @returns A matrix.
     */
    Matrix4.fromRotationTranslationScaleOrigin = function (q, v, s, o) {
        return new Matrix4().fromRotationTranslationScaleOrigin(q, v, s, o);
    };
    /**
     * Sets the values of this matrix from a quaternion.
     * @param q - The quaternion.
     * @returns This.
     */
    Matrix4.prototype.fromQuaternion = function (q) {
        return gl_matrix_1.mat4.fromQuat(this, q);
    };
    /**
     * Calculates a matrix from a quaternion.
     * @param q - The quaternion.
     * @returns A matrix.
     */
    Matrix4.fromQuaternion = function (q) {
        return new Matrix4().fromQuaternion(q);
    };
    /**
     * Sets the values of this matrix to a frustum.
     * @param left - The left bound of the frustum.
     * @param right - The right bound of the frustum.
     * @param bottom - The bottom bound of the frustum.
     * @param top - The top bound of the frustum.
     * @param near - The near bound of the frustum.
     * @param far - The far bound of the frustum.
     * @returns This.
     */
    Matrix4.prototype.frustum = function (left, right, bottom, top, near, far) {
        return gl_matrix_1.mat4.frustum(this, left, right, bottom, top, near, far);
    };
    /**
     * Generates a frustum matrix.
     * @param left - The left bound of the frustum.
     * @param right - The right bound of the frustum.
     * @param bottom - The bottom bound of the frustum.
     * @param top - The top bound of the frustum.
     * @param near - The near bound of the frustum.
     * @param far - The far bound of the frustum.
     * @returns A matrix.
     */
    Matrix4.frustum = function (left, right, bottom, top, near, far) {
        return new Matrix4().frustum(left, right, bottom, top, near, far);
    };
    /**
     * Sets the values of this matrix to a perspective projection.
     * @param fovy - The vertical field of view in radians.
     * @param aspect - The aspect ratio.
     * @param near - The near bound of the frustum.
     * @param far - The far bound of the frustum. Defaults to infinity.
     * @returns This.
     */
    Matrix4.prototype.perspective = function (fovy, aspect, near, far) {
        return gl_matrix_1.mat4.perspective(this, fovy, aspect, near, far !== null && far !== void 0 ? far : Infinity);
    };
    /**
     * Generates a perspective projection matrix.
     * @param fovy - The vertical field of view in radians.
     * @param aspect - The aspect ratio.
     * @param near - The near bound of the frustum.
     * @param far - The far bound of the frustum. Defaults to infinity.
     * @returns This.
     */
    Matrix4.perspective = function (fovy, aspect, near, far) {
        return new Matrix4().perspective(fovy, aspect, near, far);
    };
    /**
     * Sets the values of this matrix to a perspective projection generated from a field of view. For use with the WebXR API.
     * @param up - The angle to the top of the field of view in degrees.
     * @param down - The angle to the bottom of the field of view in degrees.
     * @param left - The angle to the left side of the field of view in degrees.
     * @param right - The angle to the right side of the field of view in degrees.
     * @param near - The near bound of the frustum.
     * @param far - The far bound of the frustum.
     * @returns This.
     */
    Matrix4.prototype.perspectiveFromFieldOfView = function (up, down, left, right, near, far) {
        return gl_matrix_1.mat4.perspectiveFromFieldOfView(this, { upDegrees: up, downDegrees: down, leftDegrees: left, rightDegrees: right }, near, far);
    };
    /**
     * Generates a perspective projection matrix from a field of view. For use with the WebXR API.
     * @param up - The angle to the top of the field of view in degrees.
     * @param down - The angle to the bottom of the field of view in degrees.
     * @param left - The angle to the left side of the field of view in degrees.
     * @param right - The angle to the right side of the field of view in degrees.
     * @param near - The near bound of the frustum.
     * @param far - The far bound of the frustum.
     * @returns A perspective projection matrix.
     */
    Matrix4.perspectiveFromFieldOfView = function (up, down, left, right, near, far) {
        return new Matrix4().perspectiveFromFieldOfView(up, down, left, right, near, far);
    };
    /**
     * Sets the values of this matrix to an orthogonal projection.
     * @param left - The left bound of the frustum.
     * @param right - The right bound of the frustum.
     * @param bottom - The bottom bound of the frustum.
     * @param top - The top bound of the frustum.
     * @param near - The near bound of the frustum.
     * @param far - The far bound of the frustum.
     * @returns This.
     */
    Matrix4.prototype.orthogonal = function (left, right, bottom, top, near, far) {
        return gl_matrix_1.mat4.ortho(this, left, right, bottom, top, near, far);
    };
    /**
     * Generates an orthogonal projection matrix.
     * @param left - The left bound of the frustum.
     * @param right - The right bound of the frustum.
     * @param bottom - The bottom bound of the frustum.
     * @param top - The top bound of the frustum.
     * @param near - The near bound of the frustum.
     * @param far - The far bound of the frustum.
     * @returns This.
     */
    Matrix4.orthogonal = function (left, right, bottom, top, near, far) {
        return new Matrix4().orthogonal(left, right, bottom, top, near, far);
    };
    /**
     * Sets the values of this matrix to a look-at matrix. If you want a matrix that actually makes an object look at another object, use `targetTo` instead.
     * @param eye - The position of the viewer.
     * @param center - The point that the viewer is looking at.
     * @param up - A vector pointing up.
     * @returns This.
     */
    Matrix4.prototype.lookAt = function (eye, center, up) {
        if (up === void 0) { up = [0, 1, 0]; }
        return gl_matrix_1.mat4.lookAt(this, eye, center, up);
    };
    /**
     * Generates a look-at matrix. If you want a matrix that actually makes an object look at another object, use `targetTo` instead.
     * @param eye - The position of the viewer.
     * @param center - The point that the viewer is looking at.
     * @param up - A vector pointing up.
     * @returns A look-at matrix.
     */
    Matrix4.lookAt = function (eye, center, up) {
        if (up === void 0) { up = [0, 1, 0]; }
        return new Matrix4().lookAt(eye, center, up);
    };
    /**
     * Sets the values of this matrix to make something look at something else.
     * @param eye - The position of the viewer.
     * @param target - The point that the viewer is looking at.
     * @param up - A vector pointing up.
     * @returns This.
     */
    Matrix4.prototype.targetTo = function (eye, target, up) {
        if (up === void 0) { up = [0, 1, 0]; }
        return gl_matrix_1.mat4.targetTo(this, eye, target, up);
    };
    /**
     * Generates a matrix that makes something look at something else.
     * @param eye - The position of the viewer.
     * @param target - The point that the viewer is looking at.
     * @param up - A vector pointing up.
     * @returns This.
     */
    Matrix4.targetTo = function (eye, target, up) {
        if (up === void 0) { up = [0, 1, 0]; }
        return new Matrix4().targetTo(eye, target, up);
    };
    Object.defineProperty(Matrix4.prototype, "frob", {
        /** The Frobenius normal of this matrix. */
        get: function () {
            return gl_matrix_1.mat4.frob(this);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Adds two matrices.
     * @param m - The other matrix.
     * @returns This.
     */
    Matrix4.prototype.add = function (m) {
        return gl_matrix_1.mat4.add(this, this, m);
    };
    /**
     * Subtracts another matrix from this one.
     * @param m - The other matrix.
     * @returns This.
     */
    Matrix4.prototype.subtract = function (m) {
        return gl_matrix_1.mat4.subtract(this, this, m);
    };
    /**
     * Multiplies each element of this matrix by a scalar.
     * @param s - The scalar.
     * @returns This.
     */
    Matrix4.prototype.multiplyScalar = function (s) {
        return gl_matrix_1.mat4.multiplyScalar(this, this, s);
    };
    /**
     * Checks if two matrices are equivalent.
     * @param m - The other matrix.
     * @return Whether the matrices are equivalent.
     */
    Matrix4.prototype.equals = function (m) {
        return gl_matrix_1.mat4.equals(this, m);
    };
    return Matrix4;
}(Float32Array));
exports.Matrix4 = Matrix4;
