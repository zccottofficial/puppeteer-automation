// Called when the service worker is installed
chrome.runtime.onInstalled.addListener(() => {
  console.log("Service worker installed.");
});

const myURLs = ["https://oscaremr.quipohealth.com/*"];

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    myURLs.some((url) => tab.url && tab.url.includes(url))
  ) {
    chrome.scripting.executeScript({
      target: { tabId },
      files: ["js/jquery-3.2.1.min.js", "js/sites_cs.js"],
    });
  }
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "ELEMENT_CLICKED") {
    console.log("Element clicked on the webpage:", request.details);

    sendToActiveTab({ type: "UPDATE_REACT_APP", data: request })
      .then((response) =>
        sendResponse({ status: "Message received", response })
      )
      .catch((error) => sendResponse({ status: "Error", error }));

    return true; // Keeps the message channel open for async response
  }
});

// Function to get the active tab
async function getActiveTab() {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs.length > 0) {
      console.log("Active tab:", tabs[0]);
      return tabs[0]; // Return the active tab
    } else {
      console.log("No active tabs found.");
      return null; // Return null if no active tab
    }
  } catch (error) {
    console.error("Error retrieving active tab:", error);
    return null; // Return null on error
  }
}

// Function to send a message to the active tab
async function sendToActiveTab(message) {
  const activeTab = await getActiveTab();
  if (activeTab) {
    return new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(activeTab.id, message, (response) => {
        if (chrome.runtime.lastError) {
          console.error(
            "Error sending message to active tab:",
            chrome.runtime.lastError
          );
          reject(chrome.runtime.lastError);
        } else {
          console.log("Response from content script:", response);
          resolve(response);
        }
      });
    });
  } else {
    console.error(
      "No active tab found or it does not contain the content script."
    );
    throw new Error("No active tab found");
  }
}
