import { navSlide, logout } from "./util.js";

window.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");
});

//Sign Up
const signupForm = document.getElementById("signup-form");
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = signupForm["signup-name"].value;
  const email = signupForm["signup-email"].value;
  const password = signupForm["signup-password"].value;
  signupForm.reset();
  // console.log(name, email, password);
  auth
    .createUserWithEmailAndPassword(email, password)
    .then((cred) => {
      return db
        .collection("users")
        .doc(cred.user.uid)
        .set({
          Name: name,
          Email: email,
          Password: password,
        })
        .then(() => {
          console.log("success");
          location = "index.html";
          alert("You can now LOGIN !");
        })
        .catch((err) => {
          console.log(err.message);
          const signupError = document.getElementById("signupError");
          signupError.innerText = err.message;
        });
    })
    .catch((err) => {
      console.log(err.message);
      const signupError2 = document.getElementById("signupError");
      signupError2.innerText = err.message;
    });
});

//Login
const loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const loginEmail = loginForm["login-email"].value;
  const loginPassword = loginForm["login-password"].value;
  auth
    .signInWithEmailAndPassword(loginEmail, loginPassword)
    .then(() => {
      console.log("login success");
      location = "history.html";
      alert("Welcome SON!");
    })
    .catch((err) => {
      alert(err);
      loginForm.reset();
      // const loginError = document.getElementById("loginError");
      // loginError.innerText = err.message;
    });
});

//LOGIN POPUP

const loginShow = () => {
  const loginPopBtn = document.querySelector("#login-popup-btn");
  const loginCont = document.querySelector(".login-container");

  loginPopBtn.addEventListener("click", () => {
    // console.log('eeelo from login btn')
    loginCont.classList.add("active");
  });
};

const closePopup = () => {
  const closeBtn = document.querySelectorAll(".close-btn");
  closeBtn.forEach((btn) => {
    btn.addEventListener("click", closeWindow);
  });
};

//SIGNIN POPUP

const signupShow = () => {
  const signupPopBtn = document.querySelector("#signup-popup-btn");
  const signupCont = document.querySelector(".signup-container");

  signupPopBtn.addEventListener("click", () => {
    signupCont.classList.add("active");
  });
};

function checkIfLoggedIndex() {
  auth.onAuthStateChanged((user) => {
    const username = document.getElementById("user-name");
    if (user) {
      db.collection("users")
        .doc(user.uid)
        .get()
        .then((getData) => {
          username.innerText = getData.data().Name;
        });
    }
  });
}

function closeWindow(e) {
  e.preventDefault();
  e.target.parentElement.parentElement.parentElement.classList.remove("active");
  console.log(e.target.parentElement.parentElement.parentElement);
}

navSlide();
checkIfLoggedIndex();
loginShow();
signupShow();
logout();
closePopup();
