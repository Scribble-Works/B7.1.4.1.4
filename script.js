// ======================
// CONFIGURATION
// ======================
const POINTS_PER_QUESTION = 10;

// Proportional relationship: y = k * x
const quizData = [
  { labelA: 'Hours Worked', labelB: 'Earnings (GHS)', pairs: [[2, 10], [4, 20], [6, null]], answer: 30 },
  { labelA: 'Kilograms', labelB: 'Cost (GHS)', pairs: [[1, 4], [3, 12], [5, null]], answer: 20 },
  { labelA: 'Minutes', labelB: 'Pages Read', pairs: [[2, 6], [5, 15], [7, null]], answer: 21 },
  { labelA: 'Cups of Sugar', labelB: 'Cookies Made', pairs: [[1, 12], [2, 24], [4, null]], answer: 48 },
  { labelA: 'Liters', labelB: 'Distance (km)', pairs: [[2, 20], [5, 50], [8, null]], answer: 80 },
  { labelA: 'Days', labelB: 'Plants Grown', pairs: [[1, 3], [4, 12], [6, null]], answer: 18 },
  { labelA: 'Inches', labelB: 'Centimeters', pairs: [[1, 2.54], [3, 7.62], [5, null]], answer: 12.7 },
  { labelA: 'Packs', labelB: 'Pencils', pairs: [[2, 8], [5, 20], [9, null]], answer: 36 },
  { labelA: 'Hours', labelB: 'Water (L)', pairs: [[1, 5], [3, 15], [6, null]], answer: 30 },
  { labelA: 'Students', labelB: 'Notebooks', pairs: [[2, 4], [7, 14], [10, null]], answer: 20 }
];

// ======================
// STATE
// ======================
let currentQuestionIndex = 0;
let score = 0;
let currentAnswer = null;
let isAnswered = false;

// ======================
// DOM ELEMENTS
// ======================
const startScreen = document.getElementById('start-screen');
const quizArea = document.getElementById('quiz-area');
const gameOver = document.getElementById('game-over');
const qCounter = document.getElementById('q-counter');
const currentScoreEl = document.getElementById('current-score');
const finalScoreEl = document.getElementById('final-score');
const tableBody = document.getElementById('table-body');
const headerX = document.getElementById('header-x');
const headerY = document.getElementById('header-y');
const userAnswerInput = document.getElementById('user-answer');
const checkButton = document.getElementById('check-button');
const nextButton = document.getElementById('next-button');
const feedbackEl = document.getElementById('feedback');

// ======================
// SOUND HELPER
// ======================
function playSound(id) {
  const sound = document.getElementById(id);
  if (sound) {
    sound.currentTime = 0;
    sound.play().catch(() => {});
  }
}

// ======================
// DISPLAY QUESTION
// ======================
function displayQuestion() {
  if (currentQuestionIndex >= quizData.length) {
    endGame();
    return;
  }

  const q = quizData[currentQuestionIndex];
  isAnswered = false;
  currentAnswer = q.answer;

  // Update headers
  headerX.textContent = q.labelA;
  headerY.textContent = q.labelB;

  // Update counters
  qCounter.textContent = currentQuestionIndex + 1;
  currentScoreEl.textContent = score;

  // Build table
  tableBody.innerHTML = '';
  q.pairs.forEach(([x, y]) => {
    const row = tableBody.insertRow();
    const cellX = row.insertCell();
    const cellY = row.insertCell();
    cellX.textContent = x;
    cellY.textContent = y !== null ? y : '?';
  });

  // Reset input & UI
  userAnswerInput.value = '';
  userAnswerInput.disabled = false;
  feedbackEl.className = 'mt-4 hidden p-3 rounded font-medium text-center';
  checkButton.classList.remove('hidden');
  nextButton.classList.add('hidden');
}

// ======================
// CHECK ANSWER
// ======================
function checkAnswer() {
  if (isAnswered) return;

  const inputValue = userAnswerInput.value.trim();
  if (inputValue === '') {
    showFeedback('Please enter a number.', false);
    return;
  }

  const userAnswer = parseFloat(inputValue);
  if (isNaN(userAnswer)) {
    showFeedback('Please enter a valid number.', false);
    return;
  }

  // Allow small tolerance for decimals (e.g., 12.7 vs 12.700)
  const isCorrect = Math.abs(userAnswer - currentAnswer) < 0.01;
  isAnswered = true;
  userAnswerInput.disabled = true;

  if (isCorrect) {
    score += POINTS_PER_QUESTION;
    currentScoreEl.textContent = score;
    showFeedback(`Correct! ✅ The missing value is ${currentAnswer}.`, true);
    playSound('correct-sound');
  } else {
    showFeedback(`Incorrect. ❌ The correct answer is ${currentAnswer}.`, false);
    playSound('wrong-sound');
  }

  checkButton.classList.add('hidden');
  nextButton.classList.remove('hidden');
}

function showFeedback(message, isCorrect) {
  feedbackEl.textContent = message;
  feedbackEl.className = `mt-4 p-3 rounded font-medium text-center ${
    isCorrect ? 'text-green-800 bg-green-100' : 'text-red-800 bg-red-100'
  }`;
  feedbackEl.classList.remove('hidden');
}

// ======================
// NAVIGATION
// ======================
function nextQuestion() {
  currentQuestionIndex++;
  displayQuestion();
}

function startGame() {
  currentQuestionIndex = 0;
  score = 0;
  startScreen.classList.add('hidden');
  gameOver.classList.add('hidden');
  quizArea.classList.remove('hidden');
  displayQuestion();
}

function endGame() {
  quizArea.classList.add('hidden');
  gameOver.classList.remove('hidden');
  finalScoreEl.textContent = score;
}

// ======================
// EVENT LISTENERS
// ======================
document.getElementById('start-button').addEventListener('click', startGame);
document.getElementById('restart-button').addEventListener('click', startGame);
document.getElementById('check-button').addEventListener('click', checkAnswer);
document.getElementById('next-button').addEventListener('click', nextQuestion);

// Allow Enter key to submit
userAnswerInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    checkAnswer();
  }
});