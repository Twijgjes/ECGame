import { BaseComponent, Entity, IInitializedComponent } from "../entity";

export class ClickBoost implements BaseComponent, IInitializedComponent {
  public entity: Entity;
  constructor() {}

  init() {
    const { body } = this.entity;
    document.addEventListener("keypress", (event) => {
      if (event.code === "Space") {
        body.velocity.y += 8;
      }
    });
  }
}
