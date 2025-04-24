function generateCalendar() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
  
    const firstDay = new Date(year, month, 1).getDay(); // day of week (0–6)
    const daysInMonth = new Date(year, month + 1, 0).getDate();
  
    const calendarHeader = document.getElementById("calendar-header");
    const calendarGrid = document.getElementById("calendar-grid");
  
    // Month names
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    calendarHeader.innerHTML = `<h4>${monthNames[month]} ${year}</h4>`;
  
    // Days of week
    const days = ["S", "M", "T", "W", "T", "F", "S"];
    calendarGrid.innerHTML = days.map(d => `<div class="calendar-cell header">${d}</div>`).join("");
  
    // Padding for first week
    for (let i = 0; i < firstDay; i++) {
      calendarGrid.innerHTML += `<div class="calendar-cell empty"></div>`;
    }
  
    // Fill in the days
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = d === today.getDate() ? "today" : "";
      calendarGrid.innerHTML += `<div class="calendar-cell ${isToday}">${d}</div>`;
    }
  }
  
  generateCalendar();