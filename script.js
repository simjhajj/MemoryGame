// Get all card elements by their class name
const cards = document.querySelectorAll('.card');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let startTime;
let endTime;
let timerInterval; // Variable to store the timer interval

// Function to start the timer
function startTimer() {
    startTime = new Date();
    // Set up an interval to update the timer every second
    timerInterval = setInterval(updateTimer, 1000);
}

// Function to stop the timer
function stopTimer() {
    endTime = new Date();
    updateTimer(); // Update the timer one last time when stopping
    clearInterval(timerInterval); // Clear the interval
}

// Function to calculate and display the elapsed time
function updateTimer() {
    const currentTime = new Date();
    const elapsedTime = (currentTime - startTime) / 1000; // in seconds
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = Math.floor(elapsedTime % 60);

    // Update the timer element content
    document.getElementById('timer').textContent = `Timer: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Function to play the flip sound
function playFlipSound() {
    const flipAudio = document.getElementById('flipSound');
    if (flipAudio) {
        flipAudio.play().catch(error => console.error('Error playing flip sound:', error));
    }
}

// Function to play the match sound
function playMatchSound() {
    const matchAudio = document.getElementById('matchSound');
    if (matchAudio) {
        matchAudio.play().catch(error => console.error('Error playing match sound:', error));
    }
}

// Function to play the completion sound
function playCompletionSound() {
    const completionAudio = document.getElementById('completionSound');
    if (completionAudio) {
        completionAudio.play().catch(error => console.error('Error playing completion sound:', error));
    }
}

// Function to display congratulations message
function displayCongratulations() {
    const congratulationsMessage = document.getElementById('congratulationsMessage');
    congratulationsMessage.style.display = 'block';

    // Calculate and display the elapsed time
    const elapsedTime = calculateElapsedTime();
    document.getElementById('elapsedTime').textContent = elapsedTime;
}

// Function to calculate elapsed time
function calculateElapsedTime() {
    const totalTimeInSeconds = (endTime - startTime) / 1000;
    const minutes = Math.floor(totalTimeInSeconds / 60);
    const seconds = Math.floor(totalTimeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Function to toggle the card's image visibility
function toggleCardImage(card) {
    const questionMark = card.querySelector('.question-mark');
    const image = card.querySelector('.object-image');

    questionMark.style.display = 'none'; // Hide the question mark
    image.style.display = 'block'; // Show the object image
}

// Function to flip a card
function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('clicked');
    toggleCardImage(this);
    playFlipSound(); // Play the flip sound

    if (!hasFlippedCard) {
        // First card is flipped
        hasFlippedCard = true;
        firstCard = this;
    } else {
        // Second card is flipped
        hasFlippedCard = false;
        secondCard = this;
        checkForMatch();
    }
}

// Function to check if the flipped cards match
function checkForMatch() {
    // Do cards match?
    let isMatch = firstCard.querySelector('.object-image').src === secondCard.querySelector('.object-image').src;

    isMatch ? disableCards() : unflipCards();
}

// Function to disable matched cards
function disableCards() {
    playMatchSound(); // Play the match sound
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    // Check if all cards are matched
    if (document.querySelectorAll('.card.clicked').length === cards.length) {
        stopTimer();
        displayCongratulations(); // Display congratulations message
        playCompletionSound(); // Play the completion sound
    }

    resetBoard();
}

// Function to unflip cards if they don't match
function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('clicked');
        secondCard.classList.remove('clicked');

        // Hide the images and show the question marks again
        firstCard.querySelector('.object-image').style.display = 'none';
        firstCard.querySelector('.question-mark').style.display = 'block';
        secondCard.querySelector('.object-image').style.display = 'none';
        secondCard.querySelector('.question-mark').style.display = 'block';

        resetBoard();
    }, 1000); // Adjust the delay as needed
}

// Function to reset the board after flipping cards
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// Function to reset the game
function resetGame() {
    cards.forEach(card => {
        card.classList.remove('clicked');
        card.addEventListener('click', flipCard);

        // Show question mark and hide object image
        card.querySelector('.object-image').style.display = 'none';
        card.querySelector('.question-mark').style.display = 'block';
    });

    // Shuffle the cards
    shuffleCards();

    // Reset timer
    startTime = null;
    endTime = null;

    // Update the timer display
    updateTimer();

    // Hide congratulations message
    document.getElementById('congratulationsMessage').style.display = 'none';

    // Start the timer again
    startTimer();
}

// Function to shuffle the order of cards
function shuffleCards() {
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * 12);
        card.style.order = randomPos;
    });
}

// Adding click event listeners to each card
cards.forEach(card => {
    card.addEventListener('click', flipCard);
});

// Call startTimer on page load
startTimer();

// Call resetGame on page load
resetGame();
