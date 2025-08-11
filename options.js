document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const saveAllBtn = document.getElementById('saveAllBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const testAllBtn = document.getElementById('testAllBtn');
    const notification = document.getElementById('notification');
    
    const llmConfigs = [
        { name: 'huggingface', key: 'huggingface_key', displayName: 'Hugging Face' },
        { name: 'cohere', key: 'cohere_key', displayName: 'Cohere' },
        { name: 'ai21', key: 'ai21_key', displayName: 'AI21 Labs' },
        { name: 'groq', key: 'groq_key', displayName: 'Groq' },
        { name: 'gemini', key: 'gemini_key', displayName: 'Google Gemini' }
    ];

    // Initialize
    loadApiKeys();
    setupEventListeners();

    function setupEventListeners() {
        // Save all button
        saveAllBtn.addEventListener('click', saveAllKeys);
        
        // Clear all button
        clearAllBtn.addEventListener('click', clearAllKeys);
        
        // Test all button
        testAllBtn.addEventListener('click', testAllConnections);
        
        // Individual save buttons
        document.querySelectorAll('.save-single').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const llm = e.target.dataset.llm;
                saveSingleKey(llm);
            });
        });
        
        // Visibility toggle buttons
        document.querySelectorAll('.toggle-visibility').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const inputId = e.target.dataset.input;
                togglePasswordVisibility(inputId);
            });
        });
        
        // Enter key to save
        llmConfigs.forEach(config => {
            const input = document.getElementById(`${config.name}-key`);
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    saveSingleKey(config.name);
                }
            });
        });
    }

    function loadApiKeys() {
        const keys = llmConfigs.map(config => config.key);
        
        chrome.storage.sync.get(keys, (result) => {
            llmConfigs.forEach(config => {
                const input = document.getElementById(`${config.name}-key`);
                const value = result[config.key];
                if (value) {
                    input.value = value;
                    showStatus(config.name, 'Key loaded', 'success');
                }
            });
        });
    }

    function saveSingleKey(llm) {
        const config = llmConfigs.find(c => c.name === llm);
        if (!config) return;
        
        const input = document.getElementById(`${llm}-key`);
        const value = input.value.trim();
        
        if (!value) {
            showStatus(llm, 'Please enter an API key', 'error');
            return;
        }
        
        // Basic validation
        if (!validateApiKey(llm, value)) {
            showStatus(llm, 'Invalid API key format', 'error');
            return;
        }
        
        const saveData = {};
        saveData[config.key] = value;
        
        chrome.storage.sync.set(saveData, () => {
            if (chrome.runtime.lastError) {
                showStatus(llm, 'Error saving key', 'error');
                console.error('Storage error:', chrome.runtime.lastError);
            } else {
                showStatus(llm, 'API key saved successfully', 'success');
                showNotification('API key saved!', 'success');
            }
        });
    }

    function saveAllKeys() {
        const saveData = {};
        let hasKeys = false;
        
        llmConfigs.forEach(config => {
            const input = document.getElementById(`${config.name}-key`);
            const value = input.value.trim();
            
            if (value) {
                if (validateApiKey(config.name, value)) {
                    saveData[config.key] = value;
                    hasKeys = true;
                } else {
                    showStatus(config.name, 'Invalid format', 'error');
                }
            }
        });
        
        if (!hasKeys) {
            showNotification('No valid API keys to save', 'error');
            return;
        }
        
        chrome.storage.sync.set(saveData, () => {
            if (chrome.runtime.lastError) {
                showNotification('Error saving API keys', 'error');
                console.error('Storage error:', chrome.runtime.lastError);
            } else {
                showNotification('All API keys saved successfully!', 'success');
                llmConfigs.forEach(config => {
                    if (saveData[config.key]) {
                        showStatus(config.name, 'Saved', 'success');
                    }
                });
            }
        });
    }

    function clearAllKeys() {
        if (!confirm('Are you sure you want to clear all API keys? This action cannot be undone.')) {
            return;
        }
        
        const keys = llmConfigs.map(config => config.key);
        
        chrome.storage.sync.remove(keys, () => {
            if (chrome.runtime.lastError) {
                showNotification('Error clearing API keys', 'error');
                console.error('Storage error:', chrome.runtime.lastError);
            } else {
                // Clear input fields
                llmConfigs.forEach(config => {
                    const input = document.getElementById(`${config.name}-key`);
                    input.value = '';
                    showStatus(config.name, 'Key cleared', 'success');
                });
                
                showNotification('All API keys cleared', 'success');
            }
        });
    }

    async function testAllConnections() {
        testAllBtn.disabled = true;
        testAllBtn.textContent = 'Testing...';
        
        const testPrompt = 'Hello, please respond with just "API connection successful"';
        
        for (const config of llmConfigs) {
            const input = document.getElementById(`${config.name}-key`);
            const apiKey = input.value.trim();
            
            if (!apiKey) {
                showStatus(config.name, 'No API key to test', 'error');
                continue;
            }
            
            showStatus(config.name, 'Testing connection...', 'testing');
            
            try {
                const result = await testConnection(config.name, apiKey, testPrompt);
                if (result.success) {
                    showStatus(config.name, 'Connection successful ✓', 'success');
                } else {
                    showStatus(config.name, `Test failed: ${result.error}`, 'error');
                }
            } catch (error) {
                showStatus(config.name, `Test error: ${error.message}`, 'error');
            }
            
            // Small delay between requests
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        testAllBtn.disabled = false;
        testAllBtn.textContent = 'Test All Connections';
        showNotification('Connection tests completed', 'info');
    }

    async function testConnection(llm, apiKey, prompt) {
        // Send test request to background script
        return new Promise((resolve) => {
            chrome.runtime.sendMessage({
                action: 'testConnection',
                llm: llm,
                apiKey: apiKey,
                prompt: prompt
            }, (response) => {
                resolve(response || { success: false, error: 'No response' });
            });
        });
    }

    function validateApiKey(llm, key) {
        const patterns = {
            huggingface: /^hf_[a-zA-Z0-9]{37}$/,
            cohere: /^[a-zA-Z0-9]{40,}$/,
            ai21: /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i,
            groq: /^gsk_[a-zA-Z0-9_-]{50,}$/,
            gemini: /^AIza[a-zA-Z0-9_-]{35}$/
        };
        
        const pattern = patterns[llm];
        return pattern ? pattern.test(key) : key.length > 10; // Fallback validation
    }

    function togglePasswordVisibility(inputId) {
        const input = document.getElementById(inputId);
        const button = document.querySelector(`[data-input="${inputId}"]`);
        
        if (input.type === 'password') {
            input.type = 'text';
            button.textContent = '🙈';
        } else {
            input.type = 'password';
            button.textContent = '👁️';
        }
    }

    function showStatus(llm, message, type) {
        const statusElement = document.getElementById(`${llm}-status`);
        statusElement.textContent = message;
        statusElement.className = `status-message show ${type}`;
        
        // Auto-hide after 5 seconds for success messages
        if (type === 'success') {
            setTimeout(() => {
                statusElement.classList.remove('show');
            }, 5000);
        }
    }

    function showNotification(message, type) {
        notification.textContent = message;
        notification.className = `notification ${type} show`;
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 4000);
    }
});