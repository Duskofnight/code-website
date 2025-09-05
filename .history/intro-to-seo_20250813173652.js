const SUPABASE_URL = 'https://YOUR_SUPABASE_URL.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Get current logged in user
async function getUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
        console.log('User not logged in');
        return null;
    }
    return user;
}

// --- Elements ---
const lessons = document.querySelectorAll('.lesson, .quiz, .test');

// --- Initialize lessons ---
async function initLessons() {
    const user = await getUser();
    if (!user) return;

    // Fetch completed lessons for this user
    const { data: completedLessons, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('course', 'intro-to-seo');

    const completed = completedLessons ? completedLessons.map(l => l.lesson_name) : [];

    lessons.forEach((lesson, index) => {
        const lessonName = lesson.querySelector('h3').innerText;

        // Lock all except first if not completed
        if (index === 0 || completed.includes(lessonName)) {
            lesson.classList.remove('locked');
            lesson.classList.add('unlocked');
        } else {
            lesson.classList.add('locked');
            lesson.classList.remove('unlocked');
        }

        // Add click listener
        lesson.addEventListener('click', async (e) => {
            if (lesson.classList.contains('locked')) {
                e.preventDefault(); // prevent navigation
                alert('Complete previous lessons to unlock this one.');
                return;
            }
            // Mark current lesson complete
            await markLessonComplete(user.id, lessonName);

            // Unlock next lesson
            const nextLesson = lessons[index + 1];
            if (nextLesson) {
                nextLesson.classList.remove('locked');
                nextLesson.classList.add('unlocked');
            }
        });
    });
}

// --- Mark lesson complete in Supabase ---
async function markLessonComplete(userId, lessonName) {
    const { data, error } = await supabase
        .from('user_progress')
        .upsert({
            user_id: userId,
            course: 'intro-to-seo',
            lesson_name: lessonName,
            completed: true
        }, { onConflict: ['user_id', 'course', 'lesson_name'] });

    if (error) console.error('Error updating progress:', error);
}

// --- Run initialization ---
initLessons();