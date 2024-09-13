from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup
import re
from googletrans import Translator
import json
from gtts import gTTS
from io import BytesIO
import pygame
import time
from flask_cors import CORS
from youtube_transcript_api import YouTubeTranscriptApi

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

def speak(text, lang):
    tts = gTTS(text=text, lang=lang)
    audio_stream = BytesIO()
    tts.write_to_fp(audio_stream)
    audio_stream.seek(0)
    pygame.mixer.init()
    pygame.mixer.music.load(audio_stream)
    pygame.mixer.music.play()
    while pygame.mixer.music.get_busy():
        time.sleep(0.1)

def generate_content(prompt):
    """
    Generate content based on the provided prompt using the API.

    :param prompt: The text prompt to generate content for.
    :return: The generated text or an error message if the request fails.
    """
    url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyCfxbTipwSDhpPJyLMyE7zAZ5FajzFoRf8'
    headers = {'Content-Type': 'application/json'}
    data = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ]
    }
    print(prompt)
    try:
        response = requests.post(url, headers=headers, data=json.dumps(data))
        if response.status_code == 200:
            response_json = response.json()
            candidates = response_json.get('candidates', [])
            result = []
            for candidate in candidates:
                content = candidate.get('content', {})
                parts = content.get('parts', [])
                for part in parts:
                    text = part.get('text', '')
                    text = text.replace("**", "")  # Remove bold formatting
                    text = text.replace("*", "")   # Remove italic/bullet point formatting
                    text = text.replace("##", "")  # Remove header formatting
                    result.append(text)
            return "\n".join(result)
        else:
            print(f"Error: Status code: {response.status_code}, Response: {response.text}")
            return f"Failed to get a response. Status code: {response.status_code}\nResponse: {response.text}"
    except Exception as e:
        print(f"Exception occurred: {str(e)}")
        return f"Error during API call: {str(e)}"

def fetch_webpage(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    paragraphs = soup.find_all('p')
    text = ' '.join([para.get_text() for para in paragraphs])
    return text

def clean_text(text):
    # Removing timestamps, excessive whitespace, and any special characters
    cleaned_text = re.sub(r'\[\d{1,2}:\d{2}\]', '', text)  # Remove timestamps like [00:10]
    cleaned_text = re.sub(r'\s+', ' ', cleaned_text).strip()  # Replace multiple spaces/newlines
    return cleaned_text

def y_trans(video_id):
    transcript = YouTubeTranscriptApi.get_transcript(video_id)
    trans =''
    for line in transcript:
        trans += f"{line['text']}"
    return trans

def split_text_into_blocks(text, max_words=1000):
    sentences = re.split(r'(?<=[.!?])\s+', text)
    blocks = []
    current_block = []
    current_word_count = 0
    for sentence in sentences:
        words = sentence.split()
        if current_word_count + len(words) > max_words:
            if current_block:
                blocks.append(' '.join(current_block))
            current_block = []
            current_word_count = 0
        current_block.extend(words)
        current_word_count += len(words)
    if current_block:
        blocks.append(' '.join(current_block))
    return blocks

@app.route('/process_url', methods=['POST'])
def process_url():
    data = request.json
    url = data.get('url')
    url_sub = url[0:32]
    dest_language = data.get('dest_language', 'en')
    summary = ""
    if(url_sub == 'https://www.youtube.com/watch?v='):
        summary = clean_text(y_trans(url[32:]))
    else:
        text = fetch_webpage(url)
        print(type(text))
        blocks = split_text_into_blocks(text, max_words=1000)
        for block in blocks:
            summary += generate_content(f"Summarize this content : {block}")
    translator = Translator()
    translated = translator.translate(summary, src='en', dest=dest_language).text
    print(translated)
    speak(translated, dest_language)
    return jsonify({"english_summary": summary, "translated_summary": translated})

if __name__ == '__main__':
    app.run(debug=True)