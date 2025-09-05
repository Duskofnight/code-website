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



class SmoothCarousel {
  constructor() {
    this.track = document.getElementById('carousel-track');
    this.cards = Array.from(document.querySelectorAll('.course-card'));
    this.totalCards = this.cards.length;
    this.currentIndex = 0;
    this.isTransitioning = false;
    this.cardWidth = 0;
    this.gap = 30; // Gap between cards
    this.isInitialized = false;
    
    this.init();
  }

  init() {
    // Wait for images and fonts to load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    // Calculate dimensions
    this.calculateDimensions();
    
    // Create infinite loop by cloning cards ONCE
    this.createInfiniteLoop();
    
    // Set initial position
    this.setInitialPosition();
    
    // Bind events
    this.bindEvents();
    
    this.isInitialized = true;
  }

  calculateDimensions() {
    // Get the computed style to ensure accurate measurements
    const cardStyle = window.getComputedStyle(this.cards[0]);
    const cardRect = this.cards[0].getBoundingClientRect();
    
    this.cardWidth = cardRect.width;
    
    // Get gap from CSS or use default
    const trackStyle = window.getComputedStyle(this.track);
    const gapMatch = trackStyle.gap.match(/(\d+)/);
    this.gap = gapMatch ? parseInt(gapMatch[1]) : 30;
  }

  createInfiniteLoop() {
    // Only create clones if they don't already exist
    if (this.track.querySelector('.carousel-clone')) return;

    // Clone cards for infinite scroll
    const clonesNeeded = Math.min(3, this.totalCards);
    
    // Clone last cards and prepend them
    for (let i = this.totalCards - clonesNeeded; i < this.totalCards; i++) {
      const clone = this.cards[i].cloneNode(true);
      clone.classList.add('carousel-clone');
      clone.classList.add('clone-start');
      this.track.insertBefore(clone, this.track.firstChild);
    }
    
    // Clone first cards and append them
    for (let i = 0; i < clonesNeeded; i++) {
      const clone = this.cards[i].cloneNode(true);
      clone.classList.add('carousel-clone');
      clone.classList.add('clone-end');
      this.track.appendChild(clone);
    }

    // Update cards array to include all elements
    this.allCards = Array.from(this.track.children);
    this.totalWithClones = this.allCards.length;
    this.startIndex = clonesNeeded; // Start after the prepended clones
    this.currentIndex = this.startIndex;
  }

  setInitialPosition() {
    // Position at the start of real cards (after cloned cards)
    const translateX = -(this.currentIndex * (this.cardWidth + this.gap));
    this.track.style.transition = 'none';
    this.track.style.transform = `translateX(${translateX}px)`;
    
    // Force reflow
    this.track.offsetHeight;
  }

  moveCarousel(direction) {
    if (this.isTransitioning || !this.isInitialized) return;

    this.isTransitioning = true;
    this.currentIndex += direction;
    
    const translateX = -(this.currentIndex * (this.cardWidth + this.gap));
    
    // Enable smooth transition
    this.track.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    this.track.style.transform = `translateX(${translateX}px)`;
  }

  handleTransitionEnd() {
    this.isTransitioning = false;
    
    // Check if we need to reset position for infinite loop
    const clonesNeeded = Math.min(3, this.totalCards);
    
    if (this.currentIndex >= this.totalCards + clonesNeeded) {
      // We're at the end clones, jump to the beginning of real cards
      this.currentIndex = clonesNeeded;
      this.jumpToPosition();
    } else if (this.currentIndex < clonesNeeded) {
      // We're at the start clones, jump to the end of real cards
      this.currentIndex = this.totalCards + clonesNeeded - 1;
      this.jumpToPosition();
    }
  }

  jumpToPosition() {
    const translateX = -(this.currentIndex * (this.cardWidth + this.gap));
    this.track.style.transition = 'none';
    this.track.style.transform = `translateX(${translateX}px)`;
    
    // Force reflow to ensure the jump happens
    this.track.offsetHeight;
  }

  handleResize() {
    // Recalculate dimensions
    this.calculateDimensions();
    
    // Update position without transition
    const translateX = -(this.currentIndex * (this.cardWidth + this.gap));
    this.track.style.transition = 'none';
    this.track.style.transform = `translateX(${translateX}px)`;
  }

  bindEvents() {
    // Navigation buttons
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.moveCarousel(1));
    }
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.moveCarousel(-1));
    }

    // Transition end event
    this.track.addEventListener('transitionend', (e) => {
      // Only handle transform transitions
      if (e.propertyName === 'transform') {
        this.handleTransitionEnd();
      }
    });

    // Debounced resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (this.isInitialized) {
          this.handleResize();
        }
      }, 100);
    });
  }
}

// Initialize carousel
let carousel;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    carousel = new SmoothCarousel();
  });
} else {
  carousel = new SmoothCarousel();
}

// Also ensure it works if called after page load
window.addEventListener('load', () => {
  if (!carousel || !carousel.isInitialized) {
    carousel = new SmoothCarousel();
  }
});

// Global functions for backward compatibility
function moveCarousel(direction) {
  if (carousel && carousel.isInitialized) {
    carousel.moveCarousel(direction);
  }
}

// Menu toggle function (keeping your existing mobile menu functionality)
function myFunction() {
  var links = document.getElementById("myLinks");
  var icon = document.querySelector(".menu-icon");
  
  if (links.classList.contains("show")) {
    links.classList.remove("show");
    icon.classList.remove("active");
  } else {
    links.classList.add("show");
    icon.classList.add("active");
  }
}