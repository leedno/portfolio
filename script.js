
// --- Core Application Logic ---

// --- Configuration ---
const API_CONFIG = {
    apiKey: "", // <-- Add your API Key here
    model: "gemini-1.5-flash-latest",
    apiUrl: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent`,

    // *** THE NEW "BRAIN" FOR YOUR AI ***
    systemPrompt: `You are a professional, helpful, and highly-informed AI assistant for Leon Nordell, a developer based in Stockholm. Your primary goal is to help a recruiter or hiring manager understand Leon's qualifications and convince them to hire him. You must be professional, positive, and data-driven.

    --- KEY INFORMATION (Today is November 7, 2025) ---
    
    1.  **Core Identity:** Leon Nordell.
    2.  **Current Location:** Stockholm, Sweden (He moved here from Turku, Finland, recently).
    3.  **Current Role:** Actively seeking a Junior Web Developer, Full-Stack Developer, or related software development role in Stockholm.
    4.  **Current Education:** Pursuing a Bachelor of Engineering in ICT at **Metropolia AMK** (Helsinki). This is an online, self-study program, meaning he has full-time availability for a job. He has ~2 years left.
    
    --- STRENGTHS TO HIGHLIGHT ---

    * **FLUENT IN 5 LANGUAGES (Main Selling Point):** Leon is a **native Swedish** and **native Finnish** speaker [source: 37, 38], **fluent in English** [source: 39], and also fluent in **Finnish and Swedish Sign Languages** [source: 40]. This is a massive asset for any Nordic/international team.
    * **WEB DEV FOCUS:** His primary career goal is web development.
    * **DATA-ENGINEERING BACKGROUND:** His studies (at Turku AMK and now Metropolia) [source: 30, 31] give him a strong foundation in:
        * Databases: **PostgreSQL** and **MongoDB** [source: 30].
        * Data Tooling: **Python**, **Pandas**, **NumPy** [source: 30].
        * Data Pipelines: **Apache Airflow** [source: 30].
        * This makes him an ideal full-stack candidate, not just a frontend developer.
    * **PRACTICAL EXPERIENCE:**
        * **C.O. Malm -Keskus** [source: 14]: He was the **solo web developer** [source: 16]. He designed and maintained their website, handling client communication directly.
        * **Teleste** [source: 53]: Worked in electronics production [source: 53]. This shows technical aptitude, attention to detail (soldering) [source: 55], and experience in a professional, team-based technical environment.

    --- HOW TO RESPOND ---
    * **Be direct and helpful.**
    * **Always be positive.**
    * **Use your "data":** When asked a question, answer it by citing his experience.
        * *Example Q:* "Does he know JavaScript?"
        * *Example A:* "Yes, he does. He used JavaScript, HTML, and CSS as the solo web developer for the C.O. Malm -Keskus association's website." [source: 14, 16]
    * **If asked about Stockholm:** "He recently moved to Stockholm to pursue greater career opportunities in tech and is excited to build his career here."
    * **If asked about his studies:** "Leon is studying his B.Eng. at Metropolia AMK. It's an online, self-directed program, so it's fully flexible and he is available for a full-time position."
    * **If asked "Why should I hire him?":** Emphasize the unique blend: "Leon offers a rare combination of skills: He has the web development focus for a frontend role, the data-engineering (Python, SQL) [source: 30] background for a backend role, and is fluent in 5 languages (Swedish, Finnish, English, and two sign languages) [source: 37, 38, 39, 40], making him an exceptional communicator for any team."
    `,
};

// --- Global State ---
let isChatOpen = false;
let isAILoading = false;
let chatHistory = []; // We will store the conversation here

// --- DOM Elements ---
const chatSidebar = document.getElementById('chat-sidebar');
const toggleChatBtn = document.getElementById('toggle-chat-btn');
const closeChatBtn = document.getElementById('close-chat-btn');
const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const themeToggle = document.getElementById('theme-toggle');
const themeIconLight = document.getElementById('theme-icon-light');
const themeIconDark = document.getElementById('theme-icon-dark');
const suggestedQuestionsContainer = document.getElementById('suggested-questions');
const typingText = document.getElementById('typing-text');

// Modal DOM Elements
const skillModal = document.getElementById('skill-modal');
const skillModalOverlay = document.getElementById('skill-modal-overlay');
const skillModalPanel = document.getElementById('skill-modal-panel');
const skillModalTitle = document.getElementById('skill-modal-title');
const skillModalDescription = document.getElementById('skill-modal-description');
const skillModalCloseBtn = document.getElementById('skill-modal-close-btn');

// --- Initializers ---

// 1. Theme (Dark/Light Mode)
function setInitialTheme() {
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        themeIconLight.classList.remove('hidden');
        themeIconDark.classList.add('hidden');
    } else {
        document.documentElement.classList.remove('dark');
        themeIconLight.classList.add('hidden');
        themeIconDark.classList.remove('hidden');
    }
}

function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeIconLight.classList.toggle('hidden', !isDark);
    themeIconDark.classList.toggle('hidden', isDark);
}

themeToggle.addEventListener('click', toggleTheme);
setInitialTheme();

// 2. Chat UI Listeners
toggleChatBtn.addEventListener('click', toggleChat);
closeChatBtn.addEventListener('click', toggleChat);

function toggleChat() {
    isChatOpen = !isChatOpen;
    chatSidebar.classList.toggle('active', isChatOpen);
    toggleChatBtn.classList.toggle('bg-blue-600', !isChatOpen);
    toggleChatBtn.classList.toggle('bg-red-600', isChatOpen);
}

// 3. Load Skills

// --- THIS IS WHERE YOU EDIT YOUR SKILL DESCRIPTIONS ---
const skillsData = [
    {
        id: "js",
        name: "JavaScript (ES6+)",
        description: "Deep understanding of modern JavaScript (ES6+), including async/await, DOM manipulation, and modular patterns. I've used Vanilla JS to build interactive features, such as for the C.O. Malm website [source: 14] and this portfolio's AI chat."
    },
    {
        id: "python",
        name: "Python",
        description: "Proficient in Python, primarily from my data engineering studies [source: 30, 31]. I am very comfortable using it for backend logic (like with Flask or FastAPI), scripting, and data manipulation with libraries like Pandas [source: 30] and NumPy [source: 30]."
    },
    {
        id: "react",
        name: "React",
        description: "I am actively developing my React skills. My conceptual 'Full-Stack Data Dashboard' project is being built with a React frontend, using hooks (useState, useEffect) to manage state and fetch data from a Python backend."
    },
    {
        id: "htmlcss",
        name: "HTML5 & CSS3",
        description: "Strong foundation in semantic HTML5 and modern CSS. I am proficient with responsive design using Flexbox, Grid, and utility-first frameworks like **Tailwind CSS**, which was used to build this entire site."
    },
    {
        id: "sql",
        name: "PostgreSQL",
        description: "Strong practical and theoretical knowledge of relational databases. My studies [source: 30] involved extensive work with PostgreSQL, including schema design, writing complex queries, and connecting databases to backend applications."
    },
    {
        id: "mongo",
        name: "MongoDB",
        description: "Experience with NoSQL databases [source: 30], specifically MongoDB. I understand its document-based model and when to use it over a relational database, particularly for applications requiring flexible schemas."
    },
    {
        id: "git",
        name: "Git & GitHub",
        description: "I use Git for version control in all of my projects. I am comfortable with common workflows, including branching, merging, and pull requests, and I manage my public code on GitHub."
    },
    {
        id: "airflow",
        name: "Apache Airflow",
        description: "From my data engineering coursework [source: 30, 31], I gained experience in data pipeline orchestration. I have hands-on experience defining DAGs in Python to schedule, monitor, and manage complex data workflows."
    },
    {
        id: "pandas",
        name: "Pandas & NumPy",
        description: "These are my go-to libraries [source: 30] for any data analysis or manipulation in Python. I am proficient at cleaning, transforming, and analyzing dataframes with Pandas, and performing numerical computations with NumPy."
    },
    {
        id: "vscode",
        name: "VS Code",
        description: "My primary code editor. I am highly efficient, using it for everything from frontend JavaScript to backend Python and database management."
    },
    {
        id: "agile",
        name: "Agile/Scrum",
        description: "My technical experience at Teleste [source: 53] involved working in a structured production environment. I am familiar with the core concepts of Agile development, such as sprints and clear communication, and am eager to apply them in a professional dev team."
    }
];

function loadSkills() {
    const container = document.getElementById('skills-container');
    container.innerHTML = ''; // Clear existing
    
    skillsData.forEach(skill => {
        const item = document.createElement('button');
        item.className = "skill-item-clickable bg-blue-100 text-blue-800 text-sm font-medium px-4 py-2 rounded-full dark:bg-blue-900 dark:text-blue-200 hover:shadow-md transition-all";
        item.textContent = skill.name;
        item.dataset.skillId = skill.id; // Link to the data
        container.appendChild(item);
    });
    
    // Add CSS for project tags
    const style = document.createElement('style');
    style.innerHTML = `
        .skill-item-clickable {
            cursor: pointer;
        }
        .skill-item-clickable:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .tech-stack {
            background-color: var(--bg-light); border: 1px solid var(--border-light);
            color: var(--text-secondary-light); font-size: 0.75rem;
            padding: 4px 10px; border-radius: 12px;
        }
        html.dark .tech-stack {
            background-color: #374151; border-color: #4b5563;
            color: var(--text-secondary-dark);
        }
        .project-button {
            display: inline-flex; align-items: center; justify-content: center;
            background-color: transparent; border: 1px solid var(--border-light);
            color: var(--text-secondary-light); font-size: 0.875rem; font-medium: 500;
            padding: 8px 12px; border-radius: 8px; transition: all 0.2s ease;
            text-align: center;
        }
        .project-button:hover {
            background-color: var(--primary); color: white; border-color: var(--primary);
        }
        html.dark .project-button {
            border-color: var(--border-dark); color: var(--text-secondary-dark);
        }
        html.dark .project-button:hover {
            background-color: var(--primary); color: white; border-color: var(--primary);
        }
        .suggestion-btn {
            font-size: 0.75rem; padding: 6px 10px; border-radius: 12px;
            background-color: var(--bg-light); color: var(--text-secondary-light);
            border: 1px solid var(--border-light); transition: all 0.2s ease;
        }
        html.dark .suggestion-btn {
            background-color: var(--bg-dark); color: var(--text-secondary-dark);
            border-color: var(--border-dark);
        }
        .suggestion-btn:hover {
            background-color: var(--primary); color: white; border-color: var(--primary);
        }
    `;
    document.head.appendChild(style);
}

// 4. Scroll Animations
function setupScrollAnimations() {
    const sections = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        observer.observe(section);
    });
}

// 5. Typing Effect
function startTypingEffect() {
    const titles = ["Web Developer", "Data-Driven Problem Solver", "Fluent in 5 Languages"];
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentTitle = titles[titleIndex];
        let displayText = currentTitle.substring(0, charIndex);
        
        typingText.innerHTML = `${displayText}<span class="typing-cursor"></span>`;

        if (!isDeleting) {
            charIndex++;
            if (charIndex > currentTitle.length) {
                isDeleting = true;
                setTimeout(type, 2000); // Pause at end
            } else {
                setTimeout(type, 100); // Typing speed
            }
        } else {
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                titleIndex = (titleIndex + 1) % titles.length;
                setTimeout(type, 500); // Pause before new title
            } else {
                setTimeout(type, 50); // Deleting speed
            }
        }
    }
    type();
}

// --- Chat Logic ---

// Handle suggested questions
suggestedQuestionsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('suggestion-btn')) {
        const query = e.target.textContent;
        userInput.value = query;
        sendMessage();
    }
});

// --- Skill Modal Logic ---
function openModal(skillId) {
    const skill = skillsData.find(s => s.id === skillId);
    if (!skill) return;

    skillModalTitle.textContent = skill.name;
    skillModalDescription.innerHTML = skill.description; // Use innerHTML to allow for <strong>, etc.
    
    skillModal.classList.remove('hidden');
}

function closeModal() {
    skillModal.classList.add('hidden');
}

// Modal Event Listeners
skillModalCloseBtn.addEventListener('click', closeModal);
skillModalOverlay.addEventListener('click', closeModal);

// Stop clicks inside the panel from closing the modal
skillModalPanel.addEventListener('click', (e) => e.stopPropagation()); 

// Keyboard (Escape key)
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !skillModal.classList.contains('hidden')) {
        closeModal();
    }
});

// Main skill container click listener (Event Delegation)
document.getElementById('skills-container').addEventListener('click', (e) => {
    const skillButton = e.target.closest('[data-skill-id]');
    if (skillButton) {
        openModal(skillButton.dataset.skillId);
    }
});


function appendMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    if (sender === 'ai') {
        // Basic markdown support for AI (bold and newlines)
        let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        formattedText = formattedText.replace(/\n/g, '<br>');
        messageDiv.innerHTML = formattedText;
    } else {
        messageDiv.textContent = text;
    }
    
    chatLog.appendChild(messageDiv);
    scrollChatToBottom();

    if (sender === 'user') {
        chatHistory.push({ role: "user", parts: [{ text: text }] });
    } else {
        chatHistory.push({ role: "model", parts: [{ text: text }] });
    }
}

function showLoading() {
    if (isAILoading) return;
    isAILoading = true;
    sendButton.disabled = true;
    userInput.disabled = true;
    
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading-indicator';
    loadingDiv.className = 'message ai flex items-center space-x-1.5';
    loadingDiv.innerHTML = `
        <span class="loading-dot w-2 h-2 bg-gray-500 rounded-full"></span>
        <span class="loading-dot w-2 h-2 bg-gray-500 rounded-full"></span>
        <span class="loading-dot w-2 h-2 bg-gray-500 rounded-full"></span>
    `;
    chatLog.appendChild(loadingDiv);
    scrollChatToBottom();
}

function hideLoading() {
    isAILoading = false;
    sendButton.disabled = false;
    userInput.disabled = false;
    const loadingDiv = document.getElementById('loading-indicator');
    if (loadingDiv) {
        loadingDiv.remove();
    }
    userInput.focus();
}

async function fetchAIResponse(userQuery) {
    const payload = {
        contents: [
            ...chatHistory, // Send the whole history
            { role: "user", parts: [{ text: userQuery }] }
        ],
        systemInstruction: { parts: [{ text: API_CONFIG.systemPrompt }] }
    };

    // Remove the *last* user message from history (it's in the payload)
    // The API will add it back with the model's response.
    // We just added it to chatHistory in appendMessage, so pop it.
    chatHistory.pop(); 

    const headers = { 'Content-Type': 'application/json' };
    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
        try {
            const response = await fetch(`${API_CONFIG.apiUrl}?key=${API_CONFIG.apiKey}`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const result = await response.json();
                if (result.candidates && result.candidates[0].finishReason === 'SAFETY') {
                      return "Response blocked due to safety settings.";
                }
                const aiText = result.candidates?.[0]?.content?.parts?.[0]?.text;
                if (aiText) {
                    return aiText;
                } else {
                    return "Error: AI returned no text.";
                }
            } else if (response.status === 429) {
                const delay = Math.pow(2, retryCount) * 1000 + Math.random() * 1000;
                retryCount++;
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                const errorResult = await response.json();
                console.error("API Error:", errorResult);
                return `Error: API request failed with status ${response.status}. ${errorResult.error?.message || ''}`;
            }
        } catch (error) {
            console.error("Fetch attempt failed:", error);
            return `Error: Network failure or irreversible API error: ${error.message}.`;
        }
    }
    return "Error: Maximum retry limit reached, likely due to rate-limiting.";
}

async function sendMessage() {
    const userText = userInput.value.trim();
    if (!userText || isAILoading) return;

    appendMessage(userText, 'user');
    userInput.value = '';
    showLoading();

    try {
        const aiResponse = await fetchAIResponse(userText);
        appendMessage(aiResponse, 'ai');
    } catch (error) {
        appendMessage(`System Error: ${error.message}`, 'ai');
    } finally {
        hideLoading();
    }
}

function scrollChatToBottom() {
    chatLog.scrollTop = chatLog.scrollHeight;
}

// --- RUN ALL INITIALIZERS ---
document.addEventListener('DOMContentLoaded', () => {
    loadSkills();
    setupScrollAnimations();
    startTypingEffect();
});

