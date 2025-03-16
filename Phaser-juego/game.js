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
    this.load.image('torpedo', 'https://labs.phaser.io/assets/sprites/bullet.png');
    //enemigos
    this.load.image('enemigoBuque', 'https://upload.wikimedia.org/wikipedia/commons/4/44/US_Navy_Destroyer.png');
    this.load.image('enemigoSubmarino', 'https://upload.wikimedia.org/wikipedia/commons/6/6b/USS_Nautilus_SS-168.jpg');
    this.load.image('torpedoEnemigo', 'https://labs.phaser.io/assets/sprites/bullet.png');

}

function create() {
    // Fondo oceano
    this.add.image(400, 300, 'oceano');

    // Agrega buque
    buque = this.physics.add.sprite(400, 500, 'buque');
    buque.setCollideWorldBounds(true);// para que no salga de la pantalla

    // grupo para torpedos
    torpedos = this.physics.add.group();

    // Capturar las teclas
    cursors = this.input.keyboard.createCursorKeys();

    //grupo de enemigos
    enemigos = this.physics.add.group();
    torpedosEnemigos = this.physics.add.group();
    // generar enemigos cada un tiempo
    this.time.addEvent({
    delay: 2000, //2 segundos
    callback: crearEnemigo,
    callbackScope: this,
    loop: true
    });

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

    //detecta al tocar espaico
    if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
        dispararTorpedo();
    }
}

function dispararTorpedo() {
    let torpedo = torpedos.create(buque.x, buque.y, 'torpedo');
    torpedo.setVelocityY(-300); // dispara para arriba
    torpedo.setCollideWorldBounds(true);
    torpedo.body.onWorldBounds = true;

    // Elimina torpedo al salir pantalla
    torpedo.body.world.on('worldbounds', (body) => {
        if (body.gameObject === torpedo) {
            torpedo.destroy();
        }
    });
}

function crearEnemigo() {
    let tipo = Phaser.Math.Between(0, 1); // 0 buque, 1 submarino
    let x = Phaser.Math.Between(50, 750); // posicion aleatoria X
    let enemigo = enemigos.create(x, 50, tipo === 0 ? 'enemigoBuque' : 'enemigoSubmarino');
    
    enemigo.setVelocityY(100); // movimiento enemigo abajo
    enemigo.setCollideWorldBounds(true);

    // disparo enemigo
    this.time.addEvent({
        delay: 3000, // 3 seg
        callback: () => dispararTorpedoEnemigo(enemigo),
        loop: true
    });
}

function dispararTorpedoEnemigo(enemigo) {
    if (!enemigo.active) return; // No dispara si se destruye

    let torpedo = torpedosEnemigos.create(enemigo.x, enemigo.y, 'torpedoEnemigo');
    torpedo.setVelocityY(300);
    torpedo.setCollideWorldBounds(true);
    //elim torpedos
    torpedo.body.onWorldBounds = true;
    torpedo.body.world.on('worldbounds', (body) => {
        if (body.gameObject === torpedo) {
            torpedo.destroy();
        }
    });
}
