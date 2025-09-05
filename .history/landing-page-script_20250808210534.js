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



// Simple, reliable infinite carousel
let currentIndex = 0;
let isTransitioning = false;
let cardWidth = 0;
let gap = 30;
let track;
let allCards = [];
let originalCards = [];

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initCarousel();
});

function initCarousel() {
  track = document.getElementById('carousel-track');
  originalCards = Array.from(track.querySelectorAll('.course-card:not(.clone)'));
  
  if (originalCards.length === 0) return;
  
  // Remove any existing clones first
  const existingClones = track.querySelectorAll('.clone');
  existingClones.forEach(clone => clone.remove());
  
  // Calculate card width including gap
  calculateCardWidth();
  
  // Create clones for infinite scroll
  createClones();
  
  // Set starting position (start from first real card)
  currentIndex = originalCards.length;
  updatePosition(false);
  
  // Add event listeners
  addEventListeners();
}

function calculateCardWidth() {
  const card = originalCards[0];
  const cardRect = card.getBoundingClientRect();
  cardWidth = cardRect.width;
  
  // Get gap from computed style
  const trackStyles = window.getComputedStyle(track);
  const gapValue = trackStyles.gap || trackStyles.columnGap || '30px';
  gap = parseInt(gapValue) || 30;
}

function createClones() {
  // Clone original cards and append to end
  originalCards.forEach(card => {
    const clone = card.cloneNode(true);
    clone.classList.add('clone');
    track.appendChild(clone);
  });
  
  // Clone original cards and prepend to beginning  
  for (let i = originalCards.length - 1; i >= 0; i--) {
    const clone = originalCards[i].cloneNode(true);
    clone.classList.add('clone');
    track.insertBefore(clone, track.firstChild);
  }
  
  // Update all cards array
  allCards = Array.from(track.children);
}

function updatePosition(animate = true) {
  const translateX = -(currentIndex * (cardWidth + gap));
  
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
  updatePosition(true);
}

function handleTransitionEnd() {
  if (!isTransitioning) return;
  
  isTransitioning = false;
  
  // Reset position if we've moved past the boundaries
  if (currentIndex >= originalCards.length * 2) {
    // We're in the end clones, jump back to start of real cards
    currentIndex = originalCards.length;
    updatePosition(false);
  } else if (currentIndex < originalCards.length) {
    // We're in the start clones, jump to end of real cards
    currentIndex = originalCards.length * 2 - 1;
    updatePosition(false);
  }
}

function addEventListeners() {
  // Transition end
  track.addEventListener('transitionend', handleTransitionEnd);
  
  // Navigation buttons
  const nextBtn = document.querySelector('.next-btn');
  const prevBtn = document.querySelector('.prev-btn');
  
  if (nextBtn) nextBtn.addEventListener('click', () => moveCarousel(1));
  if (prevBtn) prevBtn.addEventListener('click', () => moveCarousel(-1));
  
  // Handle window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      calculateCardWidth();
      updatePosition(false);
    }, 150);
  });
}

// Mobile menu toggle (keeping your existing functionality)
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

// Typing effect for hero section (if you have it)
const codeSnippets = [
  `# Welcome to Python Programming
def greet_learner():
    print("Hello, future coder!")
    print("Ready to start your journey?")

greet_learner()`,
  
  `<!-- HTML Structure -->
<div class="welcome">
    <h1>Learn Web Development</h1>
    <p>Build amazing websites</p>
    <button>Get Started</button>
</div>`,
  
  `/* CSS Styling */
.hero {
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
    padding: 2rem;
    border-radius: 10px;
    animation: fadeIn 2s ease;
}`
];

function typeCode() {
  const codeElement = document.getElementById('typing-code');
  const languageIndicator = document.querySelector('.language-indicator');
  
  if (!codeElement) return;
  
  let snippetIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  
  function type() {
    const currentSnippet = codeSnippets[snippetIndex];
    
    if (!isDeleting && charIndex < currentSnippet.length) {
      codeElement.textContent = currentSnippet.substring(0, charIndex + 1);
      charIndex++;
      setTimeout(type, 50);
    } else if (isDeleting && charIndex > 0) {
      codeElement.textContent = currentSnippet.substring(0, charIndex - 1);
      charIndex--;
      setTimeout(type, 25);
    } else if (!isDeleting && charIndex === currentSnippet.length) {
      setTimeout(() => { isDeleting = true; type(); }, 2000);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      snippetIndex = (snippetIndex + 1) % codeSnippets.length;
      
      // Update language indicator
      const languages = ['.py', '.html', '.css'];
      languageIndicator.textContent = languages[snippetIndex];
      
      setTimeout(type, 500);
    }
  }
  
  type();
}

// Start typing effect
document.addEventListener('DOMContentLoaded', typeCode);