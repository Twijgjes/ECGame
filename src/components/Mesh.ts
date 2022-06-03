import { Mesh, BoxGeometry, MeshBasicMaterial, Scene } from "three";
import { IUpdateableComponent, ISceneProp, Entity } from "../entity";

export class CMesh implements IUpdateableComponent, ISceneProp {
  mesh: Mesh;

  constructor(mesh?: Mesh) {
    if (!mesh) {
      const geometry = new BoxGeometry();
      const material = new MeshBasicMaterial({ color: 0x00ff00 });
      mesh = new Mesh(geometry, material);
    }
    this.mesh = mesh;
  }

  update(_: number, entity: Entity) {
    this.mesh.position.copy(entity.transform.position);
    this.mesh.quaternion.copy(entity.transform.rotation);
    this.mesh.scale.copy(entity.transform.scale);
  }

  addToScene(scene: Scene) {
    scene.add(this.mesh);
  }

  removeFromScene(scene: Scene) {
    scene.remove(this.mesh);
  }
}
