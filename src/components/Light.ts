import { PointLight, SpotLight, HemisphereLight, AmbientLight } from "three";
import { BaseComponent, Entity } from "../entity";

type Lights = PointLight | SpotLight | HemisphereLight | AmbientLight;
export class Light implements BaseComponent {
  public entity: Entity;
  light: Lights;

  constructor(light?: Lights) {
    this.light = light ? light : new PointLight(0xffffff, 10, 100);
  }
}
