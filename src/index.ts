import { initialize, start } from "./game";
import "./style.css";
import { threeSetup } from "./threeSetup";
import { threeTestSetup } from "./utils/threeTestSetup";

function init() {
  const game = initialize();
  start(game);
  // const threeParts = threeSetup(document.body);
  // const cube = threeTestSetup(threeParts);

  // function animate() {
  //   requestAnimationFrame(animate);
  //   cube.rotation.x += 0.01;
  //   cube.rotation.y += 0.01;
  //   threeParts.renderer.render(threeParts.scene, threeParts.camera);
  // }
  // animate();
}
init();
