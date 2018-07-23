var mainState = {
    preload: function(){   
        game.load.image('trash', 'media/grey2.png');
    },
    scale.mainState = 0.5; 
    //creates player in middle of the game
    this.player = game.add.sprite(70, 100, 'player');
    this.score = 0;
    //sets the gravtiy of the player
     this.player.body.gravity.y = 600;

    for(var i = 0; i < level.length; i++){
     
        for(var j = 0; j < level[i].length; j++){
    
        if(level[i][j] === 't'){
            var mainState = game.add.sprite(30+20*j, 30+20*i, 'trash');
            this.trashes.add(trash);
            trash.body.immovable = true;
            } 
        }
    }
    
    if (player isTouching(player)) {
                takeTrash: function(player, trash){
        this.score++;
        trash.kill();
        },
        
    }
    