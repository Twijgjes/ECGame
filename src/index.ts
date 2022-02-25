import { Vector3 } from "three";

function component() {
  const element = document.createElement("div");

  // Three, currently included via a script, is required for this line to work
  const v = new Vector3(1, 2, 4);
  element.innerHTML = `vector: x: ${v.x} y: ${v.y} x: ${v.z}`;

  return element;
}

document.body.appendChild(component());
