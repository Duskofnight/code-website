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

  // Show feedback and update button based on correctness
  feedback.style.display = 'block';
  const submitBtn = quiz.closest('.page').querySelector('.btn, .submit');
  
  if (selectedAnswer === correctAnswer) {
    feedback.className = 'feedback correct';
    feedback.innerHTML = '🎉 Correct! Well done!';
    
    // Change to Next button when correct
    submitBtn.textContent = 'Next';
    submitBtn.onclick = nextSlide;
    submitBtn.style.background = '#df6565';
    submitBtn.style.pointerEvents = 'auto';

    submitBtn.addEventListener('mouseenter', function() {
      this.style.background = '#b74444';
    });
    submitBtn.addEventListener('mouseleave', function() {
      this.style.background = '#df6565';  
    });
    
  } else {
    feedback.className = 'feedback incorrect';
    feedback.innerHTML = '❌ Incorrect.';
    
    // Change to Try Again button when wrong
    submitBtn.textContent = 'Try Again';
    submitBtn.onclick = function() { resetQuiz(quizId, feedbackId); };
    submitBtn.style.background = '#f44336';
    submitBtn.style.pointerEvents = 'auto';

    submitBtn.addEventListener('mouseenter', function() {
      this.style.background = '#d32f2f';
    });
    submitBtn.addEventListener('mouseleave', function() {
      this.style.background = '#f44336';  
    });
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
  
  // Show feedback and update button based on correctness
  feedback.style.display = 'block';
  const submitBtn = document.querySelector(`#${feedbackId}`).closest('.page').querySelector('.btn, .submit');
  
  if (selectedRadio.value === correctAnswer) {
    feedback.className = 'feedback correct';
    feedback.innerHTML = '🎉 Correct! The &lt;title&gt; tag is crucial for SEO!';
    
    // Change to Next button when correct
    submitBtn.textContent = 'Next';
    submitBtn.onclick = nextSlide;
    submitBtn.style.background = '#df6565';
    
  } else {
    feedback.className = 'feedback incorrect';
    feedback.innerHTML = '❌ Incorrect. The &lt;title&gt; tag is the most important for SEO.';
    
    // Change to Try Again button when wrong
    submitBtn.textContent = 'Try Again';
    submitBtn.onclick = function() { resetRadioQuiz(quizName, feedbackId); };
    submitBtn.style.background = '#f44336';
  }
}

// Drag and drop quiz handler
function submitAnswer() {
  const userAnswer = [];
  const feedback = document.getElementById('feedback');
  const correctAnswer = ['Search', 'Engine', 'Optimization'];
  
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
    
    if (userWord === correctWord) {
      zone.classList.add('correct-answer');
    } else {
      zone.classList.add('incorrect-answer');
    }
    
    zone.style.backgroundColor = '';
    zone.style.borderColor = '';
    zone.style.color = '';
  });
  
  // Show feedback and update button based on correctness
  feedback.style.display = 'block';
  const submitBtn = document.querySelector('.btn-submit');
  
  if (isCorrect) {
    feedback.className = 'feedback correct';
    feedback.innerHTML = '🎉 Excellent! SEO stands for Search Engine Optimization!';
    
    // Highlight correct words
    draggableWords.forEach(word => {
      const wordText = word.getAttribute('data-word');
      if (correctAnswer.includes(wordText)) {
        word.classList.add('correct');
      }
    });
    
    // Change to Next button when correct
    submitBtn.textContent = 'Next';
    submitBtn.onclick = nextSlide;
    submitBtn.style.background = '#df6565';
    
  } else {
    feedback.className = 'feedback incorrect';
    feedback.innerHTML = '❌ Not quite right. Try again!';
    
    // Change to Try Again button when wrong
    submitBtn.textContent = 'Try Again';
    submitBtn.onclick = tryAgain;
    submitBtn.style.background = '#f44336';
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

// Reset functions
function resetQuiz(quizId, feedbackId) {
  const quiz = document.getElementById(quizId);
  const feedback = document.getElementById(feedbackId);
  const options = quiz.querySelectorAll('[data-answer]');
  
  options.forEach(option => {
    option.classList.remove('selected', 'correct', 'incorrect');
    option.style.pointerEvents = 'auto';
  });
  
  // Reset submit button back to original state
  const submitBtn = quiz.closest('.page').querySelector('.btn, .submit');
  submitBtn.textContent = 'Submit Answer';
  submitBtn.onclick = function() { checkAnswer(quizId, 'a', feedbackId); }; // You'll need to pass the correct answer here
  submitBtn.style.background = '';
  feedback.style.display = 'none';
}

function resetRadioQuiz(quizName, feedbackId) {
  const allRadios = document.querySelectorAll(`input[name="${quizName}"]`);
  const feedback = document.getElementById(feedbackId);
  
  // Re-enable all radio buttons and uncheck them
  allRadios.forEach(radio => {
    radio.disabled = false;
    radio.checked = false;
  });
  
  // Reset submit button back to original state
  const submitBtn = feedback.closest('.page').querySelector('.btn, .submit');
  submitBtn.textContent = 'Submit Answer';
  submitBtn.onclick = function() { checkRadioAnswer(quizName, 'title', feedbackId); }; // You'll need to pass the correct answer here
  submitBtn.style.background = '';
  feedback.style.display = 'none';
}