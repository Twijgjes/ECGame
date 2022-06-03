import {
  Mesh,
  MeshBasicMaterial,
  Scene,
  PlaneGeometry,
  TextureLoader,
  Vector3,
  NearestFilter,
} from "three";
import { IUpdateableComponent, ISceneProp, Entity } from "../entity";
import punchbirdImg from "../assets/images/punchbird.png";

export class CPlane implements IUpdateableComponent, ISceneProp {
  mesh: Mesh;

  constructor(
    textureUrl = punchbirdImg,
    public offset = new Vector3(),
    mesh?: Mesh
  ) {
    if (!mesh) {
      const geometry = new PlaneGeometry(1, 1);
      const material = new MeshBasicMaterial({
        map: new TextureLoader().load(textureUrl),
      });
      material.transparent = true;
      mesh = new Mesh(geometry, material);
    }
    this.mesh = mesh;
  }

  setTexture(textureUrl: string) {
    const material = this.mesh.material as MeshBasicMaterial;
    const texture = new TextureLoader().load(textureUrl);
    texture.magFilter = NearestFilter;
    texture.minFilter = NearestFilter;
    material.map = texture;
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
