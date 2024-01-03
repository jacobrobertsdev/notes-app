const newNoteForm = document.querySelector(".new-note-form");
const noteTitle = document.querySelector(".new-note-title");
const noteBody = document.querySelector(".new-note-text");
const saveNoteButton = document.querySelector(".save-new-note");
const notes = document.querySelectorAll(".note");
const mainContent = document.querySelector("main");
const addNoteButton = document.querySelector(".add-note-button");
const notesContainer = document.querySelector(".all-notes");

const allNotes = [];

// Add the new item to the DOM (without .innerHTML)
function createNote() {
  const uniqueId = crypto.randomUUID().toString();

  const note = {
    id: uniqueId,
    title: noteTitle.value,
    body: noteBody.value,
  };

  allNotes.push(note);

  const newNote = document.createElement("div");
  newNote.classList.add("note");
  newNote.setAttribute("id", uniqueId);
  notesContainer.prepend(newNote);

  const newNoteTitle = document.createElement("p");
  newNoteTitle.classList.add("note-title");
  newNoteTitle.textContent = note.title;
  newNote.appendChild(newNoteTitle);

  const newNoteBody = document.createElement("p");
  newNoteBody.classList.add("note-body");
  newNoteBody.setAttribute("contenteditable", "false");
  newNoteBody.textContent = note.body;
  newNote.appendChild(newNoteBody);

  const editButton = document.createElement("button");
  editButton.classList.add("edit-note");
  editButton.textContent = "Edit";
  newNote.appendChild(editButton);

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-note");
  deleteButton.textContent = "Delete";
  newNote.appendChild(deleteButton);

  saveLocalStorage();
}

// Clear the input field
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
}

// Save to local storage
function saveLocalStorage() {
  localStorage.setItem("Notes", JSON.stringify(allNotes));
}

// Remove items from dom and local storage
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
  createNote();
  clearInput();
});

document.addEventListener("DOMContentLoaded", () => {
  allNotes.length = 0; // Clear the array before populating it
  getLocalStorage();
  clearInput();
});
