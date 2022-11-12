/** An iterable with known size. */
export default interface MeasuredIterable<T> extends Iterable<T>, ArrayLike<T> { }
