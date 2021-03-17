const form = document.getElementById("form");

const fullName = document.getElementById("name");
const email = document.getElementById("email");
const country = document.getElementById("country");
const password = document.getElementById("password");
const password2 = document.getElementById("password2");

form.addEventListener("submit", (e) => {

  if(checkInputs()) {
    e.preventDefault()
  }
  
});

function checkInputs() {
  const fullNameValue = fullName.value.trim();
  const emailValue = email.value.trim();
  const countryValue = country.value.trim();
  const passwordValue = password.value.trim();
  const password2Value = password2.value.trim();

  let error = 0;

  if (fullNameValue === "") {
    setErrorFor(fullName, "Isminizi Girin");
    error = 1;
  } else {
    setSuccessFor(fullName);
  }

  if (emailValue === "") {
    setErrorFor(email, "Email Girin");
    error = 1;
  } else if (!isEmail(emailValue)) {
    setErrorFor(email, "Gecersiz Email");
    error = 1;
  } else {
    setSuccessFor(email);
  }

  if (countryValue === "") {
    setErrorFor(country, "Sehir Girin");
    error = 1;
  } else {
    setSuccessFor(country);
  }

  if (passwordValue === "") {
    setErrorFor(password, "Sifre Girin");
    error = 1;
  } else if (!passLength(passwordValue)) {
    setErrorFor(password, "Sifre en az 8 karakter olmali");
    error = 1;
  } else {
    setSuccessFor(password);
  }

  if (password2Value === "") {
    setErrorFor(password2, "Sifreyi tekrar girin");
    error = 1;
  } else if (passwordValue !== password2Value) {
    setErrorFor(password2, "Sifreler eslesmeli");
    error = 1;
  } else {
    setSuccessFor(password2);
  }

  return error;
}

function setErrorFor(input, message) {
  const formControl = input.parentElement; // .form-control
  const small = formControl.querySelector("small");

  //add error message inside small
  small.innerText = message;
  //add error class
  formControl.className = "form-control error";
}

function setSuccessFor(input) {
  const formControl = input.parentElement; // .form-control

  //add error class
  formControl.className = "form-control success";
}

function isEmail(email) {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );
}

function passLength(input) {
  if (input.length > 7) {
    return true;
  }
}
