// Mood selection
document.querySelectorAll(".mood-img").forEach(img => {
    img.addEventListener("click", () => {
      document.querySelectorAll(".mood-img").forEach(i => i.classList.remove("active"));
      img.classList.add("active");
    });
  });

  // Water intake toggle
  document.querySelectorAll(".drop").forEach(drop => {
    drop.addEventListener("click", () => {
      drop.classList.toggle("active");
    });
  });
  function handleTaskCheckbox(e) {
    const checkbox = e.target;
    const taskText = checkbox.nextElementSibling.textContent.trim();
    const completedList = document.getElementById('completed-list');
  
    // Check if the task already exists in Completed
    const existingItem = Array.from(completedList.children).find(
      item => item.textContent === taskText
    );
  
    if (checkbox.checked && taskText !== "") {
      // If not already added, add to completed
      if (!existingItem) {
        const newItem = document.createElement('li');
        newItem.textContent = taskText;
        newItem.classList.add("completed-item");
        completedList.appendChild(newItem);
      }
    } else {
      // If unchecked, remove from completed
      if (existingItem) {
        completedList.removeChild(existingItem);
      }
    }
  }
  document.querySelectorAll('.task-checkbox').forEach(cb => {
    cb.addEventListener('change', handleTaskCheckbox);
  });