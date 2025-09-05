// Load progress from localStorage or use defaults
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
    
    // For lesson pages, set up completion detection
    if (isLessonPage()) {
        setupLessonCompletion();
    }
});

// Check if we're on a lesson page
function isLessonPage() {
    const lessonPages = [
        'seo-introduction.html', 'keyword-research.html', 'seo-quiz.html',
        'on-page-seo.html', 'technical-seo.html', 'off-page.html',
        'content-creation-seo.html', 'seo-tools-and-analytics.html', 
        'seo-best-practices.html', 'seo-test'
    ];
    
    const currentURL = window.location.href;
    return lessonPages.some(page => currentURL.includes(page));
}

// Set up completion detection for lesson pages
function setupLessonCompletion() {
    console.log('Setting up lesson completion detection');
    
    // Method 1: Complete on scroll to bottom
    addScrollCompletion();
    
    // Method 2: Complete after time delay (backup)
    setTimeout(() => {
        console.log('Auto-completing lesson after 10 seconds on page');
        autoCompleteBasedOnURL();
    }, 10000); // 10 seconds
    
    // Method 3: Complete when user tries to navigate away
    window.addEventListener('beforeunload', function() {
        autoCompleteBasedOnURL();
    });
    
    // Method 4: Complete when clicking "Next" or navigation links
    setupNavigationCompletion();
}

// Set up completion when clicking navigation elements
function setupNavigationCompletion() {
    // Find all navigation links that would indicate lesson completion
    const navLinks = document.querySelectorAll('a[href*=".html"], .next-button, .complete-button, .finish-button');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log('Navigation link clicked, completing current lesson');
            autoCompleteBasedOnURL();
        });
    });
}

// Initialize lesson states
function initializeLessonStates() {
    console.log('Initializing lesson states with progress:', lessonProgress);
    
    // Remove existing icons
    document.querySelectorAll('.lesson-checkmark, .lesson-lock').forEach(icon => {
        icon.remove();
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
                parentLink.onclick = function(e) {
                    e.preventDefault();
                    alert('Complete the previous lessons to unlock this one!');
                    return false;
                };
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
    checkmark.style.color = '#4CAF50';
    checkmark.style.fontWeight = 'bold';
    checkmark.style.marginLeft = '10px';
    checkmark.style.fontSize = '1.2em';
    lesson.appendChild(checkmark);
    console.log('Added checkmark to lesson');
}

function addLockIcon(lesson) {
    const lockIcon = document.createElement('span');
    lockIcon.className = 'lesson-lock';
    lockIcon.innerHTML = '🔒';
    lockIcon.style.marginLeft = '10px';
    lockIcon.style.opacity = '0.6';
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

        // Show completion notification
        showCompletionNotification(lessonId, nextLesson);
        
        console.log('=== LESSON COMPLETION DONE ===');
    } else {
        console.log('Lesson already completed:', lessonId);
    }
}

function showCompletionNotification(completedLesson, nextLesson) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        font-family: Arial, sans-serif;
        max-width: 300px;
    `;
    
    notification.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 5px;">✓ Lesson Completed!</div>
        <div>${completedLesson.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
        ${nextLesson ? `<div style="margin-top: 10px; font-size: 0.9em;">Next lesson unlocked: ${nextLesson.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>` : ''}
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 4 seconds
    setTimeout(() => {
        notification.style.transition = 'opacity 0.5s ease';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 500);
    }, 4000);
}

function getNextLesson(currentLessonId) {
    const lessonOrder = [
        'introduction', 'keyword', 'seo-quiz',
        'on-page', 'technical',
        'off-page', 'content-creation',
        'tools', 'best-practices', 'seo-test'
    ];
    
    console.log('Finding next lesson for:', currentLessonId);
    
    const currentIndex = lessonOrder.indexOf(currentLessonId);
    console.log('Current index:', currentIndex);
    
    const nextLesson = (currentIndex !== -1 && currentIndex < lessonOrder.length - 1) 
        ? lessonOrder[currentIndex + 1] 
        : null;
        
    console.log('Next lesson will be:', nextLesson);
    return nextLesson;
}

// Auto-complete by URL - IMPROVED VERSION
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
    
    let foundLesson = null;
    
    // Check each path in the URL
    for (let path in map) {
        if (currentURL.includes(path)) {
            foundLesson = map[path];
            console.log('Found matching path:', path, '-> lesson:', foundLesson);
            break;
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
        
        console.log('Completing lesson:', foundLesson);
        completeLesson(foundLesson);
    } else {
        console.log('No matching URL found for auto-completion');
    }
}

// Auto-complete on scroll bottom - IMPROVED VERSION
function addScrollCompletion() {
    console.log('Setting up scroll completion');
    let hasCompletedFromScroll = false;
    
    window.addEventListener('scroll', function() {
        if (hasCompletedFromScroll) return;
        
        const scrollPosition = window.innerHeight + window.scrollY;
        const documentHeight = document.body.offsetHeight;
        const threshold = documentHeight - 100; // More generous threshold
        
        if (scrollPosition >= threshold) {
            console.log('Scroll completion triggered');
            console.log('Scroll position:', scrollPosition, 'Threshold:', threshold);
            hasCompletedFromScroll = true;
            
            // Small delay to ensure user has actually read content
            setTimeout(() => {
                autoCompleteBasedOnURL();
            }, 500);
        }
    });
}

// Manual completion function for testing
function completeCurrentLesson() {
    autoCompleteBasedOnURL();
}

// Debug function to reset progress
function resetProgress() {
    localStorage.removeItem('lessonProgress');
    lessonProgress = {
        completed: [], 
        current: 'introduction', 
        unlocked: ['introduction']
    };
    saveLessonProgress();
    
    // Refresh the page or reinitialize
    if (typeof initializeLessonStates === 'function') {
        initializeLessonStates();
    }
    console.log('Progress reset');
    
    // Show reset notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        background: #f44336;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
    `;
    notification.textContent = 'Progress Reset!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Make functions globally available for debugging
window.completeCurrentLesson = completeCurrentLesson;
window.resetProgress = resetProgress;
window.lessonProgress = lessonProgress;