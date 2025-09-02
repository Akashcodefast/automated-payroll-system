# ml-model/train_model.py
import os
import json
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import joblib

# Try XGBoost; fall back to sklearn if unavailable
USE_XGB = True
try:
    from xgboost import XGBRegressor
except Exception:
    from sklearn.ensemble import GradientBoostingRegressor
    USE_XGB = False

DATA_PATH = "synthetic_attendance_salary_data.csv"
MODEL_PATH = "salary_model.pkl"
FEATURES_META = "features.json"

def maybe_make_dataset(path: str, n: int = 600):
    if os.path.exists(path):
        return
    rng = np.random.default_rng(42)
    employee_id = [f"E{str(i).zfill(4)}" for i in range(1, n+1)]
    hours_worked = rng.integers(120, 241, n)            # hours in month
    leaves_taken = rng.integers(0, 6, n)                # days
    experience_years = rng.integers(1, 16, n)           # years
    # base salary grows mildly with experience
    base_salary = rng.integers(18000, 28000, n) + experience_years * 1200
    noise = rng.normal(0, 1200, n)
    salary = (
        base_salary
        + hours_worked * 80
        - leaves_taken * 600
        + experience_years * 1000
        + noise
    ).round(0)

    df = pd.DataFrame({
        "employee_id": employee_id,
        "hours_worked": hours_worked,
        "leaves_taken": leaves_taken,
        "experience_years": experience_years,
        "base_salary": base_salary,
        "salary": salary
    })
    df.to_csv(path, index=False)
    print(f"✅ Created synthetic dataset: {path} ({len(df)} rows)")

def main():
    maybe_make_dataset(DATA_PATH)

    df = pd.read_csv(DATA_PATH)
    X_cols = ["hours_worked", "leaves_taken", "experience_years", "base_salary"]
    y_col = "salary"

    X = df[X_cols]
    y = df[y_col]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    if USE_XGB:
        print("🧠 Using XGBoostRegressor")
        model = XGBRegressor(
            n_estimators=300,
            learning_rate=0.08,
            max_depth=6,
            subsample=0.9,
            colsample_bytree=0.9,
            random_state=42
        )
    else:
        print("🧠 Using GradientBoostingRegressor (fallback)")
        from sklearn.ensemble import GradientBoostingRegressor
        model = GradientBoostingRegressor(random_state=42)

    model.fit(X_train, y_train)
    preds = model.predict(X_test)

    mse = mean_squared_error(y_test, preds)
    r2 = r2_score(y_test, preds)
    print(f"📊 MSE: {mse:.2f}")
    print(f"📊 R² : {r2:.4f}")

    joblib.dump(model, MODEL_PATH)
    print(f"✅ Saved model to {MODEL_PATH}")

    with open(FEATURES_META, "w") as f:
        json.dump({"features": X_cols, "target": y_col}, f)
    print(f"📝 Saved feature meta to {FEATURES_META}")

if __name__ == "__main__":
    main()