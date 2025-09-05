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



const track = document.getElementById('carousel-track');
const cards = Array.from(document.querySelectorAll('.course-card'));
const totalCards = cards.length;
let currentIndex = 0;
let isTransitioning = false;
let cardWidth;

// Debounce resize
let resizeTimeout;

window.addEventListener('load', () => {
  cardWidth = cards[0].offsetWidth + 30; // 30 = gap/margin between cards
  updateCarousel(false);
});

function moveCarousel(direction) {
  if (isTransitioning) return;

  // Only move if within bounds
  if (direction > 0 && currentIndex < totalCards - 1) {
    currentIndex++;
  } else if (direction < 0 && currentIndex > 0) {
    currentIndex--;
  } else {
    return;
  }

  isTransitioning = true;
  updateCarousel(true);
}

function updateCarousel(animate = true) {
  const translateX = -currentIndex * cardWidth;
  track.style.transition = animate ? 'transform 0.4s cubic-bezier(.77,0,.18,1)' : 'none';
  track.style.transform = `translateX(${translateX}px)`;
}

track.addEventListener('transitionend', () => {
  isTransitioning = false;
});

document.getElementById('nextBtn').addEventListener('click', () => moveCarousel(1));
document.getElementById('prevBtn').addEventListener('click', () => moveCarousel(-1));

window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    cardWidth = cards[0].offsetWidth + 30;
    updateCarousel(false);
  }, 100);
});