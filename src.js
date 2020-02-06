const c = document.getElementById("gameCanvas");
const ctx = c.getContext("2d");

const player = {

};

const drawOvalShape = (ctx, center_x, center_y, radius, color) =>{
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.ellipse(center_x, center_y, radius, radius,  90 * Math.PI/180, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();
};

const drawRect = (ctx, x, y, width, height, color) => {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
    ctx.closePath();
};


// updates the line movement
const Update = () => {
    
};

const Draw = () => {

};


const CheckScore = () => {
    
};

window.addEventListener("keypress", (e) => {

});

// Draw at 60fps
setInterval(() => {
   Update();
    Draw();
}, 1000/60);
