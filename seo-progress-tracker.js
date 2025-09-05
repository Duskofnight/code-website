// Debug Version - SEO Course Progress Management System

class SEOProgressTracker {
    constructor(supabaseClient) {
        this.supabase = supabaseClient;
        this.userId = null;
        this.userProgress = {};
        this.lessonOrder = [
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
        this.debugMode = true; // Enable debug logging
    }

    log(message, data = null) {
        if (this.debugMode) {
            console.log(`[SEO Progress] ${message}`, data || '');
        }
    }

    // Initialize the progress tracker
    async init() {
        this.log('Initializing progress tracker...');
        
        try {
            // First, let's check if supabase is available
            if (!this.supabase) {
                this.log('ERROR: Supabase client not available');
                // Fallback: Initialize without user (guest mode)
                this.initializeGuestMode();
                return;
            }

            this.log('Supabase client available, checking user...');
            
            // Get current user
            const { data: { user }, error } = await this.supabase.auth.getUser();
            
            if (error) {
                this.log('Auth error:', error);
                this.initializeGuestMode();
                return;
            }
            
            if (user) {
                this.log('User found:', user.id);
                this.userId = user.id;
                await this.loadUserProgress();
            } else {
                this.log('No authenticated user found, using guest mode');
                this.initializeGuestMode();
            }
            
            this.updateUILocks();
            
        } catch (error) {
            this.log('Error during initialization:', error);
            this.initializeGuestMode();
        }
    }

    // Initialize guest mode (no authentication required)
    initializeGuestMode() {
        this.log('Initializing guest mode...');
        this.userId = 'guest';
        
        // Try to load progress from localStorage as fallback
        const savedProgress = localStorage.getItem('seo_progress_guest');
        if (savedProgress) {
            try {
                this.userProgress = JSON.parse(savedProgress);
                this.log('Loaded guest progress from localStorage:', this.userProgress);
            } catch (e) {
                this.log('Error parsing saved progress, starting fresh');
                this.userProgress = {};
            }
        } else {
            this.userProgress = {};
        }
        
        this.updateUILocks();
    }

    // Load user progress from Supabase
    async loadUserProgress() {
        this.log('Loading user progress from database...');
        
        try {
            const { data, error } = await this.supabase
                .from('seo_progress')
                .select('lesson_id, completed, completed_at')
                .eq('user_id', this.userId);

            if (error) {
                this.log('Database error:', error);
                return;
            }

            // Convert array to object for easier lookup
            this.userProgress = {};
            if (data) {
                data.forEach(record => {
                    this.userProgress[record.lesson_id] = {
                        completed: record.completed,
                        completed_at: record.completed_at
                    };
                });
                this.log('Loaded progress from database:', this.userProgress);
            } else {
                this.log('No progress data found in database');
            }
        } catch (error) {
            this.log('Error loading user progress:', error);
        }
    }

    // Mark a lesson as completed
    async markLessonCompleted(lessonId) {
        this.log(`Marking lesson ${lessonId} as completed...`);
        
        try {
            if (this.userId === 'guest') {
                // Save to localStorage for guest users
                this.userProgress[lessonId] = {
                    completed: true,
                    completed_at: new Date().toISOString()
                };
                localStorage.setItem('seo_progress_guest', JSON.stringify(this.userProgress));
                this.log('Saved guest progress to localStorage');
            } else {
                // Save to database for authenticated users
                const { error } = await this.supabase
                    .from('seo_progress')
                    .upsert({
                        user_id: this.userId,
                        lesson_id: lessonId,
                        completed: true,
                        completed_at: new Date().toISOString()
                    });

                if (error) {
                    this.log('Database save error:', error);
                    return;
                }

                // Update local progress
                this.userProgress[lessonId] = {
                    completed: true,
                    completed_at: new Date().toISOString()
                };
            }

            // Update UI locks
            this.updateUILocks();
            this.log(`Lesson ${lessonId} marked as completed successfully`);
            
        } catch (error) {
            this.log('Error marking lesson as completed:', error);
        }
    }

    // Check if a lesson is unlocked
    isLessonUnlocked(lessonId) {
        const lessonIndex = this.lessonOrder.indexOf(lessonId);
        
        // First lesson is always unlocked
        if (lessonIndex === 0) {
            this.log(`Lesson ${lessonId} is first lesson - UNLOCKED`);
            return true;
        }
        
        // Check if previous lesson is completed
        const previousLessonId = this.lessonOrder[lessonIndex - 1];
        const isUnlocked = this.userProgress[previousLessonId]?.completed === true;
        
        this.log(`Lesson ${lessonId} unlock check: previous lesson ${previousLessonId} completed = ${isUnlocked}`);
        return isUnlocked;
    }

    // Check if a lesson is completed
    isLessonCompleted(lessonId) {
        const completed = this.userProgress[lessonId]?.completed === true;
        this.log(`Lesson ${lessonId} completion check: ${completed}`);
        return completed;
    }

    // Update UI to show locked/unlocked lessons
    updateUILocks() {
        this.log('Updating UI locks...');
        
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
            if (!element) {
                this.log(`Element not found for lesson: ${lessonId}`);
                return;
            }

            const isUnlocked = this.isLessonUnlocked(lessonId);
            const isCompleted = this.isLessonCompleted(lessonId);

            this.log(`Updating ${lessonId}: unlocked=${isUnlocked}, completed=${isCompleted}`);

            // Remove existing classes
            element.classList.remove('locked', 'completed', 'available');
            element.style.pointerEvents = '';

            // Clear any existing icons
            const existingIcons = element.querySelectorAll('.checkmark, .lock-icon');
            existingIcons.forEach(icon => icon.remove());

            if (isCompleted) {
                element.classList.add('completed');
                element.style.pointerEvents = 'auto';
                
                // Add checkmark for completed lessons
                const checkmark = document.createElement('span');
                checkmark.className = 'checkmark';
                checkmark.innerHTML = ' ✓';
                const h3 = element.querySelector('h3');
                if (h3) h3.appendChild(checkmark);
                
                this.log(`Applied completed styling to ${lessonId}`);
                
            } else if (isUnlocked) {
                element.classList.add('available');
                element.style.pointerEvents = 'auto';
                this.log(`Applied available styling to ${lessonId}`);
                
            } else {
                element.classList.add('locked');
                element.style.pointerEvents = 'none';
                
                // Add lock icon for locked lessons
                const lockIcon = document.createElement('span');
                lockIcon.className = 'lock-icon';
                lockIcon.innerHTML = ' 🔒';
                const h3 = element.querySelector('h3');
                if (h3) h3.appendChild(lockIcon);

                // Prevent navigation for locked lessons
                element.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showLockedMessage(lessonId);
                });
                
                this.log(`Applied locked styling to ${lessonId}`);
            }
        });
        
        this.log('UI update completed');
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
    console.log('[SEO Progress] DOM loaded, initializing...');
    
    // Check if supabase is available
    if (typeof supabase === 'undefined') {
        console.log('[SEO Progress] Supabase not available, will use guest mode');
    }
    
    const progressTracker = new SEOProgressTracker(typeof supabase !== 'undefined' ? supabase : null);
    await progressTracker.init();
    
    // Make progressTracker globally available
    window.seoProgressTracker = progressTracker;
    
    // Add progress bar to the page
    addProgressBar();
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

// Function to call when a lesson is completed
async function completeLessonAndUnlockNext(lessonId) {
    if (window.seoProgressTracker) {
        await window.seoProgressTracker.markLessonCompleted(lessonId);
        updateProgressDisplay();
    }
}

// Debug function to check current state
function debugProgressState() {
    if (window.seoProgressTracker) {
        console.log('Current user:', window.seoProgressTracker.userId);
        console.log('User progress:', window.seoProgressTracker.userProgress);
        console.log('Lesson order:', window.seoProgressTracker.lessonOrder);
    }
}

// Make debug function available globally
window.debugProgressState = debugProgressState;