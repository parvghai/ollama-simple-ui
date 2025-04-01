// Wait for the DOM to fully load before executing event listeners
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("send-btn").addEventListener("click", sendMessage);
    document.getElementById("export-btn").addEventListener("click", exportChat);
    document.getElementById("model-select").addEventListener("change", updateModel);

    document.getElementById("userInput").addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage();
        }
    });
});

let currentModel = "llama3"; // Default model

function updateModel() {
    let selectedModel = document.getElementById("model-select").value;
    showLoading("Switching model...");

    fetch("/set_model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: selectedModel })
    })
    .then(response => response.json())
    .then(data => {
        currentModel = selectedModel;
        hideLoading();
    })
    .catch(error => {
        console.error("Error:", error);
        hideLoading();
    });
}

function sendMessage() {
    let inputBox = document.getElementById("userInput");
    let chatBox = document.getElementById("chatBox");
    let message = inputBox.value.trim();

    if (message === "") return;

    chatBox.innerHTML += `<div class='chat-bubble user-bubble'>${message}</div>`;
    chatBox.innerHTML += `<div class='chat-bubble bot-bubble' id="loading">Typing... 0%</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
    inputBox.value = "";

    let progress = 0;
    let interval = setInterval(() => {
        progress += 10;
        if (progress >= 100) {
            clearInterval(interval);
        } else {
            document.getElementById("loading").innerText = `Typing... ${progress}%`;
        }
    }, 300);

    fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: message, model: currentModel })
    })
    .then(response => response.json())
    .then(data => {
        clearInterval(interval);
        document.getElementById("loading").remove();

        let botResponse = formatResponse(data.response);
        chatBox.innerHTML += `<div class='chat-bubble bot-bubble'>${botResponse}</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    })
    .catch(error => {
        clearInterval(interval);
        document.getElementById("loading").remove();
        chatBox.innerHTML += `<div class='chat-bubble bot-bubble'>Error: Failed to get a response</div>`;
        console.error("Error:", error);
    });
}

// Format response to maintain paragraphs and steps
function formatResponse(response) {
    response = response.replace(/\n/g, "<br>"); // Preserve newlines in paragraphs

    // Detect numbered steps and format them as a list
    if (/^\d+\./m.test(response)) {
        let steps = response.split("\n").map(line => {
            return line.match(/^\d+\./) ? `<li>${line}</li>` : line;
        }).join("");
        return `<ul>${steps}</ul>`;
    }

    return response;
}

function exportChat() {
    fetch("/export")
    .then(response => response.blob())
    .then(blob => {
        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "chat.txt";
        link.click();
    })
    .catch(error => console.error("Export failed:", error));
}

function showLoading(text) {
    document.getElementById("loading-text").innerText = text;
    document.getElementById("loading-container").style.display = "block";
}

function hideLoading() {
    document.getElementById("loading-container").style.display = "none";
}
