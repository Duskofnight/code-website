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
const slides = Array.from(track.children);
let currentIndex = 0;
let cardWidth = slides[0].offsetWidth + 30; // 30px gap, match your CSS
let isTransitioning = false;

// Set initial position for all slides (not strictly needed for flexbox, but safe)
slides.forEach((slide, i) => {
  slide.style.left = (cardWidth * i) + 'px';
});

function updateCarousel(animate = true) {
  track.style.transition = animate ? 'transform 0.4s cubic-bezier(.77,0,.18,1)' : 'none';
  track.style.transform = `translateX(${-currentIndex * cardWidth}px)`;
}

function moveCarousel(direction) {
  if (isTransitioning) return;
  const maxIndex = slides.length - 3; // Show 3 at a time
  if (direction > 0 && currentIndex < maxIndex) {
    currentIndex++;
  } else if (direction < 0 && currentIndex > 0) {
    currentIndex--;
  } else {
    return;
  }
  isTransitioning = true;
  updateCarousel(true);
}

track.addEventListener('transitionend', () => {
  isTransitioning = false;
});

document.querySelector('.carousel-btn.next-btn').addEventListener('click', () => moveCarousel(1));
document.querySelector('.carousel-btn.prev-btn').addEventListener('click', () => moveCarousel(-1));

window.addEventListener('resize', () => {
  cardWidth = slides[0].offsetWidth + 30;
  updateCarousel(false);
});

// Initialize
updateCarousel(false);