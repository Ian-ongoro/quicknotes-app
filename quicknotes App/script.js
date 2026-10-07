/**
 * QuickNotes Application Script
 * Tasks 3, 4, 5 & Bonus implementations
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const noteForm = document.getElementById('note-form');
  const noteTextInput = document.getElementById('note-text');
  const noteCategorySelect = document.getElementById('note-category');
  const errorMessage = document.getElementById('error-message');
  const notesList = document.getElementById('notes-list');
  const noteCount = document.getElementById('note-count');
  const searchInput = document.getElementById('search-input');
  const clearAllBtn = document.getElementById('clear-all-btn');
  const charCounter = document.getElementById('char-counter');

  // Task 5: App State Array (Load from localStorage if present)
  let notes = JSON.parse(localStorage.getItem('quicknotes_data')) || [];

  // Initialize App
  init();

  function init() {
    renderNotes();
    setupEventListeners();
  }

  function setupEventListeners() {
    // Form submission
    noteForm.addEventListener('submit', handleAddNote);

    // Character counter listener
    noteTextInput.addEventListener('input', updateCharCounter);

    // Search input listener
    searchInput.addEventListener('input', filterAndRenderNotes);

    // Clear all notes listener (Bonus)
    clearAllBtn.addEventListener('click', handleClearAll);
  }

  /* ==========================================
     Task 3 & 4: Add Note & Validation
     ========================================== */
  function handleAddNote(e) {
    e.preventDefault();

    const rawText = noteTextInput.value;
    const trimmedText = rawText.trim();
    const category = noteCategorySelect.value;

    // Task 4: Validation
    if (trimmedText === '') {
      showError('Please type a note first.');
      return;
    }

    if (rawText.length > 200) {
      showError('Notes must be 200 characters or fewer.');
      return;
    }

    // Clear any active error message on valid input
    clearError();

    // Task 3: Create note object
    const newNote = {
      id: Date.now().toString(),
      text: trimmedText,
      category: category,
      createdAt: formatDate(new Date())
    };

    // Add note to array
    notes.unshift(newNote);

    // Save to localStorage & re-render
    saveNotes();
    renderNotes();

    // Reset input field and character counter
    noteTextInput.value = '';
    updateCharCounter();
    noteTextInput.focus();
  }

  /* ==========================================
     Task 4: Delete Note
     ========================================== */
  function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
    saveNotes();
    renderNotes();
  }

  /* ==========================================
     Bonus: Clear All Notes
     ========================================== */
  function handleClearAll() {
    if (confirm('Delete all notes?')) {
      notes = [];
      saveNotes();
      renderNotes();
    }
  }

  /* ==========================================
     Task 3, 4, 5: Render & Search Filter
     ========================================== */
  function filterAndRenderNotes() {
    renderNotes();
  }

  function renderNotes() {
    const query = searchInput.value.trim().toLowerCase();

    // Task 5: Filter notes by search keyword
    const filteredNotes = notes.filter(note => 
      note.text.toLowerCase().includes(query)
    );

    // Task 4: Update Note Count display
    updateCountDisplay(filteredNotes.length, notes.length, query);

    // Toggle Clear All button visibility
    if (notes.length > 0) {
      clearAllBtn.classList.remove('hidden');
    } else {
      clearAllBtn.classList.add('hidden');
    }

    // Clear list
    notesList.innerHTML = '';

    // Task 5: Search empty state check
    if (filteredNotes.length === 0) {
      if (query !== '' && notes.length > 0) {
        notesList.innerHTML = `<p class="no-notes-message">No notes match your search.</p>`;
      } else if (notes.length === 0) {
        notesList.innerHTML = `<p class="no-notes-message">Your list is clear. Add a note above!</p>`;
      }
      return;
    }

    // Render filtered note cards
    filteredNotes.forEach(note => {
      const noteElement = createNoteCard(note);
      notesList.appendChild(noteElement);
    });
  }

  /* ==========================================
     Task 2 & 3: Note Card DOM Creator
     ========================================== */
  function createNoteCard(note) {
    const card = document.createElement('div');
    const categoryLower = note.category.toLowerCase();

    // Task 2: Border classes category-personal, category-work, category-study
    card.className = `note-card category-${categoryLower}`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'note-content';

    const textPara = document.createElement('p');
    textPara.className = 'note-text';
    textPara.textContent = note.text;

    const metaDiv = document.createElement('div');
    metaDiv.className = 'note-meta';

    // Category Label / Badge
    const categorySpan = document.createElement('span');
    categorySpan.className = `category-badge badge-${categoryLower}`;
    categorySpan.textContent = note.category;

    // Date display
    const dateSpan = document.createElement('span');
    dateSpan.className = 'note-date';
    dateSpan.textContent = note.createdAt;

    metaDiv.appendChild(categorySpan);
    metaDiv.appendChild(dateSpan);

    contentDiv.appendChild(textPara);
    contentDiv.appendChild(metaDiv);

    // Task 3 & 4: Delete Button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-danger';
    deleteBtn.textContent = 'Delete';
    deleteBtn.setAttribute('aria-label', `Delete note: ${note.text.substring(0, 15)}...`);
    deleteBtn.addEventListener('click', () => deleteNote(note.id));

    card.appendChild(contentDiv);
    card.appendChild(deleteBtn);

    return card;
  }

  /* ==========================================
     Task 4: Count Text Updater
     ========================================== */
  function updateCountDisplay(filteredCount, totalCount, query) {
    if (totalCount === 0) {
      noteCount.textContent = 'You have no notes yet.';
    } else if (query !== '') {
      noteCount.textContent = `Showing ${filteredCount} of ${totalCount} note${totalCount === 1 ? '' : 's'}.`;
    } else if (totalCount === 1) {
      noteCount.textContent = 'You have 1 note.';
    } else {
      noteCount.textContent = `You have ${totalCount} notes.`;
    }
  }

  /* ==========================================
     Task 5: LocalStorage Synchronization
     ========================================== */
  function saveNotes() {
    localStorage.setItem('quicknotes_data', JSON.stringify(notes));
  }

  /* ==========================================
     Helper Functions
     ========================================== */
  function showError(msg) {
    errorMessage.textContent = msg;
  }

  function clearError() {
    errorMessage.textContent = '';
  }

  function updateCharCounter() {
    const currentLength = noteTextInput.value.length;
    charCounter.textContent = `${currentLength}/200`;
    if (currentLength >= 190) {
      charCounter.style.color = '#e74c3c';
    } else {
      charCounter.style.color = '#888888';
    }
  }

  function formatDate(date) {
    const options = { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return date.toLocaleDateString('en-US', options);
  }
});