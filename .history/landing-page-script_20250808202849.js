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
let currentIndex = 3;  // starting index after prepended clones
let isTransitioning = false;

function setupInfiniteLoop() {
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

function updateCarousel(animate = true) {
  const cardWidth = cards[0].offsetWidth + 30; // 30 = gap/margin between cards
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

// Helper to force reflow (fixes flicker on instant jump)
function forceReflow() {
  return track.offsetHeight; // reading offsetHeight forces reflow
}

track.addEventListener('transitionend', () => {
  isTransitioning = false;

  // If we’ve moved past clones at the end
  if (currentIndex >= totalCards + 3) {
    currentIndex = 3;
    updateCarousel(false);
    forceReflow(); // force reflow before next slide, avoids flicker
  }
  // If we’ve moved past clones at the start
  else if (currentIndex < 3) {
    currentIndex = totalCards + 2;
    updateCarousel(false);
    forceReflow();
  }
});

setupInfiniteLoop();

document.getElementById('nextBtn').addEventListener('click', () => moveCarousel(1));
document.getElementById('prevBtn').addEventListener('click', () => moveCarousel(-1));

window.addEventListener('resize', () => updateCarousel(false));

