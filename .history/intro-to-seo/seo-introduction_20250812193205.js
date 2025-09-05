const slides = ['#one', '#two', '#three', '#four', '#five', '#six', '#seven', '#eight', '#nine', '#ten', '#end'];

function updateProgressBar() {
  let currentHash = window.location.hash || '#one';
  let currentIndex = slides.indexOf(currentHash);
  
  // Calculate progress percentage
  let progress = ((currentIndex + 1) / slides.length) * 100;
  
  // Update the progress bar width
  const progressFill = document.getElementById('progressFill');
  if (progressFill) {
    progressFill.style.width = progress + '%';
  }
}

function showPage() {
  let hash = window.location.hash || '#one';

  // Hide all pages
  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));

  // Show the current page
  const currentPage = document.querySelector(hash);
  if (currentPage) currentPage.classList.add('active');
  
  // Update progress bar
  updateProgressBar();
}

function nextSlide() {
  let currentHash = window.location.hash || '#one';
  let currentIndex = slides.indexOf(currentHash);

  // FIXED: Only move to next if not at the end
  if (currentIndex < slides.length - 1) {
    let nextIndex = currentIndex + 1;
    window.location.hash = slides[nextIndex];
  }
  // If at the end, you could redirect somewhere or do nothing
  // For now, it will just stay on the current slide
}

function previousSlide() {
  let currentHash = window.location.hash || '#one';
  let currentIndex = slides.indexOf(currentHash);

  // FIXED: Only move to previous if not at the beginning
  if (currentIndex > 0) {
    let prevIndex = currentIndex - 1;
    window.location.hash = slides[prevIndex];
  }
}

// IMPROVED: Use DOMContentLoaded for better loading
document.addEventListener('DOMContentLoaded', showPage);
window.addEventListener('hashchange', showPage);

// Card-based and Pill-based quiz handler
function checkAnswer(quizId, correctAnswer, feedbackId) {
  const quiz = document.getElementById(quizId);
  const feedback = document.getElementById(feedbackId);
  const options = quiz.querySelectorAll('[data-answer]');
  let selectedAnswer = null;

  // Find selected answer
  options.forEach(option => {
    if (option.classList.contains('selected')) {
      selectedAnswer = option.dataset.answer;
    }
  });

  if (!selectedAnswer) {
    return;
  }

  // Show results
  options.forEach(option => {
    option.style.pointerEvents = 'none';

    if (selectedAnswer === correctAnswer) {
      // Only highlight the correct answer
      if (option.dataset.answer === correctAnswer) {
        option.classList.add('correct');
      }
    } else {
      // Only highlight the selected wrong answer
      if (option.classList.contains('selected')) {
        option.classList.add('incorrect');
      }
    }
  });

  // Show feedback
  feedback.style.display = 'block';
  if (selectedAnswer === correctAnswer) {
    feedback.className = 'feedback correct';
    feedback.innerHTML = '🎉 Correct! Well done!';
    
    // Change submit button to next button when correct
  showCenteredNextButton();

    submitBtn.addEventListener('mouseenter', function() {
      this.style.background = '#b74444';
    });
    submitBtn.addEventListener('mouseleave', function() {
      this.style.background = '#df6565';  
    });
    
  } else {
    feedback.className = 'feedback incorrect';
    feedback.innerHTML = '❌ Incorrect.';
  }
}

// Radio button quiz handler
function checkRadioAnswer(quizName, correctAnswer, feedbackId) {
  const selectedRadio = document.querySelector(`input[name="${quizName}"]:checked`);
  const feedback = document.getElementById(feedbackId);
  
  if (!selectedRadio) {
    return;
  }
  
  // Disable all radio buttons
  const allRadios = document.querySelectorAll(`input[name="${quizName}"]`);
  allRadios.forEach(radio => radio.disabled = true);
  
  // Show feedback
  feedback.style.display = 'block';
  if (selectedRadio.value === correctAnswer) {
    feedback.className = 'feedback correct';
    feedback.innerHTML = '🎉 Correct! The &lt;title&gt; tag is crucial for SEO!';
  } else {
    feedback.className = 'feedback incorrect';
    feedback.innerHTML = '❌ Incorrect. The &lt;title&gt; tag is the most important for SEO.';
  }
}

// Reset quiz functions
function resetQuiz(quizId, feedbackId) {
  const quiz = document.getElementById(quizId);
  const feedback = document.getElementById(feedbackId);
  const options = quiz.querySelectorAll('[data-answer]');
  
  options.forEach(option => {
    option.classList.remove('selected', 'correct', 'incorrect');
    option.style.pointerEvents = 'auto';
  });
  
  // Reset submit button back to original state
  const submitBtn = document.querySelector('#eight .btn');
  submitBtn.textContent = 'Submit Answer';
  submitBtn.onclick = function() { checkAnswer('quiz1', 'a', 'feedback1'); };
  submitBtn.style.background = '';
  
  feedback.style.display = 'none';
}

// Add click handlers for card and pill options
document.addEventListener('DOMContentLoaded', function() {
  // Card options
  document.querySelectorAll('.option-card').forEach(card => {
    card.addEventListener('click', function() {
      // Remove selection from siblings
      this.parentElement.querySelectorAll('.option-card').forEach(c => 
        c.classList.remove('selected')
      );
      // Add selection to clicked card
      this.classList.add('selected');
    });
  });
  
  // Pill options
  document.querySelectorAll('.option-pill').forEach(pill => {
    pill.addEventListener('click', function() {
      // Remove selection from siblings
      this.parentElement.querySelectorAll('.option-pill').forEach(p => 
        p.classList.remove('selected')
      );
      // Add selection to clicked pill
      this.classList.add('selected');
    });
  });
});

let draggedElement = null;
let dropZones = document.querySelectorAll('.drop-zone');
let draggableWords = document.querySelectorAll('.draggable-word');
const correctAnswer = ['Search', 'Engine', 'Optimization'];

function allowDrop(ev) {
  ev.preventDefault();
  if (ev.target.classList.contains('drop-zone')) {
    ev.target.classList.add('drag-over');
  }
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
    if (word && draggedElement) {
      placeWordInDropZone(ev.target, word, draggedElement);
    }
  }
  draggedElement = null;
}

function clickWord(wordElement) {
  if (wordElement.style.pointerEvents === 'none') return;
  
  const word = wordElement.getAttribute('data-word');
  const emptyDropZone = Array.from(dropZones).find(zone => !zone.textContent.trim());
  
  if (emptyDropZone) {
    placeWordInDropZone(emptyDropZone, word, wordElement);
  }
}

function placeWordInDropZone(dropZone, word, wordElement) {
  dropZone.textContent = word;
  dropZone.classList.add('filled');
  wordElement.style.pointerEvents = 'none';
  wordElement.style.opacity = '0.5';
  wordElement.draggable = false;
  
  // Check if all blanks are filled and update submit button
  checkAllBlanksFilled();
}

function checkAllBlanksFilled() {
  const submitBtn = document.querySelector('.btn-submit');
  const allFilled = Array.from(dropZones).every(zone => zone.textContent.trim() !== '');
  
  if (allFilled) {
    submitBtn.classList.add('filled');
  } else {
    submitBtn.classList.remove('filled');
  }
}

function submitAnswer() {
  const userAnswer = [];
  const feedback = document.getElementById('feedback');
  
  dropZones.forEach(zone => {
    userAnswer.push(zone.textContent.trim());
  });
  
  // Check if all blanks are filled
  if (userAnswer.some(word => word === '')) {
    return;
  }
  
  // Check answer
  const isCorrect = JSON.stringify(userAnswer) === JSON.stringify(correctAnswer);
  
  // Color the drop zones based on correctness
  dropZones.forEach((zone, index) => {
    const userWord = zone.textContent.trim();
    const correctWord = correctAnswer[index];
    
    // Keep the 'filled' class and add result classes
    if (userWord === correctWord) {
      zone.classList.add('correct-answer');
    } else {
      zone.classList.add('incorrect-answer');
    }
    
    // Remove any inline styles that might override our CSS
    zone.style.backgroundColor = '';
    zone.style.borderColor = '';
    zone.style.color = '';
  });
  
  // Only show green on words if completely correct answer
  if (isCorrect) {
    draggableWords.forEach(word => {
      const wordText = word.getAttribute('data-word');
      if (correctAnswer.includes(wordText)) {
        word.classList.add('correct');
      }
    });
    
    // Change submit button to next button when correct
    const submitBtn = document.querySelector('.btn-submit');
    submitBtn.textContent = 'Next';
    submitBtn.onclick = nextSlide;
    submitBtn.style.background = '#df6565';


  }
  
  // Show feedback
  feedback.style.display = 'block';
  if (isCorrect) {
    feedback.className = 'feedback correct';
    feedback.innerHTML = '🎉 Excellent! SEO stands for Search Engine Optimization!';
  } else {
    feedback.className = 'feedback incorrect';
    feedback.innerHTML = '❌ Not quite right. Try again!';
  }
  
  // Disable all interactions after submit
  draggableWords.forEach(word => {
    word.style.pointerEvents = 'none';
    word.draggable = false;
  });
  
  dropZones.forEach(zone => {
    zone.style.pointerEvents = 'none';
  });
}

function tryAgain() {
  // Reset all drop zones
  dropZones.forEach(zone => {
    zone.textContent = '';
    zone.classList.remove('filled', 'drag-over', 'correct-answer', 'incorrect-answer');
    zone.style.pointerEvents = 'auto';
    // Remove inline styles to let CSS take over
    zone.style.backgroundColor = '';
    zone.style.borderColor = '';
    zone.style.color = '';
  });
  
  // Reset all draggable words
  draggableWords.forEach(word => {
    word.classList.remove('correct', 'incorrect');
    word.style.pointerEvents = 'auto';
    word.style.opacity = '1';
    word.draggable = true;
  });
  
  // Reset submit button back to original state
  const submitBtn = document.querySelector('.btn-submit');
  submitBtn.classList.remove('filled');
  submitBtn.textContent = 'Submit Answer';
  submitBtn.onclick = submitAnswer;
  submitBtn.style.background = '';
  
  // Hide feedback
  document.getElementById('feedback').style.display = 'none';
}

// Prevent default drag behaviors on the container to avoid glitches
document.addEventListener('dragover', function(e) {
  if (!e.target.classList.contains('drop-zone')) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "none";
  }
});

document.addEventListener('drop', function(e) {
  if (!e.target.classList.contains('drop-zone')) {
    e.preventDefault();
  }
});


function showCenteredNextButton() {
  const container = document.querySelector('.action-buttons');
  if (!container) return;

  container.innerHTML = ''; // remove all buttons

  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Next';
  nextBtn.className = 'btn btn-next'; // you can style this in CSS
  nextBtn.onclick = nextSlide;

  container.style.display = 'flex';
  container.style.justifyContent = 'center';
  container.appendChild(nextBtn);
}