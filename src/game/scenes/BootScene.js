import { Scene } from "phaser";
import mute from "@/game/assets/mute.png";
import unmute from "@/game/assets/unmute.png";
import music1 from "@/game/assets/music/The-Winds-of-Strange.mp3";
import music_defeat from "@/game/assets/music/TheFallen.mp3";
import knife from "@/game/assets/sounds/knifesharpener1.mp3";
import hit from "@/game/assets/sounds/hit.mp3";
import knife_sharpen from "@/game/assets/sounds/sword9.ogg";
import orc_hit from "@/game/assets/sounds/orc_hit.mp3";
import orc_dead from "@/game/assets/sounds/orc_dead.mp3";
import coin from "@/game/assets/sounds/coin.wav";
import SOUND from "./sounds";

export default class BootScene extends Scene {
  constructor() {
    super({ key: "BootScene" });
  }

  preload() {
    this.load.image("mute", mute);
    this.load.image("unmute", unmute);

    this.load.audio(SOUND.MUSIC, music1);
    this.load.audio(SOUND.MUSIC_DEFEAT, music_defeat);
    this.load.audio(SOUND.KNIFE, knife);
    this.load.audio(SOUND.KNIFE_SHARPEN, knife_sharpen);
    this.load.audio(SOUND.ORC_HIT, orc_hit);
    this.load.audio(SOUND.ORC_DEAD, orc_dead);
    this.load.audio(SOUND.COIN, coin);
    this.load.audio(SOUND.HIT, hit);

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
