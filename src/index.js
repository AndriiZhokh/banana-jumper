import Phaser from "phaser";
import PlayScene from './PlayScene';
import MenuScene from './MenuScene';

const gameState = {}

const config = {
  type: Phaser.AUTO,
  width: 350,
  height: 600,
  backgroundColor: "4f92ff",
  scene: [
    MenuScene,
    PlayScene,
  ],
  physics: {
    default: 'arcade',
    gravity: { y: 500 },
  },
}

const game = new Phaser.Game(config);

