// ============================================
//   BHARATIYA AI — app.js (Gemini Version)
//   Features: Chat · Image Analysis · Free!
// ============================================

// ─── CONFIG ──────────────────────────────────
const CONFIG = {
  GEMINI_API_KEY: "AIzaSyAb87uAJeSAbvToLwlDraD98b2v9jp9bhI"
  MODEL: "gemini-2.0-flash",
  SYSTEM_PROMPT: `You are Bharatiya AI, a proud and intelligent Indian AI assistant inspired by the rich heritage, culture, and values of Bharat (India). 

Your personality:
- Warm, knowledgeable, and culturally aware
- You celebrate India's achievements in science, art, culture, and technology
- You can respond in both English and Hindi when appropriate
- You occasionally use respectful Indian greetings like "Namaste" or phrases like "Jai Hind"
- You are helpful, honest, and proud of Indian heritage while being inclusive of all

Your capabilities:
1. Answer questions on any topic with special depth on India-related subjects
2. Analyze images when provided and describe them in detail
3. Generate creative and descriptive text about images when asked
4. Help with coding, writing, analysis, and general knowledge
5. Explain complex topics in simple terms

When a user asks you to "generate an image" or "create an image":
- Explain that you will provide a vivid, detailed textual description of the image
- Then give a beautiful, detailed textual visualization of what the image would look like
- Format it clearly with [IMAGE DESCRIPTION] tag

Always be helpful, accurate, and represent the spirit of modern India — tech-savvy, culturally rich, and globally connected.`,
};

// ─── STATE ───────────────────────────────────
let conversationHistory = [];
let attachedImageBase64 = null;
let attachedImageType = null;
let isLoading = false;
let chatSessions = JSON.parse(localStorage.getItem("bharatiya_sessions") || "[]");
let currentSessionId = null;

// ─── DOM REFS ─────────────────────────────────
const chatArea     = document.getElementById("chatArea");
const welcome      = document.getElementById("welcome");
const messages     = document.getElementById("messages");
const userInput    = document.getElementById("userInput");
const sendBtn      = document.getElementById("sendBtn");
const imageInput   = document.getElementById("imageInput");
const imagePreview = document.getElementById("imagePreview");
const imagePreviewWrap = document.getElementById("imagePreviewWrap");
const removeImg    = document.getElementById("removeImg");
const newChatBtn   = document.getElementById("newChatBtn");
const clearBtn     = document.getElementById("clearBtn");
const menuToggle   = document.getElementById("menuToggle");
const sidebar      = document.getElementById("sidebar");
const chatHistory  = document.getElementById("chatHistory");
const lightbox     = document.getElementById("lightbox");
const lightboxImg  = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");

// ─── INIT ─────────────────────────────────────
renderHistory();
userInput.addEventListener("input", autoResize);
userInput.addEventListener("keydown", handleKeydown);
sendBtn.addEventListener("click", handleSend);
imageInput.addEventListener("change", handleImageAttach);
removeImg.addEventListener("click", clearAttachedImage);
newChatBtn.addEventListener("click", startNewChat);
clearBtn.addEventListener("click", clearCurrentChat);
menuToggle.addEventListener("click", () => sidebar.classList.toggle("open"));
lightboxClose.addEventListener("click", () => lightbox.style.display = "none");
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) lightbox.style.display = "none"; });

// Suggestion cards
document.querySelectorAll(".suggestion-card").forEach(card => {
  card.addEventListener("click", () => {
    const prompt = card.dataset.prompt;
    userInput.value = prompt;
    autoResize();
    handleSend();
  });
});

// ─── AUTO-RESIZE TEXTAREA ─────────────────────
function autoResize() {
  userInput.style.height = "auto";
  userInput.style.height = Math.min(userInput.scrollHeight, 160) + "px";
}

// ─── ENTER TO SEND ────────────────────────────
function handleKeydown(e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
}

// ─── IMAGE ATTACH ─────────────────────────────
function handleImageAttach(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (ev) => {
    const dataUrl = ev.target.result;
    attachedImageBase64 = dataUrl.split(",")[1];
    attachedImageType = file.type;
    imagePreview.src = dataUrl;
    imagePreviewWrap.style.display = "block";
  };
  reader.readAsDataURL(file);
  imageInput.value = "";
}

function clearAttachedImage() {
  attachedImageBase64 = null;
  attachedImageType = null;
  imagePreview.src = "";
  imagePreviewWrap.style.display = "none";
}

// ─── SEND MESSAGE ─────────────────────────────
async function handleSend() {
  const text = userInput.value.trim();
  if ((!text && !attachedImageBase64) || isLoading) return;

  hideWelcome();

  // Show user bubble
  appendUserMessage(text, attachedImageBase64 ? `data:${attachedImageType};base64,${attachedImageBase64}` : null);

  // Build parts for Gemini
  const userParts = [];
  if (attachedImageBase64) {
    userParts.push({
      inline_data: {
        mime_type: attachedImageType,
        data: attachedImageBase64,
      }
    });
  }
  if (text) userParts.push({ text });
  else userParts.push({ text: "Please analyze and describe this image in detail." });

  // Add to history
  conversationHistory.push({ role: "user", parts: userParts });

  // Reset input
  userInput.value = "";
  userInput.style.height = "auto";
  clearAttachedImage();
  sendBtn.disabled = true;
  isLoading = true;

  const typingId = showTyping();

  try {
    const aiText = await callGeminiAPI();
    removeTyping(typingId);
    appendAIMessage(aiText);
    conversationHistory.push({ role: "model", parts: [{ text: aiText }] });
    saveSession(text, aiText);
  } catch (err) {
    removeTyping(typingId);
    appendAIMessage(`⚠️ **Error:** ${err.message}\n\nPlease check your Gemini API key in app.js and try again.`);
  } finally {
    sendBtn.disabled = false;
    isLoading = false;
  }
}

// ─── GEMINI API CALL ──────────────────────────
async function callGeminiAPI() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.MODEL}:generateContent?key=${CONFIG.GEMINI_API_KEY}`;

  const body = {
    system_instruction: {
      parts: [{ text: CONFIG.SYSTEM_PROMPT }]
    },
    contents: conversationHistory,
    generationConfig: {
      maxOutputTokens: 1024,
      temperature: 0.7,
    }
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "(No response)";
}

// ─── DOM: SHOW/HIDE WELCOME ───────────────────
function hideWelcome() {
  const w = document.getElementById("welcome");
  if (w) {
    w.style.opacity = "0";
    w.style.transition = "opacity 0.3s";
    setTimeout(() => w.remove(), 300);
  }
}

// ─── DOM: APPEND USER MESSAGE ─────────────────
function appendUserMessage(text, imgDataUrl) {
  const div = document.createElement("div");
  div.className = "message user";
  div.innerHTML = `
    <div class="msg-avatar">🙏</div>
    <div class="msg-content">
      ${imgDataUrl ? `<img class="user-img-preview" src="${imgDataUrl}" alt="attached" />` : ""}
      ${text ? `<div class="msg-bubble">${escapeHTML(text)}</div>` : ""}
      <span class="msg-time">${getTime()}</span>
    </div>
  `;
  messages.appendChild(div);
  scrollToBottom();
}

// ─── DOM: APPEND AI MESSAGE ───────────────────
function appendAIMessage(text) {
  const div = document.createElement("div");
  div.className = "message ai";
  const formatted = formatMarkdown(text);
  div.innerHTML = `
    <div class="msg-avatar">🪔</div>
    <div class="msg-content">
      <div class="msg-bubble">${formatted}</div>
      <span class="msg-time">${getTime()}</span>
    </div>
  `;
  messages.appendChild(div);
  div.querySelectorAll(".msg-bubble img").forEach(img => {
    img.addEventListener("click", () => {
      lightboxImg.src = img.src;
      lightbox.style.display = "flex";
    });
  });
  scrollToBottom();
}

// ─── TYPING INDICATOR ─────────────────────────
function showTyping() {
  const id = "typing-" + Date.now();
  const div = document.createElement("div");
  div.className = "message ai";
  div.id = id;
  div.innerHTML = `
    <div class="msg-avatar">🪔</div>
    <div class="msg-content">
      <div class="msg-bubble">
        <div class="typing-dots"><span></span><span></span><span></span></div>
      </div>
    </div>
  `;
  messages.appendChild(div);
  scrollToBottom();
  return id;
}

function removeTyping(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

// ─── SCROLL ───────────────────────────────────
function scrollToBottom() {
  setTimeout(() => { chatArea.scrollTop = chatArea.scrollHeight; }, 50);
}

// ─── MARKDOWN FORMATTER ───────────────────────
function formatMarkdown(text) {
  let html = escapeHTML(text);
  html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) =>
    `<pre><code class="lang-${lang}">${code.trim()}</code></pre>`
  );
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");
  html = html.replace(/^[\-\*] (.+)$/gm, "<li>$1</li>");
  html = html.replace(/^\d+\. (.+)$/gm, "<li>$1</li>");
  html = html.replace(/\n\n/g, "<br/><br/>");
  html = html.replace(/\n/g, "<br/>");
  return html;
}

function escapeHTML(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ─── TIME HELPER ──────────────────────────────
function getTime() {
  return new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

// ─── SESSION / HISTORY ────────────────────────
function saveSession(userText, aiText) {
  if (!currentSessionId) {
    currentSessionId = Date.now().toString();
    chatSessions.unshift({
      id: currentSessionId,
      title: userText.slice(0, 40) || "New Chat",
      timestamp: Date.now(),
    });
    if (chatSessions.length > 20) chatSessions.pop();
    localStorage.setItem("bharatiya_sessions", JSON.stringify(chatSessions));
    renderHistory();
  }
}

function renderHistory() {
  chatHistory.innerHTML = `<p class="history-label">Recent</p>`;
  chatSessions.slice(0, 15).forEach(session => {
    const item = document.createElement("div");
    item.className = "history-item" + (session.id === currentSessionId ? " active" : "");
    item.innerHTML = `💬 ${session.title}`;
    item.title = session.title;
    chatHistory.appendChild(item);
  });
}

function startNewChat() {
  conversationHistory = [];
  currentSessionId = null;
  messages.innerHTML = "";
  clearAttachedImage();

  const welcomeEl = document.createElement("div");
  welcomeEl.className = "welcome";
  welcomeEl.id = "welcome";
  welcomeEl.innerHTML = `
    <div class="welcome-diya">🪔</div>
    <h1 class="welcome-title">नमस्ते! I'm <span>Bharatiya AI</span></h1>
    <p class="welcome-sub">Your intelligent Indian AI assistant. Ask me anything, share an image, or let me create one for you.</p>
    <div class="suggestion-grid">
      <button class="suggestion-card" data-prompt="Tell me about India's space missions and ISRO's achievements">🚀 India's Space Missions</button>
      <button class="suggestion-card" data-prompt="Explain the significance of the Indian Constitution">📜 Indian Constitution</button>
      <button class="suggestion-card" data-prompt="Generate an image of the Taj Mahal at sunrise">🎨 Generate Taj Mahal Image</button>
      <button class="suggestion-card" data-prompt="What are the major festivals celebrated in India?">🎉 Indian Festivals</button>
      <button class="suggestion-card" data-prompt="How is AI transforming India's economy?">🤖 AI in India</button>
      <button class="suggestion-card" data-prompt="Write a short poem in Hindi about nature">✍️ Hindi Poem</button>
    </div>
  `;
  chatArea.insertBefore(welcomeEl, messages);

  welcomeEl.querySelectorAll(".suggestion-card").forEach(card => {
    card.addEventListener("click", () => {
      userInput.value = card.dataset.prompt;
      autoResize();
      handleSend();
    });
  });

  sidebar.classList.remove("open");
  renderHistory();
}

function clearCurrentChat() {
  if (conversationHistory.length === 0) return;
  if (confirm("Clear this chat?")) startNewChat();
}
  
