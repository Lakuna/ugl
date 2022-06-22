/** An error caused by attempting to perform an operation using an incorrectly-sized matrix. */
export class MatrixSizeError extends Error {
  public constructor(message = "Incorrectly-sized matrix.") {
    super(message);
    this.name = "MatrixSizeError";
  }
}
