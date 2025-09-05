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



// Pure CSS Transform Carousel - Eliminates JS timing issues
class PureCSSCarousel {
  constructor() {
    this.track = null;
    this.originalCards = [];
    this.currentIndex = 0;
    this.cardWidth = 0;
    this.gap = 30;
    this.totalCards = 0;
    this.isMoving = false;
    
    this.init();
  }
  
  init() {
    // Wait for DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }
  
  setup() {
    this.track = document.getElementById('carousel-track');
    if (!this.track) return;
    
    // Get original cards
    this.originalCards = Array.from(this.track.querySelectorAll('.course-card:not(.css-clone)'));
    this.totalCards = this.originalCards.length;
    
    if (this.totalCards === 0) return;
    
    // Clean existing clones
    this.track.querySelectorAll('.css-clone').forEach(clone => clone.remove());
    
    // Setup CSS optimization
    this.optimizeCSS();
    
    // Calculate dimensions after a frame
    requestAnimationFrame(() => {
      this.calculateDimensions();
      this.createClones();
      this.setStartPosition();
      this.bindEvents();
    });
  }
  
  optimizeCSS() {
    // Add CSS optimizations directly to the track
    this.track.style.willChange = 'transform';
    this.track.style.backfaceVisibility = 'hidden';
    this.track.style.perspective = '1000px';
    this.track.style.transformStyle = 'preserve-3d';
  }
  
  calculateDimensions() {
    // Force layout
    this.track.offsetHeight;
    
    // Get accurate measurements
    const firstCard = this.originalCards[0];
    const style = window.getComputedStyle(firstCard);
    const rect = firstCard.getBoundingClientRect();
    
    this.cardWidth = rect.width;
    
    // Get gap from parent container
    const trackStyle = window.getComputedStyle(this.track);
    this.gap = parseInt(trackStyle.gap || trackStyle.columnGap || '30') || 30;
  }
  
  createClones() {
    // Create end clones
    this.originalCards.forEach(card => {
      const clone = card.cloneNode(true);
      clone.classList.add('css-clone');
      this.track.appendChild(clone);
    });
    
    // Create start clones (reverse order)
    const startClones = [];
    for (let i = this.totalCards - 1; i >= 0; i--) {
      const clone = this.originalCards[i].cloneNode(true);
      clone.classList.add('css-clone');
      startClones.push(clone);
    }
    
    // Insert at beginning
    startClones.forEach(clone => {
      this.track.insertBefore(clone, this.track.firstChild);
    });
  }
  
  setStartPosition() {
    // Start at first real card (after clones)
    this.currentIndex = this.totalCards;
    this.updatePosition(false);
  }
  
  updatePosition(animate = true) {
    const translateX = -(this.currentIndex * (this.cardWidth + this.gap));
    
    if (animate) {
      // Use CSS transition
      this.track.style.transition = 'transform 0.35s cubic-bezier(0.23, 1, 0.32, 1)';
    } else {
      // No transition for instant moves
      this.track.style.transition = 'none';
    }
    
    // Apply transform
    this.track.style.transform = `translate3d(${translateX}px, 0, 0)`;
  }
  
  move(direction) {
    if (this.isMoving) return;
    
    this.isMoving = true;
    this.currentIndex += direction;
    
    // Move with animation
    this.updatePosition(true);
    
    // Handle infinite loop after transition
    setTimeout(() => {
      this.handleInfiniteLoop();
      this.isMoving = false;
    }, 350); // Match CSS transition duration
  }
  
  handleInfiniteLoop() {
    let needsReset = false;
    let newIndex = this.currentIndex;
    
    if (this.currentIndex >= this.totalCards * 2) {
      // At end clones, jump to start of real cards
      newIndex = this.totalCards;
      needsReset = true;
    } else if (this.currentIndex < this.totalCards) {
      // At start clones, jump to end of real cards  
      newIndex = this.totalCards * 2 - 1;
      needsReset = true;
    }
    
    if (needsReset) {
      this.currentIndex = newIndex;
      // Use double RAF for smooth reset
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.updatePosition(false);
        });
      });
    }
  }
  
  handleResize() {
    this.calculateDimensions();
    this.updatePosition(false);
  }
  
  bindEvents() {
    // Navigation buttons
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.move(1));
    }
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.move(-1));
    }
    
    // Resize handler
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => this.handleResize(), 100);
    });
  }
}

// Simplified initialization
let carousel = null;

function initCarousel() {
  if (carousel) return;
  carousel = new PureCSSCarousel();
}

// Multiple entry points
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCarousel);
} else {
  initCarousel();
}

window.addEventListener('load', () => {
  if (!carousel) initCarousel();
});

// Global move function
function moveCarousel(direction) {
  if (carousel) carousel.move(direction);
}

// Mobile menu
function myFunction() {
  const links = document.getElementById("myLinks");
  const menu = document.querySelector(".menu-icon");
  
  if (links && menu) {
    const isOpen = links.classList.contains("show");
    
    if (isOpen) {
      links.classList.remove("show");
      menu.classList.remove("active");
    } else {
      links.classList.add("show");
      menu.classList.add("active");
    }
  }
}

// Typing effect
let typingInterval;

function startTyping() {
  const codeEl = document.getElementById('typing-code');
  const langEl = document.querySelector('.language-indicator');
  
  if (!codeEl || !langEl) return;
  
  const snippets = [
    { code: 'def hello_world():\n    print("Welcome to coding!")\n    return "Let\'s build something amazing"', lang: '.py' },
    { code: '<div class="container">\n    <h1>Hello World</h1>\n    <p>Your coding journey starts here</p>\n</div>', lang: '.html' },
    { code: '.container {\n    background: #ff6b6b;\n    padding: 2rem;\n    border-radius: 8px;\n}', lang: '.css' }
  ];
  
  let snippetIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  
  function type() {
    const current = snippets[snippetIndex];
    const text = current.code;
    
    if (isDeleting) {
      codeEl.textContent = text.substring(0, charIndex - 1);
      charIndex--;
      
      if (charIndex === 0) {
        isDeleting = false;
        snippetIndex = (snippetIndex + 1) % snippets.length;
        langEl.textContent = snippets[snippetIndex].lang;
        setTimeout(type, 200);
      } else {
        setTimeout(type, 20);
      }
    } else {
      codeEl.textContent = text.substring(0, charIndex + 1);
      charIndex++;
      
      if (charIndex === text.length) {
        setTimeout(() => { isDeleting = true; type(); }, 2000);
      } else {
        setTimeout(type, 40);
      }
    }
  }
  
  langEl.textContent = snippets[0].lang;
  type();
}

document.addEventListener('DOMContentLoaded', startTyping);