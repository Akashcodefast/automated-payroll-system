Setup Instructions
1️⃣ Clone Repository
git clone https://github.com/Akashcodefast/automated-payroll-system.git
cd automated-payroll-system

2️⃣ Backend Setup (Node.js)
cd backend
npm install

Create a .env file in backend/:

MONGO_URI=mongodb://127.0.0.1:27017/payrollDB
JWT_SECRET=your_secret_key
ML_API_URL=http://127.0.0.1:5001

Run backend: npm run dev

3️⃣ Frontend Setup (React)
cd frontend
npm install

Create .env in frontend/:

REACT_APP_API_BASE=http://localhost:8080

Run frontend: npm start

The app runs at 👉 http://localhost:3000

4️⃣ ML Model Setup (Flask + XGBoost)
cd ml-model
python -m venv venv
venv\Scripts\activate   # (Windows)
source venv/bin/activate # (Linux/Mac)

pip install -r requirements.txt

Run Flask API: python api.py
It runs at 👉 http://127.0.0.1:5001

🧪 Testing Salary Prediction API (Postman)

Endpoint: POST http://127.0.0.1:5001/predict

Headers:

Content-Type: application/json


Sample Body:

{
  "employee_id": "E123",
  "hours_worked": 160,
  "leaves_taken": 2,
  "experience_years": 3,
  "base_salary": 25000
}


Sample Response:

{
  "predicted_salary": 28000.45
}

👥 Roles & Authentication

Admin → /admin dashboard

Employee → /employee dashboard

Login is protected via JWT token stored in localStorage.

📌 Features

🔐 Secure Login (JWT-based)

👨‍💼 Role-based access (Admin / Employee)

📊 Automated Payroll Management

🤖 ML-powered salary prediction

📑 Reports section for Admin

🛠️ Tech Stack

Frontend: React, React Router

Backend: Node.js, Express, MongoDB

ML Model: Python, Flask, XGBoost

Auth: JWT + Bcrypt

🤝 Contributing

Fork the repo

Create your feature branch (git checkout -b feature-name)

Commit changes (git commit -m 'Add feature')

Push branch (git push origin feature-name)

Create a Pull Request
