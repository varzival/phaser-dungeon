import { Scene } from "phaser";

export default class PlayScene extends Scene {
  constructor() {
    super({ key: "PlayScene" });
  }

  create() {
    this.make.tilemap({ key: "dungeon" });
  }

  update() {}
}
