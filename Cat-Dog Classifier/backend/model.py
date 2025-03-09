import os
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"  # ✅ Disable oneDNN logs before anything runs
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"   # ✅ Hide all TensorFlow warnings

import sys
import pickle
import numpy as np
import cv2  # OpenCV for image processing
import tensorflow as tf

# ✅ Force UTF-8 encoding for Windows (Fix Unicode errors)
sys.stdout.reconfigure(encoding="utf-8")

# ✅ Ensure correct model path
model_path = os.path.join(os.path.dirname(__file__), "model.pkl")
with open(model_path, "rb") as file:
    model = pickle.load(file)

# ✅ Check if an image file was provided
if len(sys.argv) < 2:
    print("Error: No image provided!")
    sys.exit(1)

img_path = sys.argv[1]

# ✅ Read & preprocess the image using OpenCV
img = cv2.imread(img_path)
img = cv2.resize(img, (224, 224))  # Resize to match model input
img = img / 255.0  # Normalize
img = np.expand_dims(img, axis=0)  # Add batch dimension

# ✅ Run silent prediction with verbose=0 (No extra output)
prediction = model.predict(img, verbose=0)

# ✅ Return only the final result (No progress bars)
result = "Dog 🐶" if prediction[0][0] > 0.5 else "Cat 🐱"
print(result)
