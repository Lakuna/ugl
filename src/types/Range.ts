/** A range of numbers. */
export class Range extends Float32Array {
  /**
   * Creates a range.
   * @param start - The start of the range.
   * @param end - The end of the range.
   */
  constructor(start: number, end: number) {
    super([start, end]);
  }

  /** The start of the range. */
  get start(): number {
    return this[0] as number;
  }
  set range(value: number) {
    this[0] = value;
  }

  /** The end of the range. */
  get end(): number {
    return this[1] as number;
  }
  set end(value: number) {
    this[1] = value;
  }
}
