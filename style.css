const chatMessages = document.getElementById('chat-messages');
const optionsContainer = document.getElementById('options-container');
const quickActions = document.querySelector('.action-buttons');
const progressFill = document.getElementById('progress-fill');
const currentStep = document.getElementById('current-step');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const clearChatBtn = document.getElementById('clear-chat');

// 2026 Enhanced Knowledge Base
const knowledgeBase = {
    destinations: [
        { id: "canada", name: "🇨🇦 Canada", color: "primary" },
        { id: "usa", name: "🇺🇸 United States", color: "primary" },
        { id: "uk", name: "🇬🇧 United Kingdom", color: "primary" },
        { id: "australia", name: "🇦🇺 Australia", color: "primary" },
        { id: "newzealand", name: "🇳🇿 New Zealand", color: "" },
        { id: "germany", name: "🇩🇪 Germany", color: "" },
        { id: "japan", name: "🇯🇵 Japan", color: "" },
        { id: "ireland", name: "🇮🇪 Ireland", color: "" }
    ],
    
    topics: [
        { id: "admissions", name: "📝 Admissions Requirements", icon: "fas fa-file-alt" },
        { id: "scholarships", name: "💰 Scholarships & Funding", icon: "fas fa-award" },
        { id: "visa", name: "🛂 Visa & Documentation", icon: "fas fa-passport" },
        { id: "cost", name: "💵 Cost of Living", icon: "fas fa-money-bill-wave" },
        { id: "work", name: "💼 Work Opportunities", icon: "fas fa-briefcase" },
        { id: "deadlines", name: "⏰ 2026 Deadlines", icon: "fas fa-calendar-check" }
    ],
    
    details: {
        "canada": {
            "admissions": {
                title: "Canada Admissions 2026",
                content: "For September 2026 intake, most universities require:<br><br>" +
                        "• <span class='highlight'>IELTS: 6.5</span> overall (no band below 6.0) or <span class='highlight'>PTE: 58+</span><br>" +
                        "• <span class='highlight'>Deadlines:</span> Jan-Mar 2026 for most programs<br>" +
                        "• <span class='highlight'>SDS Stream:</span> Requires upfront tuition payment & GIC of CAD 20,635<br>" +
                        "• Popular programs for Nepali students: Business, IT, Engineering, Healthcare"
            },
            "scholarships": {
                title: "Canada Scholarships 2026",
                content: "Major scholarship opportunities:<br><br>" +
                        "• <span class='highlight'>Lester B. Pearson International Scholarship</span> - Full tuition at University of Toronto<br>" +
                        "• <span class='highlight'>Vanier Canada Graduate Scholarships</span> - CAD 50,000/year for PhD<br>" +
                        "• <span class='highlight'>University Entrance Awards</span> - Automatic consideration with 3.5+ GPA<br>" +
                        "• Provincial scholarships available in BC, Ontario, Alberta"
            },
            "visa": {
                title: "Canada Visa Requirements",
                content: "2026 Student Direct Stream (SDS) requirements:<br><br>" +
                        "• <span class='highlight'>GIC:</span> CAD 20,635 in designated bank<br>" +
                        "• <span class='highlight'>Medical Exam:</span> From panel physicians<br>" +
                        "• <span class='highlight'>NOC from MoEST:</span> Mandatory for Nepali students (NPR 2,000)<br>" +
                        "• <span class='highlight'>Processing Time:</span> 20-45 calendar days for SDS"
            }
        },
        "australia": {
            "admissions": {
                title: "Australia Admissions 2026",
                content: "Key requirements for 2026 intake:<br><br>" +
                        "• <span class='highlight'>Genuine Student (GS) requirement:</span> Strong SOP crucial<br>" +
                        "• <span class='highlight'>IELTS:</span> 6.0 for UG, 6.5 for PG (no band below 5.5)<br>" +
                        "• <span class='highlight'>Financial Proof:</span> NPR 45-55 Lakhs from A-class banks<br>" +
                        "• Popular: IT at UTS, Nursing at UQ, Business at Monash"
            },
            "visa": {
                title: "Australia Visa & Financials",
                content: "Student Visa (Subclass 500) requirements:<br><br>" +
                        "• <span class='highlight'>Bank Balance:</span> Show NPR 45-55 Lakhs for 1st year<br>" +
                        "• <span class='highlight'>Overseas Student Health Cover (OSHC):</span> Mandatory<br>" +
                        "• <span class='highlight'>Genuine Temporary Entrant (GTE):</span> Critical for approval<br>" +
                        "• <span class='highlight'>Post-study Work:</span> 2-6 years depending on qualification"
            }
        },
        "common": {
            "noc": "All Nepali students must obtain a <span class='highlight'>No Objection Certificate (NOC)</span> from the MoEST portal. Process takes 7-10 working days with NPR 2,000 fee.",
            "timeline": "Start applications 12-15 months before intake. Allow 2-3 months for visa processing."
        }
    }
};

let conversationHistory = [];
let currentState = {
    step: 1,
    selectedCountry: null,
    selectedTopic: null,
    previousStep: null
};

// Initialize chat
function initChat() {
    addBotMessage("Namaste! I'm your 2026 Study Abroad Assistant. I'll help you navigate admissions, scholarships, and visa processes for major study destinations. Where would you like to study?");
    showDestinationOptions();
    updateProgress();
    setupQuickActions();
}

// Add message to chat
function addMessage(content, sender, title = null) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    let messageHTML = '';
    if (title && sender === 'bot') {
        messageHTML += `<div class="message-header"><i class="fas fa-robot"></i> ${title}</div>`;
    } else if (sender === 'user') {
        messageHTML += `<div class="message-header"><i class="fas fa-user"></i> You</div>`;
    }
    
    messageHTML += `<div class="message-content">${content}</div>`;
    messageDiv.innerHTML = messageHTML;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Save to history
    conversationHistory.push({
        sender,
        content,
        title,
        timestamp: new Date().toISOString()
    });
}

function addBotMessage(content, title = "Study Abroad Assistant") {
    addMessage(content, 'bot', title);
}

function addUserMessage(content) {
    addMessage(content, 'user');
}

// Show destination options
function showDestinationOptions() {
    optionsContainer.innerHTML = '';
    knowledgeBase.destinations.forEach(dest => {
        const btn = document.createElement('button');
        btn.className = `option-btn ${dest.color}`;
        btn.innerHTML = dest.name;
        btn.onclick = () => selectDestination(dest.id);
        optionsContainer.appendChild(btn);
    });
    
    currentState.step = 1;
    updateProgress();
    updateNavigation();
}

// Select destination
function selectDestination(countryId) {
    const country = knowledgeBase.destinations.find(d => d.id === countryId);
    currentState.selectedCountry = countryId;
    currentState.previousStep = currentState.step;
    
    addUserMessage(country.name);
    
    setTimeout(() => {
        addBotMessage(`Great choice! ${country.name.split(' ')[1]} is a popular destination for Nepali students. What would you like to know about studying there?`, `${country.name.split(' ')[1]} Information`);
        showTopicOptions();
    }, 500);
}

// Show topic options
function showTopicOptions() {
    optionsContainer.innerHTML = '';
    knowledgeBase.topics.forEach(topic => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = `<i class="${topic.icon}"></i> ${topic.name}`;
        btn.onclick = () => selectTopic(topic.id);
        optionsContainer.appendChild(btn);
    });
    
    // Add back button
    const backBtn = document.createElement('button');
    backBtn.className = 'option-btn secondary';
    backBtn.innerHTML = '<i class="fas fa-arrow-left"></i> Choose Another Country';
    backBtn.onclick = showDestinationOptions;
    optionsContainer.appendChild(backBtn);
    
    currentState.step = 2;
    updateProgress();
    updateNavigation();
}

// Select topic
function selectTopic(topicId) {
    const topic = knowledgeBase.topics.find(t => t.id === topicId);
    currentState.selectedTopic = topicId;
    
    addUserMessage(topic.name);
    
    setTimeout(() => {
        showTopicDetails(topicId);
    }, 500);
}

// Show topic details
function showTopicDetails(topicId) {
    const country = currentState.selectedCountry;
    const topic = knowledgeBase.topics.find(t => t.id === topicId);
    
    let content = "";
    let title = "";
    
    if (knowledgeBase.details[country] && knowledgeBase.details[country][topicId]) {
        content = knowledgeBase.details[country][topicId].content;
        title = knowledgeBase.details[country][topicId].title;
    } else {
        content = `Detailed information about ${topic.name.toLowerCase()} for ${country.toUpperCase()} is being updated for 2026. Please check back soon or book a consultation for the latest details.`;
        title = `${country.toUpperCase()} ${topic.name}`;
    }
    
    // Add common NOC info for visa topics
    if (topicId === 'visa' && knowledgeBase.common.noc) {
        content += `<br><br><strong>For all Nepali students:</strong><br>${knowledgeBase.common.noc}`;
    }
    
    addBotMessage(content, title);
    
    // Show action buttons
    setTimeout(() => {
        showActionButtons();
    }, 300);
}

// Show action buttons after details
function showActionButtons() {
    optionsContainer.innerHTML = '';
    
    const actionBtns = [
        { text: '📋 Compare with Another Country', action: showDestinationOptions, class: '' },
        { text: '📚 Explore Another Topic', action: showTopicOptions, class: '' },
        { text: '📅 Book Free Consultation', action: bookConsultation, class: 'primary' },
        { text: '🔄 Start New Search', action: resetChat, class: 'secondary' }
    ];
    
    actionBtns.forEach(btn => {
        const button = document.createElement('button');
        button.className = `option-btn ${btn.class}`;
        button.innerHTML = btn.text;
        button.onclick = btn.action;
        optionsContainer.appendChild(button);
    });
    
    currentState.step = 3;
    updateProgress();
    updateNavigation();
}

// Setup quick actions
function setupQuickActions() {
    const quickTopics = [
        { text: '🇨🇦 Canada SDS', action: () => quickSelect('canada', 'visa') },
        { text: '🇦🇺 Australia GS', action: () => quickSelect('australia', 'admissions') },
        { text: '💰 Top Scholarships', action: () => quickSelect('canada', 'scholarships') },
        { text: '📅 2026 Deadlines', action: () => quickSelect('common', 'deadlines') }
    ];
    
    quickActions.innerHTML = '';
    quickTopics.forEach(topic => {
        const btn = document.createElement('button');
        btn.className = 'action-btn';
        btn.innerHTML = topic.text;
        btn.onclick = topic.action;
        quickActions.appendChild(btn);
    });
}

function quickSelect(country, topic) {
    if (country === 'common') {
        addBotMessage(knowledgeBase.common[topic] || "Common information about deadlines: Most Fall 2026 intakes have deadlines between December 2025 and March 2026. Start your preparation at least 12 months in advance.", "2026 Timeline");
        showActionButtons();
    } else {
        currentState.selectedCountry = country;
        currentState.selectedTopic = topic;
        
        const countryName = knowledgeBase.destinations.find(d => d.id === country).name;
        addUserMessage(`Quick select: ${countryName} - ${topic}`);
        
        setTimeout(() => {
            showTopicDetails(topic);
        }, 500);
    }
}

// Update progress bar
function updateProgress() {
    const progressPercent = (currentState.step / 3) * 100;
    progressFill.style.width = `${progressPercent}%`;
    currentStep.textContent = currentState.step;
}

// Update navigation buttons
function updateNavigation() {
    prevBtn.disabled = currentState.step === 1;
    nextBtn.disabled = currentState.step === 3;
    
    if (currentState.step === 3) {
        nextBtn.innerHTML = 'Finish <i class="fas fa-check"></i>';
        nextBtn.onclick = finishChat;
    } else {
        nextBtn.innerHTML = 'Next <i class="fas fa-arrow-right"></i>';
        nextBtn.onclick = nextStep;
    }
}

function nextStep() {
    if (currentState.step === 1 && currentState.selectedCountry) {
        showTopicOptions();
    } else if (currentState.step === 2 && currentState.selectedTopic) {
        showTopicDetails(currentState.selectedTopic);
    }
}

prevBtn.onclick = () => {
    if (currentState.step === 2) {
        showDestinationOptions();
    } else if (currentState.step === 3) {
        showTopicOptions();
    }
};

function finishChat() {
    addBotMessage("Thank you for using GlobalEd Connect! Would you like to export this chat or book a consultation with our experts?", "Chat Summary");
    
    optionsContainer.innerHTML = `
        <button class="option-btn primary" onclick="bookConsultation()">
            <i class="fas fa-calendar-alt"></i> Book Free Consultation
        </button>
        <button class="option-btn" onclick="exportChat()">
            <i class="fas fa-download"></i> Export Chat
        </button>
        <button class="option-btn secondary" onclick="resetChat()">
            <i class="fas fa-redo"></i> New Conversation
        </button>
    `;
}

function bookConsultation() {
    addUserMessage("Book consultation");
    addBotMessage("Our expert counselors will contact you within 24 hours. In the meantime, you can visit our Kathmandu office at:<br><br><strong>GlobalEd Connect Nepal</strong><br>Durbar Marg, Kathmandu<br>Phone: +977-1-4223456<br>Email: nepal@globaledconnect.com", "Consultation Booked");
}

function exportChat() {
    const chatText = conversationHistory.map(entry => 
        `${entry.sender === 'bot' ? 'Advisor' : 'You'}: ${entry.content.replace(/<[^>]*>/g, '')}`
    ).join('\n\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `StudyAbroadChat_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function resetChat() {
    conversationHistory = [];
    currentState = {
        step: 1,
        selectedCountry: null,
        selectedTopic: null,
        previousStep: null
    };
    
    chatMessages.innerHTML = '';
    initChat();
}

clearChatBtn.onclick = resetChat;

// Initialize chat when page loads
document.addEventListener('DOMContentLoaded', initChat);
