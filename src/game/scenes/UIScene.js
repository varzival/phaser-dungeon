import Phaser from "phaser";
import sceneEvents from "@/events";

export default class GameUI extends Phaser.Scene {
  constructor() {
    super({ key: "UIScene" });
  }

  create() {
    /*const hearts = this.add.group({
      classType: Phaser.GameObjects.Sprite
    });

    hearts.createMultiple({
      key: "sprite235",
      setXY: {
        x: 10,
        y: 10,
        stepX: 16
      },
      quantity: 3
    });*/

    this.hearts = [
      this.add.sprite(10, 10, "uiatlas", "sprite235"),
      this.add.sprite(28, 10, "uiatlas", "sprite235"),
      this.add.sprite(46, 10, "uiatlas", "sprite235")
    ];
    for (const heart of this.hearts) {
      heart.setSize(heart.width * 0.9, heart.height * 0.45);
    }

    sceneEvents.on(
      "knight-health-changed",
      this.handlePlayerHealthChanged,
      this
    );

    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      sceneEvents.off("knight-health-changed");
    });

    this.blackOverlay = this.add
      .rectangle(0, 0, 1000, 1000, "black", 1)
      .setDepth(2)
      .setAlpha(0);
  }

  handlePlayerDeath(dt) {
    if (!this.dead) return;

    const fadeDuration = 2000;

    if (this.dead) {
      this.blackOverlay.setAlpha(this.dead / fadeDuration);
      this.dead += dt;
    }

    if (this.dead >= fadeDuration) {
      this.add
        .text(200, 125, "YOU DIED", {
          fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
          align: "center",
          fill: "red",
          fontSize: 50
        })
        .setOrigin(0.5, 0.5)
        .setDepth(3);
      this.dead = 0;
      this.blackOverlay.setAlpha(1);
    }
  }

  update(tt, dt) {
    this.handlePlayerDeath(dt);
  }

  handlePlayerHealthChanged(health) {
    for (let i in this.hearts) {
      if (i < health) {
        this.hearts[i].setTexture("uiatlas", "sprite235");
      } else {
        this.hearts[i].setTexture("uiatlas", "sprite237");
      }
    }

    if (health <= 0) {
      this.dead = 1;
    }
  }
}
