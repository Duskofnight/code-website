// Load progress from localStorage or use defaults
function loadLessonProgress() {
    const saved = localStorage.getItem('lessonProgress');
    if (saved) {
        return JSON.parse(saved);
    }
    return {
        completed: [], 
        current: 'introduction', 
        unlocked: ['introduction'] // Only first lesson unlocked initially
    };
}

// Save progress to localStorage
function saveLessonProgress() {
    localStorage.setItem('lessonProgress', JSON.stringify(lessonProgress));
}

// Initialize with saved progress
let lessonProgress = loadLessonProgress();

function myFunction() {
  const menu = document.getElementById("myLinks");
  const menuIcon = document.querySelector(".menu-icon");

  menu.classList.toggle("show");
  menuIcon.classList.toggle("active");
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("lessonProgress"); // Also clear lesson progress on logout
  window.location.href = "/login-page.html";
}

document.addEventListener('DOMContentLoaded', function() {
    initializeLessonStates();
    autoCompleteBasedOnURL();
    addScrollCompletion();
});

// Initialize lesson states
function initializeLessonStates() {
    document.querySelectorAll('.lesson-checkmark, .lesson-lock').forEach(icon => icon.remove());
    
    const lessons = document.querySelectorAll('.lesson, .quiz, .test');
    
    lessons.forEach(lesson => {
        const lessonId = getLessonId(lesson);

        lesson.classList.remove('completed', 'locked', 'unlocked', 'current');
        lesson.style.pointerEvents = '';

        if (lessonProgress.completed.includes(lessonId)) {
            lesson.classList.add('completed');
            addCheckmark(lesson);
        } 
        else if (lessonProgress.unlocked.includes(lessonId)) {
            lesson.classList.add('unlocked');
        } 
        else {
            lesson.classList.add('locked');
            addLockIcon(lesson);
            const parentLink = lesson.closest('a');
            if (parentLink) parentLink.style.pointerEvents = 'none';
            else lesson.style.pointerEvents = 'none';
        }

        if (lessonProgress.current === lessonId) {
            lesson.classList.add('current');
        }
    });
}

// Get lesson ID from element
function getLessonId(lesson) {
    const classList = Array.from(lesson.classList);
    const idMap = {
        'introduction': 'introduction',
        'keyword': 'keyword',
        'on-page': 'on-page',
        'technical': 'technical',
        'off-page': 'off-page',
        'content-creation': 'content-creation',
        'tools': 'tools',
        'best-practices': 'best-practices'
    };

    for (let key in idMap) {
        if (classList.includes(key)) return idMap[key];
    }

    const parentLink = lesson.closest('a');
    if (parentLink) {
        const href = parentLink.getAttribute('href') || '';
        if (href.includes('seo-quiz')) return 'seo-quiz';
        if (href.includes('seo-test')) return 'seo-test';
    }
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

function completeLesson(lessonId) {
    console.log('Attempting to complete lesson:', lessonId); // Debug log
    
    if (!lessonProgress.completed.includes(lessonId)) {
        lessonProgress.completed.push(lessonId);

        const nextLesson = getNextLesson(lessonId);
        if (nextLesson && !lessonProgress.unlocked.includes(nextLesson)) {
            lessonProgress.unlocked.push(nextLesson);
            console.log('Unlocked next lesson:', nextLesson); // Debug log
        }

        if (nextLesson) {
            lessonProgress.current = nextLesson;
        }

        // SAVE TO LOCALSTORAGE
        saveLessonProgress();
        console.log('Saved progress:', lessonProgress); // Debug log

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
    return (currentIndex !== -1 && currentIndex < lessonOrder.length - 1) 
        ? lessonOrder[currentIndex + 1] 
        : null;
}

// Auto-complete by URL
function autoCompleteBasedOnURL() {
    const map = {
        'seo-introduction.html': 'introduction',
        'keyword-research.html': 'keyword',
        'seo-quiz.html': 'seo-quiz',
        'on-page-seo.html': 'on-page',
        'technical-seo.html': 'technical',
        'off-page.html': 'off-page',
        'content-creation-seo.html': 'content-creation',
        'seo-tools-and-analytics.html': 'tools',
        'seo-best-practices.html': 'best-practices',
        'seo-test': 'seo-test'
    };

    const currentURL = window.location.href;
    for (let path in map) {
        if (currentURL.includes(path)) {
            console.log('Auto-completing lesson for URL:', path); // Debug log
            setTimeout(() => completeLesson(map[path]), 2000);
            break; // Add break to avoid multiple matches
        }
    }
}

// Auto-complete on scroll bottom
function addScrollCompletion() {
    let hasCompletedFromScroll = false;
    window.addEventListener('scroll', function() {
        if (!hasCompletedFromScroll && (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
            hasCompletedFromScroll = true;
            console.log('Completed lesson via scroll'); // Debug log
            autoCompleteBasedOnURL();
        }
    });
}

// Optional: Add manual complete button for testing
function addTestButton() {
    const button = document.createElement('button');
    button.textContent = 'Complete Current Lesson (Test)';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = '9999';
    button.style.padding = '10px';
    button.style.backgroundColor = '#007cba';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.onclick = function() {
        const currentURL = window.location.href;
        const map = {
            'seo-introduction.html': 'introduction',
            'keyword-research.html': 'keyword',
            'seo-quiz.html': 'seo-quiz',
            'on-page-seo.html': 'on-page',
            'technical-seo.html': 'technical',
            'off-page.html': 'off-page',
            'content-creation-seo.html': 'content-creation',
            'seo-tools-and-analytics.html': 'tools',
            'seo-best-practices.html': 'best-practices',
            'seo-test': 'seo-test'
        };
        
        for (let path in map) {
            if (currentURL.includes(path)) {
                completeLesson(map[path]);
                break;
            }
        }
    };
    document.body.appendChild(button);
}


// addTestButton();