
# Ollama & Flask Chat Application Setup Guide

This guide walks you through installing Ollama on Windows, Linux, or macOS, pulling specific large language models (LLMs), running the Ollama server, and launching a Python Flask chat application.

## Prerequisites
- A computer running Windows, Linux, or macOS.
- Python 3.6+ installed (for the Flask application).
- Basic familiarity with terminal/command line usage.
- Internet connection for downloading Ollama and models.

---

## Step 1: Install Ollama

### Windows
1. **Download Ollama**:
   - Visit [ollama.com/download](https://ollama.com/download).
   - Download the Windows executable (`ollama-windows.exe`).
2. **Install**:
   - Double-click the downloaded `.exe` file.
   - Follow the on-screen prompts to install Ollama.
3. **Verify Installation**:
   - Open Command Prompt or PowerShell.
   - Run `ollama --version` to check if it’s installed correctly.

### Linux
1. **Install via Terminal**:
   - Open a terminal.
   - Run the following command:
     
     curl -fsSL https://ollama.com/install.sh | sh

   - This script downloads and installs Ollama automatically.
2. **Verify Installation**:
   - Run `ollama --version` to confirm it’s installed.

### macOS
1. **Download Ollama**:
   - Visit [ollama.com/download](https://ollama.com/download).
   - Download the macOS application (`.dmg` file).
2. **Install**:
   - Open the `.dmg` file.
   - Drag the `Ollama.app` to your `Applications` folder.
3. **Verify Installation**:
   - Open Terminal.
   - Run `ollama --version` to check the installation.

**Note**: Ensure Ollama is added to your system PATH (usually automatic on Windows/macOS; on Linux, you may need to restart your terminal).

---

## Step 2: Pull LLM Models

Ollama allows you to download models from its library. We’ll pull the following models:
- `huihui_ai/deepseek-r1-abliterated:latest`
- `llama3`
- `command-r7b:latest`

1. **Open Terminal/Command Prompt**:
   - Ensure Ollama is installed (from Step 1).
2. **Pull Models**:
   - Run these commands one by one:
     
     ollama pull huihui_ai/deepseek-r1-abliterated:latest
     ollama pull llama3
     ollama pull command-r7b:latest
     
   - Each command downloads the specified model. The first run may take time depending on your internet speed.
3. **Verify Models**:
   - List installed models with:
     
     ollama list
     
   - You should see `huihui_ai/deepseek-r1-abliterated:latest`, `llama3:latest`, and `command-r7b:latest` in the output.

**Note**: Model names are case-sensitive, and `:latest` is optional for `llama3` and `command-r7b` if you want the latest version (assumed here).

---

## Step 3: Run Ollama Server

Ollama must be running as a server to serve the Flask application’s API requests.

1. **Start the Ollama Server**:
   - In a terminal or Command Prompt, run:
     
     ollama serve
     
   - This starts the Ollama server at `http://127.0.0.1:11434` (default).
   - Keep this terminal window open while using the Flask app.
2. **Test the Server** (Optional):
   - In a new terminal, run:
     
     ollama run llama3 "Hello, world!"
     
   - If it responds, the server is working.

**Note**: On Windows, if `ollama serve` doesn’t work directly, ensure the Ollama service is running (check the system tray or Task Manager).

---

## Step 4: Run the Python Flask Application

Assuming you have the Flask application code saved as `app.py` (from your provided code), follow these steps:

1. **Set Up Python Environment**:
   - Ensure Python is installed (`python --version` or `python3 --version`).
   - Install required Python packages:
     
     pip install flask requests
     
   - If using a virtual environment (recommended):
     
     python -m venv venv
     source venv/bin/activate  # Linux/macOS
     venv\Scripts\activate     # Windows
     pip install flask requests
     

2. **Save the Flask Code**:
   - Copy your Flask code into a file named `app.py` in your working directory.
   - Ensure it includes the routes for `/chat`, `/set_model`, and `/export`.

3. **Run the Flask App**:
   - In a new terminal (with the virtual environment activated, if used), run:
     
     python app.py
     
   - The app starts in debug mode on `http://127.0.0.1:5000` by default.
   - You’ll see output like:
     
     * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
     

4. **Access the Chat Interface**:
   - Open a web browser and go to `http://127.0.0.1:5000/chat`.
   - Use the interface to send messages, switch models (via the dropdown), and export chat history.

**Note**: Ensure `home.html` and `index.html` templates are in a `templates` folder in the same directory as `app.py`.

---

## Troubleshooting
- **Ollama Not Found**: Verify it’s installed and in your PATH (`echo $PATH` on Linux/macOS; `PATH` in Windows Command Prompt).
- **Model Pull Fails**: Check your internet connection and Ollama server status (`ollama serve` running).
- **Flask Errors**: Ensure all dependencies are installed and `app.py` matches the provided code.
- **Port Conflicts**: If `11434` or `5000` are in use, stop conflicting processes or modify the Flask app’s port (e.g., `app.run(debug=True, port=5001)`).

---

## Additional Notes
- **Changing Models**: The Flask app uses `llama3` by default. Switch models via the `/set_model` endpoint (handled by the frontend dropdown).
- **Hardware**: Larger models like `command-r7b` may require more RAM/GPU. Check [ollama.com/library](https://ollama.com/library) for requirements.
- **Stopping the Server**: Press `Ctrl+C` in the terminal to stop `ollama serve` or the Flask app.

Enjoy your local LLM-powered chat application!


---

### Explanation of the `README.md`:
1. **Structure**: Organized into clear steps for installation, model pulling, server setup, and Flask app execution.
2. **Platform-Specific Instructions**: Covers Windows, Linux, and macOS for Ollama installation.
3. **Model Pulling**: Specifies the exact commands for the requested models (`huihui_ai/deepseek-r1-abliterated:latest`, `llama3`, `command-r7b:latest`).
4. **Ollama Server**: Explains how to run `ollama serve` and keep it active.
5. **Flask Setup**: Guides through Python setup, dependency installation, and running your `app.py`, assuming it’s the code you provided.
6. **Troubleshooting**: Addresses common issues to ensure smooth setup.

This `README.md` should work seamlessly with your existing Flask code, JavaScript, and CSS, assuming the HTML templates (`home.html` and `index.html`) are correctly set up in a `templates` folder. Let me know if you need the HTML templates or further adjustments!
