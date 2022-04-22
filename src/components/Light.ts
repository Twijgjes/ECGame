import { PointLight, SpotLight, HemisphereLight, AmbientLight } from "three";

type Lights = PointLight | SpotLight | HemisphereLight | AmbientLight;
export class Light {
  light: Lights;

  constructor(light?: Lights) {
    this.light = light ? light : new PointLight(0xffffff, 10, 100);
  }
}
