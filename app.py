from flask import Flask, render_template, request, jsonify
import openai
import requests
import os
from io import BytesIO
import base64

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

Zredaguj po polsku i upewnij się, że ostateczna historia zawiera więcej niż 7777 znaków (wliczając spacje), aby spełniała wytyczne dotyczące tworzenia treści.

Rezultatem powinna być jedynie niesamowita opowieść. Bez tytułu, bez dodatkowych komentarzy, bez liczenia znaków, itp.

Używaj tylko słownych zapisów dla wszystkich liczb, liczebników oraz wszelkich wartości liczbowych.

Sprawdź poprawność językową, odmianę i inne aspekty języka polskiego.

Jeśli którakolwiek z odpowiedzi użytkownika zawiera treści nieodpowiednie (np. obraźliwe, seksualne, wulgarne, przemocowe lub niewłaściwe dla dzieci), nie generuj historii.  
Zamiast tego odpowiedz grzecznie:  
"Przykro mi, nie pomogę Ci w stworzeniu tej bajki. Zmień swój pomysł i spróbuj ponownie!"
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.8
    )

    story = response.choices[0].message.content

    print("Story (początek):", story[:300])
    print("Długość bajki:", len(story))

    url = "https://api.elevenlabs.io/v1/text-to-speech/PGHueutSNSctZ8jQHpoH/stream"
    headers = {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json"
    }
    payload = {
        "model_id": "eleven_multilingual_v2",
        "text": story,
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.75,
            "style": 0.0,
            "use_speaker_boost": True
        }
    }

    tts_response = requests.post(url, json=payload, headers=headers)

    audio_base64 = base64.b64encode(tts_response.content).decode("utf-8")

    print("Długość audio:", len(audio_base64))

    return jsonify({"audio_base64": audio_base64})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000, debug=True)
