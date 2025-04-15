import functions_framework
import os
import re
import openai
from flask import jsonify

# Get your OpenAI key from the environment variable
openai.api_key = os.environ.get("OPENAI_API_KEY")

def parse_movie_recommendations(output_text):
    pattern = re.compile(r"\*(.*?\(\d{4}\))\*")
    return pattern.findall(output_text)

# 👇 THIS is the Cloud Function entry point
@functions_framework.http
def get_recommendations(request):
    try:
        data = request.get_json(silent=True)
        title = data.get("title") if data else None

        if not title:
            return jsonify({"error": "Missing 'title' in request body"}), 400

        response = openai.ChatCompletion.create(

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

        return jsonify({"recommendations": recommendations})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
