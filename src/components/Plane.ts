import {
  Mesh,
  MeshBasicMaterial,
  Scene,
  PlaneGeometry,
  TextureLoader,
  Vector3,
  NearestFilter,
} from "three";
import {
  IUpdateableComponent,
  ISceneProp,
  Entity,
  BaseComponent,
} from "../entity";
import punchbirdImg from "../assets/images/punchbird.png";

export class CPlane implements IUpdateableComponent, ISceneProp, BaseComponent {
  public entity: Entity;
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
