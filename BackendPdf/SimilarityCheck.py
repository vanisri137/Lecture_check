from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
import time

app = Flask(__name__)
CORS(app)

HF_TOKEN = os.environ.get("HF_TOKEN")
API_URL = "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2"
headers = {"Authorization": f"Bearer {HF_TOKEN}"}

MAX_RETRIES = 3
RETRY_DELAY = 10  # seconds


def query_huggingface(payload, retries=MAX_RETRIES):
    """Query HuggingFace API with retry logic for cold starts."""
    for attempt in range(retries):
        response = requests.post(API_URL, headers=headers, json=payload)
        result = response.json()

        # Handle model loading (cold start on free tier)
        if isinstance(result, dict) and "error" in result:
            if "loading" in result["error"].lower() and attempt < retries - 1:
                estimated_time = result.get("estimated_time", RETRY_DELAY)
                print(f"Model loading, retrying in {estimated_time}s (attempt {attempt + 1}/{retries})")
                time.sleep(min(estimated_time, 30))  # Cap wait at 30s
                continue
            else:
                return None, result.get("error", "Unknown HuggingFace API error")

        # Validate response is a list of floats
        if isinstance(result, list) and len(result) > 0:
            score = float(result[0])
            # Cosine similarity ranges from -1 to 1; clamp to 0-1
            score = max(0.0, min(1.0, score))
            return score, None

        return None, f"Unexpected response format: {result}"

    return None, "Max retries exceeded — model did not load"


@app.route('/api/similarity', methods=['POST'])
def calculate_similarity():
    try:
        data = request.json
        transcription_texts = data.get('transcription_texts')
        pdf_texts = data.get('pdf_texts')

        if not transcription_texts or not pdf_texts:
            return jsonify({"error": "Both transcription_texts and pdf_texts are required"}), 400

        # Truncate to ~500 words to stay within model token limits
        max_words = 500
        transcription_texts = ' '.join(transcription_texts.split()[:max_words])
        pdf_texts = ' '.join(pdf_texts.split()[:max_words])

        payload = {
            "inputs": {
                "source_sentence": transcription_texts,
                "sentences": [pdf_texts]
            }
        }

        score, error = query_huggingface(payload)

        if error:
            return jsonify({"error": error, "similarity_score": None}), 502

        return jsonify({"similarity_score": score})  # Always 0.0 to 1.0

    except Exception as e:
        return jsonify({"error": str(e), "similarity_score": None}), 500


@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port)
