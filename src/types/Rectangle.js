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
exports.Rectangle = void 0;
/** A rectangle. */
var Rectangle = /** @class */ (function (_super) {
    __extends(Rectangle, _super);
    /**
     * Creates a rectangle.
     * @param x - The horizontal coordinate of the origin of the rectangle.
     * @param y - The vertical coordinate of the origin of the rectangle.
     * @param width - The horizontal size of the rectangle.
     * @param height - The vertical size of the rectangle.
     */
    function Rectangle(x, y, width, height) {
        return _super.call(this, [x, y, width, height]) || this;
    }
    Object.defineProperty(Rectangle.prototype, "x", {
        /** The horizontal coordinate of the origin of the rectangle. */
        get: function () {
            return this[0];
        },
        set: function (value) {
            this[0] = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "y", {
        /** The vertical coordinate of the origin of the rectangle. */
        get: function () {
            return this[1];
        },
        set: function (value) {
            this[1] = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "width", {
        /** The horizontal size of the rectangle. */
        get: function () {
            return this[2];
        },
        set: function (value) {
            this[2] = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "height", {
        /** The vertical size of the rectangle. */
        get: function () {
            return this[3];
        },
        set: function (value) {
            this[3] = value;
        },
        enumerable: false,
        configurable: true
    });
    return Rectangle;
}(Float32Array));
exports.Rectangle = Rectangle;
