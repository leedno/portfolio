document.addEventListener('DOMContentLoaded', () => {

    // ===================================================
    // 1. TYPEWRITER EFFECT LOGIC
    // ===================================================
    const typewriterElement = document.getElementById('typewriter');
    const phrases = [
        "Web Developer",
        "Full-Stack Developer",
        "Data-Driven Developer",
        "Fluent in 5 Languages"
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isTyping = true;
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const delayBetweenPhrases = 2000;

    function typeWriter() {
        if (!typewriterElement) return;

        const currentPhrase = phrases[phraseIndex];

        if (isTyping) {
            // TYPING PHASE: Adds one character
            if (charIndex < currentPhrase.length) {
                typewriterElement.textContent += currentPhrase.charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, typingSpeed);
            } else {
                // Done typing, set state to deleting
                isTyping = false;
                setTimeout(typeWriter, delayBetweenPhrases);
            }
        } else {
            // DELETING PHASE: Removes one character
            if (charIndex > 0) {
                typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                setTimeout(typeWriter, deletingSpeed);
            } else {
                // Done deleting, move to next phrase
                isTyping = true;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                setTimeout(typeWriter, typingSpeed);
            }
        }
    }
    
    if (typewriterElement) {
        typeWriter();
    }


    // ===================================================
    // 2. SKILL MODAL LOGIC
    // ===================================================
    const skillData = {
        "JavaScript": {
            title: "JavaScript (ES6+)",
            description: "My proficiency in modern JavaScript is built on formal training, including successful completion of the Cisco Networking Academy's JavaScript Essentials I and II. This foundation covers core concepts, data structures, DOM manipulation, and modern ES6+ syntax, allowing me to build all interactive and dynamic features on this site."
        },
        "Python": {
            title: "Python",
            description: "My favorite and most versatile language, leveraged for robust data engineering and automation. My expertise is built on comprehensive training from Cisco Networking Academy Python Essentials I & II, and the highly-regarded University of Helsinki's Introduction to Programming MOOC (5 ECTS). This strong foundation allows me to use key data science libraries like Pandas, NumPy, and Scikit-learn effectively for coursework involving training models and setting up complex ETL data pipelines."
        },
        "HTML_CSS": {
            title: "HTML5 & CSS3 (Vanilla)",
            description: "I have a solid handle on the basics—HTML and CSS are the essential building blocks for any website, and I know my way around them well. I'm always aiming to improve my layouts and keep the code clean. This portfolio site is a current example of me sharpening those skills with vanilla CSS."
        },
        "Databases": {
            title: "Databases",
            description: "I have a strong foundational exposure to both relational and non-relational database architectures, having worked with PostgreSQL and MongoDB during my coursework. I understand the principles of data modeling and basic query writing. Databases are currently an area of focused study for me, and I am actively working to expand my practical application skills beyond the classroom environment."
        },
        "Git": {
            title: "Git Version Control",
            description: "I use Git frequently as part of my development workflow. I'm fully proficient in all the necessary core commands for managing branches, ensuring clean commits, resolving basic merge conflicts, and moving code between local and remote repositories like GitHub. It’s the reliable tool that keeps all my project work organized."
        },
        "5_Languages": {
            title: "Fluent in 5 Languages",
            description: "Communication is one of my strongest assets. I am fluent in five languages: Swedish, Finnish, and English, plus Finnish Sign Language and Swedish Sign Language. My unique upbringing across two countries and communicating daily with my deaf parents ensures I can connect and integrate quickly into any diverse or international team. And hey, if you ever somehow need those two specific sign languages on the job, you know who to call."
        },
        "Pandas_NumPy": {
            title: "Pandas & NumPy",
            description: "Core tools in my data toolkit. Proficient in using Pandas for data manipulation and analysis, and NumPy for numerical computations."
        },
        "Linux": {
            title: "Linux (Personalized Development Enviroment)",
            description: "Linux is my daily driver and my main development environment. I enjoy the level of control it offers, having successfully set up and configured my own Arch Linux desktop exactly to my needs. This familiarity with the command line and core system configurations (including the Bash terminal) ensures I'm always comfortable managing and troubleshooting my own stack."
        },
        "Vim": {
            title: "Vim/Neovim (Optimized Terminal Workflow)",
            description: "I am highly proficient in terminal-based editing. I use Neovim as my main code editor, configured with a modern setup (like LazyVim). While customizing the environment is a bit of a hobby for me, the result is an incredibly efficient, keyboard-driven workflow that integrates nicely with my Linux setup and terminal operations."
        },
        "AI & LLM Integration": {
            title: "AI & LLM Integration",
            description: "I have a strong interest in leveraging the latest advancements in AI, and I consistently follow LLM development. My experience includes practical integration, such as building a dedicated terminal application powered by a lightweight, local model. I understand how to utilize and integrate AI technologies into projects to enhance functionality and efficiency."
        }
    };

    const modal = document.getElementById('skill-modal');
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalClose = document.getElementById('modal-close');
    const skillItems = document.querySelectorAll('.skill-item');

    // Attach click listeners to all skill tags
    skillItems.forEach(item => {
        item.addEventListener('click', () => {
            const skillKey = item.getAttribute('data-skill');
            const data = skillData[skillKey];
            if (data) {
                modalTitle.textContent = data.title;
                modalDescription.textContent = data.description;
                modal.classList.add('active'); // Show modal
            }
        });
    });

    // Function to close the modal
    function closeModal() {
        modal.classList.remove('active');
    }

    if(modalClose) modalClose.addEventListener('click', closeModal);
    if(modalOverlay) modalOverlay.addEventListener('click', (e) => {
        // Close if clicking on the dark background overlay
        if (e.target === modalOverlay) {
            closeModal();
        }
    });


    // ===================================================
    // 3. CHATBOT LOGIC (Uses placeholder for API call)
    // ===================================================
    const chatFab = document.getElementById('chat-fab');
    const chatWindow = document.getElementById('chat-window');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    
    let chatHistory = []; 

    // Toggle chat window visibility
    if(chatFab) chatFab.addEventListener('click', () => {
        chatWindow.classList.toggle('active');
    });

    // Send message on click or Enter key
    if(chatSend) chatSend.addEventListener('click', sendMessage);
    if(chatInput) chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const userMessage = chatInput.value.trim();
        if (!userMessage) return;

        addMessageToUI(userMessage, 'user');
        chatInput.value = '';

        // Add to history (for potential real API use later)
        chatHistory.push({ role: "user", text: userMessage });

        addTypingIndicator();
        callPlaceholderAPI(userMessage); // Call placeholder function
    }

    // Adds a message bubble to the chat window
    function addMessageToUI(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add(sender === 'user' ? 'message-bubble-user' : 'message-bubble-bot');
        
        messageElement.innerHTML = `<div><p>${message}</p></div>`;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll
    }

    // Shows the "Typing..." bubble
    function addTypingIndicator() {
        const indicatorElement = document.createElement('div');
        indicatorElement.classList.add('message-bubble-bot');
        indicatorElement.id = 'typing-indicator';
        indicatorElement.innerHTML = `
            <div>
                <p class="animate-pulse">Typing...</p>
            </div>
        `;
        chatMessages.appendChild(indicatorElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Removes the "Typing..." bubble
    function removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }
    
    // Placeholder function for the AI API call (to be replaced by a real backend call later)
    function callPlaceholderAPI(userQuery) {
        // Simple function to simulate network delay and bot response
        setTimeout(() => {
            removeTypingIndicator();
            const placeholderResponse = "I'm currently too busy basking in Leon's reflected glory to connect to the actual AI server. Just assume the answer is 'He's brilliant,' and move on with your life.";
            addMessageToUI(placeholderResponse, 'bot');
            chatHistory.push({ role: "model", text: placeholderResponse });
        }, 1500); 
    }
});
