document.addEventListener("DOMContentLoaded", () => {
  // Highlight current nav link
  const links = document.querySelectorAll('.content-left a');
  const current = window.location.href;

  links.forEach(link => {
    if (current.includes(link.getAttribute('href'))) {
      link.classList.add('active');
    }
  });

  // Highlight current day in streak (Sun - Sat)
  const todayIndex = new Date().getDay(); // 0 = Sun, 6 = Sat
  const dayElements = document.querySelectorAll('.streak-days .day');

  dayElements.forEach((el, index) => {
    if (index === todayIndex) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });
});

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