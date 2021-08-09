import { Transform } from "./Transform.js";

export class Mesh extends Transform {
	static #nextMeshId = 0;

	static getRenderList(scene, camera) {
		const renderList = [];

		// Get a list of all GameObjects with visible Mesh Components in the scene.
		scene.traverse((gameObject) => {
			const mesh = gameObject.getComponent(Mesh);
			if (mesh?.visible) {
				renderList.push(mesh);
			}
		});

		// Create lists for each render group.
		const opaqueRenderGroup = [];
		const transparentRenderGroup = [];
		const interfaceRenderGroup = [];

		// Depth map for sorting within render groups.
		const depthMap = new Map();

		// Sort every Mesh into a render group.
		renderList.forEach((mesh) => {
			if (!mesh.vao.program.allowTransparent) {
				opaqueRenderGroup.push(mesh);
			} else if (mesh.vao.program.allowDepth) {
				transparentRenderGroup.push(mesh);
			} else {
				interfaceRenderGroup.push(mesh);
			}

			// Calculate depth.
			depthMap.set(mesh, (mesh.renderOrder != 0 || !mesh.vao.program.allowDepth || !camera)
				? 0
				: mesh.worldMatrix.translation.transform(camera.projectionViewMatrix)[2]);
		});

		// Sort within each render group.
		opaqueRenderGroup.sort((a, b) => a.renderOrder - b.renderOrder || a.vao.program.id - b.vao.program.id || depthMap.get(a) - depthMap.get(b) || b.id - a.id);
		transparentRenderGroup.sort((a, b) => a.renderOrder - b.renderOrder || depthMap.get(b) - depthMap.get(a) || b.id - a.id);
		interfaceRenderGroup.sort((a, b) => a.renderOrder - b.renderOrder || a.vao.program.id - b.vao.program.id || b.id - a.id);

		// Concatenate the lists and return the resultant complete render list.
		return opaqueRenderGroup.concat(transparentRenderGroup, interfaceRenderGroup);
	}

	constructor(vao, visible = true, renderOrder = 0) {
		super();

		Object.defineProperties(this, {
			vao: { value: vao },
			visible: { value: visible, writable: true },
			renderOrder: { value: renderOrder, writable: true },
			id: { value: Mesh.#nextMeshId++ }
		});
	}

	get worldInverseTransposeMatrix() {
		return this.worldMatrix.invert().transpose();
	}

	worldViewProjectionMatrixForCamera(camera) {
		return camera.viewProjectionMatrix.multiply(this.worldMatrix);
	}
}