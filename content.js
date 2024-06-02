let autoClickInterval;
let isActive = false;

console.log("Content script loaded");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "setAutoClick") {
    isActive = request.isActive;
    if (isActive) {
      startAutoClick();
    } else {
      stopAutoClick();
    }
  }
});

function startAutoClick() {
  autoClickInterval = setInterval(() => {
    clickButtonWithSvg();
  }, 1000); // Intervalo de 1 segundo
}

function stopAutoClick() {
  clearInterval(autoClickInterval);
}

function clickButtonWithSvg() {
  const svgElement = document.querySelector('svg.-rotate-180');
  if (svgElement) {
    const buttonElement = svgElement.closest('button');
    if (buttonElement) {
      buttonElement.click();
      console.log('Clicked on button containing SVG with class -rotate-180');
    } else {
      console.log('Button containing SVG with class -rotate-180 not found');
    }
  } else {
    console.log('SVG with class -rotate-180 not found');
  }
}
