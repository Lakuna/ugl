/*
Not implemented from OGL:
- fromMat4				TODO
- fromQuat				TODO
- set					TODO
- identity				TODO
- transpose				TODO
- invert				TODO
- determinant			TODO
- multiply				TODO
- translate				TODO
- rotate				TODO
- scale					TODO
- normalFromMat4		TODO
- projection			TODO
- add					TODO
- subtract				TODO
- multiplyScalar		TODO
- getTranslation		TODO
- getScaling			TODO
- getMaxScaleOnAxis		TODO
- getRotation			TODO
- fromRotationTranslationScale	TODO
- fromQuat				TODO
- perspective			TODO
- ortho					TODO
- targetTo				TODO

Renamed from OGL:
- fromMat4				resize
- fromQuat				Quaternion.toMatrix
- copy					[...this]
- normalFromMat4		transpose.invert.resize
- projection			resize
- getTranslation		translation
- getScaling			scaling
- getMaxScaleOnAxis		maxScaleOnAxis
- getRotation			rotation
- fromRotationTranslationScale	fromVectors (?)
- ortho					orthographic
- targetTo				lookAt
*/

export class Matrix extends Array {

}