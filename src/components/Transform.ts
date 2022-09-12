import { Vector3, Quaternion } from "three";
import { BaseComponent, Entity } from "../entity";

export class Transform implements BaseComponent {
  public entity: Entity;

  constructor(
    public position = new Vector3(0, 0, 0),
    public rotation = new Quaternion(),
    public scale = new Vector3(1, 1, 1)
  ) {}
}
