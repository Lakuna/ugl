Vector
======

**Extends:** Array_

A value with direction and magnitude.

magnitude
---------

**Type:** number

The magnitude (length; size) of this vector.

set()
-----

**Parameters:**

- number[] **...data**

**Returns:** Vector - Itself.

Sets the data in the vector.

cross()
-------

**Parameters:**

- Vector **vector**

**Returns:** Vector - Itself.

Calculates the cross product of two vectors.

operate()
---------

**Parameters:**

- Vector **vector**
- function(number **a**, number **b**) **operation**

**Returns:** Vector - Itself.

Performs an operation between two vectors.

.. code-block:: javascript
   
   // Addition
   console.log([...new Vector(1, 2, 3).operate(new Vector(1, 2, 3), (a, b) => a + b)]); // [2, 4, 6]

   // Subtraction
   console.log([...new Vector(1, 2, 3).operate(new Vector(1, 2, 3), (a, b) => a - b)]); // [0, 0, 0]

   // Multiplication
   console.log([...new Vector(1, 2, 3).operate(new Vector(1, 2, 3), (a, b) => a * b)]); // [1, 4, 9]

   // Division
   console.log([...new Vector(1, 2, 3).operate(new Vector(1, 2, 3), (a, b) => a / b)]); // [1, 1, 1]

normalize()
-----------

**Returns:** Vector - Itself.

Normalizes the vector so that it has a magnitude of 1 while maintaining its direction.

.. _Array: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array