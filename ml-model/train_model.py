# train_model.py
import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import joblib

from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

import xgboost as xgb

# ---------- Config ----------
DATA_PATH = "salary_dataset.csv"
MODEL_PATH = "salary_model.pkl"
PLOTS_DIR = "plots"
SYNTHETIC_ROWS = 500
RANDOM_SEED = 42

np.random.seed(RANDOM_SEED)

# ---------- Helper: create synthetic dataset if missing ----------
def create_synthetic_dataset(path, n=SYNTHETIC_ROWS):
    print(f"Dataset not found. Generating synthetic dataset with {n} rows -> {path}")
    # Ranges informed from your sample data
    hours = np.random.randint(120, 240, size=n)          # monthly hours
    leaves = np.random.randint(0, 7, size=n)             # leave days
    experience = np.random.randint(1, 21, size=n)        # years
    base_salary = np.random.randint(20000, 50001, size=n)  # base pay

    # Simple formula to synthesize "salary" with some noise:
    # salary = base_salary * (1 + 0.02*experience + 0.001*(hours-160) - 0.01*leaves) + noise
    noise = np.random.normal(loc=0.0, scale=3000, size=n)
    salary = base_salary * (1 + 0.02 * experience + 0.001 * (hours - 160) - 0.01 * leaves) + noise
    salary = np.round(np.maximum(salary, 0), 2)

    ids = [f"E{str(i+1).zfill(4)}" for i in range(n)]

    df = pd.DataFrame({
        "employee_id": ids,
        "hours_worked": hours,
        "leaves_taken": leaves,
        "experience_years": experience,
        "base_salary": base_salary,
        "salary": salary
    })

    df.to_csv(path, index=False)
    print(f"Saved synthetic dataset -> {path}")

# ---------- Load dataset ----------
if not os.path.exists(DATA_PATH):
    create_synthetic_dataset(DATA_PATH, n=SYNTHETIC_ROWS)

print(f"Loading dataset from {DATA_PATH} ...")
df = pd.read_csv(DATA_PATH)
print(f"Dataset rows: {len(df)}  columns: {list(df.columns)}")
print(df.head())

# ---------- Features and target ----------
FEATURE_COLS = ["hours_worked", "leaves_taken", "experience_years", "base_salary"]
TARGET_COL = "salary"

X = df[FEATURE_COLS]
y = df[TARGET_COL]

# ---------- Train-test split ----------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=RANDOM_SEED
)

# ---------- Train XGBoost Regressor ----------
print("Training XGBoostRegressor ...")
model = xgb.XGBRegressor(
    objective="reg:squarederror",
    n_estimators=200,
    learning_rate=0.05,
    max_depth=6,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=RANDOM_SEED
)

model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)

# ---------- Predict & Metrics ----------
y_pred = model.predict(X_test)

mae = mean_absolute_error(y_test, y_pred)
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
r2 = r2_score(y_test, y_pred)

print("\nModel evaluation:")
print(f" MAE  : {mae:.2f}")
print(f" MSE  : {mse:.2f}")
print(f" RMSE : {rmse:.2f}")
print(f" R²   : {r2:.4f}")

# ---------- Prepare output folder ----------
os.makedirs(PLOTS_DIR, exist_ok=True)

# ---------- Plot 1: Actual vs Predicted (scatter) ----------
plt.figure(figsize=(8, 6))
sns.scatterplot(x=y_test, y=y_pred, alpha=0.7)
plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], "r--", lw=2)
plt.xlabel("Actual Salary")
plt.ylabel("Predicted Salary")
plt.title("Actual vs Predicted Salary")
plt.tight_layout()
out1 = os.path.join(PLOTS_DIR, "actual_vs_predicted.png")
plt.savefig(out1)
plt.close()
print(f"Saved plot: {out1}")

# ---------- Plot 2: Residuals distribution ----------
residuals = (y_test - y_pred)
plt.figure(figsize=(8, 5))
sns.histplot(residuals, bins=30, kde=True)
plt.xlabel("Residual (Actual - Predicted)")
plt.title("Residuals Distribution")
plt.tight_layout()
out2 = os.path.join(PLOTS_DIR, "residuals_distribution.png")
plt.savefig(out2)
plt.close()
print(f"Saved plot: {out2}")

# ---------- Plot 3: Feature importance ----------
try:
    ax = xgb.plot_importance(model, importance_type="gain", max_num_features=10)
    fig = ax.figure
    fig.tight_layout()
    out3 = os.path.join(PLOTS_DIR, "feature_importance.png")
    fig.savefig(out3)
    plt.close(fig)
    print(f"Saved plot: {out3}")
except Exception as e:
    print("Could not plot feature importance:", e)

# ---------- Save predictions to CSV for inspection ----------
out_pred_csv = os.path.join(PLOTS_DIR, "predictions_vs_actual.csv")
pred_df = pd.DataFrame({
    "actual": np.array(y_test),
    "predicted": y_pred,
    "residual": residuals
})
pred_df.to_csv(out_pred_csv, index=False)
print(f"Saved predictions CSV: {out_pred_csv}")

# ---------- Save model ----------
joblib.dump(model, MODEL_PATH)
print(f"Saved trained model -> {MODEL_PATH}")

print("\n✅ Training complete. All outputs saved inside the 'plots/' folder and model saved.")
