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
    this.load.image('buque', 'public/assets/buque.png');
    this.load.image('torpedo', 'https://labs.phaser.io/assets/sprites/bullet.png');
    //enemigos
    this.load.image('enemigoBuque', 'public/assets/buque-enemigo.png');  
    this.load.image('enemigoSubmarino', 'public/assets/submarino.png');
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
    buque.displayHeight = 55;

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

    //desaparecer enemigo
    let enemigosAEliminar = []; // Array de enemigos

    enemigos.children.iterate((enemigo) => {
        if (enemigo.y > 550) { //altura en y al que se destruye
        enemigosAEliminar.push(enemigo); //agregamos a lista de eliminación
        }
    });

    enemigosAEliminar.forEach((enemigo) => {
        enemigo.destroy();
    });

    
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
    let submarinosActivos = enemigos.getChildren().filter(e => e.texture.key === 'enemigoSubmarino').length;

    //si hay 4 submarinos no se crean mas
    if (tipo === 1 && submarinosActivos >= 4) {
        return;
    }

    let x = Phaser.Math.Between(50, 750); // posicion aleatoria X
    let enemigo = enemigos.create(x, 50, tipo === 0 ? 'enemigoBuque' : 'enemigoSubmarino');
    

    // Ajustar tamaño
    if (tipo === 1) {//1 es submarino
        /*enemigo.setScale(0.5);*/
        enemigo.displayWidth = 40; // Ancho
        enemigo.displayHeight = 80; // Alto
    } if (tipo === 0) {// es buque
        /*enemigo.setScale(0.5);*/
        enemigo.displayWidth = 25; // Ancho
        enemigo.displayHeight = 50; // Alto
    }

    this.physics.world.enable(enemigo);//fisicas
    enemigo.setActive(true);
    enemigo.setVisible(true);
    enemigo.setCollideWorldBounds(true);

    if (tipo === 0) {
        enemigo.setVelocityY(Phaser.Math.Between(50, 100)); // Buques
    } if (tipo === 1) {
        enemigo.setVelocityY(Phaser.Math.Between(30, 50)); // Submarinos
    }


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
