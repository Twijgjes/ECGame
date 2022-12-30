import { Mesh, BoxGeometry, MeshBasicMaterial, Scene } from "three";
import {
  IUpdateableComponent,
  ISceneProp,
  Entity,
  BaseComponent,
} from "../entity";

export class CMesh implements IUpdateableComponent, ISceneProp, BaseComponent {
  public entity: Entity;
  mesh: Mesh;

  constructor(mesh?: Mesh) {
    if (!mesh) {
      const geometry = new BoxGeometry();
      const material = new MeshBasicMaterial({ color: 0x00ff00 });
      mesh = new Mesh(geometry, material);
    }
    this.mesh = mesh;
  }

  update(_: number) {
    this.mesh.position.copy(this.entity.transform.position);
    this.mesh.quaternion.copy(this.entity.transform.rotation);
    this.mesh.scale.copy(this.entity.transform.scale);
  }

  addToScene(scene: Scene) {
    scene.add(this.mesh);
  }

  removeFromScene(scene: Scene) {
    scene.remove(this.mesh);
  }
}
