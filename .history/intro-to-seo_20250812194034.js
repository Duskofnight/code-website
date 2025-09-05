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


const lessonProgress = {
    completed: [], 
    current: 'introduction', 
    unlocked: ['introduction'] // Only first lesson unlocked initially
};

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
    if (!lessonProgress.completed.includes(lessonId)) {
        lessonProgress.completed.push(lessonId);

        const nextLesson = getNextLesson(lessonId);
        if (nextLesson && !lessonProgress.unlocked.includes(nextLesson)) {
            lessonProgress.unlocked.push(nextLesson);
        }

        if (nextLesson) {
            lessonProgress.current = nextLesson;
        }

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
            setTimeout(() => completeLesson(map[path]), 2000);
        }
    }
}

// Auto-complete on scroll bottom
function addScrollCompletion() {
    let hasCompletedFromScroll = false;
    window.addEventListener('scroll', function() {
        if (!hasCompletedFromScroll && (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
            hasCompletedFromScroll = true;
            autoCompleteBasedOnURL();
        }
    });
}