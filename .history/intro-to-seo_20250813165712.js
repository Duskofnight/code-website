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


