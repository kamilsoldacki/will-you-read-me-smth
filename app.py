from flask import Flask, render_template, request, jsonify
import openai
import requests
import os

app = Flask(__name__)

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
ELEVENLABS_API_KEY = os.environ.get("ELEVENLABS_API_KEY")

client = openai.OpenAI(api_key=OPENAI_API_KEY)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/generate", methods=["POST"])
def generate():
    data = request.json

    prompt = f"""
Wygeneruj historię, która zawiera więcej niż 7777 znaków (wliczając spacje) na podstawie opisu użytkownika.

1. Gdzie rozgrywa się akcja historii? {data['q1']}
2. Jak nazywają się główni bohaterowie? {data['q2']}
3. Jaki jest motyw przewodni historii? {data['q3']}
4. Czy bohaterowie mają jakieś supermoce? {data['q4']}
5. Co bohaterowie robią w tej historii? {data['q5']}

Zredaguj po polsku i upewnij się, że ostateczna historia zawiera więcej niż 7777 znaków (wliczając spacje).
Rezultatem powinna być jedynie niesamowita opowieść. Bez tytułu, bez komentarzy, bez liczenia znaków.
Używaj tylko słownych zapisów dla wszystkich liczb. Sprawdź poprawność językową.
"""

    chat_response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
    )
    story = chat_response.choices[0].message.content.strip()

    voice_id = "PGHueutSNSctZ8jQHpoH"
    model_id = "eleven_multilingual_v2"
    headers = {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json"
    }
    json_data = {
        "text": story,
        "model_id": model_id,
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.75
        }
    }
    tts_response = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}/stream",
        headers=headers,
        json=json_data
    )

    audio_path = "static/story.mp3"
    with open(audio_path, "wb") as f:
        f.write(tts_response.content)

    return jsonify({"audio_url": "/static/story.mp3"})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
