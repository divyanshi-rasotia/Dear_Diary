const textarea = document.querySelector('textarea');
const saveBtn = document.getElementById('saveBtn');
const clearBtn = document.getElementById('clearBtn');

// Load saved note if exists
window.onload = () => {
  const savedNote = localStorage.getItem('dearDiaryNote');
  if (savedNote) textarea.value = savedNote;
};

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 1000); // Hide after 2 seconds
}

saveBtn.onclick = () => {
  localStorage.setItem('dearDiaryNote', textarea.value);
  showToast('Note saved!');
};

clearBtn.onclick = () => {
  textarea.value = '';
  localStorage.removeItem('dearDiaryNote');
};