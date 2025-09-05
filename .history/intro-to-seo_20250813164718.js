// SIMPLE LESSON PROGRESS SYSTEM - NO BULLSHIT VERSION
// This actually fucking works

const STORAGE_KEY = 'seo_progress';
const LESSONS = [
    'introduction',
    'keyword', 
    'quiz1',
    'on-page',
    'technical',
    'off-page',
    'content-creation',
    'tools',
    'best-practices',
    'test'
];

// Get current progress from localStorage
function getProgress() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        return JSON.parse(saved);
    }
    // Default: only first lesson unlocked
    return {
        unlockedLessons: [0],
        completedLessons: [],
        currentLesson: 0
    };
}

// Save progress to localStorage
function saveProgress(progress) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    console.log('SAVED PROGRESS:', progress);
}

// Complete current lesson and unlock next
function completeLesson() {
    const progress = getProgress();
    const current = progress.currentLesson;
    
    console.log('COMPLETING LESSON:', current);
    
    // Mark current as completed
    if (!progress.completedLessons.includes(current)) {
        progress.completedLessons.push(current);
    }
    
    // Unlock next lesson
    const next = current + 1;
    if (next < LESSONS.length && !progress.unlockedLessons.includes(next)) {
        progress.unlockedLessons.push(next);
        console.log('UNLOCKED LESSON:', next);
    }
    
    // Move to next lesson
    if (next < LESSONS.length) {
        progress.currentLesson = next;
    }
    
    saveProgress(progress);
    showMessage('Lesson Complete! Next lesson unlocked! 🎉');
    
    return progress;
}

// Show popup message
function showMessage(text) {
    const popup = document.createElement('div');
    popup.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        background: white; padding: 20px; border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3); z-index: 99999;
        font-size: 18px; text-align: center; border: 3px solid #10b981;
    `;
    popup.innerHTML = text;
    document.body.appendChild(popup);
    
    setTimeout(() => popup.remove(), 3000);
}

// Update lesson visual states on main page
function updateLessonStates() {
    const progress = getProgress();
    console.log('UPDATING STATES WITH PROGRESS:', progress);
    
    LESSONS.forEach((lessonClass, index) => {
        const element = document.querySelector(`.${lessonClass}`);
        if (!element) return;
        
        // Remove all state classes
        element.classList.remove('locked', 'current', 'completed');
        
        // Remove existing icons
        const icon = element.querySelector('.lesson-icon');
        if (icon) icon.remove();
        
        // Add appropriate state and icon
        if (progress.completedLessons.includes(index)) {
            element.classList.add('completed');
            const checkmark = document.createElement('div');
            checkmark.className = 'lesson-icon';
            checkmark.innerHTML = '✅';
            checkmark.style.cssText = 'position: absolute; top: 10px; right: 10px; font-size: 20px;';
            element.style.position = 'relative';
            element.appendChild(checkmark);
        } else if (progress.currentLesson === index) {
            element.classList.add('current');
        } else if (!progress.unlockedLessons.includes(index)) {
            element.classList.add('locked');
            const lock = document.createElement('div');
            lock.className = 'lesson-icon';
            lock.innerHTML = '🔒';
            lock.style.cssText = 'position: absolute; top: 10px; right: 10px; font-size: 20px;';
            element.style.position = 'relative';
            element.appendChild(lock);
        }
    });
}

// Block clicks on locked lessons
function setupLessonClicks() {
    const progress = getProgress();
    
    LESSONS.forEach((lessonClass, index) => {
        const element = document.querySelector(`.${lessonClass}`);
        if (!element) return;
        
        const link = element.closest('a');
        if (!link) return;
        
        link.addEventListener('click', function(e) {
            if (!progress.unlockedLessons.includes(index)) {
                e.preventDefault();
                showMessage('🔒 Complete previous lessons first!');
                return false;
            }
            
            // Update current lesson when clicking
            progress.currentLesson = index;
            saveProgress(progress);
        });
    });
}

// Set current lesson based on URL
function setCurrentLessonFromURL() {
    const url = window.location.href;
    const lessonFiles = [
        'seo-introduction.html',
        'keyword-research.html',
        'seo-quiz.html', 
        'on-page-seo.html',
        'technical-seo.html',
        'off-page.html',
        'content-creation-seo.html',
        'seo-tools-and-analytics.html',
        'seo-best-practices.html',
        'seo-test'
    ];
    
    lessonFiles.forEach((file, index) => {
        if (url.includes(file)) {
            const progress = getProgress();
            progress.currentLesson = index;
            saveProgress(progress);
            console.log('SET CURRENT LESSON FROM URL:', index);
        }
    });
}

// Reset all progress
function resetProgress() {
    localStorage.removeItem(STORAGE_KEY);
    console.log('PROGRESS RESET');
    if (document.querySelector('.course-container')) {
        updateLessonStates();
    }
    showMessage('Progress reset! Start from lesson 1.');
}

// MAIN INITIALIZATION
document.addEventListener('DOMContentLoaded', function() {
    console.log('PAGE LOADED');
    
    // Set current lesson from URL if on lesson page
    setCurrentLessonFromURL();
    
    // If on main course page, update visual states
    if (document.querySelector('.course-container')) {
        console.log('ON MAIN COURSE PAGE');
        updateLessonStates();
        setupLessonClicks();
    }
    
    // Add test buttons
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        // Complete lesson button
        const completeBtn = document.createElement('button');
        completeBtn.innerHTML = 'COMPLETE LESSON';
        completeBtn.style.cssText = `
            position: fixed; bottom: 20px; right: 20px; padding: 15px;
            background: #ef4444; color: white; border: none; border-radius: 8px;
            font-size: 14px; font-weight: bold; cursor: pointer; z-index: 9999;
        `;
        completeBtn.onclick = () => {
            completeLesson();
            // If on main page, update states immediately
            if (document.querySelector('.course-container')) {
                setTimeout(() => updateLessonStates(), 100);
            }
        };
        document.body.appendChild(completeBtn);
        
        // Reset button
        const resetBtn = document.createElement('button');
        resetBtn.innerHTML = 'RESET';
        resetBtn.style.cssText = `
            position: fixed; bottom: 80px; right: 20px; padding: 15px;
            background: #666; color: white; border: none; border-radius: 8px;
            font-size: 14px; font-weight: bold; cursor: pointer; z-index: 9999;
        `;
        resetBtn.onclick = () => {
            if (confirm('Reset all progress?')) {
                resetProgress();
            }
        };
        document.body.appendChild(resetBtn);
        
        // Debug button
        const debugBtn = document.createElement('button');
        debugBtn.innerHTML = 'DEBUG';
        debugBtn.style.cssText = `
            position: fixed; bottom: 140px; right: 20px; padding: 15px;
            background: #10b981; color: white; border: none; border-radius: 8px;
            font-size: 14px; font-weight: bold; cursor: pointer; z-index: 9999;
        `;
        debugBtn.onclick = () => {
            console.log('CURRENT PROGRESS:', getProgress());
            console.log('LOCALSTORAGE RAW:', localStorage.getItem(STORAGE_KEY));
        };
        document.body.appendChild(debugBtn);
    }
});

// Global function for lesson pages
window.markLessonComplete = completeLesson;
window.resetProgress = resetProgress;
window.getProgress = getProgress;