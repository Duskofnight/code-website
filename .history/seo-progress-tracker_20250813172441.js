const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseKey = "YOUR_ANON_KEY";
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Define lessons in order
const lessons = [
  { slug: "seo-introduction", elementClass: "introduction" },
  { slug: "keyword-research", elementClass: "keyword" },
  { slug: "on-page-seo", elementClass: "on-page" },
  { slug: "technical-seo", elementClass: "technical" },
  { slug: "off-page", elementClass: "off-page" },
  { slug: "content-creation-seo", elementClass: "content-creation" },
  { slug: "seo-tools-and-analytics", elementClass: "tools" },
  { slug: "seo-best-practices", elementClass: "best-practices" },
  { slug: "seo-test", elementClass: "test" },
];

// Mark lesson as completed
async function markLessonCompleted(slug) {
  const user = supabase.auth.user();
  if (!user) return;

  await supabase.from("lesson_progress").upsert({
    user_id: user.id,
    lesson_slug: slug,
    completed: true,
  });
  await loadProgress();
}

// Load progress and update UI
async function loadProgress() {
  const user = supabase.auth.user();
  if (!user) return;

  const { data } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("user_id", user.id);

  const completedLessons = data.map((d) => d.lesson_slug);

  lessons.forEach((lesson, i) => {
    const element = document.querySelector(`.${lesson.elementClass}`);
    const link = element.querySelector("a") || element;

    // Lock all except first and completed ones
    if (i === 0 || completedLessons.includes(lessons[i - 1].slug)) {
      element.classList.remove("locked");
      link.style.pointerEvents = "auto";
      element.querySelector("h3").textContent = element.querySelector("h3").textContent.replace(" 🔒", "");
    } else {
      element.classList.add("locked");
      link.style.pointerEvents = "none";
      if (!element.querySelector("h3").textContent.includes("🔒")) {
        element.querySelector("h3").textContent += " 🔒";
      }
    }

    if (completedLessons.includes(lesson.slug)) {
      element.classList.add("completed");
    } else {
      element.classList.remove("completed");
    }
  });
}

// Example: mark current lesson done when user clicks
document.querySelectorAll(".lesson").forEach((lessonEl) => {
  lessonEl.addEventListener("click", () => {
    const lessonSlug = lessons.find((l) => lessonEl.classList.contains(l.elementClass))?.slug;
    if (lessonSlug) markLessonCompleted(lessonSlug);
  });
});

// Load progress on page load
supabase.auth.onAuthStateChange(() => {
  loadProgress();
})