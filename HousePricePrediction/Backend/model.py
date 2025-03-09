import sys
import pickle
import numpy as np
import pandas as pd  # Import Pandas

if len(sys.argv) < 6:
    print("Error: Not enough arguments provided!")
    sys.exit(1)

# Load trained model
with open("model.pkl", "rb") as file:
    model = pickle.load(file)

try:
    # Get input data from Node.js
    size = float(sys.argv[1])
    bedrooms = int(sys.argv[2])
    bathrooms = int(sys.argv[3])
    garage_space = int(sys.argv[4])
    location_score = int(sys.argv[5])

    # Define feature names (same as used during training)
    feature_names = ["size", "bedrooms", "bathrooms", "garage_space", "location_score"]

    # Convert input into Pandas DataFrame with feature names
    input_features = pd.DataFrame([[size, bedrooms, bathrooms, garage_space, location_score]], columns=feature_names)

    # Make prediction
    predicted_price = model.predict(input_features)

    # ✅ Print ONLY the predicted price (Node.js will read this)
    print(round(predicted_price[0], 2))

except ValueError as e:
    print("Error: Invalid input data!")
    sys.exit(1)
