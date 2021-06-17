Matrix
======

**Extends:** Array_

A rectangular array.

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