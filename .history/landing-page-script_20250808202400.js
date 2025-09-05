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
const cards = Array.from(document.querySelectorAll('.course-card'));
const totalCards = cards.length;
let isTransitioning = false;

function setupInfiniteLoop() {
  if (!track.querySelector('.clone')) {
    for (let i = 0; i < 3; i++) {
      const clone = cards[i].cloneNode(true);
      clone.classList.add('clone');
      track.appendChild(clone);
    }

    for (let i = totalCards - 3; i < totalCards; i++) {
      const clone = cards[i].cloneNode(true);
      clone.classList.add('clone');
      track.insertBefore(clone, track.firstChild);
    }
  }

  currentIndex = 3;
  updateCarousel(false);
}

function updateCarousel(animate = true) {
  const cardWidth = cards[0].offsetWidth + 30; // Adjust gap accordingly
  const translateX = -currentIndex * cardWidth;

  if (animate && !isTransitioning) {
    track.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    isTransitioning = true;
  } else {
    track.style.transition = 'none';
  }

  track.style.transform = `translateX(${translateX}px)`;
}

track.addEventListener('transitionend', () => {
  isTransitioning = false;

  if (currentIndex >= totalCards + 3) {
    currentIndex = 3;
    // Snap instantly without animation to avoid flicker
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        updateCarousel(false);
      });
    });
  } else if (currentIndex < 3) {
    currentIndex = totalCards + 2;
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        updateCarousel(false);
      });
    });
  }
});

function moveCarousel(direction) {
  if (isTransitioning) return;

  currentIndex += direction;
  updateCarousel(false);  // NO animation on user move, instant jump
}

setupInfiniteLoop();

window.addEventListener('resize', () => {
  updateCarousel(false);
});