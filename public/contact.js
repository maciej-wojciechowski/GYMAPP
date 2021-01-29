import { navSlide, logout } from "./util.js";

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

navSlide();
checkIfLoggedIndex();
logout();
