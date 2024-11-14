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
  DELAY: 1e3,
};
let globalDemographicId = "";
const createElementWithAttributes = (e, t = {}) => {
    const n = document.createElement(e);
    return (
      Object.entries(t).forEach(([e, t]) => {
        if ("dataset" === e)
          Object.entries(t).forEach(([e, t]) => {
            n.dataset[e] = t;
          });
        else if ("style" === e)
          Object.entries(t).forEach(([e, t]) => {
            n.style[e] = t;
          });
        else if ("listeners" === e)
          Object.entries(t).forEach(([e, t]) => {
            n.addEventListener(e, t);
          });
        else n[e] = t;
      }),
      n
    );
  },
  extractors = {
    demographicId: (e) => {
      const t = e?.match(/demographic_no\s*=\s*['"]?(\d+)['"]?/);
      return t
        ? ((globalDemographicId = t[1]),
          console.log("Extracted Demographic ID:", globalDemographicId),
          globalDemographicId)
        : null;
    },
    nameFromTitle: (e) => {
      const t = e.split("\n")[0].trim();
      return console.log("Extracted Name:", t), t;
    },
    typeFromTitle: (e) => {
      const t = e.split("\n").find((e) => e.trim().startsWith("type:")),
        n = t ? t.split(":")[1].trim() : "No Type";
      return console.log("Extracted Type:", n), n;
    },
  },
  messageHandlers = {
    sendDemographicInfo(e) {
      console.log("Sending Demographic Info:", e),
        setTimeout(() => {
          window.postMessage({ type: "UPDATE_DEMOGRAPHIC_INFO", ...e }, "*");
        }, CONFIG.DELAY);
    },
    sendClickEvent(e) {
      chrome.runtime.sendMessage({ type: "ELEMENT_CLICKED", payload: e });
    },
  },
  clickHandlers = {
    tableRow(e) {
      if (
        e.matches(
          `${CONFIG.SELECTORS.CONSULTATION_BUTTONS}, ${CONFIG.SELECTORS.WALKIN_IMAGES}`
        )
      ) {
        const t = e.closest("div")?.querySelector(CONFIG.SELECTORS.APPT_LINK);
        if (!t) return;
        const n = t.getAttribute("onclick"),
          r = t.getAttribute("title") || "No Title",
          o = n ? extractors.demographicId(n) : "No Demographic ID",
          i = extractors.nameFromTitle(r),
          s = extractors.typeFromTitle(r);
        messageHandlers.sendDemographicInfo({
          demographicId: o,
          linkType: s,
          name: i,
        }),
          messageHandlers.sendClickEvent({
            tagName: e.tagName,
            id: e.id || "No ID",
          });
      }
    },
    handleClick(e) {
      const t = e.currentTarget;
      t.classList.contains(CONFIG.CLASSES.VIDEO_CALL)
        ? clickHandlers.videoCall(e)
        : t.classList.contains(CONFIG.CLASSES.WALKIN)
        ? clickHandlers.walkin(e)
        : t.classList.contains(CONFIG.CLASSES.INIT_BUTTON)
        ? clickHandlers.initButton(e)
        : e.target.closest(CONFIG.SELECTORS.CONSULTATION_BUTTONS) &&
          clickHandlers.consultationButtonClick(e);
    },
    videoCall(e) {
      e.preventDefault(), console.log("Video Call Clicked:", e);
      const t = e.currentTarget
        .closest("div")
        ?.querySelector(CONFIG.SELECTORS.APPT_LINK);
      if (t) {
        const e = t.getAttribute("onclick"),
          n = t.getAttribute("title") || "No Title",
          r = extractors.demographicId(e),
          o = extractors.nameFromTitle(n),
          i = extractors.typeFromTitle(n);
        messageHandlers.sendDemographicInfo({
          demographicId: r,
          name: o,
          linkType: i,
        }),
          createReactChromeExtension({
            demographicId: r,
            name: o,
            linkType: i,
          });
      } else createReactChromeExtension({ demographicId: globalDemographicId });
    },
    walkin(e) {
      e.preventDefault();
      const t = e.currentTarget
        .closest("div")
        ?.querySelector(CONFIG.SELECTORS.APPT_LINK);
      if (t) {
        const e = t.getAttribute("onclick"),
          n = t.getAttribute("title") || "No Title",
          r = extractors.demographicId(e),
          o = extractors.nameFromTitle(n),
          i = extractors.typeFromTitle(n);
        messageHandlers.sendDemographicInfo({
          demographicId: r,
          name: o,
          linkType: i,
        }),
          createReactChromeExtension({
            demographicId: r,
            name: o,
            linkType: i,
          });
      } else createReactChromeExtension({});
    },
    consultationButtonClick(e) {
      e.preventDefault(), console.log("Consultation Button Clicked:", e);
      const t = e.target.closest(CONFIG.SELECTORS.CONSULTATION_BUTTONS),
        n = t.getAttribute("onclick"),
        r = t.getAttribute("title") || "No Title",
        o = extractors.demographicId(n),
        i = extractors.nameFromTitle(r),
        s = extractors.typeFromTitle(r);
      messageHandlers.sendDemographicInfo({
        demographicId: o,
        name: i,
        linkType: s,
      }),
        createReactChromeExtension({ demographicId: o, name: i, linkType: s });
    },
    initButton(e) {
      e.preventDefault(),
        console.log("Initialization Button Clicked:", e),
        createReactChromeExtension({ demographicId: globalDemographicId });
    },
  };
const replaceConsultationButtons = () => {
    console.log("Replacing Consultation Buttons"),
      document
        .querySelectorAll(CONFIG.SELECTORS.CONSULTATION_BUTTONS)
        .forEach((e) => {
          const t = e.querySelector("img")?.src;
          if (t) {
            const n = createElementWithAttributes("a", {
              href: "#",
              className: CONFIG.CLASSES.VIDEO_CALL,
              innerHTML: `<img src="${t}" alt="Video Call Icon" class="videoCallImage" style="width:14px;height:14px;margin-bottom:-2px;">`,
              listeners: { click: clickHandlers.handleClick },
            });
            e.parentNode.replaceChild(n, e);
          }
        }),
      document.querySelectorAll(CONFIG.SELECTORS.WALKIN_IMAGES).forEach((e) => {
        const t = e.closest("a");
        t &&
          (t.classList.add(CONFIG.CLASSES.WALKIN),
          t.addEventListener("click", clickHandlers.handleClick));
      }),
      document
        .querySelectorAll(CONFIG.SELECTORS.CONSULTATION_BUTTONS)
        .forEach((e) => {
          e.addEventListener("click", clickHandlers.handleClick);
        });
    const e = document.querySelector(`.${CONFIG.CLASSES.INIT_BUTTON}`);
    e
      ? e.addEventListener("click", clickHandlers.handleClick)
      : console.log("Initialization Button Not Found");
  },
  createReactChromeExtension = (e = {}) => {
    const t = document.querySelector(CONFIG.SELECTORS.REACT_APP);
    if (t)
      return void console.log("React app already exists, skipping creation.");
    const n = createElementWithAttributes("div", {
      id: "react-chrome-extension",
      className: "custom-scrollbar",
      dataset: { ...e },
    });
    document.body.appendChild(n), loadReactAppScript();
  },
  loadReactAppScript = () => {
    const e = createElementWithAttributes("script", {
      src: chrome.runtime.getURL("static/js/main.js"),
      listeners: {
        load: () => {
          console.log("React App Script Loaded");
        },
        error: (e) => {
          console.log("Failed to Load React App Script", e);
        },
      },
    });
    document.body.appendChild(e);
  };
replaceConsultationButtons();
const createInitButton = () => {
    console.log("Creating Initialization Button");
    const e = createElementWithAttributes("button", {
      id: "openReactApp",
      className: CONFIG.CLASSES.INIT_BUTTON,
      innerHTML: `<img src="${chrome.runtime.getURL(
        "./media/quipoLogo.png"
      )}" alt="Logo" style="width:32px;height:32px;border-radius:50%;">`,
      listeners: { click: clickHandlers.handleClick },
    });
    document.body.appendChild(e);
  },
  initContentScript = async () => {
    console.log("Initializing Content Script");
    const e = createElementWithAttributes("link", {
      rel: "stylesheet",
      href: chrome.runtime.getURL("static/css/main.css"),
    });
    document.head.appendChild(e),
      createInitButton(),
      replaceConsultationButtons(),
      document.querySelectorAll(CONFIG.SELECTORS.TABLE_ROWS).forEach((e) => {
        e.addEventListener("click", (e) => clickHandlers.tableRow(e.target));
      });
    const t = new MutationObserver(replaceConsultationButtons);
    t.observe(document.body, { childList: !0, subtree: !0 }),
      chrome.runtime.onMessage.addListener((e, t, n) => {
        "UPDATE_REACT_APP" === e.type &&
          (console.log("React App Update Triggered"), n({ status: "Success" }));
      });
  };
initContentScript();
