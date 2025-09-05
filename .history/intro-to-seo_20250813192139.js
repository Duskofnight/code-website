function myFunction() {
  const menu = document.getElementById("myLinks");
  const menuIcon = document.querySelector(".menu-icon");

  menu.classList.toggle("show");
  menuIcon.classList.toggle("active");
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("lessonProgress");
  window.location.href = "/login-page.html";
}