from flask import Flask, request, render_template, jsonify, send_file
import requests
import json
import os

app = Flask(__name__)

OLLAMA_URL = "http://127.0.0.1:11434/api/generate"
conversation_history = []
current_model = "llama3"  # Default model

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/chat')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    prompt = data.get("prompt", "")
    model = data.get("model", current_model)
    response_text = ""

    if prompt:
        try:
            request_data = {"model": model, "prompt": prompt}
            result = requests.post(OLLAMA_URL, json=request_data, stream=True)

            for line in result.iter_lines():
                if line:
                    try:
                        json_data = json.loads(line.decode("utf-8"))
                        response_text += json_data.get("response", "")
                    except json.JSONDecodeError:
                        print("Error decoding JSON:", line)
        except Exception as e:
            response_text = f"Error: {str(e)}"

    conversation_history.append({"user": prompt, "bot": response_text})
    return jsonify({"response": response_text})

@app.route('/export', methods=['GET'])
def export_chat():
    try:
        filename = "chat.txt"
        with open(filename, "w", encoding="utf-8") as file:
            for entry in conversation_history:
                file.write(f"User: {entry['user']}\nBot: {entry['bot']}\n\n")
        return send_file(filename, as_attachment=True)
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route("/set_model", methods=["POST"])
def set_model():
    global current_model
    data = request.json
    model = data.get("model")

    if model:
        current_model = model
        return jsonify({"message": f"Model switched to {model}"}), 200
    else:
        return jsonify({"error": "No model specified"}), 400
if __name__ == '__main__':
    app.run(debug=True)
