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
            description: "I learned most of my knowledge of modern JavaScript from the Cisco Networking Academy's JavaScript Essentials I and II courses. The courses are very comprehensive and gave me a good understanding of how JavaScript works under the hood. I have also applied that JavaScript knowledge to making projects like this website."
        },
        "Python": {
            title: "Python",
            description: "Python is my favorite programming language, and like many people, it was my first entry to the programming world. I have done both the Cisco Python Essentials I and II courses and the Helsinki Introduction to programming MOOC (in python). At Turku AMK where I spent the first two years of my Bachelor's degree, I wrote all the Data Engineering and AI related stuff like ETL processes and model training code in Python. In my opinion it's a great language."
        },
        "HTML_CSS": {
            title: "HTML5 & CSS3 (Vanilla)",
            description: "I have a solid handle on the basics — HTML and CSS are essential for any web dev to handle, and I know my way around them well. I'm always aiming to improve my layouts and keep the code clean. The biggest thing I have recently learned about HTML and CSS is that MDN Web Docs is your best friend while developing. Turns out reading the docs does help. That piece of information can take any web developer far in their career."
        },
        "Databases": {
            title: "Databases",
            description: "I have some experience and foundational exposure to both relational and non-relational database architectures, but I don't consider myself an expert yet. I have worked briefly with PostgreSQL and MongoDB in my coursework but I have no proper projects using these technologies under my belt just yet. Given my current course schedule, projects utilizing databases will surely soon pop up in my github."
        },
        "Git": {
            title: "Git Version Control",
            description: "Git is something every developer either uses or knows the basics of. I use Git and GitHub actively and manage my version control workflow through the terminal. I learn new git commands when necessary and otherwise focus on the code."
        },
        "5_Languages": {
            title: "Fluent in 5 Languages",
            description: "I am fluent in five languages: Swedish, Finnish, and English, plus Finnish Sign Language and Swedish Sign Language. I'm not exactly sure if these specific languages will help me in my professional career, but I might as well advertise it on my website. If you are wondering how I am fluent in all of them instead of just knowing the languages a little, ask my AI on the website. Or if the AI is losing its mind you can take a sneak peek at the context file I gave to the AI in my github of this project."
        },
        "Pandas_NumPy": {
            title: "Pandas & NumPy",
            description: "I use Pandas for efficient data manipulation and cleaning, and NumPy for all kind of complex numerical computations. They were important to my previous Data Engineering and AI coursework, and a bit less important in web development but still useful to know."
        },
        "Linux": {
            title: "Linux (Personalized Development Enviroment)",
            description: "Linux is my daily driver and main development environment. I like the level of control it offers and I even run a customized Arch Linux setup exactly how I need it. It has made me comfortable with the command line and customizing system configuration, which has made me learn more about how computers actually work."
        },
        "Vim": {
            title: "Vim/Neovim (Terminal Workflow)",
            description: "I use Neovim as my code editor. At the end of the day it does not matter what code editors people use, but for me moving my workflow to the terminal has made it fun for me to code and allowed me to keep my hands on the keyboard, where they belong. It has made me code more and therefore over the long term be a better programmer."
        },
        "AI & LLM Integration": {
            title: "AI & LLM Integration",
            description: "I'm genuinely interested in the latest AI advancements and actively follow LLM development. I focus on practical integration like the dedicated terminal application I built using a lightweight, local model. This website also uses AI, but instead of a local model I am using an API. LLMs can also help with the code development workflow, but with great power comes great responsibility. Making sure that you understand the code the LLMs generate, it can be an extremely useful tool."
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
        sendChatQuery(userMessage); // Call placeholder function
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

    async function sendChatQuery(userQuery) {
        // ⚠️ The Vercel Serverless Function is automatically available at /api/chat
        const BACKEND_URL = "/api/chat"; 
        
        // We send the entire chat history to maintain conversation context (multi-turn chat)
        const payload = {
            message: userQuery,
            history: chatHistory // Contains { role: "user"|"model", text: "..." }
        };
        
        try {
            const response = await fetch(BACKEND_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            // ... rest of the try/catch block remains the same ...
            // (Ensure you remove the old placeholder response text!)
            if (!response.ok) {
                throw new Error(`AI Backend Error: ${response.statusText}`);
            }

            const data = await response.json();
            const botResponseText = data.text; // Assuming your backend returns a JSON object like: { "text": "AI response here" }

            removeTypingIndicator();
            addMessageToUI(botResponseText, 'bot');
            chatHistory.push({ role: "model", text: botResponseText });
            
        } catch (error) {
            console.error("Gemini API call failed:", error);
            removeTypingIndicator();
            addMessageToUI("Oops, Leon's AI proxy seems to be having a temporary issue. Try again later.", 'bot');
        }
    }
});
