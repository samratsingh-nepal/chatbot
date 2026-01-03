// Admin Panel Script
document.addEventListener('DOMContentLoaded', function () {
    // Database instance
    const db = studyAbroadDB;

    // DOM Elements
    const navLinks = document.querySelectorAll('.nav-link');
    const tabContents = document.querySelectorAll('.tab-content');
    const pageTitle = document.getElementById('page-title');
    const refreshBtn = document.getElementById('refresh-btn');

    // Country elements
    const addCountryBtn = document.getElementById('add-country-btn');
    const countriesTableBody = document.getElementById('countries-table-body');
    const searchCountries = document.getElementById('search-countries');

    // FAQ elements
    const addFaqBtn = document.getElementById('add-faq-btn');
    const faqsTableBody = document.getElementById('faqs-table-body');
    const searchFaqs = document.getElementById('search-faqs');

    // Database tools
    const exportBtn = document.getElementById('export-btn');
    const importBtn = document.getElementById('import-btn');
    const importFile = document.getElementById('import-file');
    const resetBtn = document.getElementById('reset-btn');

    // Search test
    const testSearchBtn = document.getElementById('test-search-btn');
    const testSearchQuery = document.getElementById('test-search-query');
    const searchResults = document.getElementById('search-results');
    const searchResultsList = document.getElementById('search-results-list');

    // Modals
    const countryModal = document.getElementById('country-modal');
    const topicModal = document.getElementById('topic-modal');
    const faqModal = document.getElementById('faq-modal');

    // Current state
    let currentCountry = null;
    let currentTopic = null;
    let currentFaq = null;

    // Initialize admin panel
    function initAdminPanel() {
        loadStatistics();
        loadCountriesTable();
        setupEventListeners();
    }

    // Load statistics
    function loadStatistics() {
        const dbData = db.getDatabase();
        if (dbData) {
            document.getElementById('stat-countries').textContent =
                dbData.statistics.totalCountries || Object.keys(dbData.countries || {}).length;
            document.getElementById('stat-faqs').textContent =
                dbData.statistics.totalFAQs || (dbData.faqs || []).length;
            document.getElementById('stat-last-updated').textContent =
                formatDate(dbData.statistics.lastUpdated);
        }
    }

    // Setup event listeners
    function setupEventListeners() {
        // Navigation tabs
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const tabId = link.getAttribute('data-tab');

                // Update active tab
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // Show corresponding tab content
                tabContents.forEach(content => content.classList.remove('active'));
                document.getElementById(`${tabId}-tab`).classList.add('active');

                // Update page title
                pageTitle.textContent = link.textContent.trim();

                // Load tab content
                switch (tabId) {
                    case 'countries':
                        loadCountriesTable();
                        break;
                    case 'topics':
                        loadCountryTopicTabs();
                        break;
                    case 'faqs':
                        loadFAQsTable();
                        break;
                    case 'import-export':
                        // Nothing to load
                        break;
                    case 'search':
                        // Nothing to load
                        break;
                }
            });
        });

        // Refresh button
        refreshBtn.addEventListener('click', () => {
            const activeTab = document.querySelector('.nav-link.active').getAttribute('data-tab');
            switch (activeTab) {
                case 'countries':
                    loadCountriesTable();
                    break;
                case 'faqs':
                    loadFAQsTable();
                    break;
                case 'topics':
                    loadCountryTopicTabs();
                    break;
            }
            loadStatistics();
            showNotification('Data refreshed!', 'success');
        });

        // Country search
        searchCountries.addEventListener('input', debounce(() => {
            loadCountriesTable(searchCountries.value);
        }, 300));

        // FAQ search
        searchFaqs.addEventListener('input', debounce(() => {
            loadFAQsTable(searchFaqs.value);
        }, 300));

        // Add country button
        addCountryBtn.addEventListener('click', () => {
            openCountryModal();
        });

        // Add FAQ button
        addFaqBtn.addEventListener('click', () => {
            openFaqModal();
        });

        // Database export
        exportBtn.addEventListener('click', () => {
            db.exportDatabase();
            showNotification('Database exported successfully!', 'success');
        });

        // Database import
        importBtn.addEventListener('click', () => {
            if (importFile.files.length === 0) {
                showNotification('Please select a file first', 'error');
                return;
            }

            if (confirm('Warning: This will replace your current database. Continue?')) {
                db.importDatabase(importFile.files[0], (success, message) => {
                    if (success) {
                        showNotification(message, 'success');
                        loadStatistics();
                        loadCountriesTable();
                    } else {
                        showNotification(message, 'error');
                    }
                });
            }
        });

        // Reset database
        resetBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset the database to default values? This action cannot be undone.')) {
                db.resetDatabase();
                showNotification('Database reset to default values', 'success');
                loadStatistics();
                loadCountriesTable();
            }
        });

        // Test search
        testSearchBtn.addEventListener('click', () => {
            const query = testSearchQuery.value.trim();
            if (!query) {
                showNotification('Please enter a search query', 'error');
                return;
            }

            const results = db.searchAnswer(query);
            displaySearchResults(results);
        });

        // Country modal events
        setupCountryModal();
        setupTopicModal();
        setupFaqModal();
    }

    // Load countries table
    function loadCountriesTable(searchQuery = '') {
        const countries = db.getCountries();
        countriesTableBody.innerHTML = '';

        Object.values(countries).forEach(country => {
            if (searchQuery && !country.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                return;
            }

            const topicsCount = Object.keys(country.topics || {}).length;
            const lastUpdated = formatDate(country.lastUpdated);

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 24px;">${country.flag || '🌐'}</span>
                        <div>
                            <strong>${country.name}</strong><br>
                            <small style="color: #6b7280;">${country.description || 'No description'}</small>
                        </div>
                    </div>
                </td>
                <td>${topicsCount} topics</td>
                <td>
                    <span class="status-badge ${country.active ? 'status-active' : 'status-inactive'}">
                        ${country.active ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td>${lastUpdated}</td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn view" data-country="${country.id}" title="View Topics">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit" data-country="${country.id}" title="Edit Country">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" data-country="${country.id}" title="Delete Country">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;

            countriesTableBody.appendChild(row);
        });

        // Add event listeners to action buttons
        document.querySelectorAll('[data-country]').forEach(btn => {
            const countryId = btn.getAttribute('data-country');

            if (btn.classList.contains('view')) {
                btn.addEventListener('click', () => {
                    // Switch to topics tab and select this country
                    document.querySelector('[data-tab="topics"]').click();
                    setTimeout(() => {
                        const countryTab = document.querySelector(`[data-country-tab="${countryId}"]`);
                        if (countryTab) countryTab.click();
                    }, 100);
                });
            } else if (btn.classList.contains('edit')) {
                btn.addEventListener('click', () => {
                    openCountryModal(countryId);
                });
            } else if (btn.classList.contains('delete')) {
                btn.addEventListener('click', () => {
                    deleteCountry(countryId);
                });
            }
        });
    }

    // Load country topic tabs
    function loadCountryTopicTabs() {
        const countries = db.getCountries();
        const tabsContainer = document.getElementById('country-topic-tabs');
        const topicsContent = document.getElementById('topics-content');

        // Clear existing content
        tabsContainer.innerHTML = '';
        topicsContent.innerHTML = '<p style="text-align: center; padding: 40px; color: #6b7280;">Select a country to manage topics</p>';

        // Create tabs for each country
        Object.values(countries).forEach(country => {
            const tab = document.createElement('button');
            tab.className = 'tab';
            tab.setAttribute('data-country-tab', country.id);
            tab.textContent = `${country.flag || ''} ${country.name}`;

            tab.addEventListener('click', () => {
                // Update active tab
                document.querySelectorAll('[data-country-tab]').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Load topics for this country
                loadCountryTopics(country.id);
            });

            tabsContainer.appendChild(tab);
        });

        // Activate first tab if exists
        const firstTab = tabsContainer.querySelector('.tab');
        if (firstTab) {
            firstTab.classList.add('active');
            loadCountryTopics(firstTab.getAttribute('data-country-tab'));
        }
    }

    // Load topics for a specific country
    function loadCountryTopics(countryId) {
        const country = db.getCountry(countryId);
        const topicsContent = document.getElementById('topics-content');

        if (!country) {
            topicsContent.innerHTML = '<p style="text-align: center; padding: 40px; color: #6b7280;">Country not found</p>';
            return;
        }

        const topics = country.topics || {};

        topicsContent.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h4>Topics for ${country.name}</h4>
                <button class="btn btn-primary" id="add-topic-btn" data-country="${countryId}">
                    <i class="fas fa-plus"></i> Add Topic
                </button>
            </div>
            
            ${Object.keys(topics).length === 0 ?
                '<p style="text-align: center; padding: 40px; color: #6b7280;">No topics found. Add your first topic!</p>' :
                '<div id="topics-list"></div>'
            }
        `;

        // Add event listener to add topic button
        document.getElementById('add-topic-btn').addEventListener('click', (e) => {
            const countryId = e.target.getAttribute('data-country') ||
                e.target.closest('[data-country]').getAttribute('data-country');
            openTopicModal(countryId);
        });

        // Load topics list if exists
        if (Object.keys(topics).length > 0) {
            const topicsList = document.getElementById('topics-list');
            topicsList.innerHTML = '';

            Object.entries(topics).forEach(([topicId, topic]) => {
                const topicCard = document.createElement('div');
                topicCard.className = 'content-card';
                topicCard.style.marginBottom = '15px';
                topicCard.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div style="flex: 1;">
                            <h5 style="margin-bottom: 8px;">${topic.title}</h5>
                            <p style="color: #6b7280; font-size: 14px; margin-bottom: 12px;">
                                ${topic.content.substring(0, 150)}...
                            </p>
                            <div>
                                <span style="font-size: 12px; background: #e5e7eb; padding: 4px 8px; border-radius: 4px; margin-right: 8px;">
                                    Keywords: ${topic.keywords?.join(', ') || 'None'}
                                </span>
                                <span style="font-size: 12px; background: #dbeafe; padding: 4px 8px; border-radius: 4px;">
                                    Priority: ${topic.priority === 1 ? 'High' : topic.priority === 2 ? 'Medium' : 'Low'}
                                </span>
                            </div>
                        </div>
                        <div style="display: flex; gap: 8px; margin-left: 15px;">
                            <button class="action-btn edit" data-country="${countryId}" data-topic="${topicId}" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn delete" data-country="${countryId}" data-topic="${topicId}" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
                topicsList.appendChild(topicCard);
            });

            // Add event listeners to topic action buttons
            document.querySelectorAll('[data-country][data-topic]').forEach(btn => {
                const countryId = btn.getAttribute('data-country');
                const topicId = btn.getAttribute('data-topic');

                if (btn.classList.contains('edit')) {
                    btn.addEventListener('click', () => {
                        openTopicModal(countryId, topicId);
                    });
                } else if (btn.classList.contains('delete')) {
                    btn.addEventListener('click', () => {
                        deleteTopic(countryId, topicId);
                    });
                }
            });
        }
    }

    // Load FAQs table
    function loadFAQsTable(searchQuery = '') {
        const faqs = db.getFAQs();
        faqsTableBody.innerHTML = '';

        faqs.forEach(faq => {
            if (searchQuery && !faq.question.toLowerCase().includes(searchQuery.toLowerCase())) {
                return;
            }

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div>
                        <strong>${faq.question}</strong><br>
                        <small style="color: #6b7280;">${faq.answer.substring(0, 80)}...</small>
                    </div>
                </td>
                <td>
                    <span style="background: #e5e7eb; padding: 4px 12px; border-radius: 20px; font-size: 12px;">
                        ${faq.category}
                    </span>
                </td>
                <td>${faq.views}</td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn edit" data-faq="${faq.id}" title="Edit FAQ">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" data-faq="${faq.id}" title="Delete FAQ">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;

            faqsTableBody.appendChild(row);
        });

        // Add event listeners to FAQ action buttons
        document.querySelectorAll('[data-faq]').forEach(btn => {
            const faqId = btn.getAttribute('data-faq');

            if (btn.classList.contains('edit')) {
                btn.addEventListener('click', () => {
                    openFaqModal(faqId);
                });
            } else if (btn.classList.contains('delete')) {
                btn.addEventListener('click', () => {
                    deleteFAQ(faqId);
                });
            }
        });
    }

    // Setup country modal
    function setupCountryModal() {
        const modal = document.getElementById('country-modal');
        const closeBtn = document.getElementById('close-country-modal');
        const cancelBtn = document.getElementById('cancel-country');
        const saveBtn = document.getElementById('save-country');
        const form = document.getElementById('country-form');

        // Open modal
        window.openCountryModal = (countryId = null) => {
            const title = document.getElementById('modal-country-title');

            if (countryId) {
                // Edit mode
                const country = db.getCountry(countryId);
                if (!country) return;

                title.textContent = `Edit ${country.name}`;
                document.getElementById('country-id').value = country.id;
                document.getElementById('country-name').value = country.name;
                document.getElementById('country-code').value = country.id;
                document.getElementById('country-flag').value = country.flag || '';
                document.getElementById('country-color').value = country.color || '#3b82f6';
                document.getElementById('country-description').value = country.description || '';
                document.getElementById('country-active').checked = country.active !== false;

                currentCountry = countryId;
            } else {
                // Add mode
                title.textContent = 'Add New Country';
                form.reset();
                document.getElementById('country-color').value = '#3b82f6';
                document.getElementById('country-active').checked = true;
                currentCountry = null;
            }

            modal.classList.add('active');
        };

        // Close modal
        function closeModal() {
            modal.classList.remove('active');
            form.reset();
            currentCountry = null;
        }

        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);

        // Save country
        saveBtn.addEventListener('click', () => {
            const id = document.getElementById('country-id').value ||
                document.getElementById('country-code').value.toLowerCase().replace(/ /g, '-');
            const name = document.getElementById('country-name').value;

            if (!id || !name) {
                showNotification('Country name and code are required', 'error');
                return;
            }

            const countryData = {
                id: id,
                name: name,
                flag: document.getElementById('country-flag').value,
                color: document.getElementById('country-color').value,
                description: document.getElementById('country-description').value,
                active: document.getElementById('country-active').checked,
                topics: currentCountry ? db.getCountry(currentCountry)?.topics || {} : {}
            };

            if (currentCountry && currentCountry !== id) {
                // ID changed, need to delete old and create new
                db.deleteCountry(currentCountry);
            }

            const success = db.addCountry(countryData);

            if (success) {
                showNotification(`Country ${currentCountry ? 'updated' : 'added'} successfully!`, 'success');
                closeModal();
                loadStatistics();
                loadCountriesTable();
                loadCountryTopicTabs();
            } else {
                showNotification('Error saving country', 'error');
            }
        });
    }

    // Setup topic modal
    function setupTopicModal() {
        const modal = document.getElementById('topic-modal');
        const closeBtn = document.getElementById('close-topic-modal');
        const cancelBtn = document.getElementById('cancel-topic');
        const saveBtn = document.getElementById('save-topic');
        const form = document.getElementById('topic-form');

        // Open modal
        window.openTopicModal = (countryId, topicId = null) => {
            const title = document.getElementById('modal-topic-title');
            document.getElementById('topic-country-id').value = countryId;

            if (topicId) {
                // Edit mode
                const topic = db.getCountryTopic(countryId, topicId);
                if (!topic) return;

                title.textContent = `Edit Topic`;
                document.getElementById('topic-id').value = topicId;
                document.getElementById('topic-title').value = topic.title || '';
                document.getElementById('topic-content').value = topic.content || '';
                document.getElementById('topic-keywords').value = topic.keywords?.join(', ') || '';
                document.getElementById('topic-priority').value = topic.priority || '2';

                currentTopic = topicId;
            } else {
                // Add mode
                title.textContent = 'Add New Topic';
                form.reset();
                document.getElementById('topic-priority').value = '2';
                currentTopic = null;
            }

            modal.classList.add('active');
        };

        // Close modal
        function closeModal() {
            modal.classList.remove('active');
            form.reset();
            currentTopic = null;
        }

        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);

        // Save topic
        saveBtn.addEventListener('click', () => {
            const countryId = document.getElementById('topic-country-id').value;
            const topicId = document.getElementById('topic-id').value ||
                document.getElementById('topic-title').value.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
            const title = document.getElementById('topic-title').value;
            const content = document.getElementById('topic-content').value;

            if (!countryId || !title || !content) {
                showNotification('Title and content are required', 'error');
                return;
            }

            const topicData = {
                title: title,
                content: content,
                keywords: document.getElementById('topic-keywords').value.split(',').map(k => k.trim()).filter(k => k),
                priority: parseInt(document.getElementById('topic-priority').value)
            };

            const success = db.updateCountryTopic(countryId, topicId, topicData);

            if (success) {
                showNotification(`Topic ${currentTopic ? 'updated' : 'added'} successfully!`, 'success');
                closeModal();
                loadCountryTopics(countryId);
            } else {
                showNotification('Error saving topic', 'error');
            }
        });
    }

    // Setup FAQ modal
    function setupFaqModal() {
        const modal = document.getElementById('faq-modal');
        const closeBtn = document.getElementById('close-faq-modal');
        const cancelBtn = document.getElementById('cancel-faq');
        const saveBtn = document.getElementById('save-faq');
        const form = document.getElementById('faq-form');

        // Open modal
        window.openFaqModal = (faqId = null) => {
            const title = document.getElementById('modal-faq-title');

            if (faqId) {
                // Edit mode
                const faqs = db.getFAQs();
                const faq = faqs.find(f => f.id === faqId);
                if (!faq) return;

                title.textContent = `Edit FAQ`;
                document.getElementById('faq-id').value = faq.id;
                document.getElementById('faq-question').value = faq.question;
                document.getElementById('faq-answer').value = faq.answer;
                document.getElementById('faq-category').value = faq.category || 'general';

                currentFaq = faqId;
            } else {
                // Add mode
                title.textContent = 'Add New FAQ';
                form.reset();
                document.getElementById('faq-category').value = 'general';
                currentFaq = null;
            }

            modal.classList.add('active');
        };

        // Close modal
        function closeModal() {
            modal.classList.remove('active');
            form.reset();
            currentFaq = null;
        }

        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);

        // Save FAQ
        saveBtn.addEventListener('click', () => {
            const id = document.getElementById('faq-id').value || `faq${Date.now()}`;
            const question = document.getElementById('faq-question').value;
            const answer = document.getElementById('faq-answer').value;

            if (!question || !answer) {
                showNotification('Question and answer are required', 'error');
                return;
            }

            const faqData = {
                question: question,
                answer: answer,
                category: document.getElementById('faq-category').value
            };

            let success;
            if (currentFaq) {
                success = db.updateFAQ(currentFaq, faqData);
            } else {
                success = db.addFAQ(faqData);
            }

            if (success) {
                showNotification(`FAQ ${currentFaq ? 'updated' : 'added'} successfully!`, 'success');
                closeModal();
                loadStatistics();
                loadFAQsTable();
            } else {
                showNotification('Error saving FAQ', 'error');
            }
        });
    }

    // Delete country
    function deleteCountry(countryId) {
        if (confirm(`Are you sure you want to delete this country and all its topics?`)) {
            const success = db.deleteCountry(countryId);
            if (success) {
                showNotification('Country deleted successfully', 'success');
                loadStatistics();
                loadCountriesTable();
                loadCountryTopicTabs();
            } else {
                showNotification('Error deleting country', 'error');
            }
        }
    }

    // Delete topic
    function deleteTopic(countryId, topicId) {
        if (confirm('Are you sure you want to delete this topic?')) {
            const country = db.getCountry(countryId);
            if (country?.topics?.[topicId]) {
                delete country.topics[topicId];
                const success = db.updateCountry(countryId, { topics: country.topics });
                if (success) {
                    showNotification('Topic deleted successfully', 'success');
                    loadCountryTopics(countryId);
                } else {
                    showNotification('Error deleting topic', 'error');
                }
            }
        }
    }

    // Delete FAQ
    function deleteFAQ(faqId) {
        if (confirm('Are you sure you want to delete this FAQ?')) {
            const success = db.deleteFAQ(faqId);
            if (success) {
                showNotification('FAQ deleted successfully', 'success');
                loadStatistics();
                loadFAQsTable();
            } else {
                showNotification('Error deleting FAQ', 'error');
            }
        }
    }

    // Display search results for testing
    function displaySearchResults(results) {
        if (results.length === 0) {
            searchResultsList.innerHTML = `
                <div style="background: #fef2f2; padding: 20px; border-radius: 8px; text-align: center;">
                    <i class="fas fa-search" style="font-size: 24px; color: #ef4444; margin-bottom: 10px;"></i>
                    <p>No results found for your query.</p>
                    <small>Try different keywords or check if the information exists in the database.</small>
                </div>
            `;
        } else {
            let html = '';
            results.forEach((result, index) => {
                html += `
                    <div class="content-card" style="margin-bottom: 15px;">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                            <div>
                                <span style="background: #e5e7eb; padding: 2px 8px; border-radius: 4px; font-size: 12px;">
                                    ${result.type.toUpperCase()}
                                </span>
                                ${result.country ? `<span style="background: #dbeafe; padding: 2px 8px; border-radius: 4px; font-size: 12px; margin-left: 5px;">
                                    ${result.country}
                                </span>` : ''}
                                <span style="background: #d1fae5; padding: 2px 8px; border-radius: 4px; font-size: 12px; margin-left: 5px;">
                                    Score: ${result.score}
                                </span>
                            </div>
                        </div>
                        ${result.topic ? `<h5 style="margin-bottom: 8px;">${result.topic}</h5>` : ''}
                        ${result.question ? `<h5 style="margin-bottom: 8px;">Q: ${result.question}</h5>` : ''}
                        <p style="color: #4b5563; font-size: 14px; line-height: 1.5;">
                            ${result.content || result.answer || ''}
                        </p>
                    </div>
                `;
            });
            searchResultsList.innerHTML = html;
        }

        searchResults.style.display = 'block';
    }

    // Utility functions
    function formatDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function showNotification(message, type = 'info') {
        // Remove existing notification
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        `;

        if (type === 'success') {
            notification.style.background = '#10b981';
        } else if (type === 'error') {
            notification.style.background = '#ef4444';
        } else {
            notification.style.background = '#3b82f6';
        }

        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            ${message}
        `;

        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 3000);

        // Add CSS for animations
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Initialize
    initAdminPanel();
});