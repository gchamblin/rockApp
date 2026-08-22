// App logic: tab switching, local (offline) rock collection storage, guide/facts rendering.

const STORAGE_KEY = "logansCollection";

function getCollection() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveCollection(rocks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rocks));
}

// ---- Tabs ----
function initTabs() {
  const tabBtns = document.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".tab-panel");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach((b) => b.classList.remove("active"));
      panels.forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.tab).classList.add("active");
    });
  });
}

// ---- Collection ----
function renderCollection() {
  const grid = document.getElementById("collection-grid");
  const emptyMsg = document.getElementById("empty-msg");
  const rocks = getCollection();

  grid.innerHTML = "";
  emptyMsg.classList.toggle("hidden", rocks.length > 0);

  rocks.forEach((rock) => {
    const card = document.createElement("div");
    card.className = "card";

    const media = rock.photo
      ? `<img src="${rock.photo}" alt="${escapeHtml(rock.name)}" />`
      : `<div class="emoji">🪨</div>`;

    card.innerHTML = `
      ${media}
      <h3>${escapeHtml(rock.name)}</h3>
      <p>${escapeHtml(rock.type || "Unknown type")}</p>
      <button class="delete-btn" data-id="${rock.id}">Remove</button>
    `;

    card.addEventListener("click", (e) => {
      if (e.target.classList.contains("delete-btn")) return;
      showRockDetail(rock);
    });

    card.querySelector(".delete-btn").addEventListener("click", () => {
      deleteRock(rock.id);
    });

    grid.appendChild(card);
  });
}

function deleteRock(id) {
  const rocks = getCollection().filter((r) => r.id !== id);
  saveCollection(rocks);
  renderCollection();
}

function showRockDetail(rock) {
  const body = document.getElementById("modal-body");
  body.innerHTML = `
    ${rock.photo ? `<img src="${rock.photo}" alt="${escapeHtml(rock.name)}" />` : ""}
    <h2>${escapeHtml(rock.name)}</h2>
    <p><strong>Type:</strong> ${escapeHtml(rock.type || "Unknown")}</p>
    ${rock.location ? `<p><strong>Found at:</strong> ${escapeHtml(rock.location)}</p>` : ""}
    ${rock.notes ? `<p><strong>Notes:</strong> ${escapeHtml(rock.notes)}</p>` : ""}
    <p><em>Added ${new Date(rock.dateAdded).toLocaleDateString()}</em></p>
  `;
  openModal();
}

function initAddForm() {
  const form = document.getElementById("add-rock-form");
  const photoInput = document.getElementById("rock-photo");
  const preview = document.getElementById("photo-preview");
  let photoData = "";

  photoInput.addEventListener("change", () => {
    const file = photoInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      photoData = reader.result;
      preview.src = photoData;
      preview.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const rock = {
      id: Date.now().toString(),
      name: document.getElementById("rock-name").value.trim(),
      type: document.getElementById("rock-type").value,
      location: document.getElementById("rock-location").value.trim(),
      notes: document.getElementById("rock-notes").value.trim(),
      photo: photoData,
      dateAdded: new Date().toISOString()
    };

    if (!rock.name) return;

    const rocks = getCollection();
    rocks.unshift(rock);
    saveCollection(rocks);

    form.reset();
    preview.classList.add("hidden");
    photoData = "";

    renderCollection();
    document.querySelector('.tab-btn[data-tab="collection"]').click();
  });
}

// ---- Backup: Export / Import ----
function initBackup() {
  const exportBtn = document.getElementById("export-btn");
  const importBtn = document.getElementById("import-btn");
  const importFile = document.getElementById("import-file");

  exportBtn.addEventListener("click", () => {
    const rocks = getCollection();
    const blob = new Blob([JSON.stringify(rocks, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "logans-collection.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  importBtn.addEventListener("click", () => importFile.click());

  importFile.addEventListener("change", () => {
    const file = importFile.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      let incoming;
      try {
        incoming = JSON.parse(reader.result);
      } catch (e) {
        alert("That file doesn't look like a valid rock collection file.");
        return;
      }
      if (!Array.isArray(incoming)) {
        alert("That file doesn't look like a valid rock collection file.");
        return;
      }

      const existing = getCollection();
      const existingIds = new Set(existing.map((r) => r.id));
      const merged = existing.concat(incoming.filter((r) => r && r.id && !existingIds.has(r.id)));

      saveCollection(merged);
      renderCollection();
      importFile.value = "";
      alert(`Imported! Your collection now has ${merged.length} rock(s).`);
    };
    reader.readAsText(file);
  });
}

// ---- Rock Guide ----
function renderGuide() {
  const grid = document.getElementById("guide-grid");
  grid.innerHTML = "";

  ROCK_GUIDE.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="emoji">${item.emoji}</div>
      <h3>${escapeHtml(item.name)}</h3>
      <p>${escapeHtml(item.type)}</p>
    `;
    card.addEventListener("click", () => {
      const body = document.getElementById("modal-body");
      body.innerHTML = `
        <div class="emoji" style="font-size:3rem;">${item.emoji}</div>
        <h2>${escapeHtml(item.name)}</h2>
        <span class="fun-fact-tag">${escapeHtml(item.type)}</span>
        <p>${escapeHtml(item.description)}</p>
        <p><strong>Cool Fact:</strong> ${escapeHtml(item.funFact)}</p>
      `;
      openModal();
    });
    grid.appendChild(card);
  });
}

// ---- Florida Facts ----
function renderFlorida() {
  const grid = document.getElementById("florida-grid");
  grid.innerHTML = "";

  FLORIDA_FACTS.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="emoji">${item.emoji}</div>
      <h3>${escapeHtml(item.name)}</h3>
      <p>${escapeHtml(item.tag)}</p>
    `;
    card.addEventListener("click", () => {
      const body = document.getElementById("modal-body");
      body.innerHTML = `
        <div class="emoji" style="font-size:3rem;">${item.emoji}</div>
        <h2>${escapeHtml(item.name)}</h2>
        <span class="fun-fact-tag">${escapeHtml(item.tag)}</span>
        <p>${escapeHtml(item.description)}</p>
        <p><strong>Cool Fact:</strong> ${escapeHtml(item.funFact)}</p>
      `;
      openModal();
    });
    grid.appendChild(card);
  });
}

// ---- Modal ----
function openModal() {
  document.getElementById("detail-modal").classList.remove("hidden");
}

function initModal() {
  document.getElementById("modal-close").addEventListener("click", () => {
    document.getElementById("detail-modal").classList.add("hidden");
  });
  document.getElementById("detail-modal").addEventListener("click", (e) => {
    if (e.target.id === "detail-modal") {
      e.currentTarget.classList.add("hidden");
    }
  });
}

// Prevent stored rock names/notes from being rendered as HTML.
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

// ---- Init ----
document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initModal();
  initAddForm();
  initBackup();
  renderCollection();
  renderGuide();
  renderFlorida();
});

// Register service worker so the app works fully offline once installed.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {
      // Offline app still works without the service worker; just no pre-caching.
    });
  });
}
