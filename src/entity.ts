import {
  AmbientLight,
  BoxGeometry,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  PointLight,
  Quaternion,
  SpotLight,
  SpriteMaterial,
  TextureLoader,
  Vector3,
  Sprite,
  NearestFilter,
  Texture,
  Scene,
} from "three";
import { Game } from "./game";
import punchbirdImg from "./assets/images/punchbird.png";

/**
 * The goal is to create an entity-component system that allows me to
 * access an entity's components like entity.transform.position.add(x,y,z)
 * even when that entity does not have the component yet, because we'll instantiate
 * the component on the fly with default values
 */

// function foo<T extends {}, K extends keyof T>(t: T, k: K, v: T[K]) {
//   t[k] = v;
// }
// const some = { a: "string", b: 2 };
// foo(some, "a", "string");
// const optionalSome: Partial<typeof some> = { a: "" };
export type IComponent = Transform | Body | Prop | Light | CSprite;

export class Entity {
  transform: Transform;
  body: Body;
  prop: Prop;
  light: Light;
  sprite: CSprite;
  private proxy: Entity;

  constructor(private game: Game) {
    // this.c = new Components();
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
    this.proxy = new Proxy(this, {
      // https://www.typescriptlang.org/docs/handbook/2/keyof-types.html
      get(target: Entity, name: keyof Entity) {
        if (!target[name]) {
          switch (name) {
            case "transform":
              target.transform = new Transform();
              break;
            case "body":
              target.body = new Body();
              break;
            case "prop":
              target.prop = new Prop();
              break;
            case "light":
              target.light = new Light();
              break;
            case "sprite":
              target.sprite = new CSprite();
              break;
            default:
              console.warn("Entity does not have a", name);
              break;
          }
          // Jesus fuck, fix this shit please
          if ((target[name] as ISceneProp).addToScene) {
            (target[name] as ISceneProp).addToScene(game.engine.scene);
          }
        }

        return target[name];
      },
      set(target: Entity, _: keyof Entity, value: IComponent) {
        if (value instanceof Transform) {
          target.transform = value;
          return true;
        }
        if (value instanceof Body) {
          target.body = value;
          return true;
        }
        if (value instanceof Prop) {
          target.prop.removeFromScene(game.engine.scene);
          target.prop = value;
          return true;
        }
        if (value instanceof Light) {
          target.light = value;
          return true;
        }
        if (value instanceof CSprite) {
          target.sprite.removeFromScene(game.engine.scene);
          target.sprite = value;
          return true;
        }
        return false;
      },
    });

    this.game.updateables.push(this);
    return this.proxy;
  }

  update(deltaSeconds: number) {
    for (const [key, updateable] of Object.entries(this.proxy)) {
      // Haha fuck this is dirty
      // TODO: maybe refactor this so that all components get added to a separate array or obj?
      // But then I have to keep track of removals and additions and I'm lazy lol
      if (key === "game" || key === "proxy") {
        continue;
      }

      if (updateable && updateable.update) {
        updateable.update(deltaSeconds, this.proxy);
      }
    }
  }
}

export interface IUpdateable {
  update: (deltaSeconds: number) => void;
}
export interface IUpdateableComponent {
  update: (deltaSeconds: number, components: Entity) => void;
}

export interface ISceneProp {
  addToScene: (scene: Scene) => void;
  removeFromScene: (scene: Scene) => void;
}

export class Transform {
  position: Vector3;
  rotation: Quaternion;
  scale: Vector3;

  constructor(position?: Vector3, rotation?: Quaternion, scale?: Vector3) {
    this.position = position ? position : new Vector3();
    this.rotation = rotation ? rotation : new Quaternion();
    this.scale = scale ? scale : new Vector3(1, 1, 1);
  }
}

export class Prop implements IUpdateableComponent, ISceneProp {
  mesh: Mesh;

  constructor(mesh?: Mesh) {
    if (!mesh) {
      const geometry = new BoxGeometry();
      const material = new MeshBasicMaterial({ color: 0x00ff00 });
      mesh = new Mesh(geometry, material);
    }
    this.mesh = mesh;
  }

  update(_: number, components: Entity) {
    this.mesh.position.copy(components.transform.position);
    this.mesh.quaternion.copy(components.transform.rotation);
    this.mesh.scale.copy(components.transform.scale);
  }

  addToScene(scene: Scene) {
    scene.add(this.mesh);
  }

  removeFromScene(scene: Scene) {
    scene.remove(this.mesh);
  }
}

type Lights = PointLight | SpotLight | HemisphereLight | AmbientLight;
export class Light {
  light: Lights;

  constructor(light?: Lights) {
    this.light = light ? light : new PointLight(0xffffff, 10, 100);
  }
}

export class Body implements IUpdateableComponent {
  velocity: Vector3;
  rotationVelocity: Quaternion;
  gravity?: Vector3;

  constructor(
    velocity?: Vector3,
    rotationVelocity?: Quaternion,
    gravity?: Vector3
  ) {
    this.velocity = velocity ? velocity : new Vector3();
    this.rotationVelocity = rotationVelocity
      ? rotationVelocity
      : new Quaternion();
    this.gravity = gravity;
  }

  update(deltaSeconds: number, components: Entity) {
    if (this.gravity) {
      this.velocity.add(this.gravity.clone().multiplyScalar(deltaSeconds));
    }
    components.transform.position.add(
      this.velocity.clone().multiplyScalar(deltaSeconds)
    );
    components.transform.rotation.multiply(this.rotationVelocity);
  }
}

export class CSprite implements IUpdateableComponent, ISceneProp {
  private _texture: Texture;
  constructor(
    textureUrl = punchbirdImg, //"./assets/images/punchbird.png"),
    public spriteMaterial = new SpriteMaterial({
      map: new TextureLoader().load(textureUrl),
    }),
    public sprite = new Sprite(spriteMaterial),
    public offset = new Vector3()
  ) {
    // this.setTexture(textureUrl);
    // this.texture.magFilter = NearestFilter;
    // this.texture.minFilter = NearestFilter;
    // console.info(
    //   "texture image:",
    //   this._texture.image,
    //   this._texture.sourceFile,
    //   this.spriteMaterial.map.image
    // );
    // this._texture.s
    // this.sprite.scale.set(1, 1, 1);
  }

  setTexture(textureUrl: string) {
    // console.info("updating texture");
    new TextureLoader().load(textureUrl, (texture) => {
      this._texture = texture;
      this._texture.magFilter = NearestFilter;
      this._texture.minFilter = NearestFilter;
      this.spriteMaterial.map = this._texture;
      // this.spriteMaterial.map
      // this._texture.needsUpdate = true;
      // this.spriteMaterial.map.needsUpdate = true;

      // console.info("texture image:", this.spriteMaterial.map.image);
      this.sprite.scale.set(
        this._texture.image.width / 100,
        this._texture.image.height / 100,
        1
      );
      // punchbirdImg.
    });
    // this.spriteMaterial.map.needsUpdate = true;
    // this.sprite.material = this.spriteMaterial;
    // this.sprite.material.needsUpdate = true;
  }

  get texture(): Texture {
    return this._texture;
  }

  update(_: number, components: Entity) {
    // this.sprite.rotation.setFromQuaternion(components.transform.rotation);
    this.sprite.position.copy(components.transform.position).add(this.offset);
  }

  addToScene(scene: Scene) {
    scene.add(this.sprite);
  }

  removeFromScene(scene: Scene) {
    scene.remove(this.sprite);
  }
}
