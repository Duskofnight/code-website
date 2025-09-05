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

// Auto-complete lessons when clicking on them
document.addEventListener('DOMContentLoaded', function() {
    const lessons = document.querySelectorAll('.lesson, .quiz, .test');
    lessons.forEach(lesson => {
        lesson.addEventListener('click', function(e) {
            const lessonId = getLessonId(lesson);
            if (lessonProgress.unlocked.includes(lessonId) && !lessonProgress.completed.includes(lessonId)) {
                // Complete lesson immediately when clicked
                completeLesson(lessonId);
            }
        });
    });
});

// Auto-complete based on current page URL
function autoCompleteBasedOnURL() {
    const currentURL = window.location.href;
    
    if (currentURL.includes('seo-introduction.html')) {
        setTimeout(() => completeLesson('introduction'), 2000);
    } else if (currentURL.includes('keyword-research.html')) {
        setTimeout(() => completeLesson('keyword'), 2000);
    } else if (currentURL.includes('seo-quiz.html')) {
        setTimeout(() => completeLesson('seo-quiz'), 2000);
    } else if (currentURL.includes('on-page-seo.html')) {
        setTimeout(() => completeLesson('on-page'), 2000);
    } else if (currentURL.includes('technical-seo.html')) {
        setTimeout(() => completeLesson('technical'), 2000);
    } else if (currentURL.includes('off-page.html')) {
        setTimeout(() => completeLesson('off-page'), 2000);
    } else if (currentURL.includes('content-creation-seo.html')) {
        setTimeout(() => completeLesson('content-creation'), 2000);
    } else if (currentURL.includes('seo-tools-and-analytics.html')) {
        setTimeout(() => completeLesson('tools'), 2000);
    } else if (currentURL.includes('seo-best-practices.html')) {
        setTimeout(() => completeLesson('best-practices'), 2000);
    } else if (currentURL.includes('seo-test')) {
        setTimeout(() => completeLesson('seo-test'), 2000);
    }
}

// Auto-complete when user scrolls to bottom of page
function addScrollCompletion() {
    let hasCompletedFromScroll = false;
    
    window.addEventListener('scroll', function() {
        if (!hasCompletedFromScroll && (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
            const currentURL = window.location.href;
            hasCompletedFromScroll = true;
            
            if (currentURL.includes('seo-introduction.html')) {
                completeLesson('introduction');
            } else if (currentURL.includes('keyword-research.html')) {
                completeLesson('keyword');
            } else if (currentURL.includes('seo-quiz.html')) {
                completeLesson('seo-quiz');
            } else if (currentURL.includes('on-page-seo.html')) {
                completeLesson('on-page');
            } else if (currentURL.includes('technical-seo.html')) {
                completeLesson('technical');
            } else if (currentURL.includes('off-page.html')) {
                completeLesson('off-page');
            } else if (currentURL.includes('content-creation-seo.html')) {
                completeLesson('content-creation');
            } else if (currentURL.includes('seo-tools-and-analytics.html')) {
                completeLesson('tools');
            } else if (currentURL.includes('seo-best-practices.html')) {
                completeLesson('best-practices');
            } else if (currentURL.includes('seo-test')) {
                completeLesson('seo-test');
            }
        }
    });
}

// Initialize auto-completion
document.addEventListener('DOMContentLoaded', function() {
    autoCompleteBasedOnURL();
    addScrollCompletion();
});