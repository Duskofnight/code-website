function goToSlide(number) {
  const slides = document.querySelectorAll('.slide');
  slides.forEach(slide => slide.classList.remove('active'));

  const targetSlide = document.getElementById(`slide${number}`);
  if (targetSlide) {
    targetSlide.classList.add('active');
  }
}

function finishOnboarding() {
  // You can redirect or show dashboard here
  window.location.href = 'dashboard.html';
}

