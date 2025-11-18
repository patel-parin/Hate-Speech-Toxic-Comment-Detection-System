# import os
# import sys
# import json
# import joblib
# import numpy as np
# from preprocess import clean_text

# # --- Fix: Build paths relative to this file ---
# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")
# VECTORIZER_PATH = os.path.join(BASE_DIR, "vectorizer.pkl")

# # Load model & vectorizer
# model = joblib.load(MODEL_PATH)
# vectorizer = joblib.load(VECTORIZER_PATH)

# labels = ["toxic", "severe_toxic", "obscene", "threat", "insult", "identity_hate"]

# def predict_scores(text):
#     cleaned_text = clean_text(text)
#     vectorized_text = vectorizer.transform([cleaned_text])
#     probabilities = model.predict_proba(vectorized_text)

#     scores = {}
#     for i, label in enumerate(labels):
#         prob_array = probabilities[i] if isinstance(probabilities, list) else probabilities[:, i]
#         if isinstance(prob_array, np.ndarray) and prob_array.ndim > 1:
#             scores[label] = prob_array[0, 1]  # positive class
#         else:
#             scores[label] = float(prob_array[0]) if len(prob_array) > 0 else 0.0

#     overall_score = int(np.max(list(scores.values())) * 100)
#     classification = "✅ NON-TOXIC"
#     if overall_score > 75:
#         classification = "❌ TOXIC"
#     elif overall_score > 40:
#         classification = "⚠️ POTENTIALLY TOXIC"

#     return {
#         "overallScore": overall_score,
#         "classification": classification,
#         "categories": {label: round(score * 100) for label, score in scores.items()}
#     }

# if __name__ == "__main__":
#     if len(sys.argv) > 1:
#         input_text = sys.argv[1]
#         output = predict_scores(input_text)
#         print(json.dumps(output))
#     else:
#         print(json.dumps({"error": "No input text provided"}))


# import os
# # CHANGE 1: This line is new. It silences TensorFlow warnings.
# os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3' 
# import sys
# import json
# import numpy as np
# import torch
# from transformers import AutoTokenizer, AutoModelForSequenceClassification
# from preprocess import clean_text

# # --- Base directory (you can move model folder later if needed) ---
# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# MODEL_DIR = os.path.join(BASE_DIR, "..", "model", "model_xlmr", "checkpoint-28977")

# # --- Load model & tokenizer ---
# tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
# model = AutoModelForSequenceClassification.from_pretrained(MODEL_DIR)
# model.eval()  # set to evaluation mode

# # --- Labels (same order as during training) ---
# labels = ["toxic", "severe_toxic", "obscene", "threat", "insult", "identity_hate"]

# def predict_scores(text: str):
#     """Predict toxicity scores using fine-tuned XLM-R model."""
#     # Clean input text
#     cleaned_text = clean_text(text)

#     # Tokenize and move to model device
#     inputs = tokenizer(cleaned_text, return_tensors="pt", truncation=True, padding=True, max_length=64).to(model.device)

#     with torch.no_grad():
#         outputs = model(**inputs)
#         probs = torch.sigmoid(outputs.logits).cpu().numpy()[0]  # multi-label sigmoid activation

#     # Map probabilities to labels
#     scores = {label: float(p) for label, p in zip(labels, probs)}

#     # Overall classification logic
#     overall_score = int(max(scores.values()) * 100)
#     if overall_score > 75:
#         classification = "❌ TOXIC"
#     elif overall_score > 40:
#         classification = "⚠️ POTENTIALLY TOXIC"
#     else:
#         classification = "✅ NON-TOXIC"

#     return {
#         "overallScore": overall_score,
#         "classification": classification,
#         "categories": {label: round(score * 100) for label, score in scores.items()}
#     }

# if __name__ == "__main__":
#     if len(sys.argv) > 1:
#         input_text = sys.argv[1]
#         output = predict_scores(input_text)
#         # CHANGE 2: I removed 'ensure_ascii=False' to fix the emoji error.
#         print(json.dumps(output)) 
#     else:
#         print(json.dumps({"error": "No input text provided"}))



import os
import sys
import json
import numpy as np
from pathlib import Path
from preprocess import clean_text
from transformers import AutoTokenizer
import time

# ONNX Runtime
import onnxruntime as ort

# -------------------------------------------
# PATH SETUP
# -------------------------------------------
BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = (BASE_DIR.parent / "model" / "onnx_model").resolve()

MODEL_PATH = (MODEL_DIR / "model.onnx").as_posix()
TOKENIZER_PATH = MODEL_DIR.as_posix()

# -------------------------------------------
# LOAD TOKENIZER
# -------------------------------------------
tokenizer = AutoTokenizer.from_pretrained(
    TOKENIZER_PATH,
    local_files_only=True
)

# -------------------------------------------
# OPTIMIZED ONNX SESSION
# -------------------------------------------
so = ort.SessionOptions()
so.intra_op_num_threads = 8
so.inter_op_num_threads = 2
so.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL

session = ort.InferenceSession(
    MODEL_PATH,
    so,
    providers=["CPUExecutionProvider"]
)

# -------------------------------------------
# LABELS
# -------------------------------------------
labels = ["toxic", "severe_toxic", "obscene",
          "threat", "insult", "identity_hate"]

# -------------------------------------------
# PREDICT
# -------------------------------------------
def predict_scores(text: str):
    start_time = time.time()
    cleaned = clean_text(text)

    inputs = tokenizer(
        cleaned,
        return_tensors="np",
        truncation=True,
        padding=True,
        max_length=64
    )

    start_time = time.perf_counter()

    outputs = session.run(None, dict(inputs))
    end_time = time.perf_counter()
    analysis_time_ms = (end_time - start_time) * 1000

    logits = outputs[0][0]
    probs = 1 / (1 + np.exp(-logits))

    scores = {label: float(p) for label, p in zip(labels, probs)}
    overall = int(max(scores.values()) * 100)

    if overall > 75:
        classif = "❌ TOXIC"
    elif overall > 40:
        classif = "⚠️ POTENTIALLY TOXIC"
    else:
        classif = "✅ NON-TOXIC"

    # analysis_time_ms = round((time.time() - start_time) * 1000, 2)

    return {
        "overallScore": overall,
        "classification": classif,
        "categories": {k: round(v * 100) for k, v in scores.items()},
        "analysisTime": analysis_time_ms
    }


# CLI
if __name__ == "__main__":
    if len(sys.argv) > 1:
        text = sys.argv[1]
        print(json.dumps(predict_scores(text)))
    else:
        print(json.dumps({"error": "No input text provided"}))
