/** Open the tracker in Chrome's side panel when the toolbar icon is clicked. */
chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error("sidePanel.setPanelBehavior:", error));
});
