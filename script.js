// Chatbot using Database
document.addEventListener('DOMContentLoaded', function () {
    // Database instance
    const db = studyAbroadDB;

    // DOM Elements
    const chatMessages = document.getElementById('chat-messages');
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    const quickReplies = document.getElementById('quick-replies');
    const typingIndicator = document.getElementById('typing-indicator');
    const destinationItems = document.querySelectorAll('.destination-item');
    const quickButtons = document.querySelectorAll('.quick-btn');
    const countryInfoContent = document.getElementById('country-info-content');
    const selectedCountryBadge = document.getElementById('selected-country-badge');

    // State
    let currentCountry = null;
    let conversationHistory = [];

    // Initialize chat
    function initChat() {
        addBotMessage(`
            Namaste! 👋 Welcome to your 2026 Study Abroad Assistant. 
            I'm powered by a comprehensive database that gets updated regularly.
            
            You can ask me about:
            • 🎓 Admission requirements for different countries
            • 💰 Scholarships and financial aid
            • 🛂 Visa documentation and NOC process
            • 📅 2026 intake deadlines
            • 🏫 University-specific information
            
            Where would you like to study?
        `);

        showQuickReplies([
            "🇨🇦 Canada admission requirements",
            "🇦🇺 Australia scholarships",
            "💰 Financial documentation",
            "📅 2026 deadlines",
            "🛂 NOC process"
        ]);

        updateCountryList();
        setupEventListeners();
    }

    // Update country list from database
    function updateCountryList() {
        const countries = db.getCountries();
        destinationItems.forEach(item => {
            const countryId = item.getAttribute('data-country');
            const country = countries[countryId];

            if (country) {
                item.querySelector('.flag').textContent = country.flag || '🌐';
                item.querySelector('.dest-info strong').textContent = country.name;

                // Update quick info
                if (country.topics?.admissions?.content) {
                    const content = country.topics.admissions.content;
                    const ieltsMatch = content.match(/IELTS[^<]*?(\d+\.?\d*)/);
                    const deadlineMatch = content.match(/Deadline[^<]*?(Jan|Feb|Mar)/i);
                    const info = [];
                    if (ieltsMatch) info.push(`IELTS ${ieltsMatch[1]}`);
                    if (deadlineMatch) info.push(`${deadlineMatch[1]} Deadline`);
                    if (info.length > 0) {
                        item.querySelector('.dest-info span').textContent = info.join(' | ');
                    }
                }

                // Add click handler
                item.addEventListener('click', () => handleCountrySelect(countryId));
            }
        });
    }

    // Setup event listeners
    function setupEventListeners() {
        // Send message on button click
        sendBtn.addEventListener('click', sendMessage);

        // Send message on Enter key
        messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Quick buttons
        quickButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.id || e.target.closest('.quick-btn').id;
                handleQuickAction(action);
            });
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
    }

    // Send message
    function sendMessage() {
        const message = messageInput.textContent.trim();
        if (message === '') return;

        addUserMessage(message);
        messageInput.textContent = '';
        document.getElementById('input-placeholder').style.display = 'block';

        // Process the message
        processUserMessage(message);
    }

    // Handle country selection
    function handleCountrySelect(countryId) {
        const countries = db.getCountries();
        const country = countries[countryId];

        if (!country) return;

        currentCountry = countryId;
        setActiveCountry(countryId);
        addUserMessage(`Interested in ${country.name}`);

        simulateTyping(() => {
            addBotMessage(`Great choice! ${country.flag} ${country.name} is a popular destination for Nepali students. What would you like to know about studying there?`);
            showQuickReplies([
                "Admission requirements",
                "Scholarship opportunities",
                "Visa process",
                "Financial documentation",
                "Deadlines for 2026"
            ]);

            // Update country info panel
            updateCountryInfoPanel(country);
        });
    }

    // Process user message
    function processUserMessage(message) {
        const lowerMessage = message.toLowerCase();

        simulateTyping(() => {
            // First, try to find exact matches in database
            const searchResults = db.searchAnswer(lowerMessage);

            if (searchResults.length > 0) {
                // Use the best match
                const bestResult = searchResults[0];

                if (bestResult.type === 'country_topic') {
                    addBotMessage(`${bestResult.country}:<br><br>${bestResult.content}`);

                    // Update country info if it's a country-specific topic
                    const countries = db.getCountries();
                    const country = Object.values(countries).find(c => c.name === bestResult.country);
                    if (country) {
                        setActiveCountry(country.id);
                        updateCountryInfoPanel(country);
                    }
                } else if (bestResult.type === 'common') {
                    addBotMessage(`${bestResult.topic}:<br><br>${bestResult.content}`);
                } else if (bestResult.type === 'faq') {
                    addBotMessage(`Q: ${bestResult.question}<br><br>A: ${bestResult.answer}`);
                }

                // Show follow-up options
                setTimeout(() => {
                    showQuickReplies([
                        "Ask another question",
                        "Explore other countries",
                        "Book consultation"
                    ]);
                }, 500);

                return;
            }

            // If no database match, use fallback responses
            handleFallbackResponse(lowerMessage);
        });
    }

    // Handle fallback responses when no database match
    function handleFallbackResponse(message) {
        const countries = db.getCountries();

        // Check for country mentions
        for (const [countryId, country] of Object.entries(countries)) {
            if (message.includes(country.name.toLowerCase()) || message.includes(countryId)) {
                setActiveCountry(countryId);

                // Check for topic keywords
                if (message.includes('admission') || message.includes('requirement') || message.includes('ielts')) {
                    const topic = country.topics?.admissions;
                    if (topic) {
                        addBotMessage(`${topic.title}:<br><br>${topic.content}`);
                    } else {
                        addBotMessage(`Admission information for ${country.name} is being updated. Please check back soon or book a consultation for the latest details.`);
                    }
                    return;
                } else if (message.includes('scholarship') || message.includes('funding')) {
                    const topic = country.topics?.scholarships;
                    if (topic) {
                        addBotMessage(`${topic.title}:<br><br>${topic.content}`);
                    } else {
                        addBotMessage(`Scholarship information for ${country.name} is being updated. Please check back soon or book a consultation for the latest details.`);
                    }
                    return;
                } else if (message.includes('visa')) {
                    const topic = country.topics?.visa;
                    if (topic) {
                        addBotMessage(`${topic.title}:<br><br>${topic.content}`);
                    } else {
                        addBotMessage(`Visa information for ${country.name} is being updated. Please check back soon or book a consultation for the latest details.`);
                    }
                    return;
                } else {
                    // General country info
                    addBotMessage(`Here's what I know about ${country.name}:<br><br>
                    ${country.description || 'Popular destination for Nepali students.'}<br><br>
                    What specific information would you like?`);

                    showQuickReplies([
                        "Admission requirements",
                        "Scholarship opportunities",
                        "Visa process",
                        "Financial documentation"
                    ]);

                    updateCountryInfoPanel(country);
                    return;
                }
            }
        }

        // Check for general topics
        if (message.includes('noc') || message.includes('objection certificate')) {
            const common = db.getDatabase()?.common?.noc;
            if (common) {
                addBotMessage(`${common.title}:<br><br>${common.content}`);
            } else {
                addBotMessage("The NOC (No Objection Certificate) is required for all Nepali students from MoEST. Process takes 7-10 working days with NPR 2,000 fee.");
            }
        } else if (message.includes('timeline') || message.includes('deadline') || message.includes('when to apply')) {
            const common = db.getDatabase()?.common?.timeline;
            if (common) {
                addBotMessage(`${common.title}:<br><br>${common.content}`);
            } else {
                addBotMessage("Start applications 12-15 months before intake. Most deadlines are Jan-Mar 2026 for Fall 2026 intake.");
            }
        } else if (message.includes('hello') || message.includes('hi') || message.includes('namaste')) {
            addBotMessage(`Namaste! 👋 How can I help you with your 2026 study abroad plans today?`);
        } else if (message.includes('thank')) {
            addBotMessage(`You're welcome! Is there anything else you'd like to know about studying abroad in 2026?`);
        } else {
            addBotMessage(`I can help you with information about studying abroad in 2026. Try asking about specific countries or topics. You can also click on countries in the left sidebar.`);

            showQuickReplies([
                "🇨🇦 Canada admission requirements",
                "🇦🇺 Australia scholarships",
                "💰 Financial documentation",
                "📅 2026 deadlines"
            ]);
        }
    }

    // Handle quick actions
    function handleQuickAction(action) {
        switch (action) {
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

    // Set active country
    function setActiveCountry(countryId) {
        const countries = db.getCountries();
        const country = countries[countryId];

        if (!country) return;

        currentCountry = countryId;

        // Update UI
        destinationItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-country') === countryId) {
                item.classList.add('active');
            }
        });

        // Update country badge
        selectedCountryBadge.textContent = country.name;
        selectedCountryBadge.style.background = country.color;
    }

    // Update country info panel
    function updateCountryInfoPanel(country) {
        const topics = country.topics || {};
        const topicsCount = Object.keys(topics).length;

        countryInfoContent.innerHTML = `
            <div class="country-header" style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                <div style="font-size: 32px;">${country.flag || '🌐'}</div>
                <div>
                    <h3 style="margin: 0 0 4px 0; color: ${country.color};">${country.name}</h3>
                    <p style="font-size: 13px; color: var(--text-light); margin: 0;">${country.description || 'Study destination'}</p>
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <p style="font-size: 14px; line-height: 1.5; color: var(--text-secondary);">
                    ${country.description || 'Information loaded from database.'}
                </p>
            </div>
            
            ${topicsCount > 0 ? `
                <div style="margin-bottom: 16px;">
                    <h4 style="font-size: 14px; margin-bottom: 8px; color: var(--dark);">Available Topics</h4>
                    <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                        ${Object.keys(topics).map(topic =>
            `<span style="background: ${country.color}15; color: ${country.color}; padding: 4px 10px; border-radius: 20px; font-size: 12px; cursor: pointer;" 
                                  onclick="window.chatBotAskAboutTopic('${country.id}', '${topic}')">
                                ${topic}
                            </span>`
        ).join('')}
                    </div>
                </div>
            ` : ''}
            
            <div>
                <h4 style="font-size: 14px; margin-bottom: 8px; color: var(--dark);">Quick Stats</h4>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
                    <div style="background: #f3f4f6; padding: 8px; border-radius: 6px; text-align: center;">
                        <div style="font-size: 12px; color: #6b7280;">Topics</div>
                        <div style="font-weight: 600; color: ${country.color};">${topicsCount}</div>
                    </div>
                    <div style="background: #f3f4f6; padding: 8px; border-radius: 6px; text-align: center;">
                        <div style="font-size: 12px; color: #6b7280;">Last Updated</div>
                        <div style="font-size: 11px; font-weight: 500; color: #6b7280;">
                            ${country.lastUpdated ? new Date(country.lastUpdated).toLocaleDateString() : 'N/A'}
                        </div>
                    </div>
                </div>
            </div>
            
            ${country.active === false ? `
                <div style="margin-top: 15px; padding: 10px; background: #fef2f2; border-radius: 6px; border-left: 3px solid #ef4444;">
                    <p style="margin: 0; font-size: 12px; color: #991b1b;">
                        <i class="fas fa-exclamation-triangle"></i> This country is currently marked as inactive in the database.
                    </p>
                </div>
            ` : ''}
        `;
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
                        <strong>Study Abroad Assistant</strong>
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

    // Simulate typing
    function simulateTyping(callback) {
        typingIndicator.style.display = 'flex';

        setTimeout(() => {
            typingIndicator.style.display = 'none';
            callback();
        }, 800 + Math.random() * 800);
    }

    // Helper functions
    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Make function available globally for topic clicks
    window.chatBotAskAboutTopic = function (countryId, topicId) {
        const countries = db.getCountries();
        const country = countries[countryId];
        const topic = country?.topics?.[topicId];

        if (topic) {
            addUserMessage(`${country.name} - ${topic.title}`);
            simulateTyping(() => {
                addBotMessage(`${topic.title}:<br><br>${topic.content}`);
                showQuickReplies([
                    "Ask another question",
                    "Explore other countries",
                    "Book consultation"
                ]);
            });
        }
    };

    // Initialize chat
    initChat();
});