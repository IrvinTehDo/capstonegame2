const c = document.getElementById("gameCanvas");
const ctx = c.getContext("2d");

ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

const NITROGEN = new Image();
NITROGEN.src = "assets/nitrogen.svg";
const OXYGEN = new Image();
OXYGEN.src = "assets/oxygen.svg";
const CARBON = new Image();
CARBON.src = "assets/carbon.svg";

const START_X = 446;
const START_Y = 162;
const SPACING_X = 110.67;
const SPACING_Y = 95.67;
const RADIUS = 35.8347;
const ROWS = 6;
const COLUMNS = 11;
const grid = [];

var score = 0;
var timer = '01:00';
var time = 60;
var frame = 0;

var lineSession = [];
var ignoreList = [];
const circleColors = {
    'red': 20,
    'blue': 40,
    'green': 40,
};
var selected = null;
var mouseDown = false;

// function for weighted colors
// https://stackoverflow.com/questions/43566019/how-to-choose-a-weighted-random-array-element-in-javascript
function getColor(input) {
    var array = []; // Just Checking...
    for(var circleColors in input) {
        if ( input.hasOwnProperty(circleColors) ) { // Safety
            for( var i=0; i<input[circleColors]; i++ ) {
                array.push(circleColors);
            }
        }
    }
    return array[Math.floor(Math.random() * array.length)];
};


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

const DrawElement = (ctx, x, y, color) => {
    var svg = '';
    if(color == 'red') svg = CARBON;
    else if(color == 'blue') svg = OXYGEN;
    else if (color == 'green') svg = NITROGEN;

    ctx.drawImage(svg, x, y);
};

const DrawText = (ctx, x, y, font, type, size, style, text) => {
    ctx.font = `${type} ${size}px ${font}`;
    ctx.fillStyle = style;
    ctx.fillText(text, x, y, 140);
}

// function to draw rectangle??

const drawRect = (ctx, x, y, width, height, color) => {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
    ctx.closePath();
};

const GenerateGrid = () => {
    for(i = 1; i < COLUMNS + 1; i++){  // 9 circles columns
        for(j = 1; j < ROWS + 1; j++){ // 7 rows
            var color = getColor(circleColors);
            const newEl = new elem(START_X + (SPACING_X * i), START_Y + (SPACING_Y * j), RADIUS, color);
            grid.push(newEl);
        }
    }
}


// updates the line movement
const Update = () => {
    frame++;
    console.log(frame);
    if(frame == 60){
        frame = 0;
        time--;
    }

    if(time == 60){
        timer = '01:00';
    } else if(time < 60){
        timer = `00:${time}`;
    } else if (time <= 0){
        timer = `00:00`;
    }
};

// draw it

const Draw = () => {
    ctx.clearRect(0,0,1920,1080);
    const img = new Image();
    img.src = "assets/bg.png";
    ctx.drawImage(img,0,0,1903,941);
    if(score == 0){
        DrawText(ctx, 185, 235, 'Oxanium', 'normal', 40, 'white', '0000');
    } else {
        DrawText(ctx, 185, 235, 'Oxanium', 'normal', 40, 'white', score);
    }
    DrawText(ctx, 1625, 95, 'Oxanium', 'bold', 40, 'white', timer);
    Connect();
    for(var i = 0; i < grid.length; i++){
        // DrawOvalShape(ctx, grid[i].x, grid[i].y, RADIUS, grid[i].color);
        DrawElement(ctx, grid[i].x - (RADIUS + RADIUS/2), grid[i].y - (RADIUS + RADIUS/2), grid[i].color);
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
    ctx.strokeStyle = '#7283A3';
    ctx.moveTo(previous.x- 10, previous.y - 10);
    ctx.lineTo(element.x- 10, element.y - 10);
    ctx.moveTo(previous.x + 10, previous.y + 10);
    ctx.lineTo(element.x + 10, element.y + 10);
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.closePath();
}


const CheckScore = () => {
    if(ignoreList.length == 3 || (ignoreList.length === 2 && grid[ignoreList[ignoreList.length - 1]].color === 'blue') ||(ignoreList.length === 2 && grid[ignoreList[ignoreList.length - 1]].color === 'green')
    ){
        for(let i = 0; i < ignoreList.length; i++){
            const prevX = grid[ignoreList[i]].x;
            const prevY = grid[ignoreList[i]].y;
            var color = getColor(circleColors);
            grid[ignoreList[i]] = new elem(prevX, prevY, RADIUS, color);
        }


        if(ignoreList.length == 2){
            if(ignoreList[0] + 1 == ignoreList[1] || ignoreList[0] - 1 == ignoreList[1]){ // Two in the same lane
                let z = ignoreList[0];
                if(z > ignoreList[1]) z = ignoreList[1];
                for(z-1; z%ROWS != 0; z--){
                    grid[z+2] = grid[z]; 
                    grid[z+2].y += SPACING_Y*2;
                }
                grid[z+2] = grid[z]; 
                grid[z+2].y += SPACING_Y*2;
                grid[z] = new elem(grid[z].x, START_Y + SPACING_Y, RADIUS, getColor(circleColors));
                grid[z+1] = new elem(grid[z+1].x, START_Y + (SPACING_Y*2), RADIUS, getColor(circleColors));
                // TO FIX: If picking from bottom 2, it will move 1 down and be out of bounds.
            } else { // Two in different lanes

            }

            score += 1000;
        } else if(ignoreList.length == 3){
            score += 1500;
        }

    }
};

window.addEventListener("keypress", (e) => {

});

c.addEventListener('mousedown', function (e){
    mouseDown = true;
    Connect(e);
});

c.addEventListener('mouseup', function (e){
    CheckScore();
    mouseDown = false;
    lineSession = [];
    ignoreList = [];
});

const MouseInCircle = (circle, mouse) => {
    return Math.sqrt((circle.x - mouse.x)*(circle.x - mouse.x) + (circle.y - mouse.y) * (circle.y - mouse.y)) < circle.radius;
};


c.addEventListener('mousemove', function (e){
    if(mouseDown){
        const mouse = {x: e.clientX, y: e.clientY};

        // Limit selectable dots to 3
        if(ignoreList.length >= 2 && grid[ignoreList[ignoreList.length-1]].color != 'red'){ 
            return;
        }
 
        // for oxygen & nitrogen molecules
        if (ignoreList.length == 3 || (ignoreList.length === 2 && grid[ignoreList[ignoreList.length - 1]].color === 'blue')){
            return;
        }

        // Check if mouse is over grid.
        for(let i = 0; i < grid.length; i++){

            //Iterate through our ignore list aka circles we've already hovered over. If we are on one, return.
            for(let z = 0; z < ignoreList.length; z++){
                if(ignoreList[z] == i){
                    if(MouseInCircle(grid[i], mouse)){
                        return;
                    }
                }
            }

            // If it's a circle we're not over, add it to the line session and return.
            if(MouseInCircle(grid[i], mouse)){
                if (ignoreList.length > 0) {
                    // Check if same color.
                    // Then Check if it's horizontal or vertical. 
                    // Then check to prevent red dot's from connecting

                    if(grid[i].color != grid[ignoreList[ignoreList.length - 1]].color && grid[ignoreList[0]].color != 'blue'){
                        return; }
                     else if((grid[i].color != grid[ignoreList[ignoreList.length - 1]].color) && (ignoreList.length == 1 && grid[ignoreList[0]].color == 'blue' && grid[i].color != 'red')){
                        return; }
                     else if((grid[i].color != grid[ignoreList[ignoreList.length - 1]].color) && (ignoreList.length == 2 && grid[ignoreList[0]].color == 'blue' && grid[ignoreList[1]].color == 'red' && grid[i].color != 'blue')){
                        return;
                    }

                    if(ignoreList[ignoreList.length -1] + ROWS != i &&
                        ignoreList[ignoreList.length -1] - ROWS != i &&
                        ignoreList[ignoreList.length -1] + 1 != i &&
                        ignoreList[ignoreList.length -1] - 1 != i) {
                            return;
                    }

                    if(grid[i].color == 'red' && grid[ignoreList[ignoreList.length -1]].color == 'red'){
                        return;
                    }
                }

                lineSession.push(grid[i]);
                ignoreList.push(i); // selected the three circles
                return;
            } 
        }
    }
});

GenerateGrid();

// Draw at 60fps
setInterval(() => {
   Update();
   Draw();
}, 1000/60);

