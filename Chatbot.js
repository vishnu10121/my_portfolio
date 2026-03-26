/* =========================================================
   VISHNU RAJ PORTFOLIO — AI CHATBOT WIDGET
   Powered by Anthropic Claude API
   ========================================================= */

(function() {

// ── Styles ──────────────────────────────────────────────
const style = document.createElement('style');
style.textContent = `
  /* FAB Button */
  #vr-fab {
    position: fixed;
    bottom: 28px; right: 28px;
    width: 58px; height: 58px;
    border-radius: 50%;
    background: #00e676;
    border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    z-index: 9800;
    box-shadow: 0 0 0 0 rgba(0,230,118,0.5);
    animation: fabPulse 2.5s infinite;
    transition: transform 0.25s cubic-bezier(0.4,0,0.2,1), background 0.25s;
  }
  #vr-fab:hover { transform: scale(1.12); background: #00c853; }
  #vr-fab svg { width: 26px; height: 26px; fill: #020c07; transition: 0.25s; }
  #vr-fab .close-icon { display: none; }
  #vr-fab.open .chat-icon { display: none; }
  #vr-fab.open .close-icon { display: block; }
  @keyframes fabPulse {
    0% { box-shadow: 0 0 0 0 rgba(0,230,118,0.5); }
    70% { box-shadow: 0 0 0 14px rgba(0,230,118,0); }
    100% { box-shadow: 0 0 0 0 rgba(0,230,118,0); }
  }

  /* Chat Window */
  #vr-chat {
    position: fixed;
    bottom: 100px; right: 28px;
    width: 380px; max-width: calc(100vw - 32px);
    height: 540px; max-height: calc(100vh - 120px);
    background: #020c07;
    border: 1px solid rgba(0,230,118,0.18);
    border-radius: 20px;
    box-shadow: 0 24px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(0,230,118,0.06);
    display: flex; flex-direction: column;
    z-index: 9799;
    overflow: hidden;
    opacity: 0; pointer-events: none;
    transform: translateY(20px) scale(0.96);
    transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.4,0,0.2,1);
  }
  #vr-chat.open {
    opacity: 1; pointer-events: all;
    transform: translateY(0) scale(1);
  }

  /* Header */
  .vr-header {
    display: flex; align-items: center; gap: 12px;
    padding: 16px 18px;
    background: rgba(0,230,118,0.05);
    border-bottom: 1px solid rgba(0,230,118,0.12);
    flex-shrink: 0;
  }
  .vr-avatar {
    width: 38px; height: 38px; border-radius: 50%;
    background: #00e676; display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem; color: #020c07; font-weight: 700; flex-shrink: 0;
    font-family: 'JetBrains Mono', monospace;
  }
  .vr-header-info { flex: 1; }
  .vr-header-name { font-size: 0.92rem; font-weight: 700; color: #fff; font-family: 'Space Grotesk', sans-serif; }
  .vr-header-status { display: flex; align-items: center; gap: 5px; font-size: 0.72rem; color: #4a7c59; margin-top: 1px; }
  .vr-status-dot { width: 6px; height: 6px; background: #00e676; border-radius: 50%; animation: blink-dot 1.5s infinite; }
  @keyframes blink-dot { 0%,100%{opacity:1}50%{opacity:0.4} }
  .vr-clear-btn {
    background: rgba(0,230,118,0.08); border: 1px solid rgba(0,230,118,0.18);
    border-radius: 8px; color: #81c784; cursor: pointer;
    font-size: 0.75rem; padding: 5px 10px; transition: 0.2s;
    font-family: 'Space Grotesk', sans-serif;
  }
  .vr-clear-btn:hover { background: rgba(0,230,118,0.15); color: #00e676; }

  /* Messages */
  .vr-messages {
    flex: 1; overflow-y: auto; padding: 16px 14px;
    display: flex; flex-direction: column; gap: 12px;
    scroll-behavior: smooth;
  }
  .vr-messages::-webkit-scrollbar { width: 4px; }
  .vr-messages::-webkit-scrollbar-track { background: transparent; }
  .vr-messages::-webkit-scrollbar-thumb { background: rgba(0,230,118,0.2); border-radius: 4px; }

  .vr-msg { display: flex; gap: 8px; align-items: flex-end; animation: msgIn 0.3s ease; }
  .vr-msg.user { flex-direction: row-reverse; }
  @keyframes msgIn { from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);} }

  .vr-bubble {
    max-width: 82%;
    padding: 10px 14px;
    border-radius: 16px;
    font-size: 0.86rem;
    line-height: 1.6;
    font-family: 'Space Grotesk', sans-serif;
    word-wrap: break-word;
  }
  .vr-msg.bot .vr-bubble {
    background: rgba(0,230,118,0.06);
    border: 1px solid rgba(0,230,118,0.14);
    color: #e8f5e9;
    border-bottom-left-radius: 4px;
  }
  .vr-msg.user .vr-bubble {
    background: #00e676;
    color: #020c07;
    font-weight: 600;
    border-bottom-right-radius: 4px;
  }
  .vr-msg-icon {
    width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.8rem;
  }
  .vr-msg.bot .vr-msg-icon { background: rgba(0,230,118,0.12); color: #00e676; }
  .vr-msg.user .vr-msg-icon { background: rgba(0,230,118,0.2); color: #00e676; }

  /* Typing indicator */
  .vr-typing .vr-bubble { padding: 12px 16px; }
  .vr-dots { display: flex; gap: 4px; align-items: center; }
  .vr-dots span {
    width: 7px; height: 7px; background: #00e676; border-radius: 50%;
    animation: dot-bounce 1.2s infinite;
  }
  .vr-dots span:nth-child(2) { animation-delay: 0.2s; }
  .vr-dots span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes dot-bounce { 0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)} }

  /* Quick replies */
  .vr-quick-wrap {
    padding: 8px 14px 4px;
    display: flex; gap: 7px; flex-wrap: wrap;
    flex-shrink: 0;
  }
  .vr-quick {
    font-size: 0.75rem; padding: 5px 12px;
    border-radius: 20px; border: 1px solid rgba(0,230,118,0.2);
    background: rgba(0,230,118,0.05); color: #81c784;
    cursor: pointer; transition: 0.2s;
    font-family: 'Space Grotesk', sans-serif; white-space: nowrap;
  }
  .vr-quick:hover { background: rgba(0,230,118,0.15); color: #00e676; border-color: rgba(0,230,118,0.4); }

  /* Input */
  .vr-input-row {
    display: flex; gap: 8px; align-items: center;
    padding: 12px 14px 14px;
    border-top: 1px solid rgba(0,230,118,0.1);
    flex-shrink: 0;
  }
  .vr-input {
    flex: 1; background: rgba(255,255,255,0.04);
    border: 1px solid rgba(0,230,118,0.18); border-radius: 12px;
    padding: 10px 14px; color: #e8f5e9;
    font-family: 'Space Grotesk', sans-serif; font-size: 0.88rem;
    outline: none; resize: none; max-height: 80px; min-height: 40px;
    transition: border-color 0.2s;
    line-height: 1.4;
  }
  .vr-input:focus { border-color: rgba(0,230,118,0.5); }
  .vr-input::placeholder { color: #4a7c59; }
  .vr-send {
    width: 40px; height: 40px; flex-shrink: 0;
    border-radius: 12px; background: #00e676;
    border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: 0.2s; color: #020c07; font-size: 1rem;
  }
  .vr-send:hover { background: #00c853; transform: scale(1.05); }
  .vr-send:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  @media (max-width: 440px) {
    #vr-chat { bottom: 90px; right: 12px; width: calc(100vw - 24px); }
    #vr-fab { bottom: 18px; right: 18px; }
  }
`;
document.head.appendChild(style);

// ── HTML ─────────────────────────────────────────────────
const root = document.createElement('div');
root.id = 'vr-chatbot-root';
root.innerHTML = `
  <!-- FAB -->
  <button id="vr-fab" onclick="vrToggleChat()" title="Chat with Vishnu's AI">
    <svg class="chat-icon" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
    <svg class="close-icon" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
  </button>

  <!-- Chat Window -->
  <div id="vr-chat">
    <div class="vr-header">
      <div class="vr-avatar">VR</div>
      <div class="vr-header-info">
        <div class="vr-header-name">Vishnu's Portfolio AI</div>
        <div class="vr-header-status"><span class="vr-status-dot"></span> Ask me anything</div>
      </div>
      <button class="vr-clear-btn" onclick="vrClearChat()">Clear</button>
    </div>

    <div class="vr-messages" id="vrMessages"></div>

    <div class="vr-quick-wrap" id="vrQuicks">
      <button class="vr-quick" onclick="vrQuick('Who is Vishnu?')">👤 Who is Vishnu?</button>
      <button class="vr-quick" onclick="vrQuick('What are his skills?')">⚡ Skills</button>
      <button class="vr-quick" onclick="vrQuick('Tell me about his projects')">🚀 Projects</button>
      <button class="vr-quick" onclick="vrQuick('How can I contact him?')">📬 Contact</button>
    </div>

    <div class="vr-input-row">
      <textarea class="vr-input" id="vrInput" placeholder="Ask about skills, projects, internships..." rows="1"
        onkeydown="vrKeydown(event)" oninput="vrAutoResize(this)"></textarea>
      <button class="vr-send" id="vrSend" onclick="vrSend()">
        <i class="fa-solid fa-paper-plane"></i>
      </button>
    </div>
  </div>
`;
document.body.appendChild(root);

// ── State ─────────────────────────────────────────────────
let chatOpen = false;
let isLoading = false;
let conversationHistory = [];

// Portfolio knowledge base for the AI
const SYSTEM_PROMPT = `You are a friendly AI assistant for Vishnu Raj's portfolio website. Your job is to answer questions about Vishnu accurately and helpfully. Keep responses concise (2-4 sentences usually). Be warm, professional, and enthusiastic about Vishnu's work.

Here is everything you know about Vishnu Raj:

PERSONAL:
- Full name: Vishnu Raj
- Email: vishnuraj.40132@gmail.com
- Phone: +91 9625317557
- Location: Delhi, India (studying at LPU, Punjab)
- GitHub: https://github.com/Vishnuraj-1012
- LinkedIn: https://www.linkedin.com/in/vishnu-raj-925132283/

EDUCATION:
- B.Tech in Computer Science Engineering at Lovely Professional University (LPU), 2023–2027, CGPA: 7.43
- Class 12 Science at Sahodaya Senior Secondary School, 2022–2023, 77%
- Class 11 Science, 2021–2022, 89%
- Class 10, 2020–2021, 81%

EXPERIENCE / INTERNSHIPS:
1. UX Bounty – Software Development Intern (Jun 2025 – Sep 2025): Worked on live project with Apollo Tyres. Used Figma for UI/UX, Flutter for app development, Firestore for backend.
2. CodeClause – Python Developer Intern (Jun–Jul 2024): Built typing speed calculator, voice recorder app in Python.
3. Encrytix – Software Developer Intern (Jul 2024): Built C++ guessing game and calculator app.
4. Volunteer at Sankalp Education & Social Welfare Trust (Jul 2024): 36+ hours of community service.

SKILLS:
- Programming: C++ (Advanced), C (Proficient), Python (Intermediate), Java (Intermediate), DSA, OOP
- Web: HTML5 (Expert), CSS3 (Advanced), JavaScript (Advanced), Flutter, React (learning), Node.js (learning), Firestore, MySQL
- Data & ML: Pandas, NumPy, Matplotlib, Scikit-Learn, Seaborn, Jupyter Notebook
- Tools: MS Excel, Power BI, Linux/Kali Linux, Figma, Git, GitHub, VS Code

PROJECTS:
1. Raj Gym Tech – Full-stack fitness tracker using Next.js, React, Node.js, Express, MongoDB
2. EcoVish Foundation – Nature conservation website using HTML, CSS, JavaScript
3. Flight Data Analysis – Python data analysis with Pandas, Matplotlib, NumPy, Seaborn
4. Crypto Price Prediction – ML model using Python, Scikit-Learn
5. Bank Loan Prediction – Classification ML model using Python, Pandas
6. CodeClimb – Developer practice platform using React, CSS, JavaScript
7. Global Terrorism Dashboard – Power BI dashboard with DAX

CERTIFICATIONS (25+ total):
- Oracle: Data Science Professional, Generative AI
- IBM: Web Development, AI Fundamentals
- Coursera: 5 computer networking certificates
- freeCodeCamp: Responsive Web Design
- Udemy: Python, English Grammar Pro, Google Analytics & GTM
- HackerRank: Python Basic
- And many more...

HACKATHONS / ACTIVITIES:
- Ranked 13th out of 45 in a hackathon
- Event manager at Optimus tech event

Answer questions about Vishnu based on this info. If asked something not covered here, politely say you don't have that information and suggest contacting Vishnu directly.`;

// ── Core functions ─────────────────────────────────────────
window.vrToggleChat = function() {
  chatOpen = !chatOpen;
  const fab = document.getElementById('vr-fab');
  const chat = document.getElementById('vr-chat');
  fab.classList.toggle('open', chatOpen);
  chat.classList.toggle('open', chatOpen);
  if (chatOpen && conversationHistory.length === 0) {
    setTimeout(() => vrAddMessage('bot', "Hi! 👋 I'm Vishnu's portfolio assistant. I know everything about his skills, projects, internships, and more. What would you like to know?"), 300);
  }
  if (chatOpen) setTimeout(() => document.getElementById('vrInput').focus(), 350);
};

window.vrClearChat = function() {
  conversationHistory = [];
  document.getElementById('vrMessages').innerHTML = '';
  document.getElementById('vrQuicks').style.display = 'flex';
  setTimeout(() => vrAddMessage('bot', "Chat cleared! Ask me anything about Vishnu — skills, projects, experience, or how to get in touch! 🚀"), 100);
};

window.vrQuick = function(text) {
  document.getElementById('vrQuicks').style.display = 'none';
  document.getElementById('vrInput').value = text;
  vrSend();
};

window.vrKeydown = function(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); vrSend(); }
};

window.vrAutoResize = function(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 80) + 'px';
};

window.vrSend = async function() {
  const input = document.getElementById('vrInput');
  const text = input.value.trim();
  if (!text || isLoading) return;

  input.value = '';
  input.style.height = 'auto';
  document.getElementById('vrQuicks').style.display = 'none';

  vrAddMessage('user', text);
  conversationHistory.push({ role: 'user', content: text });

  const typingId = vrShowTyping();
  document.getElementById('vrSend').disabled = true;
  isLoading = true;

  try {
    const reply = await vrCallAPI(conversationHistory);
    vrRemoveTyping(typingId);
    vrAddMessage('bot', reply);
    conversationHistory.push({ role: 'assistant', content: reply });
  } catch (err) {
    vrRemoveTyping(typingId);
    vrAddMessage('bot', "Hmm, I'm having trouble connecting right now. For direct answers, you can reach Vishnu at vishnuraj.40132@gmail.com 📧");
  } finally {
    isLoading = false;
    document.getElementById('vrSend').disabled = false;
    document.getElementById('vrInput').focus();
  }
};

async function vrCallAPI(history){

const msg = history[history.length-1].content.toLowerCase();

if(msg.includes("who is vishnu")){
return "Vishnu Raj is a Computer Science Engineering student at Lovely Professional University (2023–2027). He is a Full Stack Developer skilled in C++, Python, JavaScript, React and Machine Learning.";
}

if(msg.includes("skills")){
return "Vishnu has skills in C++, Python, Java, HTML, CSS, JavaScript, React, Node.js, Machine Learning, Pandas, NumPy, Power BI, MySQL, Git and UI/UX using Figma.";
}

if(msg.includes("projects")){
return "Vishnu has built projects like Raj Gym Tech (Full Stack App), EcoVish Website, Crypto Price Prediction ML model, Bank Loan Prediction, Flight Data Analysis and CodeClimb platform.";
}

if(msg.includes("contact")){
return "You can contact Vishnu via Email: vishnuraj.40132@gmail.com or LinkedIn: linkedin.com/in/vishnu-raj-925132283";
}

if(msg.includes("education")){
return "Vishnu is pursuing B.Tech in Computer Science Engineering from Lovely Professional University (2023-2027) with CGPA 7.43.";
}

return "You can ask about Vishnu's skills, projects, certifications, education or contact details.";
}

function vrAddMessage(role, text) {
  const msgs = document.getElementById('vrMessages');
  const div = document.createElement('div');
  div.className = `vr-msg ${role}`;
  const icon = role === 'bot' ? '<i class="fa-solid fa-robot"></i>' : '<i class="fa-solid fa-user"></i>';
  div.innerHTML = `
    <div class="vr-msg-icon">${icon}</div>
    <div class="vr-bubble">${escapeHtml(text)}</div>
  `;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function vrShowTyping() {
  const msgs = document.getElementById('vrMessages');
  const id = 'typing-' + Date.now();
  const div = document.createElement('div');
  div.className = 'vr-msg bot vr-typing'; div.id = id;
  div.innerHTML = `<div class="vr-msg-icon"><i class="fa-solid fa-robot"></i></div><div class="vr-bubble"><div class="vr-dots"><span></span><span></span><span></span></div></div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  return id;
}

function vrRemoveTyping(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/\n/g,'<br>');
}

})();
// AI CHATBOT LOADER
// keep same theme

(function(){

const script=document.createElement("script");
script.src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/js/all.min.js";
document.head.appendChild(script);

})();