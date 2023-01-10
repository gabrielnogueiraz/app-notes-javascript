// Elementos
const notesContainer = document.querySelector("#notes-container");

const noteInput = document.querySelector("#note-content");

const addNoteBtn = document.querySelector(".add-note");

const searchInput = document.querySelector("#search-input");

const exportBtn = document.querySelector("#export-notes");

// Funções
const showNotes = () => {
  cleanNotes();

  getNotes().forEach((note) => {
    const noteElement = createNote(note.id, note.content, note.fixed);
    notesContainer.appendChild(noteElement);
  });
};

const getNotes = () => {
  const notes = JSON.parse(localStorage.getItem("notes") || "[]");

  const orderedNotes = notes.sort((a, b) => (a.fixed > b.fixed ? -1 : 1));

  return orderedNotes;
};

const cleanNotes = () => {
  notesContainer.replaceChildren([]);
};

const saveNotes = (notes) => {
  localStorage.setItem("notes", JSON.stringify(notes));
};

function createNote(id, content, fixed) {
  const element = document.createElement("div");

  element.classList.add("note");

  const textarea = document.createElement("textarea");

  textarea.value = content;

  textarea.placeholder = "Adicione algum texto...";

  element.appendChild(textarea);

  if (fixed) {
    element.classList.add("fixed");
  }

  const pinIcon = document.createElement("i");

  pinIcon.classList.add(...["bi", "bi-pin"]);

  element.appendChild(pinIcon);

  const deleteIcon = document.createElement("i");

  deleteIcon.classList.add(...["bi", "bi-x-lg"]);

  element.appendChild(deleteIcon);

  const duplicateIcon = document.createElement("i");

  duplicateIcon.classList.add(...["bi", "bi-file-earmark-plus"]);

  element.appendChild(duplicateIcon);

  // Eventos do elemento
  element.querySelector("textarea").addEventListener("keydown", () => {
    const noteContent = element.querySelector("textarea").value;
    updateNote(id, noteContent);
  });

  element.querySelector(".bi-x-lg").addEventListener("click", () => {
    deleteNote(id, element);
  });

  element.querySelector(".bi-pin").addEventListener("click", () => {
    toggleFixNote(id);
  });

  element
    .querySelector(".bi-file-earmark-plus")
    .addEventListener("click", () => {
      copyNote(id);
    });

  return element;
}

const addNote = () => {
  const notes = getNotes();

  const noteInput = document.querySelector("#note-content");

  const noteObject = {
    id: generateId(),
    content: noteInput.value,
    fixed: false,
  };

  const noteElement = createNote(noteObject.id, noteObject.content);

  notesContainer.appendChild(noteElement);

  notes.push(noteObject);

  saveNotes(notes);
};

const generateId = () => {
  return Math.floor(Math.random() * 5000);
};

const updateNote = (id, newContent) => {
  const notes = getNotes();
  const targetNote = notes.filter((note) => note.id === id)[0];

  targetNote.content = newContent;

  saveNotes(notes);
};

const deleteNote = (id, element) => {
  const notes = getNotes().filter((note) => note.id !== id);

  saveNotes(notes);

  notesContainer.removeChild(element);
};

const toggleFixNote = (id) => {
  const notes = getNotes();
  const targetNote = notes.filter((note) => note.id === id)[0];

  targetNote.fixed = !targetNote.fixed;

  saveNotes(notes);

  showNotes();
};

const searchNotes = (search) => {
  const searchResults = getNotes().filter((note) =>
    note.content.includes(search)
  );

  if (search !== "") {
    cleanNotes();

    searchResults.forEach((note) => {
      const noteElement = createNote(note.id, note.content);
      notesContainer.appendChild(noteElement);
    });

    return;
  }

  cleanNotes();

  showNotes();
};

const copyNote = (id) => {
  const notes = getNotes();
  const targetNote = notes.filter((note) => note.id === id)[0];

  const noteObject = {
    id: generateId(),
    content: targetNote.content,
    fixed: false,
  };

  const noteElement = createNote(noteObject.id, noteObject.content, false);

  notesContainer.appendChild(noteElement);

  notes.push(noteObject);

  saveNotes(notes);
};

const exportData = () => {
  const notes = JSON.parse(localStorage.getItem("notes") || "[]");

  const csvString = [
    ["ID", "Conteúdo", "Fixado?"],
    ...notes.map((note) => [note.id, note.content, note.fixed]),
  ]
    .map((e) => e.join(","))
    .join("\n");

  const element = document.createElement("a");

  element.href = `data:text/csv;charset=utf-8,${encodeURI(csvString)}`;

  element.target = "_blank";

  element.download = "export.csv";

  element.click();
};

// Events
addNoteBtn.addEventListener("click", () => addNote());

searchInput.addEventListener("keyup", (e) => {
  const search = e.target.value;

  searchNotes(search);
});

noteInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addNote();
  }
});

exportBtn.addEventListener("click", () => {
  exportData();
});

// Init
showNotes();
