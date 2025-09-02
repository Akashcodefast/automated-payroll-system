from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os

app = Flask(__name__)
# Enable CORS for all origins safely in development
CORS(app)

# Load the trained salary prediction model (make sure salary_model.pkl exists)
MODEL_PATH = os.path.join(os.path.dirname(__file__), "salary_model.pkl")
model = joblib.load(MODEL_PATH)

@app.route('/')
def index():
    return "ML Salary Prediction API running"

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "model_loaded": True})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        # Expected keys in JSON: hours_worked, leaves_taken, experience_years, base_salary
        features = [
            data.get("hours_worked"),
            data.get("leaves_taken"),
            data.get("experience_years"),
            data.get("base_salary"),
        ]

        if None in features:
            return jsonify({"error": "Missing required features"}), 400

        # Model expects 2D array for prediction
        predicted_salary = model.predict([features])[0]

        return jsonify({
            "input": data,
            "predicted_salary": round(float(predicted_salary), 2)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Run on all interfaces to allow network access if needed
    app.run(host='0.0.0.0', port=5001, debug=True)
