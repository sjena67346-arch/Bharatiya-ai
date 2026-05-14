# 🪔 Bharatiya AI — Setup Guide

## Quick Start

### 1️⃣ Get Your Gemini API Key

1. Go to: https://makersuite.google.com/app/apikey
2. Click **"Create API Key"** (free tier available)
3. Copy your API key (starts with `AIza...`)

### 2️⃣ Open the App

- **Local:** Drag `index.html` into your browser, or run:
  ```bash
  open index.html  # macOS
  xdg-open index.html  # Linux
  start index.html  # Windows
  ```

- **GitHub Pages:** Visit your live URL:
  ```
  https://sjena67346-arch.github.io/Bharatiya-ai/
  ```

### 3️⃣ Paste Your API Key

When the app opens, you'll see a prompt:
```
⚠️ Gemini API Key is missing!
Please enter your Gemini API key (get it from https://makersuite.google.com/app/apikey):
```

1. **Paste your API key** (from Step 1)
2. Click **OK**
3. Start chatting! 🎉

---

## 🔒 Security

- ✅ Your API key is saved in **browser localStorage** (local to your device only)
- ✅ The key is **never sent to any server** except Google's Gemini API
- ✅ Clear your browser data to delete the saved key

### For Production/Public Deployment:
Use a **backend proxy** to keep your API key secret. See the README.md for details.

---

## ⚙️ Configuration

Edit these values in `app.js` (lines 7-32) to customize:

```javascript
const CONFIG = {
  GEMINI_API_KEY: ...,      // Your API key (from localStorage)
  MODEL: "gemini-2.0-flash", // Change model here
  SYSTEM_PROMPT: `...`,      // Customize AI personality
};
```

---

## ✅ Testing

Once set up, try these prompts:

- 💬 "Tell me about ISRO's achievements"
- 🖼️ Upload an image and ask "What's in this image?"
- 🎨 "Generate an image of the Taj Mahal at sunset" (text description)
- 📝 "Write a poem in Hindi about nature"

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| API key prompt keeps appearing | Clear browser cache → Close browser → Reopen |
| "Error: HTTP 400" | API key is invalid or expired. Get a new one from makersuite.google.com |
| "Error: HTTP 429" | You've hit the rate limit. Wait a few minutes and try again. |
| "No response" | Check your internet connection |

---

## 📚 Resources

- **Gemini API Docs:** https://ai.google.dev/tutorials/python_quickstart
- **Free API Tier:** https://ai.google.dev/pricing
- **Report Issues:** https://github.com/sjena67346-arch/Bharatiya-ai/issues

---

**Questions?** Check the [README.md](README.md) for more details.

Jai Hind! 🇮🇳
