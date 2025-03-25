const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

let dvd = {
    posX: 100,
    posY: 150,
    moveX: 2,
    moveY: 2,
    color: getRandomColor(),
    radiusX: 50,
    radiusY: 30
};

function moveDvd() {
    dvd.posX += dvd.moveX;
    dvd.posY += dvd.moveY;

    if (dvd.posX + dvd.radiusX > canvas.width || dvd.posX - dvd.radiusX < 0) {
        dvd.moveX *= -1;
        dvd.color = getRandomColor();
    }

    if (dvd.posY + dvd.radiusY > canvas.height || dvd.posY - dvd.radiusY < 0) {
        dvd.moveY *= -1;
        dvd.color = getRandomColor();
    }
}

function adjustViewPort(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function drawDvd() {
    adjustViewPort();

    const startAngle = 0;
    const endAngle = 2 * Math.PI;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.ellipse(dvd.posX, dvd.posY, dvd.radiusX, dvd.radiusY, 0, startAngle, endAngle);
    ctx.fillStyle = dvd.color;
    ctx.fill();

    ctx.font = '30px Arial bold italic';
    ctx.fillStyle = 'black';
    ctx.fillText('DVD', dvd.posX - 32, dvd.posY + 10);

    moveDvd();

    console.log('Iteration');
    console.log(dvd);
}

setInterval(drawDvd, 1000 / 60);