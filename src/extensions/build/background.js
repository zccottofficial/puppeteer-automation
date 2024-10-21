chrome.runtime.onInstalled.addListener(() => {
    console.log("Service worker installed.");
});
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "BUTTON_CLICKED") {
        console.log("Button clicked on the webpage:", request.details);
        sendResponse({ status: "Message received" });
    }
});
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    console.log("Active tab:", tabs[0]);
});
