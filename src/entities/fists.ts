import fistImg from "../assets/images/FIST.png";
import { Entity } from "../entity";
import { Game } from "../game";

export function createFists(game: Game, moveSpeed: number) {
  const fistFactory = (debug = false) => {
    const fist = new Entity(game);
    fist.plane.setTexture(fistImg);
    return fist;
  };
  const fist = fistFactory();
  fist.transform.position.x = -2;
  fist.transform.position.y = 3;
}
