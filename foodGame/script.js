let player = document.getElementById("player");
let gameContainer = document.querySelector('.game-container');
let scoreDisplay = document.getElementById("score");
let missesDisplay = document.getElementById("misses");
let gameOverText = document.getElementById("game-over");
let restartBtn = document.getElementById("restart-btn");

let gameWidth = gameContainer.offsetWidth;
let gameHeight = gameContainer.offsetHeight;

let score = 0;
let misses = 0;
let playerSpeed = 20;
let foodFallSpeed = 4;
let maxFoodItems = 1;
let gameInterval;
let isGameOver = false;

const foodColors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];

// Move player using arrow keys or mouse
document.addEventListener("keydown", function (e) {
    if (!isGameOver) {
        let playerPos = player.offsetLeft;
        if (e.key === "ArrowLeft" && playerPos > 0) {
            player.style.left = playerPos - playerSpeed + "px";
        } else if (e.key === "ArrowRight" && playerPos + player.offsetWidth < gameWidth) {
            player.style.left = playerPos + playerSpeed + "px";
        }
    }
});

// Mouse movement for player
gameContainer.addEventListener('mousemove', function (e) {
    if (!isGameOver) {
        let gameContainerRect = this.getBoundingClientRect();
        let mouseX = e.clientX - gameContainerRect.left;
        let playerWidth = player.offsetWidth;
        let newPlayerPos = Math.min(Math.max(mouseX - playerWidth / 2, 0), gameWidth - playerWidth);
        player.style.left = newPlayerPos + "px";
    }
});

// Staggered drop for multiple food items
function dropFood() {
    for (let i = 0; i < maxFoodItems; i++) {
        setTimeout(() => {
            if (!isGameOver) {
                let food = createFood();
                gameContainer.appendChild(food);
                animateFoodDrop(food);
            }
        }, i * 1000); // Stagger the drop times by 1 second per food item
    }
}

// Create food element with random color
function createFood() {
    let food = document.createElement('div');
    food.classList.add('food');
    let randomX = Math.floor(Math.random() * (gameWidth - 30)); // Random X position
    let randomColor = foodColors[Math.floor(Math.random() * foodColors.length)]; // Random color
    food.style.left = randomX + "px";
    food.style.top = "-50px";
    food.style.backgroundColor = randomColor; // Assign random color
    return food;
}

// Animate food drop with collision detection
function animateFoodDrop(food) {
    let foodDropInterval = setInterval(function () {
        if (isGameOver) {
            clearInterval(foodDropInterval); // Stop animation if the game is over
            return;
        }
        
        let foodPos = food.offsetTop;
        if (foodPos + food.offsetHeight < gameHeight) {
            food.style.top = foodPos + foodFallSpeed + "px";

            // Check if the player catches the food
            if (checkCatch(food)) {
                clearInterval(foodDropInterval);
                gameContainer.removeChild(food);
                score++;
                scoreDisplay.textContent = "Score: " + score;
                increaseDifficulty();
            }
        } else {
            // If the food reaches the bottom, it's missed
            clearInterval(foodDropInterval);
            gameContainer.removeChild(food);
            misses++;
            missesDisplay.textContent = "Misses: " + misses;
            if (misses >= 5) {
                gameOver();
            }
        }
    }, 20);
}

// Check if food is caught by player
function checkCatch(food) {
    let playerPos = player.getBoundingClientRect();
    let foodPos = food.getBoundingClientRect();

    return (foodPos.bottom >= playerPos.top &&
            foodPos.left < playerPos.right &&
            foodPos.right > playerPos.left);
}

// Increase difficulty: faster drops and more food
function increaseDifficulty() {
    // Increase food falling speed every 5 points
    if (score % 5 === 0 && foodFallSpeed < 15) {
        foodFallSpeed++;
    }
    // Increase the number of food items falling every 10 points
    if (score % 10 === 0 && maxFoodItems < 5) {
        maxFoodItems++;
    }
}

// Game over function
function gameOver() {
    isGameOver = true;
    gameOverText.classList.remove("hidden");
    restartBtn.classList.remove("hidden");
}

// Restart the game
function restartGame() {
    score = 0;
    misses = 0;
    scoreDisplay.textContent = "Score: 0";
    missesDisplay.textContent = "Misses: 0";
    gameOverText.classList.add("hidden");
    restartBtn.classList.add("hidden");
    isGameOver = false;
    foodFallSpeed = 4;
    maxFoodItems = 1;
    startGame();
}

// Event listener for restart button
restartBtn.addEventListener("click", restartGame);

// Start the game
function startGame() {
    if (!isGameOver) {
        setInterval(dropFood, 3000); // Drop food every 3 seconds
    }
}

startGame();
