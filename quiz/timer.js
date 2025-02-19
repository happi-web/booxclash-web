// const spans = document.querySelectorAll(".items span"); // Select all span elements
// const timerElement = document.querySelector(".timer"); // Select the timer element
// const questionElement = document.querySelector(".question"); // Select the question display element
// const optionsElement = document.querySelector(".options"); // Select the options display element
// let currentIndex = 0; // Track the current span index
// let questionIndex = 0; // Track the current question index
// const timeLimit = 5; // Timer duration (in seconds)

// const mathQuestions = [
//     {
//       question: "What is 5 + 3?",
//       options: ["6", "7", "8", "9"],
//       correctAnswer: "8",
//     },
//     {
//       question: "What is 10 - 7?",
//       options: ["3", "4", "2", "1"],
//       correctAnswer: "3",
//     },
//     {
//       question: "What is 4 × 2?",
//       options: ["6", "7", "8", "9"],
//       correctAnswer: "8",
//     },
//     {
//       question: "What is 12 ÷ 3?",
//       options: ["2", "3", "4", "5"],
//       correctAnswer: "4",
//     },
//     {
//       question: "What is 9 + 6?",
//       options: ["14", "15", "16", "17"],
//       correctAnswer: "15",
//     },
//     {
//       question: "What is 8 - 3?",
//       options: ["5", "6", "7", "4"],
//       correctAnswer: "5",
//     },
//     {
//       question: "What is 7 × 3?",
//       options: ["21", "22", "23", "20"],
//       correctAnswer: "21",
//     },
//     {
//       question: "What is 16 ÷ 4?",
//       options: ["2", "3", "4", "5"],
//       correctAnswer: "4",
//     },
//     {
//       question: "What is 15 - 5?",
//       options: ["10", "11", "9", "12"],
//       correctAnswer: "10",
//     },
//     {
//       question: "What is 6 × 2?",
//       options: ["10", "12", "11", "13"],
//       correctAnswer: "12",
//     },
//   ];
// // Function to start the timer
// function startTimer() {
//   let counter = timeLimit;

//   const interval = setInterval(() => {
//     timerElement.textContent = `Time left: ${counter}s`; // Update timer text
//     counter--;

//     if (counter < 0) {
//       clearInterval(interval); // Stop the timer
//       timerElement.textContent = "Time's up!";
//       changeColor(); // Change the color of the current span
//     }
//   }, 1000); // Execute every second
// }

// // Function to change the background color of spans
// function changeColor() {
//   if (currentIndex < spans.length) {
//     spans[currentIndex].style.backgroundColor = "orange"; // Change the background color
//     currentIndex++; // Move to the next span

//     // Display a question when two spans are highlighted
//     if (currentIndex % 2 === 0 && currentIndex <= spans.length) {
//       displayQuestion(); // Display the next question
//     }

//     if (currentIndex < spans.length) {
//       startTimer(); // Restart the timer for the next span
//     } else {
//       console.log("All spans have been updated.");
//       timerElement.textContent = "All players are done!"; // Final message
//     }
//   }
// }

// // Function to display the next math question with options
// function displayQuestion() {
//   if (questionIndex < mathQuestions.length) {
//     const questionData = mathQuestions[questionIndex]; // Get the current question

//     // Display the question
//     questionElement.textContent = `Question: ${questionData.question}`;

//     // Display the options
//     optionsElement.innerHTML = ""; // Clear any previous options
//     questionData.options.forEach((option) => {
//       const optionElement = document.createElement("button");
//       optionElement.textContent = option;
//       optionElement.classList.add("option");
//       optionElement.onclick = () => checkAnswer(option, questionData.correctAnswer);
//       optionsElement.appendChild(optionElement);
//     });
//   } else {
//     questionElement.textContent = "No more questions!";
//     optionsElement.innerHTML = ""; // Clear options
//   }
// }

// // Function to check the selected answer
// function checkAnswer(selectedOption, correctAnswer) {
//   if (selectedOption === correctAnswer) {
//     alert("Correct answer!");
//     addAttackButton(); // Add the "Attack" button and energy bar to the highlighted spans
//     questionIndex++; // Move to the next question
//     displayQuestion(); // Display the next question
//   } else {
//     alert(`Wrong answer! The correct answer is ${correctAnswer}.`);
//   }
// }

// // Function to add the "Attack" button and energy bar to highlighted spans
// function addAttackButton() {
//   spans.forEach((span, index) => {
//     if (index < currentIndex) {
//       // Check if the span already contains an "Attack" button
//       if (!span.querySelector(".attack-button")) {
//         const attackButton = document.createElement("button");
//         attackButton.textContent = "Attack";
//         attackButton.classList.add("attack-button");

//         // Create an energy bar
//         const energyBar = document.createElement("div");
//         energyBar.classList.add("energy-bar");
//         energyBar.style.width = "100%"; // Start at 100% energy
//         energyBar.style.height = "10px";
//         energyBar.style.backgroundColor = "green"; // Start with green color
//         energyBar.style.marginTop = "5px";

//         // Handle "Attack" button click
//         attackButton.onclick = () => {
//           let energy = parseInt(energyBar.style.width); // Get current energy level
//           energy -= 10; // Reduce energy by 10%
//           if (energy < 0) energy = 0; // Ensure energy doesn't go below 0
//           energyBar.style.width = `${energy}%`;

//           // Change color based on energy level
//           if (energy > 50) {
//             energyBar.style.backgroundColor = "green";
//           } else if (energy > 20) {
//             energyBar.style.backgroundColor = "orange";
//           } else {
//             energyBar.style.backgroundColor = "red";
//           }

//           // Eliminate the player if energy reaches 0
//           if (energy === 0) {
//             span.style.backgroundColor = "red"; // Change span background color to red
//             attackButton.disabled = true; // Disable the "Attack" button
//             alert("Player eliminated!");
//           } else {
//             alert("You lost 10 kcal of energy!");
//           }
//         };

//         // Append the attack button and energy bar to the span
//         span.appendChild(attackButton);
//         span.appendChild(energyBar);
//       }
//     }
//   });
// }

// // Start the first timer
// startTimer();
const spans = document.querySelectorAll(".items span");
const timerElement = document.querySelector(".timer");
const questionElement = document.querySelector(".question");
const optionsElement = document.querySelector(".options");
let currentIndex = 0;
let questionIndex = 0;
const timeLimit = 5;

const mathQuestions = [
        {
          question: "What is 5 + 3?",
          options: ["6", "7", "8", "9"],
          correctAnswer: "8",
        },
        {
          question: "What is 10 - 7?",
          options: ["3", "4", "2", "1"],
          correctAnswer: "3",
        },
        {
          question: "What is 4 × 2?",
          options: ["6", "7", "8", "9"],
          correctAnswer: "8",
        },
        {
          question: "What is 12 ÷ 3?",
          options: ["2", "3", "4", "5"],
          correctAnswer: "4",
        },
        {
          question: "What is 9 + 6?",
          options: ["14", "15", "16", "17"],
          correctAnswer: "15",
        },
        {
          question: "What is 8 - 3?",
          options: ["5", "6", "7", "4"],
          correctAnswer: "5",
        },
        {
          question: "What is 7 × 3?",
          options: ["21", "22", "23", "20"],
          correctAnswer: "21",
        },
        {
          question: "What is 16 ÷ 4?",
          options: ["2", "3", "4", "5"],
          correctAnswer: "4",
        },
        {
          question: "What is 15 - 5?",
          options: ["10", "11", "9", "12"],
          correctAnswer: "10",
        },
        {
          question: "What is 6 × 2?",
          options: ["10", "12", "11", "13"],
          correctAnswer: "12",
        },
      ];

function startTimer() {
  let counter = timeLimit;

  const interval = setInterval(() => {
    timerElement.textContent = `Time left: ${counter}s`;
    counter--;

    if (counter < 0) {
      clearInterval(interval);
      timerElement.textContent = "Time's up!";
      changeColor();
    }
  }, 1000);
}

function changeColor() {
  if (currentIndex < spans.length) {
    spans[currentIndex].style.backgroundColor = "orange";
    currentIndex++;

    if (currentIndex % 2 === 0 && currentIndex <= spans.length) {
      displayQuestion();
    }

    if (currentIndex < spans.length) {
      startTimer();
    } else {
      timerElement.textContent = "All players are done!";
    }
  }
}

function displayQuestion() {
  if (questionIndex < mathQuestions.length) {
    const questionData = mathQuestions[questionIndex];

    questionElement.textContent = `Question: ${questionData.question}`;
    optionsElement.innerHTML = "";

    questionData.options.forEach((option) => {
      const optionElement = document.createElement("button");
      optionElement.textContent = option;
      optionElement.classList.add("option");
      optionElement.onclick = () => checkAnswer(option, questionData.correctAnswer);
      optionsElement.appendChild(optionElement);
    });
  } else {
    questionElement.textContent = "No more questions!";
    optionsElement.innerHTML = "";
  }
}

function checkAnswer(selectedOption, correctAnswer) {
  if (selectedOption === correctAnswer) {
    alert("Correct answer!");
    addAttackButton();
    questionIndex++;
    displayQuestion();
    enableAllButtons();
  } else {
    alert(`Wrong answer! The correct answer is ${correctAnswer}.`);
  }
}

function addAttackButton() {
    spans.forEach((span, index) => {
      if (index < currentIndex) {
        if (!span.querySelector(".attack-button")) {
          const attackButton = document.createElement("button");
          attackButton.textContent = "Attack";
          attackButton.classList.add("attack-button");
          attackButton.disabled = false;
  
          const energyBar = document.createElement("div");
          energyBar.classList.add("energy-bar");
          energyBar.style.width = "100%";
          energyBar.style.height = "10px";
          energyBar.style.backgroundColor = "green";
          energyBar.style.marginTop = "5px";
  
          attackButton.onclick = () => {
            disableAllButtonsExcept(attackButton);
  
            // Disable this button after click
            attackButton.disabled = true;
  
            let energy = parseInt(energyBar.style.width);
            energy -= 10;
            if (energy < 0) energy = 0;
            energyBar.style.width = `${energy}%`;
  
            if (energy > 50) {
              energyBar.style.backgroundColor = "green";
            } else if (energy > 20) {
              energyBar.style.backgroundColor = "orange";
            } else {
              energyBar.style.backgroundColor = "red";
            }
  
            if (energy === 0) {
              span.style.backgroundColor = "red";
              alert(`Player ${index + 1} eliminated!`);
              checkForWinner();
            }
          };
  
          span.appendChild(attackButton);
          span.appendChild(energyBar);
        }
      }
    });
  }
  

function disableAllButtonsExcept(activeButton) {
  const buttons = document.querySelectorAll(".attack-button");
  buttons.forEach((button) => {
    button.disabled = button !== activeButton;
  });
}

function enableAllButtons() {
  const buttons = document.querySelectorAll(".attack-button");
  buttons.forEach((button) => {
    button.disabled = false;
  });
}

function checkForWinner() {
  const remainingPlayers = Array.from(spans).filter((span) => {
    const energyBar = span.querySelector(".energy-bar");
    return energyBar && parseInt(energyBar.style.width) > 0;
  });

  if (remainingPlayers.length === 1) {
    const winnerIndex = spans.indexOf(remainingPlayers[0]);
    alert(`Congratulations Player ${winnerIndex + 1}, you are the winner!`);
  }
}

startTimer();
