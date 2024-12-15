const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = { x: 15, y: 15 };
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;

document.getElementById('highScore').innerText = highScore;

let touchStartX = 0;
let touchStartY = 0;

function gameLoop() {
    update();
    draw();
    setTimeout(gameLoop, 100);
}

function update() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById('score').innerText = score;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
            document.getElementById('highScore').innerText = highScore;
        }
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount),
        };
    } else {
        snake.pop();
    }

    snake.unshift(head);

    if (
        head.x < 0 ||
        head.x >= tileCount ||
        head.y < 0 ||
        head.y >= tileCount ||
        snakeCollision(head)
    ) {
        resetGame();
    }
}

function draw() {
    ctx.fillStyle = getCSSVariable('--background-color');
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = getCSSVariable('--snake-color');
    ctx.strokeStyle = getCSSVariable('--snake-border-color');
    snake.forEach((segment) => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        ctx.strokeRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });

    ctx.fillStyle = getCSSVariable('--food-color');
    ctx.beginPath();
    ctx.arc(
        food.x * gridSize + gridSize / 2,
        food.y * gridSize + gridSize / 2,
        gridSize / 2,
        0,
        2 * Math.PI
    );
    ctx.fill();
}

function snakeCollision(head) {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            return true;
        }
    }
    return false;
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    score = 0;
    document.getElementById('score').innerText = score;
}

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
    }
});

canvas.addEventListener('touchstart', (event) => {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
});

canvas.addEventListener('touchend', (event) => {
    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;

    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0 && direction.x === 0) {
            direction = { x: 1, y: 0 }; // Swipe right
        } else if (diffX < 0 && direction.x === 0) {
            direction = { x: -1, y: 0 }; // Swipe left
        }
    } else {
        if (diffY > 0 && direction.y === 0) {
            direction = { x: 0, y: 1 }; // Swipe down
        } else if (diffY < 0 && direction.y === 0) {
            direction = { x: 0, y: -1 }; // Swipe up
        }
    }
});

document.getElementById('resetScore').addEventListener('click', () => {
    localStorage.setItem('highScore', 0);
    highScore = 0;
    document.getElementById('highScore').innerText = highScore;
});

function getCSSVariable(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

gameLoop();
