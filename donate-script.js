const profileIcon = document.getElementById("header-profile-pic");
const dropdownMenu = document.getElementById("dropdownMenu");

profileIcon.addEventListener("click", () => {
  dropdownMenu.classList.toggle("show");
});

// Close dropdown if clicked outside
document.addEventListener("click", function(event) {
  if (!profileIcon.contains(event.target) && !dropdownMenu.contains(event.target)) {
    dropdownMenu.classList.remove("show");
  }
});

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login-page.html";
}

function myFunction() {
  const menu = document.getElementById("myLinks");
  const menuIcon = document.querySelector(".menu-icon");

  menu.classList.toggle("show");
  menuIcon.classList.toggle("active");
}

let selectedAmount = 0;

function selectAmount(amount) {
  selectedAmount = amount;
  document.querySelectorAll('.amount-btn').forEach(btn => {
    btn.classList.remove('selected');
  });
  event.target.classList.add('selected');

  // Update the subtitle
  document.getElementById('donationSubtitle').innerText = `You've selected $${amount}/month`;

  // Enable the donate button
  const donateBtn = document.querySelector('.donate-btn');
  donateBtn.disabled = false;
  donateBtn.classList.remove('disabled');
}

function processDonation() {
  const donateBtn = document.querySelector('.donate-btn');

  if (!selectedAmount || selectedAmount < 1) {
    showMessage("Please select a donation amount", "error");
    return;
  }

  // Animated dots
  let dots = '';
  donateBtn.innerHTML = 'Processing';
  donateBtn.disabled = true;
  
  const dotInterval = setInterval(() => {
    dots += '.';
    if (dots.length > 3) dots = '';
    donateBtn.innerHTML = `Processing${dots}`;
  }, 300);

  // Simulate donation process
  setTimeout(() => {
    clearInterval(dotInterval);
    const message = `Thank you for your generous donation of $${selectedAmount}/month! You'll receive a confirmation email shortly.`;
    showMessage(message, "success");

    donateBtn.innerHTML = '<i class="fas fa-heart"></i> Donate Now';
    donateBtn.disabled = true;

    // Reset everything
    selectedAmount = 0;
    document.querySelectorAll('.amount-btn').forEach(btn => btn.classList.remove('selected'));
    document.getElementById('donationSubtitle').innerText = 'Choose a monthly amount';
  }, 2000);
}

function toggleMenu() {
  // Mobile menu toggle functionality
  console.log('Mobile menu toggle');
}

// Add interactive animations on scroll
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const shapes = document.querySelectorAll('.floating-shape');
  
  shapes.forEach((shape, index) => {
    const speed = (index + 1) * 0.5;
    shape.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
  });
});


function showMessage(text, type = "success") {
  const msgDiv = document.getElementById("donationMessage");
  msgDiv.innerText = text;
  msgDiv.style.display = "block";
  msgDiv.style.padding = "1rem";
  msgDiv.style.marginTop = "1rem";
  msgDiv.style.borderRadius = "8px";
  msgDiv.style.fontWeight = "500";
  msgDiv.style.transition = "opacity 0.3s ease-in-out";

  if (type === "success") {
    msgDiv.style.backgroundColor = "#e6ffe6";
    msgDiv.style.color = "#256029";
    msgDiv.style.border = "1px solid #b2d8b2";
  } else if (type === "error") {
    msgDiv.style.backgroundColor = "#ffe6e6";
    msgDiv.style.color = "#802020";
    msgDiv.style.border = "1px solid #f5c2c2";
  }

  // Auto-hide after 6 seconds
  setTimeout(() => {
    msgDiv.style.opacity = 0;
    setTimeout(() => {
      msgDiv.style.display = "none";
      msgDiv.style.opacity = 1;
    }, 500);
  }, 6000);
}

