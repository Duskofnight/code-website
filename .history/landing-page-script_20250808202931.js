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
let isInitialized = false;

function setupInfiniteLoop() {
  // Only run setup once
  if (isInitialized) return;
  
  // Clear any existing clones first
  const existingClones = track.querySelectorAll('.clone');
  existingClones.forEach(clone => clone.remove());
  
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
  
  isInitialized = true;
  updateCarousel(false);
}

function updateCarousel(animate = true) {
  const cardWidth = cards[0].offsetWidth + 30; // 30 = gap/margin between cards
  const translateX = -currentIndex * cardWidth;

  if (animate) {
    track.style.transition = 'transform 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)';
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

// Remove the forceReflow function as it's not necessary with proper timing

track.addEventListener('transitionend', (e) => {
  // Only handle events from the track itself, not child elements
  if (e.target !== track) return;
  
  isTransitioning = false;

  // Use requestAnimationFrame to ensure smooth transitions
  requestAnimationFrame(() => {
    // If we've moved past clones at the end
    if (currentIndex >= totalCards + 3) {
      currentIndex = 3;
      updateCarousel(false);
    }
    // If we've moved past clones at the start
    else if (currentIndex < 3) {
      currentIndex = totalCards + 2;
      updateCarousel(false);
    }
  });
});

// Initialize once when page loads
setupInfiniteLoop();

// Button event listeners with debouncing
let buttonTimeout = null;
function handleButtonClick(direction) {
  if (buttonTimeout) return; // Prevent rapid clicking
  
  moveCarousel(direction);
  
  // Brief cooldown to prevent rapid clicking
  buttonTimeout = setTimeout(() => {
    buttonTimeout = null;
  }, 100);
}

document.getElementById('nextBtn').addEventListener('click', () => handleButtonClick(1));
document.getElementById('prevBtn').addEventListener('click', () => handleButtonClick(-1));

// Debounced resize handler
let resizeTimeout = null;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    updateCarousel(false);
  }, 150);
});
