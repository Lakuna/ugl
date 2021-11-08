import { Camera } from "./Camera.js";
import { Component } from "../core/Component.js";
import { GameObject } from "../core/GameObject.js";
import { Matrix } from "../math/Matrix.js";
import { Transform } from "./Transform.js";
import { VAO } from "../webgl/VAO.js";

/** A drawable mesh. */
export class Mesh extends Transform {
	static #nextMeshId = 0;

	/**
	 * Generate a list of all visible meshes in the order that they should be drawn.
	 * @param scene - The top-level scene gameobject.
	 * @param camera - The camera to use when rendering the meshes.
	 * @returns A list of all visible meshes in the order that they should be drawn.
	 */
	static getRenderList(scene: GameObject, camera?: Camera): Mesh[] {
		// Get a list of all gameobjects with visible mesh components in the scene
		const renderList: Mesh[] = [];
		scene.traverse((gameObject: GameObject): boolean => {
			const mesh: Mesh = gameObject.components.find((component: Component): boolean => component instanceof Mesh) as Mesh;
			if (mesh?.visible) {
				renderList.push(mesh);
			}
			return false;
		});

		// Create lists for each render group
		const opaqueRenderGroup: Mesh[] = [];
		const transparentRenderGroup: Mesh[] = [];
		const interfaceRenderGroup: Mesh[] = [];

		// Create a depth map for sorting within render groups
		const depthMap: Map<Mesh, number> = new Map();
		renderList.forEach((mesh: Mesh): void => {
			if (!mesh.vao.program.allowTransparent) {
				opaqueRenderGroup.push(mesh);
			} else if (mesh.vao.program.allowDepth) {
				transparentRenderGroup.push(mesh);
			} else {
				interfaceRenderGroup.push(mesh);
			}

			depthMap.set(
				mesh,
				(mesh.renderOrder != 0 || !mesh.vao.program.allowDepth || !camera)
					? 0
					: (mesh.worldMatrix.translation.transform(camera.viewProjectionMatrix)[2] ?? 0));
		});

		// Sort within each render group
		opaqueRenderGroup.sort((a: Mesh, b: Mesh): number =>
			a.renderOrder - b.renderOrder
			|| a.vao.program.id - b.vao.program.id
			|| (depthMap.get(a) ?? 0) - (depthMap.get(b) ?? 0) // Opaque renders front-to-back
			|| b.id - a.id);
		transparentRenderGroup.sort((a: Mesh, b: Mesh): number =>
			a.renderOrder - b.renderOrder
			|| (depthMap.get(b) ?? 0) - (depthMap.get(a) ?? 0) // Transparent renders back-to-front
			|| b.id - a.id);
		interfaceRenderGroup.sort((a: Mesh, b: Mesh): number =>
			a.renderOrder - b.renderOrder
			|| a.vao.program.id - b.vao.program.id
			|| b.id - a.id);

		// Concatenate the lists and return the resultant complete render list
		return opaqueRenderGroup.concat(transparentRenderGroup, interfaceRenderGroup);
	}

	/**
	 * Creates a mesh.
	 * @param gameObject - The gameobject that the mesh should attach to.
	 * @param priority - The order the mesh's events are triggered in relative to other components (lower is earlier).
	 * @param vao - The vertex array object which contains all of the vertex data of the mesh.
	 * @param visible - Whether the mesh should be drawn.
	 * @param renderOrder - The order the mesh should be drawn in relative to other meshes. Lower is earlier.
	 */
	constructor(vao: VAO, gameObject?: GameObject, priority?: number, visible = true, renderOrder = 0) {
		super(gameObject, priority);

		this.vao = vao;
		this.visible = visible;
		this.renderOrder = renderOrder;
		this.id = Mesh.#nextMeshId++;
	}

	/** The vertex array object which contains all of the vertex data of this mesh. */
	readonly vao: VAO;

	/** Whether this mesh should be drawn. */
	visible: boolean;

	/** The order this mesh should be drawn in relative to other meshes. Lower is earlier. */
	renderOrder: number;

	/** The ID of this mesh. */
	readonly id: number;

	/** The inverse transpose of this mesh's world matrix. */
	get worldInverseTransposeMatrix(): Matrix {
		return this.worldMatrix.invert().transpose();
	}

	/**
	 * The world view projection matrix for this mesh.
	 * @param camera - The camera to use.
	 * @returns The world view projection matrix of this mesh.
	 */
	worldViewProjectionMatrix(camera: Camera): Matrix {
		return camera.worldViewProjectionMatrix(this);
	}
}