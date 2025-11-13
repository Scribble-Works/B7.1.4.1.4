// --- Quiz Data ---
const QUESTIONS = [
    { xLabel: "Hours", yLabel: "Distance (km)", knownX: 3, knownY: 150, findX: 5, findY: null, k: 50 }, 
    { xLabel: "Cups of Flour", yLabel: "Cookies", knownX: 2, knownY: 36, findX: null, findY: 72, k: 18 }, 
    { xLabel: "Pencils", yLabel: "Cost ($)", knownX: 7, knownY: 3.50, findX: 12, findY: null, k: 0.5 }, 
    { xLabel: "Litres", yLabel: "Price (ZAR)", knownX: 5, knownY: 80, findX: null, findY: 144, k: 16 }, 
    { xLabel: "Pages", yLabel: "Time (min)", knownX: 10, knownY: 25, findX: 4, findY: null, k: 2.5 }, 
    { xLabel: "Widgets", yLabel: "Profit ($)", knownX: 20, knownY: 100, findX: 35, findY: null, k: 5 }, 
    { xLabel: "Ingredients (g)", yLabel: "Servings", knownX: 400, knownY: 8, findX: null, findY: 15, k: 0.02 }, 
    { xLabel: "Meters", yLabel: "Wire (kg)", knownX: 8, knownY: 4, findX: 14, findY: null, k: 0.5 }, 
    { xLabel: "Students", yLabel: "Crayons", knownX: 9, knownY: 81, findX: null, findY: 108, k: 9 }, 
    { xLabel: "Pounds", yLabel: "Euros", knownX: 15, knownY: 18, findX: 20, findY: null, k: 1.2 } 
];

const POINTS_PER_QUESTION = 10;
let totalScore = 0;
let currentQuestionIndex = 0;
// Array to store the student's answer for each question (used for final scoring)
let studentAnswers = new Array(QUESTIONS.length).fill(null);

// --- Utility Functions ---

function getCorrectAnswer(q) {
    if (q.findY === null) {
        // Find Y: Y = k * X
        return q.k * q.findX;
    } else {
        // Find X: X = Y / k
        return q.findY / q.k;
    }
}

// --- Game Flow Functions ---

function startGame() {
    // Reset game state
    totalScore = 0;
    currentQuestionIndex = 0;
    studentAnswers = new Array(QUESTIONS.length).fill(null);
    
    // Show/Hide Elements
    document.getElementById('start-btn').style.display = 'none';
    document.getElementById('check-btn').style.display = 'none';
    document.getElementById('score-area').style.display = 'none';
    document.getElementById('plot-area').style.display = 'none';
    document.getElementById('quiz-area').style.display = 'block';

    displayQuestion();
}

function displayQuestion() {
    const quizArea = document.getElementById('quiz-area');
    quizArea.innerHTML = ''; // Clear previous question
    
    if (currentQuestionIndex >= QUESTIONS.length) {
        // This should not happen if called correctly, but as a safeguard:
        finishQuiz(); 
        return;
    }

    const q = QUESTIONS[currentQuestionIndex];
    const qNum = currentQuestionIndex + 1;
    const correctValue = getCorrectAnswer(q);
    
    // Determine where the input field goes
    let xValue = q.findX !== null ? q.findX : `<input type="number" id="current_input" step="0.01" data-answer="${correctValue.toFixed(2)}" placeholder="?">`;
    let yValue = q.findY !== null ? q.findY : `<input type="number" id="current_input" step="0.01" data-answer="${correctValue.toFixed(2)}" placeholder="?">`;

    // Determine button text
    const buttonText = (qNum === QUESTIONS.length) ? 'Game Over & Calculate Score' : 'Next Question';
    const buttonAction = (qNum === QUESTIONS.length) ? 'submitAnswerAndFinish()' : 'submitAnswerAndContinue()';

    const html = `
        <div class="question-card" id="card${qNum}">
            <h3>Question ${qNum} of ${QUESTIONS.length} (10 Marks): Find the missing value</h3>
            <table>
                <thead>
                    <tr>
                        <th>${q.xLabel} (x)</th>
                        <th>${q.yLabel} (y)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${q.knownX}</td>
                        <td>${q.knownY.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>${xValue}</td>
                        <td>${yValue}</td>
                    </tr>
                </tbody>
            </table>
            <p id="question-feedback"></p>
        </div>
        <button id="next-btn" onclick="${buttonAction}">➡️ ${buttonText}</button>
    `;
    quizArea.innerHTML = html;
}


function submitAnswerAndContinue() {
    const inputElement = document.getElementById('current_input');
    const studentAnswer = parseFloat(inputElement.value);
    
    if (isNaN(studentAnswer)) {
        document.getElementById('question-feedback').textContent = "Please enter a number before moving on!";
        document.getElementById('question-feedback').style.color = "red";
        return;
    }

    // Store the answer
    studentAnswers[currentQuestionIndex] = studentAnswer;
    
    // Move to the next question
    currentQuestionIndex++;
    if (currentQuestionIndex < QUESTIONS.length) {
        displayQuestion();
    } else {
        // Should use submitAnswerAndFinish for the last question, but safe fail here
        finishQuiz();
    }
}

function submitAnswerAndFinish() {
    const inputElement = document.getElementById('current_input');
    const studentAnswer = parseFloat(inputElement.value);
    
    if (isNaN(studentAnswer)) {
        document.getElementById('question-feedback').textContent = "Please enter a number before finishing the quiz!";
        document.getElementById('question-feedback').style.color = "red";
        return;
    }

    // Store the final answer
    studentAnswers[currentQuestionIndex] = studentAnswer;
    
    // Final Scoring
    finishQuiz();
}

/**
 * Checks all stored answers, calculates the score, and displays results.
 */
function finishQuiz() {
    document.getElementById('quiz-area').style.display = 'none';
    document.getElementById('score-area').style.display = 'block';
    document.getElementById('plot-area').style.display = 'block';
    
    totalScore = 0;
    let wrongAnswers = [];

    // --- Scoring Logic ---
    QUESTIONS.forEach((q, index) => {
        const studentAnswer = studentAnswers[index];
        const correctAnswer = getCorrectAnswer(q);
        const qNum = index + 1;

        // Check if the answer is close (0.02 tolerance)
        if (!isNaN(studentAnswer) && Math.abs(studentAnswer - correctAnswer) < 0.02) {
            totalScore += POINTS_PER_QUESTION;
        } else {
            wrongAnswers.push(qNum);
        }
    });
    
    // --- Display Final Score ---
    document.getElementById('final-score').textContent = `Total Score: ${totalScore} / 100`;

    // Final feedback message
    let finalFeedback = "";
    if (totalScore === 100) {
        finalFeedback = "🏆 Absolutely brilliant! A perfect score!";
    } else if (totalScore >= 70) {
        finalFeedback = "👍 Very good work! You mastered most of the relationships.";
    } else if (totalScore > 0) {
        finalFeedback = `⚠️ You need a little more practice. Review Questions: ${wrongAnswers.join(', ')}.`;
    } else {
        finalFeedback = "😔 Keep trying! Remember, proportional relationships use multiplication or division.";
    }
    document.getElementById('score-feedback').textContent = finalFeedback;

    // --- Plotting Visualization ---
    // Plot the first question's data (the coordinates for Q1)
    plotPoints(QUESTIONS[0]);
}

// --- Plotting Logic (Same as before, simplified for the new context) ---

/**
 * Plots the points for the given question object using Canvas.
 */
function plotPoints(q) {
    const canvas = document.getElementById('proportional-graph');
    const ctx = canvas.getContext('2d');
    const size = canvas.width; 
    const padding = 40;
    const chartArea = size - (2 * padding);
    
    ctx.clearRect(0, 0, size, size);

    const xValues = [q.knownX, q.findX].filter(v => v !== null);
    const yValues = [q.knownY, getCorrectAnswer(q) || q.findY].filter(v => v !== null);

    const maxX = Math.max(...xValues);
    const maxY = Math.max(...yValues);

    const scaleX = chartArea / maxX;
    const scaleY = chartArea / maxY;

    // Draw Axes
    ctx.beginPath();
    ctx.moveTo(padding, size - padding);
    ctx.lineTo(size, size - padding); 
    ctx.moveTo(padding, size - padding);
    ctx.lineTo(padding, 0);
    ctx.strokeStyle = '#000';
    ctx.stroke();

    // Axes Labels and Origin
    ctx.font = '10px Arial';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.fillText(`${q.xLabel} (x)`, size / 2 + padding / 2, size - 10);
    ctx.save();
    ctx.translate(15, size / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${q.yLabel} (y)`, 0, 0);
    ctx.restore();
    ctx.textAlign = 'right';
    ctx.fillText('(0, 0)', padding - 5, size - padding + 15);

    function getCanvasCoords(x, y) {
        const cx = padding + x * scaleX;
        const cy = size - padding - y * scaleY;
        return { cx, cy };
    }

    // Line (connecting (0,0) to the furthest point)
    const { cx: endX, cy: endY } = getCanvasCoords(maxX, maxY);
    ctx.beginPath();
    ctx.moveTo(padding, size - padding); 
    ctx.lineTo(endX, endY); 
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.stroke();

    // The points to plot
    const points = [
        { x: q.knownX, y: q.knownY },
        { x: q.findX !== null ? q.findX : getCorrectAnswer(q) / q.k, 
          y: q.findY !== null ? q.findY : getCorrectAnswer(q) }
    ];

    // Plot Points (Red dots)
    ctx.fillStyle = 'red';
    points.forEach(point => {
        const { cx, cy } = getCanvasCoords(point.x, point.y);
        
        ctx.beginPath();
        ctx.arc(cx, cy, 4, 0, Math.PI * 2); 
        ctx.fill();
        
        ctx.textAlign = 'left';
        ctx.fillText(`(${point.x}, ${point.y.toFixed(2)})`, cx + 6, cy - 2);
    });
}

// Initial plot of Question 1's data when the page loads
window.onload = () => plotPoints(QUESTIONS[0]);