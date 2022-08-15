import { Scene } from "phaser";

export default class PlayScene extends Scene {
  constructor() {
    super({ key: "PlayScene" });
  }

  preload() {
    this.load.image("tiles", "tiles/dungeon_crawler_tutorial_tilemap.json");
  }

  create() {}

  update() {}
}
