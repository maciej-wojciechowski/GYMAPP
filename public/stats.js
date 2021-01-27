import { navSlide, checkIfLogged, logout } from "./util.js";

const select = document.querySelector(".exercise-select");
const chooseBtn = document.querySelector(".choose-btn");
let localTrainings = {};
let dates;
let values;

//EVENT LISTENERS
chooseBtn.addEventListener("click", chooseExercise);

// FUNCTIONS
function chooseExercise() {
  dates = [];
  values = [];
  // retrive array from object and sort byd date (id ommited)- only read here
  const sortableTrainings = [];
  for (let id in localTrainings) {
    sortableTrainings.push(localTrainings[id]);
  }
  sortableTrainings.sort((a, b) => new Date(a.date) - new Date(b.date));
  // console.log(sortableTrainings);
  const pickedExercise = select.value;
  // DO ZASTANOWIENIA
  // const onlyPicked = localTrainings.map(function (training) {
  //     return training[pickedExercise];
  // })
  const onlyPicked = sortableTrainings.filter((training) => {
    return training[pickedExercise] != null;
  });
  onlyPicked.forEach((picked) => {
    dates.push(picked.date);
  });
  const pickedArrs = [];
  onlyPicked.forEach((picked) => {
    const exerObj = picked[select.value];
    const innerArr = [];
    for (let set in exerObj) {
      innerArr.push(exerObj[set]);
    }
    pickedArrs.push(innerArr);
  });
  const pickedValues = pickedArrs.map((picked) => {
    return picked.map(function (set) {
      const setValue = set[0] * set[1];
      return setValue;
    });
  });
  pickedValues.forEach((training) => {
    let value = 0;
    training.forEach((set) => {
      value += set;
    });
    values.push(value);
  });

  //Chart.js
  const ctx = document.getElementById("myChart").getContext("2d");
  const chart = new Chart(ctx, {
    // The type of chart we want to create
    type: "line",
    // The data for our dataset
    data: {
      labels: dates,
      datasets: [
        {
          label: select.value,
          backgroundColor: "rgb(255, 255, 255)",
          borderColor: "rgb(99, 148, 255)",
          data: values,
        },
      ],
    },
    // Configuration options go here
    options: {
      aspectRatio: 3,
    },
  });
}

function getTrainings() {
  auth.onAuthStateChanged((user) => {
    if (user) {
      db.collection("trainings")
        .doc(user.uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            localTrainings = doc.data();
            chooseExercise();
          } else {
            alert(
              'You dont have any trainings yet! Please add by "New Training"'
            );
          }
        });
    } else {
      alert("You're not logged!");
    }
  });
}
getTrainings();
checkIfLogged();
navSlide();
logout();
