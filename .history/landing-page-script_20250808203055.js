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
let currentIndex = 3;  // start after the prepended clones
let isTransitioning = false;

function setupInfiniteLoop() {
  if (!track.querySelector('.clone')) {
    // Clone first 3 and append
    for (let i = 0; i < 3; i++) {
      const clone = cards[i].cloneNode(true);
      clone.classList.add('clone');
      track.appendChild(clone);
    }

    // Clone last 3 and prepend
    for (let i = totalCards - 3; i < totalCards; i++) {
      const clone = cards[i].cloneNode(true);
      clone.classList.add('clone');
      track.insertBefore(clone, track.firstChild);
    }
  }
  updateCarousel(false);
}

function updateCarousel(animate = true) {
  const cardWidth = cards[0].offsetWidth + 30; // 30 = margin/gap, adjust as needed
  const translateX = -currentIndex * cardWidth;

  if (animate) {
    track.style.transition = 'transform 0.4s ease';
  } else {
    track.style.transition = 'none';
  }

  track.style.transform = `translateX(${translateX}px)`;
}

function moveCarousel(direction) {
  if (isTransitioning) return;

  isTransitioning = true;
  currentIndex += direction;
  updateCarousel(true);
}

// Listen for the transition end to fix infinite loop "jump"
track.addEventListener('transitionend', () => {
  isTransitioning = false;

  if (currentIndex >= totalCards + 3) {
    // Jump back to the real first slide without animation
    currentIndex = 3;
    updateCarousel(false);
  } else if (currentIndex < 3) {
    // Jump to the real last slide without animation
    currentIndex = totalCards + 2;
    updateCarousel(false);
  }
});

// Initialize
setupInfiniteLoop();

// Example buttons hookup:
document.getElementById('nextBtn').addEventListener('click', () => moveCarousel(1));
document.getElementById('prevBtn').addEventListener('click', () => moveCarousel(-1));

// On window resize, update position without animation
window.addEventListener('resize', () => updateCarousel(false));
