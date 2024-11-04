// Initialize game variables
// Position of the rock obstacle
let rockPosition = 0;
// Position of the grass background
let grassPosition = 0;
// Distance traveled by the player
let distance = 0;
// Flag to check if the dino is jumping
let isJumping = false;
// Flag to check if the game has started
let gameStarted = false;
// Flag to check if a collision has happened
let collisionOccurred = false;
// Reference to the dino element
let dino = document.getElementById("game-dino");
// Get logged in username from session storage
let currentUsername = sessionStorage.getItem("loggedInUsername");
// Function to update user's distance in localStorage
function updateDistanceInStorage() {
    if (!currentUsername) return;
    // Get user data from localStorage
    let user = JSON.parse(localStorage.getItem(currentUsername));
    // Update distance if the new distance is greater
    if (user && user.distance <= distance) {
        user.distance = distance;
        // Save updated user data
        localStorage.setItem(currentUsername, JSON.stringify(user));
    }
}
// Function to start the game countdown and game start process
function gameStart() {
    if (gameStarted) return;
    gameStarted = true;
    collisionOccurred = false;
    let countdownElement = document.getElementById("countdown");
    let countdownOverlay = document.getElementById("countdownOverlay");
    // Initial countdown value
    let countdownValue = 3;
    // Display countdown
    countdownElement.innerText = `Game starts in ${countdownValue}`;
    // Countdown interval function
    let countdownInterval = setInterval(function() {
        countdownValue -= 1;
        if (countdownValue > 0) {
            countdownElement.innerText = `Game starts in ${countdownValue}`;
        } else {
            countdownElement.innerText = "Go!";
            clearInterval(countdownInterval);
            setTimeout(function() {
                countdownOverlay.style.display = "none";
                startGame();
            }, 1000);
        }
    }, 1000);
}
// Function to initialize game elements and intervals
function startGame() {
    // Move rock every 100 ms
    rockInterval = setInterval(moveRock, 100);
    // Start moving grass after 3 seconds
    setTimeout(function() {
        // Move grass every 100 ms
        grassInterval = setInterval(moveGrass, 100);
    }, 3000);
    // Increment distance every 100 ms
    distanceInterval = setInterval(incrementDistance, 100);
    // Function to move the rock
    function moveRock() {
        // Stop moving if a collision has occurred
        if (collisionOccurred) return;
        rockPosition += 40;
        if (rockPosition > 2000) 
            rockPosition = 0;
        // Update rock position on screen
        document.getElementById("rock").style.right = rockPosition + "px";
        // Check for collisions
        checkCollision();
    }
    // Function to move the grass
    function moveGrass() {
        // Stop moving if a collision has occurred
        if (collisionOccurred) return;
        grassPosition += 40;
        if (grassPosition > 2000) 
            grassPosition = 0;
        // Update grass position on screen
        document.getElementById("grass").style.right = grassPosition + "px";
        checkCollision();
    }
    // Function to make the dino jump
    function jump() {
        // Check if dino is not already jumping
        if (!isJumping) {
            isJumping = true;
            // Move dino up
            dino.style.bottom = '310px';
            setTimeout(function() {
                // Move dino back down
                dino.style.bottom = '115px';
                isJumping = false;
            }, 1000);
        }
    }
    // Listen for space key press to jump
    document.addEventListener("keydown", function(event) {
        if (event.code === "Space") {
            // Trigger jump function
            jump();
        }
    });
    // Function to increment distance traveled
    function incrementDistance() {
        if (collisionOccurred) return;
        distance += 1;
        // Update distance display
        document.getElementById("distance").innerText = "Distance: " + distance;
        // Update distance in storage
        updateDistanceInStorage();
    }
    // Function to check for collisions with obstacles
    function checkCollision() {
        if (collisionOccurred) return;
        // Get the bounding rectangle for the images
        let dinoRect = dino.getBoundingClientRect();
        let rockRect = document.getElementById("rock").getBoundingClientRect();
        let grassRect = document.getElementById("grass").getBoundingClientRect();
        // Check for collision with rock
        if (
            dinoRect.x < rockRect.x + rockRect.width &&
            dinoRect.x + dinoRect.width > rockRect.x &&
            dinoRect.y < rockRect.y + rockRect.height &&
            dinoRect.y + dinoRect.height > rockRect.y
        ) {
            collisionOccurred = true;
            alert("Collision with rock detected!");
            // Reset the game
            resetGame();
        }
        // Check for collision with grass
        if (
            dinoRect.x < grassRect.x + grassRect.width &&
            dinoRect.x + dinoRect.width > grassRect.x &&
            dinoRect.y < grassRect.y + grassRect.height &&
            dinoRect.y + dinoRect.height > grassRect.y
        ) {
            collisionOccurred = true;
            alert("Collision with grass detected!");
            // Reset the game
            resetGame();
        }
    }
}
// Function to reset the game to its initial state
function resetGame() {
    // Update distance in storage
    updateDistanceInStorage();
    // Reset game variables
    rockPosition = -200;
    grassPosition = -200;
    distance = 0;
    document.getElementById("distance").innerText = "Distance: " + distance;
    gameStarted = false;
    collisionOccurred = false;
    // Reset positions of obstacles
    document.getElementById("rock").style.right = rockPosition + "px";
    document.getElementById("grass").style.right = grassPosition + "px";
    // Clear intervals to stop game logic
    clearInterval(rockInterval);
    clearInterval(grassInterval);
    clearInterval(distanceInterval);
    // Show countdown overlay for restarting the game
    document.getElementById("countdownOverlay").style.display = "flex";
    document.getElementById("countdown").innerText = "Press Space to start Game";
}
// Listen for space key press to start the game
document.addEventListener("keydown", function(event) {
    if (event.code === "Space") {
        // Trigger game start function
        gameStart();
    }
});
