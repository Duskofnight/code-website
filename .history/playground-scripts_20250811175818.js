function myFunction() {
      const menu = document.getElementById("myLinks");
      const menuIcon = document.querySelector(".menu-icon");
      
      menu.classList.toggle("show");
      menuIcon.classList.toggle("active");
    }

    // Initialize pagination when page loads
    document.addEventListener('DOMContentLoaded', setupPagination);

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