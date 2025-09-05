// Lesson completion tracking
const lessonProgress = {
    completed: [], // No completed lessons initially
    current: 'introduction', // Start with first lesson
    unlocked: ['introduction'] // Only first lesson unlocked initially
};

// Initialize lesson states on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeLessonStates();
    initializeLessonCompletion();
});

function initializeLessonStates() {
    // Clear existing icons first
    document.querySelectorAll('.lesson-checkmark, .lesson-lock').forEach(icon => icon.remove());
    
    const lessons = document.querySelectorAll('.lesson, .quiz, .test');
    
    lessons.forEach(lesson => {
        const lessonId = getLessonId(lesson);
        
        // Remove existing classes
        lesson.classList.remove('completed', 'locked', 'unlocked', 'current');
        lesson.style.pointerEvents = '';
        
        // Add completion status
        if (lessonProgress.completed.includes(lessonId)) {
            lesson.classList.add('completed');
            addCheckmark(lesson);
        } else if (lessonProgress.unlocked.includes(lessonId)) {
            lesson.classList.add('unlocked');
        } else {
            lesson.classList.add('locked');
            addLockIcon(lesson);
            // Disable clicking on locked lessons
            const parentLink = lesson.closest('a');
            if (parentLink) {
                parentLink.style.pointerEvents = 'none';
            } else {
                lesson.style.pointerEvents = 'none';
            }
        }
        
        // Mark current lesson
        if (lessonProgress.current === lessonId) {
            lesson.classList.add('current');
        }
    });
}

function getLessonId(lesson) {
    // Check class names first
    const classList = Array.from(lesson.classList);
    
    if (classList.includes('introduction')) return 'introduction';
    if (classList.includes('keyword')) return 'keyword';
    if (classList.includes('on-page')) return 'on-page';
    if (classList.includes('technical')) return 'technical';
    if (classList.includes('off-page')) return 'off-page';
    if (classList.includes('content-creation')) return 'content-creation';
    if (classList.includes('tools')) return 'tools';
    if (classList.includes('best-practices')) return 'best-practices';
    
    // Check if it's a quiz or test by looking at parent link
    const parentLink = lesson.closest('a');
    if (parentLink) {
        const href = parentLink.getAttribute('href') || '';
        if (href.includes('seo-quiz')) return 'seo-quiz';
        if (href.includes('seo-test')) return 'seo-test';
    }
    
    // Check if lesson is inside quiz/test div without link
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

// Function to complete a lesson (call this when user finishes a lesson)
function completeLesson(lessonId) {
    console.log('Completing lesson:', lessonId);
    
    if (!lessonProgress.completed.includes(lessonId)) {
        lessonProgress.completed.push(lessonId);
        
        // Unlock next lesson
        const nextLesson = getNextLesson(lessonId);
        if (nextLesson && !lessonProgress.unlocked.includes(nextLesson)) {
            lessonProgress.unlocked.push(nextLesson);
            console.log('Unlocked next lesson:', nextLesson);
        }
        
        // Update current lesson to next
        if (nextLesson) {
            lessonProgress.current = nextLesson;
        }
        
        // Re-initialize states
        initializeLessonStates();
        console.log('Lesson progress updated:', lessonProgress);
        
        // Show completion notification
        showCompletionNotification(lessonId, nextLesson);
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
    return currentIndex !== -1 && currentIndex < lessonOrder.length - 1 
        ? lessonOrder[currentIndex + 1] 
        : null;
}

// Get current lesson ID from URL
function getCurrentLessonFromURL() {
    const currentURL = window.location.href;
    
    if (currentURL.includes('seo-introduction.html')) return 'introduction';
    if (currentURL.includes('keyword-research.html')) return 'keyword';
    if (currentURL.includes('seo-quiz.html')) return 'seo-quiz';
    if (currentURL.includes('on-page-seo.html')) return 'on-page';
    if (currentURL.includes('technical-seo.html')) return 'technical';
    if (currentURL.includes('off-page.html')) return 'off-page';
    if (currentURL.includes('content-creation-seo.html')) return 'content-creation';
    if (currentURL.includes('seo-tools-and-analytics.html')) return 'tools';
    if (currentURL.includes('seo-best-practices.html')) return 'best-practices';
    if (currentURL.includes('seo-test')) return 'seo-test';
    
    return null;
}

// Initialize lesson completion system for individual lesson pages
function initializeLessonCompletion() {
    const currentLesson = getCurrentLessonFromURL();
    
    if (!currentLesson) {
        console.log('Not on a lesson page, skipping completion initialization');
        return;
    }
    
    console.log('Initializing completion system for lesson:', currentLesson);
    
    // Create and add "Next Lesson" button if #end exists
    createNextButton(currentLesson);
    
    // Track if user has reached the end section
    let hasReachedEnd = false;
    
    // Check if #end section exists
    const endSection = document.getElementById('end');
    if (endSection) {
        // Use Intersection Observer to detect when user reaches #end
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasReachedEnd) {
                    hasReachedEnd = true;
                    console.log('User reached #end section');
                    enableNextButton();
                }
            });
        }, {
            threshold: 0.5, // Trigger when 50% of the #end section is visible
            rootMargin: '0px 0px -10% 0px' // Add some margin for better UX
        });
        
        observer.observe(endSection);
    } else {
        console.log('No #end section found on this page');
        // If no #end section exists, enable the next button immediately
        setTimeout(() => {
            hasReachedEnd = true;
            enableNextButton();
        }, 1000);
    }
}

// Create "Next Lesson" button
function createNextButton(currentLesson) {
    const nextLesson = getNextLesson(currentLesson);
    const endSection = document.getElementById('end');
    
    if (!endSection && !nextLesson) return;
    
    // Create next button container
    const nextButtonContainer = document.createElement('div');
    nextButtonContainer.id = 'next-lesson-container';
    nextButtonContainer.style.cssText = `
        margin-top: 2rem;
        text-align: center;
        padding: 2rem;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 12px;
        border: 2px solid #e2e8f0;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    `;
    
    // Create the button
    const nextButton = document.createElement('button');
    nextButton.id = 'next-lesson-btn';
    nextButton.innerHTML = nextLesson ? 
        `Complete Lesson & Continue to Next <span style="font-weight: bold;">${getLessonTitle(nextLesson)}</span>` : 
        'Complete Final Lesson';
    
    nextButton.style.cssText = `
        background: linear-gradient(135deg, #ef4444, #f97316);
        color: white;
        border: none;
        padding: 1rem 2rem;
        border-radius: 8px;
        font-size: 1.1rem;
        font-weight: 600;
        cursor: not-allowed;
        opacity: 0.5;
        transition: all 0.3s ease;
        width: 100%;
        max-width: 400px;
        position: relative;
    `;
    
    // Add disabled state text
    const disabledText = document.createElement('div');
    disabledText.id = 'disabled-text';
    disabledText.innerHTML = '📖 Read to the end of the lesson to unlock';
    disabledText.style.cssText = `
        margin-top: 0.5rem;
        color: #6b7280;
        font-size: 0.9rem;
        font-style: italic;
    `;
    
    nextButtonContainer.appendChild(nextButton);
    nextButtonContainer.appendChild(disabledText);
    
    // Add click handler
    nextButton.addEventListener('click', function() {
        if (nextButton.classList.contains('enabled')) {
            completeLesson(currentLesson);
            
            // Navigate to next lesson if it exists
            if (nextLesson) {
                setTimeout(() => {
                    const nextLessonURL = getLessonURL(nextLesson);
                    if (nextLessonURL) {
                        window.location.href = nextLessonURL;
                    }
                }, 1500);
            }
        }
    });
    
    // Add to page
    if (endSection) {
        endSection.appendChild(nextButtonContainer);
    } else {
        // Add to bottom of body if no #end section
        document.body.appendChild(nextButtonContainer);
    }
}

// Enable the next button when user reaches the end
function enableNextButton() {
    const nextButton = document.getElementById('next-lesson-btn');
    const disabledText = document.getElementById('disabled-text');
    
    if (nextButton) {
        nextButton.classList.add('enabled');
        nextButton.style.cssText = `
            background: linear-gradient(135deg, #ef4444, #f97316);
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 8px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            opacity: 1;
            transition: all 0.3s ease;
            width: 100%;
            max-width: 400px;
            transform: translateY(0);
        `;
        
        // Add hover effect
        nextButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 8px 25px rgba(239, 68, 68, 0.3)';
        });
        
        nextButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
        
        if (disabledText) {
            disabledText.innerHTML = '🎉 Great job! Click to continue to the next lesson';
            disabledText.style.color = '#16a34a';
        }
        
        console.log('Next button enabled');
    }
}

// Get lesson title for display
function getLessonTitle(lessonId) {
    const titles = {
        'introduction': 'Introduction to SEO',
        'keyword': 'Keyword Research',
        'seo-quiz': 'SEO Quiz',
        'on-page': 'On-Page SEO',
        'technical': 'Technical SEO Basics',
        'off-page': 'Off-Page SEO & Link Building',
        'content-creation': 'Content Creation for SEO',
        'tools': 'SEO Tools & Analytics',
        'best-practices': 'SEO Best Practices & Common Mistakes',
        'seo-test': 'Final Test'
    };
    return titles[lessonId] || lessonId;
}

// Get lesson URL
function getLessonURL(lessonId) {
    const urls = {
        'introduction': './seo-introduction.html',
        'keyword': './keyword-research.html',
        'seo-quiz': './seo-quiz.html',
        'on-page': './on-page-seo.html',
        'technical': './technical-seo.html',
        'off-page': './off-page.html',
        'content-creation': './content-creation-seo.html',
        'tools': './seo-tools-and-analytics.html',
        'best-practices': './seo-best-practices.html',
        'seo-test': './seo-test'
    };
    return urls[lessonId];
}

// Show completion notification
function showCompletionNotification(completedLesson, nextLesson) {
    // Create notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #16a34a, #22c55e);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(22, 163, 74, 0.3);
        z-index: 10000;
        font-weight: 600;
        max-width: 300px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span>✅</span>
            <div>
                <div>Lesson Completed!</div>
                <div style="font-size: 0.85rem; opacity: 0.9; margin-top: 0.25rem;">
                    ${nextLesson ? `${getLessonTitle(nextLesson)} unlocked` : 'Course completed!'}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Test function - you can call this in console to test
function testCompleteLesson() {
    const currentLesson = getCurrentLessonFromURL() || 'introduction';
    completeLesson(currentLesson);
}