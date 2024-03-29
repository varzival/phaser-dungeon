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

    this.coinAmt = 0;

    this.hearts = [
      this.add.sprite(10, 10, "uiatlas", "sprite235"),
      this.add.sprite(28, 10, "uiatlas", "sprite235"),
      this.add.sprite(46, 10, "uiatlas", "sprite235")
    ];
    this.knife = this.add.sprite(64, 10, "uiatlas", "sprite64");
    this.knife.setSize(this.knife.width * 0.9, this.knife.height * 0.45);

    this.add.sprite(82, 10, "uiatlas", "sprite242");

    this.coinText = this.add
      .text(90, 10, "x 0", {
        fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
        align: "center",
        fill: "white",
        fontSize: 15
      })
      .setOrigin(0, 0.5);

    const muted = localStorage.getItem("muted") === "true" ? true : false;
    this.muteButton = this.add
      .image(390, 10, muted ? "unmute" : "mute")
      .setScale(0.25, 0.25)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.handleMute());

    for (const heart of this.hearts) {
      heart.setSize(heart.width * 0.9, heart.height * 0.45);
    }

    sceneEvents.on(
      "knight-health-changed",
      this.handlePlayerHealthChanged,
      this
    );
    sceneEvents.on("knight-reloading", this.handlePlayerReloading, this);
    sceneEvents.on("coin-collected", this.handleCoinCollected, this);

    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      sceneEvents.off("knight-health-changed");
    });

    // window.addEventListener("storage", (event) => {
    //   console.log(event);
    // });

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

  handleMute() {
    const muted = localStorage.getItem("muted") === "true" ? true : false;
    localStorage.setItem("muted", !muted);
    this.muteButton.setTexture(muted ? "mute" : "unmute");
    sceneEvents.emit("muted", !muted);
  }

  handleCoinCollected() {
    this.coinAmt++;
    this.coinText.setText("x " + this.coinAmt);
  }

  handlePlayerReloading(reloadingTime) {
    if (reloadingTime === 0) this.knife.setAlpha(1);
    else this.knife.setAlpha(reloadingTime);
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
