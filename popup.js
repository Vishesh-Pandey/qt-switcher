let allTabs = [];
let selectedIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search");
  const tabList = document.getElementById("tabs-list");

  chrome.tabs.query({}, (tabs) => {
    allTabs = tabs;
    renderTabs(allTabs);
  });

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filtered = allTabs.filter(
      (tab) =>
        tab.title.toLowerCase().includes(query) ||
        tab.url.toLowerCase().includes(query)
    );
    selectedIndex = 0;
    renderTabs(filtered);
  });

  searchInput.addEventListener("keydown", (e) => {
    const visibleTabs = document.querySelectorAll("li");

    if (e.key === "ArrowDown" && !e.altKey) {
      selectedIndex = (selectedIndex + 1) % visibleTabs.length;
    } else if (e.key === "ArrowUp" && !e.altKey) {
      selectedIndex =
        (selectedIndex - 1 + visibleTabs.length) % visibleTabs.length;
    } else if (e.key === "Enter") {
      const tabId = visibleTabs[selectedIndex].dataset.id;
      chrome.tabs.update(Number(tabId), { active: true });
      window.close();
    }

    // Alt + Arrow keys to move tab
    if (e.altKey && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      const tabId = Number(visibleTabs[selectedIndex].dataset.id);

      chrome.tabs.get(tabId, (tab) => {
        const newIndex = e.key === "ArrowDown" ? tab.index + 1 : tab.index - 1;
        chrome.tabs.move(tabId, { index: newIndex }, () => {
          chrome.tabs.query({}, (tabs) => {
            allTabs = tabs;
            const movedTab = allTabs.find((t) => t.id === tabId);
            selectedIndex = allTabs.findIndex((t) => t.id === movedTab.id);
            renderTabs(allTabs);
          });
        });
      });
      e.preventDefault();
    }

    visibleTabs.forEach((li, i) => {
      li.classList.toggle("active", i === selectedIndex);
      if (i === selectedIndex) {
        li.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  });
});

function renderTabs(tabs) {
  const tabList = document.getElementById("tabs-list");
  tabList.innerHTML = "";

  tabs.forEach((tab, index) => {
    const li = document.createElement("li");
    li.innerHTML = `<div>${tab.title} <span style="opacity: 0.8">(${tab.url})</span></div>`;
    li.dataset.id = tab.id;
    if (index === selectedIndex) li.classList.add("active");
    tabList.appendChild(li);
  });

  // Ensure active tab is scrolled into view on render
  const activeLi = tabList.querySelector("li.active");
  if (activeLi) {
    activeLi.scrollIntoView({ behavior: "auto", block: "nearest" });
  }
}

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key.toLowerCase() === "d") {
    document.body.classList.remove("force-light");
    document.body.classList.add("force-dark");
  }

  if (e.ctrlKey && e.key.toLowerCase() === "l") {
    document.body.classList.remove("force-dark");
    document.body.classList.add("force-light");
  }
});
