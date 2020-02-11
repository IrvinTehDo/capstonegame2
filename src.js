const c = document.getElementById("gameCanvas");
const ctx = c.getContext("2d");
const CENTER_X = 100;
const CENTER_Y = 100;
const grid = [];
var lineSession = [];
const circleColors = ['red', 'green', 'blue', 'cyan'];;
var selected = null;
var mouseDown = false;

// function to get circle x,y, and radius
function elem(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
}

// function to draw circles
const DrawOvalShape = (ctx, center_x, center_y, radius, color) =>{
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(center_x, center_y, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
};

// function to draw rectangle??

const drawRect = (ctx, x, y, width, height, color) => {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
    ctx.closePath();
};

const GenerateGrid = () => {
    for(i = 1; i < 10; i++){  // 9 circles columns
        for(j = 1; j < 7; j++){ // 7 rows
            var color = circleColors[Math.floor(Math.random() * circleColors.length)];
            const newEl = new elem(CENTER_X * i, CENTER_Y * j, 25, color);
            grid.push(newEl);
        }
    }
}


// updates the line movement
const Update = () => {
};

// draw it

const Draw = () => {
    ctx.clearRect(0,0,1000,1000);
    Connect();
    for(var i = 0; i < grid.length; i++){
        DrawOvalShape(ctx, grid[i].x, grid[i].y, 25, grid[i].color);
    }
}

const Connect = () => {
    if(lineSession.length <= 1){
        return;
    }

    for (i = 1; i < grid.length; i++){
        const previous = lineSession[i - 1];
        const current = lineSession[i];
        drawLine(previous, current);
    }
}


function drawLine (previous, element) {
    if(!element || !previous) return;

    ctx.beginPath();
    ctx.moveTo(previous.x, previous.y);
    ctx.lineTo(element.x, element.y);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();
}


const CheckScore = () => {
    
};

window.addEventListener("keypress", (e) => {

});

c.addEventListener('mousedown', function (e){
    mouseDown = true;
    Connect(e);
});

c.addEventListener('mouseup', function (e){
    mouseDown = false;
    lineSession = [];
    CheckScore();
});

const MouseInCircle = (circle, mouse) => {
    const distX = mouse.x - circle.x;
    const distY = mouse.y - circle.y;
    const dist = Math.sqrt((distX*distX) + (distY*distY));
    if(dist <= circle.radius){
        return true;
    }
    return false;
};

c.addEventListener('mousemove', function (e){
    if(mouseDown){
        const mouse = {x: e.clientX, y: e.clientY};
        for(let i = 0; i < grid.length; i++){
            if(MouseInCircle(grid[i], mouse)){
                lineSession.push(grid[i]);
            } else {

            };
        }
    }
});

GenerateGrid();

// Draw at 60fps
setInterval(() => {
   Update();
   Draw();
}, 1000/60);

