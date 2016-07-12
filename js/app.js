var requestAnimFrame = (function(){
    return window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();

var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 640;
canvas.height = 416;
document.body.appendChild(canvas);

var lastTime;
function main() {
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;
    update(dt);
    render();

    lastTime = now;
    requestAnimFrame(main);
};

function init() {
    reset();
    lastTime = Date.now();
    main();
}

resources.load([
    'img/pered.png',
	'img/zad.png',
	'img/left.png',
	'img/right.png',
    'img/1.png',
	'img/grass3.png',
	'img/block.png'
]);
resources.onReady(init);

var player = {
    pos: [0, 0],
	btn: '',
    sprite: new Sprite('img/pered.png', [0, 0], [32, 48], 0, [0, 1, 2, 3])
};

var grass = {
	pos: [0, 0],
    sprite: new Sprite('img/grass3.png', [0, 0], [32, 32], 0, 0)	
}

var block = {
	pos: [0, 0],
    sprite: new Sprite('img/block.png', [0, 0], [32, 32], 0, 0)	
}

var blocks = [];

var lastFire = Date.now();
var terrainPattern;

var playerSpeed = 100;

function update(dt) {

    handleInput(dt);
    updateEntities(dt);
    checkCollisions();

};

function handleInput(dt) {
	if(input.isDown('SHIFT')){
		playerSpeed = 200;
		player.sprite.speed = 20;
	} else {
		playerSpeed = 100;
		player.sprite.speed = 14;
	}
		
	
    if(input.isDown('DOWN') || input.isDown('s')) {
        player.pos[1] += playerSpeed * dt;
		player.sprite.url = 'img/pered.png';
		player.sprite.speed = 14;
		player.btn = 'DOWN';
	} else if(input.isDown('UP') || input.isDown('w')) {
        player.pos[1] -= playerSpeed * dt;
		player.sprite.url = 'img/zad.png';
		player.sprite.speed = 14;
		player.btn = 'UP';
    } else if(input.isDown('LEFT') || input.isDown('a')) {
        player.pos[0] -= playerSpeed * dt;
		player.sprite.url = 'img/left.png';
		player.sprite.speed = 14;
		player.btn = 'LEFT';
    } else if(input.isDown('RIGHT') || input.isDown('d')) {
        player.pos[0] += playerSpeed * dt;
		player.sprite.url = 'img/right.png';
		player.sprite.speed = 14;
		player.btn = 'RIGHT';
    } else {
		player.sprite.speed = 0;
	}
}

function updateEntities(dt) {
    player.sprite.update(dt);
}



function collides(x, y, r, b, x2, y2, r2, b2) {
    return !(r <= x2 || x > r2 ||
             b <= y2 || y > b2);
}

function boxCollides(pos, size, pos2, size2) {
    return collides(pos[0], pos[1],
                    pos[0] + size[0], pos[1] + size[1],
                    pos2[0], pos2[1],
                    pos2[0] + size2[0], pos2[1] + size2[1]);
}

function checkCollisions() {
		checkPlayerBounds();
	for(var i = 0; i < blocks.length; i++){
        var pos = blocks[i];
        var size = block.sprite.size;
		var size2 = [20, player.sprite.size[1] - 30];
		var pos2 = [player.pos[0] + 2, player.pos[1] + 28];
		
        if(boxCollides(pos, size, pos2, size2)) {
			switch (player.btn) {
				case 'RIGHT':
					player.pos[0] = pos[0] - 25;
					break;
				case 'LEFT':
					player.pos[0] = pos[0] + size[0];
					break;
				case 'UP':
					player.pos[1] = pos[1] + size[1] - 28;
					break;
				case 'DOWN':
					player.pos[1] = pos[1] - player.sprite.size[1] - 2;
					break;
			}
		}
	}
}

function checkPlayerBounds() {
    if(player.pos[0] < 0) {
        player.pos[0] = 0;
    }
    else if(player.pos[0] > canvas.width - player.sprite.size[0]) {
        player.pos[0] = canvas.width - player.sprite.size[0];
    }

    if(player.pos[1] < 0) {
        player.pos[1] = 0;
    }
    else if(player.pos[1] > canvas.height - player.sprite.size[1]) {
        player.pos[1] = canvas.height - player.sprite.size[1];
    }
}

function render() {
	var map = [];
	mapping.setMap(map, 1);
	build.draw(map);

    renderEntity(player);
	
};

function renderEntity(entity) {
    ctx.save();
    ctx.translate(entity.pos[0], entity.pos[1]);
    entity.sprite.render(ctx);
    ctx.restore();
}

function reset() {
    player.pos = [50, canvas.height / 2];
	
};
