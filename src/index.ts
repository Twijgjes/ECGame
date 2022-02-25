import { Vector3 } from "three";
import "./style.css";
import Punchbird from "./assets/images/punchbird.png";
import * as data from "./assets/data/example.json";

function component() {
  const element = document.createElement("div");

  // Three, currently included via a script, is required for this line to work
  const v = new Vector3(1, 2, 5);
  element.innerHTML = `vector: x: ${v.x} y: ${v.y} x: ${v.z}`;
  element.classList.add("hello");

  // Add the image to our existing div.
  const myIcon = new Image();
  myIcon.src = Punchbird;

  element.appendChild(myIcon);

  console.info(data);

  return element;
}

document.body.appendChild(component());
