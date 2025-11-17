
const elementMap = {
    // 1. HEADER & CONTACT
    'page-title': 'title',
    'resume-name': 'name',
    'resume-title': 'jobTitle',
    'contact-location': 'contactLocation',
    'contact-email': 'contactEmail',
    'contact-phone': 'contactPhone',
    'contact-github': 'contactGithub',

    // 2. EDUCATION SECTION
    'heading-education': 'headingEducation',
    'edu-1-title': 'edu1Title',
    'edu-1-dates': 'edu1Dates',
    'edu-1-school': 'edu1School',
    'edu-1-note': 'edu1Note',
    'edu-2-title': 'edu2Title',
    'edu-2-dates': 'edu2Dates',
    'edu-2-school': 'edu2School',

    // 3. EXPERIENCE SECTION
    'heading-experience': 'headingExperience',
    // Job 1 (Web Developer)
    'exp-1-title': 'exp1Title',
    'exp-1-company': 'exp1Company',
    'exp-1-dates': 'exp1Dates',
    'exp-1-bullet1': 'exp1Bullet1',
    'exp-1-bullet2': 'exp1Bullet2',
    'exp-1-bullet3': 'exp1Bullet3',
    // Job 2 (Electronics Production)
    'exp-2-title': 'exp2Title',
    'exp-2-company': 'exp2Company',
    'exp-2-dates': 'exp2Dates',
    'exp-2-bullet1': 'exp2Bullet1',
    'exp-2-bullet2': 'exp2Bullet2',
    // Job 3 (Restaurant Staff)
    'exp-3-title': 'exp3Title',
    'exp-3-company': 'exp3Company',
    'exp-3-dates': 'exp3Dates',
    'exp-3-bullet1': 'exp3Bullet1',
    'exp-3-bullet2': 'exp3Bullet2',

    // 4. SKILLS SECTION
    'heading-skills': 'headingSkills',
    'skill-lang-title': 'skillLangTitle',
    'skill-lang-list': 'skillLangList',
    'skill-tool-title': 'skillToolTitle',
    'skill-tool-list': 'skillToolList',
    'skill-course-title': 'skillCourseTitle',
    'skill-course-1': 'skillCourse1',
    'skill-course-2': 'skillCourse2',
    'skill-course-3': 'skillCourse3',
    'skill-course-4': 'skillCourse4',
    'skill-course-5': 'skillCourse5',
    'skill-course-6': 'skillCourse6',
    'skill-upcoming-title': 'skillUpcomingTitle',
    'skill-upcoming-text': 'skillUpcomingText',
    'skill-upcoming-1': 'skillUpcoming1',
    'skill-upcoming-2': 'skillUpcoming2',
    'skill-upcoming-3': 'skillUpcoming3',
    'skill-upcoming-4': 'skillUpcoming4',
    'skill-upcoming-5': 'skillUpcoming5',
    'skill-upcoming-6': 'skillUpcoming6',
    
    // 5. ADDITIONAL INFO SECTION
    'heading-info': 'headingInfo',
    'info-lang-title': 'infoLangTitle',
    'info-lang-text': 'infoLangText',
    'info-sport-title': 'infoSportTitle',
    'info-sport-text': 'infoSportText',
};


// Array defining the order of elements for the sequential update effect
const orderedKeys = Object.keys(elementMap);
const SEQUENTIAL_DELAY_MS = 15;

// Flag to track if the page has fully loaded. Used to disable animation on initial load.
let hasPageLoaded = false;

// --- HELPER FUNCTIONS ---

function showNotification(message) {
    const notification = document.getElementById('language-notification');
    if (!notification) return;

    notification.textContent = message;
    notification.classList.add('show');

    // Hide the notification after a set time
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2500);
}

// Function to perform the switch INSTANTLY (used on initial page load)
function instantSwitch(content) {
    orderedKeys.forEach((id) => {
        const key = elementMap[id];
        const element = document.getElementById(id);
        
        if (element && content[key] !== undefined) {
            if (id === 'page-title') {
                 document.title = content[key];
            } else {
                element.innerHTML = content[key];
            }
        }
    });
}

// Function to switch content with a cool sequential delay (used only by shortcuts)
function updateContentSequentially(content) {
    orderedKeys.forEach((id, index) => {
        const key = elementMap[id];
        const element = document.getElementById(id);
        
        if (element && content[key] !== undefined) {
            // Use setTimeout to delay each update based on its index
            setTimeout(() => {
                if (id === 'page-title') {
                     document.title = content[key];
                } else {
                    element.innerHTML = content[key];
                }
            }, SEQUENTIAL_DELAY_MS * index);
        }
    });
}

// Global function to switch language (called by URL reader and shortcuts)
function switchLanguage(lang) {
    const content = resumeContent[lang];
    if (!content) return; 

    if (!hasPageLoaded) {
        // Run instantly if called during initial DOMContentLoaded
        instantSwitch(content);
    } else {
        // Run sequential animation and notification if triggered later (by shortcut)
        const message = (lang === 'sv') 
            ? 'Språk bytt till Svenska (Alt+E)' 
            : 'Language switched to English (Alt+S)';
        showNotification(message);
        updateContentSequentially(content);
    }
}


function getInitialLanguage() {
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    return (langParam === 'sv' || langParam === 'en') ? langParam : 'en';
}


// Function to handle keyboard shortcuts (Alt+S/Alt+E)
function handleLanguageShortcut(event) {
    if (event.altKey) {
        let newLang = null;
        
        // Alt + S for Swedish
        if (event.key === 's' || event.key === 'S') {
            newLang = 'sv';
        } 
        // Alt + E for English
        else if (event.key === 'e' || event.key === 'E') {
            newLang = 'en';
        }

        if (newLang) {
            event.preventDefault(); 
            switchLanguage(newLang);
        }
    }
}
document.addEventListener('keydown', handleLanguageShortcut);


// CRITICAL INITIALIZATION BLOCK
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial Content Load (runs instantSwitch inside)
    switchLanguage(getInitialLanguage());
    
    // 2. Set flag AFTER the initial content load is complete
    // We wrap this in a timeout just long enough to ensure all instant rendering is done.
    setTimeout(() => {
        hasPageLoaded = true;
    }, 100); 
});
