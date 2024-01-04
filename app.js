const newNoteForm = document.querySelector(".new-note-form");
const noteTitle = document.querySelector(".new-note-title");
const noteBody = document.querySelector(".new-note-text");
const saveNoteButton = document.querySelector(".save-new-note");
const notes = document.querySelectorAll(".note");
const mainContent = document.querySelector("main");
const addNoteButton = document.querySelector(".add-note-button");
const notesContainer = document.querySelector(".all-notes");
const clearAll = document.querySelector(".clear-all");
const noteFilter = document.querySelector(".search");
const updateButton = document.querySelector(".update-note");
const allNotes = [];

// Create a new note object and push to local storage
function createNote() {
  const noteDate = new Date().toLocaleDateString();
  const uniqueId = crypto.randomUUID().toString();
  const note = {
    id: uniqueId,
    date: noteDate,
    title: noteTitle.value,
    body: noteBody.value,
  };

  allNotes.push(note);
  createNoteDOM(note, uniqueId);
  saveLocalStorage();
}

// Create the note in the DOM with associated event listeners (without .innerHTML)
function createNoteDOM(obj, id) {
  const newNote = document.createElement("div");
  newNote.classList.add("note");
  newNote.setAttribute("id", id);
  notesContainer.prepend(newNote);

  const newNoteTitle = document.createElement("p");
  newNoteTitle.classList.add("note-title");
  newNoteTitle.textContent = obj.title;
  newNote.appendChild(newNoteTitle);

  const newNoteBody = document.createElement("p");
  newNoteBody.classList.add("note-body");
  newNoteBody.setAttribute("contenteditable", "false");
  newNoteBody.textContent = obj.body;
  newNote.appendChild(newNoteBody);

  const date = document.createElement("p");
  date.classList.add("note-date");
  date.textContent = obj.date;
  newNote.appendChild(date);

  const editButton = document.createElement("button");
  editButton.classList.add("edit-note");
  editButton.textContent = "Edit";
  newNote.appendChild(editButton);

  const saveButton = document.createElement("button");
  saveButton.classList.add("save-note");
  saveButton.classList.toggle("hidden");
  saveButton.textContent = "Save";
  newNote.appendChild(saveButton);

  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancel";
  newNote.appendChild(cancelButton);
  cancelButton.classList.add("cancel");
  cancelButton.classList.toggle("hidden");

  editButton.addEventListener("click", (e) => {
    cancelButton.classList.toggle("hidden");
    saveButton.classList.toggle("hidden");
    editButton.classList.toggle("hidden");
    newNoteBody.setAttribute("contenteditable", "true");
    newNoteBody.focus();
  });

  saveButton.addEventListener("click", () => {
    const data = JSON.parse(localStorage.getItem("Notes")) || [];
    const newArray = data.map((item) => {
      if (item.title === newNoteTitle.textContent) {
        item.body = newNoteBody.textContent;
        return item;
      } else {
        return item;
      }
    });
    localStorage.setItem("Notes", JSON.stringify(newArray));
    saveButton.classList.toggle("hidden");
    editButton.classList.toggle("hidden");
    cancelButton.classList.toggle("hidden");
  });

  cancelButton.addEventListener("click", () => {
    newNoteBody.setAttribute("contenteditable", "false");
    newNoteBody.blur();
    cancelButton.classList.toggle("hidden");
  });

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-note");
  deleteButton.textContent = "Delete";
  newNote.appendChild(deleteButton);
}

// Clear the new note input fields
function clearInput() {
  noteTitle.value = "";
  noteBody.value = "";
}

//------------------Local storage-------------------//

// Load local storage
function getLocalStorage() {
  const data = JSON.parse(localStorage.getItem("Notes")) || [];

  if (data) {
    for (item of data) {
      noteTitle.value = item.title;
      noteBody.textContent = item.body;
      createNote();
    }
  }
  clearInput();
}

// Save to local storage
function saveLocalStorage() {
  localStorage.setItem("Notes", JSON.stringify(allNotes));
}

// Remove items from local storage and update DOM
mainContent.addEventListener("click", (e) => {
  const data = JSON.parse(localStorage.getItem("Notes")) || [];

  const target = e.target;
  const note = e.target.closest("div");
  const noteId = note.getAttribute("id").toString();

  if (target.classList.contains("delete-note")) {
    const newArray = data.filter((currentNote) => noteId != currentNote.id);
    note.remove();
    localStorage.setItem("Notes", JSON.stringify(newArray));
  }
});

saveNoteButton.addEventListener("click", () => {
  if (noteTitle.value === "" || noteBody.value === "") {
    alert("Please enter a valid input");
    return;
  }
  createNote();
});

document.addEventListener("DOMContentLoaded", () => {
  allNotes.length = 0; // Clear the array before populating it
  getLocalStorage();
});

clearAll.addEventListener("click", () => {
  allNotes.length = 0;
  saveLocalStorage();
  getLocalStorage();
  window.location.reload();
});

noteFilter.addEventListener("keyup", () => {
  const titles = document.querySelectorAll(".note-title");
  const query = noteFilter.value.toLowerCase();

  for (let title of titles) {
    if (!title.textContent.toLowerCase().includes(query)) {
      title.parentElement.classList.add("hidden");
    } else {
      title.parentElement.classList.remove("hidden");
    }
  }
});
