import { navSlide, checkIfLogged, logout } from "./util.js";

const addButton = document.querySelector(".add-btn");
const select = document.querySelector(".exercise-select");
const trainingList = document.querySelector(".training-list");
const saveBtn = document.querySelector(".save-btn");

let trainings = {};

//Event listeners
addButton.addEventListener("click", addEntry);
trainingList.addEventListener("click", addDelete);
saveBtn.addEventListener("click", save);

function addEntry(e) {
  e.preventDefault();
  if (select.value != "") {
    const entry = document.createElement("div");
    entry.classList.add("entry");
    const exercise = document.createElement("li");
    exercise.innerHTML = `<span class='exercise-span'>${select.value}</span></p>`;
    entry.appendChild(exercise);
    entry.appendChild(createSet());
    const entryBtns = document.createElement("div");
    entryBtns.classList.add("entryBtns");
    const addSetBtn = document.createElement("button");
    addSetBtn.innerHTML = '<i class="fas fa-plus-square fa-2x"></i>';
    addSetBtn.classList.add("add-set-btn", "btn");
    entryBtns.appendChild(addSetBtn);
    const trashBtn = document.createElement("button");
    trashBtn.innerHTML = '<i class="fas fa-trash fa-2x "></i>';
    trashBtn.classList.add("trash-btn", "btn");
    entryBtns.appendChild(trashBtn);
    entry.appendChild(entryBtns);
    trainingList.appendChild(entry);
    updateSelectAdd();
  }
}
function createSet() {
  //SET CONTAINER
  const setContainer = document.createElement("div");
  setContainer.classList.add("set");
  //Delete Btn
  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = "X";
  setContainer.appendChild(deleteBtn);
  deleteBtn.classList.add("delete-set-btn", "btn");
  //WEIGHT CONTAINER
  const weightContainer = document.createElement("div");
  weightContainer.classList.add("input-container");
  //WEIGHT INPUT
  const weightInput = document.createElement("input");
  weightInput.setAttribute("type", "text");
  weightInput.setAttribute("value", "0");
  weightInput.setAttribute("name", "weight");
  weightInput.setAttribute("maxlength", "3");
  weightInput.classList.add("weight");
  weightContainer.appendChild(weightInput);
  //WEIGHT LABEL
  const weightLabel = document.createElement("label");
  weightLabel.htmlFor = "weight";
  weightLabel.innerHTML = "Weight";
  weightContainer.insertBefore(weightLabel, weightInput);
  //ADD WEIGHT CONTAINER to SET
  setContainer.appendChild(weightContainer);
  //REPS CONTAINER
  const repsContainer = document.createElement("div");
  repsContainer.classList.add("input-container");
  //REPS INPUT
  const repsInput = document.createElement("input");
  repsInput.setAttribute("type", "text");
  repsInput.setAttribute("value", "0");
  repsInput.setAttribute("name", "reps");
  repsInput.setAttribute("maxlength", "3");
  repsInput.classList.add("reps");
  repsContainer.appendChild(repsInput);
  //REPS LABEL
  const repsLabel = document.createElement("label");
  repsLabel.htmlFor = "weight";
  repsLabel.innerHTML = "Reps";
  repsContainer.insertBefore(repsLabel, repsInput);
  //ADD REPS CONTAINER to SET
  setContainer.appendChild(repsContainer);

  return setContainer;
}
function addDelete(e) {
  const target = e.target;
  const entry = target.parentElement;
  if (target.classList.contains("add-set-btn")) {
    entry.parentElement.insertBefore(
      createSet(),
      entry.parentElement.querySelector(".entryBtns")
    );
  }
  if (target.classList.contains("trash-btn")) {
    entry.parentElement.remove();
    updateSelectDelete(entry.parentElement);
  }
  if (target.classList.contains("delete-set-btn")) {
    entry.remove();
  }
}

function updateSelectAdd() {
  document.querySelector(`#${select.value.toLowerCase()}-sel`).remove();
}
function updateSelectDelete(entry) {
  const exName = entry.querySelector(".exercise-span").innerText;
  select.innerHTML += `<option id="${exName.toLowerCase()}-sel" value=${exName}>${exName}</option>`;
}

//SAVING
function save(e) {
  e.preventDefault();
  auth.onAuthStateChanged((user) => {
    if (user) {
      const id = uuidv4();
      const date = document.querySelector("#datePicker").value;
      const trainingObj = { date };
      const liEntries = document.querySelectorAll(".entry li");
      liEntries.forEach((entry) => {
        const exName = entry.querySelector(".exercise-span").innerText;
        const sets = entry.parentElement.querySelectorAll(".set");
        const exerObj = {};
        let i = 1;
        sets.forEach((set) => {
          let setArr = [];
          setArr.push(set.querySelector(".weight").value);
          setArr.push(set.querySelector(".reps").value);
          exerObj[i] = setArr;
          i++;
        });
        trainingObj[exName] = exerObj;
      });
      db.collection("trainings")
        .doc(user.uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            console.log(doc.data());
            db.collection("trainings")
              .doc(user.uid)
              .update({ [id]: trainingObj });
          } else {
            trainings[id] = trainingObj;
            db.collection("trainings")
              .doc(user.uid)
              .set(trainings, { merge: true })
              .then(alert("Your first training added!"))
              .catch((err) => {
                console.log(err.message);
              });
          }
        });
    }
  });
}

//Adding current date to datepicker
//Correct FORMAT
Date.prototype.toDateInputValue = function () {
  var local = new Date(this);
  local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
  return local.toJSON().slice(0, 10);
};

document.getElementById("datePicker").value = new Date().toDateInputValue();

//UUID
function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

// function getTrainings() {
//     auth.onAuthStateChanged(user => {
//         if (user) {
//             db.collection('trainings').doc(user.uid).get().then(doc => {
//                 if(doc.exists){
//                     trainings = doc.data();
//                 }else {
//                     alert('You dont have any trainings yet! Please add by "New Training"');
//                 }
//             })
//         }else{
//             alert("You're not logged!")
//         }
//     })
// }

// getTrainings();
checkIfLogged();
navSlide();
logout();
