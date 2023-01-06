import { Scene } from "phaser";
import sky from "@/game/assets/sky.png";
import bomb from "@/game/assets/bomb.png";
import thudMp3 from "@/game/assets/thud.mp3";
import thudOgg from "@/game/assets/thud.ogg";

export default class BootScene extends Scene {
  constructor() {
    super({ key: "BootScene" });
  }

  preload() {
    this.load.image("sky", sky);
    this.load.image("bomb", bomb);
    this.load.audio("thud", [thudMp3, thudOgg]);

    this.load.image("tiles", "tiles/tileset_image.png");
    this.load.tilemapTiledJSON(
      "dungeon",
      "tiles/dungeon_crawler_tutorial_tilemap.json"
    );

    this.load.atlas(
      "spriteatlas",
      "tiles/tileset_image.png",
      "tiles/sprites-characters.json"
    );
    this.load.atlas(
      "uiatlas",
      "tiles/tileset_image.png",
      "tiles/sprites-ui.json"
    );
    // knight: y = 16 * 6, x = 16 * 9 => 16 * 16
    // sprite 64 => 68
  }

  create() {
    this.scene.start("PlayScene");
  }
}
