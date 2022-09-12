import {
  Texture,
  SpriteMaterial,
  TextureLoader,
  Sprite,
  Vector3,
  NearestFilter,
  Scene,
} from "three";
import {
  BaseComponent,
  Entity,
  ISceneProp,
  IUpdateableComponent,
} from "../entity";
import punchbirdImg from "../assets/images/punchbird.png";

export class CSprite
  implements IUpdateableComponent, ISceneProp, BaseComponent
{
  public entity: Entity;
  private _texture: Texture;
  constructor(
    textureUrl = punchbirdImg,
    public spriteMaterial = new SpriteMaterial({
      map: new TextureLoader().load(textureUrl),
    }),
    public sprite = new Sprite(spriteMaterial),
    public offset = new Vector3()
  ) {}

  setTexture(textureUrl: string) {
    new TextureLoader().load(textureUrl, (texture) => {
      this._texture = texture;
      this._texture.magFilter = NearestFilter;
      this._texture.minFilter = NearestFilter;
      this.spriteMaterial.map = this._texture;

      this.sprite.scale.set(
        this._texture.image.width / 100,
        this._texture.image.height / 100,
        1
      );
    });
  }

  get texture(): Texture {
    return this._texture;
  }

  update(_: number, entity: Entity) {
    this.sprite.position.copy(entity.transform.position).add(this.offset);
  }

  addToScene(scene: Scene) {
    scene.add(this.sprite);
  }

  removeFromScene(scene: Scene) {
    scene.remove(this.sprite);
  }
}
