var myGamePiece;
var myObstacles = [];
var mousePos = {};
var movebymouse = false;
var score = 0;
var ballsNumber = 0;
const img = new Image();
img.src = 'http://192.168.0.147:8080/game/pepe.png';
var gameSound , loseSound; 
function startGame() {
    
    gameSound = new sound("https://raw.githack.com/vincentsit-1202/game/master/fragrance.mp3");
    loseSound = new sound("https://raw.githack.com/vincentsit-1202/game/master/rubbish.mp3");
    gameSound.play();
    myGamePiece = new component(30, 30, "red", 320, 750);
    img.onload = myGameArea.start();
    myGameArea.context.drawImage(img, 320, 750, 30, 30);
    myGameArea.canvas.addEventListener('mousedown', function (evt) {
        
        mousePos = getMousePos(myGameArea.canvas, evt);

        if (collides(myGamePiece, mousePos.x, mousePos.y)) {
            movebymouse = true;
        }
    }, false);
    myGameArea.canvas.addEventListener('mousemove', function (evt) {

        mousePos = getMousePos(myGameArea.canvas, evt);

        if (movebymouse)

            myGamePiece.x = mousePos.x - myGamePiece.width / 2;

    }, false);
    myGameArea.canvas.addEventListener('mouseup', function (evt) {

        if (movebymouse)

            movebymouse = false
    }, false);
    //   document.body.addEventListener("touchstart", function (e) {
    //     if (e.target == canvas) {
    //       e.preventDefault();
    //     }
    //   }, false);
    //   document.body.addEventListener("touchend", function (e) {
    //     if (e.target == canvas) {
    //       e.preventDefault();
    //     }
    //   }, false);
    //   document.body.addEventListener("touchmove", function (e) {
    //     if (e.target == canvas) {
    //       e.preventDefault();
    //     }
    //   }, false);
    myGameArea.canvas.addEventListener("touchstart", function (e) {
        mousePos = getTouchPos(myGameArea.canvas, e);
        
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousedown", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        myGameArea.canvas.dispatchEvent(mouseEvent);
        
        if (collides(myGamePiece, mouseEvent.clientX,  mouseEvent.clientY)) {
            movebymouse = true;
        }
    }, false);
    myGameArea.canvas.addEventListener("touchend", function (e) {
        var mouseEvent = new MouseEvent("mouseup", {});
        myGameArea.canvas.dispatchEvent(mouseEvent);
        if (movebymouse)

        movebymouse = false
    }, false);
    myGameArea.canvas.addEventListener("touchmove", function (e) {
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousemove", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        myGameArea.canvas.dispatchEvent(mouseEvent);
        if (movebymouse)

        myGamePiece.x = mouseEvent.clientX - myGamePiece.width / 2;
    }, false);

    // Get the position of a touch relative to the canvas
    

}
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    this.sound.loop = true
    document.body.appendChild(this.sound);
    this.play = function(){
      this.sound.play();
    }
    this.stop = function(){
      this.sound.pause();
    }
  }
function play(){
    gameSound.play();
}
function getTouchPos(canvasDom, touchEvent) {
    var rect = canvasDom.getBoundingClientRect();
    return {
        x: touchEvent.touches[0].clientX - rect.left,
        y: touchEvent.touches[0].clientY - rect.top
    };
}
function collides(rects, x, y) {
    var isCollision = false;

    var left = rects.x, right = rects.x + rects.width;
    var top = rects.y, bottom = rects.y + rects.height;
    if (right >= x
        && left <= x
        && bottom >= y
        && top <= y) {
        isCollision = true;
    }

    return isCollision;
}

var myGameArea = {
    canvas: document.getElementById('myCanvas'),
    start: function () {
     
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
  
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        clearInterval(this.interval);
        gameSound.stop();
        loseSound.sound.loop = false;
        loseSound.play();
    }
}

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function () {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
    }
    this.crashWith = function (otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;

    myGameArea.clear();
    myGameArea.frameNo += 1;

    score = myGameArea.frameNo * 20

    if (score < 10000)
        ballsNumber = score / 2000 + 1
    else
        ballsNumber = 6 + score / 10000
    if (myObstacles.length < ballsNumber) {

        x = getRandomInt(0, myGameArea.canvas.width - 30);;

        y = getRandomInt(-100, -40);

        myObstacles.push(new component(30, 30, "green", x, y));

    }
    for (i = 0; i < myObstacles.length; i += 1) {

        if (myObstacles[i].y > 800) {
            myObstacles.splice(i, 1);
        }
        if (score > 60000)
            myObstacles[i].y += 30
        else
            myObstacles[i].y += score / 2000

        myObstacles[i].update();

    }
    console.log(myObstacles.length)
    myGamePiece.update();
    myGameArea.context.drawImage(img, myGamePiece.x - 20, myGamePiece.y - 20, 60, 60);

    myGameArea.context.fillStyle = "white"
    myGameArea.context.font = "30px Comic Sans MS";
    myGameArea.context.fillText('score: ' + score, 10, 50);
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            myGameArea.stop();
            return;
        }
    }
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) { return true; }
    return false;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
function moveleft() {
    myGamePiece.x -= 1;
}

function moveright() {
    myGamePiece.x += 1;
}

function clearmove() {
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
}
