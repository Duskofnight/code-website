function myFunction() {
  const menu = document.getElementById("myLinks");
  const menuIcon = document.querySelector(".menu-icon");

  menu.classList.toggle("show");
  menuIcon.classList.toggle("active");
}



function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login-page.html";
}


// Lesson completion tracking
const lessonProgress = {
    completed: [], // No completed lessons initially
    current: 'introduction', // Start with first lesson
    unlocked: ['introduction'] // Only first lesson unlocked initially
};

// Initialize lesson states on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeLessonStates();
});

function initializeLessonStates() {
    // Clear existing icons first
    document.querySelectorAll('.lesson-checkmark, .lesson-lock').forEach(icon => icon.remove());
    
    const lessons = document.querySelectorAll('.lesson, .quiz, .test');
    
    lessons.forEach(lesson => {
        const lessonId = getLessonId(lesson);
        
        // Remove existing classes
        lesson.classList.remove('completed', 'locked', 'unlocked', 'current');
        lesson.style.pointerEvents = '';
        
        // Add completion status
        if (lessonProgress.completed.includes(lessonId)) {
            lesson.classList.add('completed');
            addCheckmark(lesson);
        } else if (lessonProgress.unlocked.includes(lessonId)) {
            lesson.classList.add('unlocked');
        } else {
            lesson.classList.add('locked');
            addLockIcon(lesson);
            // Disable clicking on locked lessons
            const parentLink = lesson.closest('a');
            if (parentLink) {
                parentLink.style.pointerEvents = 'none';
            } else {
                lesson.style.pointerEvents = 'none';
            }
        }
        
        // Mark current lesson
        if (lessonProgress.current === lessonId) {
            lesson.classList.add('current');
        }
    });
}

function getLessonId(lesson) {
    // Check class names first
    const classList = Array.from(lesson.classList);
    
    if (classList.includes('introduction')) return 'introduction';
    if (classList.includes('keyword')) return 'keyword';
    if (classList.includes('on-page')) return 'on-page';
    if (classList.includes('technical')) return 'technical';
    if (classList.includes('off-page')) return 'off-page';
    if (classList.includes('content-creation')) return 'content-creation';
    if (classList.includes('tools')) return 'tools';
    if (classList.includes('best-practices')) return 'best-practices';
    
    // Check if it's a quiz or test by looking at parent link
    const parentLink = lesson.closest('a');
    if (parentLink) {
        const href = parentLink.getAttribute('href') || '';
        if (href.includes('seo-quiz')) return 'seo-quiz';
        if (href.includes('seo-test')) return 'seo-test';
    }
    
    // Check if lesson is inside quiz/test div without link
    if (lesson.classList.contains('quiz')) return 'seo-quiz';
    if (lesson.classList.contains('test')) return 'seo-test';
    
    return 'unknown';
}

function addCheckmark(lesson) {
    const checkmark = document.createElement('span');
    checkmark.className = 'lesson-checkmark';
    checkmark.innerHTML = '✓';
    lesson.appendChild(checkmark);
}

function addLockIcon(lesson) {
    const lockIcon = document.createElement('span');
    lockIcon.className = 'lesson-lock';
    lockIcon.innerHTML = '🔒';
    lesson.appendChild(lockIcon);
}

// Function to complete a lesson (call this when user finishes a lesson)
function completeLesson(lessonId) {
    console.log('Completing lesson:', lessonId);
    
    if (!lessonProgress.completed.includes(lessonId)) {
        lessonProgress.completed.push(lessonId);
        
        // Unlock next lesson
        const nextLesson = getNextLesson(lessonId);
        if (nextLesson && !lessonProgress.unlocked.includes(nextLesson)) {
            lessonProgress.unlocked.push(nextLesson);
            console.log('Unlocked next lesson:', nextLesson);
        }
        
        // Update current lesson to next
        if (nextLesson) {
            lessonProgress.current = nextLesson;
        }
        
        // Re-initialize states
        initializeLessonStates();
        console.log('Lesson progress updated:', lessonProgress);
    }
}

function getNextLesson(currentLessonId) {
    const lessonOrder = [
        'introduction', 'keyword', 'seo-quiz',
        'on-page', 'technical',
        'off-page', 'content-creation',
        'tools', 'best-practices', 'seo-test'
    ];
    
    const currentIndex = lessonOrder.indexOf(currentLessonId);
    return currentIndex !== -1 && currentIndex < lessonOrder.length - 1 
        ? lessonOrder[currentIndex + 1] 
        : null;
}

// Test function - you can call this in console to test
function testCompleteLesson() {
    completeLesson('introduction');
}

// Add click listeners to lessons for testing
document.addEventListener('DOMContentLoaded', function() {
    const lessons = document.querySelectorAll('.lesson, .quiz, .test');
    lessons.forEach(lesson => {
        lesson.addEventListener('click', function(e) {
            const lessonId = getLessonId(lesson);
            if (lessonProgress.unlocked.includes(lessonId) && !lessonProgress.completed.includes(lessonId)) {
                // For testing - complete lesson on click if it's unlocked
                // Remove this in production
                setTimeout(() => {
                    completeLesson(lessonId);
                }, 1000); // Simulate lesson completion after 1 second
            }
        });
    });
});