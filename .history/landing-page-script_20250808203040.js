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
let currentIndex = 0;  // Real index (0 to totalCards-1)
let displayIndex = 0;  // Visual index for smooth infinite loop
let isTransitioning = false;
let cardWidth = 0;
let isInitialized = false;

function calculateCardWidth() {
  if (cards.length > 0) {
    const styles = getComputedStyle(cards[0]);
    const marginLeft = parseInt(styles.marginLeft) || 0;
    const marginRight = parseInt(styles.marginRight) || 0;
    cardWidth = cards[0].offsetWidth + marginLeft + marginRight;
  }
}

function setupInfiniteLoop() {
  if (isInitialized) return;
  
  // Clear any existing clones
  const existingClones = track.querySelectorAll('.clone');
  existingClones.forEach(clone => clone.remove());
  
  // Calculate card width first
  calculateCardWidth();
  
  // Create enough clones for seamless looping (more clones = smoother)
  const clonesNeeded = Math.max(5, Math.ceil(window.innerWidth / cardWidth) + 2);
  
  // Clone cards at the end
  for (let i = 0; i < clonesNeeded; i++) {
    const clone = cards[i % totalCards].cloneNode(true);
    clone.classList.add('clone');
    track.appendChild(clone);
  }
  
  // Clone cards at the beginning
  for (let i = 0; i < clonesNeeded; i++) {
    const clone = cards[(totalCards - clonesNeeded + i) % totalCards].cloneNode(true);
    clone.classList.add('clone');
    track.insertBefore(clone, track.firstChild);
  }
  
  // Set initial position to show first real card
  displayIndex = clonesNeeded;
  isInitialized = true;
  updateCarouselPosition(false);
}

function updateCarouselPosition(animate = true) {
  calculateCardWidth(); // Recalculate in case of resize
  const translateX = -displayIndex * cardWidth;
  
  if (animate) {
    track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)';
  } else {
    track.style.transition = 'none';
  }
  
  track.style.transform = `translateX(${translateX}px)`;
}

function moveCarousel(direction) {
  if (isTransitioning || !isInitialized) return;
  
  isTransitioning = true;
  
  // Update both indices
  currentIndex = (currentIndex + direction + totalCards) % totalCards;
  displayIndex += direction;
  
  updateCarouselPosition(true);
}

// The key to zero glitch: handle the reset during transition, not after
track.addEventListener('transitionend', (e) => {
  if (e.target !== track) return;
  
  const clonesNeeded = Math.max(5, Math.ceil(window.innerWidth / cardWidth) + 2);
  const totalVisualCards = totalCards + (clonesNeeded * 2);
  
  // Reset position seamlessly if we're at the boundaries
  let needsReset = false;
  let newDisplayIndex = displayIndex;
  
  if (displayIndex >= totalVisualCards - clonesNeeded) {
    // We're at the end clones, jump to equivalent position at start
    newDisplayIndex = clonesNeeded + (displayIndex - (totalCards + clonesNeeded));
    needsReset = true;
  } else if (displayIndex < clonesNeeded) {
    // We're at the start clones, jump to equivalent position at end
    newDisplayIndex = totalCards + clonesNeeded + displayIndex - clonesNeeded;
    needsReset = true;
  }
  
  if (needsReset) {
    // Instantly move to new position without animation
    displayIndex = newDisplayIndex;
    track.style.transition = 'none';
    track.style.transform = `translateX(${-displayIndex * cardWidth}px)`;
    
    // Force a reflow to ensure the instant movement is applied
    track.offsetHeight;
  }
  
  isTransitioning = false;
});

// Smooth initialization
function initialize() {
  setupInfiniteLoop();
}

// Optimized resize handler
let resizeTimer = null;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (isInitialized) {
      calculateCardWidth();
      updateCarouselPosition(false);
    }
  }, 100);
});

// Button handlers with proper timing
document.getElementById('nextBtn').addEventListener('click', () => {
  moveCarousel(1);
});

document.getElementById('prevBtn').addEventListener('click', () => {
  moveCarousel(-1);
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}
