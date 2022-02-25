import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Camera,
  Renderer,
} from "three";

export interface ThreeParts {
  scene: Scene;
  camera: Camera;
  renderer: Renderer;
}

export function threeSetup(element: HTMLElement): ThreeParts {
  console.info("threeSetup");
  const scene = new Scene();
  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const renderer = new WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  element.appendChild(renderer.domElement);
  return { scene, camera, renderer };
}
