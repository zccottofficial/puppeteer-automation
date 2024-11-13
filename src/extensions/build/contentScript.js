const CONFIG = {
  SELECTORS: {
    TABLE_ROWS: "table tr",
    APPT_LINK: ".apptLink",
    CONSULTATION_BUTTONS: '[onclick^="initiateConsultation"]',
    WALKIN_IMAGES: 'a img[src$="../images/walkin.png"]',
    REACT_APP: "#react-chrome-extension",
  },
  CLASSES: {
    VIDEO_CALL: "videoCallAnchor",
    WALKIN: "walkinButton",
    INIT_BUTTON: "initButton",
  },
  DELAY: 1000,
};

let globalDemographicId = "";

const createElementWithAttributes = (tag, attributes = {}) => {
  const element = document.createElement(tag);
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === "dataset") {
      Object.entries(value).forEach(([dataKey, dataValue]) => {
        element.dataset[dataKey] = dataValue;
      });
    } else if (key === "style") {
      Object.entries(value).forEach(([styleKey, styleValue]) => {
        element.style[styleKey] = styleValue;
      });
    } else if (key === "listeners") {
      Object.entries(value).forEach(([event, handler]) => {
        element.addEventListener(event, handler);
      });
    } else {
      element[key] = value;
    }
  });
  return element;
};

const extractors = {
  demographicId: (onClickString) => {
    const match = onClickString?.match(/demographic_no\s*=\s*['"]?(\d+)['"]?/);
    if (match) {
      globalDemographicId = match[1];
      console.log("Extracted Demographic ID:", globalDemographicId);
      return globalDemographicId;
    }
    return null;
  },
  nameFromTitle: (title) => {
    const name = title.split("\n")[0].trim();
    console.log("Extracted Name:", name);
    return name;
  },
  typeFromTitle: (title) => {
    const typeLine = title
      .split("\n")
      .find((line) => line.trim().startsWith("type:"));
    const type = typeLine ? typeLine.split(":")[1].trim() : "No Type";
    console.log("Extracted Type:", type);
    return type;
  },
  dataAttributes: (element) => {
    const attributes = Array.from(element.attributes)
      .filter((attr) => attr.name.startsWith("data-"))
      .reduce(
        (acc, attr) => ({
          ...acc,
          [attr.name]: attr.value,
        }),
        {}
      );
    return attributes;
  },
};

const messageHandlers = {
  async sendDemographicInfo(info) {
    console.log("Sending Demographic Info:", info);
    await new Promise((resolve) => setTimeout(resolve, CONFIG.DELAY));
    window.postMessage(
      {
        type: "UPDATE_DEMOGRAPHIC_INFO",
        ...info,
      },
      "*"
    );
  },
  sendClickEvent(details) {
    chrome.runtime.sendMessage({
      type: "ELEMENT_CLICKED",
      payload: details,
    });
  },
};

const clickHandlers = {
  tableRow(target) {
    const apptLinkElement = target
      .closest("div")
      ?.querySelector(CONFIG.SELECTORS.APPT_LINK);
    if (!apptLinkElement) return;

    const onClickValue = apptLinkElement.getAttribute("onclick");
    const title = apptLinkElement.getAttribute("title") || "No Title";
    const demographicId = onClickValue
      ? extractors.demographicId(onClickValue)
      : "No Demographic ID";

    const name = extractors.nameFromTitle(title);
    const linkType = extractors.typeFromTitle(title);

    messageHandlers.sendDemographicInfo({
      demographicId,
      linkType,
      name,
      currentWindow: window.location.href,
    });

    messageHandlers.sendClickEvent({
      tagName: target.tagName,
      id: target.id || "No ID",
      text: target.innerText,
      href: target.tagName === "A" ? target.href : undefined,
      className: target.className || "No Class",
      dataAttributes: extractors.dataAttributes(target),
    });
  },

  handleClick(event) {
    const target = event.currentTarget;
    if (target.classList.contains(CONFIG.CLASSES.VIDEO_CALL)) {
      clickHandlers.videoCall(event);
    } else if (target.classList.contains(CONFIG.CLASSES.WALKIN)) {
      clickHandlers.walkin(event);
    } else if (target.classList.contains(CONFIG.CLASSES.INIT_BUTTON)) {
      clickHandlers.initButton(event);
    } else {
      // Check if the target is a consultation button
      if (event.target.closest(CONFIG.SELECTORS.CONSULTATION_BUTTONS)) {
        clickHandlers.consultationButtonClick(event);
      }
    }
  },

  videoCall(event) {
    event.preventDefault();
    console.log("Video Call Clicked:", event);
    const demographicId = extractors.demographicId(
      event.currentTarget.closest("div")?.getAttribute("onclick")
    );
    createReactChromeExtension(demographicId);
  },

  walkin(event) {
    event.preventDefault();
    createReactChromeExtension();
  },

  consultationButtonClick(event) {
    event.preventDefault(); // Prevent the default behavior of the link/button
    console.log("Consultation Button Clicked:", event);

    const apptLinkElement = event.target.closest(
      CONFIG.SELECTORS.CONSULTATION_BUTTONS
    );
    const onClickValue = apptLinkElement.getAttribute("onclick");
    const demographicId = extractors.demographicId(onClickValue);
    console.log("Demographic ID for Consultation Button:", demographicId);

    // Send demographic info only for consultation button clicks
    messageHandlers.sendDemographicInfo({
      demographicId,
      currentWindow: window.location.href,
    });

    createReactChromeExtension(demographicId);
  },
};

const replaceConsultationButtons = () => {
  console.log("Replacing Consultation Buttons");

  // Replace each consultation button with a custom link or element
  document
    .querySelectorAll(CONFIG.SELECTORS.CONSULTATION_BUTTONS)
    .forEach((element) => {
      const imgSrc = element.querySelector("img")?.src;
      if (imgSrc) {
        // Create a new anchor for video call if needed
        const anchor = createElementWithAttributes("a", {
          href: "#",
          className: CONFIG.CLASSES.VIDEO_CALL,
          innerHTML: `<img src="${imgSrc}" alt="Video Call Icon" class="videoCallImage" style="width:14px;height:14px;margin-bottom:-2px;">`,
          listeners: {
            click: clickHandlers.handleClick, // Bind the click handler specifically for consultation buttons
          },
        });
        element.parentNode.replaceChild(anchor, element); // Replace the original element with the new anchor
      }
    });

  // Add event listener for walk-in images (separate handler)
  document.querySelectorAll(CONFIG.SELECTORS.WALKIN_IMAGES).forEach((img) => {
    const anchor = img.closest("a");
    if (anchor) {
      anchor.classList.add(CONFIG.CLASSES.WALKIN);
      anchor.addEventListener("click", clickHandlers.handleClick); // Use the generic click handler
    }
  });

  // Attach the consultation button click handler
  document
    .querySelectorAll(CONFIG.SELECTORS.CONSULTATION_BUTTONS)
    .forEach((btn) => {
      btn.addEventListener("click", clickHandlers.handleClick); // Use the generic click handler
    });

  // Add event listener for the init button
  const initButton = document.querySelector(`.${CONFIG.CLASSES.INIT_BUTTON}`);
  if (initButton) {
    initButton.addEventListener("click", clickHandlers.handleClick); // Use the generic click handler
  }
};

const createReactChromeExtension = (demographicId) => {
  // Check if the React app already exists
  const existingApp = document.querySelector(CONFIG.SELECTORS.REACT_APP);
  if (existingApp) {
    console.log("React app already exists, skipping message update.");
    return; // Skip message update if the app is already present
  }

  const appDiv = createElementWithAttributes("div", {
    id: "react-chrome-extension",
    className: "custom-scrollbar",
    dataset: { demographicId },
  });

  document.body.appendChild(appDiv);

  messageHandlers.sendDemographicInfo({
    currentWindow: window.location.href,
  });

  loadReactAppScript();
};

const loadReactAppScript = () => {
  console.log("Loading React App Script");
  const reactAppScript = createElementWithAttributes("script", {
    src: chrome.runtime.getURL("static/js/main.js"),
    listeners: {
      load: () => {
        console.log("React App Script Loaded");
      },
      error: () => {
        console.log("Failed to Load React App Script");
      },
    },
  });
  document.body.appendChild(reactAppScript);
};

const createInitButton = () => {
  console.log("Creating Initialization Button");
  const button = createElementWithAttributes("button", {
    id: "openReactApp",
    className: CONFIG.CLASSES.INIT_BUTTON,
    innerHTML: `<img src="${chrome.runtime.getURL("./media/quipoLogo.png")}" 
                alt="Logo" style="width:32px;height:32px;border-radius:50%;">`,
    listeners: {
      click: clickHandlers.initButton,
    },
  });
  document.body.appendChild(button);
};

const initContentScript = () => {
  console.log("Initializing Content Script");
  const link = createElementWithAttributes("link", {
    rel: "stylesheet",
    href: chrome.runtime.getURL("static/css/main.css"),
  });
  document.head.appendChild(link);

  createInitButton();
  replaceConsultationButtons();

  document.querySelectorAll(CONFIG.SELECTORS.TABLE_ROWS).forEach((row) => {
    row.addEventListener("click", (event) =>
      clickHandlers.tableRow(event.target)
    );
  });

  const observer = new MutationObserver(replaceConsultationButtons);
  observer.observe(document.body, { childList: true, subtree: true });

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "UPDATE_REACT_APP") {
      console.log("React App Update Triggered");
      sendResponse({ status: "Success" });
    }
  });
};

initContentScript();
