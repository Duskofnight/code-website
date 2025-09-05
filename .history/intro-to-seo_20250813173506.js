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
// 3️⃣ Load user progress
// ------------------------
async function loadLessons() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.log("User not logged in. All lessons locked.");
    lockAllLessons();
    return;
  }

  // Fetch user's completed lessons
  const { data: progress, error } = await supabase
    .from("seo_progress")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching progress:", error);
    lockAllLessons();
    return;
  }

  // Map completed lessons
  const completedLessons = progress ? progress.map(p => p.lesson_name) : [];

  // Unlock logic: first lesson always unlocked, next unlocked if previous completed
  let unlockNext = true;
  document.querySelectorAll(".lesson, .quiz, .test").forEach((lessonElem, index) => {
    const lessonName = lessons[index];
    if (completedLessons.includes(lessonName) || index === 0 || unlockNext) {
      lessonElem.classList.remove("locked");
      unlockNext = completedLessons.includes(lessonName) || index === 0;
      lessonElem.addEventListener("click", () => completeLesson(lessonName));
    } else {
      lessonElem.classList.add("locked");
    }
  });
}

// ------------------------
// 4️⃣ Lock all lessons
// ------------------------
function lockAllLessons() {
  document.querySelectorAll(".lesson, .quiz, .test").forEach(lesson => {
    lesson.classList.add("locked");
  });
}

// ------------------------
// 5️⃣ Complete lesson and save progress
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
  loadLessons();
}

// ------------------------
// 6️⃣ Run on page load
// ------------------------
document.addEventListener("DOMContentLoaded", loadLessons);