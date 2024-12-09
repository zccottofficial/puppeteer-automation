# Puppeteer Browser Extension Automation

This project uses Puppeteer to automate testing for a browser extension.

## Prerequisites
- **Node.js**: Ensure Node.js (v14 or higher) is installed.
- **npm**: Comes with Node.js for package management.

## Clone the Repository
```bash
git clone <repository-url>
cd my-extension-testing-project
npm install
```

## Create a New Project
```bash
mkdir my-extension-testing-project
cd my-extension-testing-project
npm init -y
npm install puppeteer
```

### Update `package.json`
Add the following script to your `package.json` file:
```json
"scripts": {
  "test": "node src/tests/extension-test.js"
}
```
To run your tests, use:
```bash
npm test
```

## Recommended Folder Structure
```
my-extension-testing-project/
│
├── src/
│   ├── tests/
│   │   └── extension-test.js   # Your test scripts go here
│   ├── extensions/             # Folder for your extension build files
│   │   └── your-extension/     # Place your extension build files here
│   └── utils/                  # Utility functions (if needed)
│
├── package.json                # Project metadata and dependencies
├── package-lock.json           # Auto-generated file for dependency versions
└── README.md                   # Documentation for your project
```

## Demo Video
Click the thumbnail below to watch the demo video:

<iframe width="560" height="315" src="https://www.youtube.com/embed/n4buHnfDWEA?autoplay=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>




