const board = document.getElementById("scrapboard");
const uploadInput = document.getElementById("upload-img");
const uploadBtn = document.getElementById("upload-btn");
const addTextBtn = document.getElementById("add-text");
const addStickerBtn = document.getElementById("add-sticker");
const fontSizePicker = document.getElementById("text-size");
const fontColorPicker = document.getElementById("text-color");

uploadBtn.onclick = () => {
  uploadInput.click();
};

uploadInput.onchange = (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = function(event) {
    const container = createScrapItem("200px", "200px");

    const img = document.createElement("img");
    img.src = event.target.result;
    img.className = "image-box";

    const closeBtn = createDeleteButton(container);

    container.appendChild(closeBtn);
    container.appendChild(img);
    board.appendChild(container);
    makeDraggable(container);
  };
  reader.readAsDataURL(file);
};

addTextBtn.onclick = () => {
  const container = createScrapItem("200px", "100px");

  const text = document.createElement("div");
  text.className = "text-box";
  text.contentEditable = true;
  text.setAttribute("data-placeholder", "Write something...");
  text.style.fontSize = fontSizePicker.value;
  text.style.color = fontColorPicker.value;

  // === BACKGROUND REMOVAL LOGIC ===
  text.addEventListener("focus", () => {
    document.body.style.overflow="hidden";
    if (text.innerText.trim() === "") {
      text.innerText = "";
    }
    text.style.background = "#fff";
  });

  text.addEventListener("blur", () => {
    document.body.style.overflow="";
    const content = text.innerText.trim();
    if (content.length > 0) {
      text.style.background = "transparent";
      text.style.border = "none";
    } else {
      container.remove();
    }
  });
  // === END BACKGROUND LOGIC ===

  const closeBtn = createDeleteButton(container);

  container.appendChild(closeBtn);
  container.appendChild(text);
  board.appendChild(container);
  makeDraggable(container);
};

addStickerBtn.onclick = () => {
  const container = createScrapItem("200px", "200px");

  const sticker = document.createElement("img");
  sticker.src = "assets/sticker1.png";
  sticker.className = "sticker-box";

  const closeBtn = createDeleteButton(container);

  container.appendChild(closeBtn);
  container.appendChild(sticker);
  board.appendChild(container);
  makeDraggable(container);
};

function createScrapItem(width, height) {
  const container = document.createElement("div");
  container.className = "scrap-item";
  container.style.top = "100px";
  container.style.left = "100px";
  container.style.width = width;
  container.style.height = height;
  container.style.transform = "translate(0px, 0px)";
  container.setAttribute("data-x", 0);
  container.setAttribute("data-y", 0);
  return container;
}

function createDeleteButton(container) {
  const closeBtn = document.createElement("span");
  closeBtn.innerText = "✖";
  closeBtn.className = "delete-btn";
  closeBtn.onclick = (e) => {
    e.stopPropagation();
    container.remove();
  };
  return closeBtn;
}

function makeDraggable(el) {
  el.style.position = "absolute";

  interact(el)
    .draggable({
      listeners: {
        move(event) {
          const target = event.target;
          const x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
          const y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;
          target.style.transform = `translate(${x}px, ${y}px)`;
          target.setAttribute("data-x", x);
          target.setAttribute("data-y", y);
        }
      }
    })
    .resizable({
      edges: { top: true, left: true, bottom: true, right: true },
      listeners: {
        move(event) {
          const target = event.target;
          target.style.width = `${event.rect.width}px`;
          target.style.height = `${event.rect.height}px`;

          const x = (parseFloat(target.getAttribute("data-x")) || 0) + event.deltaRect.left;
          const y = (parseFloat(target.getAttribute("data-y")) || 0) + event.deltaRect.top;

          target.style.transform = `translate(${x}px, ${y}px)`;
          target.setAttribute("data-x", x);
          target.setAttribute("data-y", y);
        }
      },
      modifiers: [
        interact.modifiers.restrictSize({
          min: { width: 40, height: 40 },
          max: { width: 600, height: 500 }
        })
      ]
    });
}

const menuToggle = document.getElementById("menu-toggle");
const toolbarContent = document.getElementById("toolbar-content");

menuToggle.onclick = () => {
  toolbarContent.classList.toggle("show");
};

const stickerGallery = document.getElementById("sticker-gallery");
const closeGalleryBtn = document.getElementById("close-gallery");

// Show gallery on button click
addStickerBtn.onclick = () => {
  stickerGallery.classList.remove("hidden");
};

// Hide gallery
closeGalleryBtn.onclick = () => {
  stickerGallery.classList.add("hidden");
};

// When user picks a sticker from the gallery
document.querySelectorAll(".gallery-sticker").forEach(sticker => {
  sticker.onclick = (e) => {
    const container = createScrapItem("200px", "200px");
    const chosenSticker = document.createElement("img");
    chosenSticker.src = e.target.src;
    chosenSticker.className = "sticker-box";

    const closeBtn = createDeleteButton(container);
    container.appendChild(closeBtn);
    container.appendChild(chosenSticker);
    board.appendChild(container);
    makeDraggable(container);

    stickerGallery.classList.add("hidden");
  };
});

const canvas = document.getElementById("drawing-canvas");
const ctx = canvas.getContext("2d");

const drawControls = document.getElementById("draw-controls");
const penBtn = document.getElementById("pen-tool");
const penSize = document.getElementById("pen-size");
const penColor = document.getElementById("pen-color");
const clearDraw = document.getElementById("clear-draw");
const closeDraw = document.getElementById("close-draw");
const eraserBtn = document.getElementById("eraser-tool");
canvas.style.pointerEvents = "none"; // Disable pen/eraser by default
let isDrawing = false;
let isEraser = false;

function resizeCanvas() {
  canvas.style.height = `calc(100vh - 60px)`; // set visual size via CSS
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 60; // match the internal height
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Activate Pen Tool
penBtn.onclick = () => {
  isEraser = false;
  canvas.style.pointerEvents = "auto";
  drawControls.classList.remove("hidden");
  penBtn.classList.add("active");
  eraserBtn.classList.remove("active");
};

// Activate Eraser Tool
eraserBtn.onclick = () => {
  isEraser = true;
  canvas.style.pointerEvents = "auto";
  drawControls.classList.remove("hidden");
  eraserBtn.classList.add("active");
  penBtn.classList.remove("active");
};

// Deactivate Drawing Tools
closeDraw.onclick = () => {
  canvas.style.pointerEvents = "none";
  drawControls.classList.add("hidden");
  ctx.beginPath();
};

// Clear Canvas
clearDraw.onclick = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

// Drawing Events
canvas.addEventListener("mousedown", () => isDrawing = true);
canvas.addEventListener("mouseup", () => {
  isDrawing = false;
  ctx.beginPath();
});
canvas.addEventListener("mouseout", () => {
  isDrawing = false;
  ctx.beginPath();
});

canvas.addEventListener("mousemove", (e) => {
  if (!isDrawing) return;

  const x = e.clientX;
  const y = e.clientY - 60;

  ctx.lineWidth = penSize.value;
  ctx.lineCap = "round";

  if (isEraser) {
    ctx.globalCompositeOperation = "destination-out";
  } else {
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = penColor.value;
  }

  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
});

canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  isDrawing = true;
  ctx.beginPath();
  ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
}, { passive: false });

canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  if (!isDrawing) return;
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;

  ctx.lineWidth = penSize.value;
  ctx.lineCap = "round";

  ctx.globalCompositeOperation = isEraser ? "destination-out" : "source-over";
  ctx.strokeStyle = penColor.value;

  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
}, { passive: false });

canvas.addEventListener("touchend", () => {
  isDrawing = false;
  ctx.beginPath();
});