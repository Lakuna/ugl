import { Transform } from "./Transform.js";

/** Class representing a mesh (drawable object). */
export class Mesh extends Transform {
	/** @ignore */ static #nextMeshId = 0;

	/**
	 * Generate a list of all visible meshes in the order that they should be drawn.
	 * @param {GameObject} scene - The top-level object which represents the scene.
	 * @param {Camera} [camera] - The camera to use when rendering the meshes.
	 * @return {Mesh[]} A list of all visible meshes in the order that they should be drawn.
	 */
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

	#id;

	/**
	 * Create a mesh.
	 * @param {VAO} vao - A vertex array object (VAO) with references to all of the vertex data of the mesh.
	 * @param {boolean} [visible=true] - Whether the mesh should be drawn.
	 * @param {number} [renderOrder=0] - The order this mesh should be drawn in relative to other meshes.
	 */
	constructor(vao, visible = true, renderOrder = 0) {
		super();

		/**
		 * A vertex array object (VAO) with references to all of the vertex data of the mesh.
		 * @type {VAO}
		 */
		this.vao = vao;

		/**
		 * Whether the mesh should be drawn.
		 * @type {boolean}
		 */
		this.visible = visible;

		/**
		 * The order this mesh should be drawn in relative to other meshes.
		 * @type {number}
		 */
		this.renderOrder = renderOrder;

		/** @ignore */ this.#id = Mesh.#nextMeshId++;
	}

	/**
	 * The ID of this mesh.
	 * @type {number}
	 */
	get id() {
		return this.#id;
	}

	/**
	 * The inverse transpose of this mesh's world matrix.
	 * @type {Matrix}
	 */
	get worldInverseTransposeMatrix() {
		return this.worldMatrix.invert().transpose();
	}

	/**
	 * Generate the world view projection matrix of this mesh for a camera.
	 * @param {Camera} camera - The camera with which to render the mesh.
	 * @return {Matrix} The world view projection matrix of this mesh.
	 */
	worldViewProjectionMatrixForCamera(camera) {
		return camera.viewProjectionMatrix.multiply(this.worldMatrix);
	}
}