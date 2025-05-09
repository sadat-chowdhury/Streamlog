import functions_framework
import os
import re
from flask import jsonify, request
from openai import OpenAI

# Initialize OpenAI client
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

def parse_movie_recommendations(output_text):
    pattern = re.compile(r"\*(.*?\(\d{4}\))\*")
    return pattern.findall(output_text)

@functions_framework.http
def get_recommendations(request):
    # Set CORS headers for preflight (OPTIONS)
    if request.method == 'OPTIONS':
        return ('', 204, {
            'Access-Control-Allow-Origin': 'https://streamlog-cee43.web.app',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        })

    headers = {
        'Access-Control-Allow-Origin': 'https://streamlog-cee43.web.app'
    }

    try:
        data = request.get_json(silent=True)
        title = data.get("title") if data else None

        if not title:
            return (jsonify({"error": "Missing 'title' in request body"}), 400, headers)

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "user",
                    "content": f"""
                    Give me 2 movies and 2 TV series recommendations similar to: {title}.
                    Rules:
                    - Must be available on Hulu
                    - First 2 = movies, last 2 = TV shows
                    - Each title on its own line
                    - Format like *Title (Year)*
                    - No extra text or descriptions
                    """
                }
            ]
        )

        output_text = response.choices[0].message.content
        recommendations = parse_movie_recommendations(output_text)

        return (jsonify({"recommendations": recommendations}), 200, headers)

    except Exception as e:
        return (jsonify({"error": str(e)}), 500, headers)
