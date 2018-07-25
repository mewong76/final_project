var mainState = {
    preload: function(){
        game.load.spritesheet('player', 'images/walking.png', 75, 100);
        game.load.image('heart', 'images/heart.png');
        game.load.image('enemy', 'images/enemy.png');
        game.load.image('wall', 'images/cloud.png');  
        game.load.image('trash', 'images/trash.png');
        game.load.image('knife', 'images/knife.png');
        game.load.image('mountains-back', 'images/mountains-back.png')
        game.load.image('mountains-mid', 'images/mountains-mid1.png')
        game.load.image('mountains-mid2', 'images/mountains-mid2.png')
    },
    
    create: function(){
        
        // set the game's background color
        game.stage.backgroundColor = '#697e96';
        
        this.mountainsBack = game.add.tileSprite(0, game.height - game.cache.getImage('mountains-back').height, game.width, game.cache.getImage('mountains-back').height, 'mountains-back');
        
        this.mountainsMid = game.add.tileSprite(0, game.height - game.cache.getImage('mountains-mid').height, game.width, game.cache.getImage('mountains-mid').height, 'mountains-mid');
        
        this.mountainsMid2 = game.add.tileSprite(0, game.height - game.cache.getImage('mountains-mid2').height, game.width, game.cache.getImage('mountains-mid2').height, 'mountains-mid2');
        
        //start the arcade physics ( for movement and collision)
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        //add the physics engine to all objects
        game.world.enableBody = true;
        var text = game.add.text(game.world.centerX, 0, "Break Out" , {
                fill: 'white'
            });
        
        this.cursor = game.input.keyboard.createCursorKeys();
        
        //creates the player in the middle of the game
        this.player = game.add.sprite(90, 75, 'player');
        this.player.scale.setTo(0.8,0.8);
        this.score = 0;
        this.trashCount= 0;
        this.trashCollide = false;
        this.playerOldPos = 0;
        
        
        this.player.animations.add('walking', [0,1,2], 10);
        
        //sets the gravity of the player
        this.player.body.gravity.y = 600;
        
        //create 3 groups that will contain objects
        this.walls = game.add.group();
        this.hearts = game.add.group();
        this.enemies = game.add.group();
        this.lives = game.add.group();
        
        
        var level = [
            'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            'x                                                              x',
            'x                                                              x',
            'x                                                        h     x',
            'x      h                                                       x',
            'x                                                              x',
            'x                          k                            xxx    x',
            'x     xxx                                                      x',
            'x               x                                              x',
            'x                                                              x',
            'x                         xxxx                    h            x',
            'x                                                              x',
            'x                                               xxxxx          x',
            'x                  k                                           x',
            'x                                                              x',
            'x                                  xxxx                        x',
            'x                xxxxx                                         x',
            'x                                                              x',
            'x                                                              x',
            'x              h                           x                   x',
            'x                                                              x',
            'x                                                              x',
            'x            xxxxx                                             x',
            'x            xxxxx                                             x',
            'x            xxxxx                             xx              x',
            'x                                                              x',
            'x     xx                                                       x',
            'x     xx             k                                     t   x',
            'x                                                              x',
            'x                                                              x',
            'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            
        ];
        
                
        for(var i = 0; i < level.length; i++){
            for(var j = 0; j < level[i].length; j++){
    
   
            if(level[i][j] === 't'){
                    this.trash = game.add.sprite(30+j*20,30+i*20,'trash');
                    this.trash.scale.setTo(.1,.1); 
                    this.trash.body.immovable = true;
                                         
            }else if(level[i][j] === 'x'){
                    var wall = game.add.sprite(30+20*j, 30+20*i, 'wall');
                    wall.scale.setTo(0.1,0.1);
                    this.walls.add(wall);
                    wall.body.immovable = true;
                    
            }else if(level[i][j] === 'k'){
                    var enemy = game.add.sprite(30+20*j, 30+20*i, 'knife');
                    var tween = game.add.tween(enemy).to({x:enemy.body.x + 500, y: enemy.body.y}, 2000, "Linear", true,0, -1);
                    tween.yoyo(true, 0);
                    enemy.scale.setTo(0.1,0.1);
                    this.enemies.add(enemy);
                    
            }else if(level [i][j] === 'h'){
                    var heart = game.add.sprite(30+20*j, 30+20*i, 'heart');
                    heart.scale.setTo(0.05, 0.05);
                    this.hearts.add(heart);
            }    
        }
    }

            },
    
    update: function(){
        //Check for player and walls colliding 
        game.physics.arcade.collide(this.player, this.walls);
        
        //check for player and coins overlapping
        game.physics.arcade.overlap(this.player, this.hearts, this.takeHeart, null, this);
        
        //check for player and enemy overlapping
        game.physics.arcade.overlap(this.player, this.enemies, this.takeKnife, null, this);
        
        game.physics.arcade.collide(this.player, this.trash, this.takeTrash, null, this)
        
        
        if(this.score >=5){
            var text = game.add.text(game.world.centerX, game.world.centerY, "You won" , {
                fill: 'white'
            });
            text.anchor.setTo(.5,.5);
        }
        
        if(this.cursor.left.isDown){
            if(this.playerOldPos != this.player.body.x){
                this.mountainsBack.tilePosition.x += 0.5;
                this.mountainsMid.tilePosition.x += 0.9;
                this.mountainsMid2.tilePosition.x += 1.4;
            }
           this.player.body.velocity.x = -500;
            this.player.animations.play("walking");
        }else if(this.cursor.right.isDown){
            if(this.playerOldPos != this.player.body.x){
                this.mountainsBack.tilePosition.x -= 0.5;
                this.mountainsMid.tilePosition.x -= 0.9;
                this.mountainsMid2.tilePosition.x -= 1.4;
            }
            this.player.body.velocity.x = 500;
            this.player.animations.play("walking");
        }else{
            this.player.body.velocity.x = 0;
        }
        
        if(this.cursor.up.isDown && this.player.body.touching.down){
          this.player.body.velocity.y = -400; 
            
        }
    },
    
    takeHeart: function(player, heart) {
        this.score++;
        this.displayHearts();
        heart.kill();
    },
    takeTrash: function(player, trash){
        
        if(!this.trashCollide){
            this.trashCollide = true;
            this.trashCount++;
            if(this.trashCount === 2){
                this.score++;
                this.displayHearts();
                trash.kill();
            }
            var that = this;
            setTimeout(function(){
                that.trashCollide = false;
            }, 1000);
        }
        
    },
    takeKnife: function(player, knife){
        if(this.score === 0){
            game.state.start('main');
        }else{
            knife.kill();
            this.score--;
            this.deleteHearts();
            this.displayHearts()
        }
    },
    
    displayHearts: function(){
        for(var i = 0; i < this.score; i++){
            var life = game.add.sprite(i*50, 0, "heart");
            life.scale.setTo(.05,.05);
            this.lives.add(life);
        }
    },
    
    deleteHearts: function(){
        this.lives.forEach(function(life){
            life.kill();
        })
    }
}

    
    


var game = new Phaser.Game(1400,700);
game.state.add('main', mainState);
game.state.start('main');