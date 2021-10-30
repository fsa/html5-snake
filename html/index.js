'use strict'

const div = document.getElementById('game');
const settings = getComputedStyle(div);
const game = {
    width: Number(settings.getPropertyValue('--width')),
    height: Number(settings.getPropertyValue('--height')),
    blockSize: Number(settings.getPropertyValue('--block-size')),
    headerSize: Number(settings.getPropertyValue('--header-size')),
    colorFrame: getComputedStyle(div).getPropertyValue('--color-frame'),
    colorField1: getComputedStyle(div).getPropertyValue('--color-field1'),
    colorField2: getComputedStyle(div).getPropertyValue('--color-field2'),
    colorHead: getComputedStyle(div).getPropertyValue('--color-head'),
    colorBody: getComputedStyle(div).getPropertyValue('--color-body'),
};
const canvas = document.createElement("canvas");
const ctx = canvas.getContext('2d');
div.appendChild(canvas);
canvas.width = game.blockSize*(game.width+2);
canvas.height = game.blockSize*(game.height+1)+game.headerSize;
canvas.style.display = 'block';
canvas.style.maxWidth = '100%';
canvas.style.maxHeight = '100vh';

const field = Array.from(Array(game.width), () => new Array(game.height));
let x = Math.floor(game.width / 2),
    y = Math.floor(game.height / 2);
const snake = [[x, y - 2], [x, y - 1], [x, y]];
field[y][x] = 'h';
field[y-1][x] = 'b';
field[y-2][x] = 'b';
let dir='d';
drawGame();

let fruit_timer=0;

let interval = setInterval(()=>{
    if(fruit_timer++>5) {
        fruit_timer=0;
        let fruit_x=Math.floor(Math.random()*game.width);
        let fruit_y = Math.floor(Math.random() * game.height);
        if(!field[fruit_y][fruit_x]) {
            field[fruit_y][fruit_x]='a';
            fillBlock(fruit_x, fruit_y, 'olive');
        }
    }
    moveHead(dir);
}, 100);


addEventListener('keydown', movePlayer);
function movePlayer(event) {
    switch (event.keyCode) {
        case 37:
            if(dir!='r') {
                dir = 'l';
            }
            break;
        case 38:
            if (dir != 'd') {
                dir = 'u';
            }
            break;
        case 39:
            if (dir != 'l') {
                dir = 'r';
            }
            break;
        case 40:
            if (dir != 'u') {
                dir = 'd';
            }

            break;
    }
}

// Управление свайпами
const sensitivity = 20;
let touchStartPos, touchPosition;
addEventListener("touchstart", touchStart);
addEventListener("touchmove", touchMove);
addEventListener("touchend", touchEnd);

function touchStart(e) {
    touchStartPos = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    touchPosition = { x: touchStartPos.x, y: touchStartPos.y };
}

function touchMove(e) {
    touchPosition = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
}

function touchEnd(e, color) {
    CheckAction();
    touchStartPos = null;
    touchPosition = null;
}

function CheckAction() {
    var d = {
        x: touchStartPos.x - touchPosition.x,
        y: touchStartPos.y - touchPosition.y
    };

    if (Math.abs(d.x) > Math.abs(d.y)) {
        if (Math.abs(d.x) > sensitivity) {
            if (d.x > 0) {
                dir='l';
            } else {
                dir='r';;
            }
        }
    } else {
        if (Math.abs(d.y) > sensitivity) {
            if (d.y > 0) {
                dir='u';
            } else {
                dir='d';
            }
        }
    }
}

function stopGame(message) {
    clearInterval(interval);
    if(message) {
        alert(message);
    }
}

function moveHead(dir) {
    switch(dir) {
        case 'l':
            x--;
            break;
        case 'r':
            x++;
            break;
        case 'u':
            y--;
            break;
        case 'd':
            y++;
            break;
        default:
            stopGame('Неверное направление движения');
    }
    if (x < 0 || x >= game.width || y < 0 || y >= game.height) {
        stopGame('Ударом о борт делаем аборт! :-)');
    }
    let fruit=false;
    switch (field[y][x]) {
        case 'b':
            stopGame('Вы укусили себя за хвост');
            break;
        case 'a':
            fruit = true;
            break;
    }
    snake.push([x, y]);
    if(!fruit) {
        let old=snake.shift();
        field[old[1]][old[0]]=null;
        showBlock(old[0], old[1]);
    }
    field[snake[snake.length - 2][1]][snake[snake.length - 2][0]]='b';
    showBlock(snake[snake.length - 2][0], snake[snake.length - 2][1], 'b');
    field[y][x]='h';
    showBlock(x,y,'h');
}

function drawGame() {
    ctx.fillStyle = game.colorFrame;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    let y = 40;
    for (let y = 0; y < game.height; y++) {
        for (let x = 0; x < game.width; x++) {
            showBlock(x, y, field[y][x]);
        }
    }
}

function showBlock(x, y, element) {
    switch (element) {
        case 'h':
            fillBlock(x, y, game.colorHead);
            break;
        case 'b':
            fillBlock(x, y, game.colorBody);
            break;
        default:
            fillBlock(x, y, (x % 2) ^ (y % 2) ? game.colorField1 : game.colorField2);
    }
}

function fillBlock(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect((x + 1) * game.blockSize, game.headerSize + y * game.blockSize, game.blockSize, game.blockSize);
}