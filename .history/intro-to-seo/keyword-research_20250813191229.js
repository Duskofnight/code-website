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

  if (!selectedAnswer) {
    // Show a message if no answer is selected
    feedback.style.display = 'block';
    feedback.className = 'feedback incorrect';
    feedback.innerHTML = '⚠️ Please select an answer first.';
    return;
  }

  // Show results
  options.forEach(option => {
    option.style.pointerEvents = 'none';

    if (option.dataset.answer === correctAnswer) {
      // Always highlight the correct answer in green
      option.classList.add('correct');
    } else if (option.classList.contains('selected')) {
      // Highlight the selected wrong answer in red
      option.classList.add('incorrect');
    }
  });

  // Show feedback and handle button transformation
  feedback.style.display = 'block';
  if (selectedAnswer === correctAnswer) {
    feedback.className = 'feedback correct';
    feedback.innerHTML = '🎉 Correct! Well done!';
    
    // Find and transform the submit button for this quiz
    const currentPage = quiz.closest('.page');
    const submitBtn = currentPage.querySelector('.btn, .btn-submit');
    
    if (submitBtn) {
      // Store original button properties
      submitBtn.dataset.originalText = submitBtn.textContent;
      submitBtn.dataset.originalOnclick = submitBtn.getAttribute('onclick') || '';
      
      // Transform to Next button
      submitBtn.textContent = 'Next';
      submitBtn.onclick = nextSlide;
      submitBtn.style.background = '#df6565';
      
      // Add hover effects
      submitBtn.addEventListener('mouseenter', function() {
        this.style.background = '#b74444';
      });
      submitBtn.addEventListener('mouseleave', function() {
        this.style.background = '#df6565';
      });
    }
    
  } else {
    feedback.className = 'feedback incorrect';
    feedback.innerHTML = '❌ Incorrect. Try again!';
  }
}

// Radio button quiz handler
function checkRadioAnswer(quizName, correctAnswer, feedbackId) {
  const selectedRadio = document.querySelector(`input[name="${quizName}"]:checked`);
  const feedback = document.getElementById(feedbackId);
  
  if (!selectedRadio) {
    feedback.style.display = 'block';
    feedback.className = 'feedback incorrect';
    feedback.innerHTML = '⚠️ Please select an answer first.';
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
    
    // Transform submit button
    const currentPage = selectedRadio.closest('.page');
    const submitBtn = currentPage.querySelector('.btn, .btn-submit');
    
    if (submitBtn) {
      submitBtn.dataset.originalText = submitBtn.textContent;
      submitBtn.textContent = 'Next';
      submitBtn.onclick = nextSlide;
      submitBtn.style.background = '#df6565';
    }
    
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
  const currentPage = quiz.closest('.page');
  const submitBtn = currentPage.querySelector('.btn, .btn-submit');
  
  if (submitBtn && submitBtn.dataset.originalText) {
    submitBtn.textContent = submitBtn.dataset.originalText;
    
    // Restore original onclick if it existed
    if (submitBtn.dataset.originalOnclick) {
      submitBtn.setAttribute('onclick', submitBtn.dataset.originalOnclick);
    } else {
      submitBtn.onclick = function() { checkAnswer(quizId, 'a', feedbackId); };
    }
    
    submitBtn.style.background = '';
    submitBtn.removeEventListener('mouseenter', function() {});
    submitBtn.removeEventListener('mouseleave', function() {});
  }
  
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
  
  // Color the drop zones based on correctness
  dropZones.forEach((zone, index) => {
    const userWord = zone.textContent.trim();
    const correctWord = correctAnswer[index];
    
    zone.classList.remove('correct-answer', 'incorrect-answer');
    
    if (userWord === correctWord) {
      zone.classList.add('correct-answer');
    } else {
      zone.classList.add('incorrect-answer');
    }
  });
  
  // Highlight draggable words based on correctness
  draggableWords.forEach(word => {
    const wordText = word.getAttribute('data-word');
    word.classList.remove('correct', 'incorrect');
    
    if (correctAnswer.includes(wordText)) {
      word.classList.add('correct');
    } else {
      word.classList.add('incorrect');
    }
  });
  
  // Show feedback and handle button transformation
  feedback.style.display = 'block';
  const submitBtn = document.querySelector('.btn-submit');
  
  if (isCorrect) {
    feedback.className = 'feedback correct';
    feedback.innerHTML = '🎉 Excellent! You got it right!';
    
    // Transform submit button to Next button
    if (submitBtn) {
      submitBtn.dataset.originalText = submitBtn.textContent;
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
    
  } else {
    feedback.className = 'feedback incorrect';
    feedback.innerHTML = '❌ Not quite right. The correct answer is highlighted in green.';
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
  
  // Reset submit button back to original state
  const submitBtn = document.querySelector('.btn-submit');
  if (submitBtn) {
    submitBtn.classList.remove('filled');
    
    if (submitBtn.dataset.originalText) {
      submitBtn.textContent = submitBtn.dataset.originalText;
    } else {
      submitBtn.textContent = 'Submit Answer';
    }
    
    submitBtn.onclick = submitAnswer;
    submitBtn.style.background = '';
    
    // Remove event listeners
    submitBtn.removeEventListener('mouseenter', function() {});
    submitBtn.removeEventListener('mouseleave', function() {});
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