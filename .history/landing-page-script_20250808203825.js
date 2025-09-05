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



let currentIndex = 0;
const track = document.getElementById('carousel-track');
const cards = document.querySelectorAll('.course-card');
const totalCards = cards.length;

// Calculate how many cards to show based on screen size
function getCardsPerView() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 768) {
        return 1; // Mobile: show 1 card
    } else if (screenWidth <= 1200) {
        return 2; // Tablet: show 2 cards
    } else {
        return 3; // Desktop: show 3 cards
    }
}

// Calculate the maximum index we can scroll to
function getMaxIndex() {
    const cardsPerView = getCardsPerView();
    return Math.max(0, totalCards - cardsPerView);
}

// Update carousel position
function updateCarousel() {
    if (!track || totalCards === 0) return;
    
    const cardsPerView = getCardsPerView();
    const cardWidth = cards[0].offsetWidth;
    const gap = 30; // Gap between cards as defined in CSS
    const translateX = currentIndex * (cardWidth + gap);
    
    track.style.transform = `translateX(-${translateX}px)`;
}

// Move carousel function
function moveCarousel(direction) {
    const maxIndex = getMaxIndex();
    
    if (direction === 1) { // Next
        currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
    } else { // Previous
        currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
    }
    
    updateCarousel();
}

// Handle window resize
function handleResize() {
    const maxIndex = getMaxIndex();
    
    // Adjust current index if it's now out of bounds
    if (currentIndex > maxIndex) {
        currentIndex = maxIndex;
    }
    
    updateCarousel();
}

// Initialize carousel
function initCarousel() {
    updateCarousel();
    
    // Add event listeners
    window.addEventListener('resize', handleResize);
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            moveCarousel(-1);
        } else if (e.key === 'ArrowRight') {
            moveCarousel(1);
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initCarousel);

// Mobile menu functionality (from your existing code)
function myFunction() {
    const links = document.getElementById("myLinks");
    const icon = document.querySelector(".menu-icon");
    
    if (links.classList.contains("show")) {
        links.classList.remove("show");
        icon.classList.remove("active");
    } else {
        links.classList.add("show");
        icon.classList.add("active");
    }
}
