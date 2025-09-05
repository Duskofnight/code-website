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
    completed: ['introduction', 'keyword'], // Example completed lessons
    current: 'on-page', // Current lesson
    unlocked: ['introduction', 'keyword', 'seo-quiz', 'on-page'] // Unlocked lessons
};

// Initialize lesson states on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeLessonStates();
});

function initializeLessonStates() {
    const lessons = document.querySelectorAll('.lesson, .quiz, .test');
    
    lessons.forEach(lesson => {
        const lessonId = getLessonId(lesson);
        
        // Add completion status
        if (lessonProgress.completed.includes(lessonId)) {
            lesson.classList.add('completed');
            addCheckmark(lesson);
        } else if (lessonProgress.unlocked.includes(lessonId)) {
            lesson.classList.add('unlocked');
        } else {
            lesson.classList.add('locked');
            addLockIcon(lesson);
            lesson.style.pointerEvents = 'none';
        }
        
        // Mark current lesson
        if (lessonProgress.current === lessonId) {
            lesson.classList.add('current');
        }
    });
}

function getLessonId(lesson) {
    // Extract lesson ID from class names or href
    if (lesson.classList.contains('introduction')) return 'introduction';
    if (lesson.classList.contains('keyword')) return 'keyword';
    if (lesson.classList.contains('on-page')) return 'on-page';
    if (lesson.classList.contains('technical')) return 'technical';
    if (lesson.classList.contains('off-page')) return 'off-page';
    if (lesson.classList.contains('content-creation')) return 'content-creation';
    if (lesson.classList.contains('tools')) return 'tools';
    if (lesson.classList.contains('best-practices')) return 'best-practices';
    
    // For quiz and test
    const parent = lesson.closest('a');
    if (parent && parent.href.includes('seo-quiz')) return 'seo-quiz';
    if (parent && parent.href.includes('seo-test')) return 'seo-test';
    
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
    if (!lessonProgress.completed.includes(lessonId)) {
        lessonProgress.completed.push(lessonId);
        
        // Unlock next lesson
        const nextLesson = getNextLesson(lessonId);
        if (nextLesson && !lessonProgress.unlocked.includes(nextLesson)) {
            lessonProgress.unlocked.push(nextLesson);
        }
        
        // Re-initialize states
        initializeLessonStates();
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