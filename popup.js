document.addEventListener('DOMContentLoaded', function() {
    const promptInput = document.getElementById('promptInput');
    const searchBtn = document.getElementById('searchBtn');
    const searchText = document.getElementById('searchText');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const resultsContainer = document.getElementById('resultsContainer');
    const settingsBtn = document.getElementById('settingsBtn');
    const errorMessage = document.getElementById('errorMessage');

    // LLM configurations
    const llms = ['huggingface', 'cohere', 'ai21', 'groq', 'gemini'];
    
    // Event listeners
    settingsBtn.addEventListener('click', () => {
        chrome.tabs.create({ url: chrome.runtime.getURL('options.html') });
    });

    searchBtn.addEventListener('click', handleSearch);
    
    promptInput.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            handleSearch();
        }
    });

    async function handleSearch() {
        const prompt = promptInput.value.trim();
        
        if (!prompt) {
            showError('Please enter a prompt');
            return;
        }

        // Reset UI
        resetUI();
        setLoadingState(true);

        try {
            // Send message to background script
            const response = await chrome.runtime.sendMessage({
                action: 'searchLLMs',
                prompt: prompt
            });

            displayResults(response);
        } catch (error) {
            console.error('Search error:', error);
            showError('An error occurred while searching. Please try again.');
        } finally {
            setLoadingState(false);
        }
    }

    function resetUI() {
        hideError();
        resultsContainer.classList.remove('hidden');
        
        // Reset all result cards
        llms.forEach(llm => {
            const resultDiv = document.getElementById(`${llm}-result`);
            const statusDiv = document.getElementById(`${llm}-status`);
            
            resultDiv.innerHTML = '<div class="loading-text">Loading...</div>';
            statusDiv.className = 'status-indicator loading';
        });
    }

    function setLoadingState(isLoading) {
        searchBtn.disabled = isLoading;
        
        if (isLoading) {
            searchText.style.display = 'none';
            loadingSpinner.classList.remove('hidden');
        } else {
            searchText.style.display = 'inline';
            loadingSpinner.classList.add('hidden');
        }
    }

    function displayResults(results) {
        llms.forEach(llm => {
            const resultDiv = document.getElementById(`${llm}-result`);
            const statusDiv = document.getElementById(`${llm}-status`);
            const result = results[llm];

            if (result.success) {
                resultDiv.innerHTML = formatResponse(result.data);
                statusDiv.className = 'status-indicator success';
            } else if (result.error === 'NO_API_KEY') {
                resultDiv.innerHTML = `
                    <div class="no-key-text">
                        API key missing — <a href="#" onclick="chrome.tabs.create({url: chrome.runtime.getURL('options.html')})">set in Settings</a>
                    </div>
                `;
                statusDiv.className = 'status-indicator error';
            } else {
                resultDiv.innerHTML = `
                    <div class="error-text">
                        Error: ${result.error || 'Unknown error occurred'}
                    </div>
                `;
                statusDiv.className = 'status-indicator error';
            }
        });
    }

    function formatResponse(text) {
        // Basic formatting - convert line breaks and handle long text
        if (!text) return '<div class="error-text">No response received</div>';
        
        return text
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>')
            .replace(/^/, '<p>')
            .replace(/$/, '</p>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
        setTimeout(() => {
            hideError();
        }, 5000);
    }

    function hideError() {
        errorMessage.classList.add('hidden');
    }

    // Initialize
    promptInput.focus();
});