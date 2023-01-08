import { Euler, Vector3 } from "three";
import { InfiniteScroll } from "../components/InfiniteScroll";
import { Entity } from "../entity";
import { Game } from "../game";

import groundImg from "../assets/images/ground.png";
import bushesImg from "../assets/images/bushes.png";
import cloudsImg from "../assets/images/clouds.png";
import titleImg from "../assets/images/title.png";

export function createBackground(game: Game, moveSpeed: number) {
  const parallaxEntity = (
    width: number,
    spawnPos: Vector3,
    textureUrl: string,
    moveSpeedMultiplier = 1,
    hasBoundary = false,
    name?: string
  ) => {
    const entity = new Entity(game, name);
    entity.sprite.setTexture(textureUrl);
    entity.transform.position.copy(spawnPos);
    if (hasBoundary) {
      entity.boundary2DCollider.minY = -2.4;
    }
    entity.body.velocity = new Vector3(moveSpeed * moveSpeedMultiplier, 0, 0);
    entity.infiniteScroll = new InfiniteScroll(
      -(width * 2),
      new Vector3(width * 2, spawnPos.y, spawnPos.z)
    );
    return entity;
  };

  const gw = 5.95;
  let groundStart = -gw * 2;
  const gxp = () => (groundStart += gw);
  const args = (): [number, Vector3, any, number, boolean, string] => [
    gw,
    new Vector3(gxp(), -3.1, 0),
    groundImg,
    1,
    true,
    "ground",
  ];
  const groundEntities = [
    parallaxEntity(...args()),
    parallaxEntity(...args()),
    parallaxEntity(...args()),
    parallaxEntity(...args()),
  ];

  const bushWidth = 5.95;
  let bushStartX = -bushWidth * 2;
  const xPos = () => (bushStartX += bushWidth);
  const bushEntities = [
    parallaxEntity(bushWidth, new Vector3(xPos(), -1.7, -0.1), bushesImg, 0.5),
    parallaxEntity(bushWidth, new Vector3(xPos(), -1.7, -0.1), bushesImg, 0.5),
    parallaxEntity(bushWidth, new Vector3(xPos(), -1.7, -0.1), bushesImg, 0.5),
    parallaxEntity(bushWidth, new Vector3(xPos(), -1.7, -0.1), bushesImg, 0.5),
  ];

  const cloudWidth = 5.95;
  let cloudStartX = -cloudWidth * 2;
  const cxp = () => (cloudStartX += cloudWidth);
  const cloudEntities = [
    parallaxEntity(cloudWidth, new Vector3(cxp(), -0.7, -0.2), cloudsImg, 0.2),
    parallaxEntity(cloudWidth, new Vector3(cxp(), -0.7, -0.2), cloudsImg, 0.2),
    parallaxEntity(cloudWidth, new Vector3(cxp(), -0.7, -0.2), cloudsImg, 0.2),
    parallaxEntity(cloudWidth, new Vector3(cxp(), -0.7, -0.2), cloudsImg, 0.2),
  ];

  const title = new Entity(game, "title");
  title.transform.position.set(0, 2.6, 0);
  title.transform.scale.set(2.5, 1, 1);
  title.body.rotationVelocity.setFromEuler(new Euler(0, 0, 0.0005));
  title.body.velocity.set(-0.4, 0, 0);
  // title.sprite.sprite.rotation.set(90, 90, 90);
  // title.body.rotationVelocity.setFromEuler(new Euler(1, 1, 0.1));
  title.plane.setTexture(titleImg);
  return { groundEntities, bushEntities, cloudEntities, title };
}
