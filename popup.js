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

    if (e.key === "ArrowDown") {
      selectedIndex = (selectedIndex + 1) % visibleTabs.length;
    } else if (e.key === "ArrowUp") {
      selectedIndex =
        (selectedIndex - 1 + visibleTabs.length) % visibleTabs.length;
    } else if (e.key === "Enter") {
      const tabId = visibleTabs[selectedIndex].dataset.id;
      chrome.tabs.update(Number(tabId), { active: true });
      window.close(); // Close popup after switching
    }

    visibleTabs.forEach((li, i) => {
      li.classList.toggle("active", i === selectedIndex);
    });
  });
});

function renderTabs(tabs) {
  const tabList = document.getElementById("tabs-list");
  tabList.innerHTML = "";

  tabs.forEach((tab, index) => {
    const li = document.createElement("li");
    li.innerHTML = `<div>${tab.title} <span style="opacity: 0.5">(${tab.url})</span></div>`;
    li.dataset.id = tab.id;
    if (index === selectedIndex) li.classList.add("active");
    tabList.appendChild(li);
  });
}
