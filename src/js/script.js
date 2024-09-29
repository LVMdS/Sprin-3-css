const quizData = [
    {
        question: "Qual empresa desenvolveu o sistema operacional Windows?",
        choices: ["Microsoft", "Apple", "Google", "IBM"],
        correct: "Microsoft"
    },
    {
        question: "Qual linguagem é conhecida por ser usada para desenvolvimento web?",
        choices: ["Python", "C++", "JavaScript", "Java"],
        correct: "JavaScript"
    },
    {
        question: "O que significa HTML?",
        choices: ["HyperText Markup Language", "Home Tool Markup Language", "Hyperlinks Text Markup Language", "Hyper Transfer Markup Language"],
        correct: "HyperText Markup Language"
    },
    {
        question: "Qual empresa comprou o GitHub em 2018?",
        choices: ["Microsoft", "Facebook", "Amazon", "Google"],
        correct: "Microsoft"
    },
    {
        question: "Em que ano o iPhone foi lançado pela primeira vez?",
        choices: ["2005", "2007", "2009", "2011"],
        correct: "2007"
    }
];

let currentQuestion = 0;
let score = 0;
let ranking = [];

// Randomizar perguntas
quizData.sort(() => Math.random() - 0.5);

const correctSound = new Audio('/src/audio/fire.mp3');
const wrongSound = new Audio('/src/audio/buzzer.mp3');

function loadQuestion() {
    const questionElement = document.getElementById("question");
    const choicesElement = document.getElementById("choices");
    const feedbackElement = document.getElementById("feedback");
    
    feedbackElement.textContent = "";
    choicesElement.innerHTML = "";

    const currentQuiz = quizData[currentQuestion];
    questionElement.textContent = currentQuiz.question;

    currentQuiz.choices.forEach(choice => {
        const button = document.createElement("button");
        button.textContent = choice;
        button.onclick = () => checkAnswer(choice);
        choicesElement.appendChild(button);
    });
}

function checkAnswer(choice) {
    const feedbackElement = document.getElementById("feedback");

    if (choice === quizData[currentQuestion].correct) {
        feedbackElement.textContent = "Correto!";
        feedbackElement.style.color = "green";
        correctSound.play();
        score++;
    } else {
        feedbackElement.textContent = "Errado!";
        feedbackElement.style.color = "red";
        wrongSound.play();
    }

    document.getElementById("next-btn").style.display = "block";
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < quizData.length) {
        loadQuestion();
    } else {
        endQuiz();
    }
    document.getElementById("next-btn").style.display = "none";
}

function endQuiz() {
    const quizContainer = document.getElementById("quiz-container");
    quizContainer.innerHTML = `
        <div class="end-quiz-message">
            <h2>Fim do quiz!</h2>
            <h3>Sua pontuação: ${score}</h3>
        </div>`;
    document.getElementById("end-quiz-options").style.display = "block";
    updateRanking();
}

function updateRanking() {
    ranking.push(score);
    ranking.sort((a, b) => b - a); 

    const rankingElement = document.getElementById("ranking");
    if (rankingElement) {
        rankingElement.innerHTML = "";
    
        ranking.slice(0, 5).forEach((points, index) => {  // Exibe apenas o top 5
            const listItem = document.createElement("li");
            listItem.textContent = `Jogador ${index + 1}: ${points} pontos`;
            rankingElement.appendChild(listItem);
        });
    }

    localStorage.setItem("quizRanking", JSON.stringify(ranking));
}

function loadRanking() {
    const storedRanking = localStorage.getItem("quizRanking");
    if (storedRanking) {
        ranking = JSON.parse(storedRanking);
        updateRanking();
    }
}

// Adicionar função para carregar o ranking na página inicial
function loadRankingHomePage() {
    const storedRanking = localStorage.getItem("quizRanking");
    if (storedRanking) {
        ranking = JSON.parse(storedRanking);

        const rankingList = document.getElementById("ranking-list");
        if (rankingList) {
            rankingList.innerHTML = "";

            ranking.slice(0, 5).forEach((points, index) => {
                const listItem = document.createElement("li");
                listItem.textContent = `Jogador ${index + 1}: ${points} pontos`;
                rankingList.appendChild(listItem);
            });
        }
    }
}

function restartQuiz() {
    // Se estiver em outra página, redireciona para quiz.html
    window.location.href = "/src/pages-quiz/quiz.html";  
}

function goToHomePage() {
    window.location.href = "/index.html"; // Troque para o URL da página inicial
}

document.addEventListener("DOMContentLoaded", () => {
    const isQuizPage = document.getElementById("question");  // Verifica se é a página de quiz
    if (isQuizPage) {
        loadQuestion();
        loadRanking();
        document.getElementById("next-btn").style.display = "none";
    } else {
        loadRankingHomePage();  // Se não for a página de quiz, carrega o ranking na home
    }
});
