 let currentPage = 1;
    const blogsPerPage = 6;
    let allBlogs = [];

    function setupPagination() {
      allBlogs = Array.from(document.querySelectorAll('.blog-item'));
      showPage(1);
      createPaginationControls();
    }

    function showPage(page) {
      currentPage = page;
      const start = (page - 1) * blogsPerPage;
      const end = start + blogsPerPage;

      allBlogs.forEach((blog, index) => {
        if (index >= start && index < end) {
          blog.style.display = 'block';
        } else {
          blog.style.display = 'none';
        }
      });

      // Scroll to top of blog section
      document.getElementById('page-section').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }

    function createPaginationControls() {
      const totalPages = Math.ceil(allBlogs.length / blogsPerPage);
      if (totalPages <= 1) return;

      const paginationDiv = document.getElementById('pagination');
      paginationDiv.innerHTML = '';

      // Previous button
      if (currentPage > 1) {
        const prevBtn = document.createElement('button');
        prevBtn.textContent = '← Previous';
        prevBtn.className = 'page-btn';
        prevBtn.addEventListener('click', () => {
          showPage(currentPage - 1);
          updatePaginationControls();
        });
        paginationDiv.appendChild(prevBtn);
      }

      // Page numbers
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);

      for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.addEventListener('click', () => {
          showPage(i);
          updatePaginationControls();
        });
        paginationDiv.appendChild(pageBtn);
      }

      // Next button
      if (currentPage < totalPages) {
        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Next →';
        nextBtn.className = 'page-btn';
        nextBtn.addEventListener('click', () => {
          showPage(currentPage + 1);
          updatePaginationControls();
        });
        paginationDiv.appendChild(nextBtn);
      }

      // Page info
      const pageInfo = document.createElement('div');
      pageInfo.className = 'page-info';
      pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
      paginationDiv.appendChild(pageInfo);
    }

    function updatePaginationControls() {
      createPaginationControls();
    }

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