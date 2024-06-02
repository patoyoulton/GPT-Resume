
# GPT Resume for Chrome

![Icono](./cover.jpg)

GPT Resume for Chrome es una extensión de Chrome que permite reanudar automáticamente la generación de texto en GPT-4, haciendo clic automáticamente en el botón de reanudar.

## Características

- Detecta y hace clic automáticamente en el botón de reanudar de GPT-4.
- Permite activar y desactivar el autoclick a través de un botón en el popup.
- Funciona en segundo plano, incluso cuando el popup no está abierto.

## Instalación

1. Clona este repositorio o descarga el código fuente.
   ```sh
   git clone https://github.com/tu-usuario/gpt-resume-for-chrome.git
   ```
   O descarga el archivo `.zip` de la extensión desde [este enlace](./GPT%20-%20Resume%20for%20Chrome.zip).
   
2. Abre Chrome y navega a `chrome://extensions/`.

3. Activa el "Modo de desarrollador" en la esquina superior derecha.

4. Haz clic en "Cargar descomprimida" y selecciona la carpeta donde descargaste el repositorio.

## Uso

1. Haz clic en el ícono de la extensión en la barra de herramientas de Chrome.
2. Haz clic en el botón "Toggle Auto Click" para activar o desactivar el autoclick.
3. La extensión comenzará a hacer clic automáticamente en el botón de reanudar de GPT-4 si está presente.

## Archivos Principales

### `manifest.json`

```json
{
  "manifest_version": 3,
  "name": "GPT Resume for Chrome",
  "version": "1.1",
  "description": "Automatically clicks the resume button for GPT-4.",
  "permissions": ["activeTab", "scripting", "tabs"],
  "background": {
    "service_worker": "background.js"
  },
  "action": {
    "default_popup": "popup.html",
    "default_icon": "icon.png"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"]
    }
  ],
  "icons": {
    "48": "icon.png",
    "128": "icon.png"
  }
}
```

### `background.js`

```javascript
let isActive = false;
let currentTabId = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleAutoClick") {
    isActive = !isActive;
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      currentTabId = tabs[0].id;
      chrome.scripting.executeScript({
        target: {tabId: currentTabId},
        files: ['content.js']
      }, () => {
        chrome.tabs.sendMessage(currentTabId, {action: "setAutoClick", isActive: isActive});
      });
    });
    sendResponse({status: isActive ? "activated" : "deactivated"});
  } else if (request.action === "checkStatus") {
    sendResponse({status: isActive ? "activated" : "deactivated"});
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (isActive && tabId === currentTabId && changeInfo.status === 'complete') {
    chrome.scripting.executeScript({
      target: {tabId: currentTabId},
      files: ['content.js']
    }, () => {
      chrome.tabs.sendMessage(currentTabId, {action: "setAutoClick", isActive: isActive});
    });
  }
});
```

### `content.js`

```javascript
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
```

### `popup.js`

```javascript
document.addEventListener('DOMContentLoaded', () => {
  chrome.runtime.sendMessage({action: "checkStatus"}, (response) => {
    if (response.status === "activated") {
      document.getElementById('status').innerText = "Auto Clicker is ON";
    } else {
      document.getElementById('status').innerText = "Auto Clicker is OFF";
    }
  });

  document.getElementById('toggleAutoClick').addEventListener('click', () => {
    chrome.runtime.sendMessage({action: "toggleAutoClick"}, (response) => {
      if (response.status === "activated") {
        document.getElementById('status').innerText = "Auto Clicker is ON";
      } else {
        document.getElementById('status').innerText = "Auto Clicker is OFF";
      }
    });
  });
});
```

### `popup.html`

```html
<!DOCTYPE html>
<html>
<head>
  <title>GPT Resume for Chrome</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <h1>GPT Resume for Chrome</h1>
    <button id="toggleAutoClick">Toggle Auto Click</button>
    <p id="status">Auto Clicker is OFF</p>
  </div>
  <script src="popup.js"></script>
</body>
</html>
```

### `styles.css`

```css
body {
  font-family: Arial, sans-serif;
  padding: 20px;
  width: 300px;
}

.container {
  text-align: center;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
```

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o envía un pull request para cualquier mejora o corrección.

## Créditos

Este proyecto fue desarrollado con la ayuda de ChatGPT, un modelo de lenguaje de OpenAI.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Para más detalles, consulta el archivo [LICENSE](./LICENSE).
