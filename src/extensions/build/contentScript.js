// Inject the React app CSS when the page loads
const reactAppCSS = document.createElement("link");
reactAppCSS.rel = "stylesheet";
reactAppCSS.href = chrome.runtime.getURL("static/css/main.css");
document.head.appendChild(reactAppCSS);

// Create the button element
const mainDiv = document.getElementById("root");
const injectButton = document.createElement("button");
injectButton.id = "openReactApp";
injectButton.className = "initButton";

// Create the image element and append it inside the button
const buttonImage = document.createElement("img");
buttonImage.src = chrome.runtime.getURL("./media/logo512.png");
buttonImage.alt = "Logo";
buttonImage.style.width = "32px";
buttonImage.style.height = "32px";
injectButton.appendChild(buttonImage);

// Append the button inside the root element
mainDiv.appendChild(injectButton);

// Event listener for button clicks
injectButton.addEventListener("click", () => {
    if (!document.getElementById("react-chrome-extension")) {
        // Create and inject the div for the React app
        const appDiv = document.createElement("div");
        appDiv.id = "react-chrome-extension";
        appDiv.classList = "react-ext-container custom-scrollbar";
        document.body.appendChild(appDiv);

        // Inject the React app script only if it hasn't been added already
        if (!document.getElementById("react-app-script")) {
            const reactAppScript = document.createElement("script");
            reactAppScript.id = "react-app-script";
            reactAppScript.src = chrome.runtime.getURL("static/js/main.js");
            document.body.appendChild(reactAppScript);
        }
    }
});

// Global event listener for clicks, logging button clicks and image clicks
document.addEventListener('click', (event) => {
    // Check if the button or its child image was clicked
    const target = event.target.closest('button, img');
    if (target && (target.id === 'openReactApp' || target.tagName === 'IMG')) {
        const buttonDetails = {
            buttonText: target.innerText || 'Image',
            buttonId: target.id || target.closest('button').id,  // Handle img inside button
        };
        chrome.runtime.sendMessage({ type: 'BUTTON_CLICKED', details: buttonDetails });
    }
});
