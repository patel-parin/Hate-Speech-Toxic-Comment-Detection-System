# ToxiGuard AI - Toxic Comment Detection System

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)](https://github.com/your-username/your-repo)
[![Stars](https://img.shields.io/github/stars/your-username/your-repo?style=social)](https://github.com/your-username/your-repo/stargazers)

A full-stack, AI-powered application designed to detect and moderate toxic content in real-time. ToxiGuard uses a high-performance ONNX model to support multiple languages (English, Hindi, and Hinglish) and provides a detailed breakdown of toxicity, helping to create safer online communities.

## ✨ Key Features

* **Real-Time Analysis:** Get instant toxicity scores and classifications as you type.
* **Multi-Label Classification:** Breaks down toxicity into 6 categories: `toxic`, `severe_toxic`, `obscene`, `threat`, `insult`, and `identity_hate`.
* **Multi-Language Support:** Powered by an XLM-R-based model to accurately detect toxicity in **English**, **Hindi**, and **Hinglish** (mixed language).
* **User Authentication:** Secure JWT-based authentication for user registration and login.
* **Personal Analysis History:** Logged-in users can review, search, and filter their past analyses.
* **Detailed Analytics:** The modal for each history item shows the full text, category scores, and the ML model's processing time.
* **Free Trial System:** Guests can perform 2 free analyses before being prompted to log in.
* **Global Stats:** The homepage displays site-wide statistics for total analyses and toxic comments detected.

## 🚀 Live Demo & Screenshots

(Add a link to your deployed Heroku/Vercel/Netlify app here)

****
*The main analyzer interface showing a high-toxicity result for a Hinglish comment.*

****
*The detailed analysis modal showing the category breakdown and the analysis time.*

## 🛠️ Tech Stack

This project is a full-stack monorepo with three main parts:

* **Frontend (Client):**
    * **React**
    * **Tailwind CSS:** For all styling and the "glass-card" UI.
    * **Framer Motion:** For all animations and page transitions.
    * **Axios:** For API requests.
    * **Headless UI:** For accessible components like the modal.
    * **Heroicons:** For the icon set.
    * **React Hot Toast:** For notifications.

* **Backend (Server):**
    * **Node.js**
    * **Express:** As the API framework.
    * **MongoDB:** As the primary database.
    * **Mongoose:** For object data modeling.
    * **JWT (jsonwebtoken):** For user authentication.
    * **bcrypt.js:** For password hashing.
    * **`child_process`:** To spawn and run the Python ML script.

* **Machine Learning (ML):**
    * **Python:** As the scripting language.
    * **ONNX Runtime:** To run the optimized model with high performance.
    * **Transformers:** For the (XLM-R) tokenizer.
    * **NLTK:** For text preprocessing.

## 🧠 How It Works

1.  A user enters text in the **React** app and hits "Analyze".
2.  The React app sends an API request to the **Node.js/Express** server (`POST /api/predict`).
3.  The Express server spawns the **Python** script (`ml/predict.py`) as a child process, passing the text as an argument.
4.  The Python script cleans the text, tokenizes it, and runs it through the **ONNX model** to get the toxicity probabilities and analysis time.
5.  The Python script prints the results as a JSON string.
6.  The Node.js server captures this JSON, saves it to the **MongoDB** database (if the user is logged in), and sends the result back to the React app.
7.  The React app displays the detailed results, including the `analysisTime` from the model.

## 📦 Getting Started & Installation

To run this project locally, you will need to set up the server, client, and Python environment.

### Prerequisites

* [Node.js](https://nodejs.org/) (v18+)
* [Python](https://www.python.org/) (v3.9+) & `pip`
* [MongoDB](https://www.mongodb.com/) (A local instance or a free Atlas cluster)
* [Git](https://git-scm.com/)

---

## 1. Clone the Repository

```bash
git clone [https://github.com/your-username/your-repo.git](https://github.com/your-username/your-repo.git)
cd your-repo
```

## 2. Backend Setup (Server)
### 1.Navigate to the server directory:
```bash 
cd server
```
### 2.Install dependencies:

```bash
npm install
```
### 3.Create a .env file in the /server directory and add your environment variables:
```bash
PORT=5000
MONGODB_URI="your_mongodb_connection_string"
JWT_SECRET="your_super_secret_jwt_key"
```

### 4.Start the server (in a dedicated terminal):

```bash

npm run dev
```
The server will be running at http://localhost:5000.

## 3. Frontend Setup (Client)
### 1.Navigate to the client directory (from the root):

```bash
cd client
```

### 2.Install dependencies:

```bash
npm install
```

### 3.Start the React app (in a second terminal):

```bash
npm run dev
```
The app will open at http://localhost:5173.

## 4. Machine Learning Setup (ML)
### 1.Navigate to the ML directory (from the root):

```bash
cd ml
```
### 2.Create a Python virtual environment (recommended):

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```
### 3.Install the required Python packages:

```bash
pip install -r requirements.txt
```
(If you don't have a requirements.txt, install these manually):

```bash

pip install onnxruntime transformers numpy nltk
```
### 4.Download NLTK Data: The preprocess.py file requires NLTK data. Run this one-time command:
```bash
python -m nltk.downloader stopwords wordnet omw-1.4
```
After these steps, the Node.js server will be able to successfully call the ml/predict.py script.
