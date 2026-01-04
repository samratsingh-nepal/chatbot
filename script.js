// User profile storage
let userProfile = {
  targetCountry: '',
  intendedLevel: '',
  academicPerformance: '',
  studyGap: '',
  englishTestStatus: '',
  fundingPlan: '',
  completed: false
};

// DOM Elements
const welcomeScreen = document.getElementById('welcomeScreen');
const chatContainer = document.getElementById('chatContainer');
const chatArea = document.getElementById('chatArea');
const actionButtons = document.getElementById('actionButtons');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const statusText = document.getElementById('statusText');
const profileModal = document.getElementById('profileModal');
const helpModal = document.getElementById('helpModal');
const notificationSound = document.getElementById('notificationSound');

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  // Auto-start chat if returning user
  const savedProfile = localStorage.getItem('studyAbroadProfile');
  if (savedProfile) {
    userProfile = JSON.parse(savedProfile);
    if (userProfile.completed) {
      setTimeout(startChat, 500);
    }
  }
});

// Start chat function
function startChat() {
  welcomeScreen.style.display = 'none';
  chatContainer.style.display = 'flex';

  if (!userProfile.completed) {
    showWelcomePhase();
  } else {
    showTopicSelection();
    updateStatus('Choose a topic');
  }
}

// Phase 1: Welcome
function showWelcomePhase() {
  updateProgress(0, 'Starting conversation...');
  updateStatus('Getting to know you');

  setTimeout(() => {
    addMessage('bot', `👋 Welcome to your Study Abroad Assistant!\n\nI'll guide you through everything step by step.\n\n⏱ Just click buttons - no typing needed!`);

    showActionButtons([
      { text: '🎓 Start Profile Setup', action: () => startProfileSetup(), type: 'primary', icon: 'fas fa-play' },
      { text: '🔍 Browse Topics First', action: () => showTopicSelection(), icon: 'fas fa-search' }
    ]);
  }, 500);
}

function startProfileSetup() {
  updateProgress(10, 'Step 1 of 6');
  updateStatus('Select your target country');
  showCountrySelection();
}

// Profile Collection Functions
function showCountrySelection() {
  addMessage('bot', '🌍 First, which country are you planning to study in?');

  showActionButtons([
    { text: '🇦🇺 Australia', action: () => saveAnswer('targetCountry', 'Australia', showLevelSelection), icon: 'fas fa-flag' },
    { text: '🇨🇦 Canada', action: () => saveAnswer('targetCountry', 'Canada', showLevelSelection), icon: 'fas fa-flag' },
    { text: '🇬🇧 United Kingdom', action: () => saveAnswer('targetCountry', 'UK', showLevelSelection), icon: 'fas fa-flag' },
    { text: '🇺🇸 United States', action: () => saveAnswer('targetCountry', 'USA', showLevelSelection), icon: 'fas fa-flag' },
    { text: '🇳🇿 New Zealand', action: () => saveAnswer('targetCountry', 'New Zealand', showLevelSelection), icon: 'fas fa-flag' },
    { text: '🤔 Not Sure Yet', action: () => saveAnswer('targetCountry', 'Not Sure', showLevelSelection), icon: 'fas fa-question' }
  ]);
}

function showLevelSelection() {
  updateProgress(25, 'Step 2 of 6');
  updateStatus('Select your study level');

  addMessage('bot', '🎓 What level of study are you planning?');

  showActionButtons([
    { text: 'Diploma / Certificate', action: () => saveAnswer('intendedLevel', 'Diploma', showAcademicPerformance), icon: 'fas fa-certificate' },
    { text: 'Bachelor\'s Degree', action: () => saveAnswer('intendedLevel', 'Bachelor\'s', showAcademicPerformance), icon: 'fas fa-user-graduate' },
    { text: 'Master\'s Degree', action: () => saveAnswer('intendedLevel', 'Master\'s', showAcademicPerformance), icon: 'fas fa-user-graduate' },
    { text: 'PhD / Doctorate', action: () => saveAnswer('intendedLevel', 'PhD', showAcademicPerformance), icon: 'fas fa-user-graduate' }
  ]);
}

function showAcademicPerformance() {
  updateProgress(40, 'Step 3 of 6');
  updateStatus('Describe your academic results');

  addMessage('bot', '📊 How would you describe your academic performance?');

  showActionButtons([
    { text: 'Below Average', action: () => saveAnswer('academicPerformance', 'Below Average', showStudyGap), icon: 'fas fa-chart-line-down' },
    { text: 'Average', action: () => saveAnswer('academicPerformance', 'Average', showStudyGap), icon: 'fas fa-chart-line' },
    { text: 'Good', action: () => saveAnswer('academicPerformance', 'Good', showStudyGap), icon: 'fas fa-chart-line-up' },
    { text: 'Strong / Excellent', action: () => saveAnswer('academicPerformance', 'Strong', showStudyGap), icon: 'fas fa-star' }
  ]);
}

function showStudyGap() {
  updateProgress(55, 'Step 4 of 6');
  updateStatus('Any gap after last study?');

  addMessage('bot', '⏳ Have you had any gap after your last study?');

  showActionButtons([
    { text: 'No Gap', action: () => saveAnswer('studyGap', 'No Gap', showEnglishTestStatus), icon: 'fas fa-check-circle' },
    { text: '1 Year', action: () => saveAnswer('studyGap', '1 Year', showEnglishTestStatus), icon: 'fas fa-calendar' },
    { text: '2-3 Years', action: () => saveAnswer('studyGap', '2-3 Years', showEnglishTestStatus), icon: 'fas fa-calendar-alt' },
    { text: 'More than 3 Years', action: () => saveAnswer('studyGap', 'More than 3 Years', showEnglishTestStatus), icon: 'fas fa-calendar-times' }
  ]);
}

function showEnglishTestStatus() {
  updateProgress(70, 'Step 5 of 6');
  updateStatus('English test status');

  addMessage('bot', '🗣️ What is your English test situation?');

  showActionButtons([
    { text: 'IELTS/PTE Completed', action: () => saveAnswer('englishTestStatus', 'Completed', showFundingPlan), icon: 'fas fa-check-double' },
    { text: 'Test Booked / Planning', action: () => saveAnswer('englishTestStatus', 'Booked', showFundingPlan), icon: 'fas fa-calendar-check' },
    { text: 'Not Started Yet', action: () => saveAnswer('englishTestStatus', 'Not Started', showFundingPlan), icon: 'fas fa-clock' }
  ]);
}

function showFundingPlan() {
  updateProgress(85, 'Step 6 of 6');
  updateStatus('How will you fund studies?');

  addMessage('bot', '💰 How do you plan to fund your studies?');

  showActionButtons([
    { text: 'Parents / Family Sponsor', action: () => saveAnswer('fundingPlan', 'Family Sponsor', showProfileConfirmation), icon: 'fas fa-users' },
    { text: 'Education Loan', action: () => saveAnswer('fundingPlan', 'Education Loan', showProfileConfirmation), icon: 'fas fa-university' },
    { text: 'Combination of Sources', action: () => saveAnswer('fundingPlan', 'Combination', showProfileConfirmation), icon: 'fas fa-balance-scale' },
    { text: 'Not Sure / Exploring', action: () => saveAnswer('fundingPlan', 'Exploring', showProfileConfirmation), icon: 'fas fa-question-circle' }
  ]);
}

function showProfileConfirmation() {
  userProfile.completed = true;
  updateProgress(100, 'Profile Complete!');
  updateStatus('Choose what to learn about');

  localStorage.setItem('studyAbroadProfile', JSON.stringify(userProfile));

  addMessage('bot', `✅ Perfect! I've saved your profile.\n\n📋 Summary:\n• Country: ${userProfile.targetCountry}\n• Level: ${userProfile.intendedLevel}\n• Academic: ${userProfile.academicPerformance}\n\nNow, what would you like to explore?`);

  updateProfileDisplay();

  setTimeout(() => {
    showTopicSelection();
  }, 1000);
}

// Topic Selection
function showTopicSelection() {
  updateProgress(100, 'Ready to help!');
  updateStatus('Choose a topic');

  addMessage('bot', '📚 What would you like to understand better?');

  showActionButtons([
    { text: '💰 Financial Requirements', action: () => showFinancialRequirements(), type: 'primary', icon: 'fas fa-money-check-alt' },
    { text: '🎓 Scholarships & Funding', action: () => showScholarships(), icon: 'fas fa-award' },
    { text: '📄 Visa & Documentation', action: () => showVisaExpectations(), icon: 'fas fa-file-contract' },
    { text: '🗣️ English Test Guidance', action: () => showEnglishGuidance(), icon: 'fas fa-language' },
    { text: '📅 Timeline Planning', action: () => showIntakeTimelines(), icon: 'fas fa-calendar-day' },
    { text: '🤝 Talk to Counselor', action: () => showCounselorConnection(), icon: 'fas fa-headset' }
  ]);
}

// Topic Response Functions
function showFinancialRequirements() {
  updateStatus('Financial Guidance');

  const country = userProfile.targetCountry || 'your chosen country';
  const level = userProfile.intendedLevel || 'your study level';

  addMessage('bot', `💰 **Financial Requirements for ${country}**\n\nFor ${level} studies in ${country}, you'll need to show funds for:\n\n• Tuition fees (first year)\n• Living expenses (12 months)\n• Health insurance coverage\n\n💡 Tip: Most universities provide specific cost estimates on their websites.`);

  showActionButtons([
    { text: '🎓 Scholarship Options', action: () => showScholarships(), icon: 'fas fa-award' },
    { text: '📄 Visa Documentation', action: () => showVisaExpectations(), icon: 'fas fa-file-alt' },
    { text: '🏠 Back to Menu', action: () => showTopicSelection(), icon: 'fas fa-home' }
  ]);
}

function showScholarships() {
  updateStatus('Scholarship Information');

  const academic = userProfile.academicPerformance || 'your academic level';

  addMessage('bot', `🎓 **Scholarship Opportunities**\n\nBased on your ${academic} academic profile:\n\n1. **University Scholarships** - Check each university's website\n2. **Country Scholarships** - Government-funded programs\n3. **External Scholarships** - Private organizations\n\n⏰ Apply 6-8 months before your intended start date.`);

  showActionButtons([
    { text: '💰 Financial Planning', action: () => showFinancialRequirements(), icon: 'fas fa-calculator' },
    { text: '📅 Application Timeline', action: () => showIntakeTimelines(), icon: 'fas fa-calendar' },
    { text: '🏠 Back to Menu', action: () => showTopicSelection(), icon: 'fas fa-home' }
  ]);
}

function showVisaExpectations() {
  updateStatus('Visa Guidance');

  const gap = userProfile.studyGap || 'No Gap';

  addMessage('bot', `📄 **Visa Requirements**\n\nKey documents needed:\n• University offer letter\n• Financial proof\n• English test results\n• Genuine student statement\n\n${gap !== 'No Gap' ? `📝 Since you have a ${gap.toLowerCase()}, prepare a clear explanation for this gap.` : ''}`);

  showActionButtons([
    { text: '🗣️ English Test Help', action: () => showEnglishGuidance(), icon: 'fas fa-language' },
    { text: '🤝 Counselor Support', action: () => showCounselorConnection(), icon: 'fas fa-headset' },
    { text: '🏠 Back to Menu', action: () => showTopicSelection(), icon: 'fas fa-home' }
  ]);
}

function showEnglishGuidance() {
  updateStatus('English Test Help');

  const status = userProfile.englishTestStatus || 'Not Started';

  addMessage('bot', `🗣️ **English Test Guidance**\n\n${getEnglishAdvice(status)}\n\n📊 General requirements:\n• Diploma/Bachelor's: IELTS 6.0-6.5\n• Master's/PhD: IELTS 6.5-7.0+\n\nBook through official test centers only.`);

  showActionButtons([
    { text: '📅 Timeline Planning', action: () => showIntakeTimelines(), icon: 'fas fa-calendar' },
    { text: '🎓 University Requirements', action: () => showScholarships(), icon: 'fas fa-university' },
    { text: '🏠 Back to Menu', action: () => showTopicSelection(), icon: 'fas fa-home' }
  ]);
}

function getEnglishAdvice(status) {
  switch (status) {
    case 'Completed':
      return '✅ Great! Make sure your scores meet the requirements of your chosen universities.';
    case 'Booked':
      return '📅 Good planning! Schedule your test 2-3 months before application deadlines.';
    default:
      return '⏰ Start preparing now! Most students need 2-4 months of preparation before taking the test.';
  }
}

function showIntakeTimelines() {
  updateStatus('Timeline Planning');

  const country = userProfile.targetCountry || 'your chosen country';

  addMessage('bot', `📅 **Intake Timeline for ${country}**\n\nMain intakes:\n• ${getIntakePeriods(country)}\n\n📋 Recommended schedule:\n• Now: Research & shortlist\n• +1-2 months: English test\n• +3-4 months: Applications\n• +6-8 months: Visa process\n\nStart early for best options!`);

  showActionButtons([
    { text: '🤝 Get Expert Help', action: () => showCounselorConnection(), icon: 'fas fa-headset' },
    { text: '🏠 Back to Menu', action: () => showTopicSelection(), icon: 'fas fa-home' }
  ]);
}

function getIntakePeriods(country) {
  const intakes = {
    'Australia': 'February, July, November',
    'Canada': 'January, May, September',
    'UK': 'January, September',
    'USA': 'January, August',
    'New Zealand': 'February, July'
  };
  return intakes[country] || 'Varies - check university websites';
}

function showCounselorConnection() {
  updateStatus('Counselor Connection');

  addMessage('bot', `🤝 **Free Expert Consultation**\n\nOur study abroad counselors can help you:\n\n• Choose the right universities\n• Review your application documents\n• Guide visa preparation\n• Provide personalized timeline\n\nAll consultations are free!`);

  showActionButtons([
    { text: '📱 Connect on WhatsApp', action: () => connectViaWhatsApp(), type: 'primary', icon: 'fab fa-whatsapp' },
    { text: '📞 Schedule a Call', action: () => scheduleCall(), icon: 'fas fa-phone-alt' },
    { text: '🏠 Back to Menu', action: () => showTopicSelection(), icon: 'fas fa-home' }
  ]);
}

function connectViaWhatsApp() {
  const phone = '+1234567890';
  const message = `Hello! I need study abroad consultation. My profile:\nCountry: ${userProfile.targetCountry || 'Not selected'}\nLevel: ${userProfile.intendedLevel || 'Not selected'}`;
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');

  addMessage('user', 'Requested WhatsApp consultation');
  setTimeout(() => {
    addMessage('bot', '✅ A counselor will contact you on WhatsApp shortly! Need anything else?');
    setTimeout(() => showTopicSelection(), 1500);
  }, 500);
}

function scheduleCall() {
  addMessage('user', 'Requested callback');
  setTimeout(() => {
    addMessage('bot', '📞 Great! A counselor will call you within 24 hours. For immediate help, try WhatsApp.');
    setTimeout(() => showTopicSelection(), 1500);
  }, 500);
}

// Utility Functions
function saveAnswer(field, value, nextFunction) {
  userProfile[field] = value;
  addMessage('user', value);
  playSound();
  setTimeout(nextFunction, 300);
}

function addMessage(sender, text) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}-message`;

  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  messageDiv.innerHTML = `
        <div class="message-content">${formatMessage(text)}</div>
        <div class="message-time">${time}</div>
    `;

  chatArea.appendChild(messageDiv);
  chatArea.scrollTop = chatArea.scrollHeight;
}

function formatMessage(text) {
  return text.replace(/\n/g, '<br>');
}

function showActionButtons(buttons) {
  actionButtons.innerHTML = '';
  buttons.forEach(btn => {
    const button = document.createElement('button');
    button.className = `action-btn ${btn.type || ''}`;
    button.innerHTML = `
            ${btn.icon ? `<i class="${btn.icon} btn-icon"></i>` : ''}
            <span class="btn-text">${btn.text}</span>
        `;
    button.onclick = btn.action;
    actionButtons.appendChild(button);
  });
}

function updateProgress(percent, text) {
  progressFill.style.width = `${percent}%`;
  progressText.textContent = text;
}

function updateStatus(text) {
  statusText.textContent = text;
}

function playSound() {
  notificationSound.currentTime = 0;
  notificationSound.play().catch(e => console.log('Sound error:', e));
}

// Modal Functions
function showProfileSummary() {
  updateProfileDisplay();
  profileModal.style.display = 'flex';
}

function showHelp() {
  helpModal.style.display = 'flex';
}

function closeModal() {
  profileModal.style.display = 'none';
}

function closeHelp() {
  helpModal.style.display = 'none';
}

function updateProfileDisplay() {
  const fields = [
    { id: 'profileCountry', value: userProfile.targetCountry },
    { id: 'profileLevel', value: userProfile.intendedLevel },
    { id: 'profileAcademic', value: userProfile.academicPerformance },
    { id: 'profileGap', value: userProfile.studyGap },
    { id: 'profileEnglish', value: userProfile.englishTestStatus },
    { id: 'profileFunding', value: userProfile.fundingPlan }
  ];

  fields.forEach(field => {
    const element = document.getElementById(field.id);
    if (element) {
      const valueElement = element.querySelector('.value');
      valueElement.textContent = field.value || 'Not selected';
    }
  });
}

function editProfile() {
  closeModal();
  userProfile.completed = false;
  startProfileSetup();
}

function resetChat() {
  if (confirm('Start a new conversation? Your current profile will be reset.')) {
    userProfile = {
      targetCountry: '',
      intendedLevel: '',
      academicPerformance: '',
      studyGap: '',
      englishTestStatus: '',
      fundingPlan: '',
      completed: false
    };
    localStorage.removeItem('studyAbroadProfile');
    chatArea.innerHTML = '';
    actionButtons.innerHTML = '';
    showWelcomePhase();
  }
}