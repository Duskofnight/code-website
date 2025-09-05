function copyBlogLink() {
    const url = window.location.href; 
    const button = event.target.closest('button'); 
    const icon = button.querySelector('i'); 
    
    navigator.clipboard.writeText(url)
      .then(() => {
        icon.className = 'fas fa-check'; 
        
        
        setTimeout(() => {
          icon.className = 'fas fa-link';
        }, 2000);
      })
      .catch(err => {
        icon.className = 'fas fa-times';
        
        setTimeout(() => {
          icon.className = 'fas fa-link';
        }, 5000);
      });
}

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