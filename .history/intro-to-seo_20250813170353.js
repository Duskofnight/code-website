// Course progression system
class CourseProgress {
    constructor() {
        // In production, replace with localStorage or database
        this.completedLessons = this.loadProgress().completed || [];
        this.currentLessonIndex = this.loadProgress().currentIndex || 0;
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
        this.init();
    }

    // Load progress from storage (replace with your storage method)
    loadProgress() {
        try {
            // In production: return JSON.parse(localStorage.getItem('seoProgress')) || {};
            return JSON.parse(sessionStorage.getItem('seoProgress')) || {};
        } catch {
            return {};
        }
    }

    // Save progress to storage
    saveProgress() {
        const progressData = {
            completed: this.completedLessons,
            currentIndex: this.currentLessonIndex
        };
        // In production: localStorage.setItem('seoProgress', JSON.stringify(progressData));
        sessionStorage.setItem('seoProgress', JSON.stringify(progressData));
    }

    init() {
        this.updateUI();
        this.attachEventListeners();
        this.createProgressIndicator();
    }

    createProgressIndicator() {
        // Create progress indicator if it doesn't exist
        if (!document.getElementById('progressIndicator')) {
            const progressHTML = `
                <div class="progress-indicator" id="progressIndicator">
                    <div class="progress-bar">
                        <div class="progress-fill" id="progressFill"></div>
                    </div>
                    <div class="progress-text" id="progressText">0 of ${this.lessons.length} lessons completed</div>
                </div>
            `;
            document.body.insertAdjacentHTML('afterbegin', progressHTML);
        }
    }

    attachEventListeners() {
        const lessonElements = document.querySelectorAll('[data-lesson], .lesson, .quiz, .test');
        lessonElements.forEach((element, index) => {
            const lessonId = element.dataset.lesson || this.lessons[index];
            element.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLessonClick(lessonId, index);
            });
        });
    }

    handleLessonClick(lessonId, index) {
        if (this.isLessonUnlocked(index)) {
            this.navigateToLesson(lessonId, index);
        } else {
            this.showLockedMessage();
        }
    }

    navigateToLesson(lessonId, index) {
        // Store the lesson user is about to start
        this.setCurrentLesson(index);
        
        // Navigate based on lesson type
        let url = '';
        if (lessonId.includes('quiz')) {
            url = `./intro-to-seo/${lessonId}.html`;
        } else if (lessonId.includes('test')) {
            url = `./intro-to-seo/${lessonId}.html`;
        } else {
            url = `./intro-to-seo/${lessonId}.html`;
        }
        
        // Add return URL parameter so lesson pages know where to come back
        const returnUrl = encodeURIComponent(window.location.href);
        url += `?return=${returnUrl}&lessonIndex=${index}`;
        
        window.location.href = url;
    }

    setCurrentLesson(index) {
        if (index >= 0 && index < this.lessons.length) {
            this.currentLessonIndex = index;
            this.saveProgress();
            this.updateUI();
        }
    }

    showLockedMessage() {
        const currentLesson = this.lessons[this.currentLessonIndex];
        alert(`🔒 This lesson is locked!\n\nComplete "${this.formatLessonName(currentLesson)}" first to unlock this lesson.`);
    }

    formatLessonName(lessonId) {
        return lessonId.replace(/-/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase())
            .replace(/Seo/g, 'SEO');
    }

    isLessonUnlocked(index) {
        return index <= this.currentLessonIndex;
    }

    isLessonCompleted(index) {
        return this.completedLessons.includes(this.lessons[index]);
    }

    // Call this when a lesson is completed (from individual lesson pages)
    completeLesson(lessonId) {
        if (!this.completedLessons.includes(lessonId)) {
            this.completedLessons.push(lessonId);
            const lessonIndex = this.lessons.indexOf(lessonId);
            
            // Unlock next lesson if this was the current one
            if (lessonIndex === this.currentLessonIndex && this.currentLessonIndex < this.lessons.length - 1) {
                this.currentLessonIndex++;
            }
            
            this.saveProgress();
            this.updateUI();
            this.showCompletionMessage(lessonId);
            return true;
        }
        return false;
    }

    showCompletionMessage(lessonId) {
        const nextLessonIndex = this.currentLessonIndex;
        const nextLesson = this.lessons[nextLessonIndex];
        
        if (nextLesson && nextLessonIndex < this.lessons.length) {
            const nextLessonName = this.formatLessonName(nextLesson);
            alert(`🎉 Congratulations!\n\nYou've completed "${this.formatLessonName(lessonId)}".\n\nNext lesson "${nextLessonName}" is now unlocked!`);
        } else {
            alert(`🏆 COURSE COMPLETE!\n\nCongratulations! You've completed the entire SEO course!\n\nYou can now review any lesson at any time.`);
        }
    }

    updateUI() {
        const lessonElements = document.querySelectorAll('[data-lesson], .lesson, .quiz, .test');
        
        lessonElements.forEach((element, index) => {
            if (index >= this.lessons.length) return;
            
            const lessonId = this.lessons[index];
            let icon = element.querySelector('.lesson-icon');
            
            // Create icon if it doesn't exist
            if (!icon) {
                icon = document.createElement('div');
                icon.className = 'lesson-icon';
                element.appendChild(icon);
            }
            
            // Reset classes
            element.classList.remove('locked', 'completed', 'current');
            icon.innerHTML = '';
            icon.className = 'lesson-icon';
            
            if (this.isLessonCompleted(index)) {
                // Completed lesson
                element.classList.add('completed');
                icon.classList.add('lesson-checkmark');
                icon.innerHTML = '✓';
                element.style.cursor = 'pointer';
            } else if (index === this.currentLessonIndex) {
                // Current lesson
                element.classList.add('current');
                icon.classList.add('lesson-current');
                icon.innerHTML = '▶';
                element.style.cursor = 'pointer';
            } else if (index > this.currentLessonIndex) {
                // Locked lesson
                element.classList.add('locked');
                icon.classList.add('lesson-lock');
                icon.innerHTML = '🔒';
                element.style.cursor = 'not-allowed';
            } else {
                // Available lesson
                element.style.cursor = 'pointer';
            }
        });
        
        this.updateProgressBar();
    }

    updateProgressBar() {
        const completedCount = this.completedLessons.length;
        const totalCount = this.lessons.length;
        const progressPercentage = (completedCount / totalCount) * 100;
        
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        if (progressFill) {
            progressFill.style.width = `${progressPercentage}%`;
        }
        if (progressText) {
            progressText.textContent = `${completedCount} of ${totalCount} lessons completed (${Math.round(progressPercentage)}%)`;
        }
    }

    // Utility methods for testing/admin
    reset() {
        this.completedLessons = [];
        this.currentLessonIndex = 0;
        this.saveProgress();
        this.updateUI();
    }

    skipToLesson(index) {
        if (index >= 0 && index < this.lessons.length) {
            this.currentLessonIndex = index;
            // Mark all previous lessons as completed
            for (let i = 0; i < index; i++) {
                if (!this.completedLessons.includes(this.lessons[i])) {
                    this.completedLessons.push(this.lessons[i]);
                }
            }
            this.saveProgress();
            this.updateUI();
        }
    }

    // Get current progress info
    getProgressInfo() {
        return {
            completed: this.completedLessons.length,
            total: this.lessons.length,
            currentLesson: this.lessons[this.currentLessonIndex],
            currentIndex: this.currentLessonIndex,
            percentage: Math.round((this.completedLessons.length / this.lessons.length) * 100)
        };
    }
}

// Global functions to be called from lesson pages
window.CourseProgressAPI = {
    // Call this when a lesson is completed
    completeLesson: function(lessonId) {
        if (window.courseProgress) {
            return window.courseProgress.completeLesson(lessonId);
        }
        console.warn('Course progress not initialized');
        return false;
    },
    
    // Get current progress
    getProgress: function() {
        if (window.courseProgress) {
            return window.courseProgress.getProgressInfo();
        }
        return null;
    },
    
    // Check if lesson is unlocked
    isLessonUnlocked: function(lessonId) {
        if (window.courseProgress) {
            const index = window.courseProgress.lessons.indexOf(lessonId);
            return window.courseProgress.isLessonUnlocked(index);
        }
        return false;
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the course progress system
    window.courseProgress = new CourseProgress();
    
    // Profile dropdown functionality
    const profilePic = document.getElementById('header-profile-pic');
    const dropdown = document.getElementById('dropdownMenu');
    
    if (profilePic && dropdown) {
        profilePic.addEventListener('click', function() {
            dropdown.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            if (!profilePic.contains(event.target) && !dropdown.contains(event.target)) {
                dropdown.classList.remove('show');
            }
        });
    }

    // Mobile menu functionality
    const menuIcon = document.querySelector('.menu-icon');
    const myLinks = document.getElementById('myLinks');
    
    if (menuIcon && myLinks) {
        menuIcon.addEventListener('click', function() {
            menuIcon.classList.toggle('active');
            myLinks.classList.toggle('show');
        });
    }
});

// Demo/Admin functions (remove in production)
function completeCurrentLesson() {
    if (window.courseProgress) {
        const currentLessonId = window.courseProgress.lessons[window.courseProgress.currentLessonIndex];
        if (currentLessonId) {
            window.courseProgress.completeLesson(currentLessonId);
        }
    }
}

function resetProgress() {
    if (window.courseProgress) {
        window.courseProgress.reset();
        alert('Progress has been reset!');
    }
}

function skipToLesson(index) {
    if (window.courseProgress) {
        window.courseProgress.skipToLesson(index);
        alert(`Skipped to lesson ${index + 1}!`);
    }
}

function logout() {
    // Clear progress if needed
    sessionStorage.removeItem('seoProgress');
    alert('Logging out...');
    // Redirect to login page
    // window.location.href = '/login';
}

// Handle return from lesson pages
function handleLessonReturn() {
    const urlParams = new URLSearchParams(window.location.search);
    const completed = urlParams.get('completed');
    const lessonIndex = urlParams.get('lessonIndex');
    
    if (completed && lessonIndex && window.courseProgress) {
        const lessonId = window.courseProgress.lessons[parseInt(lessonIndex)];
        if (lessonId) {
            window.courseProgress.completeLesson(lessonId);
        }
        
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}