Matrix
======

**Extends:** Array_

A rectangular array.

dim
---

**Type:** number

The width/height of this matrix if it is square.

set()
-----

**Parameters:**

- number[] **...data**

**Returns:** Matrix - Itself.

Sets the data in the matrix.

getPoint()
----------

**Parameters:**

- number **x**
- number **y**
- [number **width** = this.dim] - The width of this matrix.

**Returns:** number

Gets the value at the specified coordinates in this matrix.

setPoint()
----------

**Parameters:**

- number **x**
- number **y**
- number **value**
- [number **width** = this.dim] - The width of this matrix.

Sets the value at the specified coordinates in this matrix.

multiply()
----------

**Parameters:**

- Matrix **matrix**
- [number **m** = this.dim] - The width of this matrix and height of the other.

**Returns:** Matrix - Itself.

Multiplies two matrices together.

translate()
-----------

**Parameters:**

- **number** x
- **number** y
- **number** z

**Returns:** Matrix - Itself.

Translates this matrix by (x, y, z).

pitch()
-------

**Parameters:**

- number **degrees**

**Returns:** Matrix - Itself.

Rotates this matrix on the X axis.

yaw()
-----

**Parameters:**

- number **degrees**

**Returns:** Matrix - Itself.

Rotates this matrix on the Y axis.

roll()
------

**Parameters:**

- number **degrees**

**Returns:** Matrix - Itself.

Rotates this matrix on the Z axis.

rotate()
--------

**Parameters:**

- **number** x
- **number** y
- **number** z

**Returns:** Matrix - Itself.

Rotates this matrix by (x, y, z).

scale()
-------

**Parameters:**

- **number** x
- **number** y
- **number** z

**Returns:** Matrix - Itself.

Scales this matrix by (x, y, z).

invert()
--------

**Returns:** Matrix - Itself.

Inverts this matrix.

transpose()
-----------

**Parameters:**

- [number **width** = this.dim] - The width of this matrix.

**Returns:** Matrix - Itself.

Transposes this matrix.

orthographic()
--------------

**Parameters:**

- number **left** - The leftmost value of the canvas.
- number **right** - The rightmost value of the canvas.
- number **top** - The upper value of the canvas.
- number **bottom** - The lower value of the canvas.
- number **near** - The nearest distance that the camera can see.
- number **far** - The farthest distance that the camera can see.

**Returns:** Matrix - Itself.

Creates an orthographic projection.

perspective()
-------------

**Parameters:**

- number **fov** - The field of view of this camera in degrees.
- number **aspectRatio** - The aspect ratio of the canvas.
- number **near** - The nearest distance that the camera can see.
- number **far** - The farthest distance that the camera can see.

**Returns:** Matrix - Itself.

Creates a projection with perspective.

lookAt()
--------

**Parameters:**

- Vector_ **position** - The position of this matrix.
- Vector_ **target** - The position to look at.
- [Vector_ **up** = new Vector(0, 1, 0)] - The "up" direction.

**Returns:** Matrix - Itself.

Positions and rotates the matrix to look at a point.

Matrix.fromRule()
-----------------

**Parameters:**

- number **width** - The width of the output matrix.
- number **height** - The height of the output matrix.
- function(number **x**, number **y**) **rule**

**Returns:** Matrix

Follows a given rule for each index to create a new matrix.

.. code-block:: javascript
   
   console.log([...Matrix.fromRule(3, 3, (x, y) => x + y)]); // [2, 3, 4, 3, 4, 5, 4, 5, 6]

.. _Array: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
.. _Vector: ./Vector.html