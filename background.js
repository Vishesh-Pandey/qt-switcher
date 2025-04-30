chrome.commands.onCommand.addListener((command) => {
  if (command === "open-tab-switcher") {
    chrome.windows.create({
      url: chrome.runtime.getURL("popup.html"),
      type: "popup",
      width: 800,
      height: 500,
      focused: true,
    });
  }
});
