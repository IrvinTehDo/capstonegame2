const c = document.getElementById("gameCanvas");
const ctx = c.getContext("2d");
const CENTER_X = 100;
const CENTER_Y = 100;
const elements = [];
const circleColors = ['red', 'green', 'blue', 'cyan']
var selected = null;

// function to get circle x,y, and radius
function elem(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
}

// function for clicking

function isClicked (c1, c2) {
    var a = c1.r + c2.r,
        x = c1.x - c2.x,
        y = c1.y - c2.y;

    if ( a > Math.sqrt( (x*x) + (y*y) ) ) return true;
    else return false;
}

// function to draw circles
const drawOvalShape = (ctx, center_x, center_y, radius, color) =>{
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


// updates the line movement
const Update = () => {
    
};

// draw it

const Draw = () => {
    ctx.clearRect(0,0,1000,1000);
    
    for(i = 1; i < 10; i++){  // 9 circles columns
        for(j = 1; j < 7; j++){ // 7 rows
            var cColor = circleColors[Math.floor(Math.random() * circleColors.length)];
            drawOvalShape(ctx, CENTER_X * i, CENTER_Y * j, 25, cColor);
            newel = new elem(CENTER_X * i, CENTER_Y * j, 25)
            elements.push(newel);
        }
    }
    console.log(elements);  

    c.addEventListener('mousedown', function (e){
        connect(e);
    })
}

// function to connect line
function connect (e) {
    var i = 0, col = null;
    for (i = 0; i < elements.length; i++) {
        var element = elements[i],
            c1 = {x: element.x, y: element.y, r: 25},
            c2 = {x: e.clientX, y: e.clientY, r: 25};
        if (isClicked(c1, c2)) col = element;
    }

    if (col !== null) {
        if(selected !== null) drawLine(col);
        selected = col;
    }
    else selected = null;
}


function drawLine (element) {
    ctx.beginPath();
    ctx.moveTo(selected.x, selected.y);
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

Draw();

// Draw at 60fps
// setInterval(() => {
// //    Update();
//     
    
// });

