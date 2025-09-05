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



let currentIndex = 3; // Start at original first course
    const track = document.getElementById('carousel-track');
    let isTransitioning = false;

    // Initialize carousel position
    function initializeCarousel() {
      const cardWidth = 350 + 30; // card width + gap (approximate)
      const translateX = -currentIndex * cardWidth;
      track.style.transform = `translateX(${translateX}px)`;
    }

    function updateCarousel(animate = true) {
      const cardWidth = document.querySelector('.course-card').offsetWidth + 30; // actual card width + gap
      const translateX = -currentIndex * cardWidth;
      
      if (animate && !isTransitioning) {
        track.style.transition = 'transform 0.3s ease-out';
        isTransitioning = true;
        
        setTimeout(() => {
          isTransitioning = false;
        }, 300);
      } else if (!animate) {
        track.style.transition = 'none';
      }
      
      track.style.transform = `translateX(${translateX}px)`;
    }

    function moveCarousel(direction) {
      if (isTransitioning) return;
      
      currentIndex += direction;
      updateCarousel(true);
      
      // Handle infinite loop reset after transition
      setTimeout(() => {
        if (currentIndex >= 9) { // 3 original + 6 courses
          currentIndex = 3;
          updateCarousel(false);
        } else if (currentIndex < 3) {
          currentIndex = 8; // 3 + 5 (last original course index)
          updateCarousel(false);
        }
      }, 300);
    }

    // Initialize on load
    window.addEventListener('load', initializeCarousel);
    
    // Handle window resize
    window.addEventListener('resize', () => {
      updateCarousel(false);
    });