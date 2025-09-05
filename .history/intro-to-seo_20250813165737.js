class LessonProgress {
    constructor() {
        this.storageKey = 'seo_course_progress';
        this.lessons = [
            'seo-introduction',
            'keyword-research', 
            'seo-quiz',
            'on-page-seo',
            'technical-seo',
            'off-page',
            'content-creation-seo',
            'seo-tools-and-analytics',
            'seo-best-practices',
            'seo-test'
        ];
        this.initializeProgress();
    }

    // Initialize progress from memory or set defaults
    initializeProgress() {
        const saved = this.getProgress();
        if (!saved) {
            // First lesson is always unlocked
            const initialProgress = {
                'seo-introduction': { unlocked: true, completed: false },
                'keyword-research': { unlocked: false, completed: false },
                'seo-quiz': { unlocked: false, completed: false },
                'on-page-seo': { unlocked: false, completed: false },
                'technical-seo': { unlocked: false, completed: false },
                'off-page': { unlocked: false, completed: false },
                'content-creation-seo': { unlocked: false, completed: false },
                'seo-tools-and-analytics': { unlocked: false, completed: false },
                'seo-best-practices': { unlocked: false, completed: false },
                'seo-test': { unlocked: false, completed: false }
            };
            this.saveProgress(initialProgress);
        }
    }

    // Get progress from memory (using a simple object since localStorage isn't available)
    getProgress() {
        if (typeof window !== 'undefined' && window.courseProgress) {
            return window.courseProgress;
        }
        return null;
    }

    // Save progress to memory
    saveProgress(progress) {
        if (typeof window !== 'undefined') {
            window.courseProgress = progress;
        }
    }

    // Mark a lesson as completed and unlock the next one
    completeLesson(lessonId) {
        const progress = this.getProgress();
        if (progress && progress[lessonId]) {
            progress[lessonId].completed = true;
            
            // Unlock next lesson
            const currentIndex = this.lessons.indexOf(lessonId);
            if (currentIndex >= 0 && currentIndex < this.lessons.length - 1) {
                const nextLesson = this.lessons[currentIndex + 1];
                if (progress[nextLesson]) {
                    progress[nextLesson].unlocked = true;
                }
            }
            
            this.saveProgress(progress);
            this.updateUI();
        }
    }

    // Check if a lesson is unlocked
    isUnlocked(lessonId) {
        const progress = this.getProgress();
        return progress && progress[lessonId] ? progress[lessonId].unlocked : false;
    }

    // Check if a lesson is completed
    isCompleted(lessonId) {
        const progress = this.getProgress();
        return progress && progress[lessonId] ? progress[lessonId].completed : false;
    }

    // Update the UI to reflect current progress
    updateUI() {
        const progress = this.getProgress();
        if (!progress) return;

        // Update lesson cards on the main course page
        Object.keys(progress).forEach(lessonId => {
            const lessonData = progress[lessonId];
            const lessonElements = document.querySelectorAll(`[href*="${lessonId}"]`);
            
            lessonElements.forEach(element => {
                const lessonCard = element.closest('.lesson, .quiz, .test');
                if (lessonCard) {
                    // Remove all status classes first
                    lessonCard.classList.remove('locked', 'completed', 'current');
                    
                    // Remove existing icons
                    const existingIcons = lessonCard.querySelectorAll('.lesson-checkmark, .lesson-lock');
                    existingIcons.forEach(icon => icon.remove());
                    
                    if (lessonData.completed) {
                        lessonCard.classList.add('completed');
                        // Add checkmark icon
                        const checkmark = document.createElement('div');
                        checkmark.className = 'lesson-checkmark';
                        checkmark.innerHTML = '✓';
                        lessonCard.appendChild(checkmark);
                    } else if (lessonData.unlocked) {
                        lessonCard.classList.add('current');
                    } else {
                        lessonCard.classList.add('locked');
                        // Add lock icon
                        const lock = document.createElement('div');
                        lock.className = 'lesson-lock';
                        lock.innerHTML = '🔒';
                        lessonCard.appendChild(lock);
                        
                        // Disable the link
                        element.style.pointerEvents = 'none';
                        element.addEventListener('click', (e) => {
                            e.preventDefault();
                            alert('Complete the previous lesson to unlock this one!');
                        });
                    }
                }
            });
        });
    }

    // Reset all progress (for testing purposes)
    resetProgress() {
        if (typeof window !== 'undefined') {
            delete window.courseProgress;
        }
        this.initializeProgress();
        this.updateUI();
    }
}

// Initialize the progress system
const progressManager = new LessonProgress();

// Function to be called when a lesson is completed
function markLessonComplete(lessonId) {
    progressManager.completeLesson(lessonId);
    
    // Show completion message
    const completionMessage = document.createElement('div');
    completionMessage.className = 'completion-message';
    completionMessage.innerHTML = `
        <div class="completion-content">
            <h3>🎉 Lesson Completed!</h3>
            <p>Great job! The next lesson has been unlocked.</p>
            <button onclick="this.parentElement.parentElement.remove()">Continue</button>
        </div>
    `;
    completionMessage.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    completionMessage.querySelector('.completion-content').style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 12px;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
    `;
    
    document.body.appendChild(completionMessage);
}

// Function to check if user can access a lesson
function checkLessonAccess(lessonId) {
    if (!progressManager.isUnlocked(lessonId)) {
        alert('Please complete the previous lessons to access this content.');
        window.location.href = '/intro-to-seo.html';
        return false;
    }
    return true;
}

// Initialize UI when page loads
document.addEventListener('DOMContentLoaded', function() {
    progressManager.updateUI();
});

// Export for use in lesson pages
if (typeof window !== 'undefined') {
    window.progressManager = progressManager;
    window.markLessonComplete = markLessonComplete;
    window.checkLessonAccess = checkLessonAccess;
}


























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
  
  // Check if we're on the final slide and mark lesson as complete
  if (hash === '#end') {
    setTimeout(() => {
      markLessonComplete('seo-introduction');
    }, 1000); // Small delay to let the user see the completion page
  }
}

function nextSlide() {
  let currentHash = window.location.hash || '#one';
  let currentIndex = slides.indexOf(currentHash);

  // Only move to next if not at the end
  if (currentIndex < slides.length - 1) {
    let nextIndex = currentIndex + 1;
    window.location.hash = slides[nextIndex];
  }
}

function previousSlide() {
  let currentHash = window.location.hash || '#one';
  let currentIndex = slides.indexOf(currentHash);

  // Only move to previous if not at the beginning
  if (currentIndex > 0) {
    let prevIndex = currentIndex - 1;
    window.location.hash = slides[prevIndex];
  }
}

// Check access when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Check if user has access to this lesson
  if (typeof checkLessonAccess !== 'undefined') {
    if (!checkLessonAccess('seo-introduction')) {
      return; // Will redirect if no access
    }
  }
  
  showPage();
});

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
    const submitBtn = document.querySelector('#seven .btn');
    submitBtn.textContent = 'Next';
    submitBtn.onclick = nextSlide;                              
    submitBtn.style.background = '#df6565';

    const tryAgainBtn = document.querySelector('#seven .submit');
    tryAgainBtn.style.display = 'none';
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