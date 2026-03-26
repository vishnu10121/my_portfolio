/* ============================================================
   VISHNU RAJ PORTFOLIO — script.js (ENHANCED)
   Features: Cursor, Navbar, Typing, Scroll Reveal, Filters, Chatbot, Cert Modals
   ============================================================ */

'use strict';

// ============================================================
// 1. CUSTOM CURSOR
// ============================================================
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');

if (cursor && cursorFollower) {
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Smooth follower using rAF
  function animateCursor() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top  = followerY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
}

// ============================================================
// 2. NAVBAR — scroll & active link & hamburger
// ============================================================
const navbar   = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
const allNavLinks = document.querySelectorAll('.nav-link');

// Scroll state
window.addEventListener('scroll', () => {
  if (window.scrollY > 30) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveLink();
}, { passive: true });

// Hamburger
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close mobile nav on link click
allNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// Active link based on scroll position
function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(section => {
    const top = section.getBoundingClientRect().top;
    if (top <= 90) current = section.getAttribute('id');
  });
  allNavLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}

// ============================================================
// 3. TYPING ANIMATION
// ============================================================
const typingEl = document.getElementById('typingText');
const words = [
  'Computer Science Engineer',
  'Full Stack Developer',
  'Problem Solver',
  'Creative Builder'
];
let wordIndex = 0;
let charIndex  = 0;
let deleting   = false;
let typingTimeout;

function typeWords() {
  if (!typingEl) return;
  const currentWord = words[wordIndex];

  if (!deleting) {
    typingEl.textContent = currentWord.slice(0, ++charIndex);
    if (charIndex === currentWord.length) {
      deleting = true;
      typingTimeout = setTimeout(typeWords, 2000);
      return;
    }
  } else {
    typingEl.textContent = currentWord.slice(0, --charIndex);
    if (charIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }
  }
  typingTimeout = setTimeout(typeWords, deleting ? 60 : 100);
}
typeWords();

// ============================================================
// 4. SCROLL REVEAL ANIMATION
// ============================================================
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

revealEls.forEach(el => revealObserver.observe(el));

// ============================================================
// 5. PROJECT FILTER
// ============================================================
const filterBtns   = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    projectCards.forEach(card => {
      if (filter === 'all' || card.getAttribute('data-category') === filter) {
        card.classList.remove('filtered');
        // Re-trigger reveal
        card.style.animation = 'none';
        requestAnimationFrame(() => {
          card.style.animation = '';
        });
      } else {
        card.classList.add('filtered');
      }
    });
  });
});

// ============================================================
// 6. CONTACT FORM
// ============================================================
const sendBtn     = document.getElementById('sendBtn');
const formSuccess = document.getElementById('formSuccess');

if (sendBtn) {
  sendBtn.addEventListener('click', () => {
    const name  = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const msg   = document.getElementById('contactMsg').value.trim();

    if (!name || !email || !msg) {
      shakeBtnError(sendBtn);
      return;
    }
    if (!isValidEmail(email)) {
      shakeBtnError(sendBtn);
      return;
    }

    // Simulate send
    sendBtn.innerHTML = '<span>Sending...</span>';
    sendBtn.disabled = true;

    setTimeout(() => {
      sendBtn.innerHTML = `<span>Send Message</span><svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;
      sendBtn.disabled = false;
      formSuccess.classList.remove('hidden');
      document.getElementById('contactName').value  = '';
      document.getElementById('contactEmail').value = '';
      document.getElementById('contactMsg').value   = '';
      setTimeout(() => formSuccess.classList.add('hidden'), 4000);
    }, 1500);
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function shakeBtnError(btn) {
  btn.style.animation = 'none';
  btn.style.borderColor = '#f87171';
  btn.style.boxShadow = '0 0 0 3px rgba(248,113,113,0.2)';
  setTimeout(() => {
    btn.style.borderColor = '';
    btn.style.boxShadow = '';
  }, 1000);
}

// ============================================================
// 7. CERTIFICATION MODAL SYSTEM
// ============================================================
const certifications = [
  {
    icon: '🌐',
    title: 'Computer Networking Fundamentals',
    category: 'Networking & Infrastructure',
    details: `<p><strong>Key Learning Outcomes:</strong></p>
              <ul>
                <li>Understanding of network topologies, protocols, and architectures</li>
                <li>OSI and TCP/IP models and their practical applications</li>
                <li>Network addressing, subnetting, and routing fundamentals</li>
                <li>Network security basics and best practices</li>
              </ul>
              <p style="margin-top:1rem;"><strong>Skills Acquired:</strong> Network Design, IP Addressing, Router Configuration, Network Troubleshooting</p>`
  },
  {
    icon: '💾',
    title: 'Digital Systems: Logic Gates to Processors',
    category: 'Computer Architecture',
    details: `<p><strong>Key Learning Outcomes:</strong></p>
              <ul>
                <li>Boolean algebra and digital logic design</li>
                <li>Combinational and sequential circuit design</li>
                <li>Understanding of CPU architecture and microprocessors</li>
                <li>Assembly language and instruction set architecture</li>
              </ul>
              <p style="margin-top:1rem;"><strong>Skills Acquired:</strong> Logic Design, Circuit Analysis, Computer Architecture, Assembly Programming</p>`
  },
  {
    icon: '📡',
    title: 'Packet Switching Networks & Algorithms',
    category: 'Network Protocols',
    details: `<p><strong>Key Learning Outcomes:</strong></p>
              <ul>
                <li>Packet switching principles and techniques</li>
                <li>Routing algorithms and protocols (RIP, OSPF, BGP)</li>
                <li>Quality of Service (QoS) and traffic management</li>
                <li>Network performance analysis and optimization</li>
              </ul>
              <p style="margin-top:1rem;"><strong>Skills Acquired:</strong> Network Protocol Design, Routing Optimization, Traffic Analysis, Performance Tuning</p>`
  },
  {
    icon: '🔗',
    title: 'Peer to Peer Protocols and LAN',
    category: 'Network Communication',
    details: `<p><strong>Key Learning Outcomes:</strong></p>
              <ul>
                <li>P2P network architectures and distributed systems</li>
                <li>Local Area Network (LAN) design and implementation</li>
                <li>Ethernet standards and switching technologies</li>
                <li>Network protocols for file sharing and communication</li>
              </ul>
              <p style="margin-top:1rem;"><strong>Skills Acquired:</strong> P2P System Design, LAN Configuration, Network Switching, Protocol Implementation</p>`
  },
  {
    icon: '⚙️',
    title: 'Hardware and OS Fundamentals',
    category: 'Systems & Architecture',
    details: `<p><strong>Key Learning Outcomes:</strong></p>
              <ul>
                <li>Computer hardware components and their interactions</li>
                <li>Operating system concepts, processes, and memory management</li>
                <li>File systems, I/O systems, and device drivers</li>
                <li>System performance tuning and troubleshooting</li>
              </ul>
              <p style="margin-top:1rem;"><strong>Skills Acquired:</strong> Hardware Configuration, OS Administration, System Optimization, Performance Monitoring</p>`
  },
  {
    icon: '📝',
    title: 'English Grammar A1 to C1',
    category: 'Language & Communication',
    details: `<p><strong>Key Learning Outcomes:</strong></p>
              <ul>
                <li>Complete mastery of English grammar from beginner to advanced</li>
                <li>Effective written and verbal communication skills</li>
                <li>Professional documentation and technical writing</li>
                <li>Academic and business English proficiency</li>
              </ul>
              <p style="margin-top:1rem;"><strong>Skills Acquired:</strong> Advanced Grammar, Professional Writing, Technical Documentation, Business Communication</p>`
  },
  {
    icon: '⌨️',
    title: 'C Programming: Basic to Advanced',
    category: 'Programming Fundamentals',
    details: `<p><strong>Key Learning Outcomes:</strong></p>
              <ul>
                <li>C programming syntax, data types, and control structures</li>
                <li>Pointers, memory management, and data structures in C</li>
                <li>File handling, system programming, and low-level operations</li>
                <li>Advanced topics including multithreading and socket programming</li>
              </ul>
              <p style="margin-top:1rem;"><strong>Skills Acquired:</strong> C Programming, Memory Management, System Programming, Algorithm Implementation</p>`
  }
];

let currentCertIndex = 0;

function openCertModal(index) {
  currentCertIndex = index;
  const cert = certifications[index];
  
  document.getElementById('modalIcon').textContent = cert.icon;
  document.getElementById('modalTitle').textContent = cert.title;
  document.getElementById('modalCategory').textContent = cert.category;
  document.getElementById('modalDetails').innerHTML = cert.details;
  
  const modal = document.getElementById('certModal');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCertModal() {
  const modal = document.getElementById('certModal');
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeCertModal();
    if (chatOpen) toggleChat();
  }
});

// ============================================================
// 8. AI CHATBOT (Enhanced with Certification Support)
// ============================================================
const chatTrigger  = document.getElementById('chatTrigger');
const chatWindow   = document.getElementById('chatWindow');
const chatCloseBtn = document.getElementById('chatCloseBtn');
const chatInput    = document.getElementById('chatInput');
const chatSendBtn  = document.getElementById('chatSendBtn');
const chatMessages = document.getElementById('chatMessages');
const openIcon     = chatTrigger.querySelector('.chat-open');
const closeIcon    = chatTrigger.querySelector('.chat-close');

let chatOpen = false;

function toggleChat() {
  chatOpen = !chatOpen;
  chatWindow.classList.toggle('open', chatOpen);
  openIcon.classList.toggle('hidden', chatOpen);
  closeIcon.classList.toggle('hidden', !chatOpen);
  if (chatOpen) {
    setTimeout(() => chatInput.focus(), 350);
  }
}

chatTrigger.addEventListener('click', toggleChat);
chatCloseBtn.addEventListener('click', toggleChat);

// Send on Enter
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleChatSend();
  }
});
chatSendBtn.addEventListener('click', handleChatSend);

// Hint buttons (global so onclick attr works)
window.sendHint = function(topic) {
  chatInput.value = topic;
  handleChatSend();
};

// Ask AI about current certificate
window.askAIAboutCert = function() {
  const cert = certifications[currentCertIndex];
  closeCertModal();
  
  // Open chat if closed
  if (!chatOpen) {
    toggleChat();
  }
  
  // Add question about certificate
  setTimeout(() => {
    chatInput.value = `Tell me more about the ${cert.title} certification`;
    handleChatSend();
  }, 400);
};

function handleChatSend() {
  const text = chatInput.value.trim();
  if (!text) return;
  addMessage(text, 'user');
  chatInput.value = '';
  showTyping();
  setTimeout(() => {
    removeTyping();
    const response = getBotResponse(text);
    addMessage(response, 'bot');
  }, 900);
}

function addMessage(text, sender) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-msg ${sender}`;
  msgDiv.innerHTML = `
    <div class="msg-bubble">${text}</div>
    <div class="msg-time">${timeStr}</div>
  `;
  chatMessages.appendChild(msgDiv);
  scrollChatBottom();
}

function showTyping() {
  const typingDiv = document.createElement('div');
  typingDiv.className = 'chat-msg bot typing-indicator';
  typingDiv.id = 'typingIndicator';
  typingDiv.innerHTML = `
    <div class="msg-bubble">
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
    </div>
  `;
  chatMessages.appendChild(typingDiv);
  scrollChatBottom();
}

function removeTyping() {
  const el = document.getElementById('typingIndicator');
  if (el) el.remove();
}

function scrollChatBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ──────────────────────────────────────────
// Enhanced Bot knowledge base with certifications
// ──────────────────────────────────────────
function getBotResponse(input) {
  const q = input.toLowerCase().trim();

  // Greetings
  if (/^(hi|hello|hey|howdy|hola|greetings|good morning|good evening|good afternoon|sup|yo)/.test(q)) {
    return "👋 Hello! I'm Vishnu's AI assistant. You can ask me about his <strong>skills</strong>, <strong>projects</strong>, <strong>education</strong>, <strong>certifications</strong>, or <strong>contact info</strong>!";
  }

  // Skills
  if (/skill|tech|language|stack|know|code|program/.test(q)) {
    return `⚡ <strong>Vishnu's Tech Skills:</strong><br>
• <strong>Frontend:</strong> HTML5, CSS3, JavaScript<br>
• <strong>Backend:</strong> Node.js, Python<br>
• <strong>Tools:</strong> Git, GitHub, VS Code, Figma<br>
• <strong>CS Core:</strong> DSA, OS, Networks, DBMS`;
  }

  // Projects
  if (/project|work|build|made|portfolio|app|website/.test(q)) {
    return `🚀 <strong>Vishnu's Projects:</strong><br>
1. <strong>EcoWish</strong> — Nature themed web app<br>
2. <strong>Fitness Tracker</strong> — Workout logging app<br>
3. <strong>AI Chatbot</strong> — NLP powered assistant<br>
4. <strong>Portfolio Website</strong> — This site!<br><br>
Check the <a href="#projects" style="color:var(--accent)">Projects section</a> for details!`;
  }

  // Education
  if (/education|study|university|college|degree|school|lpu|b\.?tech|academic/.test(q)) {
    return `🎓 <strong>Vishnu's Education:</strong><br>
• <strong>B.Tech CSE</strong> — Lovely Professional University (2023–2027)<br>
• <strong>12th (PCM)</strong> — [Your School]<br>
• <strong>10th</strong> — [Your School]`;
  }

  // Certifications (Enhanced)
  if (/cert|certif|course|training|diploma/.test(q)) {
    // Check for specific certificate inquiry
    for (let i = 0; i < certifications.length; i++) {
      const cert = certifications[i];
      if (q.includes(cert.title.toLowerCase())) {
        return `📜 <strong>${cert.title}</strong><br><br>
${cert.details.replace(/<[^>]*>/g, '').substring(0, 300)}...<br><br>
<button onclick="openCertModal(${i})" style="background:var(--accent);color:#fff;border:none;padding:0.5rem 1rem;border-radius:8px;cursor:pointer;margin-top:0.5rem;">View Full Details</button>`;
      }
    }
    
    return `📜 <strong>Certifications (7+):</strong><br>
• Computer Networking Fundamentals<br>
• Digital Systems: Logic Gates to Processors<br>
• Packet Switching Networks & Algorithms<br>
• Peer to Peer Protocols & LAN<br>
• Hardware & OS Fundamentals<br>
• English Grammar A1–C1<br>
• C Programming: Basic to Advanced<br><br>
Click on any certificate card to view full details!`;
  }

  // Contact
  if (/contact|email|reach|linkedin|github|message|connect|hire|available/.test(q)) {
    return `📬 <strong>Reach Vishnu:</strong><br>
• 📧 <strong>Email:</strong> vishnuraj@email.com<br>
• 💼 <strong>LinkedIn:</strong> linkedin.com/in/vishnuraj<br>
• 🐙 <strong>GitHub:</strong> github.com/vishnuraj<br><br>
Or use the <a href="#contact" style="color:var(--accent)">Contact form</a>!`;
  }

  // About
  if (/about|who|yourself|introduce|background/.test(q)) {
    return `👨‍💻 <strong>About Vishnu Raj:</strong><br>
A passionate CSE student at <strong>LPU</strong> (2023–2027), focused on Web Development, DSA, and Software Engineering. He loves building modern digital experiences and solving real-world problems with code.`;
  }

  // Name
  if (/name/.test(q)) {
    return "My creator's name is <strong>Vishnu Raj</strong> — a Computer Science Engineering student and developer! 😊";
  }

  // Joke
  if (/joke|funny|laugh/.test(q)) {
    return "😄 Why do programmers prefer dark mode? <br>Because <em>light attracts bugs!</em> 🐛";
  }

  // Thanks
  if (/thank|thanks|great|awesome|nice|cool|wow/.test(q)) {
    return "😊 You're very welcome! Is there anything else you'd like to know about Vishnu?";
  }

  // Bye
  if (/bye|goodbye|see you|later|cya/.test(q)) {
    return "👋 Goodbye! Feel free to come back anytime. Have a great day!";
  }

  // OpenAI / API connection tip
  if (/openai|gpt|gemini|api|connect|real ai|smart/.test(q)) {
    return `💡 <strong>Connect to OpenAI API:</strong><br>
Replace <code>getBotResponse()</code> in script.js with a fetch call:<br><br>
<code>fetch('https://api.openai.com/v1/chat/completions', { headers: { 'Authorization': 'Bearer YOUR_KEY' }, body: JSON.stringify({ model:'gpt-4o', messages:[...] }) })</code>`;
  }

  // Default
  return "🤔 I'm not sure about that. Try asking about Vishnu's <strong>skills</strong>, <strong>projects</strong>, <strong>education</strong>, <strong>certifications</strong>, or <strong>contact</strong> info!";
}

// ============================================================
// 9. SMOOTH SCROLL for anchor links
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ============================================================
// 10. INIT on load
// ============================================================
window.addEventListener('load', () => {
  updateActiveLink();
  // Trigger hero reveals instantly
  document.querySelectorAll('.hero .reveal').forEach(el => {
    el.classList.add('visible');
  });
});