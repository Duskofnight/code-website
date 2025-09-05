import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";     
const supabaseUrl = 'https://yzaspqdhudutgsnovwyl.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6YXNwcWRodWR1dGdzbm92d3lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMjQ2NTksImV4cCI6MjA3MDcwMDY1OX0.2wg34aUxQZsC43EggurCz3i8cDqHtOteiR2OBgHeP9w'; // Replace with your Supabase anon key
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

async function signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
        console.error("Sign-up error:", error.message);
        return;
    }
    console.log("Sign-up successful:", data);
    alert("Check your email for confirmation!");
}


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
// 3️⃣ Load lessons and apply locking/unlocking
// ------------------------
async function loadLessons() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    lockAllLessons();
    return;
  }

  // Get completed lessons
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

  let unlockNext = true;

  document.querySelectorAll(".lesson, .quiz, .test").forEach((lessonElem, index) => {
    const lessonName = lessons[index];
    const link = lessonElem.querySelector("a") || lessonElem; // in case it's wrapped

    if (index === 0 || completedLessons.includes(lessons[index - 1])) {
      // Unlock this lesson
      lessonElem.classList.remove("locked");
      unlockNext = true;

      // Click to complete
      lessonElem.addEventListener("click", async (e) => {
        await completeLesson(lessonName);
      });

    } else {
      // Lock this lesson
      lessonElem.classList.add("locked");
      unlockNext = false;

      // Prevent navigation if locked
      lessonElem.addEventListener("click", (e) => {
        e.preventDefault();
        alert("You must complete the previous lesson first!");
      });

      // Disable the link if <a>
      if (link.tagName === "A") {
        link.addEventListener("click", (e) => e.preventDefault());
      }
    }
  });
}

// ------------------------
// 4️⃣ Lock all lessons (default)
function lockAllLessons() {
  document.querySelectorAll(".lesson, .quiz, .test").forEach(lesson => {
    lesson.classList.add("locked");
    lesson.addEventListener("click", (e) => {
      e.preventDefault();
      alert("Log in and complete prior lessons to unlock this one.");
    });
  });
}

// ------------------------
// 5️⃣ Mark lesson as completed in Supabase
async function completeLesson(lessonName) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("seo_progress").upsert({
    user_id: user.id,
    lesson_name: lessonName,
    completed: true
  });

  // Reload lessons to unlock the next one
  loadLessons();
}

// ------------------------
// 6️⃣ Run on page load
document.addEventListener("DOMContentLoaded", loadLessons);