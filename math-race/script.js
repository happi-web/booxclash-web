let players = [
    { id: "car1", name: "Player 1", position: 0, speed: 0.1, trackId: "track1" },
    { id: "car2", name: "Player 2", position: 0, speed: 0.1, trackId: "track2" }
];

let currentQuestionIndex = 0;
let questions = [
    { question: "Is 5 + 3 = 8?", answer: "True" },
    { question: "Is 2 * 3 = 9?", answer: "False" },
    { question: "Is 6 - 2 = 4?", answer: "True" },
    { question: "Is 9 + 1 = 11?", answer: "False" }
];

function startGame() {
    setInterval(moveCar, 50);  // Move cars at regular intervals
    setInterval(displayQuestion, 10000); // Display question every 10 seconds
}

function moveCar() {
    players.forEach(player => {
        const car = document.getElementById(player.id);
        player.position += player.speed;  // Move car according to speed
        car.style.bottom = `${player.position}px`;  // Update position of the car
    });
}

function displayQuestion() {
    const player1 = players[0];
    const player2 = players[1];

    // Display question for both tracks
    document.getElementById("question1").innerText = questions[currentQuestionIndex].question;
    document.getElementById("question2").innerText = questions[currentQuestionIndex].question;

    // Ask players to answer the question
    const answer = prompt(`${player1.name}, answer the question: ${questions[currentQuestionIndex].question}`);
    
    if (answer === questions[currentQuestionIndex].answer) {
        player1.speed *= 2; // Double speed for correct answer
        alert(`${player1.name} answered correctly! Speed doubled.`);
    } else {
        player1.speed /= 2; // Half speed for wrong answer
        alert(`${player1.name} answered incorrectly. Speed halved.`);
    }

    const opponentAnswer = prompt(`${player2.name}, answer the question: ${questions[currentQuestionIndex].question}`);
    
    if (opponentAnswer === questions[currentQuestionIndex].answer) {
        player2.speed *= 2; // Double speed for correct answer
        alert(`${player2.name} answered correctly! Speed doubled.`);
    } else {
        player2.speed /= 2; // Half speed for wrong answer
        alert(`${player2.name} answered incorrectly. Speed halved.`);
    }

    currentQuestionIndex = (currentQuestionIndex + 1) % questions.length; // Move to next question
}

startGame();
