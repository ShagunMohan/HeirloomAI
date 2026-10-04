# HeirloomAI — Grandpa's Voice Memo Recipe & Storybook Engine 📖🎙️

> **Build for a Friend Hackathon Edition** — Powered by Private, Local Open-Source AI.

HeirloomAI turns your loved one's spoken stories and voice notes into a beautifully formatted family recipe vault and storybook — completely offline, with 100% data privacy and zero cloud server dependency.

---

## 🌟 Key Features

1. **🎙️ Voice Memo Transcriber & Visualizer:** Live microphone audio recording with dynamic frequency canvas visualizer + MP3/WAV file drag-and-drop.
2. **🧠 Private Open-Source AI Parser:** Extract recipe ingredients, secret family tips, nostalgia stories, prep times, and serving sizes using local open-weight models (Ollama, LM Studio, Qwen 2.5, Llama 3.2) or the built-in 100% offline browser engine.
3. **🛡️ Roommate Allergy Safety Shield:** Auto-check recipe ingredients against custom roommate dietary restrictions (Gluten, Dairy, Peanuts, Shellfish) with smart safe AI substitution recommendations.
4. **🗣️ Multilingual Voice Practice Partner:** Practice cooking vocabulary and story listening in English, Spanish, Italian, French, or German with real-time speech synthesis.
5. **🖨️ Printable Family Cookbook & JSON Backup:** Export styled printable HTML cookbooks (`window.print()`) and private JSON vault backups.

---

## 🚀 Quick Start

1. Clone or download this repository.
2. Open `index.html` directly in any web browser, OR run a local server:
   ```bash
   python -m http.server 8080
   ```
3. Open `http://localhost:8080` in your browser.
4. *(Optional)* Connect your local **Ollama** server (`http://localhost:11434`) or **LM Studio** (`http://localhost:1234`) via the header dropdown.

---

## 🔒 Privacy & Open Innovation

- **Zero Cloud Leak:** All voice memos, audio recordings, and family recipes remain strictly on your local machine.
- **$0 Operating Cost:** Unlimited local AI processing without cloud API tokens or subscriptions.
- **100% Offline Capability:** Operates off-grid without internet connectivity.
