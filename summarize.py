# summarize.py
import sys
import json
import torch
from transformers import pipeline,AutoTokenizer, AutoModelForSeq2SeqLM

# model = AutoModelForSeq2SeqLM.from_pretrained("facebook/bart-large-cnn", cache_dir = "./model")
# tokenizer = AutoTokenizer.from_pretrained("facebook/bart-large-cnn", cache_dir = "./model")
# model.save_pretrained("./model")
# tokenizer.save_pretrained("./model")import torch
device = 0 if torch.cuda.is_available() else -1
summarizer = pipeline("summarization", model="./model", tokenizer="./model", device=device)


def summarize(text):
    result = summarizer(text, max_length=1000, min_length=0, do_sample=False)
    return result[0]['summary_text']

if __name__ == "__main__":
    input_text = input()
    # data = json.loads(input_text)
    # text = data.get("text", "")
    # input_text
    summary = summarize(input_text)
    print(json.dumps({"summary": summary}))
