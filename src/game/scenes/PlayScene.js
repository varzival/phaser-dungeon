import { Scene } from "phaser";
import Phaser from "phaser";

const DEBUG = true;

export default class PlayScene extends Scene {
  constructor() {
    super({ key: "PlayScene" });
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();

    const map = this.make.tilemap({ key: "dungeon" });
    const tileset = map.addTilesetImage("dungeon", "tiles");

    map.createLayer("Ground", tileset);
    const wallsLayer = map.createLayer("Walls", tileset);

    wallsLayer.setCollisionByProperty({ collides: true });

    // use this.add.sprite to add a non-physics sprite
    this.knight = this.physics.add.sprite(128, 128, "spriteatlas", "sprite61");
    this.knight.body.setSize(
      this.knight.width * 0.9,
      this.knight.height * 0.45
    );
    this.knight.body.offset.y = 16;

    this.anims.create({
      key: "knight-idle",
      frames: [{ key: "spriteatlas", frame: "sprite61" }]
    });
    this.anims.create({
      key: "knight-run",
      frames: this.anims.generateFrameNames("spriteatlas", {
        start: 64,
        end: 68,
        prefix: "sprite"
      }),
      repeat: -1,
      frameRate: 15
    });
    this.knight.anims.play("knight-idle");

    this.physics.add.collider([this.knight, wallsLayer]);

    this.cameras.main.startFollow(this.knight, true, 0.1, 0.1);

    if (DEBUG) {
      const debugGraphics = this.add.graphics().setAlpha(0.7);
      wallsLayer.renderDebug(debugGraphics, {
        tileColor: null,
        collidingTileColor: new Phaser.Display.Color(243, 243, 48, 255),
        faceColor: new Phaser.Display.Color(48, 39, 37, 255)
      });
    }
  }

  update(totalTime, deltaTime) {
    if (!this.cursors || !this.knight) return;

    const speed = 100;

    let running = false;
    if (this.cursors.left?.isDown) {
      this.knight.anims.play("knight-run", true);
      this.knight.setVelocityX(-speed);
      this.knight.scaleX = -1;
      this.knight.body.offset.x = 16;
      running = true;
    } else if (this.cursors.right?.isDown) {
      this.knight.anims.play("knight-run", true);
      this.knight.setVelocityX(speed);
      this.knight.scaleX = 1;
      this.knight.body.offset.x = 0;
      running = true;
    }

    if (this.cursors.up?.isDown) {
      this.knight.anims.play("knight-run", true);
      this.knight.setVelocityY(-speed);
      running = true;
    } else if (this.cursors.down?.isDown) {
      this.knight.anims.play("knight-run", true);
      this.knight.setVelocityY(speed);
      running = true;
    }

    if (!running) {
      this.knight.anims.play("knight-idle");
      this.knight.setVelocity(0, 0);
    }
  }
}
