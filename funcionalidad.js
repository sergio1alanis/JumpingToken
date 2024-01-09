var token;
var obstaculo = [];
var score;


function startGame() {
    token = new component(15, 15, "yellow", 20, 120);
    score = new component("30px", "Consolas", "black", 280, 40, "text");
    myGameArea.start();
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas,
            document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);


        window.addEventListener('keydown', function(e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = true;
        })
        window.addEventListener('keyup', function(e) {
            myGameArea.keys[e.keyCode] = false;
        })
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width,
            this.canvas.height);
    },
    stop: function() {
        clear.interval(this.interval);
    }

}



function component(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
    }

    this.crashWith = function(otherObj) {
        var izquierda = this.x;
        var derecha = this.x + (this.width);
        var tope = this.y;
        var abajo = this.y + (this.height);
        var otherLeft = otherObj.x;
        var otherRight = otherObj.x + (otherObj.width);
        var otherTop = otherObj.y;
        var otherBottom = otherObj.y + (otherObj.height);
        var crash = true;
        if ((abajo < otherTop) || (tope > otherBottom) ||
            (derecha < otherLeft) || (izquierda > otherRight)
        ) {
            crash = false;
        }
        return crash;
    }
}



function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;

    for (i = 0; i < obstaculo.length; i += 1) {
        if (token.crashWith(obstaculo[i])) {
            myGameArea.stop();
            return;
        }

    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
        obstaculo.push(new component(10, height, "red", x, 0));
        obstaculo.push(new component(10, x - height - gap, "green", x, height + gap));
    }
    for (i = 0; i < obstaculo.length; i += 1) {
        obstaculo[i].speedX = -1;
        obstaculo[i].newPos();
        obstaculo[i].update();
    }


    token.speedX = 0;
    token.speedY = 0;
    if (myGameArea.keys && myGameArea.keys[37]) {
        token.speedX = -1;
    }
    if (myGameArea.keys && myGameArea.keys[39]) {
        token.speedX = 1;
    }
    if (myGameArea.keys && myGameArea.keys[38]) {
        token.speedY = -1;
    }
    if (myGameArea.keys && myGameArea.keys[40]) {
        token.speedY = 1;
    }

    score.text = "SCORE: " + myGameArea.frameNo;
    score.update();
    token.newPos();
    token.update();

}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {
        return true;
    }
    return false;
}