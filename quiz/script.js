let players = [];
let questions = [];
let activePairs = [];
let currentPairIndex = 0;
let timer;
let timeLeft = 30;
let currentQuestionIndex = 0;
let winners = [];
let eliminated = [];
let currentAnswers = {};

// Load questions and initialize players
async function initGame() {
    let response = await fetch("questions.json");
    questions = await response.json();

    players = Array.from({ length: 8 }, (_, i) => ({
        id: `player${i + 1}`,
        name: `Player ${i + 1}`,
        eliminated: false,
        score: 0,
    }));

    renderPlayers();
    showMessage("ROUND 1 UNDERWAY", 5000, startRound);
}

// Show a message for a specific duration
function showMessage(message, duration, callback) {
    const messageBox = document.getElementById("message");
    messageBox.innerText = message;
    setTimeout(() => {
        messageBox.innerText = "";
        if (typeof callback === "function") {
            callback();
        }
    }, duration);
}

// Start a round
function startRound() {
    showMessage("PAIRING UNDERWAY", 5000, pairPlayers);
}

// Pair players for the current round
function pairPlayers() {
    const remainingPlayers = players.filter(p => !p.eliminated);
    if (remainingPlayers.length <= 1) {
        declareWinner();
        return;
    }

    // Form pairs
    activePairs = [];
    for (let i = 0; i < remainingPlayers.length; i += 2) {
        if (remainingPlayers[i + 1]) {
            activePairs.push([remainingPlayers[i], remainingPlayers[i + 1]]);
        }
    }

    currentPairIndex = 0;
    processNextPair();
}

function processNextPair() {
    if (currentPairIndex >= activePairs.length) {
        const remainingPlayers = players.filter(p => !p.eliminated);

        if (remainingPlayers.length === 1) {
            // If only one player remains, declare them the winner
            declareWinner();
            return;
        } 

        // Move to the next round based on the number of winners
        if (winners.length === 4) {
            showMessage("ROUND 2 SEMI-FINALS UNDERWAY", 5000, startNextRound);
        } else if (winners.length === 2) {
            showMessage("ROUND 3 FINALS UNDERWAY", 5000, startNextRound);
        } else {
            declareWinner(); // If no valid round exists, declare a winner
        }

        return;
    }

    activePair = activePairs[currentPairIndex];
    highlightPair();
    setTimeout(nextQuestion, 2000);
}

// Highlight the active pair
function highlightPair() {
    const pairingBox = document.getElementById("pairing");
    pairingBox.innerText = `${activePair[0].name} vs ${activePair[1].name}`;
    document.getElementById(activePair[0].id).classList.add("active");
    document.getElementById(activePair[1].id).classList.add("active");
}

// Display the next question
function nextQuestion() {
    if (currentQuestionIndex >= questions.length) {
        declareWinner();
        return;
    }

    const question = questions[currentQuestionIndex];
    document.getElementById("question").innerText = question.question;
    document.getElementById("options").innerHTML = question.options
        .map(
            option =>
                `<button class="option" onclick="submitAnswer('${option}', '${activePair[0].id}')">${option}</button>`
        )
        .join("");

    startTimer();
}

// Start the timer
function startTimer() {
    timeLeft = 30;
    document.getElementById("timer").innerText = `Time Left: ${timeLeft}s`;

    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText = `Time Left: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            eliminatePlayer();
        }
    }, 1000);
}

// Eliminate player(s) logic
function submitAnswer(selectedOption, playerId) {
    clearInterval(timer); // Stop the timer immediately after an answer is clicked

    const correctAnswer = questions[currentQuestionIndex].answer;
    currentAnswers[playerId] = selectedOption;

    const player = activePair.find(p => p.id === playerId);
    const otherPlayer = activePair.find(p => p.id !== playerId);

    if (!player || !otherPlayer) {
        eliminatePlayer(); // If something goes wrong, eliminate both
        return;
    }

    if (selectedOption === correctAnswer) {
        // Increase score for the player who answered correctly
        player.score += 10;

        // Mark them as a winner
        winners.push(player);

        // Eliminate the other player if they haven't answered correctly yet
        if (!currentAnswers[otherPlayer.id] || currentAnswers[otherPlayer.id] !== correctAnswer) {
            eliminatePlayer([otherPlayer.id]); // Remove only the losing player
        }

        return; // Exit function as we have already processed the winner
    }

    // If one player is still waiting, show a message
    if (!currentAnswers[otherPlayer.id]) {
        showMessage("Waiting for your friend to answer...", 5000);
        return;
    }

    // If both players have answered, check if the other player was correct
    if (currentAnswers[otherPlayer.id] === correctAnswer) {
        otherPlayer.score += 10;
        winners.push(otherPlayer);
        eliminatePlayer([player.id]); // Only eliminate the wrong player
    } else {
        // If both players were incorrect, eliminate both
        eliminatePlayer();
    }

    updateLists();
}


function eliminatePlayer(playerIds) {
    if (!playerIds) {
        // Eliminate both players due to timeout or incorrect answers
        activePair.forEach(p => {
            if (p) {
                p.eliminated = true;
                eliminated.push(p);
            }
        });

        showMessage("Both players are eliminated. Moving to next pair.", 5000);
    } else {
        let eliminatedPlayers = [];
        
        // Mark selected players as eliminated
        playerIds.forEach(playerId => {
            const player = activePair.find(p => p && p.id === playerId);
            if (player) {
                player.eliminated = true;
                eliminated.push(player);
                eliminatedPlayers.push(player);
            }
        });

        // If both players in the pair were eliminated, show a message
        if (eliminatedPlayers.length === 2) {
            showMessage("Oops! Both players are incorrect. Moving to next pair.", 5000);
        }
    }

    // Ensure game state updates correctly
    updateLists();
    currentAnswers = {};
    currentPairIndex++;

    // Delay the next pair slightly to prevent skipping
    setTimeout(processNextPair, 2000);
}

// Render players
function renderPlayers() {
    const playersContainer = document.getElementById("players");
    playersContainer.innerHTML = players
        .map(p => `<div id="${p.id}" class="player">${p.name}</div>`)
        .join("");
}

// Update lists and scoreboard
function updateLists() {
    const scoreboard = document.getElementById("scoreboard");
    const eliminatedList = document.getElementById("eliminated-list");
    const winnersList = document.getElementById("winners-list");

    if (scoreboard) {
        scoreboard.innerHTML = players.map(p => `${p.name}: ${p.score} points`).join("<br>");
    }

    if (eliminatedList) {
        eliminatedList.innerText = `Eliminated: ${eliminated
            .filter(p => p)
            .map(p => p.name)
            .join(", ")}`;
    }

    if (winnersList) {
        winnersList.innerText = `Winners: ${winners.map(p => p.name).join(", ")}`;
    }

    currentQuestionIndex++;
}

// Start the next round
function startNextRound() {
    players = [...winners];
    winners = [];
    startRound();
}

function declareWinner() {
    const remainingPlayers = players.filter(p => !p.eliminated);
    const winnerMessage = document.getElementById("winner");
    const leaderboard = document.getElementById("leaderboard");
    const modal = document.getElementById("leaderboard-modal");

    // Display winner message
    winnerMessage.innerText =
        remainingPlayers.length === 1
            ? `${remainingPlayers[0].name} is the winner! 🏆`
            : "Game Over!";

    // Show the winner message for 10 seconds before displaying the modal
    setTimeout(() => {
        // Sort players by score
        const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

        // Populate leaderboard
        leaderboard.innerHTML = sortedPlayers
            .map((player, index) => `${index + 1}. ${player.name}: ${player.score} points`)
            .join("<br>");

        // Show the modal
        modal.classList.remove("hidden");

        // Optionally, clear the winner message after showing the modal
        winnerMessage.innerText = "";
    }, 10000); // 10 seconds delay
}

function restartGame() {
    // Hide the leaderboard modal
    const modal = document.getElementById("leaderboard-modal");
    modal.classList.add("hidden");

    // Reset all game variables
    players = Array.from({ length: 8 }, (_, i) => ({
        id: `player${i + 1}`,
        name: `Player ${i + 1}`,
        eliminated: false,
        score: 0,
    }));
    
    questions = [];
    activePairs = [];
    currentPairIndex = 0;
    currentQuestionIndex = 0;
    winners = [];
    eliminated = [];
    currentAnswers = {};

    // Clear UI elements
    document.getElementById("winner").innerText = "";
    document.getElementById("pairing").innerText = "";
    document.getElementById("question").innerText = "";
    document.getElementById("options").innerHTML = "";
    document.getElementById("timer").innerText = "";
    document.getElementById("scoreboard").innerHTML = "";
    document.getElementById("eliminated-list").innerText = "";
    document.getElementById("winners-list").innerText = "";

    // Render players again
    renderPlayers();

    // Reload questions and start the game
    initGame();
}

function exitGame() {
    alert("Thanks for playing!");
    window.location.reload(); // Reload the page to reset the game
}

// Initialize the game
initGame();
