from flask import Flask, request, jsonify
import requests
import os

app = Flask(__name__)

HF_TOKEN = os.environ.get("HF_TOKEN")

API_URL = "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2"

headers = {
    "Authorization": f"Bearer {HF_TOKEN}"
}

@app.route('/api/similarity', methods=['POST'])
def calculate_similarity():
    try:
        data = request.json

        transcription_texts = data.get('transcription_texts')
        pdf_texts = data.get('pdf_texts')

        if not transcription_texts or not pdf_texts:
            return jsonify({
                "error": "Both transcription_texts and pdf_texts are required"
            }), 400

        payload = {
            "inputs": {
                "source_sentence": transcription_texts,
                "sentences": [pdf_texts]
            }
        }

        response = requests.post(
            API_URL,
            headers=headers,
            json=payload
        )

        result = response.json()

        return jsonify({
            "similarity_score": result[0]
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port)
