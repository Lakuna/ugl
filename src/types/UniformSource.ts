import type { UniformValue } from "#UniformValue";
import type UniformSourceObject from "#UniformSourceObject";

/** A source for uniform values. */
export type UniformSource = Map<string, UniformValue> | UniformSourceObject;
