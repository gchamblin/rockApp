// App logic: tab switching, local (offline) rock collection storage, search/filters, guide/facts rendering.

const STORAGE_KEY = "logansCollection";

// Search and filter state
let collectionSearchQuery = "";
let collectionTypeFilter = "all";
let guideSearchQuery = "";
let guideTypeFilter = "all";
let floridaSearchQuery = "";

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

// ---- Collection Search & Filters ----
function initCollectionFilters() {
  const searchInput = document.getElementById("collection-search");
  const clearBtn = document.getElementById("clear-collection-search");
  const filterPills = document.querySelectorAll("#collection-type-filters .filter-pill");

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      collectionSearchQuery = e.target.value.trim().toLowerCase();
      if (clearBtn) {
        clearBtn.classList.toggle("hidden", collectionSearchQuery.length === 0);
      }
      renderCollection();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      collectionSearchQuery = "";
      clearBtn.classList.add("hidden");
      renderCollection();
    });
  }

  filterPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      filterPills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      collectionTypeFilter = pill.dataset.type || "all";
      renderCollection();
    });
  });
}

// ---- Collection Rendering ----
function renderCollection() {
  const grid = document.getElementById("collection-grid");
  const emptyMsg = document.getElementById("empty-msg");
  const countEl = document.getElementById("collection-count");
  const allRocks = getCollection();

  grid.innerHTML = "";

  // Apply search & type filter
  const filteredRocks = allRocks.filter((rock) => {
    const matchesSearch =
      !collectionSearchQuery ||
      (rock.name && rock.name.toLowerCase().includes(collectionSearchQuery)) ||
      (rock.type && rock.type.toLowerCase().includes(collectionSearchQuery)) ||
      (rock.location && rock.location.toLowerCase().includes(collectionSearchQuery)) ||
      (rock.notes && rock.notes.toLowerCase().includes(collectionSearchQuery));

    let matchesType = true;
    if (collectionTypeFilter !== "all") {
      if (collectionTypeFilter === "Other") {
        matchesType = !rock.type || !["Igneous", "Sedimentary", "Metamorphic", "Mineral", "Fossil"].includes(rock.type);
      } else {
        matchesType = rock.type === collectionTypeFilter;
      }
    }

    return matchesSearch && matchesType;
  });

  if (allRocks.length === 0) {
    emptyMsg.textContent = 'You haven\'t added any rocks yet. Tap "Add a Rock" to start!';
    emptyMsg.classList.remove("hidden");
    if (countEl) countEl.textContent = "";
  } else if (filteredRocks.length === 0) {
    emptyMsg.textContent = "No rocks in your collection match this filter or search.";
    emptyMsg.classList.remove("hidden");
    if (countEl) countEl.textContent = `Showing 0 of ${allRocks.length} rock(s)`;
  } else {
    emptyMsg.classList.add("hidden");
    if (countEl) {
      if (filteredRocks.length === allRocks.length) {
        countEl.textContent = `Total: ${allRocks.length} rock(s)`;
      } else {
        countEl.textContent = `Showing ${filteredRocks.length} of ${allRocks.length} rock(s)`;
      }
    }
  }

  filteredRocks.forEach((rock) => {
    const card = document.createElement("div");
    card.className = "card";

    const media = rock.photo
      ? `<img src="${rock.photo}" alt="${escapeHtml(rock.name)}" />`
      : `<div class="emoji">🪨</div>`;

    card.innerHTML = `
      ${media}
      <h3>${escapeHtml(rock.name)}</h3>
      <span class="card-tag">${escapeHtml(rock.type || "Unknown type")}</span>
      ${rock.location ? `<p style="margin-top:4px;">📍 ${escapeHtml(rock.location)}</p>` : ""}
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
  if (!confirm("Are you sure you want to remove this rock from your collection?")) return;
  const rocks = getCollection().filter((r) => r.id !== id);
  saveCollection(rocks);
  renderCollection();
}

function showRockDetail(rock) {
  const body = document.getElementById("modal-body");
  body.innerHTML = `
    ${rock.photo ? `<img src="${rock.photo}" alt="${escapeHtml(rock.name)}" />` : '<div class="emoji" style="font-size:3rem;text-align:center;margin-bottom:10px;">🪨</div>'}
    <h2>${escapeHtml(rock.name)}</h2>
    <span class="fun-fact-tag">${escapeHtml(rock.type || "Rock")}</span>
    ${rock.location ? `<p><strong>📍 Found at:</strong> ${escapeHtml(rock.location)}</p>` : ""}
    ${rock.notes ? `<p><strong>📝 Notes:</strong> ${escapeHtml(rock.notes)}</p>` : ""}
    <p><em>Added on ${new Date(rock.dateAdded).toLocaleDateString()}</em></p>
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

// ---- Rock Guide Filters & Rendering ----
function initGuideFilters() {
  const searchInput = document.getElementById("guide-search");
  const clearBtn = document.getElementById("clear-guide-search");
  const filterPills = document.querySelectorAll("#guide-type-filters .filter-pill");

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      guideSearchQuery = e.target.value.trim().toLowerCase();
      if (clearBtn) {
        clearBtn.classList.toggle("hidden", guideSearchQuery.length === 0);
      }
      renderGuide();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      guideSearchQuery = "";
      clearBtn.classList.add("hidden");
      renderGuide();
    });
  }

  filterPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      filterPills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      guideTypeFilter = pill.dataset.guideType || "all";
      renderGuide();
    });
  });
}

function renderGuide() {
  const grid = document.getElementById("guide-grid");
  const emptyMsg = document.getElementById("guide-empty-msg");
  const countEl = document.getElementById("guide-count");
  grid.innerHTML = "";

  const filtered = ROCK_GUIDE.filter((item) => {
    const matchesSearch =
      !guideSearchQuery ||
      item.name.toLowerCase().includes(guideSearchQuery) ||
      item.type.toLowerCase().includes(guideSearchQuery) ||
      item.description.toLowerCase().includes(guideSearchQuery) ||
      item.funFact.toLowerCase().includes(guideSearchQuery);

    const matchesType = guideTypeFilter === "all" || item.type === guideTypeFilter;
    return matchesSearch && matchesType;
  });

  if (filtered.length === 0) {
    emptyMsg.classList.remove("hidden");
    if (countEl) countEl.textContent = `Showing 0 of ${ROCK_GUIDE.length} rocks`;
  } else {
    emptyMsg.classList.add("hidden");
    if (countEl) {
      countEl.textContent =
        filtered.length === ROCK_GUIDE.length
          ? `Total: ${ROCK_GUIDE.length} rocks & minerals`
          : `Showing ${filtered.length} of ${ROCK_GUIDE.length}`;
    }
  }

  filtered.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="emoji">${item.emoji}</div>
      <h3>${escapeHtml(item.name)}</h3>
      <span class="card-tag">${escapeHtml(item.type)}</span>
    `;
    card.addEventListener("click", () => {
      const body = document.getElementById("modal-body");
      body.innerHTML = `
        <div class="emoji" style="font-size:3rem;text-align:center;">${item.emoji}</div>
        <h2>${escapeHtml(item.name)}</h2>
        <span class="fun-fact-tag">${escapeHtml(item.type)}</span>
        <p>${escapeHtml(item.description)}</p>
        <p><strong>💡 Cool Fact:</strong> ${escapeHtml(item.funFact)}</p>
      `;
      openModal();
    });
    grid.appendChild(card);
  });
}

// ---- Florida Facts Filters & Rendering ----
function initFloridaFilters() {
  const searchInput = document.getElementById("florida-search");
  const clearBtn = document.getElementById("clear-florida-search");

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      floridaSearchQuery = e.target.value.trim().toLowerCase();
      if (clearBtn) {
        clearBtn.classList.toggle("hidden", floridaSearchQuery.length === 0);
      }
      renderFlorida();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      floridaSearchQuery = "";
      clearBtn.classList.add("hidden");
      renderFlorida();
    });
  }
}

function renderFlorida() {
  const grid = document.getElementById("florida-grid");
  const emptyMsg = document.getElementById("florida-empty-msg");
  const countEl = document.getElementById("florida-count");
  grid.innerHTML = "";

  const filtered = FLORIDA_FACTS.filter((item) => {
    return (
      !floridaSearchQuery ||
      item.name.toLowerCase().includes(floridaSearchQuery) ||
      item.tag.toLowerCase().includes(floridaSearchQuery) ||
      item.description.toLowerCase().includes(floridaSearchQuery) ||
      item.funFact.toLowerCase().includes(floridaSearchQuery)
    );
  });

  if (filtered.length === 0) {
    emptyMsg.classList.remove("hidden");
    if (countEl) countEl.textContent = `Showing 0 of ${FLORIDA_FACTS.length} facts`;
  } else {
    emptyMsg.classList.add("hidden");
    if (countEl) {
      countEl.textContent =
        filtered.length === FLORIDA_FACTS.length
          ? `Total: ${FLORIDA_FACTS.length} Florida facts`
          : `Showing ${filtered.length} of ${FLORIDA_FACTS.length}`;
    }
  }

  filtered.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="emoji">${item.emoji}</div>
      <h3>${escapeHtml(item.name)}</h3>
      <span class="card-tag">${escapeHtml(item.tag)}</span>
    `;
    card.addEventListener("click", () => {
      const body = document.getElementById("modal-body");
      body.innerHTML = `
        <div class="emoji" style="font-size:3rem;text-align:center;">${item.emoji}</div>
        <h2>${escapeHtml(item.name)}</h2>
        <span class="fun-fact-tag">${escapeHtml(item.tag)}</span>
        <p>${escapeHtml(item.description)}</p>
        <p><strong>💡 Cool Fact:</strong> ${escapeHtml(item.funFact)}</p>
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
  initCollectionFilters();
  initGuideFilters();
  initFloridaFilters();
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
