import { BoxGeometry, MeshBasicMaterial, Mesh } from "three";
import { ThreeParts } from "../threeSetup";

export function threeTestSetup(threeParts: ThreeParts): Mesh {
  console.info("threeTestSetup");
  const { scene, camera } = threeParts;
  const geometry = new BoxGeometry();
  const material = new MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new Mesh(geometry, material);
  scene.add(cube);

  camera.position.z = 5;
  return cube;
}
