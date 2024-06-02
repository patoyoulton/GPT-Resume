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
  