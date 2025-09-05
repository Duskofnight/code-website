import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = 'https://yzaspqdhudutgsnovwyl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6YXNwcWRodWR1dGdzbm92d3lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMjQ2NTksImV4cCI6MjA3MDcwMDY1OX0.2wg34aUxQZsC43EggurCz3i8cDqHtOteiR2OBgHeP9w';

const supabase = createClient(supabaseUrl, supabaseKey);

async function signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return console.error("Sign-up error:", error.message);
    alert("Check your email for confirmation!");
}

async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return console.error("Login error:", error.message);
    alert("Login successful!");
}

async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Logout error:", error.message);
}

// ------------------------
// 3️⃣ Lessons array
// ------------------------
const lessons = [
  "Introduction to SEO",
  "Keyword Research",
  "Quiz",
  "On-Page SEO",
  "Technical SEO Basics",
  "Off-Page SEO & Link Building",
  "Content Creation for SEO",
  "SEO Tools & Analytics",
  "SEO Best Practices & Common Mistakes",
  "Test"
];

// ------------------------
// 4️⃣ Lock all lessons
// ------------------------
function lockAllLessons() {
    document.querySelectorAll(".lesson, .quiz, .test").forEach(lesson => {
        lesson.classList.add("locked");
        lesson.onclick = (e) => {
            e.preventDefault();
            alert("Log in and complete prior lessons to unlock this one.");
        };
    });
}

// ------------------------
// 5️⃣ Load lessons and apply locking/unlocking
// ------------------------
async function loadLessons() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        lockAllLessons();
        return;
    }

    const { data: progress, error } = await supabase
        .from("seo_progress")
        .select("*")
        .eq("user_id", user.id);

    if (error) {
        console.error(error);
        lockAllLessons();
        return;
    }

    const completedLessons = progress ? progress.map(p => p.lesson_name) : [];

    document.querySelectorAll(".lesson, .quiz, .test").forEach((lessonElem, index) => {
        // Remove old listeners by replacing the node
        const newElem = lessonElem.cloneNode(true);
        lessonElem.replaceWith(newElem);
        lessonElem = newElem;

        const lessonName = lessons[index];

        if (index === 0 || completedLessons.includes(lessons[index - 1])) {
            // Unlock
            lessonElem.classList.remove("locked");
            lessonElem.onclick = async () => {
                await completeLesson(lessonName);
            };
        } else {
            // Lock
            lessonElem.classList.add("locked");
            lessonElem.onclick = (e) => {
                e.preventDefault();
                alert("Complete the previous lesson first!");
            };
        }
    });
}

// ------------------------
// 6️⃣ Complete a lesson
// ------------------------
async function completeLesson(lessonName) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("seo_progress").upsert({
        user_id: user.id,
        lesson_name: lessonName,
        completed: true
    });
    if (error) return console.error("Error completing lesson:", error);

    await loadLessons(); // Reload lessons to unlock the next one
}



// ------------------------
// 7️⃣ Run on page load
// ------------------------
document.addEventListener("DOMContentLoaded", loadLessons);