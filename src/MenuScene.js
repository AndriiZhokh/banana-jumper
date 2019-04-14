import Phaser from 'phaser';

class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
    this.best = 0;
  }
  init(data) {
    this.cong = data;
    this.best = (!this.best) ? this.cong.result : (this.cong.result < this.best) ? this.cong.result : this.best;
  }

  preload() {
    this.controls = this.load.image('controls', '../assets/controls.png');
  }
  
  create() {
    this.add.text(100, this.game.config.height / 20, `Best score: ${!this.best ? '' : this.best} sec`);
    this.add.text(15, this.game.config.height / 3, 'Jumper Banana', {
      font: '40px'
    });
    this.add.text(this.game.config.width / 2 - 65, this.game.config.height / 2.3, 'by Andrii Zhokh');

    this.cursors = this.input.keyboard.createCursorKeys();

    if (this.cong.greeting) {
      this.add.text(50, this.game.config.height / 2.1, `Congratulations your result`);
      this.add.text(this.game.config.width / 2 - 20, this.game.config.height / 1.95, `${this.cong.result} sec`);
      this.add.text(120, this.game.config.height / 1.8, `try do better`);
    }
    
    this.add.text(15, this.game.config.height / 1.5, 'PRESS UP TO START', {
      font: '30px'
    });

    console.log(this.add.text(70, this.game.config.height / 1.3, 'Help banana get home'));

    this.controls = this.add.image(175, 550, 'controls');
  }

  update() {
    if(this.cursors.up.isDown) {
      this.scene.start('PlayGame', 'hello from menu');
    }
  }
}

export default MenuScene;