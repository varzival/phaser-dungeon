import { Scene } from "phaser";
import Phaser from "phaser";

const DEBUG = false;

const DIRECTION = {
  LEFT: 0,
  UP: 1,
  RIGHT: 2,
  DOWN: 3
};

export default class PlayScene extends Scene {
  constructor() {
    super({ key: "PlayScene" });
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();

    const map = this.make.tilemap({ key: "dungeon" });
    const tileset = map.addTilesetImage("dungeon", "tiles");

    map.createLayer("Ground", tileset);
    this.wallsLayer = map.createLayer("Walls", tileset);

    this.wallsLayer.setCollisionByProperty({ collides: true });

    // use this.add.sprite to add a non-physics sprite
    this.knight = this.physics.add.sprite(100, 80, "spriteatlas", "sprite61");
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
      key: "knight-hit",
      frames: [{ key: "spriteatlas", frame: "sprite69" }]
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

    // Orcs
    this.orcs = [];

    this.anims.create({
      key: "orc-idle",
      frames: [{ key: "spriteatlas", frame: "sprite182" }]
    });
    this.anims.create({
      key: "orc-hit",
      frames: [{ key: "spriteatlas", frame: "sprite187" }]
    });
    this.anims.create({
      key: "orc-run",
      frames: this.anims.generateFrameNames("spriteatlas", {
        start: 185,
        end: 189,
        prefix: "sprite"
      }),
      repeat: -1,
      frameRate: 15
    });

    this.spawnOrc(160, 128);

    this.physics.add.collider([this.knight, this.wallsLayer]);

    this.cameras.main.startFollow(this.knight, true, 0.1, 0.1);

    this.physics.world.on(
      Phaser.Physics.Arcade.Events.TILE_COLLIDE,
      this.handleTileCollision,
      this
    );

    if (DEBUG) {
      const debugGraphics = this.add.graphics().setAlpha(0.7);
      this.wallsLayer.renderDebug(debugGraphics, {
        tileColor: null,
        collidingTileColor: new Phaser.Display.Color(243, 243, 48, 255),
        faceColor: new Phaser.Display.Color(48, 39, 37, 255)
      });
    }
  }

  handleTileCollision(go, tile) {
    if (!go.name === "orc") return;
    go.direction += 1;
    if (go.direction > 3) go.direction = 0;
    go.elapsed = 0;
  }

  spawnOrc(x, y) {
    const orc = this.physics.add.sprite(x, y, "spriteatlas", "sprite182");
    orc.name = "orc";
    orc.body.setSize(orc.width * 0.9, orc.height * 0.45);
    orc.body.offset.y = 16;
    orc.anims.play("orc-idle");
    this.physics.add.collider([orc, this.wallsLayer]);
    this.physics.add.collider(
      orc,
      this.knight,
      this.handlePlayerOrcCollision,
      undefined,
      this
    );
    orc.body.onCollide = true;

    this.orcs.push(orc);
    return orc;
  }

  handlePlayerOrcCollision(obj1, obj2) {
    const dx = obj1.x - obj2.x;
    const dy = obj1.y - obj2.y;

    const orc = obj1.name === "orc" ? obj1 : obj2;
    orc.hit = 1;
    orc.anims.play("orc-hit");

    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(-50);

    this.knight.setVelocity(dir.x, dir.y);
    this.knight.hit = 1;
  }

  updateOrcs(deltaTime) {
    for (const orc of this.orcs) {
      if (orc.hit && orc.hit > 0) {
        orc.hit += deltaTime;
        orc.anims.play("orc-hit");
        if (orc.hit > 500) {
          orc.hit = 0;
        }
        continue;
      }

      const speed = 50;
      if (orc.direction === undefined) {
        orc.direction = DIRECTION.UP;
        orc.elapsed = 0;
      }
      orc.elapsed += deltaTime;

      switch (orc.direction) {
        case DIRECTION.LEFT:
          orc.setVelocityY(0);
          orc.setVelocityX(-speed);
          orc.anims.play("orc-run", true);
          orc.scaleX = -1;
          orc.body.offset.x = 16;
          break;
        case DIRECTION.RIGHT:
          orc.setVelocityY(0);
          orc.setVelocityX(speed);
          orc.anims.play("orc-run", true);
          orc.scaleX = 1;
          orc.body.offset.x = 0;
          break;
        case DIRECTION.UP:
          orc.setVelocityX(0);
          orc.setVelocityY(-speed);
          orc.anims.play("orc-run", true);
          break;
        case DIRECTION.DOWN:
          orc.setVelocityX(0);
          orc.setVelocityY(speed);
          orc.anims.play("orc-run", true);
          break;
      }

      if (orc.elapsed >= 1500) {
        orc.direction += 1;
        if (orc.direction > 3) orc.direction = 0;
        orc.elapsed = 0;
      }
    }
  }

  update(totalTime, deltaTime) {
    if (!this.cursors || !this.knight) return;

    const speed = 100;

    this.updateOrcs(deltaTime);

    if (this.knight.hit && this.knight.hit > 0) {
      this.knight.hit += deltaTime;
      this.knight.anims.play("knight-hit");
      if (this.knight.hit > 500) {
        this.knight.hit = 0;
      }
      return;
    }

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
