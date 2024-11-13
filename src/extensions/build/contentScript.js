let globalDemographicId = "";

const sendDemographicInfoWithDelay = async (info) => {

  console.log("Sending demographic info to React app:", info);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  window.postMessage(
    {
      type: "UPDATE_DEMOGRAPHIC_INFO",
      ...info,
    },
    "*"
  );
};

const extractNameFromTitle = (title) => title.split("\n")[0].trim();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "UPDATE_REACT_APP") {
    sendResponse({ status: "Success" });
    console.log("Updating React app with data:", request.type);
  }
});

const extractDemographicId = (onClickString) => {
  const match = onClickString?.match(/demographic_no\s*=\s*['"]?(\d+)['"]?/);
  if (match) {
    globalDemographicId = match[1];
    console.log("Extracted Demographic ID:", globalDemographicId);
    sendDemographicInfoWithDelay({
      demographicId: globalDemographicId,
      linkType: "",
      name: "",
    });
    return globalDemographicId;
  }
  return null;
};

const extractTypeFromTitle = (title) =>
  title
    .split("\n")
    .find((line) => line.trim().startsWith("type:"))
    ?.split(":")[1]
    ?.trim() || "No Type";

const handleClick = (event) => {

  const target = event.target.closest("button.myButtonClass"); 
  if (!target) return; 

  const clickedElementDetails = {
    tagName: target.tagName,
    id: target.id || "No ID",
    text: target.innerText,
    href: target.tagName === "A" ? target.href : undefined,
    className: target.className || "No Class",
    dataAttributes: getDataAttributes(target),
  };

  const apptLinkElement = target.closest("div")?.querySelector(".apptLink");
  if (apptLinkElement) {
    const onClickValue = apptLinkElement.getAttribute("onclick");
    const demographicId = onClickValue
      ? extractDemographicId(onClickValue)
      : "No Demographic ID";
    const title = apptLinkElement.getAttribute("title") || "No Title";

    console.log("Patient name:", extractNameFromTitle(title));
    const linkType = extractTypeFromTitle(title);

    sendDemographicInfoWithDelay({
      demographicId,
      linkType,
      name: extractNameFromTitle(title),
    });
  } else {
    console.log("No apptLink element found in the parent div.");
  }

  chrome.runtime.sendMessage({
    type: "ELEMENT_CLICKED",
    payload: clickedElementDetails,
  });
};

const getDataAttributes = (element) => {
  const dataAttrs = {};
  Array.from(element.attributes).forEach((attr) => {
    if (attr.name.startsWith("data-")) dataAttrs[attr.name] = attr.value;
  });
  return dataAttrs;
};

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
  button.innerHTML = `<img src="${chrome.runtime.getURL(
    "./media/quipoLogo.png"
  )}" alt="Logo" style="width:32px;height:32px;border-radius:50%;">`;
  button.addEventListener("click", createReactChromeExtension);
  document.body.appendChild(button);
};

const createReactChromeExtension = () => {
  if (!document.getElementById("react-chrome-extension")) {
    const appDiv = document.createElement("div");
    appDiv.id = "react-chrome-extension";
    appDiv.className = "custom-scrollbar";
    appDiv.dataset.demographicId = globalDemographicId;
    document.body.appendChild(appDiv);

    sendDemographicInfoWithDelay({
      currentWindow: window.location.href,
    });

    loadReactAppScript();
  } else {
    console.log("React app is already loaded.");
  }
};

const loadReactAppScript = () => {
  const reactAppScript = document.createElement("script");
  reactAppScript.src = chrome.runtime.getURL("static/js/main.js");
  reactAppScript.onload = () =>
    console.log("React app script loaded successfully.");
  reactAppScript.onerror = () =>
    console.error("Failed to load the React app script.");
  document.body.appendChild(reactAppScript);
};

const replaceInitiateConsultationWithButton = () => {
  document
    .querySelectorAll('[onclick^="initiateConsultation"]')
    .forEach((element) => {
      const imgSrc = element.querySelector("img")?.src;
      if (imgSrc) {
        const anchor = document.createElement("a");
        anchor.href = "#";
        anchor.className = "videoCallAnchor";
        anchor.innerHTML = `<img src="${imgSrc}" alt="Video Call Icon" class="videoCallImage" style="width:14px;height:14px;margin-bottom:-2px;">`;
        anchor.addEventListener("click", (event) => {
          event.preventDefault();
          const demographicId = extractDemographicId(
            anchor.closest("div")?.getAttribute("onclick")
          );
          createReactChromeExtension();
        });
        element.parentNode.replaceChild(anchor, element);
      } else console.log("No image found to replace element.");
    });

  document
    .querySelectorAll('a img[src$="../images/walkin.png"]')
    .forEach((img) => {
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
  const observer = new MutationObserver(replaceInitiateConsultationWithButton);
  observer.observe(document.body, { childList: true, subtree: true });
};

const initContentScript = () => {
  injectStylesheet();
  createButton();
  replaceInitiateConsultationWithButton();
  observeDOMChanges();

  // Add the event listener to specific buttons (replace "myButtonClass" with your desired class)
  document.querySelectorAll("button.myButtonClass").forEach((button) => {
    button.addEventListener("click", handleClick);
  });
};

document.addEventListener("click", handleClick);
initContentScript();
