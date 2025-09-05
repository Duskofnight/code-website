const courseStructure = {
    'seo-fundamentals': [
        { id: 'seo-introduction', name: 'Introduction to SEO', type: 'lesson' },
        { id: 'keyword-research', name: 'Keyword Research', type: 'lesson' },
        { id: 'seo-quiz', name: 'Quiz', type: 'quiz' }
    ],
    'on-site-optimization': [
        { id: 'on-page-seo', name: 'On-Page SEO', type: 'lesson' },
        { id: 'technical-seo', name: 'Technical SEO Basics', type: 'lesson' }
    ],
    'off-site-strategies': [
        { id: 'off-page', name: 'Off-Page SEO & Link Building', type: 'lesson' },
        { id: 'content-creation-seo', name: 'Content Creation for SEO', type: 'lesson' }
    ],
    'optimizing-seo-use': [
        { id: 'seo-tools-and-analytics', name: 'SEO Tools & Analytics', type: 'lesson' },
        { id: 'seo-best-practices', name: 'SEO Best Practices & Common Mistakes', type: 'lesson' },
        { id: 'seo-test', name: 'Test', type: 'test' }
    ]
};

class SEOProgressTracker {
    constructor() {
        this.userId = null;
        this.userProgress = {};
        this.init();
    }

    async init() {
        try {
            // Get current user
            const { data: { user } } = await supabase.auth.getUser();
            
            if (!user) {
                console.error('User not authenticated');
                return;
            }

            this.userId = user.id;
            await this.loadUserProgress();
            this.updateLessonStates();
            this.addEventListeners();
        } catch (error) {
            console.error('Error initializing progress tracker:', error);
        }
    }

    async loadUserProgress() {
        try {
            const { data, error } = await supabase
                .from('user_lesson_progress')
                .select('lesson_id, completed')
                .eq('user_id', this.userId);

            if (error) throw error;

            // Convert array to object for easier access
            this.userProgress = {};
            if (data) {
                data.forEach(record => {
                    this.userProgress[record.lesson_id] = record.completed;
                });
            }

            console.log('User progress loaded:', this.userProgress);
        } catch (error) {
            console.error('Error loading user progress:', error);
        }
    }

    async markLessonComplete(lessonId) {
        try {
            // Update local progress
            this.userProgress[lessonId] = true;

            // Update database using upsert (insert or update)
            const { error } = await supabase
                .from('user_lesson_progress')
                .upsert({
                    user_id: this.userId,
                    lesson_id: lessonId,
                    completed: true,
                    completed_at: new Date().toISOString()
                }, {
                    onConflict: 'user_id,lesson_id'
                });

            if (error) throw error;

            console.log(`Lesson ${lessonId} marked as complete`);
            
            // Update UI to reflect changes
            this.updateLessonStates();
            
            // Show completion notification
            this.showCompletionNotification(lessonId);

        } catch (error) {
            console.error('Error marking lesson complete:', error);
        }
    }

    isLessonCompleted(lessonId) {
        return this.userProgress[lessonId] === true;
    }

    isLessonUnlocked(lessonId) {
        // First lesson of each section is always unlocked
        const firstLessons = [
            'seo-introduction', 
            'on-page-seo', 
            'off-page', 
            'seo-tools-and-analytics'
        ];
        
        if (firstLessons.includes(lessonId)) {
            return true;
        }

        // Find the previous lesson in the course structure
        const previousLessonId = this.getPreviousLessonId(lessonId);
        
        if (!previousLessonId) {
            return true; // If no previous lesson found, unlock it
        }

        return this.isLessonCompleted(previousLessonId);
    }

    getPreviousLessonId(currentLessonId) {
        for (const sectionKey in courseStructure) {
            const section = courseStructure[sectionKey];
            const currentIndex = section.findIndex(lesson => lesson.id === currentLessonId);
            
            if (currentIndex > 0) {
                // Return previous lesson in same section
                return section[currentIndex - 1].id;
            } else if (currentIndex === 0 && sectionKey !== 'seo-fundamentals') {
                // Return last lesson of previous section
                const sectionKeys = Object.keys(courseStructure);
                const currentSectionIndex = sectionKeys.indexOf(sectionKey);
                if (currentSectionIndex > 0) {
                    const previousSection = courseStructure[sectionKeys[currentSectionIndex - 1]];
                    return previousSection[previousSection.length - 1].id;
                }
            }
        }
        return null;
    }

    updateLessonStates() {
        // Update all lesson elements based on completion and unlock status
        const lessonElements = document.querySelectorAll('.lesson, .quiz, .test');
        
        lessonElements.forEach(element => {
            const link = element.closest('a');
            if (!link) return;

            // Extract lesson ID from href
            const href = link.getAttribute('href');
            if (!href) return;

            const lessonId = this.extractLessonIdFromHref(href);
            if (!lessonId) return;

            // Remove existing state classes
            element.classList.remove('completed', 'locked', 'unlocked');

            if (this.isLessonCompleted(lessonId)) {
                element.classList.add('completed');
                link.style.pointerEvents = 'auto';
                element.style.opacity = '1';
                
                // Add checkmark icon if not already present
                if (!element.querySelector('.completion-icon')) {
                    const icon = document.createElement('span');
                    icon.className = 'completion-icon';
                    icon.innerHTML = ' ✓';
                    icon.style.color = '#28a745';
                    icon.style.fontWeight = 'bold';
                    element.querySelector('h3').appendChild(icon);
                }
            } else if (this.isLessonUnlocked(lessonId)) {
                element.classList.add('unlocked');
                link.style.pointerEvents = 'auto';
                element.style.opacity = '1';
            } else {
                element.classList.add('locked');
                link.style.pointerEvents = 'none';
                element.style.opacity = '0.5';
                
                // Add lock icon if not already present
                if (!element.querySelector('.lock-icon')) {
                    const icon = document.createElement('span');
                    icon.className = 'lock-icon';
                    icon.innerHTML = ' 🔒';
                    element.querySelector('h3').appendChild(icon);
                }
            }
        });
    }

    extractLessonIdFromHref(href) {
        // Extract lesson ID from various href formats
        if (href.includes('seo-introduction')) return 'seo-introduction';
        if (href.includes('keyword-research')) return 'keyword-research';
        if (href.includes('seo-quiz')) return 'seo-quiz';
        if (href.includes('on-page-seo')) return 'on-page-seo';
        if (href.includes('technical-seo')) return 'technical-seo';
        if (href.includes('off-page')) return 'off-page';
        if (href.includes('content-creation-seo')) return 'content-creation-seo';
        if (href.includes('seo-tools-and-analytics')) return 'seo-tools-and-analytics';
        if (href.includes('seo-best-practices')) return 'seo-best-practices';
        if (href.includes('seo-test')) return 'seo-test';
        
        return null;
    }

    addEventListeners() {
        // Listen for lesson completion messages from individual lesson pages
        window.addEventListener('message', (event) => {
            if (event.data.type === 'lesson-completed' && event.data.lessonId) {
                this.markLessonComplete(event.data.lessonId);
            }
        });

        // Add test reset button
        this.createTestResetButton();
    }

    createTestResetButton() {
        // Create reset progress button for testing
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset Progress (Test)';
        resetButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 10px 15px;
            background-color: #dc3545;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            z-index: 1000;
            font-size: 12px;
        `;
        
        resetButton.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all progress? This action cannot be undone.')) {
                this.resetProgress();
            }
        });

        document.body.appendChild(resetButton);
    }

    async resetProgress() {
        try {
            // Delete all progress from database
            const { error } = await supabase
                .from('user_lesson_progress')
                .delete()
                .eq('user_id', this.userId);

            if (error) throw error;

            // Clear local progress
            this.userProgress = {};
            
            // Update UI
            this.updateLessonStates();
            
            console.log('Progress reset successfully');
            alert('Progress has been reset!');

        } catch (error) {
            console.error('Error resetting progress:', error);
            alert('Error resetting progress. Please try again.');
        }
    }

    showCompletionNotification(lessonId) {
        // Create and show a completion notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #28a745;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            animation: slideIn 0.3s ease-out;
        `;
        
        notification.innerHTML = `
            <strong>Lesson Completed!</strong><br>
            Great job finishing this lesson. The next lesson is now unlocked!
        `;

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Method to be called from individual lesson pages when completed
    static completedLesson(lessonId) {
        // Send message to parent window (course overview page)
        if (window.parent !== window) {
            window.parent.postMessage({
                type: 'lesson-completed',
                lessonId: lessonId
            }, '*');
        } else {
            // If on the same page, directly call the method
            if (window.progressTracker) {
                window.progressTracker.markLessonComplete(lessonId);
            }
        }
    }
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .lesson.completed {
        background-color: #d4edda !important;
        border-left: 4px solid #28a745;
    }
    
    .lesson.locked {
        cursor: not-allowed !important;
    }
    
    .completion-icon {
        color: #28a745 !important;
        font-weight: bold;
    }
    
    .lock-icon {
        opacity: 0.6;
    }
`;
document.head.appendChild(style);

// Initialize the progress tracker when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.progressTracker = new SEOProgressTracker();
});

// Export for use in individual lesson pages
window.SEOProgressTracker = SEOProgressTracker;