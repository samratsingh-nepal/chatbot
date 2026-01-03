// DOM Elements
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const quickReplies = document.getElementById('quick-replies');
const countryInfoContent = document.getElementById('country-info-content');
const topicInfoContent = document.getElementById('topic-info-content');
const selectedCountryBadge = document.getElementById('selected-country-badge');
const typingIndicator = document.getElementById('typing-indicator');
const destinationItems = document.querySelectorAll('.destination-item');
const quickButtons = document.querySelectorAll('.quick-btn');
const leftToggle = document.getElementById('left-toggle');
const rightToggle = document.getElementById('right-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const mobileOverlay = document.getElementById('mobile-overlay');
const emojiPicker = document.getElementById('emoji-picker');
const emojiBtn = document.getElementById('emoji-btn');
const closeEmoji = document.getElementById('close-emoji');
const bookConsultationBtn = document.getElementById('book-consultation-btn');

// Knowledge Base
const knowledgeBase = {
    countries: {
        canada: {
            name: "Canada",
            flag: "🇨🇦",
            color: "#dc2626",
            info: {
                admissions: "2026 Intake: IELTS 6.5 overall (no band below 6.0) or PTE 58+. Deadlines: Jan-Mar 2026 for September intake. SDS Stream requires upfront tuition payment & GIC of CAD 20,635.",
                scholarships: "Lester B. Pearson Scholarship (full tuition at UofT), Vanier Canada Graduate Scholarships (CAD 50,000/year), University Entrance Awards for 3.5+ GPA.",
                visa: "Student Direct Stream (SDS): GIC CAD 20,635, medical exam, NOC from MoEST required. Processing: 20-45 days.",
                noc: "NOC from MoEST mandatory for all Nepali students. Process: 7-10 working days, NPR 2,000 fee.",
                deadlines: "Fall 2026: Most deadlines Jan-Mar 2026. Winter 2027: Aug-Oct 2026."
            }
        },
        australia: {
            name: "Australia",
            flag: "🇦🇺",
            color: "#1d4ed8",
            info: {
                admissions: "Genuine Student (GS) requirement crucial for 2026. IELTS 6.0 for UG, 6.5 for PG (no band below 5.5). Popular: IT at UTS, Nursing at UQ, Business at Monash.",
                scholarships: "Australia Awards Scholarships, Destination Australia, University-specific scholarships for high achievers.",
                visa: "Student Visa (Subclass 500): Bank balance NPR 45-55 Lakhs, Overseas Student Health Cover (OSHC) mandatory. Genuine Temporary Entrant (GTE) critical.",
                noc: "NOC from MoEST required before visa application. Must show funds in A-class banks.",
                deadlines: "Semester 1 2026: Oct-Dec 2025. Semester 2 2026: Apr-Jun 2026."
            }
        },
        usa: {
            name: "United States",
            flag: "🇺🇸",
            color: "#3b82f6",
            info: {
                admissions: "GRE/GMAT required for most graduate programs. TOEFL 80+ or IELTS 6.5+. Strong SOP and letters of recommendation important.",
                scholarships: "Fulbright Program, University scholarships, Teaching/Research Assistantships for graduate students.",
                visa: "F1 Student Visa: SEVIS fee, financial proof for 1+ year, interview at US Embassy.",
                deadlines: "Fall 2026: Dec 2025 - Feb 2026. Spring 2027: Jul-Sep 2026."
            }
        },
        uk: {
            name: "United Kingdom",
            flag: "🇬🇧",
            color: "#ef4444",
            info: {
                admissions: "IELTS 6.0-7.0 depending on program. CAS (Confirmation of Acceptance for Studies) required for visa.",
                scholarships: "Chevening Scholarships, Commonwealth Scholarships, University-specific awards.",
                visa: "Student Visa: Financial proof for 1st year + 9 months living costs. Healthcare surcharge required.",
                deadlines: "Fall 2026: Jan-Mar 2026 for most universities."
            }
        }
    },
    common: {
        noc: "All Nepali students must obtain a No Objection Certificate (NOC) from the MoEST portal. Process takes 7-10 working days with NPR 2,000 fee.",
        timeline: "Start applications 12-15 months before intake. Allow 2-3 months for visa processing.",
        financial: "Show funds in A-class Nepali banks. For most countries: NPR 40-60 Lakhs for 1st year."
    }
};

let currentCountry = null;
let conversationHistory = [];

// Initialize
function init() {
    setupEventListeners();
    showQuickReplies([
        "🇨🇦 Canada admission requirements",
        "🇦🇺 Australia scholarships",
        "💰 Financial documentation",
        "📅 2026 deadlines",
        "🛂 NOC process"
    ]);
    
    // Set default country to Canada
    setActiveCountry('canada');
}

// Setup event listeners
function setupEventListeners() {
    // Send message on button click
    sendBtn.addEventListener('click', sendMessage);
    
    // Send message on Enter key (but allow Shift+Enter for new line)
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Show placeholder when input is empty
    messageInput.addEventListener('input', () => {
        const placeholder = document.getElementById('input-placeholder');
        if (messageInput.textContent.trim() === '') {
            placeholder.style.display = 'block';
        } else {
            placeholder.style.display = 'none';
        }
    });
    
    // Destination selection
    destinationItems.forEach(item => {
        item.addEventListener('click', () => {
            const country = item.getAttribute('data-country');
            setActiveCountry(country);
            addUserMessage(`Interested in ${knowledgeBase.countries[country].name}`);
            simulateTyping(() => {
                addBotMessage(`Great choice! ${knowledgeBase.countries[country].flag} ${knowledgeBase.countries[country].name} is a popular destination for Nepali students. What would you like to know about studying there?`);
                showQuickReplies([
                    "Admission requirements",
                    "Scholarship opportunities",
                    "Visa process",
                    "Financial documentation",
                    "Deadlines for 2026"
                ]);
            });
        });
    });
    
    // Quick buttons
    quickButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = e.target.id || e.target.closest('.quick-btn').id;
            handleQuickAction(action);
        });
    });
    
    // Sidebar toggles
    leftToggle.addEventListener('click', () => toggleSidebar('left'));
    rightToggle.addEventListener('click', () => toggleSidebar('right'));
    mobileMenu.addEventListener('click', () => toggleSidebar('left'));
    
    // Mobile overlay
    mobileOverlay.addEventListener('click', () => {
        document.querySelectorAll('.sidebar').forEach(sidebar => {
            sidebar.classList.remove('active');
        });
        mobileOverlay.classList.remove('active');
    });
    
    // Emoji picker
    emojiBtn.addEventListener('click', () => {
        emojiPicker.style.display = 'block';
    });
    
    closeEmoji.addEventListener('click', () => {
        emojiPicker.style.display = 'none';
    });
    
    // Emoji selection
    document.querySelectorAll('.emoji-grid span').forEach(emoji => {
        emoji.addEventListener('click', () => {
            insertAtCaret(messageInput, emoji.textContent);
            messageInput.focus();
        });
    });
    
    // Book consultation
    bookConsultationBtn.addEventListener('click', bookConsultation);
}

// Send message function
function sendMessage() {
    const message = messageInput.textContent.trim();
    if (message === '') return;
    
    addUserMessage(message);
    messageInput.textContent = '';
    document.getElementById('input-placeholder').style.display = 'block';
    
    // Process the message
    processUserMessage(message);
}

// Add user message to chat
function addUserMessage(text) {
    const messageWrapper = document.createElement('div');
    messageWrapper.className = 'message-wrapper';
    messageWrapper.innerHTML = `
        <div class="message user" style="margin-left: auto;">
            <div class="message-content" style="background: var(--message-bg-user); color: white; border-radius: var(--radius-lg) 0 var(--radius-lg) var(--radius-lg);">
                <div class="message-sender">
                    <strong>You</strong>
                    <span class="message-time">${getCurrentTime()}</span>
                </div>
                <div class="message-text">
                    ${text}
                </div>
                <div class="message-actions">
                    <i class="fas fa-check-double seen"></i>
                </div>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(messageWrapper);
    scrollToBottom();
    
    // Save to history
    conversationHistory.push({
        sender: 'user',
        text,
        time: new Date()
    });
}

// Add bot message to chat
function addBotMessage(text) {
    const messageWrapper = document.createElement('div');
    messageWrapper.className = 'message-wrapper';
    messageWrapper.innerHTML = `
        <div class="message bot">
            <div class="message-content">
                <div class="message-sender">
                    <strong>GlobalEd Study Advisor</strong>
                    <span class="message-time">${getCurrentTime()}</span>
                </div>
                <div class="message-text">
                    ${text}
                </div>
                <div class="message-actions">
                    <i class="fas fa-check-double"></i>
                </div>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(messageWrapper);
    scrollToBottom();
    
    // Save to history
    conversationHistory.push({
        sender: 'bot',
        text,
        time: new Date()
    });
}

// Process user message
function processUserMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    simulateTyping(() => {
        // Check for country mentions
        for (const [key, country] of Object.entries(knowledgeBase.countries)) {
            if (lowerMessage.includes(country.name.toLowerCase()) || lowerMessage.includes(key)) {
                setActiveCountry(key);
                
                // Check for topic keywords
                if (lowerMessage.includes('admission') || lowerMessage.includes('requirement') || lowerMessage.includes('ielts')) {
                    addBotMessage(`For ${country.name} admissions in 2026:<br><br>${country.info.admissions}`);
                    updateTopicInfo('Admissions', country.info.admissions);
                    return;
                } else if (lowerMessage.includes('scholarship') || lowerMessage.includes('funding') || lowerMessage.includes('award')) {
                    addBotMessage(`Scholarship opportunities for ${country.name}:<br><br>${country.info.scholarships}`);
                    updateTopicInfo('Scholarships', country.info.scholarships);
                    return;
                } else if (lowerMessage.includes('visa') || lowerMessage.includes('document')) {
                    addBotMessage(`${country.name} visa requirements:<br><br>${country.info.visa}<br><br><strong>For all Nepali students:</strong><br>${knowledgeBase.common.noc}`);
                    updateTopicInfo('Visa Process', country.info.visa);
                    return;
                } else if (lowerMessage.includes('deadline') || lowerMessage.includes('date')) {
                    addBotMessage(`${country.name} 2026 intake deadlines:<br><br>${country.info.deadlines}`);
                    updateTopicInfo('Deadlines', country.info.deadlines);
                    return;
                } else {
                    // General country info
                    addBotMessage(`Here's what you need to know about studying in ${country.name}:<br><br>
                    <strong>Admissions:</strong> ${country.info.admissions.substring(0, 100)}...<br><br>
                    <strong>Scholarships:</strong> ${country.info.scholarships.substring(0, 100)}...<br><br>
                    <strong>Visa:</strong> ${country.info.visa.substring(0, 100)}...<br><br>
                    What specific information would you like?`);
                    
                    showQuickReplies([
                        "Admission requirements",
                        "Scholarship opportunities",
                        "Visa process",
                        "Financial documentation",
                        "Deadlines for 2026"
                    ]);
                    
                    updateCountryInfo(country);
                    return;
                }
            }
        }
        
        // Check for general topics
        if (lowerMessage.includes('noc') || lowerMessage.includes('objection certificate')) {
            addBotMessage(`No Objection Certificate (NOC) process:<br><br>${knowledgeBase.common.noc}<br><br>This is required for all Nepali students before applying for a student visa.`);
            updateTopicInfo('NOC Process', knowledgeBase.common.noc);
        } else if (lowerMessage.includes('financial') || lowerMessage.includes('bank') || lowerMessage.includes('fund')) {
            addBotMessage(`Financial documentation requirements:<br><br>${knowledgeBase.common.financial}<br><br>Specific amounts vary by country. For example, Australia requires NPR 45-55 Lakhs in A-class banks.`);
            updateTopicInfo('Financial Documentation', knowledgeBase.common.financial);
        } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('namaste')) {
            addBotMessage(`Namaste! 👋 How can I help you with your 2026 study abroad plans today?`);
        } else if (lowerMessage.includes('thank')) {
            addBotMessage(`You're welcome! Is there anything else you'd like to know about studying abroad in 2026?`);
        } else {
            addBotMessage(`I can help you with information about studying abroad in 2026. Try asking about specific countries like Canada, Australia, USA, or UK, or ask about admissions, scholarships, visas, or deadlines.`);
            
            showQuickReplies([
                "🇨🇦 Canada admission requirements",
                "🇦🇺 Australia scholarships",
                "💰 Financial documentation",
                "📅 2026 deadlines",
                "🛂 NOC process"
            ]);
        }
    });
}

// Show quick reply buttons
function showQuickReplies(replies) {
    quickReplies.innerHTML = '';
    
    replies.forEach(reply => {
        const button = document.createElement('div');
        button.className = 'quick-reply';
        button.textContent = reply;
        button.addEventListener('click', () => {
            addUserMessage(reply);
            processUserMessage(reply);
        });
        quickReplies.appendChild(button);
    });
}

// Set active country
function setActiveCountry(countryCode) {
    currentCountry = countryCode;
    const country = knowledgeBase.countries[countryCode];
    
    // Update UI
    destinationItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-country') === countryCode) {
            item.classList.add('active');
        }
    });
    
    // Update country badge
    selectedCountryBadge.textContent = country.name;
    selectedCountryBadge.style.background = country.color;
    
    // Update country info panel
    updateCountryInfo(country);
}

// Update country info in right sidebar
function updateCountryInfo(country) {
    countryInfoContent.innerHTML = `
        <div class="country-header" style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
            <div style="font-size: 32px;">${country.flag}</div>
            <div>
                <h3 style="margin: 0 0 4px 0;">${country.name}</h3>
                <p style="font-size: 13px; color: var(--text-light); margin: 0;">2026 Study Destination</p>
            </div>
        </div>
        <div style="margin-bottom: 16px;">
            <h4 style="font-size: 14px; margin-bottom: 8px;">Key Requirements</h4>
            <ul style="font-size: 13px; padding-left: 20px; color: var(--text-secondary); line-height: 1.5;">
                <li>${country.name === 'Canada' ? 'IELTS 6.5 | SDS Stream' : country.name === 'Australia' ? 'IELTS 6.0 | GS Requirement' : country.name === 'USA' ? 'TOEFL 80+ | GRE/GMAT' : 'IELTS 6.0+ | CAS Required'}</li>
                <li>${country.name === 'Canada' ? 'GIC: CAD 20,635' : country.name === 'Australia' ? 'Funds: NPR 45-55L' : 'Proof of funds for 1+ year'}</li>
                <li>NOC from MoEST required</li>
            </ul>
        </div>
        <div>
            <h4 style="font-size: 14px; margin-bottom: 8px;">Popular Programs</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                <span style="background: ${country.color}15; color: ${country.color}; padding: 4px 10px; border-radius: 20px; font-size: 12px;">Business</span>
                <span style="background: ${country.color}15; color: ${country.color}; padding: 4px 10px; border-radius: 20px; font-size: 12px;">Computer Science</span>
                <span style="background: ${country.color}15; color: ${country.color}; padding: 4px 10px; border-radius: 20px; font-size: 12px;">Engineering</span>
                <span style="background: ${country.color}15; color: ${country.color}; padding: 4px 10px; border-radius: 20px; font-size: 12px;">Healthcare</span>
            </div>
        </div>
    `;
}

// Update topic info in right sidebar
function updateTopicInfo(topic, content) {
    topicInfoContent.innerHTML = `
        <h4 style="margin-bottom: 12px;">${topic}</h4>
        <div style="font-size: 13px; line-height: 1.5; color: var(--text-secondary);">
            ${content.substring(0, 200)}${content.length > 200 ? '...' : ''}
        </div>
        ${content.length > 200 ? `<button style="margin-top: 12px; background: none; border: none; color: var(--primary-color); font-size: 13px; font-weight: 500; cursor: pointer;">Read More</button>` : ''}
    `;
}

// Handle quick actions
function handleQuickAction(action) {
    switch(action) {
        case 'noc-info':
            addUserMessage("Tell me about the NOC process");
            processUserMessage("NOC process");
            break;
        case 'deadline-check':
            addUserMessage("What are the 2026 deadlines?");
            processUserMessage("2026 deadlines");
            break;
        case 'scholarship-finder':
            addUserMessage("Find scholarships for me");
            processUserMessage("scholarships");
            break;
        case 'consultation-booking':
            bookConsultation();
            break;
    }
}

// Book consultation
function bookConsultation() {
    addUserMessage("Book a consultation");
    addBotMessage(`I've noted your interest in a consultation! Our expert counselors will contact you within 24 hours. You can also visit our Kathmandu office:<br><br>
    <strong>GlobalEd Connect Nepal</strong><br>
    Durbar Marg, Kathmandu<br>
    Phone: +977-1-4223456<br>
    Email: nepal@globaledconnect.com<br><br>
    Would you like me to help you with anything else while you wait?`);
    
    showQuickReplies([
        "Yes, continue with my queries",
        "No, thank you"
    ]);
}

// Simulate typing indicator
function simulateTyping(callback) {
    typingIndicator.style.display = 'flex';
    
    setTimeout(() => {
        typingIndicator.style.display = 'none';
        callback();
    }, 1000 + Math.random() * 1000);
}

// Helper functions
function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function toggleSidebar(side) {
    const sidebar = document.querySelector(`.${side}-sidebar`);
    sidebar.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
}

function insertAtCaret(element, text) {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    range.deleteContents();
    const textNode = document.createTextNode(text);
    range.insertNode(textNode);
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(range);
}

// Initialize the chat when page loads
document.addEventListener('DOMContentLoaded', init);
