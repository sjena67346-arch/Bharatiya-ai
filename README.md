# 🪔 Bharatiya AI

> Your intelligent Indian AI assistant — powered by Claude (Anthropic)

Bharatiya AI is a Gemini-style AI chat assistant with Indian cultural identity. It supports:
- 💬 **General Q&A** — Ask anything
- 🖼️ **Image Analysis** — Upload an image and get a detailed description
- 🎨 **Image Generation** (text-based) — Describe images via vivid textual visualization
- 🌐 **Bilingual** — English & Hindi support
- 📱 **Responsive** — Works on mobile and desktop

---

## 📸 Preview

```
🪔 नमस्ते! I'm Bharatiya AI
Your intelligent Indian AI assistant
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/bharatiya-ai.git
cd bharatiya-ai
```

### 2. Set up your API key

```bash
cp config.example.js config.js
```

Open `config.js` and replace the placeholder with your Anthropic API key:

```javascript
window.BHARATIYA_API_KEY = "sk-ant-YOUR_REAL_API_KEY_HERE";
```

> 🔑 Get your API key from: https://console.anthropic.com/

### 3. Open the app

Just open `index.html` in your browser:

```bash
# On Mac
open index.html

# On Linux
xdg-open index.html

# Or simply drag index.html into your browser
```

No build step required! It's pure HTML, CSS, and JavaScript.

---

## 🌐 Deploy to GitHub Pages

1. Push your code to GitHub (make sure `config.js` is gitignored!)
2. Go to your repo → **Settings** → **Pages**
3. Set source to `main` branch, root `/`
4. Your app will be live at: `https://YOUR_USERNAME.github.io/bharatiya-ai`

> ⚠️ **Security Note:** When deploying publicly, your API key will be exposed to anyone who views the source. For production, use a backend proxy. See [Backend Proxy Setup](#-backend-proxy-optional) below.

---

## 📁 File Structure

```
bharatiya-ai/
├── index.html          # Main HTML — layout & structure
├── style.css           # Saffron & Navy theme, animations
├── app.js              # Core logic — chat, API calls, image handling
├── config.example.js   # Copy to config.js and add your key
├── .gitignore          # Keeps config.js out of git
└── README.md           # This file
```

---

## ✨ Features

| Feature | Details |
|---|---|
| 💬 Chat | Full multi-turn conversation with memory |
| 🖼️ Image Analysis | Upload JPG/PNG/WebP and ask questions |
| 🎨 Text Image Gen | Vivid textual descriptions of requested images |
| 📜 History | Chat sessions saved in localStorage |
| 🌙 Dark Theme | Saffron + Deep Navy — inspired by the Tiranga |
| 📱 Responsive | Mobile-friendly sidebar with hamburger menu |
| ⚡ Fast | No build step, no framework, instant load |

---

## 🔧 Configuration

Edit `app.js` to customize:

```javascript
const CONFIG = {
  ANTHROPIC_API_KEY: window.BHARATIYA_API_KEY,
  MODEL: "claude-opus-4-20250514",    // Change model here
  MAX_TOKENS: 1024,                    // Increase for longer answers
  SYSTEM_PROMPT: `...`,               // Customize AI personality
};
```

---

## 🛡️ Backend Proxy (Optional)

For a production deployment, never expose your API key client-side. Use a simple proxy:

### Using Node.js + Express

```javascript
// server.js
const express = require('express');
const fetch = require('node-fetch');
const app = express();
app.use(express.json());
app.use(express.static('.'));

app.post('/api/chat', async (req, res) => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(req.body),
  });
  const data = await response.json();
  res.json(data);
});

app.listen(3000);
```

Then update `app.js` to call `/api/chat` instead of the Anthropic API directly.

---

## 🌈 Tech Stack

- **Frontend:** Vanilla HTML5, CSS3, JavaScript (ES6+)
- **AI:** Anthropic Claude API (claude-opus-4)
- **Fonts:** Yatra One (Indian display font) + Poppins
- **Storage:** localStorage for session history
- **Icons:** Emoji-based (no external icon library needed)

---

## 🤝 Contributing

Pull requests are welcome! Feel free to:
- Add new suggestion cards
- Improve the markdown renderer
- Add a backend proxy
- Add more Indian language support

---

## 📄 License

MIT License — Free to use, modify, and distribute.

---

## 🙏 Acknowledgements

- Built with ❤️ for Bharat
- Powered by [Anthropic Claude](https://www.anthropic.com)
- Inspired by the spirit of Digital India

**Jai Hind! 🇮🇳**
# Bharatiya-ai
