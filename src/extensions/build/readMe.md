# React Chrome Extension

This project is a Chrome extension that injects a button into web pages and displays a React application as a popup. It supports Chrome, Firefox, and Safari browsers.

## Table of Contents

- [Installation](#installation)
- [Manifest Configuration](#manifest-configuration)
- [Building the Extension](#building-the-extension)
- [Testing the Extension](#testing-the-extension)
- [Browser Compatibility](#browser-compatibility)
- [Additional Information](#additional-information)

## Installation

## Manifest for chrome

{
  "manifest_version": 3,
  "name": "React Chrome Extension",
  "version": "1.0",
  "description": "A Chrome extension that injects a button and shows a React popup.",
  "permissions": ["activeTab", "scripting"],
  "background": {
    "service_worker": "background.js"
  },
  "action": {
    "default_popup": "popup.html",
    "default_icon": "logo512.png"
  },
  "web_accessible_resources": [
    {
      "resources": ["static/js/*", "static/css/*", "/media/*"],
      "matches": ["<all_urls>"]
    }
  ],
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["contentScript.js"],
      "run_at": "document_end"
    }
  ]
}


## Change the background service_worker in manifest to background script for loading the extension for firefox

{
  "background": {
    "scripts": ["background.js"],
    "persistent": false
  }
}
