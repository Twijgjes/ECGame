import { Entity, INeedsCleanup } from "../entity";
import berdArmDown from "../assets/images/punchbird_punchdown.png";
import berdArmBentImg from "../assets/images/punchbird_arm_bent.png";

export class ClickBoost extends INeedsCleanup {
  private boundKeyHandler;
  private boundMouseHandler;

  constructor(public entity: Entity) {
    super(entity);
    this.boundKeyHandler = this.handleClick.bind(this);
    this.boundMouseHandler = this.handleClick.bind(this);
    document.addEventListener("keypress", this.boundKeyHandler);
    document.addEventListener("click", this.boundMouseHandler);
  }

  public handleSpace(event: KeyboardEvent) {
    if (event.code === "Space" && !this.entity.game.paused) {
      this.boost();
    }
  }

  public handleClick() {
    if (!this.entity.game.paused) {
      this.boost();
    }
  }

  private boost() {
    this.entity.body.velocity.y += 6;
    this.entity.plane.setTexture(berdArmDown);
    setTimeout(() => {
      this.entity.plane.setTexture(berdArmBentImg);
    }, 250);
  }

  public destroy() {
    document.removeEventListener("keypress", this.boundKeyHandler);
    document.removeEventListener("click", this.boundMouseHandler);
  }
}
