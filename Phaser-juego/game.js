const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);
let buque;
let cursors; // teclas flecha

function preload() {
    //carga las imagenes
    this.load.image('oceano', 'https://labs.phaser.io/assets/skies/deepblue.png');
    this.load.image('buque', 'https://labs.phaser.io/assets/sprites/ufo.png');
}

function create() {
    // Fondo oceano
    this.add.image(400, 300, 'oceano');

    // Agrega buque
    buque = this.physics.add.sprite(400, 500, 'buque');
    buque.setCollideWorldBounds(true);// para que no salga de la pantalla
    // Capturar las teclas
    cursors = this.input.keyboard.createCursorKeys();

}

function update() {
    // Reinicia velocidad
    buque.setVelocity(0);

    // Movimientos
    if (cursors.up.isDown) {
        buque.setVelocityY(-200);
    }

    else if (cursors.down.isDown) {
        buque.setVelocityY(200);
    }

    // Mov izq y der
    if (cursors.left.isDown) {
        buque.setVelocityX(-200);
    }

    else if (cursors.right.isDown) {
        buque.setVelocityX(200);
    }

}
