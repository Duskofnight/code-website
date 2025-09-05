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

  if (currentIndex < slides.length - 1) {
    let nextIndex = currentIndex + 1;
    window.location.hash = slides[nextIndex];
  }
}

function previousSlide() {
  let currentHash = window.location.hash || '#one';
  let currentIndex = slides.indexOf(currentHash);

  if (currentIndex > 0) {
    let prevIndex = currentIndex - 1;
    window.location.hash = slides[prevIndex];
  }
}

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

  // Get the single button (could be Submit/Try Again)
  const currentPage = quiz.closest('.page');
  const singleBtn = currentPage.querySelector('.btn, .btn-submit');

  if (!selectedAnswer) {
    // Show a message if no answer is selected
    feedback.style.display = 'block';
    feedback.className = 'feedback incorrect';
    feedback.innerHTML = '⚠️ Please select an answer first.';
    return;
  }

  // Show feedback and handle button transformation
  feedback.style.display = 'block';
  
  if (selectedAnswer === correctAnswer) {
    // Correct answer - highlight only selected answer in green
    options.forEach(option => {
      if (option.classList.contains('selected')) {
        option.classList.add('correct');
      }
      option.style.pointerEvents = 'none';
    });
    
    feedback.className = 'feedback correct';
    feedback.innerHTML = '🎉 Correct! Well done!';
    
    // Transform the single button to Next
    if (singleBtn) {
      singleBtn.textContent = 'Next';
      singleBtn.onclick = nextSlide;
      singleBtn.style.background = '#df6565';
      
      singleBtn.addEventListener('mouseenter', function() {
        this.style.background = '#b74444';
      });
      singleBtn.addEventListener('mouseleave', function() {
        this.style.background = '#df6565';
      });
    }
    
  } else {
    // Wrong answer - highlight only selected answer in red
    options.forEach(option => {
      if (option.classList.contains('selected')) {
        option.classList.add('incorrect');
      }
      // Don't disable interactions - they can try again
    });
    
    feedback.className = 'feedback incorrect';
    feedback.innerHTML = '❌ Incorrect. Try again!';
    
    // Transform the single button to Try Again
    if (singleBtn) {
      singleBtn.textContent = 'Try Again';
      singleBtn.onclick = function() { resetQuiz(quizId, correctAnswer, feedbackId); };
      
    }
  }
}

// Radio button quiz handler
function checkRadioAnswer(quizName, correctAnswer, feedbackId) {
  const selectedRadio = document.querySelector(`input[name="${quizName}"]:checked`);
  const feedback = document.getElementById(feedbackId);
  
  // Get the single button
  const currentPage = document.querySelector(`input[name="${quizName}"]`).closest('.page');
  const singleBtn = currentPage.querySelector('.btn, .btn-submit');
  
  if (!selectedRadio) {
    feedback.style.display = 'block';
    feedback.className = 'feedback incorrect';
    feedback.innerHTML = '⚠️ Please select an answer first.';
    return;
  }
  
  // Show feedback
  feedback.style.display = 'block';
  
  if (selectedRadio.value === correctAnswer) {
    // Disable all radio buttons
    const allRadios = document.querySelectorAll(`input[name="${quizName}"]`);
    allRadios.forEach(radio => radio.disabled = true);
    
    feedback.className = 'feedback correct';
    feedback.innerHTML = '🎉 Correct! The &lt;title&gt; tag is crucial for SEO!';
    
    // Transform the single button to Next
    if (singleBtn) {
      singleBtn.textContent = 'Next';
      singleBtn.onclick = nextSlide;
      singleBtn.style.background = '#df6565';
    }
    
  } else {
    feedback.className = 'feedback incorrect';
    feedback.innerHTML = '❌ Incorrect. Try again!';
    
    // Transform the single button to Try Again
    if (singleBtn) {
      singleBtn.textContent = 'Try Again';
      singleBtn.onclick = function() { resetRadioQuiz(quizName, correctAnswer, feedbackId); };
    }
  }
}

// Reset quiz functions
function resetQuiz(quizId, correctAnswer, feedbackId) {
  const quiz = document.getElementById(quizId);
  const feedback = document.getElementById(feedbackId);
  const options = quiz.querySelectorAll('[data-answer]');
  
  // Reset all options
  options.forEach(option => {
    option.classList.remove('selected', 'correct', 'incorrect');
    option.style.pointerEvents = 'auto';
  });
  
  // Reset the single button back to Submit
  const currentPage = quiz.closest('.page');
  const singleBtn = currentPage.querySelector('.btn, .btn-submit');
  
  if (singleBtn) {
    singleBtn.textContent = 'Submit Answer';
    singleBtn.onclick = function() { checkAnswer(quizId, correctAnswer, feedbackId); };
    singleBtn.style.background = '';
  }
  
  // Hide feedback
  feedback.style.display = 'none';
}

function resetRadioQuiz(quizName, correctAnswer, feedbackId) {
  const feedback = document.getElementById(feedbackId);
  const allRadios = document.querySelectorAll(`input[name="${quizName}"]`);
  
  // Reset all radio buttons
  allRadios.forEach(radio => {
    radio.checked = false;
    radio.disabled = false;
  });
  
  // Reset the single button
  const currentPage = allRadios[0].closest('.page');
  const singleBtn = currentPage.querySelector('.btn, .btn-submit');
  
  if (singleBtn) {
    singleBtn.textContent = 'Submit Answer';
    singleBtn.onclick = function() { checkRadioAnswer(quizName, correctAnswer, feedbackId); };
    singleBtn.style.background = '';
  }
  
  // Hide feedback
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

// Drag and drop functionality
let draggedElement = null;
let dropZones = null;
let draggableWords = null;
let correctAnswer = ['Search', 'Demand'];

// Initialize drag and drop when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  dropZones = document.querySelectorAll('.drop-zone');
  draggableWords = document.querySelectorAll('.draggable-word');
});

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
  
  if (ev.target.classList.contains('drop-zone')) {
    // If drop zone already has content, do nothing
    if (ev.target.textContent.trim()) {
      return;
    }
    
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
  if (!dropZones) return;
  
  const submitBtn = document.querySelector('.btn-submit');
  const allFilled = Array.from(dropZones).every(zone => zone.textContent.trim() !== '');
  
  if (submitBtn) {
    if (allFilled) {
      submitBtn.classList.add('filled');
    } else {
      submitBtn.classList.remove('filled');
    }
  }
}

function submitAnswer() {
  if (!dropZones || !draggableWords) return;
  
  const userAnswer = [];
  const feedback = document.getElementById('feedback');
  
  dropZones.forEach(zone => {
    userAnswer.push(zone.textContent.trim());
  });
  
  // Check if all blanks are filled
  if (userAnswer.some(word => word === '')) {
    feedback.style.display = 'block';
    feedback.className = 'feedback incorrect';
    feedback.innerHTML = '⚠️ Please fill in all blanks first.';
    return;
  }
  
  // Check answer
  const isCorrect = JSON.stringify(userAnswer) === JSON.stringify(correctAnswer);
  const submitBtn = document.querySelector('.btn-submit');
  
  // Show feedback
  feedback.style.display = 'block';
  
  if (isCorrect) {
    // Only highlight the drop zones as correct (green)
    dropZones.forEach(zone => {
      zone.classList.add('correct-answer');
    });
    
    feedback.className = 'feedback correct';
    feedback.innerHTML = '🎉 Excellent! You got it right!';
    
    // Transform submit button to Next button
    if (submitBtn) {
      submitBtn.textContent = 'Next';
      submitBtn.onclick = nextSlide;
      submitBtn.style.background = '#df6565';
      
      submitBtn.addEventListener('mouseenter', function() {
        this.style.background = '#b74444';
      });
      submitBtn.addEventListener('mouseleave', function() {
        this.style.background = '#df6565';
      });
    }
    
    // Disable all interactions after correct answer
    draggableWords.forEach(word => {
      word.style.pointerEvents = 'none';
      word.draggable = false;
    });
    
    dropZones.forEach(zone => {
      zone.style.pointerEvents = 'none';
    });
    
  } else {
    // Only highlight the drop zones as incorrect (red) - don't show correct answers
    dropZones.forEach(zone => {
      zone.classList.add('incorrect-answer');
    });
    
    feedback.className = 'feedback incorrect';
    feedback.innerHTML = '❌ Not quite right. Try again!';
    
    // Transform submit button to Try Again button
    if (submitBtn) {
      submitBtn.textContent = 'Try Again';
      submitBtn.onclick = tryAgain;
    }
  }
}

function tryAgain() {
  if (!dropZones || !draggableWords) return;
  
  // Reset all drop zones
  dropZones.forEach(zone => {
    zone.textContent = '';
    zone.classList.remove('filled', 'drag-over', 'correct-answer', 'incorrect-answer');
    zone.style.pointerEvents = 'auto';
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
  
  // Reset the single button back to Submit
  const singleBtn = document.querySelector('.btn-submit');
  if (singleBtn) {
    singleBtn.classList.remove('filled');
    singleBtn.textContent = 'Submit Answer';
    singleBtn.onclick = submitAnswer;
    singleBtn.style.background = '';
  }
  
  // Hide feedback
  const feedback = document.getElementById('feedback');
  if (feedback) {
    feedback.style.display = 'none';
  }
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