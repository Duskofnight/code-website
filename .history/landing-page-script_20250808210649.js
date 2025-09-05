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



// Ultra-smooth carousel with proper timing and state management
class UltraSmoothCarousel {
  constructor() {
    this.track = null;
    this.originalCards = [];
    this.currentIndex = 0;
    this.isTransitioning = false;
    this.cardWidth = 0;
    this.gap = 30;
    this.isReady = false;
    this.animationFrame = null;
    
    // Bind methods
    this.handleTransitionEnd = this.handleTransitionEnd.bind(this);
    this.handleResize = this.handleResize.bind(this);
    
    this.init();
  }
  
  init() {
    // Wait for everything to be loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      // Small delay to ensure all styles are applied
      setTimeout(() => this.setup(), 100);
    }
  }
  
  setup() {
    this.track = document.getElementById('carousel-track');
    if (!this.track) return;
    
    this.originalCards = Array.from(this.track.querySelectorAll('.course-card:not(.carousel-clone)'));
    if (this.originalCards.length === 0) return;
    
    // Clean any existing clones
    this.cleanExistingClones();
    
    // Wait for fonts and images to load, then setup
    this.waitForLoad().then(() => {
      this.calculateDimensions();
      this.createInfiniteLoop();
      this.setInitialPosition();
      this.bindEvents();
      this.isReady = true;
    });
  }
  
  waitForLoad() {
    return new Promise((resolve) => {
      let loadedCount = 0;
      const totalItems = this.originalCards.length;
      
      // Check if images are loaded
      const images = this.track.querySelectorAll('img');
      if (images.length === 0) {
        resolve();
        return;
      }
      
      images.forEach(img => {
        if (img.complete) {
          loadedCount++;
        } else {
          img.addEventListener('load', () => {
            loadedCount++;
            if (loadedCount >= images.length) resolve();
          });
          img.addEventListener('error', () => {
            loadedCount++;
            if (loadedCount >= images.length) resolve();
          });
        }
      });
      
      if (loadedCount >= images.length) resolve();
      
      // Fallback timeout
      setTimeout(resolve, 500);
    });
  }
  
  cleanExistingClones() {
    const clones = this.track.querySelectorAll('.carousel-clone');
    clones.forEach(clone => clone.remove());
  }
  
  calculateDimensions() {
    // Force layout recalculation
    this.track.offsetHeight;
    
    const firstCard = this.originalCards[0];
    const rect = firstCard.getBoundingClientRect();
    this.cardWidth = rect.width;
    
    // Get gap from computed styles
    const computedStyle = window.getComputedStyle(this.track);
    const gap = computedStyle.gap || computedStyle.columnGap || '30px';
    this.gap = parseInt(gap) || 30;
  }
  
  createInfiniteLoop() {
    const fragment = document.createDocumentFragment();
    
    // Create clones for the end
    this.originalCards.forEach(card => {
      const clone = card.cloneNode(true);
      clone.classList.add('carousel-clone', 'end-clone');
      fragment.appendChild(clone);
    });
    
    this.track.appendChild(fragment);
    
    // Create clones for the beginning
    const beginningFragment = document.createDocumentFragment();
    for (let i = this.originalCards.length - 1; i >= 0; i--) {
      const clone = this.originalCards[i].cloneNode(true);
      clone.classList.add('carousel-clone', 'start-clone');
      beginningFragment.appendChild(clone);
    }
    
    this.track.insertBefore(beginningFragment, this.track.firstChild);
    
    // Set starting position
    this.currentIndex = this.originalCards.length;
  }
  
  setInitialPosition() {
    const translateX = -(this.currentIndex * (this.cardWidth + this.gap));
    this.track.style.transition = 'none';
    this.track.style.transform = `translateX(${translateX}px)`;
    this.track.style.willChange = 'transform';
    
    // Force repaint
    this.track.offsetHeight;
  }
  
  move(direction) {
    if (!this.isReady || this.isTransitioning) return;
    
    this.isTransitioning = true;
    this.currentIndex += direction;
    
    this.animateToPosition();
  }
  
  animateToPosition() {
    const translateX = -(this.currentIndex * (this.cardWidth + this.gap));
    
    // Use requestAnimationFrame for smoother animation
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    
    this.animationFrame = requestAnimationFrame(() => {
      this.track.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)';
      this.track.style.transform = `translateX(${translateX}px)`;
    });
  }
  
  handleTransitionEnd(e) {
    if (e.target !== this.track || e.propertyName !== 'transform') return;
    
    this.isTransitioning = false;
    
    // Check if we need to reset position
    const totalCards = this.originalCards.length;
    
    if (this.currentIndex >= totalCards * 2) {
      // At end clones, jump to beginning of real cards
      this.currentIndex = totalCards;
      this.jumpToPosition();
    } else if (this.currentIndex < totalCards) {
      // At start clones, jump to end of real cards
      this.currentIndex = totalCards * 2 - 1;
      this.jumpToPosition();
    }
  }
  
  jumpToPosition() {
    const translateX = -(this.currentIndex * (this.cardWidth + this.gap));
    
    // Use double requestAnimationFrame to ensure smooth jump
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.track.style.transition = 'none';
        this.track.style.transform = `translateX(${translateX}px)`;
        this.track.offsetHeight; // Force repaint
      });
    });
  }
  
  handleResize() {
    if (!this.isReady) return;
    
    this.calculateDimensions();
    
    // Update position without animation
    const translateX = -(this.currentIndex * (this.cardWidth + this.gap));
    this.track.style.transition = 'none';
    this.track.style.transform = `translateX(${translateX}px)`;
    this.track.offsetHeight;
  }
  
  bindEvents() {
    // Transition end
    this.track.addEventListener('transitionend', this.handleTransitionEnd);
    
    // Navigation buttons
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.move(1);
      });
    }
    
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.move(-1);
      });
    }
    
    // Debounced resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(this.handleResize, 150);
    });
    
    // Visibility change handler
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.isReady) {
        // Recalculate when tab becomes visible again
        setTimeout(() => this.handleResize(), 100);
      }
    });
  }
}

// Initialize carousel
let carousel;

// Multiple initialization points to ensure it works
document.addEventListener('DOMContentLoaded', () => {
  carousel = new UltraSmoothCarousel();
});

window.addEventListener('load', () => {
  if (!carousel || !carousel.isReady) {
    carousel = new UltraSmoothCarousel();
  }
});

// Global function for backward compatibility
function moveCarousel(direction) {
  if (carousel && carousel.isReady) {
    carousel.move(direction);
  }
}

// Mobile menu toggle
function myFunction() {
  const links = document.getElementById("myLinks");
  const icon = document.querySelector(".menu-icon");
  
  if (links && icon) {
    links.classList.toggle("show");
    icon.classList.toggle("active");
  }
}

// Typing animation for code block
const codeSnippets = [
  {
    code: `# Python - Your First Program
def welcome_coder():
    name = "Future Developer"
    print(f"Hello {name}!")
    print("Let's build something amazing")

welcome_coder()`,
    lang: '.py'
  },
  {
    code: `<!-- HTML - Structure the Web -->
<div class="hero-section">
    <h1>Build Your Dreams</h1>
    <p>Code. Create. Inspire.</p>
    <button class="cta-btn">Start Learning</button>
</div>`,
    lang: '.html'
  },
  {
    code: `/* CSS - Style with Purpose */
.hero-section {
    background: linear-gradient(135deg, #667eea, #764ba2);
    padding: 4rem 2rem;
    text-align: center;
    border-radius: 12px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}`,
    lang: '.css'
  }
];

function initTypingEffect() {
  const codeElement = document.getElementById('typing-code');
  const langIndicator = document.querySelector('.language-indicator');
  
  if (!codeElement || !langIndicator) return;
  
  let currentSnippet = 0;
  let currentChar = 0;
  let isDeleting = false;
  let typeTimeout;
  
  function typeWriter() {
    const snippet = codeSnippets[currentSnippet];
    const text = snippet.code;
    
    if (!isDeleting && currentChar <= text.length) {
      codeElement.textContent = text.substring(0, currentChar);
      currentChar++;
      typeTimeout = setTimeout(typeWriter, 30);
    } else if (isDeleting && currentChar >= 0) {
      codeElement.textContent = text.substring(0, currentChar);
      currentChar--;
      typeTimeout = setTimeout(typeWriter, 15);
    } else if (!isDeleting && currentChar > text.length) {
      setTimeout(() => {
        isDeleting = true;
        typeWriter();
      }, 2500);
    } else if (isDeleting && currentChar < 0) {
      isDeleting = false;
      currentSnippet = (currentSnippet + 1) % codeSnippets.length;
      langIndicator.textContent = codeSnippets[currentSnippet].lang;
      currentChar = 0;
      setTimeout(typeWriter, 300);
    }
  }
  
  // Set initial language
  langIndicator.textContent = codeSnippets[0].lang;
  typeWriter();
}

// Start typing effect
document.addEventListener('DOMContentLoaded', initTypingEffect);