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



let currentSlide = 0;
    const totalSlides = 2;
    const coursesGrid = document.getElementById('courses-grid');
    
    function updateCarousel() {
      const translateX = -currentSlide * 100;
      coursesGrid.style.transform = `translateX(${translateX}%)`;
      
      // Update navigation dots
      document.querySelectorAll('.nav-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
      });
      
      // Update navigation buttons
      const prevBtn = document.getElementById('prev-nav');
      const nextBtn = document.getElementById('next-nav');
      
      prevBtn.disabled = currentSlide === 0;
      nextBtn.disabled = currentSlide === totalSlides - 1;
      
      // Update button styles for disabled state
      if (prevBtn.disabled) {
        prevBtn.style.opacity = '0.5';
        prevBtn.style.cursor = 'not-allowed';
      } else {
        prevBtn.style.opacity = '1';
        prevBtn.style.cursor = 'pointer';
      }
      
      if (nextBtn.disabled) {
        nextBtn.style.opacity = '0.5';
        nextBtn.style.cursor = 'not-allowed';
      } else {
        nextBtn.style.opacity = '1';
        nextBtn.style.cursor = 'pointer';
      }
    }

    // Previous slide
    document.getElementById('prev-nav').addEventListener('click', () => {
      if (currentSlide > 0) {
        currentSlide--;
        updateCarousel();
      }
    });

    // Next slide
    document.getElementById('next-nav').addEventListener('click', () => {
      if (currentSlide < totalSlides - 1) {
        currentSlide++;
        updateCarousel();
      }
    });

    // Dot navigation
    document.querySelectorAll('.nav-dot').forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentSlide = index;
        updateCarousel();
      });
    });

    // Course card click handlers
    document.querySelectorAll('.course-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (!e.target.closest('a')) {
          const link = card.querySelector('a');
          if (link) {
            window.location.href = link.href;
          }
        }
      });
    });

    // Auto-advance carousel (optional)
    setInterval(() => {
      if (currentSlide < totalSlides - 1) {
        currentSlide++;
      } else {
        currentSlide = 0;
      }
      updateCarousel();
    }, 8000); // Change slide every 8 seconds

    // Initialize carousel
    updateCarousel();