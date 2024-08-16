// Get elements
const newNoteForm = document.querySelector(".new-note-form"); // Form for adding a note
const noteTitle = document.querySelector(".new-note-title"); // Note title form input
const noteBody = document.querySelector(".new-note-text"); // Note body form input
const saveNoteButton = document.querySelector(".save-new-note"); // Save note button (form submit)
const notes = document.querySelectorAll(".note"); // All notes in the DOM
const notesContainer = document.querySelector(".all-notes"); // Notes container element
const clearAll = document.querySelector(".clear-all"); // Clear all notes button
const noteFilter = document.querySelector(".search"); // Search bar input

// Array for storing note objects (passed to local storage)
const allNotes = [];

// Clears the form input fields
function clearInput() {
  noteTitle.value = "";
  noteBody.value = "";
}

// --------------- Note creation and DOM functions ---------------//
/*
The createNote function creates a new note object with a current date, unique ID, title, and body (title and body from the form inputs). The note object is pushed to the allNotes array, passed to the createNoteDOM function, and saved to local storage.
*/
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
  createNoteDOM(note);
  saveLocalStorage();
}

/*
The createElement function accepts parameters for creating an HTML element with classes, attributes, and textContent, and returns the element (avoiding the use of the .innerHTML property).
*/
function createElement(tag, classNames = [], attributes = {}, textContent) {
  const element = document.createElement(tag);
  if (classNames.length) element.classList.add(...classNames);

  // Destructures the key-value pairs from the Object.entries array and sets the attributes
  for (let [attr, value] of Object.entries(attributes)) {
    element.setAttribute(attr, value);
  }
  
  if (textContent) element.textContent = textContent;
  return element;
}

/*
The setupEventListeners function sets up click events for all buttons that each note contains for manipulating the note after it has been created (edit, save, cancel, delete).
*/
function setupEventListeners(editButton, saveButton, cancelButton, deleteButton, newNoteBody, newNoteTitle, obj) {

  editButton.addEventListener("click", () => { // Event for Edit note button
    cancelButton.classList.toggle("hidden");
    saveButton.classList.toggle("hidden");
    editButton.classList.toggle("hidden");
    newNoteBody.setAttribute("contenteditable", "true");
    newNoteBody.style.fontStyle = "italic";
    newNoteBody.focus();
  });

  saveButton.addEventListener("click", () => { // Save button event for saving note edits and updating local storage
    const data = JSON.parse(localStorage.getItem("Notes")) || [];
    const newArray = data.map(item => {
      if (item.title === newNoteTitle.textContent) {
        item.body = newNoteBody.textContent;
        return item;
      }
      return item;
    });
    localStorage.setItem("Notes", JSON.stringify(newArray));
    newNoteBody.setAttribute("contenteditable", "false");
    saveButton.classList.toggle("hidden");
    editButton.classList.toggle("hidden");
    cancelButton.classList.toggle("hidden");
    newNoteBody.style.fontStyle = "normal";
  });

  cancelButton.addEventListener("click", () => { // Event to cancel edit
    newNoteBody.textContent = obj.body;
    newNoteBody.setAttribute("contenteditable", "false");
    newNoteBody.blur();
    cancelButton.classList.toggle("hidden");
    saveButton.classList.toggle("hidden");
    editButton.classList.toggle("hidden");
    newNoteBody.style.fontStyle = "normal";
  });

  deleteButton.addEventListener("click", (e) => { // Event for deleting the current note from the DOM and local storage
    const data = JSON.parse(localStorage.getItem("Notes")) || [];
    const newArray = data.filter((currentNote) => obj.id != currentNote.id);
    const currentNote = e.target.closest("div");
    localStorage.setItem("Notes", JSON.stringify(newArray));
    currentNote.remove();
  })
}

/*
The createNoteDOM function uses the function createElement to create the note and append all of its child elements in the DOM. It passes all button elements to the setupEventListeners function, ensuring events are applied to each individual note in the DOM.
*/
function createNoteDOM(obj) {
  // Note card
  const newNote = createElement("div", ["note"], { id: obj.id }); // Note card
  notesContainer.prepend(newNote);

  // Note title
  const newNoteTitle = createElement("p", ["note-title"], {}, obj.title);
  newNote.appendChild(newNoteTitle);

  // Note body
  const newNoteBody = createElement("p", ["note-body"], { contenteditable: "false" }, obj.body);
  newNote.appendChild(newNoteBody);

  // Formatted date
  const date = createElement("p", ["note-date"], {}, obj.date);
  newNote.appendChild(date);

  // Edit note button
  const editButton = createElement("button", ["edit-note"], {}, "Edit");
  newNote.appendChild(editButton);

  // Save edit button
  const saveButton = createElement("button", ["save-note", "hidden"], {}, "Save");
  newNote.appendChild(saveButton);

  // Cancel edit button
  const cancelButton = createElement("button", ["cancel", "hidden"], {}, "Cancel");
  newNote.appendChild(cancelButton);

  // Delete note button
  const deleteButton = createElement("button", ["delete-note"], {}, "Delete");
  newNote.appendChild(deleteButton);

  // Events for buttons related to edit note functionality.
  setupEventListeners(editButton, saveButton, cancelButton, deleteButton, newNoteBody, newNoteTitle, obj);
};

//------------------ Local storage functions -------------------//
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


// Render notes from local storage on load
document.addEventListener("DOMContentLoaded", () => {
  allNotes.length = 0; // Clear the array before populating it
  getLocalStorage();
});


//------------------ Form submit and clear-all events ------------------//
// Save new note (form submit)
saveNoteButton.addEventListener("click", () => {
  if (noteTitle.value === "" || noteBody.value === "") {
    alert("Please enter a valid input");
    return;
  }
  createNote();
  clearInput();
});

// Prevent default form behavior
newNoteForm.addEventListener("submit", (e) => {
  e.preventDefault();
});

// Clear all notes button
clearAll.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all of your notes?")) {
    // Remove all note elements from the DOM
    while (notesContainer.firstChild) {
      notesContainer.removeChild(notesContainer.firstChild);
    }

    // Clear the array and local storage
    allNotes.length = 0;
    localStorage.clear();
  }
});

//--------------- Filter and Search ---------------//
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
