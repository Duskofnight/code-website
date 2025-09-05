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
let cards = Array.from(document.querySelectorAll('.course-card'));
let currentIndex = 0;
let isTransitioning = false;
let cardWidth;

// Debounce resize
let resizeTimeout;

// Setup carousel after full page load
window.addEventListener('load', () => {
  cardWidth = cards[0].offsetWidth + 30; // 30 = gap/margin between cards
  updateCarousel(false);
});

// Move carousel left or right
function moveCarousel(direction) {
  if (isTransitioning) return;

  isTransitioning = true;

  if (direction > 0) {
    // Move right: generate a new card and append
    const newCard = createNewCard();
    track.appendChild(newCard);
    cards.push(newCard);
  } else if (direction < 0 && currentIndex > 0) {
    // Move left: optional, you can remove cards if needed
  }

  currentIndex += direction;
  updateCarousel(true);
}

// Update carousel position
function updateCarousel(animate = true) {
  const translateX = -currentIndex * cardWidth;

  track.style.transition = animate ? 'transform 0.4s ease' : 'none';
  track.style.transform = `translateX(${translateX}px)`;
}

// Handle transition end
track.addEventListener('transitionend', () => {
  isTransitioning = false;
});

// Navigation buttons
document.getElementById('nextBtn').addEventListener('click', () => moveCarousel(1));
document.getElementById('prevBtn').addEventListener('click', () => {
  if (currentIndex > 0) moveCarousel(-1);
});

// Debounced resize handler
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    cardWidth = cards[0].offsetWidth + 30;
    updateCarousel(false);
  }, 100);
});

// Helper: create a new card element
function createNewCard() {
  const card = document.createElement('div');
  card.className = 'course-card';
  card.innerHTML = `<h3>New Course ${cards.length + 1}</h3><p>Dynamic content!</p>`;
  return card;
}