# Leon Nordell's Personal Portfolio & Technical Resume

## Overview

This repository hosts the source code for my personal portfolio website and technical resume. The project is designed not only as a static showcase of my work but also as an interactive demonstration of my development capabilities, including a custom, Gemini-powered AI assistant.

The primary goal is to provide recruiters, hiring managers, and collaborators with a quick, detailed, and engaging look at my background, skills, and projects.

## 🚀 Live Demo & Navigation

| Component | URL | Note |
| :--- | :--- | :--- |
| **Live Portfolio** | https://leon-nordell.vercel.app | Replace with your Vercel URL |
| **Full Resume** | https://leon-nordell.vercel.app/resume.html | Direct link to the single-page resume |
| **GitHub** | https://github.com/leedno | My GitHub Profile |
| **LinkedIn** | https://www.linkedin.com/in/leon-nordell/ | My LinkedIn Profile |

---

## ✨ Key Features & Technical Highlights

This portfolio is built to demonstrate specific technical competence, particularly in system integration and front-end development.

| Feature | Technical Implementation | Value Proposition |
| :--- | :--- | :--- |
| **AI Assistant (GenAI)** | Custom **Gemini-2.5-Flash-Lite** assistant deployed via a Vercel Serverless Function (`/api/chat.js`). | Provides instantaneous, personalized answers about my experience (RAG-powered). |
| **RAG Context Engine** | The AI assistant is augmented with a comprehensive **`leon_bio.txt`** file, serving as its contextual data source to ensure factual accuracy. | Demonstrates experience with RAG, system instructions, and leveraging large language models (LLMs) in a practical application. |
| **Interactive Skill Modals** | Uses pure **Vanilla JavaScript** to dynamically manage the DOM, listen for events, and display custom content for each skill tag. | Showcases foundational front-end proficiency (HTML/CSS/JS) without relying on frameworks. |
| **Print-Optimized Resume** | The `resume.html` page uses minimal CSS for a clean, professional, and print-ready layout. | Ensures a seamless transition from web page to PDF for quick sharing or application. |

## 🛠️ Tech Stack

This project leverages a hybrid front-end and serverless backend architecture.

**Front-End:**
* **HTML5**
* **CSS3** (Vanilla/Custom Stylesheet for unique design)
* **Vanilla JavaScript** (For Typewriter, Skill Modals, and Chat UI)

**Back-End (Serverless):**
* **Node.js** (Vercel Serverless Function)
* **@google/genai** SDK (Core dependency for AI chat)
* **Vercel** (Hosting & Serverless deployment)

## 🧑‍💻 Local Development

To set up and run this project locally for testing the front-end components:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/leedno/portfolio.git](https://github.com/leedno/portfolio.git)
    cd portfolio
    ```

2.  **Run the front-end:**
    Since the portfolio is a static site (HTML, CSS, JS), you can open `index.html` directly in your browser.

3.  **Run the Serverless Backend (Optional):**
    If you wish to test the Gemini AI assistant locally, you would need to:
    * Install Node.js dependencies: `npm install`
    * Set up your environment variable: `export GEMINI_API_KEY="YOUR_API_KEY"`
    * Run the serverless functions locally (e.g., using Vercel CLI or a development framework like Next.js/Express if adapting for a local server setup).

The Vercel Serverless function (`/api/chat`) requires a live Vercel deployment to be fully operational for the AI assistant feature.
