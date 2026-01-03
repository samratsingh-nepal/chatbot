// Study Abroad Knowledge Database
// This database powers the chatbot responses

class StudyAbroadDatabase {
    constructor() {
        this.dbName = 'study_abroad_db';
        this.initDatabase();
    }

    initDatabase() {
        // Check if database exists in localStorage
        if (!localStorage.getItem(this.dbName)) {
            // Initialize with default data
            const defaultData = {
                countries: {
                    canada: {
                        id: "canada",
                        name: "Canada",
                        flag: "🇨🇦",
                        color: "#dc2626",
                        description: "Popular for Nepali students with Post-Graduation Work Permit (PGWP) opportunities.",
                        active: true,
                        lastUpdated: new Date().toISOString(),
                        topics: {
                            admissions: {
                                title: "Canada Admissions 2026",
                                content: "For September 2026 intake, most universities require:<br><br>• <strong>IELTS:</strong> 6.5 overall (no band below 6.0) or <strong>PTE:</strong> 58+<br>• <strong>Deadlines:</strong> Jan-Mar 2026 for most programs<br>• <strong>SDS Stream:</strong> Requires upfront tuition payment & GIC of CAD 20,635<br>• <strong>Popular programs:</strong> Business, IT, Engineering, Healthcare",
                                keywords: ["ielts", "deadline", "sds", "gic", "requirements"],
                                priority: 1
                            },
                            scholarships: {
                                title: "Canada Scholarships 2026",
                                content: "Major scholarship opportunities:<br><br>• <strong>Lester B. Pearson Scholarship</strong> - Full tuition at University of Toronto<br>• <strong>Vanier Canada Graduate Scholarships</strong> - CAD 50,000/year for PhD<br>• <strong>University Entrance Awards</strong> - Automatic consideration with 3.5+ GPA<br>• Provincial scholarships available in BC, Ontario, Alberta",
                                keywords: ["scholarship", "funding", "award", "financial aid"],
                                priority: 2
                            },
                            visa: {
                                title: "Canada Visa Requirements",
                                content: "2026 Student Direct Stream (SDS) requirements:<br><br>• <strong>GIC:</strong> CAD 20,635 in designated bank<br>• <strong>Medical Exam:</strong> From panel physicians<br>• <strong>NOC from MoEST:</strong> Mandatory for Nepali students (NPR 2,000)<br>• <strong>Processing Time:</strong> 20-45 calendar days for SDS",
                                keywords: ["visa", "noc", "medical", "processing", "sds"],
                                priority: 1
                            }
                        }
                    },
                    australia: {
                        id: "australia",
                        name: "Australia",
                        flag: "🇦🇺",
                        color: "#1d4ed8",
                        description: "Known for the Genuine Student requirement and strong post-study work rights.",
                        active: true,
                        lastUpdated: new Date().toISOString(),
                        topics: {
                            admissions: {
                                title: "Australia Admissions 2026",
                                content: "Key requirements for 2026 intake:<br><br>• <strong>Genuine Student (GS) requirement:</strong> Strong SOP crucial<br>• <strong>IELTS:</strong> 6.0 for UG, 6.5 for PG (no band below 5.5)<br>• <strong>Financial Proof:</strong> NPR 45-55 Lakhs from A-class banks<br>• <strong>Popular:</strong> IT at UTS, Nursing at UQ, Business at Monash",
                                keywords: ["ielts", "gs", "genuine student", "financial", "requirements"],
                                priority: 1
                            }
                        }
                    }
                },
                common: {
                    noc: {
                        title: "NOC Process for Nepali Students",
                        content: "All Nepali students must obtain a <strong>No Objection Certificate (NOC)</strong> from the MoEST portal:<br><br>• <strong>Process:</strong> 7-10 working days<br>• <strong>Fee:</strong> NPR 2,000<br>• <strong>Documents:</strong> Offer letter, passport copy, academic transcripts<br>• <strong>Portal:</strong> https://moest.gov.np",
                        keywords: ["noc", "moest", "certificate", "mandatory"],
                        category: "documentation"
                    },
                    timeline: {
                        title: "2026 Application Timeline",
                        content: "Recommended timeline for 2026 intake:<br><br>• <strong>12-15 months before:</strong> Start research & shortlist<br>• <strong>10-12 months before:</strong> Take IELTS/TOEFL<br>• <strong>8-10 months before:</strong> Apply to universities<br>• <strong>6-8 months before:</strong> Receive offers<br>• <strong>4-6 months before:</strong> Apply for NOC & visa<br>• <strong>2-3 months before:</strong> Final preparations",
                        keywords: ["timeline", "deadline", "schedule", "planning"],
                        category: "general"
                    }
                },
                universities: {
                    "university-of-toronto": {
                        name: "University of Toronto",
                        country: "canada",
                        ranking: "1 in Canada",
                        deadline: "2026-01-15",
                        requirements: "IELTS 6.5, GPA 3.0+",
                        scholarships: ["Lester B. Pearson", "UofT Scholars"]
                    }
                },
                faqs: [
                    {
                        id: "faq1",
                        question: "What is the minimum IELTS score for Canada?",
                        answer: "For most Canadian universities, minimum IELTS is 6.5 overall with no band below 6.0. Some colleges accept 6.0.",
                        category: "language",
                        views: 1250
                    }
                ],
                statistics: {
                    totalCountries: 8,
                    totalFAQs: 45,
                    lastUpdated: new Date().toISOString(),
                    admin: {
                        username: "admin",
                        // Note: In production, use proper authentication
                        password: "admin123" 
                    }
                }
            };
            this.saveDatabase(defaultData);
        }
    }

    // Get entire database
    getDatabase() {
        const db = localStorage.getItem(this.dbName);
        return db ? JSON.parse(db) : null;
    }

    // Save entire database
    saveDatabase(data) {
        localStorage.setItem(this.dbName, JSON.stringify(data));
        return true;
    }

    // CRUD Operations for Countries
    getCountries() {
        const db = this.getDatabase();
        return db ? db.countries : {};
    }

    getCountry(countryId) {
        const db = this.getDatabase();
        return db?.countries?.[countryId] || null;
    }

    addCountry(countryData) {
        const db = this.getDatabase();
        if (!db) return false;
        
        const countryId = countryData.id.toLowerCase().replace(/ /g, '-');
        countryData.lastUpdated = new Date().toISOString();
        
        db.countries[countryId] = countryData;
        db.statistics.totalCountries = Object.keys(db.countries).length;
        db.statistics.lastUpdated = new Date().toISOString();
        
        return this.saveDatabase(db);
    }

    updateCountry(countryId, updates) {
        const db = this.getDatabase();
        if (!db?.countries?.[countryId]) return false;
        
        updates.lastUpdated = new Date().toISOString();
        db.countries[countryId] = { ...db.countries[countryId], ...updates };
        db.statistics.lastUpdated = new Date().toISOString();
        
        return this.saveDatabase(db);
    }

    deleteCountry(countryId) {
        const db = this.getDatabase();
        if (!db?.countries?.[countryId]) return false;
        
        delete db.countries[countryId];
        db.statistics.totalCountries = Object.keys(db.countries).length;
        db.statistics.lastUpdated = new Date().toISOString();
        
        return this.saveDatabase(db);
    }

    // CRUD for Country Topics
    getCountryTopic(countryId, topicId) {
        const country = this.getCountry(countryId);
        return country?.topics?.[topicId] || null;
    }

    updateCountryTopic(countryId, topicId, topicData) {
        const db = this.getDatabase();
        if (!db?.countries?.[countryId]) return false;
        
        if (!db.countries[countryId].topics) {
            db.countries[countryId].topics = {};
        }
        
        db.countries[countryId].topics[topicId] = topicData;
        db.countries[countryId].lastUpdated = new Date().toISOString();
        db.statistics.lastUpdated = new Date().toISOString();
        
        return this.saveDatabase(db);
    }

    // CRUD for FAQs
    getFAQs() {
        const db = this.getDatabase();
        return db?.faqs || [];
    }

    addFAQ(faqData) {
        const db = this.getDatabase();
        if (!db) return false;
        
        const newFAQ = {
            id: `faq${Date.now()}`,
            ...faqData,
            views: 0
        };
        
        db.faqs.push(newFAQ);
        db.statistics.totalFAQs = db.faqs.length;
        db.statistics.lastUpdated = new Date().toISOString();
        
        return this.saveDatabase(db);
    }

    updateFAQ(faqId, updates) {
        const db = this.getDatabase();
        if (!db?.faqs) return false;
        
        const index = db.faqs.findIndex(f => f.id === faqId);
        if (index === -1) return false;
        
        db.faqs[index] = { ...db.faqs[index], ...updates };
        db.statistics.lastUpdated = new Date().toISOString();
        
        return this.saveDatabase(db);
    }

    deleteFAQ(faqId) {
        const db = this.getDatabase();
        if (!db?.faqs) return false;
        
        db.faqs = db.faqs.filter(f => f.id !== faqId);
        db.statistics.totalFAQs = db.faqs.length;
        db.statistics.lastUpdated = new Date().toISOString();
        
        return this.saveDatabase(db);
    }

    // Search functionality for chatbot
    searchAnswer(query) {
        const db = this.getDatabase();
        const results = [];
        const lowerQuery = query.toLowerCase();
        
        // Search in country topics
        Object.values(db.countries).forEach(country => {
            if (country.active) {
                Object.values(country.topics || {}).forEach(topic => {
                    const content = topic.content.toLowerCase();
                    const title = topic.title.toLowerCase();
                    const keywords = topic.keywords || [];
                    
                    let score = 0;
                    if (title.includes(lowerQuery)) score += 3;
                    if (content.includes(lowerQuery)) score += 2;
                    keywords.forEach(kw => {
                        if (lowerQuery.includes(kw.toLowerCase())) score += 1;
                    });
                    
                    if (score > 0) {
                        results.push({
                            type: 'country_topic',
                            country: country.name,
                            topic: topic.title,
                            content: topic.content,
                            score: score
                        });
                    }
                });
            }
        });
        
        // Search in common topics
        Object.values(db.common).forEach(topic => {
            const content = topic.content.toLowerCase();
            const title = topic.title.toLowerCase();
            
            if (title.includes(lowerQuery) || content.includes(lowerQuery)) {
                results.push({
                    type: 'common',
                    topic: topic.title,
                    content: topic.content,
                    score: 2
                });
            }
        });
        
        // Search in FAQs
        db.faqs.forEach(faq => {
            const question = faq.question.toLowerCase();
            const answer = faq.answer.toLowerCase();
            
            if (question.includes(lowerQuery) || answer.includes(lowerQuery)) {
                results.push({
                    type: 'faq',
                    question: faq.question,
                    answer: faq.answer,
                    score: 1
                });
            }
        });
        
        // Sort by score (highest first)
        results.sort((a, b) => b.score - a.score);
        return results.slice(0, 3); // Return top 3 results
    }

    // Export database as JSON file
    exportDatabase() {
        const db = this.getDatabase();
        const dataStr = JSON.stringify(db, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `study_abroad_db_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // Import database from JSON file
    importDatabase(file, callback) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                // Validate structure
                if (importedData.countries && importedData.common) {
                    this.saveDatabase(importedData);
                    callback(true, "Database imported successfully!");
                } else {
                    callback(false, "Invalid database format");
                }
            } catch (error) {
                callback(false, "Error parsing JSON file");
            }
        };
        reader.readAsText(file);
    }

    // Reset to default database
    resetDatabase() {
        localStorage.removeItem(this.dbName);
        this.initDatabase();
        return true;
    }

    // Backup current database
    backupDatabase() {
        return this.getDatabase();
    }

    // Restore from backup
    restoreDatabase(backupData) {
        return this.saveDatabase(backupData);
    }
}

// Create global instance
const studyAbroadDB = new StudyAbroadDatabase();