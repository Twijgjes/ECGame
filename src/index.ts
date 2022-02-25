import { Vector3 } from "three";
import "./style.css";
import Punchbird from "./assets/images/punchbird.png";
import { threeSetup } from "./threeSetup";
import { threeTestSetup } from "./utils/threeTestSetup";

function component() {
  const element = document.createElement("div");
  const btn = document.createElement("button");
  const threeParts = threeSetup(document.body);
  const cube = threeTestSetup(threeParts);

  function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    threeParts.renderer.render(threeParts.scene, threeParts.camera);
  }
  animate();

  // Three, currently included via a script, is required for this line to work
  const v = new Vector3(1, 2, 5);
  element.innerHTML = `vector: x: ${v.x} y: ${v.y} x: ${v.z}`;
  element.classList.add("hello");

  // Add the image to our existing div.
  const myIcon = new Image();
  myIcon.src = Punchbird;

  element.appendChild(myIcon);

  btn.innerHTML = "Click me and check the console!";

  element.appendChild(btn);

  return element;
}

document.body.appendChild(component());
