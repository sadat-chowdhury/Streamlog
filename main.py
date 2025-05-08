import functions_framework
import os
import re
from openai import OpenAI
import time
import json
from flask import jsonify, request
from collections import defaultdict

# Initialize OpenAI client
try:
    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
except Exception as e:
    print("Failed to initialize OpenAI client:", str(e))
    client = None  # fallback to avoid crash

# Simple in-memory IP tracking
request_timestamps = defaultdict(list)
RATE_LIMIT = 5  # max 5 requests
WINDOW_SECONDS = 60  # per 60 seconds

# rate limiting logic
def is_rate_limited(ip: str) -> bool:
    now = time.time()
    timestamps = request_timestamps[ip]
    #keep only recent timestamps within the window
    timestamps = [t for t in timestamps if now - t < WINDOW_SECONDS]
    request_timestamps[ip] = timestamps

    if len(timestamps) >= RATE_LIMIT:
        return True

    request_timestamps[ip].append(now)
    return False

# input validation: 1-100 char, only numbers,spaces, common punctuation, no emojis codes or symbols
def is_valid_title(title: str) -> bool:
    if not title or not isinstance(title, str):
        return False
    title = title.strip()
    return bool(re.fullmatch(r"[a-zA-Z0-9\s.,!?'\-:()]{1,100}", title))

def parse_movie_recommendations(output_text):
    pattern = re.compile(r"\*(.*?)\*")
    return pattern.findall(output_text)

# 👇 THIS is the Cloud Function entry point
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

    request_title = request.get_json(silent=True)
    ip = request.remote_addr or "unknown"
    title = request_title.get("title", "") if request_title else ""

     # 🔍 Log the IP and title early
    print(f"📥 User IP: {ip}, Title: {title}")

    # 1. Input validation
    if not is_valid_title(title):
        return jsonify({"error": "Invalid movie title."}), 400, headers

    # 2. Rate limiting
    if is_rate_limited(ip):
        return jsonify({"error": "Too many requests from this IP. Please wait."}), 429, headers

    try:
        # 3. Call OpenAI for recommendations
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "user",
                    "content": f"""
                    Give me 4 movie recommendations similar to: {title}.
                    Rules:
                    - Must be available on Hulu
                    - Only 4 movies
                    - Each title on its own line
                    - Format like *Title*
                    - No extra text or descriptions
                    """
                }
            ]
        )

        output_text = response.choices[0].message.content.strip()
        # 🔍 Log the raw OpenAI output
        print(f"🎬 OpenAI raw response: {output_text}")

        recommendations_formatted = parse_movie_recommendations(output_text)

        # Ensure it's a list of strings
        if not isinstance(recommendations_formatted, list):
            return jsonify({"error": "Invalid recommendations format."}), 500, headers

        return jsonify({"recommendations": recommendations_formatted}), 200, headers

    except Exception as e:
        print("Function error:", str(e))
        return jsonify({"error": "An error occurred while generating recommendations."}), 500, headers