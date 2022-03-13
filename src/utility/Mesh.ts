import { Transform } from "./Transform.js";
import { GameObject } from "../core/GameObject.js";
import { VAO } from "../webgl/VAO.js";
import { Matrix } from "../math/Matrix.js";
import { Camera } from "./Camera.js";
import { Component } from "../core/Component.js";
import { Vector } from "../math/Vector.js";

/** A drawable mesh. */
export class Mesh extends Transform {
  /**
   * Generates a list of all visible meshes in the order that they should be drawn.
   * @param scene - The scene to render.
   * @param camera - The camera to use when calculating the world view projection matrices of the meshes.
   * @returns A list of all visible meshes in the order that they should be drawn.
   */
  static getRenderList(scene: GameObject, camera?: Camera): Mesh[] {
    // Get a list of all game objects with visible mesh components in the scene.
    const renderList: Mesh[] = [];
    scene.traverse((gameObject: GameObject): boolean => {
      const mesh: Mesh = gameObject.components.find((component: Component): boolean => component instanceof Mesh) as Mesh;
      if (mesh?.visible) { renderList.push(mesh); }
      return false;
    });

    // Create lists for each render group.
    const opaqueRenderGroup: Mesh[] = [];
    const transparentRenderGroup: Mesh[] = [];
    const interfaceRenderGroup: Mesh[] = [];

    // Create a depth map for sorting within render groups.
    const depthMap: Map<Mesh, number> = new Map();
    for (const mesh of renderList) {
      if (!mesh.vao.program.allowTransparent) {
        opaqueRenderGroup.push(mesh);
      } else if (mesh.vao.program.allowDepth) {
        transparentRenderGroup.push(mesh);
      } else {
        interfaceRenderGroup.push(mesh);
      }

      depthMap.set(mesh, (mesh.renderOrder != 0 || !mesh.vao.program.allowDepth || !camera) ? 0
        : Vector.fromMatrixTranslation(mesh.worldMatrix).transform(camera.viewProjectionMatrix)[2] as number);
    }

    // Sort within each render group.
    opaqueRenderGroup.sort((a: Mesh, b: Mesh): number =>
      a.renderOrder - b.renderOrder
      || (depthMap.get(a) ?? 0) - (depthMap.get(b) ?? 0));
    transparentRenderGroup.sort((a: Mesh, b: Mesh): number =>
      a.renderOrder - b.renderOrder
      || (depthMap.get(b) ?? 0) - (depthMap.get(a) ?? 0));
    interfaceRenderGroup.sort((a: Mesh, b: Mesh): number =>
      a.renderOrder - b.renderOrder);

    // Concatenate the lists to return the complete render list.
    return opaqueRenderGroup.concat(transparentRenderGroup, interfaceRenderGroup);
  }

  /**
   * Creates a mesh.
   * @param vao - The vertex array object which contains the vertex data of the mesh.
   * @param gameObject - The game object to attach the mesh to.
   * @param priority - The order that the component's events are triggered in relative to other components.
   * @param visible - Whether the mesh should be drawn.
   * @param renderOrder - The order that the mesh should be drawn in relative to other meshes. A lower number makes the mesh render earlier.
   */
  constructor(vao: VAO, gameObject?: GameObject, priority?: number, visible = true, renderOrder = 0) {
    super(gameObject, priority);
    this.vao = vao;
    this.visible = visible;
    this.renderOrder = renderOrder;
  }

  /** The vertex array object which contains the vertex data of this mesh. */
  readonly vao: VAO;

  /** Whether this mesh should be drawn. */
  visible: boolean;

  /** The order that this mesh should be drawn in relative to other meshes. A lower number makes this mesh render earlier. */
  renderOrder: number;

  /** The inverse transpose of this mesh's world matrix. */
  get worldInverseTransposeMatrix(): Matrix {
    return this.worldMatrix.invert().transpose();
  }

  /**
   * The world view projection matrix of this mesh.
   * @param camera - The camera to view this mesh from.
   * @returns The world view projection matrix of this mesh.
   */
  worldViewProjectionMatrix(camera: Camera): Matrix {
    return camera.worldViewProjectionMatrix(this);
  }
}
