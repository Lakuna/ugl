sigma()
=======

**Parameters:**

- number **min**
- number **max**
- function(number **n**) **expression**
- [number **output** = 0] - Used internally for recursion.

**Returns:** number

Calculates the sum of expression(n) for range (min - max).

.. code-block:: javascript
   
   console.log(sigma(1, 4, (n) => n)); // 1 + 2 + 3 + 4 = 10

   console.log(sigma(3, 6, (n) => n * 2)); // 6 + 8 + 10 + 12 = 36