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
// 2️⃣ Sign up / Sign in / Sign out
// ------------------------
export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return console.error("Sign-up error:", error.message);
  console.log("Sign-up successful:", data);
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return console.error("Login error:", error.message);
  console.log("Logged in:", data.user);
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) console.error("Logout error:", error.message);
  else console.log("Logged out");
}

// ------------------------
// 3️⃣ Load lessons and unlock logic
// ------------------------
export async function loadLessons() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return lockAllLessons();

  const { data: progress, error } = await supabase
    .from("seo_progress")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    console.error(error);
    return lockAllLessons();
  }

  const completedLessons = progress?.map(p => p.lesson_name) || [];

  document.querySelectorAll(".lesson, .quiz, .test").forEach((lessonElem, index) => {
    const lessonName = lessons[index];

    // Remove all previous click handlers to avoid duplicates
    lessonElem.replaceWith(lessonElem.cloneNode(true));
  });

  const elems = document.querySelectorAll(".lesson, .quiz, .test");

  elems.forEach((lessonElem, index) => {
    const lessonName = lessons[index];
    const prevCompleted = index === 0 || completedLessons.includes(lessons[index - 1]);

    if (prevCompleted) {
      lessonElem.classList.remove("locked");
      lessonElem.addEventListener("click", async () => {
        await completeLesson(lessonName);
      });
    } else {
      lessonElem.classList.add("locked");
      lessonElem.addEventListener("click", (e) => {
        e.preventDefault();
        alert("You must complete the previous lesson first!");
      });
    }
  });
}

// ------------------------
// 4️⃣ Lock all lessons
// ------------------------
function lockAllLessons() {
  document.querySelectorAll(".lesson, .quiz, .test").forEach(lesson => {
    lesson.classList.add("locked");
    lesson.addEventListener("click", e => {
      e.preventDefault();
      alert("Log in and complete prior lessons to unlock this one.");
    });
  });
}

// ------------------------
// 5️⃣ Complete a lesson
// ------------------------
async function completeLesson(lessonName) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("seo_progress").upsert({
    user_id: user.id,
    lesson_name: lessonName,
    completed: true
  });

  // reload lessons to unlock the next one
  loadLessons();
}

// ------------------------
// 6️⃣ Run on page load
// ------------------------
document.addEventListener("DOMContentLoaded", loadLessons);