import { Transform } from "./Transform.js";
import { TRIANGLES } from "./constants.js";

// TODO: Can be a private static variable once Bundlephobia supports them.
let nextMeshId = 0;

export class Mesh extends Transform {
	constructor({ gl, geometry, program, mode = TRIANGLES, frustumCulled = true, renderOrder = 0 } = {}) {
		super();

		Object.assign(this, { gl, geometry, program, mode, frustumCulled, renderOrder, id: nextMeshId++,
			beforeRenderCallbacks: [], afterRenderCallbacks: [] });
	}

	draw(camera) {
		this.beforeRenderCallbacks.forEach((callback) => callback(this, camera));

		// Set some default uniform names.
		// TODO: Document special uniform names.
		if (camera) {
			const values = this.program.uniformValues;
			values.projectionMatrix.value = camera.projectionMatrix;
			values.cameraPosition.value = camera.worldPosition;
			values.viewMatrix.value = camera.viewMatrix;
			values.modelMatrix.value = this.worldMatrix;
			const modelViewMatrix = this.worldMatrix.multiply(camera.viewMatrix);
			values.modelViewMatrix.value = modelViewMatrix;
			values.normalMatrix.value = new Matrix(...modelViewMatrix).resize(3).invert().transpose();
		}

		this.program.use(this.program.cullFace && this.worldMatrix.determinant < 0);
		this.geometry.draw(this.program, this.mode);

		this.afterRenderCallbacks.forEach((callback) => callback(this, camera));
	}
}