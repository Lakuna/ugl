arrayFromRule()
===============

**Parameters:**

- number **length** - The length of the output array.
- function(number **i**) **rule** - The rule to follow.

**Returns:** number[] - The output array.

Follows a given rule for each index to create a new array.

.. code-block:: javascript
   
   console.log(arrayFromRule(5, (i) => i * 5)); // [0, 5, 10, 15, 20]