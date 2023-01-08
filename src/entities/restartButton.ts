import { Raycaster, Vector2 } from "three";
import { Entity } from "../entity";
import { Game } from "../game";

import restartButtonImg from "../assets/images/restartbutton.png";

export function createRestartButton(game: Game) {
  const restartButton = new Entity(game, "restartButton");
  restartButton.sprite.setTexture(restartButtonImg);

  const raycaster = new Raycaster();
  const pointer = new Vector2();

  game.engine.canvasElement.addEventListener("click", (event) => {
    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // update the picking ray with the camera and pointer position
    raycaster.setFromCamera(pointer, game.engine.camera);

    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(game.engine.scene.children);
    intersects.find((intersect) => {
      if (intersect.object === restartButton.sprite.sprite) {
        game.restart();
      }
    });
  });
  return restartButton;
}
