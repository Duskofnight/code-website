// SEO Course Progress Manager
class SEOCourseManager {
    constructor() {
        this.storageKey = 'seo_course_progress';
        this.lessons = [
            { id: 'introduction', element: '.introduction', url: './intro-to-seo/seo-introduction.html' },
            { id: 'keyword', element: '.keyword', url: './intro-to-seo/keyword-research.html' },
            { id: 'quiz1', element: '.quiz', url: './intro-to-seo/seo-quiz.html' },
            { id: 'on-page', element: '.on-page', url: './intro-to-seo/on-page-seo.html' },
            { id: 'technical', element: '.technical', url: './intro-to-seo/technical-seo.html' },
            { id: 'off-page', element: '.off-page', url: './intro-to-seo/off-page.html' },
            { id: 'content-creation', element: '.content-creation', url: './intro-to-seo/content-creation-seo.html' },
            { id: 'tools', element: '.tools', url: './intro-to-seo/seo-tools-and-analytics.html' },
            { id: 'best-practices', element: '.best-practices', url: './intro-to-seo/seo-best-practices.html' },
            { id: 'test', element: '.test', url: './intro-to-seo/seo-test' }
        ];
        this.init();
    }

    init() {
        this.loadProgress();
        this.setupLessonStates();
        this.attachClickHandlers();
        this.addProgressIcons();
    }

    // Load progress from localStorage
    loadProgress() {
        const saved = localStorage.getItem(this.storageKey);
        console.log('Loading progress from localStorage:', saved); // DEBUG
        
        if (saved && saved !== 'null' && saved !== 'undefined') {
            try {
                this.progress = JSON.parse(saved);
                console.log('Loaded existing progress:', this.progress); // DEBUG
                
                // Ensure arrays exist (in case of corrupted data)
                if (!Array.isArray(this.progress.completedLessons)) {
                    this.progress.completedLessons = [];
                }
                if (!Array.isArray(this.progress.unlockedLessons)) {
                    this.progress.unlockedLessons = [0];
                }
                if (typeof this.progress.currentLesson !== 'number') {
                    this.progress.currentLesson = 0;
                }
            } catch (e) {
                console.error('Error parsing saved progress, resetting:', e);
                this.resetToDefault();
            }
        } else {
            console.log('No saved progress found, creating default'); // DEBUG
            this.resetToDefault();
        }
    }

    // Separate method for default progress
    resetToDefault() {
        this.progress = {
            completedLessons: [],
            currentLesson: 0,
            unlockedLessons: [0] // Only first lesson unlocked initially
        };
        this.saveProgress();
        console.log('Reset to default progress:', this.progress); // DEBUG
    }

    // Save progress to localStorage
    saveProgress() {
        console.log('Saving progress to localStorage:', this.progress); // DEBUG
        localStorage.setItem(this.storageKey, JSON.stringify(this.progress));
        
        // Verify it was saved
        const verification = localStorage.getItem(this.storageKey);
        console.log('Verification - saved data:', verification); // DEBUG
    }

    // Setup visual states for all lessons
    setupLessonStates() {
        this.lessons.forEach((lesson, index) => {
            const element = document.querySelector(lesson.element);
            if (!element) return;

            // Remove existing state classes
            element.classList.remove('locked', 'current', 'completed');

            if (this.progress.completedLessons.includes(index)) {
                // Lesson is completed
                element.classList.add('completed');
            } else if (this.progress.currentLesson === index) {
                // Current lesson
                element.classList.add('current');
            } else if (!this.progress.unlockedLessons.includes(index)) {
                // Lesson is locked
                element.classList.add('locked');
            }
        });
    }

    // Add progress icons to lessons
    addProgressIcons() {
        this.lessons.forEach((lesson, index) => {
            const element = document.querySelector(lesson.element);
            if (!element) return;

            // Remove existing icons
            const existingIcon = element.querySelector('.lesson-checkmark, .lesson-lock');
            if (existingIcon) {
                existingIcon.remove();
            }

            // Add appropriate icon
            if (this.progress.completedLessons.includes(index)) {
                const checkmark = document.createElement('div');
                checkmark.className = 'lesson-checkmark';
                checkmark.innerHTML = '✓';
                element.appendChild(checkmark);
            } else if (!this.progress.unlockedLessons.includes(index)) {
                const lock = document.createElement('div');
                lock.className = 'lesson-lock';
                lock.innerHTML = '🔒';
                element.appendChild(lock);
            }
        });
    }

    // Attach click handlers to lesson elements
    attachClickHandlers() {
        this.lessons.forEach((lesson, index) => {
            const element = document.querySelector(lesson.element);
            if (!element) return;

            const link = element.closest('a');
            if (link) {
                link.addEventListener('click', (e) => {
                    if (!this.progress.unlockedLessons.includes(index)) {
                        e.preventDefault();
                        this.showLockedMessage();
                        return false;
                    }
                    
                    // Update current lesson
                    this.progress.currentLesson = index;
                    this.saveProgress();
                });
            }
        });
    }

    // Show message when trying to access locked lesson
    showLockedMessage() {
        // Create and show a temporary message
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #fff;
            padding: 20px 30px;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            text-align: center;
            border: 2px solid #ef4444;
        `;
        message.innerHTML = `
            <h3 style="margin: 0 0 10px 0; color: #ef4444;">Lesson Locked 🔒</h3>
            <p style="margin: 0; color: #6b7280;">Complete the previous lessons to unlock this one!</p>
        `;
        
        document.body.appendChild(message);
        
        // Remove message after 3 seconds
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 3000);
    }

    // Mark current lesson as completed and unlock next
    completeCurrentLesson() {
        const currentIndex = this.progress.currentLesson;
        
        // Mark as completed if not already
        if (!this.progress.completedLessons.includes(currentIndex)) {
            this.progress.completedLessons.push(currentIndex);
        }
        
        // Unlock next lesson
        const nextIndex = currentIndex + 1;
        if (nextIndex < this.lessons.length && !this.progress.unlockedLessons.includes(nextIndex)) {
            this.progress.unlockedLessons.push(nextIndex);
        }
        
        // Move to next lesson
        if (nextIndex < this.lessons.length) {
            this.progress.currentLesson = nextIndex;
        }
        
        this.saveProgress();
        this.setupLessonStates();
        this.addProgressIcons();
        
        // Show completion message
        this.showCompletionMessage(currentIndex, nextIndex);
    }

    // Show completion message
    showCompletionMessage(completedIndex, nextIndex) {
        const completedLesson = this.lessons[completedIndex];
        const nextLesson = this.lessons[nextIndex];
        
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #fff;
            padding: 25px 35px;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            text-align: center;
            border: 2px solid #10b981;
            max-width: 400px;
        `;
        
        let messageContent = `
            <h3 style="margin: 0 0 15px 0; color: #10b981;">Lesson Completed! ✅</h3>
            <p style="margin: 0 0 10px 0; color: #374151;">Great job finishing this lesson!</p>
        `;
        
        if (nextLesson) {
            messageContent += `<p style="margin: 0; color: #6b7280; font-size: 14px;">Next lesson unlocked: <strong>${nextLesson.id.replace('-', ' ').toUpperCase()}</strong></p>`;
        } else {
            messageContent += `<p style="margin: 0; color: #6b7280; font-size: 14px;"><strong>🎉 Congratulations! You've completed the entire course!</strong></p>`;
        }
        
        message.innerHTML = messageContent;
        document.body.appendChild(message);
        
        // Remove message after 4 seconds
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 4000);
    }

    // Reset all progress (for testing purposes)
    resetProgress() {
        localStorage.removeItem(this.storageKey);
        this.progress = {
            completedLessons: [],
            currentLesson: 0,
            unlockedLessons: [0]
        };
        this.saveProgress();
        this.setupLessonStates();
        this.addProgressIcons();
        console.log('Progress reset - only first lesson is now unlocked');
    }

    // Get progress summary
    getProgressSummary() {
        const completed = this.progress.completedLessons.length;
        const total = this.lessons.length;
        const percentage = Math.round((completed / total) * 100);
        
        return {
            completed,
            total,
            percentage,
            currentLesson: this.lessons[this.progress.currentLesson]?.id || 'none'
        };
    }

    // Method to manually unlock a lesson (for admin/testing)
    unlockLesson(lessonIndex) {
        if (lessonIndex >= 0 && lessonIndex < this.lessons.length) {
            if (!this.progress.unlockedLessons.includes(lessonIndex)) {
                this.progress.unlockedLessons.push(lessonIndex);
                this.saveProgress();
                this.setupLessonStates();
                this.addProgressIcons();
            }
        }
    }
}

// Initialize the course manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on a lesson page and update current lesson
    updateCurrentLessonFromURL();
    
    // Create global instance only on main course page
    if (document.querySelector('.course-container')) {
        window.seoManager = new SEOCourseManager();
    }
    
    // Add complete lesson button for testing (remove in production)
    const testButton = document.createElement('button');
    testButton.innerHTML = 'Complete Current Lesson (Test)';
    testButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 10px 15px;
        background: #ef4444;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 12px;
        z-index: 1000;
    `;
    testButton.addEventListener('click', () => {
        markLessonComplete();
    });
    
    // Only show test button in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        document.body.appendChild(testButton);
    }
    
    // Add reset button for testing (only on main course page)
    if (document.querySelector('.course-container')) {
        const resetButton = document.createElement('button');
        resetButton.innerHTML = 'Reset Progress (Test)';
        resetButton.style.cssText = `
            position: fixed;
            bottom: 70px;
            right: 20px;
            padding: 10px 15px;
            background: #6b7280;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 12px;
            z-index: 1000;
        `;
        resetButton.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all progress?')) {
                window.seoManager.resetProgress();
            }
        });
        
        // Only show reset button in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            document.body.appendChild(resetButton);
        }
    }
});

// Function to detect current lesson from URL and update progress
function updateCurrentLessonFromURL() {
    const currentURL = window.location.pathname;
    const lessonURLs = [
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
    
    const currentLessonIndex = lessonURLs.findIndex(url => currentURL.includes(url));
    
    if (currentLessonIndex !== -1) {
        const storageKey = 'seo_course_progress';
        let progress = JSON.parse(localStorage.getItem(storageKey)) || {
            completedLessons: [],
            currentLesson: 0,
            unlockedLessons: [0]
        };
        
        // Update current lesson
        progress.currentLesson = currentLessonIndex;
        localStorage.setItem(storageKey, JSON.stringify(progress));
    }
}

// Function to call when a lesson is completed (call this from individual lesson pages)
function markLessonComplete() {
    if (window.seoManager) {
        window.seoManager.completeCurrentLesson();
    } else {
        // If seoManager doesn't exist, handle progress directly
        const storageKey = 'seo_course_progress';
        let progress = JSON.parse(localStorage.getItem(storageKey)) || {
            completedLessons: [],
            currentLesson: 0,
            unlockedLessons: [0]
        };
        
        const currentIndex = progress.currentLesson;
        
        // Mark as completed if not already
        if (!progress.completedLessons.includes(currentIndex)) {
            progress.completedLessons.push(currentIndex);
        }
        
        // Unlock next lesson
        const nextIndex = currentIndex + 1;
        const totalLessons = 10; // Update this if you add more lessons
        if (nextIndex < totalLessons && !progress.unlockedLessons.includes(nextIndex)) {
            progress.unlockedLessons.push(nextIndex);
        }
        
        // Move to next lesson
        if (nextIndex < totalLessons) {
            progress.currentLesson = nextIndex;
        }
        
        // Save progress
        localStorage.setItem(storageKey, JSON.stringify(progress));
        
        // Show completion message
        showCompletionMessageStandalone(currentIndex, nextIndex, totalLessons);
    }
}

// Standalone completion message function
function showCompletionMessageStandalone(completedIndex, nextIndex, totalLessons) {
    const lessonNames = [
        'Introduction to SEO',
        'Keyword Research', 
        'SEO Quiz',
        'On-Page SEO',
        'Technical SEO Basics',
        'Off-Page SEO & Link Building',
        'Content Creation for SEO',
        'SEO Tools & Analytics',
        'SEO Best Practices & Common Mistakes',
        'Final Test'
    ];
    
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #fff;
        padding: 25px 35px;
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        text-align: center;
        border: 2px solid #10b981;
        max-width: 400px;
    `;
    
    let messageContent = `
        <h3 style="margin: 0 0 15px 0; color: #10b981;">Lesson Completed! ✅</h3>
        <p style="margin: 0 0 10px 0; color: #374151;">Great job finishing this lesson!</p>
    `;
    
    if (nextIndex < totalLessons) {
        messageContent += `<p style="margin: 0; color: #6b7280; font-size: 14px;">Next lesson unlocked: <strong>${lessonNames[nextIndex]}</strong></p>`;
    } else {
        messageContent += `<p style="margin: 0; color: #6b7280; font-size: 14px;"><strong>🎉 Congratulations! You've completed the entire course!</strong></p>`;
    }
    
    message.innerHTML = messageContent;
    document.body.appendChild(message);
    
    // Remove message after 4 seconds
    setTimeout(() => {
        if (message.parentNode) {
            message.parentNode.removeChild(message);
        }
    }, 4000);
}

// Function to check if a lesson is unlocked
function isLessonUnlocked(lessonIndex) {
    if (window.seoManager) {
        return window.seoManager.progress.unlockedLessons.includes(lessonIndex);
    }
    return lessonIndex === 0; // Default: only first lesson unlocked
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SEOCourseManager, markLessonComplete, isLessonUnlocked };
}