const c = document.getElementById("gameCanvas");
const ctx = c.getContext("2d");

ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

const SCALEW = 1903/941;

const ORIGWIDTH = 1903;
const ORIGHEIGHT = 941;
const SCREENWIDTH = window.innerWidth;
const SCREENHEIGHT = window.innerHeight;

const SCALEX = (SCREENWIDTH/ORIGWIDTH)
const SCALEY = (SCREENHEIGHT/ORIGHEIGHT);


const NITROGEN = new Image();
NITROGEN.src = "assets/nitrogen.svg";
const OXYGEN = new Image();
OXYGEN.src = "assets/oxygen.svg";
const CARBON = new Image();
CARBON.src = "assets/carbon.svg";

const GREENBAR = new Image();
GREENBAR.src = "assets/greenbar.png";
const BLUEBAR = new Image();
BLUEBAR.src = "assets/bluebar.png";
const REDBAR = new Image();
REDBAR.src = "assets/redbar.png";

const START_X = 325 * SCALEX;
const START_Y = 62 * SCALEY;
const SPACING_X = 112 * SCALEX;
const SPACING_Y = 104 * SCALEY;
let RADIUS = 113;
if(SCREENWIDTH <= 1500){
    RADIUS = 90;
}

const ROWS = 6;
const COLUMNS = 11;
const grid = [];

let blueScore = 0;
let redScore = 0;
let greenScore = 0;

let gameover = false;

var score = 0;
var timer = '00:45';
var time = 45;
var frame = 0;

var lineSession = [];
var ignoreList = [];
const circleColors = {
    'red': 20,
    'blue': 50,
    'green': 30,
};
var selected = null;
var mouseDown = false;

let mouseHoverRestart = false;

const movingElem = [];

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

class elem{
    constructor(x, y, radius, color, visable){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.visable = visable;
    }
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

    // ctx.drawImage(svg, x, y, RADIUS, RADIUS);
    ctx.drawImage(svg, x, y, RADIUS, RADIUS)
};

const DrawElementSize = (ctx, x, y, color, radius) => {
    var svg = '';
    if(color == 'red') svg = CARBON;
    else if(color == 'blue') svg = OXYGEN;
    else if (color == 'green') svg = NITROGEN;

    ctx.drawImage(svg, x, y, radius, radius);
};

const DrawText = (ctx, x, y, font, type, size, style, textAlign, text) => {
    ctx.font = `${type} ${size}px ${font}`;
    ctx.textAlign = textAlign;
    ctx.fillStyle = style;
    ctx.fillText(text, x, y, 140);
}

const DrawTips = (ctx) => {
    //Screen size mod
    let sizeModX = 0;
    let sizeModY = 0;
    let radius = 75;

    let lineToSpacingMod = 0;

    if(SCREENWIDTH < 1500) {
        sizeModX = -2;
        radius = 55;
        lineToSpacingMod = 9;
    }


    const blueOne = {x: 157.5 * SCALEX - sizeModX, y: 500 * SCALEY - sizeModY, color: 'blue', radius: radius};
    const blueTwo = {x: 232.5 * SCALEX - sizeModX, y: 500 * SCALEY - sizeModY, color: 'blue', radius: radius};

    ctx.beginPath();
    ctx.strokeStyle = '#bd8aff';
    ctx.moveTo(blueOne.x + 20 - lineToSpacingMod, blueOne.y + 30 - lineToSpacingMod);
    ctx.lineTo(blueTwo.x + 20 - lineToSpacingMod, blueTwo.y + 30 - lineToSpacingMod);
    ctx.moveTo(blueOne.x + 45 - lineToSpacingMod, blueOne.y + 45 - lineToSpacingMod);
    ctx.lineTo(blueTwo.x + 45 - lineToSpacingMod, blueTwo.y + 45 - lineToSpacingMod);
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();

    DrawElementSize(ctx, blueOne.x, blueOne.y, blueOne.color, blueOne.radius);
    DrawElementSize(ctx, blueTwo.x, blueTwo.y, blueTwo.color, blueTwo.radius);
    

    const greenOne = {x: 157.5 * SCALEX - sizeModX, y: 595 * SCALEY - sizeModY, color: 'green', radius: radius};
    const greenTwo = {x: 232.5 * SCALEX - sizeModX, y: 595 * SCALEY - sizeModY, color: 'green', radius: radius};

    ctx.beginPath();
    ctx.strokeStyle = '#bd8aff';
    ctx.moveTo(greenOne.x + 30 - lineToSpacingMod, greenOne.y + 25 - lineToSpacingMod);
    ctx.lineTo(greenTwo.x + 30 - lineToSpacingMod, greenTwo.y + 25 - lineToSpacingMod);
    ctx.moveTo(greenOne.x + 45 - lineToSpacingMod, greenOne.y + 37.5 - lineToSpacingMod);
    ctx.lineTo(greenTwo.x + 45 - lineToSpacingMod, greenTwo.y + 37.5 - lineToSpacingMod);
    ctx.moveTo(greenOne.x + 45 - lineToSpacingMod, greenOne.y + 50 - lineToSpacingMod);
    ctx.lineTo(greenTwo.x + 45 - lineToSpacingMod, greenTwo.y + 50 - lineToSpacingMod);
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();

    DrawElementSize(ctx, greenOne.x, greenOne.y, greenOne.color, greenOne.radius);
    DrawElementSize(ctx, greenTwo.x, greenTwo.y, greenTwo.color, greenTwo.radius);

    const redOne = {x: 115 * SCALEX - sizeModX, y: 690 * SCALEY - sizeModY, color: 'blue', radius: radius};
    const redTwo = {x: 190 * SCALEX - sizeModX, y: 690 * SCALEY - sizeModY, color: 'red', radius: radius};
    const redThree = {x: 265 * SCALEX - sizeModX, y: 690 * SCALEY - sizeModY, color: 'blue', radius: radius};

    ctx.beginPath();
    ctx.strokeStyle = '#bd8aff';
    ctx.moveTo(redOne.x + 20 - lineToSpacingMod, redOne.y + 30 - lineToSpacingMod);
    ctx.lineTo(redTwo.x + 20 - lineToSpacingMod, redTwo.y + 30 - lineToSpacingMod);
    ctx.moveTo(redOne.x + 45 - lineToSpacingMod, redOne.y + 45 - lineToSpacingMod);
    ctx.lineTo(redTwo.x + 45 - lineToSpacingMod, redTwo.y + 45 - lineToSpacingMod);

    ctx.moveTo(redTwo.x + 50 - lineToSpacingMod, redTwo.y + 30 - lineToSpacingMod);
    ctx.lineTo(redThree.x + 50 - lineToSpacingMod, redThree.y + 30 - lineToSpacingMod);
    ctx.moveTo(redTwo.x + 50 - lineToSpacingMod, redTwo.y + 45 - lineToSpacingMod);
    ctx.lineTo(redThree.x + 50 - lineToSpacingMod, redThree.y + 45 - lineToSpacingMod);
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();


    DrawElementSize(ctx, redOne.x, redOne.y, redOne.color, redOne.radius);
    DrawElementSize(ctx, redTwo.x, redTwo.y, redTwo.color, redTwo.radius);
    DrawElementSize(ctx, redThree.x, redThree.y, redThree.color, redThree.radius);
};

// function to draw rectangle

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
            const newEl = new elem(START_X + (SPACING_X * i), START_Y + (SPACING_Y * j), RADIUS, color, true);
            grid.push(newEl);
        }
    }   
};

class MovingElem {
    constructor(moveToY, elemNum, elem){
        this.moveToY = moveToY;
        this.elemNum = elemNum;
        this.elem = elem;
    }

    update = () => {
        if(this.elem.y < this.moveToY){
            this.elem.y += 15;
        } else if(this.elem.y >= this.moveToY){
            // make element at elemNum visable
            // delete this elem
            grid[this.elemNum].visable = true;
            this.elem.visable = false;

            for(var i = 0; i < movingElem.length; i++){
                if(movingElem[i] == this){
                    movingElem.splice(i, 1);
                }
            }
        }
    }
}


// updates the line movement
const Update = () => {
    frame++;
    if(frame == 60){
        frame = 0;
        time--;
    }

    if(time == 60){
        timer = '01:00';
    } else if(time < 60 && time >= 10){
        timer = `00:${time}`;
    } else if(time < 10 && time > 0){
        timer = `00:0${time}`;
    } else if (time <= 0){
        timer = `00:00`;
        gameover = true;
    }

    for(var i = 0; i < movingElem.length; i++){
        movingElem[i].update();
    }
};

// draw it

const Draw = () => {
    if(!gameover){
        ctx.clearRect(0,0,1920,1080);

        const img = new Image();
        img.src = "assets/bg.png";
        //(width = 1903, height = 941)
        ctx.drawImage(img,0,0,1903 * SCALEX,941 * SCALEY);

        
        ctx.font = `${'lighter'} ${35}px ${'Oxanium'}`;
        ctx.fillStyle = 'white';
        ctx.fillText("OPERATION: ", 80, 90, 500);
        ctx.font = `${'bold'} ${35}px ${'Oxanium'}`;
        ctx.fillStyle = 'white';
        ctx.fillText("AETHER", 295, 90, 500);


        const SCOREBOX_X = 232 * SCALEX;
        const SCOREBOX_Y = 235 * SCALEY;
        if(score == 0){
            DrawText(ctx, SCOREBOX_X, SCOREBOX_Y, 'Oxanium', 'normal', 40, 'white', "center", '000');
        } else {
            DrawText(ctx, SCOREBOX_X, SCOREBOX_Y, 'Oxanium', 'normal', 40, 'white', "center", score);
        }
        DrawText(ctx, 1625 * SCALEX, 95 * SCALEY, 'Oxanium', 'bold', 40, 'white', "start", timer);

        DrawTips(ctx);

        // Debug squares
        // for(var i = 0; i < grid.length; i++){
        //     // DrawOvalShape(ctx, grid[i].x, grid[i].y, RADIUS, grid[i].color);
        //     if(grid[i].visable){
        //         drawRect(ctx, grid[i].x, grid[i].y, RADIUS, RADIUS, grid[i].color);
        //     }
        // }

        Connect();
        for(var i = 0; i < grid.length; i++){
            // DrawOvalShape(ctx, grid[i].x, grid[i].y, RADIUS, grid[i].color);
            if(grid[i].visable){
                DrawElement(ctx, grid[i].x, grid[i].y , grid[i].color);
            }
        }
        for(var i = 0; i < movingElem.length; i++){
            if(movingElem[i].elem.visable){
                DrawElement(ctx, movingElem[i].elem.x, movingElem[i].elem.y, movingElem[i].elem.color);
            }
    }
        // From 0 -> 175 width score*(maxWidth/scale)
        const blueMax = 30;
        if(blueScore < blueMax){
            ctx.drawImage(BLUEBAR, 170 * SCALEX,336 * SCALEY, blueScore*(180/blueMax) * SCALEX, 9);
        } else {
            ctx.drawImage(BLUEBAR, 170 * SCALEX,336 * SCALEY, blueMax*(180/blueMax) * SCALEX, 9);
        }

        const greenMax = 30;
        if(greenScore < greenMax){
            ctx.drawImage(GREENBAR, 170 * SCALEX,375 * SCALEY, greenScore*(180/greenMax) * SCALEX, 10);
        } else {
            ctx.drawImage(GREENBAR, 170 * SCALEX,375 * SCALEY, greenMax*(180/greenMax) * SCALEX, 10);
        }

        const redMax = 10;
        if(redScore < redMax){
            ctx.drawImage(REDBAR, 170 * SCALEX,417 * SCALEY, redScore*(180/redMax) * SCALEX, 10);
        } else {
            ctx.drawImage(REDBAR, 170 * SCALEX,417 * SCALEY, redMax*(180/redMax) * SCALEX, 10);
        }
    }


    if(gameover){
        const bg = new Image();
        bg.src = "assets/gameover.png";
        ctx.drawImage(bg,0,0,1903 * SCALEX,941 * SCALEY);

        DrawText(ctx, 950 *SCALEX, 570 *SCALEY, 'Orbitron', 'normal', 25, 'white', "center", `Your score : ${score}`);

        const restartButton = new Image();
        restartButton.src = "assets/restartbutton.svg";
        if(mouseHoverRestart){
            ctx.globalAlpha = 0.5;
            ctx.drawImage(restartButton, 777 *SCALEX, 610*SCALEY, 350*SCALEX, 106*SCALEY, );
            ctx.globalAlpha = 1;
        } else {
            ctx.drawImage(restartButton, 777 *SCALEX, 610*SCALEY, 350*SCALEX, 106*SCALEY);
        }
    }
}

const Connect = () => {
    if(lineSession.length <= 1){
        return;
    }

    //success color: #bd8aff
    //regular color: #7283A3
    const SUCCESSCOLOR = '#bd8aff';
    const REGULARCOLOR = '#7283A3';
    let color = REGULARCOLOR;

    if(lineSession.length == 2 && !(lineSession[0].color == 'blue' && lineSession[1].color == 'red')){
        color = SUCCESSCOLOR;
    } else if(lineSession.length == 3){
        color = SUCCESSCOLOR;
    }

    if(lineSession[0].color == 'green'){
        for (i = 1; i < grid.length; i++){
            const previous = lineSession[i - 1];
            const current = lineSession[i];
            drawTripleLine(previous, current, color);
        }
    } else{
        for (i = 1; i < grid.length; i++){
            const previous = lineSession[i - 1];
            const current = lineSession[i];
            drawLine(previous, current, color);
        }
    }
}


function drawLine (previous, element, color) {
    if(!element || !previous) return;

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(previous.x + RADIUS/2 - 10, previous.y + RADIUS/2 - 10);
    ctx.lineTo(element.x + RADIUS/2 - 10, element.y + RADIUS/2 - 10);
    ctx.moveTo(previous.x + RADIUS/2 + 10, previous.y + RADIUS/2 + 10);
    ctx.lineTo(element.x + RADIUS/2 + 10, element.y + RADIUS/2 + 10);
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.closePath();
}

const drawTripleLine = (previous, element, color) => {
    if(!element || !previous) return;

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(previous.x + RADIUS/2 - 20, previous.y + RADIUS/2 - 20);
    ctx.lineTo(element.x + RADIUS/2 - 20, element.y + RADIUS/2 - 20);
    ctx.moveTo(previous.x + RADIUS/2 + 20, previous.y + RADIUS/2 + 20);
    ctx.lineTo(element.x + RADIUS/2 + 20, element.y + RADIUS/2 + 20);
    ctx.moveTo(previous.x + RADIUS/2, previous.y + RADIUS/2);
    ctx.lineTo(element.x + RADIUS/2, element.y + RADIUS/2);
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.closePath();
}

const DropRow = () => {
    for(let i = 0; i < ignoreList.length; i++){
        let z = ignoreList[i];
        let startingZ = z;

        if(startingZ%ROWS != 0){
            for(z; z%ROWS != 0; z--){
                if(z < startingZ){
                    movingElem.push(new MovingElem(grid[z].y + SPACING_Y, z+1, new elem(grid[z].x, grid[z].y, grid[z].radius, grid[z].color, true)));
                    grid[z+1] = grid[z]; 
                    grid[z+1].y += SPACING_Y;
                    grid[z+1].visable = false;
                }
            }
    
            movingElem.push(new MovingElem(grid[z].y + SPACING_Y, z+1, new elem(grid[z].x, grid[z].y, grid[z].radius, grid[z].color, true)));
            grid[z+1] = grid[z]; 
            grid[z+1].y += SPACING_Y;
            grid[z+1].visable = false;
        }

        grid[z] = new elem(grid[z].x, START_Y, RADIUS, getColor(circleColors), true);
        movingElem.push(new MovingElem( grid[z].y + SPACING_Y, z, new elem(grid[z].x, grid[z].y, grid[z].radius, grid[z].color, true)));
        grid[z].y += SPACING_Y;
        grid[z].visable = false;
    }
}

const CheckScore = () => {
    if(ignoreList.length == 3 || (ignoreList.length === 2 && grid[ignoreList[ignoreList.length - 1]].color === 'blue') ||(ignoreList.length === 2 && grid[ignoreList[ignoreList.length - 1]].color === 'green')
    ){
        if(ignoreList.length == 2){
            if(ignoreList[0] + 1 == ignoreList[1] || ignoreList[0] - 1 == ignoreList[1]){ 
                // Two in the same lane
                // z is what we selected
                let z = ignoreList[0];
                // if z is later in the list of elements, swap because we want the top to be the first.
                if(z > ignoreList[1]) z = ignoreList[1];

                const startingZ = z;

                // Prevent bug where picking 2 from bottom, move out of bounds
                if((z+2)%ROWS == 1 || (z+2)%ROWS == 0){
                    z--;
                }

                if(startingZ%ROWS != 0){
                    for(z; z%ROWS != 0; z--){
                        if(z < startingZ){
                            movingElem.push(new MovingElem(grid[z].y + SPACING_Y*2, z+2, new elem(grid[z].x, grid[z].y, grid[z].radius, grid[z].color, true)));
                            grid[z+2] = grid[z]; 
                            grid[z+2].y += SPACING_Y*2;
                            grid[z+2].visable = false;
                        }
                    }
                    movingElem.push(new MovingElem(grid[z].y + SPACING_Y*2, z+2, new elem(grid[z].x, grid[z].y, grid[z].radius, grid[z].color, true)));
                    grid[z+2] = grid[z]; 
                    grid[z+2].y += SPACING_Y*2;
                    grid[z+2].visable = false;
                }

                grid[z] = new elem(grid[z].x, START_Y, RADIUS, getColor(circleColors), true);
                movingElem.push(new MovingElem( grid[z].y + SPACING_Y, z, new elem(grid[z].x, grid[z].y, grid[z].radius, grid[z].color, true)));
                grid[z].y += SPACING_Y;
                grid[z].visable = false;

                grid[z+1] = new elem(grid[z+1].x, START_Y, RADIUS, getColor(circleColors), true);
                movingElem.push(new MovingElem(grid[z+1].y + (SPACING_Y*2), z+1 ,new elem(grid[z+1].x, grid[z+1].y, grid[z+1].radius, grid[z+1].color, true)));
                grid[z+1].y += SPACING_Y*2;
                grid[z+1].visable = false;

            } else { 
                // Two in different lanes
                DropRow();
            }

            score += 100;
            if(lineSession[0].color == 'blue'){
                blueScore += 2;
            } else {
                greenScore += 2;
            }
        } else if(ignoreList.length == 3){
            // case for 3 vertical
            // case for 3 horizontal
            // case for 3 L-shaped

            if(ignoreList[0] + 1 == ignoreList[1] && ignoreList[1] + 1 == ignoreList[2] || ignoreList[0] - 1 == ignoreList[1] && ignoreList[1] - 1 == ignoreList[2]){
                // case for 3 vertical

                // z is what we selected
                let z = ignoreList[0];
                // if z is later in the list of elements, swap because we want the top to be the first.
                if(z > ignoreList[1]) z = ignoreList[1];
                if(z > ignoreList[2]) z = ignoreList[2];

                const startingZ = z;

                // Prevent bug where picking 2 from bottom, move out of bounds
                if((z+3)%ROWS == 1 || (z+3)%ROWS == 0){
                    z--;
                }

                if(startingZ%ROWS != 0){
                    for(z; z%ROWS != 0; z--){
                        if(z < startingZ){
                            movingElem.push(new MovingElem(grid[z].y + SPACING_Y*3, z+3, new elem(grid[z].x, grid[z].y, grid[z].radius, grid[z].color, true)));
                            grid[z+3] = grid[z]; 
                            grid[z+3].y += SPACING_Y*3;
                            grid[z+3].visable = false;
                        }
                    }
                    movingElem.push(new MovingElem(grid[z].y + SPACING_Y*3, z+3, new elem(grid[z].x, grid[z].y, grid[z].radius, grid[z].color, true)));
                    grid[z+3] = grid[z]; 
                    grid[z+3].y += SPACING_Y*3;
                    grid[z+3].visable = false;
                }

                grid[z] = new elem(grid[z].x, START_Y, RADIUS, getColor(circleColors), true);
                movingElem.push(new MovingElem( grid[z].y + SPACING_Y, z, new elem(grid[z].x, grid[z].y, grid[z].radius, grid[z].color, true)));
                grid[z].y += SPACING_Y;
                grid[z].visable = false;

                grid[z+1] = new elem(grid[z+1].x, START_Y, RADIUS, getColor(circleColors), true);
                movingElem.push(new MovingElem(grid[z+1].y + (SPACING_Y*2), z+1 ,new elem(grid[z+1].x, grid[z+1].y, grid[z+1].radius, grid[z+1].color, true)));
                grid[z+1].y += SPACING_Y*2;
                grid[z+1].visable = false;

                grid[z+2] = new elem(grid[z+2].x, START_Y, RADIUS, getColor(circleColors), true);
                movingElem.push(new MovingElem(grid[z+2].y + (SPACING_Y*3), z+2 ,new elem(grid[z+2].x, grid[z+2].y, grid[z+2].radius, grid[z+2].color, true)));
                grid[z+2].y += SPACING_Y*3;
                grid[z+2].visable = false;
            } else if (ignoreList[0] + ROWS == ignoreList[1] && ignoreList[1] + ROWS == ignoreList[2] || ignoreList[0] - ROWS == ignoreList[1] && ignoreList[1] - ROWS == ignoreList[2]) {
                // case for 3 horizontal
                DropRow();
                
            } else {
                // case for 3 L-shaped
                // Identify Duo, will be stacked on top of each other in same column
                // Identify Loner, will be alone in their column
                // If 1st pick and 2nd pick is +-1 of each other, they're in same column, else 2nd and 3rd pick are same column
                let duo = [];
                let single = 0;

                if(ignoreList[1] + 1 == ignoreList[0] || ignoreList[1] - 1 == ignoreList[0]){
                    duo.push(ignoreList[0]);
                    duo.push(ignoreList[1]);
                    single = ignoreList[2];
                } else {
                    duo.push(ignoreList[2]);
                    duo.push(ignoreList[1]);
                    single = ignoreList[0];
                }

                // apply drop logic to duo

                // z is what we selected
                let z = duo[0];
                // if z is later in the list of elements, swap because we want the top to be the first.
                if(z > duo[1]) z = duo[1];

                let startingZ = z;

                // Prevent bug where picking 2 from bottom, move out of bounds
                if((z+2)%ROWS == 1 || (z+2)%ROWS == 0){
                    z--;
                }

                if(startingZ%ROWS != 0){
                    for(z; z%ROWS != 0; z--){
                        if(z < startingZ){
                            movingElem.push(new MovingElem(grid[z].y + SPACING_Y*2, z+2, new elem(grid[z].x, grid[z].y, grid[z].radius, grid[z].color, true)));
                            grid[z+2] = grid[z]; 
                            grid[z+2].y += SPACING_Y*2;
                            grid[z+2].visable = false;
                        }
                    }
                    movingElem.push(new MovingElem(grid[z].y + SPACING_Y*2, z+2, new elem(grid[z].x, grid[z].y, grid[z].radius, grid[z].color, true)));
                    grid[z+2] = grid[z]; 
                    grid[z+2].y += SPACING_Y*2;
                    grid[z+2].visable = false;
                }

                grid[z] = new elem(grid[z].x, START_Y, RADIUS, getColor(circleColors), true);
                movingElem.push(new MovingElem( grid[z].y + SPACING_Y, z, new elem(grid[z].x, grid[z].y, grid[z].radius, grid[z].color, true)));
                grid[z].y += SPACING_Y;
                grid[z].visable = false;

                grid[z+1] = new elem(grid[z+1].x, START_Y, RADIUS, getColor(circleColors), true);
                movingElem.push(new MovingElem(grid[z+1].y + (SPACING_Y*2), z+1 ,new elem(grid[z+1].x, grid[z+1].y, grid[z+1].radius, grid[z+1].color, true)));
                grid[z+1].y += SPACING_Y*2;
                grid[z+1].visable = false;

                // apply drop logic to loner
                z = single;
                startingZ = z;

                if(startingZ%ROWS != 0){
                    for(z; z%ROWS != 0; z--){
                        if(z < startingZ){
                            movingElem.push(new MovingElem(grid[z].y + SPACING_Y, z+1, new elem(grid[z].x, grid[z].y, grid[z].radius, grid[z].color, true)));
                            grid[z+1] = grid[z]; 
                            grid[z+1].y += SPACING_Y;
                            grid[z+1].visable = false;
                        }
                    }
            
                    movingElem.push(new MovingElem(grid[z].y + SPACING_Y, z+1, new elem(grid[z].x, grid[z].y, grid[z].radius, grid[z].color, true)));
                    grid[z+1] = grid[z]; 
                    grid[z+1].y += SPACING_Y;
                    grid[z+1].visable = false;
                }
        
                grid[z] = new elem(grid[z].x, START_Y, RADIUS, getColor(circleColors), true);
                movingElem.push(new MovingElem( grid[z].y + SPACING_Y, z, new elem(grid[z].x, grid[z].y, grid[z].radius, grid[z].color, true)));
                grid[z].y += SPACING_Y;
                grid[z].visable = false;
            }
            score += 150;
            blueScore += 2;
            redScore++;
        }

    }
};

window.addEventListener("keypress", (e) => {

});

c.addEventListener('mousedown', function (e){
    mouseDown = true;
    Connect(e);
});

const Restart = () => {
    gameover = false;
    score = 0;
    time = 45;
    blueScore = 0;
    redScore = 0;
    greenScore = 0;
    timer = '00:45';
    frame = 0;
};

c.addEventListener('mouseup', function (e){ 
    if(gameover){
    const mouse = {x: e.clientX, y: e.clientY};
    const box = {x:777 *SCALEX, y:610*SCALEY, width:350*SCALEX, height:106*SCALEY};
        if(MouseInBox(box, mouse)){
            Restart();
        }
    } else {
        CheckScore();
    }

    mouseDown = false;
    lineSession = [];
    ignoreList = [];
});

const MouseInCircle = (circle, mouse) => {
    return Math.sqrt((circle.x - mouse.x)*(circle.x - mouse.x) + (circle.y - mouse.y) * (circle.y - mouse.y)) < circle.radius;
};

const MouseInBox = (box, mouse) => {
    return (box.x <= mouse.x && box.x + box.width >= mouse.x && box.y <= mouse.y && box.y + box.height >= mouse.y);
}


c.addEventListener('mousemove', function (e){
    const mouse = {x: e.clientX, y: e.clientY};
    const box = {x:777 *SCALEX, y:610*SCALEY, width:350*SCALEX, height:106*SCALEY};
    if(gameover){
        if(MouseInBox(box, mouse)){
            mouseHoverRestart = true;
        } else {
            mouseHoverRestart = false;
        }
    }

    if(mouseDown){
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

