# summarize.py
import torch
from transformers import pipeline,AutoTokenizer, AutoModelForSeq2SeqLM

# model = AutoModelForSeq2SeqLM.from_pretrained("facebook/bart-large-cnn", cache_dir = "./models/fbcnn")
# tokenizer = AutoTokenizer.from_pretrained("facebook/bart-large-cnn", cache_dir = "./models/fbcnn")
# model.save_pretrained("./models/fbcnn")
# tokenizer.save_pretrained("./models/fbcnn")
device = 0 if torch.cuda.is_available() else -1
summarizer = pipeline("summarization", model="./models/fbcnn", tokenizer="./models/fbcnn", device=device)


def summarize(text):
    result = summarizer(text, max_length=1000, min_length=0, do_sample=False)
    return result[0]['summary_text']

if __name__ == "__main__":
    input_text = input()
    summary = summarize(input_text)
    print(summary)
