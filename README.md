# 🎨 Sentiment Aura

### Real-Time Emotion-Reactive AI Visual Experience

_A live, breathing, responsive AI aura that visualizes your emotional tone._

> Speak → Transcribe → Analyze → Visualize → Feel the Vibe ✨  
> Built as part of the Memory Machines Full-Stack Assessment.

---

## 🚀 Overview

**Sentiment Aura** is a fully real-time, full-stack AI demo that takes your speech and transforms it into:

- 📜 Live streaming transcription
- 🤖 Instant sentiment classification
- 🔖 Keyword extraction
- 🌈 A dynamic Perlin-noise aura that reacts emotionally to your voice

It’s a mood ring for your speech — fluid, expressive, and visually immersive.

---

## 👁️ The Experience

1. Click the glowing microphone.
2. Start speaking.
3. Watch your **words appear live**.
4. The AI detects your sentiment.
5. The entire background **changes color, energy, and motion** based on how you feel.
6. Keywords float upward like glowing particles.

It’s smooth, real-time, and mesmerizing.

---

## 🧠 Tech Stack

### **Frontend**

- React
- Zustand (global state management)
- p5.js + react-p5 (Perlin noise visualization)
- Axios
- Framer Motion
- Web Audio API

### **Backend**

- FastAPI (Python)
- Async OpenAI API call
- CORS-enabled JSON API

### **External APIs**

| Purpose                    | API                    |
| -------------------------- | ---------------------- |
| 🎙️ Real-time transcription | Deepgram WebSocket API |
| 🤖 Sentiment & keywords    | OpenAI                 |

---

## 📐 Architecture

User Speech
↓ (raw audio)
React Frontend
↓ WebSocket stream
Deepgram API
↓ JSON transcripts
Transcription Store (Zustand)
↓ final text
Backend API (FastAPI)
/process_text
↓
OpenAI / Gemini / Claude
↓ Sentiment + Keywords
Sentiment Store + Visualization
↓
Dynamic Perlin-Noise Aura

yaml
Copy code

---

## 🧩 Project Structure

/client
/src
/components → UI + visual elements
/hooks → Deepgram audio pipeline
/store → Zustand global stores
/api → Axios backend wrapper
App.tsx → Main UI + layout
AuraCanvas.tsx → Perlin noise aura

/server
main.py → FastAPI backend
requirements.txt → Python dependencies

README.md → You are here ❤️

yaml
Copy code

---

## 🛠️ Setup Instructions

### **1. Clone the repository**

```sh
git clone https://github.com/yourname/sentiment-aura
cd sentiment-aura
2. Backend Setup
Copy code
cd server
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
3. Frontend Setup
Copy code
cd client
npm install
npm run dev
4. Add the environment variables
Create client/.env:

ini
Copy code
VITE_DEEPGRAM_API_KEY=your_deepgram_key_here
VITE_BACKEND_URL=http://localhost:8000
🌈 Key Features
🎤 Real-Time Transcription
Uses Deepgram WebSocket streaming

Partial + final transcripts

Smooth auto-scrolling

🤖 AI Sentiment Engine
Sentiment score (0–1)

Label (positive / neutral / negative)

Keyword extraction

Fully debounced to prevent API overload

🎨 Perlin-Noise Aura Visualization
Changes based on sentiment:

Hue

Brightness

Noise turbulence

Flow speed

Emotion pulse

✨ Floating Keyword Particles
Rise upward

Drift

Fade out

Colored based on emotional tone

📱 Fully Responsive
Clean, centered layout

Mobile-friendly

Panels reposition elegantly
```
