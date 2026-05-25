/* ==========================================
   AETHERCHAT - INTERACTIVE ENGINE (app.js)
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // 1. STATE & CORE VARIABLES
    // ==========================================
    let chats = [];
    let activeChatId = null;
    let settings = {
        name: "Guest User",
        avatar: "👤",
        persona: "smart-helper",
        theme: "midnight-aurora"
    };

    // Default intelligent responses for mock engine based on keys
    const MOCK_INTELLIGENCE = {
        code: {
            "default": `Here is a modern, responsive layout template utilizing modern **CSS Flexbox** and **backdrop filters** to construct a sleek glass card element:

\`\`\`html
<div class="glass-card">
    <div class="card-glow"></div>
    <h3>Core Interface Pane</h3>
    <p>A modern layout pane displaying high opacity filters.</p>
    <button class="action-btn">Initialize System</button>
</div>
\`\`\`

Here is the accompanying stylesheet for the glass styling:
\`\`\`css
.glass-card {
    position: relative;
    padding: 24px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    overflow: hidden;
}
.glass-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 100%);
    pointer-events: none;
}
\`\`\``
        },
        dev: {
            "default": `Here is an exceptionally clean **asynchronous JavaScript fetch module** featuring full **retry capabilities**, exponential backoff, and state checking:

\`\`\`javascript
/**
 * Asynchronously fetch resource URL with robust exponential backoff retries.
 * @param {string} url The endpoint target.
 * @param {object} options Fetch options configurations.
 * @param {number} retries Maximum retry attempts.
 * @param {number} delay Base backoff delay in milliseconds.
 */
async function fetchWithRetry(url, options = {}, retries = 3, delay = 1000) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(\`Network response was not OK: \${response.status}\`);
        }
        return await response.json();
    } catch (error) {
        if (retries > 0) {
            console.warn(\`Fetch failed. Retrying in \${delay}ms... (\${retries} attempts left)\`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return fetchWithRetry(url, options, retries - 1, delay * 2);
        }
        throw new Error(\`Failed to fetch after multiple attempts: \${error.message}\`);
    }
}
\`\`\`

### Why use Exponential Backoff?
- **Avoids Server Flooding**: Reduces consecutive load on the backend.
- **Improved Reliability**: Resolves temporary connection drops elegantly.`
        },
        creative: {
            "default": `### Welcome to "Neon Roast Coffee" ☕🌌
*Where cybernetic design meets high-octane artisanal roasting.*

Here is a striking marketing concept framework tailored for your premium coffee lounge:

- **The core aesthetic**: High-contrast matte-charcoal brick structures, draped in glowing hot-pink neon light coordinates.
- **Interactive Hologram Menu**: Dynamic tables showing virtual steam particles floating off your custom blends.
- **The Signature Blend**: *"Darknet roast"* - An intense, triple-caffeinated cold brew infused with organic caramel syrup and finished with edible gold leaf flakes.

> *"Recharge your internal matrix, one single-origin shot at a time."*`
        },
        debug: {
            "default": `### Fixing CORS Policy Errors in Express (Node.js) 🐛🛡️

**Cross-Origin Resource Sharing (CORS)** is a browser security mechanism that blocks code from making HTTP requests to a different domain than the one that served the initial page.

To resolve this issue cleanly, implement the official \`cors\` middleware package:

1. **Install package**:
\`\`\`bash
npm install cors
\`\`\`

2. **Integrate into Express instance**:
\`\`\`javascript
const express = require('express');
const cors = require('cors');
const app = express();

// Allow all origins (Development only)
app.use(cors());

// OR: Production configuration with restrictions
const corsOptions = {
    origin: 'https://yourdomain.github.io',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
\`\`\`

*Make sure your middleware loads **before** defining route paths!*`
        }
    };

    // ==========================================
    // 2. DOM ELEMENTS SELECTIONS
    // ==========================================
    const sidebar = document.getElementById("sidebar");
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const mobileCloseBtn = document.getElementById("mobile-close-btn");
    const modalBackdrop = document.getElementById("modal-backdrop");
    
    // Inputs & Forms
    const chatForm = document.getElementById("chat-input-form");
    const messageInput = document.getElementById("message-input");
    const messagesContainer = document.getElementById("chat-messages-container");
    const messagesList = document.getElementById("messages-list");
    const welcomeContainer = document.getElementById("welcome-container");
    const typingIndicator = document.getElementById("typing-indicator");
    
    // Action Buttons
    const newChatBtn = document.getElementById("new-chat-btn");
    const clearChatBtn = document.getElementById("clear-chat-btn");
    const settingsTriggerBtn = document.getElementById("settings-trigger-btn");
    const activeChatTitle = document.getElementById("active-chat-title");
    const activePersonaText = document.getElementById("active-persona-text");
    
    // Settings Modal Items
    const settingsModal = document.getElementById("settings-modal");
    const modalCloseBtn = document.getElementById("modal-close-btn");
    const settingsCancelBtn = document.getElementById("settings-cancel-btn");
    const settingsSaveBtn = document.getElementById("settings-save-btn");
    
    const profileNameInput = document.getElementById("profile-name-input");
    const userNameDisplay = document.getElementById("user-name-display");
    const userAvatarDisplay = document.getElementById("user-avatar-display");
    
    const chatList = document.getElementById("chat-list");
    
    // Theme Selectors
    const themeQuickBtns = document.querySelectorAll(".theme-quick-btn");
    const themeRowItems = document.querySelectorAll(".theme-row-item");
    const avatarOpts = document.querySelectorAll(".avatar-opt");
    const personaCards = document.querySelectorAll(".persona-option-card");
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    // ==========================================
    // 3. CORE STATE INITIALIZATION & LOGIC
    // ==========================================
    
    function init() {
        // Load configurations from Local Storage
        const savedSettings = localStorage.getItem("aether_settings");
        if (savedSettings) {
            settings = JSON.parse(savedSettings);
        }
        
        const savedChats = localStorage.getItem("aether_chats");
        if (savedChats) {
            chats = JSON.parse(savedChats);
        }
        
        const savedActiveChatId = localStorage.getItem("aether_active_chat");
        if (savedActiveChatId) {
            activeChatId = savedActiveChatId;
        }

        // Setup theme
        applyTheme(settings.theme);
        
        // Render current Profile Display
        updateProfileDisplay();
        
        // Render chat history
        renderChatList();
        
        // Select active chat session or display default welcome UI
        if (activeChatId && chats.some(c => c.id === activeChatId)) {
            loadChat(activeChatId);
        } else {
            showWelcomeScreen();
        }
    }

    // Apply selected global theme to HTML element
    function applyTheme(themeId) {
        document.documentElement.setAttribute("data-theme", themeId);
        settings.theme = themeId;
        saveSettingsToStorage();
        
        // Synchronize settings theme radio checks
        themeRowItems.forEach(item => {
            if (item.getAttribute("data-theme-id") === themeId) {
                item.classList.add("active");
            } else {
                item.classList.remove("active");
            }
        });
        
        // Synchronize header quick-pick outline indicators
        themeQuickBtns.forEach(btn => {
            if (btn.getAttribute("data-theme-id") === themeId) {
                btn.style.boxShadow = "0 0 0 2px var(--accent-glow), 0 0 0 4px var(--accent)";
            } else {
                btn.style.boxShadow = "none";
            }
        });
    }

    // Save configurations
    function saveSettingsToStorage() {
        localStorage.setItem("aether_settings", JSON.stringify(settings));
    }
    
    function saveChatsToStorage() {
        localStorage.setItem("aether_chats", JSON.stringify(chats));
    }

    function updateProfileDisplay() {
        userNameDisplay.textContent = settings.name;
        userAvatarDisplay.textContent = settings.avatar;
        
        // Sync inside modal options
        profileNameInput.value = settings.name;
        
        avatarOpts.forEach(opt => {
            if (opt.getAttribute("data-avatar") === settings.avatar) {
                opt.classList.add("active");
            } else {
                opt.classList.remove("active");
            }
        });

        // Set active persona badge text
        const personaLabels = {
            "smart-helper": "Smart Helper",
            "coding-expert": "Coding Expert",
            "creative-writer": "Creative Writer",
            "zen-master": "Zen Master"
        };
        activePersonaText.textContent = personaLabels[settings.persona] || "Smart Assistant";
        
        // Set checked persona card
        personaCards.forEach(card => {
            if (card.getAttribute("data-persona") === settings.persona) {
                card.classList.add("active");
            } else {
                card.classList.remove("active");
            }
        });
    }

    // ==========================================
    // 4. SIDEBAR CHAT HISTORY MANAGEMENT
    // ==========================================
    
    function createNewChat() {
        const id = "chat_" + Date.now();
        const newChat = {
            id: id,
            title: "New Conversation",
            messages: [],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        chats.unshift(newChat);
        activeChatId = id;
        
        saveChatsToStorage();
        localStorage.setItem("aether_active_chat", id);
        
        renderChatList();
        loadChat(id);
        
        // Mobile layout: close sidebar automatically
        sidebar.classList.remove("open");
        modalBackdrop.style.display = "none";
    }

    function loadChat(chatId) {
        activeChatId = chatId;
        localStorage.setItem("aether_active_chat", chatId);
        
        // Set active status on sidebar items
        const chatItems = chatList.querySelectorAll(".chat-item");
        chatItems.forEach(item => {
            if (item.getAttribute("data-chat-id") === chatId) {
                item.classList.add("active");
            } else {
                item.classList.remove("active");
            }
        });
        
        const chat = chats.find(c => c.id === chatId);
        if (!chat) return;
        
        activeChatTitle.textContent = chat.title;
        
        // Clear message bubble interface
        messagesList.innerHTML = "";
        
        if (chat.messages.length === 0) {
            showWelcomeScreen();
        } else {
            welcomeContainer.style.display = "none";
            chat.messages.forEach(msg => {
                renderMessageBubble(msg.sender, msg.text, msg.timestamp);
            });
            scrollToBottom();
        }
    }

    function deleteChat(chatId, event) {
        event.stopPropagation(); // Avoid loading the chat we just requested to delete
        
        chats = chats.filter(c => c.id !== chatId);
        saveChatsToStorage();
        
        renderChatList();
        
        // Adjust active screen if deleted active item
        if (activeChatId === chatId) {
            if (chats.length > 0) {
                loadChat(chats[0].id);
            } else {
                activeChatId = null;
                localStorage.removeItem("aether_active_chat");
                showWelcomeScreen();
                activeChatTitle.textContent = "New Conversation";
            }
        }
    }

    function renderChatList() {
        chatList.innerHTML = "";
        
        if (chats.length === 0) {
            chatList.innerHTML = `
                <div style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 13px;">
                    No recent chats. Click 'New Chat' to begin.
                </div>
            `;
            return;
        }
        
        chats.forEach(chat => {
            const chatItem = document.createElement("button");
            chatItem.className = `chat-item ${chat.id === activeChatId ? 'active' : ''}`;
            chatItem.setAttribute("data-chat-id", chat.id);
            
            chatItem.innerHTML = `
                <ion-icon name="chatbubble-ellipses-outline"></ion-icon>
                <span class="chat-item-title">${escapeHTML(chat.title)}</span>
                <div class="chat-item-actions">
                    <button class="action-btn-mini delete-btn" title="Delete chat">
                        <ion-icon name="trash-outline"></ion-icon>
                    </button>
                </div>
            `;
            
            chatItem.addEventListener("click", () => loadChat(chat.id));
            
            const delBtn = chatItem.querySelector(".delete-btn");
            delBtn.addEventListener("click", (e) => deleteChat(chat.id, e));
            
            chatList.appendChild(chatItem);
        });
    }

    function showWelcomeScreen() {
        welcomeContainer.style.display = "flex";
        messagesList.innerHTML = "";
    }

    // ==========================================
    // 5. MESSAGING & LIGHTWEIGHT MARKDOWN ENGINE
    // ==========================================
    
    // Markdown Parser
    function parseMarkdown(text) {
        // Clean safety encode
        let html = escapeHTML(text);
        
        // 1. Fenced Code Blocks: ```javascript ... ```
        const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
        html = html.replace(codeBlockRegex, (match, lang, code) => {
            const cleanLang = lang.trim() || "text";
            const highlightedCode = highlightCodeMock(code.trim(), cleanLang);
            const containerId = "code_" + Math.random().toString(36).substr(2, 9);
            
            return `
                <div class="code-block-container" id="${containerId}">
                    <div class="code-block-header">
                        <span class="code-lang-label">${cleanLang}</span>
                        <button class="code-copy-btn" onclick="copyCodeSnippet('${containerId}')">
                            <ion-icon name="copy-outline"></ion-icon>
                            <span>Copy</span>
                        </button>
                    </div>
                    <pre><code class="language-${cleanLang}">${highlightedCode}</code></pre>
                </div>
            `;
        });
        
        // 2. Inline Code: `console.log()`
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // 3. Bold: **text**
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        
        // 4. Italic: *text*
        html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        
        // 5. Unordered List Items: - text or * text
        html = html.replace(/^(?:-|\*)\s+(.+)$/gm, '<li>$1</li>');
        // Wrap adjacent list elements into <ul> containers
        html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
        
        // Clean double-nested lists if any
        html = html.replace(/<\/ul>\s*<ul>/g, '');
        
        // 6. Blockquotes: > text
        html = html.replace(/^&gt;\s+(.+)$/gm, '<blockquote>$1</blockquote>');
        
        // Replace single newlines (not within HTML tags) with linebreaks
        html = html.replace(/\n(?!<\/?(ul|li|pre|code|div|blockquote))/g, '<br>');
        
        return html;
    }

    // Mock code syntaxes highlight for rich coding feel
    function highlightCodeMock(code, lang) {
        const keywords = /\b(const|let|var|function|return|async|await|try|catch|throw|if|else|for|while|class|import|export|from|new|default)\b/g;
        const strings = /(["'`])(.*?)\1/g;
        const numbers = /\b(\d+)\b/g;
        const comments = /(\/\/.*|\/\*[\s\S]*?\*\/)/g;
        
        let output = code;
        
        if (lang === "js" || lang === "javascript" || lang === "typescript" || lang === "html" || lang === "css") {
            // Strings
            output = output.replace(strings, '<span class="hljs-string">$&</span>');
            // Keywords (be mindful not to match inside tags)
            output = output.replace(keywords, (match) => `<span class="hljs-keyword">${match}</span>`);
            // Numbers
            output = output.replace(numbers, '<span class="hljs-number">$&</span>');
            // Comments
            output = output.replace(comments, '<span class="hljs-comment">$&</span>');
        }
        
        return output;
    }

    // Global copy code utility
    window.copyCodeSnippet = function(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const codeElement = container.querySelector("code");
        const copyBtn = container.querySelector(".code-copy-btn");
        
        // Get non-html text content
        const textToCopy = codeElement.textContent || codeElement.innerText;
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            const btnSpan = copyBtn.querySelector("span");
            const btnIcon = copyBtn.querySelector("ion-icon");
            
            btnSpan.textContent = "Copied!";
            btnIcon.setAttribute("name", "checkmark-outline");
            copyBtn.style.color = "#34d399";
            
            setTimeout(() => {
                btnSpan.textContent = "Copy";
                btnIcon.setAttribute("name", "copy-outline");
                copyBtn.style.color = "";
            }, 2000);
        }).catch(err => {
            console.error("Could not copy code snippet: ", err);
        });
    };

    function escapeHTML(str) {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function renderMessageBubble(sender, text, timestamp) {
        const wrapper = document.createElement("div");
        wrapper.className = `message-bubble-wrapper ${sender === 'user' ? 'user-msg' : 'bot-msg'}`;
        
        const avatar = sender === 'user' ? settings.avatar : "🤖";
        const formattedText = sender === 'user' ? escapeHTML(text) : parseMarkdown(text);
        
        wrapper.innerHTML = `
            <div class="avatar-bubble">${avatar}</div>
            <div class="bubble-main">
                <div class="message-bubble">${formattedText}</div>
                <span class="message-time">${timestamp}</span>
            </div>
        `;
        
        messagesList.appendChild(wrapper);
    }

    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // ==========================================
    // 6. RESPONSE SIMULATOR ENGINE (AI STREAMING EFFECT)
    // ==========================================
    
    function generateSmartResponse(userQuery) {
        const query = userQuery.toLowerCase().trim();
        let matchedTopic = null;
        
        if (query.includes("css") || query.includes("style") || query.includes("layout") || query.includes("glassmorphic") || query.includes("glassmorphism")) {
            matchedTopic = "code";
        } else if (query.includes("javascript") || query.includes("js") || query.includes("fetch") || query.includes("async") || query.includes("retry")) {
            matchedTopic = "dev";
        } else if (query.includes("marketing") || query.includes("coffee") || query.includes("creative") || query.includes("concept")) {
            matchedTopic = "creative";
        } else if (query.includes("cors") || query.includes("express") || query.includes("origin") || query.includes("fix") || query.includes("bug")) {
            matchedTopic = "debug";
        }
        
        // Personality-specific response mapping wrapper
        if (matchedTopic) {
            const textResponse = MOCK_INTELLIGENCE[matchedTopic].default;
            return applyPersonaModifications(textResponse);
        }
        
        // Conversational default response structures depending on persona
        const fallbackOptions = {
            "smart-helper": [
                `I appreciate your query! As your **Smart Helper**, I've analyzed your thoughts. 

Could you provide some more details? Here's how I can help:
- **Write code templates** (HTML/CSS/JS)
- **Draft documents** or concepts
- **Debug errors** in scripts

Let's start collaborating!`,
                `That's a fascinating subject! Let me know what specific requirements you have, and I will draft a full layout or structural response for you.`
            ],
            "coding-expert": [
                `Executing query analysis. As your **Coding Expert**, I am primed to build robust solutions.

For a full script, please specify:
1. **Target environment** (Node.js, Browser, React, etc.)
2. **Performance restrictions** (asynchronous, synchronous, memory constraints)
3. **Data inputs/outputs**

Let me know if you would like me to draft a component structure!`,
                `Code review completed. Let me know what syntax problem you are facing, and I will write a custom optimized algorithm to resolve it.`
            ],
            "creative-writer": [
                `Ah, a wonderful canvas to explore! 🎨🌌 As your **Creative Writer**, let's paint this concept with rich words.

Imagine a space where ideas aren't just thoughts, but *vibrant neon sparks* floating across a dark terminal workspace... 

What details shall we weave into our next description card? Tell me your thoughts!`,
                `That sounds like a magical adventure. Let's expand this story or write some beautiful messaging copy together!`
            ],
            "zen-master": [
                `A quiet mind yields robust answers. 🍃

Focus your question on the core outcome you seek. I will assist in minimal, precise terms.`,
                `Speak freely. Simplicity is the ultimate sophistication.`
            ]
        };
        
        const list = fallbackOptions[settings.persona] || fallbackOptions["smart-helper"];
        const randomIndex = Math.floor(Math.random() * list.length);
        return list[randomIndex];
    }

    function applyPersonaModifications(text) {
        // Adapt standard mock messages to fit the active assistant's tone
        if (settings.persona === "zen-master") {
            return `### Zen Mode Enabled 🍃\n*A simplified, concise extract from the database:*\n\n` + text.split("###")[0] + `\n\n*(Focus on essential variables for maximum clarity.)*`;
        }
        if (settings.persona === "creative-writer") {
            return `✨🔮 **A Wonderful Creation Awaits!** 🔮✨\n\n` + text + `\n\n*Created with colorful imagination and digital sparks!*`;
        }
        if (settings.persona === "coding-expert") {
            return `⚡ **[SYSTEM RESPONSE: EXECUTING SCRIPT BLOCKS]** ⚡\n\n` + text + `\n\n*Performance variables successfully optimized for current viewport standard.*`;
        }
        return text;
    }

    function handleOutgoingMessage(userText) {
        if (!userText.trim()) return;
        
        // Hide welcome overlay on first message
        welcomeContainer.style.display = "none";
        
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const userMsg = {
            sender: "user",
            text: userText,
            timestamp: timestamp
        };
        
        // 1. Create a chat session if none exists
        if (!activeChatId) {
            createNewChat();
        }
        
        const chat = chats.find(c => c.id === activeChatId);
        if (!chat) return;
        
        // 2. Append message to state and render
        chat.messages.push(userMsg);
        
        // Auto-rename chat if it is named 'New Conversation'
        if (chat.title === "New Conversation") {
            const firstWords = userText.split(" ").slice(0, 4).join(" ");
            chat.title = firstWords + (userText.split(" ").length > 4 ? "..." : "");
            renderChatList();
            activeChatTitle.textContent = chat.title;
        }
        
        renderMessageBubble("user", userText, timestamp);
        scrollToBottom();
        
        // 3. Clear message inputs
        messageInput.value = "";
        messageInput.style.height = "auto"; // Reset height
        
        // 4. Trigger Assistant reply with typing indicator
        showTypingIndicator();
        
        const responseText = generateSmartResponse(userText);
        
        setTimeout(() => {
            hideTypingIndicator();
            
            const botTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const botMsg = {
                sender: "assistant",
                text: responseText,
                timestamp: botTimestamp
            };
            
            chat.messages.push(botMsg);
            saveChatsToStorage();
            
            // Render bot message with a typewriter effect
            streamBotMessage(responseText, botTimestamp);
        }, 1200 + Math.random() * 800); // Realistic typing delay
    }

    function showTypingIndicator() {
        typingIndicator.style.display = "flex";
        scrollToBottom();
    }
    
    function hideTypingIndicator() {
        typingIndicator.style.display = "none";
    }

    // Typewriter effect for AI answers
    function streamBotMessage(fullText, timestamp) {
        const wrapper = document.createElement("div");
        wrapper.className = "message-bubble-wrapper bot-msg";
        
        wrapper.innerHTML = `
            <div class="avatar-bubble">🤖</div>
            <div class="bubble-main">
                <div class="message-bubble"></div>
                <span class="message-time">${timestamp}</span>
            </div>
        `;
        
        messagesList.appendChild(wrapper);
        const bubble = wrapper.querySelector(".message-bubble");
        
        let i = 0;
        const speed = 6; // Characters per interval tick (faster than single char for long code blocks)
        
        // Smooth autoscroll intervals
        const timer = setInterval(() => {
            if (i < fullText.length) {
                const sliceText = fullText.slice(0, i + speed);
                bubble.innerHTML = parseMarkdown(sliceText);
                i += speed;
                scrollToBottom();
            } else {
                bubble.innerHTML = parseMarkdown(fullText); // Secure exact full render
                clearInterval(timer);
                scrollToBottom();
            }
        }, 15);
    }

    // ==========================================
    // 7. EVENT LISTENERS & MODAL BINDINGS
    // ==========================================
    
    // Suggestion Cards on Welcome Page
    document.querySelectorAll(".prompt-card").forEach(card => {
        card.addEventListener("click", () => {
            const promptText = card.getAttribute("data-prompt");
            handleOutgoingMessage(promptText);
        });
    });

    // Handle Form Submissions
    chatForm.addEventListener("submit", (e) => {
        e.preventDefault();
        handleOutgoingMessage(messageInput.value);
    });

    // Auto-grow Textarea rows based on line-breaks
    messageInput.addEventListener("input", () => {
        messageInput.style.height = "auto";
        messageInput.style.height = (messageInput.scrollHeight - 6) + "px";
    });

    // Enter sends message, Shift+Enter breaks line
    messageInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            chatForm.dispatchEvent(new Event("submit"));
        }
    });

    // Action buttons inside main layout
    newChatBtn.addEventListener("click", createNewChat);
    
    clearChatBtn.addEventListener("click", () => {
        if (!activeChatId) return;
        
        const chat = chats.find(c => c.id === activeChatId);
        if (chat && confirm("Are you sure you want to clear this conversation's messages?")) {
            chat.messages = [];
            saveChatsToStorage();
            showWelcomeScreen();
        }
    });

    // Navigation and Mobile Drawer controls
    mobileMenuBtn.addEventListener("click", () => {
        sidebar.classList.add("open");
        modalBackdrop.style.display = "block";
    });

    const closeSidebar = () => {
        sidebar.classList.remove("open");
        if (settingsModal.style.display !== "flex") {
            modalBackdrop.style.display = "none";
        }
    };
    
    mobileCloseBtn.addEventListener("click", closeSidebar);
    modalBackdrop.addEventListener("click", () => {
        closeSidebar();
        closeSettingsModal();
    });

    // ==========================================
    // 8. SETTINGS MODAL INTERACTIVITY
    // ==========================================
    
    function openSettingsModal() {
        // Load active values into fields
        profileNameInput.value = settings.name;
        
        avatarOpts.forEach(opt => {
            if (opt.getAttribute("data-avatar") === settings.avatar) {
                opt.classList.add("active");
            } else {
                opt.classList.remove("active");
            }
        });
        
        personaCards.forEach(card => {
            if (card.getAttribute("data-persona") === settings.persona) {
                card.classList.add("active");
            } else {
                card.classList.remove("active");
            }
        });

        themeRowItems.forEach(item => {
            if (item.getAttribute("data-theme-id") === settings.theme) {
                item.classList.add("active");
            } else {
                item.classList.remove("active");
            }
        });

        // Set first tab as active
        tabBtns.forEach(btn => btn.classList.remove("active"));
        tabContents.forEach(content => content.classList.remove("active"));
        
        tabBtns[0].classList.add("active");
        tabContents[0].classList.add("active");

        settingsModal.style.display = "flex";
        settingsModal.offsetHeight; // force reflow
        settingsModal.classList.add("open");
        modalBackdrop.style.display = "block";
    }

    function closeSettingsModal() {
        settingsModal.classList.remove("open");
        setTimeout(() => {
            settingsModal.style.display = "none";
            if (!sidebar.classList.contains("open")) {
                modalBackdrop.style.display = "none";
            }
        }, 300); // matches CSS transitions duration
    }

    settingsTriggerBtn.addEventListener("click", openSettingsModal);
    modalCloseBtn.addEventListener("click", closeSettingsModal);
    settingsCancelBtn.addEventListener("click", closeSettingsModal);

    // Save configurations
    settingsSaveBtn.addEventListener("click", () => {
        const nameVal = profileNameInput.value.trim();
        if (nameVal) {
            settings.name = nameVal;
        }

        // Active Avatar Element
        const activeAvatarOpt = document.querySelector(".avatar-opt.active");
        if (activeAvatarOpt) {
            settings.avatar = activeAvatarOpt.getAttribute("data-avatar");
        }

        // Active Assistant Persona Element
        const activePersonaCard = document.querySelector(".persona-option-card.active");
        if (activePersonaCard) {
            settings.persona = activePersonaCard.getAttribute("data-persona");
        }

        // Active Theme Element
        const activeThemeRow = document.querySelector(".theme-row-item.active");
        if (activeThemeRow) {
            const themeId = activeThemeRow.getAttribute("data-theme-id");
            applyTheme(themeId);
        }

        saveSettingsToStorage();
        updateProfileDisplay();
        
        // Re-load the active chat bubble to update user avatar icon immediately
        if (activeChatId) {
            loadChat(activeChatId);
        }

        closeSettingsModal();
    });

    // Tab Switching inside settings modal
    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const tabId = btn.getAttribute("data-tab");
            
            tabBtns.forEach(b => b.classList.remove("active"));
            tabContents.forEach(c => c.classList.remove("active"));
            
            btn.classList.add("active");
            document.getElementById(tabId).classList.add("active");
        });
    });

    // Settings Profile Avatar quick selections
    avatarOpts.forEach(opt => {
        opt.addEventListener("click", () => {
            avatarOpts.forEach(o => o.classList.remove("active"));
            opt.classList.add("active");
        });
    });

    // Settings Persona selection highlights
    personaCards.forEach(card => {
        card.addEventListener("click", () => {
            personaCards.forEach(c => c.classList.remove("active"));
            card.classList.add("active");
        });
    });

    // Settings Theme list selections
    themeRowItems.forEach(item => {
        item.addEventListener("click", () => {
            themeRowItems.forEach(i => i.classList.remove("active"));
            item.classList.add("active");
        });
    });

    // Main header quick theme selector buttons
    themeQuickBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const themeId = btn.getAttribute("data-theme-id");
            applyTheme(themeId);
        });
    });

    // ==========================================
    // 9. APP INITIALIZATION TRIGGER
    // ==========================================
    init();
});
