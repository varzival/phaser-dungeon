import Phaser from "phaser";
import BootScene from "@/game/scenes/BootScene";
import PlayScene from "@/game/scenes/PlayScene";
import UIScene from "./scenes/UIScene";

function launch(containerId) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    width: 400,
    height: 250,
    parent: containerId,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 0 },
        // turn on to show colliders and velocity
        debug: false
      }
    },
    scene: [BootScene, PlayScene, UIScene],
    scale: {
      zoom: 3
    }
  });
}

export default launch;
export { launch };
