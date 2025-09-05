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



   let currentIndex = 3; // Start showing original first course in center
    const track = document.getElementById('carousel-track');
    let isTransitioning = false;

    function moveCarousel(direction) {
      if (isTransitioning) return;
      
      currentIndex += direction;
      isTransitioning = true;
      
      // Calculate position
      const cardWidth = 350; // Fixed card width
      const gap = 30;
      const translateX = -currentIndex * (cardWidth + gap);
      
      // Apply transition
      track.style.transition = 'transform 0.3s ease';
      track.style.transform = `translateX(${translateX}px)`;
      
      setTimeout(() => {
        // Handle infinite loop
        if (currentIndex >= 9) { // If past last original course
          currentIndex = 3; // Jump to first original
          track.style.transition = 'none';
          track.style.transform = `translateX(${-currentIndex * (cardWidth + gap)}px)`;
        } else if (currentIndex < 3) { // If before first original course  
          currentIndex = 8; // Jump to last original
          track.style.transition = 'none';
          track.style.transform = `translateX(${-currentIndex * (cardWidth + gap)}px)`;
        }
        isTransitioning = false;
      }, 300);
    }

    // Set initial position
    window.addEventListener('load', () => {
      const cardWidth = 350;
      const gap = 30;
      track.style.transform = `translateX(${-currentIndex * (cardWidth + gap)}px)`;
    });