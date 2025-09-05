const codeLines = [
  "def greet(name):",
  "  print(f\"Hi, {name}!\")",
  "  print(\"Welcome to Codemate.\")",
  "",
  "def tip(lang):",
  "  if lang == \"py\":",
  "    print(\"Python is great!\")",
  "  else:",
  "    print(f\"Try {lang} too!\")",
  "",
  "greet(\"Dev\")",
  "tip(\"py\")",
  "print(\"Let's code!\")"
];

const codeBlock = document.getElementById("typing-code");
let lineIndex = 0;
let charIndex = 0;

function typeNextChar() {
  if (lineIndex >= codeLines.length) {
    Prism.highlightElement(codeBlock);

    // ⏳ Wait a few seconds, then restart
    setTimeout(() => {
      lineIndex = 0;
      charIndex = 0;
      codeBlock.textContent = "";
      typeNextChar();
    }, 3000); // 3 seconds pause before restart

    return;
  }

  const currentLine = codeLines[lineIndex];

  if (charIndex < currentLine.length) {
    codeBlock.textContent += currentLine[charIndex];
    charIndex++;
    setTimeout(typeNextChar, 20);
  } else {
    codeBlock.textContent += "\n";
    lineIndex++;
    charIndex = 0;
    setTimeout(typeNextChar, 150);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  typeNextChar();
});


function myFunction() {
  const menu = document.getElementById("myLinks");
  const menuIcon = document.querySelector(".menu-icon");

  menu.classList.toggle("show");
  menuIcon.classList.toggle("active");
}



// Ultra-smooth carousel with proper timing and state management
// Super simple carousel - no cloning, no complex logic
let currentSlide = 0;
const track = document.getElementById('carousel-track');
const cards = document.querySelectorAll('.course-card');
const totalCards = cards.length;

// Calculate how much to move per slide
function getSlideWidth() {
  const cardStyle = window.getComputedStyle(cards[0]);
  const cardWidth = cards[0].offsetWidth;
  const gap = parseInt(cardStyle.marginRight) || 30;
  return cardWidth + gap;
}

// Move to specific slide
function goToSlide(slideIndex) {
  const slideWidth = getSlideWidth();
  const translateX = -slideIndex * slideWidth;
  track.style.transform = `translateX(${translateX}px)`;
}

// Move carousel left or right
function moveCarousel(direction) {
  currentSlide += direction;
  
  // Simple wrap around
  if (currentSlide >= totalCards) currentSlide = 0;
  if (currentSlide < 0) currentSlide = totalCards - 1;
  
  goToSlide(currentSlide);
}

// Set initial position
goToSlide(0);

// Handle window resize
window.addEventListener('resize', () => goToSlide(currentSlide));

// Mobile menu toggle
function myFunction() {
  const links = document.getElementById("myLinks");
  const menu = document.querySelector(".menu-icon");
  
  links?.classList.toggle("show");
  menu?.classList.toggle("active");
}