import { Vector3 } from "three";
import { Entity, IInitializedComponent } from "../entity";

export class ClickBoost implements IInitializedComponent {
  constructor() {}

  init(entity: Entity) {
    const { body } = entity;
    document.addEventListener("keypress", (event) => {
      if (event.code === "Space") {
        body.velocity.y += 6;
      }
    });
  }
}
