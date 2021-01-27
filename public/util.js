const navSlide = () => {
  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".nav-links");
  const navLinks = document.querySelectorAll("nav ul li");
  //Toggling nav
  burger.addEventListener("click", () => {
    nav.classList.toggle("nav-active");
    //Animate links
    navLinks.forEach((link, index) => {
      if (link.style.animation) {
        link.style.animation = "";
      } else {
        link.style.animation = `navLinkFade 0.5s ease forwards ${
          index / 7 + 0.3
        }s`;
      }
    });
    burger.classList.toggle("toggle");
  });
};

function checkIfLogged() {
  auth.onAuthStateChanged((user) => {
    const username = document.getElementById("user-name");
    if (user) {
      db.collection("users")
        .doc(user.uid)
        .get()
        .then((getData) => {
          username.innerText = getData.data().Name;
          return user;
        });
    } else {
      alert(
        "your login session has expired or you have logged out, login again to continue"
      );
      location = "index.html";
    }
  });
}

function logout() {
  const logoutBtn = document.querySelector("#logout-btn");
  logoutBtn.addEventListener("click", () => {
    auth.signOut();
    location = "index.html";
  });
}

export { navSlide, checkIfLogged, logout };
