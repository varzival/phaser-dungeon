import Phaser from "phaser";
import BootScene from "@/game/scenes/BootScene";
import PlayScene from "@/game/scenes/PlayScene";

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
        debug: true
      }
    },
    scene: [BootScene, PlayScene],
    scale: {
      zoom: 3
    }
  });
}

export default launch;
export { launch };
