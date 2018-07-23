var mainState = {
    preload: function(){   
        game.load.image('player', 'media/player.png');
        game.load.image('wall', 'media/wall.png');
        game.load.image('coin', 'media/coin.png');
        game.load.image('enemy', 'media/enemy.png');
    },
    
    create: function(){
        //set the game's background color
        game.state.backgroundColor = '#358db';
        
        
        // start the arcade physics system (for movement and collision)
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        //add the physics engine to all objects
        game.world.enableBody = true;
        
        this.cursor = game.input.keyboard.createCursorKeys();
        
        //creates player in middle of the game
        this.player = game.add.sprite(70, 100, 'player');
        this.score = 0;
        //sets the gravtiy of the player
        this.player.body.gravity.y = 600;
        
        //create 3 groups that will contain objects
        this.walls = game.add.group();
        this.coins = game.add.group();
        this.enemies = game.add.group();
        
        var level = [
            'xxxxxxxxxxxxxxxxxxxxxx',
            '!          !         x',
            '!                 o  x',
            '!          o         x',
            '!                    x',
            '!      o   !    x    x',
            'xxxxxxxxxxxxxxxxx!!!!x',
        ];
        
        for(var i = 0; i < level.length; i++){
            for(var j = 0; j < level[i].length; j++){
                
                if(level[i][j] === 'x'){
                    var wall = game.add.sprite(30+20*j, 30+20*i, 'wall');
                    this.walls.add(wall);
                    wall.body.immovable = true;
                    
                }else if(level[i][j] === '!'){
                    var enemy = game.add.sprite(30+20*j, 30+20*i, 'enemy');
                    this.enemies.add(enemy);
                }else if(level[i][j] === 'o'){
                    var coin = game.add.sprite(30+20*j, 30+20*i, 'coin');
                    this.coins.add(coin);    
                }
            }
              
        }
             
        
                             
    },
    
    update: function(){
        //check for players and walls colliding
        game.physics.arcade.collide(this.player, this.walls);
        
        //check for player and coins overlaping
        game.physics.arcade.overlap(this.player, this.coins, this.takeCoin, null, this);
        
        //check for player and enemy overlaping
        game.physics.arcade.overlap(this.player, this.enemies, this.restart, null, this);
        
        if(this.score >= 3){
            var text = game.add.text(game.world.centerX, game.world.centerY, "you won", {
                fill: "white"
            });
            text.anchor.setTo(0.5, 0.5)
            
        }
        
        
        if(this.cursor.left.isDown){
           this.player.body.velocity.x = -200;
           }else if(this.cursor.right.isDown){
           this.player.body.velocity.x = 200;
           }else{
               this.player.body.velocity.x = 0;
           }
        
        if(this.cursor.up.isDown && this.player.body.touching.down){
            this.player.body.velocity.y = -200;
        }
        
    },
    
    takeCoin: function(player, coin){
        this.score++;
        coin.kill();
    },
    
    restart: function(){
    game.state.start('main');
}
    
}

var game = new Phaser.Game(500,200);
game.state.add('main', mainState);
game.state.start('main');