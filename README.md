# 🌱 Smart Farming AI (AgriSaar)

## 🚀 Overview  

Smart Farming AI (AgriSaar) is an AI-powered decision support system designed to help farmers make **data-driven agricultural decisions**. It converts complex soil lab reports into **simple, actionable insights** like crop recommendations, fertilizer planning, weather alerts, and government scheme eligibility.  

**"We convert complex soil data into simple farming decisions."**

---

## 🏗️ Project Architecture

This project is built using a modern, scalable architecture divided into three main components:

1. **`frontend/`**: A responsive web application built with **React**, **Vite**, and **Tailwind CSS**. It provides an intuitive interface for farmers, complete with multi-language support and dynamic themes.
2. **`backend/`**: A **Node.js/Express** API gateway that handles authentication, core business logic, and acts as a proxy for the ML services.
3. **`ml_backend/`**: A **Python/FastAPI** service powered by **PyTorch** for local machine learning tasks (like crop disease detection and market price prediction) and **Google Gemini** for LLM-based agricultural reasoning.

---

## 🎯 Problem  

Farmers often receive technical soil reports that are difficult to understand. Due to lack of guidance, they:  
- Choose unsuitable crops  
- Overuse or misuse fertilizers  
- Ignore soil health  
- Miss government schemes  

👉 This results in **low productivity, higher costs, and soil degradation**.  

---

## 💡 Solution  

AgriSaar bridges the gap between **raw soil data and real farming decisions** using AI & LLMs.  

It provides:  
- 🌾 Smart crop recommendations  
- 🧪 Accurate fertilizer plans  
- 📊 Soil health scoring  
- 🌧️ Weather-aware suggestions  
- 💰 Government scheme eligibility  
- 📅 Step-by-step farming roadmap  
- 📸 Crop disease detection (via PyTorch Vision models)

---

## 🛠️ Tech Stack  

### Frontend  
- React.js (Vite)
- Tailwind CSS  
- Recharts  
- React Hook Form + Zod  

### Backend (API Gateway)
- Node.js  
- Express.js  
- HTTP Proxy Middleware (for routing ML requests)

### ML Backend (AI / Data Science)
- Python (FastAPI)
- PyTorch & Torchvision (Disease Detection)
- Scikit-Learn (Market Price Prediction)
- Google Gemini (LLM - 2.5 Flash)  

---

## ⚙️ Getting Started (Local Development)

### 1. Clone the repository
```bash
git clone https://github.com/priyabratasahoo780/DEVHACK.git
cd DEVHACK
```

### 2. Set up Environment Variables
Create a `.env` file in the root directory and add your API keys:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5001
ML_BACKEND_URL=http://127.0.0.1:8000
```

### 3. Setup Python ML Backend
Ensure you have Python 3.10+ installed.
```bash
cd ml_backend
python -m venv .venv
# Activate the virtual environment (Windows)
.venv\Scripts\activate
# Install dependencies
pip install -r requirements.txt
cd ..
```

### 4. Setup Node Backend & Run
The Node backend is configured to proxy requests to the Python backend and can start both servers simultaneously.
```bash
cd backend
npm install
npm run dev:all
```

### 5. Setup Frontend
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The application will be running at `http://localhost:3000`.

---

## 🧠 How It Works  

1. User uploads a soil report or enters data manually.
2. The Node.js backend processes the request and proxies complex AI tasks to the Python ML backend.
3. PyTorch models or Gemini LLMs analyze parameters (N, P, K, pH, etc.) and images.
4. The system calculates a soil health score and generates:  
   - Crop recommendations  
   - Fertilizer plan  
   - Simple, localized explanations  
5. Final output is presented as a **complete farming decision plan**.

---

## 👨‍💻 Author  

**Abdul Haque / Priyabrata Sahoo**  

---

## 📜 License  

This project is open-source and available under the MIT License.
