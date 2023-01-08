import { Color } from "three";
import { Entity, INeedsCleanup, IUpdateable } from "./entity";
import { Engine, threeSetup } from "./threeSetup";
import { CollisionSolver } from "./components/Collision";
import { Pause } from "./behaviors/Pause";
import { createPunchbird } from "./entities/punchbird";
import { createRestartButton } from "./entities/restartButton";
import { createBackground } from "./entities/background";
import { createPipes } from "./entities/pipes";
import { createFists } from "./entities/fists";

export class Game {
  public engine: Engine;
  public updateables: IUpdateable[];
  public needsCleanup: INeedsCleanup[];
  public collidables2D: Entity[];
  public lastTick: number;
  public paused: boolean;

  constructor() {
    this.genericInitialize();
    this.initialize();
  }

  public genericInitialize() {
    this.engine = threeSetup(document.body);
    this.updateables = [] as IUpdateable[];
    this.needsCleanup = [] as INeedsCleanup[];
    this.collidables2D = [] as Entity[];
    this.lastTick = Date.now();
    this.paused = false;
  }

  // Place to put all game-implementation-specific logic
  // TODO: refactor to abstract later
  private initialize() {
    this.engine.camera.position.z = 5;
    this.engine.scene.background = new Color("rgb(81,189,205)");
    new Pause(this);

    const moveSpeed = -2;
    const background = createBackground(this, moveSpeed);
    const punchbird = createPunchbird(this);
    const pipes = createPipes(this, moveSpeed);
    const fists = createFists(this, moveSpeed);

    // TODO: Pick-up-able fist
    // TODO: Fist counter on screen
    // TODO: Fist spawner
    // TODO: Fist-punch pipe

    // TODO: Spawn pipes further away
    // TODO: Make title move and rotate out of screen
    // TODO: Fix pausing + spawner mechanics
    // TODO: Sounds!
    // TODO: Screen resizing
  }

  public start() {
    this.update();
  }

  public gameOver() {
    // Spawn restart button
    this.paused = true;
    const restartbutton = createRestartButton(this);
  }

  public restart() {
    document.body.removeChild(this.engine.canvasElement);
    this.destroy();
    this.genericInitialize();
    this.initialize();
  }

  public update() {
    requestAnimationFrame(() => this.update());
    // Determine the delta between the last tick and this one
    if (!this.paused) {
      const now = Date.now();
      const deltaSeconds = (now - this.lastTick) / 1000;
      this.lastTick = now;

      // Loop through entities
      // If entity can be updated, do so
      for (const updateable of this.updateables) {
        updateable.update(deltaSeconds);
      }
      CollisionSolver.solveCollisions(this.collidables2D);
    }

    this.engine.renderer.render(this.engine.scene, this.engine.camera);
  }

  public destroy() {
    for (const descructible of this.needsCleanup) {
      descructible.destroy();
    }
  }
}
