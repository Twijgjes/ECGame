import { Vector3 } from "three";
import { BaseComponent, Entity, IUpdateableComponent } from "../entity";

export class Spawner implements BaseComponent, IUpdateableComponent {
  public entity: Entity;
  private lastSpawnTime: number;
  private spawnPool: Array<Entity>;

  constructor(
    public spawnPoolSize = 5,
    public spawnTimerMs = 1000,
    public entityFactory: () => Entity,
    public spread: Vector3 = new Vector3()
  ) {
    this.lastSpawnTime = Date.now();
    this.spawnPool = new Array<Entity>();
  }

  update(deltaSeconds: number, entity: Entity) {
    if (Date.now() - this.lastSpawnTime > this.spawnTimerMs) {
      this.lastSpawnTime = Date.now();
      this.spawn();
    }
  }

  spawn() {
    let entity;
    console.info("🍆 Spawining poollength:", this.spawnPool.length);
    if (this.spawnPool.length >= this.spawnPoolSize) {
      entity = this.spawnPool.pop();
    } else {
      entity = this.entityFactory();
    }
    entity.transform = this.entity.transform.clone();
    entity.transform.position.add(
      new Vector3(
        Math.random() * this.spread.x - this.spread.x / 2,
        Math.random() * this.spread.y - this.spread.y / 2,
        Math.random() * this.spread.z - this.spread.z / 2
      )
    );
    this.spawnPool = [entity, ...this.spawnPool];
  }
}
