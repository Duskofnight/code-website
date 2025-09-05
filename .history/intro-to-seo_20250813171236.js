import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yzaspqdhudutgsnovwyl.supabase.co'
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'
const supabase = createClient(supabaseUrl, supabaseKey)












function loadLessonProgress() {
    const saved = localStorage.getItem('lessonProgress');
    console.log('Raw localStorage data:', saved);
    if (saved) {
        const parsed = JSON.parse(saved);
        console.log('Parsed progress:', parsed);
        return parsed;
    }
    const defaultProgress = {
        completed: [], 
        current: 'introduction', 
        unlocked: ['introduction']
    };
    console.log('Using default progress:', defaultProgress);
    return defaultProgress;
}

// Save progress to localStorage
function saveLessonProgress() {
    localStorage.setItem('lessonProgress', JSON.stringify(lessonProgress));
    console.log('Saved to localStorage:', lessonProgress);
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
  localStorage.removeItem("lessonProgress");
  window.location.href = "/login-page.html";
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    console.log('Current URL:', window.location.href);
    console.log('Current pathname:', window.location.pathname);
    console.log('Current progress:', lessonProgress);
    
    initializeLessonStates();
    
    // Try auto-completion immediately and after a short delay
    autoCompleteBasedOnURL();
    setTimeout(() => {
        console.log('Secondary auto-complete check...');
        autoCompleteBasedOnURL();
    }, 1000);
    
    addScrollCompletion();
    
    // Add the test button for debugging
    addTestButton();
});

// Initialize lesson states
function initializeLessonStates() {
    console.log('Initializing lesson states with progress:', lessonProgress);
    
    // Remove existing icons
    document.querySelectorAll('.lesson-checkmark, .lesson-lock').forEach(icon => {
        icon.remove();
        console.log('Removed existing icon');
    });
    
    const lessons = document.querySelectorAll('.lesson, .quiz, .test');
    console.log('Found lessons:', lessons.length);
    
    lessons.forEach(lesson => {
        const lessonId = getLessonId(lesson);
        console.log('Processing lesson:', lessonId, lesson);

        // Reset classes
        lesson.classList.remove('completed', 'locked', 'unlocked', 'current');
        lesson.style.pointerEvents = '';
        
        // Reset parent link pointer events
        const parentLink = lesson.closest('a');
        if (parentLink) {
            parentLink.style.pointerEvents = '';
        }

        if (lessonProgress.completed.includes(lessonId)) {
            console.log('Lesson is completed:', lessonId);
            lesson.classList.add('completed');
            addCheckmark(lesson);
        } 
        else if (lessonProgress.unlocked.includes(lessonId)) {
            console.log('Lesson is unlocked:', lessonId);
            lesson.classList.add('unlocked');
        } 
        else {
            console.log('Lesson is locked:', lessonId);
            lesson.classList.add('locked');
            addLockIcon(lesson);
            if (parentLink) {
                parentLink.style.pointerEvents = 'none';
            } else {
                lesson.style.pointerEvents = 'none';
            }
        }

        if (lessonProgress.current === lessonId) {
            lesson.classList.add('current');
            console.log('Set as current lesson:', lessonId);
        }
    });
}

// Get lesson ID from element
function getLessonId(lesson) {
    const classList = Array.from(lesson.classList);
    console.log('Getting lesson ID for classes:', classList);
    
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
        if (classList.includes(key)) {
            console.log('Found lesson ID by class:', idMap[key]);
            return idMap[key];
        }
    }

    const parentLink = lesson.closest('a');
    if (parentLink) {
        const href = parentLink.getAttribute('href') || '';
        console.log('Checking parent link href:', href);
        if (href.includes('seo-quiz')) return 'seo-quiz';
        if (href.includes('seo-test')) return 'seo-test';
    }
    
    if (lesson.classList.contains('quiz')) {
        console.log('Found quiz by class');
        return 'seo-quiz';
    }
    if (lesson.classList.contains('test')) {
        console.log('Found test by class');
        return 'seo-test';
    }
    
    console.log('Could not determine lesson ID, returning unknown');
    return 'unknown';
}

function addCheckmark(lesson) {
    const checkmark = document.createElement('span');
    checkmark.className = 'lesson-checkmark';
    checkmark.innerHTML = '✓';
    checkmark.style.color = 'green';
    checkmark.style.fontWeight = 'bold';
    checkmark.style.marginLeft = '10px';
    lesson.appendChild(checkmark);
    console.log('Added checkmark to lesson');
}

function addLockIcon(lesson) {
    const lockIcon = document.createElement('span');
    lockIcon.className = 'lesson-lock';
    lockIcon.innerHTML = '🔒';
    lockIcon.style.marginLeft = '10px';
    lesson.appendChild(lockIcon);
    console.log('Added lock icon to lesson');
}

function completeLesson(lessonId) {
    console.log('=== COMPLETING LESSON ===');
    console.log('Lesson ID:', lessonId);
    console.log('Current progress before:', lessonProgress);
    
    if (!lessonProgress.completed.includes(lessonId)) {
        lessonProgress.completed.push(lessonId);
        console.log('Added to completed:', lessonId);

        const nextLesson = getNextLesson(lessonId);
        console.log('Next lesson should be:', nextLesson);
        
        if (nextLesson && !lessonProgress.unlocked.includes(nextLesson)) {
            lessonProgress.unlocked.push(nextLesson);
            console.log('Unlocked next lesson:', nextLesson);
        }

        if (nextLesson) {
            lessonProgress.current = nextLesson;
            console.log('Set current to:', nextLesson);
        }

        // SAVE TO LOCALSTORAGE
        saveLessonProgress();
        console.log('Progress after completion:', lessonProgress);

        // Refresh the UI
        initializeLessonStates();
        
        console.log('=== LESSON COMPLETION DONE ===');
    } else {
        console.log('Lesson already completed:', lessonId);
    }
}

function getNextLesson(currentLessonId) {
    const lessonOrder = [
        'introduction', 'keyword', 'seo-quiz',
        'on-page', 'technical',
        'off-page', 'content-creation',
        'tools', 'best-practices', 'seo-test'
    ];
    
    console.log('Finding next lesson for:', currentLessonId);
    console.log('Lesson order:', lessonOrder);
    
    const currentIndex = lessonOrder.indexOf(currentLessonId);
    console.log('Current index:', currentIndex);
    
    const nextLesson = (currentIndex !== -1 && currentIndex < lessonOrder.length - 1) 
        ? lessonOrder[currentIndex + 1] 
        : null;
        
    console.log('Next lesson will be:', nextLesson);
    return nextLesson;
}

// Auto-complete by URL
function autoCompleteBasedOnURL() {
    console.log('=== AUTO COMPLETE BY URL ===');
    
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
    console.log('Current URL:', currentURL);
    console.log('URL mapping:', map);
    
    let foundLesson = null;
    
    // Check each path in the URL
    for (let path in map) {
        if (currentURL.includes(path)) {
            foundLesson = map[path];
            console.log('Found matching path:', path, '-> lesson:', foundLesson);
            break;
        }
    }
    
    // Also check the pathname only (in case of full URLs)
    if (!foundLesson) {
        const pathname = window.location.pathname;
        console.log('Checking pathname:', pathname);
        
        for (let path in map) {
            if (pathname.includes(path)) {
                foundLesson = map[path];
                console.log('Found matching path in pathname:', path, '-> lesson:', foundLesson);
                break;
            }
        }
    }
    
    if (foundLesson) {
        // Check if lesson is already completed
        if (lessonProgress.completed.includes(foundLesson)) {
            console.log('Lesson already completed:', foundLesson);
            return;
        }
        
        // Check if lesson is unlocked
        if (!lessonProgress.unlocked.includes(foundLesson)) {
            console.log('Lesson is locked, cannot complete:', foundLesson);
            return;
        }
        
        console.log('Will complete lesson in 2 seconds:', foundLesson);
        setTimeout(() => {
            console.log('Executing delayed completion for:', foundLesson);
            completeLesson(foundLesson);
        }, 2000);
    } else {
        console.log('No matching URL found for auto-completion');
    }
}

// Auto-complete on scroll bottom
function addScrollCompletion() {
    console.log('Setting up scroll completion');
    let hasCompletedFromScroll = false;
    
    window.addEventListener('scroll', function() {
        const scrollPosition = window.innerHeight + window.scrollY;
        const documentHeight = document.body.offsetHeight;
        const threshold = documentHeight - 50;
        
        if (!hasCompletedFromScroll && scrollPosition >= threshold) {
            console.log('Scroll completion triggered');
            console.log('Scroll position:', scrollPosition, 'Threshold:', threshold);
            hasCompletedFromScroll = true;
            autoCompleteBasedOnURL();
        }
    });
}

// Test button for manual completion
function addTestButton() {
    const button = document.createElement('button');
    button.textContent = 'Complete Current Lesson (DEBUG)';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = '9999';
    button.style.padding = '10px';
    button.style.backgroundColor = '#007cba';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    
    button.onclick = function() {
        console.log('=== MANUAL TEST BUTTON CLICKED ===');
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
        
        console.log('Looking for lesson to complete for URL:', currentURL);
        
        for (let path in map) {
            if (currentURL.includes(path)) {
                console.log('Found lesson to complete:', map[path]);
                completeLesson(map[path]);
                return;
            }
        }
        
        // If we're on the main course page, complete introduction for testing
        if (currentURL.includes('intro-to-seo.html') || currentURL.includes('courses') || !currentURL.includes('.html')) {
            console.log('On course page, completing introduction for test');
            completeLesson('introduction');
        } else {
            console.log('No lesson found to complete for current URL');
        }
    };
    
    document.body.appendChild(button);
}

// Debug function to reset progress
function resetProgress() {
    localStorage.removeItem('lessonProgress');
    lessonProgress = {
        completed: [], 
        current: 'introduction', 
        unlocked: ['introduction']
    };
    initializeLessonStates();
    console.log('Progress reset');
}

// Make some functions globally available for debugging
window.completeLesson = completeLesson;
window.resetProgress = resetProgress;
window.lessonProgress = lessonProgress;