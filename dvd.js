
const colors = [
    "#FFDDC1", // Light Peach
    "#FFECB3", // Light Yellow
    "#81C784", // Medium Green
    "#64B5F6", // Medium Blue
    "#9575CD", // Medium Purple
    "#F06292", // Medium Pink
    "#E1F5FE", // Light Sky Blue
    "#FFF9C4"  // Light Lemon
  ];

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function getRandomColor(lastColorIndex) {
    let colorIndex = Math.floor(Math.random() * colors.length);

    while (colorIndex === lastColorIndex) {
        colorIndex = Math.floor(Math.random() * colors.length);
    }

    return {
        color: colors[colorIndex],
        index: colorIndex,
    };
}

let gameContext = {};
let mouseHighlightCircle = {};
let dvd = {};

function resetDvd(){
    dvd = {
        posX: 100,
        posY: 150,
        moveX: 2,
        moveY: 2,
        color: getRandomColor(-1).color,
        radiusX: 100,
        radiusY: 60,
        lastColorIndex: -1,
        isHeldByUser: false,
        positionHistory: [{x: 100, y: 150}, {x: 100, y: 150}],
    };
}

function resetContext(){
    gameContext = {
        isInitialState: true,
    }
}

function resetMouseHighlightCircle(){
    mouseHighlightCircle = {
        posX: 0,
        posY: 0,
        radius: 30,
    };
}

function reset(){
    resetDvd();
    resetContext();
    resetMouseHighlightCircle();
}

function rectifyDvdPositionWithinScreenBounds(){
    if (dvd.posX - dvd.radiusX < 0){
        dvd.posX = dvd.radiusX;
    }
    if (dvd.posX + dvd.radiusX > canvas.width){
        dvd.posX = canvas.width - dvd.radiusX;
    }
    if (dvd.posY - dvd.radiusY < 0){
        dvd.posY = dvd.radiusY;
    }
    if (dvd.posY + dvd.radiusY > canvas.height){
        dvd.posY = canvas.height - dvd.radiusY;
    }
}

function moveDvd() {
    if (dvd.isHeldByUser){
        return
    }

    dvd.posX += dvd.moveX;
    dvd.posY += dvd.moveY;

    if (dvd.posX + dvd.radiusX > canvas.width || dvd.posX - dvd.radiusX < 0) {
        dvd.moveX *= -1;
        let randomColor = getRandomColor(dvd.lastColorIndex);
        dvd.color = randomColor.color;
        dvd.lastColorIndex = randomColor.index;
    }

    if (dvd.posY + dvd.radiusY > canvas.height || dvd.posY - dvd.radiusY < 0) {
        dvd.moveY *= -1;
        let randomColor = getRandomColor(dvd.lastColorIndex);
        dvd.color = randomColor.color;
        dvd.lastColorIndex = randomColor.index;
    }

    rectifyDvdPositionWithinScreenBounds();
}

function adjustViewPort(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function drawDvd() {
    moveDvd();

    const startAngle = 0;
    const endAngle = 2 * Math.PI;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.ellipse(dvd.posX, dvd.posY, dvd.radiusX, dvd.radiusY, 0, startAngle, endAngle);
    ctx.fillStyle = dvd.color;
    ctx.fill();

    ctx.font = 'italic 900 60px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText('DVD', dvd.posX, dvd.posY + 18);
}

function areCoordinatesInDvd(x, y){
    return x >= dvd.posX - dvd.radiusX && x <= dvd.posX + dvd.radiusX && y >= dvd.posY - dvd.radiusY && y <= dvd.posY + dvd.radiusY;
}

function handleMouseDown(x, y){
    if (dvd.isHeldByUser){
        return;
    }
    
    if (areCoordinatesInDvd(x, y)){
        dvd.isHeldByUser = true;
    }
}

function handleMouseUp(x, y){
    if (!dvd.isHeldByUser){
        return;
    }
    const speedScalingFactor = 0.5;
    dvd.isHeldByUser = false;
    gameContext.isInitialState = false;

    let xMove = dvd.positionHistory[1].x - dvd.positionHistory[0].x;
    let yMove = dvd.positionHistory[1].y - dvd.positionHistory[0].y;
    dvd.moveX = xMove * speedScalingFactor;
    dvd.moveY = yMove * speedScalingFactor;
}

function handleMouseMove(x, y){

    mouseHighlightCircle.posX = x;
    mouseHighlightCircle.posY = y;

    if (!dvd.isHeldByUser){
        return;
    }

    if (x > dvd.radiusX && x < canvas.width - dvd.radiusX){
        dvd.posX = x;
    }

    if (y > dvd.radiusY && y < canvas.height - dvd.radiusY){
        dvd.posY = y;
    }

    dvd.positionHistory[0] = dvd.positionHistory[1];
    dvd.positionHistory[1] = {x: dvd.posX, y: dvd.posY};
}

function attachHandlers(){
    document.addEventListener("keydown", (event) => {
        if (gameContext.isInitialState){
            return;
        }

        if (event.key === " ") {
            reset();
        }
    });

    // Handle mouse clicks
    canvas.addEventListener("mousemove", (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        handleMouseMove(x, y);
    });

    canvas.addEventListener("mousedown", (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        handleMouseDown(x, y);
    });

    canvas.addEventListener("mouseup", (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        handleMouseUp(x, y);
    });

    // Handle touch events (for mobile)
    canvas.addEventListener("touchstart", (event) => {
        event.preventDefault(); // Prevent scrolling while touching the canvas

        const rect = canvas.getBoundingClientRect();
        const touch = event.touches[0]; // First touch point
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        handleMouseDown(x, y);
    });

    canvas.addEventListener("touchend", (event) => {
        event.preventDefault(); // Prevent scrolling while touching the canvas

        const rect = canvas.getBoundingClientRect();
        const touch = event.touches[0]; // First touch point
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        handleMouseUp(x, y);
    });

    canvas.addEventListener("touchmove", (event) => {
        event.preventDefault(); // Prevent scrolling
    
        const rect = canvas.getBoundingClientRect();
        const touch = event.touches[0]; // First touch point
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
    
        handleMouseMove(x, y);
    });

}

function drawHighlightCircle(){
    // Create a radial gradient
    const gradient = ctx.createRadialGradient(
        mouseHighlightCircle.posX,
        mouseHighlightCircle.posY, 
        0, 
        mouseHighlightCircle.posX,
        mouseHighlightCircle.posY,
        mouseHighlightCircle.radius);
    
    // Define color stops: gray at the center, transparent at the edge
    gradient.addColorStop(0, "#333333FF");
    gradient.addColorStop(1, "#33333300");

    // Draw the circle with the gradient
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(mouseHighlightCircle.posX, mouseHighlightCircle.posY, mouseHighlightCircle.radius, 0, 2 * Math.PI);
    ctx.fill();
}

function drawText(){
    if (!gameContext.isInitialState){
        ctx.fillStyle = 'white';
        ctx.font = '2vw monospace';
        ctx.textAlign = 'center';
        ctx.fillText('press space to reset', canvas.width / 2, canvas.height - 50);
    }
}

function draw(){
    adjustViewPort();
    drawDvd();
    drawHighlightCircle();
    drawText();
}

reset();
attachHandlers();
setInterval(draw, 1000 / 60);