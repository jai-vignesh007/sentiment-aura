Here is the content you provided, structured in a clean, easily copy-pastable README file format using Markdown.

```markdown
# 🌟 Sentiment Aura: Real-Time Emotional Visualization

### Real-Time Emotion-Reactive AI Visual Experience

> Speak → Transcribe → Analyze → Visualize → Feel the Vibe ✨
> Built as part of the Memory Machines Full-Stack Assessment.

---

## 🚀 Overview

**Sentiment Aura** is a fully real-time, full-stack AI demo that takes your speech and transforms it into:

* 📜 **Live streaming transcription**
* 🤖 **Instant sentiment classification**
* 🔖 **Keyword extraction**
* 🌈 A **dynamic Perlin-noise aura** that reacts emotionally to your voice

It’s a mood ring for your speech — fluid, expressive, and visually immersive.

---

## 👁️ The Experience

1.  Click the glowing microphone.
2.  Start speaking.
3.  Watch your **words appear live**.
4.  The AI detects your sentiment.
5.  The entire background **changes color, energy, and motion** based on how you feel.
6.  Keywords float upward like glowing particles.

It’s smooth, real-time, and mesmerizing.

---

## 🧠 Tech Stack

### **Frontend**

* **React**
* **Zustand** (global state management)
* **p5.js + react-p5** (Perlin noise visualization)
* **Axios**
* **Framer Motion**
* **Web Audio API**

### **Backend**

* **FastAPI** (Python)
* **Async OpenAI API call**
* **CORS-enabled JSON API**

### **External APIs**

| Purpose | API |
| :--- | :--- |
| 🎙️ Real-time transcription | **Deepgram WebSocket API** |
| 🤖 Sentiment & keywords | **OpenAI** |

---

## 📐 Architecture

1.  **User Speech** $\downarrow$ (raw audio)
2.  **React Frontend** $\downarrow$ WebSocket stream
3.  **Deepgram API** $\downarrow$ JSON transcripts
4.  **Transcription Store (Zustand)** $\downarrow$ final text
5.  **Backend API (FastAPI) /process\_text** $\downarrow$
6.  **OpenAI / Gemini / Claude** $\downarrow$ Sentiment + Keywords
7.  **Sentiment Store + Visualization** $\downarrow$
8.  **Dynamic Perlin-Noise Aura**

---

## 🧩 Project Structure

```

/client
├── /src
│   ├── /components → UI + visual elements
│   ├── /hooks → Deepgram audio pipeline
│   ├── /store → Zustand global stores
│   ├── /api → Axios backend wrapper
│   ├── App.tsx → Main UI + layout
│   └── AuraCanvas.tsx → Perlin noise aura
├── package.json
└── vite.config.ts

/server
├── /app
│   ├── /services
│   ├── /utils
│   ├── main.py → FastAPI backend
│   └── models.py
├── requirements.txt → Python dependencies
└── railway.json

```
```

````markdown
# 🌟 Sentiment Aura: Real-Time Emotional Visualization

This project demonstrates a real-time sentiment analysis application using Deepgram for transcription and a custom backend for sentiment scoring, visualized through a dynamic, Perlin-noise-driven aura in the frontend.

---

## 🛠️ Setup Instructions

### **1. Clone the repository**

```sh
git clone [https://github.com/yourname/sentiment-aura](https://github.com/yourname/sentiment-aura)
cd sentiment-aura
````

### **2. Backend Setup**

```sh
cd server
python -m venv venv
source venv/bin/activate    # Use `venv\Scripts\activate` on Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

### **3. Frontend Setup**

```sh
cd client
npm install
npm run dev
```

### **4. Add Environment Variables**

Create a file named `.env` in the `client/` directory and add the following variables:

```ini
VITE_DEEPGRAM_API_KEY="your_deepgram_key_here"
VITE_BACKEND_URL="http://localhost:8000"
```

-----

## 🌈 Key Features

### 🎤 Real-Time Transcription

  * Uses Deepgram WebSocket streaming for low latency.
  * Displays both partial and final transcripts.
  * Features smooth, auto-scrolling transcript panel.

### 🤖 AI Sentiment Engine

  * Provides a **Sentiment Score** (0–1).
  * Categorizes emotions into a **Label** (`positive`, `neutral`, `negative`).
  * Includes **Keyword Extraction** from final transcripts.
  * Fully debounced to prevent backend API overload.

### 🎨 Perlin-Noise Aura Visualization

The background aura dynamically changes based on sentiment to visualize emotional tone:

  * **Hue**
  * **Brightness**
  * **Noise Turbulence**
  * **Flow Speed**
  * **Emotion Pulse**

### ✨ Floating Keyword Particles

  * Keywords rise upward and drift.
  * Fade out naturally.
  * Are colored based on the corresponding emotional tone.

### 📱 Fully Responsive

  * Clean, centered layout.
  * Mobile-friendly design.
  * Panels reposition elegantly on smaller screens.

<!-- end list -->

```
```