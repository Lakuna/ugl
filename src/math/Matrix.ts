/** A matrix of any size. Immutable. */
export class Matrix extends Float32Array {
  constructor();

  constructor(...rows: number[][]);

  constructor(...values: number[]);

  constructor(...data: (number | number[])[]) {
    let expanded: number[];
    let rows: number;
    let columns: number;
    if (!data.length) {
      // constructor()
      expanded = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
      ];
      rows = 4;
      columns = 4;
    } else if (Array.isArray(data[0])) {
      // constructor(...rows: number[][])
      expanded = ([] as number[]).concat(...(data as number[][]));
      rows = data.length;
      columns = data[0].length;
    } else {
      // constructor(...values: number[])
      expanded = data as number[];
      rows = Math.sqrt(data.length);
      if (rows % 1) { throw new Error("Matrices declared from one set of numbers must be square."); }
      columns = rows;
    }
    super(expanded);
    this.rows = rows;
    this.columns = columns;
  }

  /** The number of rows in this matrix. */
  rows: number;

  /** The number of columns in this matrix. */
  columns: number;
}
