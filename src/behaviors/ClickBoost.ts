import { Entity } from "../entity";
import berdArmDown from "../assets/images/punchbird_punchdown.png";
import berdArmBentImg from "../assets/images/punchbird_arm_bent.png";

export class ClickBoost {
  constructor(public entity: Entity) {
    const { body, plane } = this.entity;
    document.addEventListener("keypress", this.handleClick.bind(this));
  }

  public handleClick(event: KeyboardEvent) {
    if (event.code === "Space") {
      console.info("flerp");
      this.entity.body.velocity.y += 6;
      this.entity.plane.setTexture(berdArmDown);
      setTimeout(() => {
        this.entity.plane.setTexture(berdArmBentImg);
      }, 250);
    }
  }
  public destroy() {
    document.removeEventListener("keypress", this.handleClick);
  }
}
