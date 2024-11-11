// Declared globally for sending to the React app
let globalDemographicId = "";

// Sending the demographic info, linkType, title, and name to the React app with a delay
const sendDemographicInfoWithDelay = (info) => {
  setTimeout(() => {
    if (info.demographicId && info.linkType) {
      console.log("Sending demographic info to React app:", info);
      window.postMessage(
        {
          type: "UPDATE_DEMOGRAPHIC_INFO",
          demographicId: info.demographicId,
          linkType: info.linkType,
          name: info.name, // Send the name to React
        },
        "*"
      );
    } else {
      console.log("No demographic info available to send.");
    }
  }, 1000);
};

// Function to extract the name from the title attribute
const extractNameFromTitle = (title) => {
  const lines = title.split("\n");
  return lines[0].trim(); // The name is on the first line
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "UPDATE_REACT_APP") {
    sendResponse({ status: "Success" });
    console.log("Updating React app with data:", request.type);
  }
});

function extractDemographicId(onClickString) {
  const regex = /demographic_no\s*=\s*['"]?(\d+)['"]?/;
  const match = onClickString ? onClickString.match(regex) : null;

  if (match && match[1]) {
    const id = match[1];
    console.log("Extracted Demographic ID:", id);
    globalDemographicId = id;

    sendDemographicInfoWithDelay({
      demographicId: globalDemographicId,
      linkType: "",
      name: "",
    });

    return id;
  } else {
    return null;
  }
}

const extractTypeFromTitle = (title) => {
  // Split the title string into lines
  const lines = title.split("\n");
  for (const line of lines) {
    // Check if the line contains 'type:'
    if (line.trim().startsWith("type:")) {
      // Extract the type value
      return line.split(":")[1]?.trim() || "No Type";
    }
  }
  return "No Type"; // Fallback if 'type:' not found
};

const handleClick = (event) => {
  const target = event.target;

  const targetTable = document.querySelector("table");
  if (!targetTable || !targetTable.contains(target)) {
    return;
  }

  const clickedElementDetails = {
    tagName: target.tagName,
    id: target.id || "No ID",
    text: target.innerText,
    href: target.tagName === "A" ? target.href : undefined,
    className: target.className || "No Class",
    dataAttributes: getDataAttributes(target),
  };

  const parentDiv = target.closest("div");
  if (parentDiv) {
    const apptLinkElement = parentDiv.querySelector(".apptLink");
    if (apptLinkElement) {
      const onClickValue = apptLinkElement.getAttribute("onclick");
      const demographicId = onClickValue
        ? extractDemographicId(onClickValue)
        : "No Demographic ID";
      const title = apptLinkElement.getAttribute("title") || "No Title";
      const name = extractNameFromTitle(title);
      console.log("Patient name:", name);

      const linkType = extractTypeFromTitle(title);

      const apptLinkDetails = {
        tagName: apptLinkElement.tagName,
        id: apptLinkElement.id || "No ID",
        className: apptLinkElement.className || "No Class",
        dataAttributes: getDataAttributes(apptLinkElement),
        innerText: apptLinkElement.innerText,
        href:
          apptLinkElement.tagName === "A" ? apptLinkElement.href : "No HREF",
        onClick: onClickValue || "No onClick",
        demographicId: demographicId,
        title: title,
        linkType: linkType,
        timestamp: Date.now(),
      };

      // Save demographic ID globally
      globalDemographicId = demographicId;

      // Send demographic info with delay

      sendDemographicInfoWithDelay({
        demographicId: demographicId,
        linkType: linkType,
        name: name, // Send the extracted name to React
      });
    } else {
      console.log("No apptLink element found in the parent div.");
    }
  } else {
    console.log("No parent div found.");
  }
  chrome.runtime.sendMessage({
    type: "ELEMENT_CLICKED",
    payload: clickedElementDetails,
  });
};

function getDataAttributes(element) {
  const dataAttrs = {};
  Array.from(element.attributes).forEach((attr) => {
    if (attr.name.startsWith("data-")) {
      dataAttrs[attr.name] = attr.value;
    }
  });
  return dataAttrs;
}

const injectStylesheet = () => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = chrome.runtime.getURL("static/css/main.css");
  document.head.appendChild(link);
};

const createButton = () => {
  const button = document.createElement("button");
  button.id = "openReactApp";
  button.className = "initButton";

  const img = document.createElement("img");
  img.src = chrome.runtime.getURL("./media/quipoLogo.png");
  img.alt = "Logo";
  img.style.width = "32px";
  img.style.height = "32px";
  img.style.borderRadius = "50%";
  button.appendChild(img);

  document.body.appendChild(button);
  button.addEventListener("click", createReactChromeExtension);
};

const createReactChromeExtension = () => {
  if (!document.getElementById("react-chrome-extension")) {
    const appDiv = document.createElement("div");
    appDiv.id = "react-chrome-extension";
    appDiv.className = "custom-scrollbar";
    appDiv.setAttribute("data-demographic-id", globalDemographicId);
    document.body.appendChild(appDiv);
    loadReactAppScript();
  } else {
    console.log("React app is already loaded.");
  }
};

const loadReactAppScript = () => {
  const reactAppScript = document.createElement("script");
  reactAppScript.src = chrome.runtime.getURL("static/js/main.js");
  reactAppScript.onload = () => {
    console.log("React app script loaded successfully.");
  };
  reactAppScript.onerror = () =>
    console.error("Failed to load the React app script.");
  document.body.appendChild(reactAppScript);
};

const replaceInitiateConsultationWithButton = () => {
  const elements = document.querySelectorAll(
    '[onclick^="initiateConsultation"]'
  );

  elements.forEach((element) => {
    const imgSrc = element.querySelector("img")
      ? element.querySelector("img").src
      : null;
    const elementText = element.innerText;

    if (imgSrc) {
      const anchor = document.createElement("a");
      anchor.href = "#";
      anchor.className = "videoCallAnchor";

      const img = document.createElement("img");
      img.src = imgSrc;
      img.alt = "Video Call Icon";
      img.className = "videoCallImage";
      img.style.width = "14px";
      img.style.height = "14px";
      img.style.marginBottom = "-2px";

      anchor.appendChild(img);

      anchor.addEventListener("click", function (event) {
        event.preventDefault();
        const closestDiv = this.closest("div");
        const onClickValue = closestDiv.getAttribute("onclick");
        const demographicId = extractDemographicId(onClickValue);
        createReactChromeExtension();
      });

      element.parentNode.replaceChild(anchor, element);
    } else {
      console.log("No image found to replace element.");
    }
  });

  // New code to target anchor tags with "walking.png" image source
  const walkingElements = document.querySelectorAll(
    'a img[src$="../images/walkin.png"]'
  );

  walkingElements.forEach((img) => {
    const anchor = img.closest("a");
    if (anchor) {
      anchor.classList.add("walkinButton");
      anchor.addEventListener("click", (event) => {
        event.preventDefault();
        createReactChromeExtension();
      });
    }
  });
};

const observeDOMChanges = () => {
  const observer = new MutationObserver(() => {
    replaceInitiateConsultationWithButton();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
};

const initContentScript = () => {
  injectStylesheet();
  createButton();
  replaceInitiateConsultationWithButton();
  observeDOMChanges();
};

// Event listener for clicks
document.addEventListener("click", handleClick);

// Initialize the content script
initContentScript();
