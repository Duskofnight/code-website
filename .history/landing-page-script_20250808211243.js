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
let currentIndex = 3; // starting index after prepended clones
let isTransitioning = false;
let cardWidth;

// Debounce resize
let resizeTimeout;

// Setup carousel after full page load
window.addEventListener('load', () => {
  setupInfiniteLoop();
});

// Clone cards and initialize carousel
function setupInfiniteLoop() {
  cardWidth = cards[0].offsetWidth + 30; // 30 = gap/margin between cards

  if (!track.querySelector('.clone')) {
    // Clone first 3 cards to end
    for (let i = 0; i < 3; i++) {
      const clone = cards[i].cloneNode(true);
      clone.classList.add('clone');
      track.appendChild(clone);
    }

    // Clone last 3 cards to beginning
    for (let i = totalCards - 3; i < totalCards; i++) {
      const clone = cards[i].cloneNode(true);
      clone.classList.add('clone');
      track.insertBefore(clone, track.firstChild);
    }
  }

  updateCarousel(false);
}

// Move carousel left or right
function moveCarousel(direction) {
  if (isTransitioning) return;

  isTransitioning = true;
  currentIndex += direction;
  updateCarousel(true);
}

// Update carousel position
function updateCarousel(animate = true) {
  const translateX = -currentIndex * cardWidth;

  track.style.transition = animate ? 'transform 0.4s ease' : 'none';
  track.style.transform = `translateX(${translateX}px)`;
}

// Handle transition end and reset if needed
track.addEventListener('transitionend', () => {
  isTransitioning = false;

  if (currentIndex >= totalCards + 3) {
    currentIndex = 3;
    requestAnimationFrame(() => updateCarousel(false));
  } else if (currentIndex < 3) {
    currentIndex = totalCards + 2;
    requestAnimationFrame(() => updateCarousel(false));
  }
});

// Navigation buttons
document.getElementById('nextBtn').addEventListener('click', () => moveCarousel(1));
document.getElementById('prevBtn').addEventListener('click', () => moveCarousel(-1));

// Debounced resize handler
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    cardWidth = cards[0].offsetWidth + 30;
    updateCarousel(false);
  }, 100);
});
