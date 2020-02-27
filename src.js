const c = document.getElementById("gameCanvas");
const ctx = c.getContext("2d");
const CENTER_X = 100;
const CENTER_Y = 100;
const grid = [];
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
            var color = getColor(circleColors);
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
    if(ignoreList.length == 3 || (ignoreList.length === 2 && grid[ignoreList[ignoreList.length - 1]].color === 'blue') ||(ignoreList.length === 2 && grid[ignoreList[ignoreList.length - 1]].color === 'green')
    ){
        for(let i = 0; i < ignoreList.length; i++){
            const prevX = grid[ignoreList[i]].x;
            const prevY = grid[ignoreList[i]].y;
            var color = getColor(circleColors);
            grid[ignoreList[i]] = new elem(prevX, prevY, 25, color);
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
        if(ignoreList.length >= 2 && grid.color != 'red'){
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
                     else if((grid[i].color != grid[ignoreList[ignoreList.length - 1]].color) && (ignoreList.length == 2 && grid[ignoreList[0]].color == 'blue' && grid[ignoreList[1]].color == 'red' && grid[ignoreList[ignoreList.length - 1]].color != 'blue')){
                        return;
                    }

                    if(ignoreList[ignoreList.length -1] + 6 != i &&
                        ignoreList[ignoreList.length -1] - 6 != i &&
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
                console.log(ignoreList)
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

