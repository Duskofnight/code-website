import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = 'https://yzaspqdhudutgsnovwyl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6YXNwcWRodWR1dGdzbm92d3lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMjQ2NTksImV4cCI6MjA3MDcwMDY1OX0.2wg34aUxQZsC43EggurCz3i8cDqHtOteiR2OBgHeP9w';

const supabase = createClient(supabaseUrl, supabaseKey);

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
// Auth helpers
// ------------------------
export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return console.error("Sign-up error:", error.message);
  alert("Check your email for confirmation!");
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return console.error("Login error:", error.message);
  alert("Login successful!");
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) console.error("Logout error:", error.message);
  else console.log("Logged out successfully");
}

// ------------------------
// Lock/unlock lessons
// ------------------------
function lockAllLessons() {
  document.querySelectorAll(".lesson, .quiz, .test").forEach(lesson => {
    lesson.classList.add("locked");
    lesson.replaceWith(lesson.cloneNode(true)); // remove old listeners
  });
}

async function loadLessons() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    lockAllLessons();
    return;
  }

  // Fetch completed lessons
  const { data: progress, error } = await supabase
    .from("seo_progress")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    console.error(error);
    lockAllLessons();
    return;
  }

  const completedLessons = progress ? progress.map(p => p.lesson_name.trim().toLowerCase()) : [];

  document.querySelectorAll(".lesson, .quiz, .test").forEach((lessonElem, index) => {
    const lessonName = lessons[index];
    const normalizedLesson = lessonName.trim().toLowerCase();

    // Remove old listeners
    const newLessonElem = lessonElem.cloneNode(true);
    lessonElem.replaceWith(newLessonElem);
    lessonElem = newLessonElem;

    if (index === 0 || completedLessons.includes(lessons[index - 1].trim().toLowerCase())) {
      // Unlock lesson
      lessonElem.classList.remove("locked");

      lessonElem.addEventListener("click", async () => {
        await completeLesson(lessonName);
      });

    } else {
      // Locked lesson
      lessonElem.classList.add("locked");
      lessonElem.addEventListener("click", (e) => {
        e.preventDefault();
        alert("You must complete the previous lesson first!");
      });
    }
  });
}

// ------------------------
// Complete a lesson
// ------------------------
async function completeLesson(lessonName) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("seo_progress").upsert({
    user_id: user.id,
    lesson_name: lessonName,
    completed: true
  });

  // Reload lessons to unlock the next one
  await loadLessons();
}

// ------------------------
// Run on page load
// ------------------------
document.addEventListener("DOMContentLoaded", loadLessons);
