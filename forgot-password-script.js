const emailInput = document.getElementById("email");
const form = document.querySelector("form");
const emailError = document.getElementById("email-error");

form.addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent default browser validation

  let isValid = true;

  const emailValue = emailInput.value.trim();

  // Email Validation
  if (emailValue === "") {
    emailError.textContent = "Email is required.";
    emailError.style.display = "block";
    emailInput.classList.add("invalid");
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
    emailError.textContent = "Please enter a valid email address.";
    emailError.style.display = "block";
    emailInput.classList.add("invalid");
    isValid = false;
  } else {
    emailError.textContent = "";
    emailError.style.display = "none";
    emailInput.classList.remove("invalid");
  }


  if (isValid) {
    form.submit(); // Form is valid — proceed with submission
  }
});


emailInput.addEventListener("input", () => {
  emailInput.classList.remove("invalid");
  emailError.textContent = "";
  emailError.style.display = "none";
});