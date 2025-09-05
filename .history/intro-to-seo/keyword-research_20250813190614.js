const slides = ['#one', '#two', '#three', '#four', '#five', '#six', '#seven', '#eight', '#nine', '#ten', '#end'];

function updateProgressBar() {
  const currentHash = window.location.hash || '#one';
  const currentIndex = slides.indexOf(currentHash);
  const progress = ((currentIndex + 1) / slides.length) * 100;

  const progressFill = document.getElementById('progressFill');
  if (progressFill) progressFill.style.width = progress + '%';
}

function showPage() {
  const hash = window.location.hash || '#one';

  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));

  const currentPage = document.querySelector(hash);
  if (currentPage) currentPage.classList.add('active');

  updateProgressBar();
}

function nextSlide() {
  const currentHash = window.location.hash || '#one';
  const currentIndex = slides.indexOf(currentHash);

  if (currentIndex < slides.length - 1) {
    window.location.hash = slides[currentIndex + 1];
  }
}

function previousSlide() {
  const currentHash = window.location.hash || '#one';
  const currentIndex = slides.indexOf(currentHash);

  if (currentIndex > 0) {
    window.location.hash = slides[currentIndex - 1];
  }
}

document.addEventListener('DOMContentLoaded', showPage);
window.addEventListener('hashchange', showPage);

// ---------- QUIZ HANDLERS ----------

function checkAnswer(quizId, correctAnswer, feedbackId, submitBtnSelector) {
  const quiz = document.getElementById(quizId);
  const feedback = document.getElementById(feedbackId);
  const options = quiz.querySelectorAll('[data-answer]');
  let selectedAnswer = null;

  options.forEach(option => {
    if (option.classList.contains('selected')) selectedAnswer = option.dataset.answer;
  });

  if (!selectedAnswer) return;

  options.forEach(option => {
    option.style.pointerEvents = 'none';
    if (selectedAnswer === correctAnswer && option.dataset.answer === correctAnswer) {
      option.classList.add('correct');
    } else if (option.classList.contains('selected')) {
      option.classList.add('incorrect');
    }
  });

  feedback.style.display = 'block';
  const submitBtn = document.querySelector(submitBtnSelector);

  if (selectedAnswer === correctAnswer) {
    feedback.className = 'feedback correct';
    feedback.innerHTML = '🎉 Correct!';

    // Swap buttons: hide submit, show try again
    submitBtn.textContent = 'Next';
    submitBtn.onclick = nextSlide;
    submitBtn.style.background = '#df6565';
    swapButtons(submitBtn, 'btn-try-again');

  } else {
    feedback.className = 'feedback incorrect';
    feedback.innerHTML = '❌ Incorrect.';
  }
}

function swapButtons(submitBtn, tryAgainId) {
  const tryAgainBtn = document.getElementById(tryAgainId);
  if (!tryAgainBtn) return;

  // Swap positions visually
  const parent = submitBtn.parentElement;
  parent.insertBefore(tryAgainBtn, submitBtn);
  tryAgainBtn.style.display = 'inline-block';
  submitBtn.style.display = 'inline-block';
}

// Reset quiz
function resetQuiz(quizId, feedbackId, submitBtnSelector) {
  const quiz = document.getElementById(quizId);
  const feedback = document.getElementById(feedbackId);
  const options = quiz.querySelectorAll('[data-answer]');

  options.forEach(option => {
    option.classList.remove('selected', 'correct', 'incorrect');
    option.style.pointerEvents = 'auto';
  });

  const submitBtn = document.querySelector(submitBtnSelector);
  submitBtn.textContent = 'Submit Answer';
  submitBtn.onclick = function() { checkAnswer(quizId, 'a', feedbackId, submitBtnSelector); };
  submitBtn.style.background = '';
  feedback.style.display = 'none';
}

// ---------- DRAG & DROP HANDLERS ----------
let draggedElement = null;
const dropZones = document.querySelectorAll('.drop-zone');
const draggableWords = document.querySelectorAll('.draggable-word');
const correctAnswer = ['Search', 'Demand'];

function allowDrop(ev) {
  ev.preventDefault();
  if (ev.target.classList.contains('drop-zone')) ev.target.classList.add('drag-over');
}

function drag(ev) {
  draggedElement = ev.target;
  ev.dataTransfer.setData("text", ev.target.getAttribute('data-word'));
  ev.dataTransfer.effectAllowed = "move";
}

function drop(ev) {
  ev.preventDefault();
  ev.target.classList.remove('drag-over');

  if (ev.target.classList.contains('drop-zone') && !ev.target.textContent.trim()) {
    const word = ev.dataTransfer.getData("text");
    if (word && draggedElement) placeWordInDropZone(ev.target, word, draggedElement);
  }
  draggedElement = null;
}

function clickWord(wordElement) {
  if (wordElement.style.pointerEvents === 'none') return;
  const word = wordElement.getAttribute('data-word');
  const emptyDropZone = Array.from(dropZones).find(zone => !zone.textContent.trim());
  if (emptyDropZone) placeWordInDropZone(emptyDropZone, word, wordElement);
}

function placeWordInDropZone(dropZone, word, wordElement) {
  dropZone.textContent = word;
  dropZone.classList.add('filled');
  wordElement.style.pointerEvents = 'none';
  wordElement.style.opacity = '0.5';
  wordElement.draggable = false;
  checkAllBlanksFilled();
}

function checkAllBlanksFilled() {
  const submitBtn = document.querySelector('.btn-submit');
  const allFilled = Array.from(dropZones).every(zone => zone.textContent.trim() !== '');
  submitBtn.classList.toggle('filled', allFilled);
}

function submitAnswer() {
  const userAnswer = Array.from(dropZones).map(zone => zone.textContent.trim());
  const feedback = document.getElementById('feedback');

  if (userAnswer.some(word => word === '')) return;

  const isCorrect = JSON.stringify(userAnswer) === JSON.stringify(correctAnswer);

  dropZones.forEach((zone, index) => {
    const userWord = zone.textContent.trim();
    const correctWord = correctAnswer[index];
    zone.classList.remove('correct-answer', 'incorrect-answer');
    zone.classList.add(userWord === correctWord ? 'correct-answer' : 'incorrect-answer');
  });

  if (isCorrect) {
    draggableWords.forEach(word => {
      if (correctAnswer.includes(word.getAttribute('data-word'))) word.classList.add('correct');
    });
    const submitBtn = document.querySelector('.btn-submit');
    submitBtn.textContent = 'Next';
    submitBtn.onclick = nextSlide;
    submitBtn.style.background = '#df6565';
  }

  feedback.style.display = 'block';
  feedback.className = 'feedback ' + (isCorrect ? 'correct' : 'incorrect');
  feedback.innerHTML = isCorrect ? '🎉 Excellent!' : '❌ Not quite right. Try again!';

  draggableWords.forEach(word => { word.style.pointerEvents = 'none'; word.draggable = false; });
  dropZones.forEach(zone => zone.style.pointerEvents = 'none');
}

function tryAgain() {
  dropZones.forEach(zone => {
    zone.textContent = '';
    zone.className = 'drop-zone';
    zone.style.pointerEvents = 'auto';
  });

  draggableWords.forEach(word => {
    word.classList.remove('correct', 'incorrect');
    word.style.pointerEvents = 'auto';
    word.style.opacity = '1';
    word.draggable = true;
  });

  const submitBtn = document.querySelector('.btn-submit');
  submitBtn.classList.remove('filled');
  submitBtn.textContent = 'Submit Answer';
  submitBtn.onclick = submitAnswer;
  submitBtn.style.background = '';
  document.getElementById('feedback').style.display = 'none';
}

document.addEventListener('dragover', e => { if (!e.target.classList.contains('drop-zone')) e.preventDefault(); });
document.addEventListener('drop', e => { if (!e.target.classList.contains('drop-zone')) e.preventDefault(); });
