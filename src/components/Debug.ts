import {
  Vector3,
  Scene,
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  SphereGeometry,
} from "three";
import { Entity, ISceneProp, IUpdateableComponent } from "../entity";

export class DebugBox implements IUpdateableComponent, ISceneProp {
  private box: Mesh;
  constructor(public size: Vector3 = new Vector3(1, 1, 1)) {
    const geometry = new BoxGeometry(size.x, size.y, size.z);
    const material = new MeshBasicMaterial({
      color: 0x0000ff,
      wireframe: true,
    });
    this.box = new Mesh(geometry, material);
  }

  update(_: number, entity: Entity) {
    this.box.position.copy(entity.transform.position);
  }

  addToScene(scene: Scene) {
    scene.add(this.box);
  }

  removeFromScene(scene: Scene) {
    scene.remove(this.box);
  }
}

export class DebugSphere implements IUpdateableComponent, ISceneProp {
  private sphere: Mesh;
  constructor(public radius: number = 1) {
    const geometry = new SphereGeometry(this.radius, 7, 7);
    const material = new MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true,
    });
    this.sphere = new Mesh(geometry, material);
  }

  update(_: number, entity: Entity) {
    this.sphere.position.copy(entity.transform.position);
  }

  addToScene(scene: Scene) {
    scene.add(this.sphere);
  }

  removeFromScene(scene: Scene) {
    scene.remove(this.sphere);
  }
}
