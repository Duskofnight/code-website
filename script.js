const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("toggle-password");
const emailInput = document.getElementById("email");
const form = document.querySelector("form");

const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");

// Password visibility toggle
togglePassword.addEventListener("click", () => {
  const isPassword = passwordInput.type === "password";
  passwordInput.type = isPassword ? "text" : "password";
  togglePassword.classList.toggle("fa-eye");
  togglePassword.classList.toggle("fa-eye-slash");
  togglePassword.title = isPassword ? "Hide password" : "Show password";
});

// Form validation
form.addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent default browser validation

  let isValid = true;

  const emailValue = emailInput.value.trim();
  const passwordValue = passwordInput.value;

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

  // Password Validation
  if (passwordValue === "") {
    passwordError.textContent = "Password is required.";
    passwordError.style.display = "block";
    passwordInput.classList.add("invalid");
    isValid = false;
  } else if (passwordValue.length < 6) {
    passwordError.textContent = "Password must be at least 6 characters.";
    passwordError.style.display = "block";
    passwordInput.classList.add("invalid");
    isValid = false;
  } else {
    passwordError.textContent = "";
    passwordError.style.display = "none";
    passwordInput.classList.remove("invalid");
  }

  if (isValid) {
    form.submit(); // Form is valid — proceed with submission
  }
});

// Clear errors on input
[emailInput, passwordInput].forEach((input) => {
  input.addEventListener("input", () => {
    input.classList.remove("invalid");
    const errorEl = input.id === "email" ? emailError : passwordError;
    errorEl.textContent = "";
    errorEl.style.display = "none";
  });
});

