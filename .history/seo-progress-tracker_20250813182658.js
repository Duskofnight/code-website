// SEO Course Progress Management System

class SEOProgressTracker {
    constructor(supabaseClient) {
        this.supabase = supabaseClient;
        this.userId = null;
        this.userProgress = {};
        this.lessonOrder = [
            'introduction',
            'keyword',
            'quiz1', // Quiz after fundamentals
            'on-page',
            'technical',
            'off-page',
            'content-creation',
            'tools',
            'best-practices',
            'test' // Final test
        ];
    }

    // Initialize the progress tracker
    async init() {
        try {
            // Get current user
            const { data: { user }, error } = await this.supabase.auth.getUser();
            if (error) throw error;
            
            if (user) {
                this.userId = user.id;
                await this.loadUserProgress();
                this.updateUILocks();
            }
        } catch (error) {
            console.error('Error initializing progress tracker:', error);
        }
    }

    // Load user progress from Supabase
    async loadUserProgress() {
        try {
            const { data, error } = await this.supabase
                .from('seo_progress')
                .select('lesson_id, completed, completed_at')
                .eq('user_id', this.userId);

            if (error) throw error;

            // Convert array to object for easier lookup
            this.userProgress = {};
            if (data) {
                data.forEach(record => {
                    this.userProgress[record.lesson_id] = {
                        completed: record.completed,
                        completed_at: record.completed_at
                    };
                });
            }
        } catch (error) {
            console.error('Error loading user progress:', error);
        }
    }

    // Mark a lesson as completed
    async markLessonCompleted(lessonId) {
        try {
            const { error } = await this.supabase
                .from('seo_progress')
                .upsert({
                    user_id: this.userId,
                    lesson_id: lessonId,
                    completed: true,
                    completed_at: new Date().toISOString()
                });

            if (error) throw error;

            // Update local progress
            this.userProgress[lessonId] = {
                completed: true,
                completed_at: new Date().toISOString()
            };

            // Update UI locks
            this.updateUILocks();
            
            console.log(`Lesson ${lessonId} marked as completed`);
        } catch (error) {
            console.error('Error marking lesson as completed:', error);
        }
    }

    // Check if a lesson is unlocked
    isLessonUnlocked(lessonId) {
        const lessonIndex = this.lessonOrder.indexOf(lessonId);
        
        // First lesson is always unlocked
        if (lessonIndex === 0) return true;
        
        // Check if previous lesson is completed
        const previousLessonId = this.lessonOrder[lessonIndex - 1];
        return this.userProgress[previousLessonId]?.completed === true;
    }

    // Check if a lesson is completed
    isLessonCompleted(lessonId) {
        return this.userProgress[lessonId]?.completed === true;
    }

    // Update UI to show locked/unlocked lessons
    updateUILocks() {
        // Map lesson IDs to their corresponding DOM elements
        const lessonElements = {
            'introduction': document.querySelector('a[href="./intro-to-seo/seo-introduction.html"]'),
            'keyword': document.querySelector('a[href="./intro-to-seo/keyword-research.html"]'),
            'quiz1': document.querySelector('a[href="./intro-to-seo/seo-quiz.html"]'),
            'on-page': document.querySelector('a[href="./intro-to-seo/on-page-seo.html"]'),
            'technical': document.querySelector('a[href="./intro-to-seo/technical-seo.html"]'),
            'off-page': document.querySelector('a[href="./intro-to-seo/off-page.html"]'),
            'content-creation': document.querySelector('a[href="./intro-to-seo/content-creation-seo.html"]'),
            'tools': document.querySelector('a[href="./intro-to-seo/seo-tools-and-analytics.html"]'),
            'best-practices': document.querySelector('a[href="./intro-to-seo/seo-best-practices.html"]'),
            'test': document.querySelector('a[href="./intro-to-seo/seo-test"]')
        };

        this.lessonOrder.forEach(lessonId => {
            const element = lessonElements[lessonId];
            if (!element) return;

            const isUnlocked = this.isLessonUnlocked(lessonId);
            const isCompleted = this.isLessonCompleted(lessonId);

            // Remove existing classes
            element.classList.remove('locked', 'completed', 'available');
            element.removeAttribute('onclick');

            if (isCompleted) {
                element.classList.add('completed');
                element.style.pointerEvents = 'auto';
                
                // Add checkmark for completed lessons
                let checkmark = element.querySelector('.checkmark');
                if (!checkmark) {
                    checkmark = document.createElement('span');
                    checkmark.className = 'checkmark';
                    checkmark.innerHTML = ' ✓';
                    element.querySelector('h3').appendChild(checkmark);
                }
            } else if (isUnlocked) {
                element.classList.add('available');
                element.style.pointerEvents = 'auto';
            } else {
                element.classList.add('locked');
                element.style.pointerEvents = 'none';
                
                // Add lock icon for locked lessons
                let lockIcon = element.querySelector('.lock-icon');
                if (!lockIcon) {
                    lockIcon = document.createElement('span');
                    lockIcon.className = 'lock-icon';
                    lockIcon.innerHTML = ' 🔒';
                    element.querySelector('h3').appendChild(lockIcon);
                }

                // Prevent navigation for locked lessons
                element.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showLockedMessage(lessonId);
                });
            }
        });
    }

    // Show message when user tries to access locked lesson
    showLockedMessage(lessonId) {
        const lessonIndex = this.lessonOrder.indexOf(lessonId);
        const previousLessonId = this.lessonOrder[lessonIndex - 1];
        
        alert(`This lesson is locked. Please complete "${this.getLessonTitle(previousLessonId)}" first.`);
    }

    // Get lesson title for display
    getLessonTitle(lessonId) {
        const titles = {
            'introduction': 'Introduction to SEO',
            'keyword': 'Keyword Research',
            'quiz1': 'SEO Fundamentals Quiz',
            'on-page': 'On-Page SEO',
            'technical': 'Technical SEO Basics',
            'off-page': 'Off-Page SEO & Link Building',
            'content-creation': 'Content Creation for SEO',
            'tools': 'SEO Tools & Analytics',
            'best-practices': 'SEO Best Practices & Common Mistakes',
            'test': 'Final Test'
        };
        return titles[lessonId] || lessonId;
    }

    // Get progress percentage
    getProgressPercentage() {
        const completedLessons = this.lessonOrder.filter(lessonId => 
            this.isLessonCompleted(lessonId)
        ).length;
        return Math.round((completedLessons / this.lessonOrder.length) * 100);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    // Make sure supabase is available
    if (typeof supabase !== 'undefined') {
        const progressTracker = new SEOProgressTracker(supabase);
        await progressTracker.init();
        
        // Make progressTracker globally available
        window.seoProgressTracker = progressTracker;
        
        // Add progress bar to the page
        addProgressBar();
    }
});

// Add progress bar to show course completion
function addProgressBar() {
    const lessonHead = document.querySelector('.lesson-head');
    if (lessonHead && window.seoProgressTracker) {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        progressContainer.innerHTML = `
            <div class="progress-label">Course Progress: <span id="progress-percentage">0%</span></div>
            <div class="progress-bar">
                <div class="progress-fill" id="progress-fill" style="width: 0%"></div>
            </div>
        `;
        
        lessonHead.appendChild(progressContainer);
        updateProgressDisplay();
    }
}

// Update progress display
function updateProgressDisplay() {
    if (window.seoProgressTracker) {
        const percentage = window.seoProgressTracker.getProgressPercentage();
        const progressPercentage = document.getElementById('progress-percentage');
        const progressFill = document.getElementById('progress-fill');
        
        if (progressPercentage) progressPercentage.textContent = `${percentage}%`;
        if (progressFill) progressFill.style.width = `${percentage}%`;
    }
}

// Function to call when a lesson is completed (call this from individual lesson pages)
async function completeLessonAndUnlockNext(lessonId) {
    if (window.seoProgressTracker) {
        await window.seoProgressTracker.markLessonCompleted(lessonId);
        updateProgressDisplay();
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SEOProgressTracker, completeLessonAndUnlockNext };
}