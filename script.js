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
const statusText = document.getElementById('statusText');
const profileModal = document.getElementById('profileModal');
const helpModal = document.getElementById('helpModal');
const notificationSound = document.getElementById('notificationSound');

// Content Library from content-data.js
const content = window.studyAbroadContent || {};

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

  addMessage('bot', `✅ Perfect! I've saved your profile.\n\n📋 Summary:\n• Country: ${userProfile.targetCountry}\n• Level: ${userProfile.intendedLevel}\n• Academic: ${userProfile.academicPerformance}\n• Funding: ${userProfile.fundingPlan}\n\nNow, what would you like to explore?`);

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

// Topic Response Functions with Dynamic Content
function showFinancialRequirements() {
  updateStatus('Financial Guidance');

  const country = userProfile.targetCountry;
  const level = userProfile.intendedLevel;
  
  let content = `💰 **Financial Requirements**\n\n`;
  
  // Check if we have specific content for this country and level
  if (content.financialRequirements && 
      content.financialRequirements[country] &&
      content.financialRequirements[country][level]) {
    
    const specificContent = content.financialRequirements[country][level];
    content = `${specificContent.title}\n\n${specificContent.content}`;
    
    // Add tips if available
    if (specificContent.tips && specificContent.tips.length > 0) {
      content += `\n\n💡 **Tips:**\n`;
      specificContent.tips.forEach(tip => {
        content += `• ${tip}\n`;
      });
    }
  } else {
    // Generic content if no specific data
    content += `For ${level || 'your chosen level'} studies in ${country || 'your chosen country'}, you'll need to show funds for:\n\n• Tuition fees (first year)\n• Living expenses (12 months)\n• Health insurance coverage\n\n💡 Tip: Most universities provide specific cost estimates on their websites.`;
    
    // Add country-specific general info if available
    if (country && content.financialRequirements && content.financialRequirements[country]) {
      const countryInfo = Object.values(content.financialRequirements[country])[0];
      if (countryInfo && countryInfo.content) {
        content += `\n\n**General ${country} Requirements:**\n`;
        // Extract first paragraph for general info
        const firstPara = countryInfo.content.split('\n\n')[0];
        content += firstPara;
      }
    }
  }

  addMessage('bot', content);

  showActionButtons([
    { text: '🎓 Scholarship Options', action: () => showScholarships(), icon: 'fas fa-award' },
    { text: '📄 Visa Documentation', action: () => showVisaExpectations(), icon: 'fas fa-file-alt' },
    { text: '🏠 Back to Menu', action: () => showTopicSelection(), icon: 'fas fa-home' }
  ]);
}

function showScholarships() {
  updateStatus('Scholarship Information');

  const academic = userProfile.academicPerformance || 'your academic level';
  
  let content = `🎓 **Scholarship Opportunities**\n\n`;
  
  // Get scholarship info based on academic performance
  if (content.scholarships && 
      content.scholarships.byPerformance &&
      content.scholarships.byPerformance[academic]) {
    
    const scholarshipInfo = content.scholarships.byPerformance[academic];
    content = `${scholarshipInfo.title}\n\n`;
    
    if (scholarshipInfo.opportunities && scholarshipInfo.opportunities.length > 0) {
      scholarshipInfo.opportunities.forEach(opp => {
        content += `• ${opp}\n`;
      });
    }
    
    if (scholarshipInfo.eligibility) {
      content += `\n📋 **Eligibility:** ${scholarshipInfo.eligibility}\n`;
    }
    
    if (scholarshipInfo.deadlines) {
      content += `⏰ **Apply:** ${scholarshipInfo.deadlines}\n`;
    }
    
    // Add tips if available
    if (scholarshipInfo.tips && scholarshipInfo.tips.length > 0) {
      content += `\n💡 **Application Tips:**\n`;
      scholarshipInfo.tips.forEach(tip => {
        content += `• ${tip}\n`;
      });
    }
  } else {
    // Generic content
    content += `Based on your ${academic} academic profile:\n\n1. **University Scholarships** - Check each university's website\n2. **Country Scholarships** - Government-funded programs\n3. **External Scholarships** - Private organizations\n\n⏰ Apply 6-8 months before your intended start date.`;
  }

  addMessage('bot', content);

  showActionButtons([
    { text: '💰 Financial Planning', action: () => showFinancialRequirements(), icon: 'fas fa-calculator' },
    { text: '📅 Application Timeline', action: () => showIntakeTimelines(), icon: 'fas fa-calendar' },
    { text: '🏠 Back to Menu', action: () => showTopicSelection(), icon: 'fas fa-home' }
  ]);
}

function showVisaExpectations() {
  updateStatus('Visa Guidance');

  const country = userProfile.targetCountry;
  const gap = userProfile.studyGap || 'No Gap';
  
  let content = `📄 **Visa Requirements**\n\n`;
  
  // Get visa info for the selected country
  if (content.visaRequirements && content.visaRequirements[country]) {
    
    const visaInfo = content.visaRequirements[country].all || content.visaRequirements[country];
    
    content = `${visaInfo.title}\n\n${visaInfo.content}`;
    
    // Add checklist if available
    if (visaInfo.checklist && visaInfo.checklist.length > 0) {
      content += `\n\n✅ **Document Checklist:**\n`;
      visaInfo.checklist.forEach(item => {
        content += `• ${item}\n`;
      });
    }
  } else {
    // Generic content
    content += `Key documents needed:\n• University offer letter\n• Financial proof\n• English test results\n• Genuine student statement\n• Health insurance\n• Passport valid for 6+ months`;
  }

  // Add gap explanation if applicable
  if (content.gapExplanations && content.gapExplanations[gap]) {
    content += `\n\n📝 **Study Gap Information:**\n${content.gapExplanations[gap]}`;
  } else if (gap !== 'No Gap') {
    content += `\n\n📝 **Note about study gap:** Since you have a ${gap.toLowerCase()}, prepare a clear explanation including:\n• What you did during the gap\n• How it relates to your study goals\n• Any skills/experience gained`;
  }

  addMessage('bot', content);

  showActionButtons([
    { text: '🗣️ English Test Help', action: () => showEnglishGuidance(), icon: 'fas fa-language' },
    { text: '🤝 Counselor Support', action: () => showCounselorConnection(), icon: 'fas fa-headset' },
    { text: '🏠 Back to Menu', action: () => showTopicSelection(), icon: 'fas fa-home' }
  ]);
}

function showEnglishGuidance() {
  updateStatus('English Test Help');

  const country = userProfile.targetCountry;
  const level = userProfile.intendedLevel;
  const status = userProfile.englishTestStatus || 'Not Started';
  
  let content = `🗣️ **English Test Guidance**\n\n`;
  
  // Get specific English requirements
  if (content.englishRequirements && 
      content.englishRequirements[country] &&
      content.englishRequirements[country][level]) {
    
    const engInfo = content.englishRequirements[country][level];
    content += `**${level} Requirements for ${country}:**\n`;
    content += `• Minimum: ${engInfo.requirement}\n`;
    
    if (engInfo.alternatives && engInfo.alternatives.length > 0) {
      content += `\n**Accepted Alternatives:**\n`;
      engInfo.alternatives.forEach(alt => {
        content += `• ${alt}\n`;
      });
    }
    
    if (engInfo.exceptions) {
      content += `\n**Exceptions:** ${engInfo.exceptions}\n`;
    }
  } else {
    // Generic requirements
    content += `📊 General English requirements:\n`;
    content += `• Diploma/Bachelor's: IELTS 6.0-6.5\n`;
    content += `• Master's/PhD: IELTS 6.5-7.0+\n`;
    content += `• Book through official test centers only.\n`;
  }

  // Add status-specific advice
  content += `\n${getEnglishAdvice(status)}`;

  addMessage('bot', content);

  showActionButtons([
    { text: '📅 Timeline Planning', action: () => showIntakeTimelines(), icon: 'fas fa-calendar' },
    { text: '🎓 University Requirements', action: () => showScholarships(), icon: 'fas fa-university' },
    { text: '🏠 Back to Menu', action: () => showTopicSelection(), icon: 'fas fa-home' }
  ]);
}

function getEnglishAdvice(status) {
  switch (status) {
    case 'Completed':
      return '✅ **Great!** Make sure your scores meet the requirements of your chosen universities. Keep your test results valid for visa application.';
    case 'Booked':
      return '📅 **Good planning!** Schedule your test 2-3 months before application deadlines. Allow time for retakes if needed.';
    default:
      return '⏰ **Start preparing now!** Most students need 2-4 months of preparation before taking the test. Consider test preparation courses if needed.';
  }
}

function showIntakeTimelines() {
  updateStatus('Timeline Planning');

  const country = userProfile.targetCountry || 'your chosen country';
  
  let content = `📅 **Application Timeline for ${country}**\n\n`;
  
  // Get specific timeline based on country
  if (content.intakeTimelines && content.intakeTimelines[country]) {
    const timelineInfo = content.intakeTimelines[country];
    content += `**Main Intakes:** ${timelineInfo.intakes}\n\n`;
    
    if (timelineInfo.deadlines) {
      content += `**Application Deadlines:**\n`;
      Object.entries(timelineInfo.deadlines).forEach(([intake, deadline]) => {
        content += `• ${intake} intake: ${deadline}\n`;
      });
    }
    
    if (timelineInfo.timeline) {
      content += `\n${timelineInfo.timeline}`;
    }
  } else {
    // Generic timeline
    content += `Main intakes:\n• ${getIntakePeriods(country)}\n\n`;
    content += `**Recommended schedule:**\n`;
    content += `• Now: Research & shortlist universities\n`;
    content += `• +1-2 months: Prepare and take English tests\n`;
    content += `• +3-4 months: Submit applications\n`;
    content += `• +6-8 months: Apply for visa\n`;
    content += `• +8-10 months: Arrange accommodation\n`;
    content += `• +11-12 months: Pre-departure preparations\n\n`;
    content += `**Start early for best options!**`;
  }

  addMessage('bot', content);

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

  addMessage('bot', `🤝 **Free Expert Consultation**\n\nOur study abroad counselors can help you:\n\n• Choose the right universities and courses\n• Review your application documents\n• Guide you through visa preparation\n• Provide personalized timeline\n• Scholarship application assistance\n\nAll consultations are **completely free!**`);

  showActionButtons([
    { text: '📱 Connect on WhatsApp', action: () => connectViaWhatsApp(), type: 'primary', icon: 'fab fa-whatsapp' },
    { text: '📞 Schedule a Call', action: () => scheduleCall(), icon: 'fas fa-phone-alt' },
    { text: '📧 Email Inquiry', action: () => sendEmail(), icon: 'fas fa-envelope' },
    { text: '🏠 Back to Menu', action: () => showTopicSelection(), icon: 'fas fa-home' }
  ]);
}

function connectViaWhatsApp() {
  const phone = '+1234567890';
  const message = `Hello! I need study abroad consultation. My profile:\nCountry: ${userProfile.targetCountry || 'Not selected'}\nLevel: ${userProfile.intendedLevel || 'Not selected'}\nAcademic: ${userProfile.academicPerformance || 'Not selected'}`;
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');

  addMessage('user', 'Requested WhatsApp consultation');
  setTimeout(() => {
    addMessage('bot', '✅ A counselor will contact you on WhatsApp shortly! They can help with:\n• University selection\n• Application process\n• Visa guidance\n• Scholarship applications\n\nNeed anything else?');
    setTimeout(() => showTopicSelection(), 1500);
  }, 500);
}

function scheduleCall() {
  addMessage('user', 'Requested callback consultation');
  setTimeout(() => {
    addMessage('bot', '📞 Great! A counselor will call you within 24 hours at your preferred time.\n\nFor immediate help, try WhatsApp or email.\n\n**Office Hours:** 9 AM - 6 PM (Monday to Saturday)');
    setTimeout(() => showTopicSelection(), 1500);
  }, 500);
}

function sendEmail() {
  const email = 'consultation@studyabroad.com';
  const subject = 'Study Abroad Consultation Request';
  const body = `Hello,\n\nI would like to schedule a consultation for study abroad.\n\nMy profile:\n- Target Country: ${userProfile.targetCountry || 'Not selected'}\n- Study Level: ${userProfile.intendedLevel || 'Not selected'}\n- Academic Performance: ${userProfile.academicPerformance || 'Not selected'}\n- Preferred Contact Time: \n\nThank you.`;
  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoLink;
  
  addMessage('user', 'Sent email inquiry');
  setTimeout(() => {
    addMessage('bot', '📧 Email sent successfully! A counselor will respond within 24 hours.\n\nCheck your spam folder if you don\'t see our reply.');
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
  // Remove existing action buttons
  const existingActionButtons = document.querySelectorAll('.action-buttons-message');
  existingActionButtons.forEach(btn => btn.remove());
  
  // Remove existing progress bars
  const existingProgress = document.querySelectorAll('.progress-message');
  existingProgress.forEach(prog => prog.remove());

  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'message bot-message action-buttons-message';
  
  let buttonsHTML = '<div class="action-buttons">';
  
  buttons.forEach(btn => {
    buttonsHTML += `
      <button class="action-btn ${btn.type || ''}">
        ${btn.icon ? `<i class="${btn.icon} btn-icon"></i>` : ''}
        <span class="btn-text">${btn.text}</span>
      </button>
    `;
  });
  
  buttonsHTML += '</div>';
  buttonContainer.innerHTML = buttonsHTML;
  
  chatArea.appendChild(buttonContainer);
  
  // Attach event listeners
  const actionBtns = buttonContainer.querySelectorAll('.action-btn');
  actionBtns.forEach((button, index) => {
    button.onclick = buttons[index].action;
  });
  
  chatArea.scrollTop = chatArea.scrollHeight;
}

function updateProgress(percent, text) {
  // Remove existing progress bars
  const existingProgress = document.querySelectorAll('.progress-message');
  existingProgress.forEach(prog => prog.remove());

  const progressDiv = document.createElement('div');
  progressDiv.className = 'message bot-message progress-message';
  
  progressDiv.innerHTML = `
    <div class="progress-container">
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${percent}%"></div>
      </div>
      <div class="progress-text">${text}</div>
    </div>
  `;
  
  chatArea.appendChild(progressDiv);
  chatArea.scrollTop = chatArea.scrollHeight;
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
    showWelcomePhase();
  }
}
