import { navSlide, checkIfLogged, logout } from "./util.js";

const list = document.querySelector("#history-list");
var trainings = {};
var id;
var currentUser;

function updateList() {
  list.innerHTML = "";
  const sortableTrainings = [];
  for (let id in trainings) {
    sortableTrainings.push([id, trainings[id]]);
  }
  sortableTrainings.sort((a, b) => new Date(a[1].date) - new Date(b[1].date));
  sortableTrainings.forEach((training) => {
    const entry = document.createElement("li");
    entry.innerHTML = `<a id=${training[0]} href=# title='${training[1].date}'>${training[1].date}</a>`;
    list.appendChild(entry);
  });
  //Event listeners for created links
  const links = document.querySelectorAll("#history-list a");
  links.forEach((link) => {
    link.addEventListener("click", editTrainingPopup);
  });
}

//Editing trainings stuff
const editContainer = document.querySelector(".edit-container");
const closeEditBtn = document.querySelector(".close-edit");
const editTrainingList = document.querySelector("#edit-training-list");
const addButton = document.querySelector(".add-btn");
const select = document.querySelector(".exercise-select");
const saveBtn = document.querySelector(".save-btn");
const deleteBtn = document.querySelector(".delete-btn");

//Event listeners
closeEditBtn.addEventListener("click", closeEdit);
addButton.addEventListener("click", addEntry);
saveBtn.addEventListener("click", saveTraining);
deleteBtn.addEventListener("click", deleteTraining);
editTrainingList.addEventListener("click", addDelete);

function editTrainingPopup(e) {
  id = e.target.id;
  const editedTraining = trainings[id];
  const exercises = Object.keys(editedTraining).filter(
    (entry) => entry !== "date"
  );
  exercises.forEach((exer) => {
    const entry = document.createElement("div");
    entry.classList.add("entry");
    const exercise = document.createElement("li");
    exercise.innerHTML = `<span class='exercise-span'>${exer}</span></p>`;
    entry.appendChild(exercise);
    for (let set in editedTraining[exer]) {
      entry.appendChild(
        createSet(editedTraining[exer][set][0], editedTraining[exer][set][1])
      );
    }
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
    editTrainingList.appendChild(entry);
  });
  if (!exercises.includes("Squat")) {
    select.innerHTML += '<option id="squat-sel" value="Squat">Squat</option>';
  }
  if (!exercises.includes("Bench")) {
    select.innerHTML += '<option id="bench-sel" value="Bench">Bench</option>';
  }
  if (!exercises.includes("Deadlift")) {
    select.innerHTML +=
      '<option id="deadlift-sel" value="Deadlift">Deadlift</option>';
  }
  editContainer.classList.add("active");
}

function addEntry() {
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
    editTrainingList.appendChild(entry);
    //Updating select button
    updateSelectAdd();
  }
}
//Updating select button
function updateSelectAdd() {
  document.querySelector(`#${select.value.toLowerCase()}-sel`).remove();
}
function updateSelectDelete(entry) {
  const exName = entry.querySelector(".exercise-span").innerText;
  select.innerHTML += `<option id="${exName.toLowerCase()}-sel" value=${exName}>${exName}</option>`;
}

function createSet(weight, reps) {
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
  weightInput.setAttribute("value", weight || "0");
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
  repsInput.setAttribute("value", reps || "0");
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
    updateSelectDelete(entry.parentElement);
    entry.parentElement.remove();
  }
  if (target.classList.contains("delete-set-btn")) {
    console.log("elo");
    entry.remove();
  }
}

function closeEdit() {
  editContainer.classList.remove("active");
  window.setTimeout(() => {
    editTrainingList.innerHTML = "";
    select.innerHTML = "";
  }, 500);
}

function saveTraining(e) {
  e.preventDefault();
  let conf = confirm("Are you sure to OVERWRITE?");
  if (conf === true) {
    const date = trainings[id].date;
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
    return db
      .collection("trainings")
      .doc(currentUser.uid)
      .update({
        [id]: trainingObj,
      })
      .then(getTrainings())
      .then(closeEdit());
  } else {
    alert("Nothing happend!");
  }
}

function deleteTraining(e) {
  e.preventDefault();
  let conf = confirm("Are you sure to DELETE?");
  if (conf === true) {
    return db
      .collection("trainings")
      .doc(currentUser.uid)
      .update({
        [id]: firebase.firestore.FieldValue.delete(),
      })
      .then(getTrainings())
      .then(closeEdit());
  }
}

function getTrainings() {
  auth.onAuthStateChanged((user) => {
    currentUser = user;
    if (user) {
      db.collection("trainings")
        .doc(user.uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            trainings = doc.data();
            updateList();
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
logout();
navSlide();
