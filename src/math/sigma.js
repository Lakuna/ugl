export const sigma = (min, max, expression, output = 0) =>
  (output +=
    expression(min) +
    (min < max ? sigma(min + 1, max, expression, output) : 0));
