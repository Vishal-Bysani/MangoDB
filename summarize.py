# summarize.py
import sys
import json
from transformers import pipeline

summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

def summarize(text):
    result = summarizer(text, max_length=1000, min_length=0, do_sample=False)
    return result[0]['summary_text']

if __name__ == "__main__":
    input_text = sys.stdin.read()
    data = json.loads(input_text)
    text = data.get("text", "")
    summary = summarize(text)
    print(json.dumps({"summary": summary}))
