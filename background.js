// Background service worker for Prompt MultiSearch Extension

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'searchLLMs') {
        handleLLMSearch(request.prompt)
            .then(results => sendResponse(results))
            .catch(error => {
                console.error('Background search error:', error);
                sendResponse({
                    openai: { success: false, error: error.message },
                    gemini: { success: false, error: error.message },
                    claude: { success: false, error: error.message },
                    mistral: { success: false, error: error.message }
                });
            });
        return true; // Keep message channel open for async response
    }
    
    if (request.action === 'testConnection') {
        handleTestConnection(request.llm, request.apiKey, request.prompt)
            .then(result => sendResponse(result))
            .catch(error => {
                console.error('Test connection error:', error);
                sendResponse({ success: false, error: error.message });
            });
        return true; // Keep message channel open for async response
    }
});

async function handleLLMSearch(prompt) {
    // Get API keys from storage
    const keys = await getApiKeys();
    
    // Create promises for each LLM
    const promises = {
        openai: searchOpenAI(prompt, keys.openai),
        gemini: searchGemini(prompt, keys.gemini),
        claude: searchClaude(prompt, keys.claude),
        mistral: searchMistral(prompt, keys.mistral)
    };

    // Execute all searches in parallel
    const results = {};
    for (const [llm, promise] of Object.entries(promises)) {
        try {
            results[llm] = await promise;
        } catch (error) {
            results[llm] = { success: false, error: error.message };
        }
    }

    return results;
}

async function handleTestConnection(llm, apiKey, prompt) {
    const testFunctions = {
        openai: searchOpenAI,
        gemini: searchGemini,
        claude: searchClaude,
        mistral: searchMistral
    };
    
    const testFunction = testFunctions[llm];
    if (!testFunction) {
        return { success: false, error: 'Unknown LLM provider' };
    }
    
    try {
        const result = await testFunction(prompt, apiKey);
        return result;
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function getApiKeys() {
    return new Promise((resolve) => {
        chrome.storage.sync.get(['openai_key', 'gemini_key', 'claude_key', 'mistral_key'], (result) => {
            resolve({
                openai: result.openai_key,
                gemini: result.gemini_key,
                claude: result.claude_key,
                mistral: result.mistral_key
            });
        });
    });
}

// OpenAI GPT API
async function searchOpenAI(prompt, apiKey) {
    if (!apiKey) {
        return { success: false, error: 'NO_API_KEY' };
    }

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `HTTP ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        
        if (!content) {
            throw new Error('No content in response');
        }

        return { success: true, data: content };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Google Gemini API
async function searchGemini(prompt, apiKey) {
    if (!apiKey) {
        return { success: false, error: 'NO_API_KEY' };
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1000
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `HTTP ${response.status}`);
        }

        const data = await response.json();
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!content) {
            throw new Error('No content in response');
        }

        return { success: true, data: content };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Anthropic Claude API
async function searchClaude(prompt, apiKey) {
    if (!apiKey) {
        return { success: false, error: 'NO_API_KEY' };
    }

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-haiku-20240307',
                max_tokens: 1000,
                messages: [{ role: 'user', content: prompt }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `HTTP ${response.status}`);
        }

        const data = await response.json();
        const content = data.content?.[0]?.text;
        
        if (!content) {
            throw new Error('No content in response');
        }

        return { success: true, data: content };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Mistral AI API
async function searchMistral(prompt, apiKey) {
    if (!apiKey) {
        return { success: false, error: 'NO_API_KEY' };
    }

    try {
        const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'mistral-tiny',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `HTTP ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        
        if (!content) {
            throw new Error('No content in response');
        }

        return { success: true, data: content };
    } catch (error) {
        return { success: false, error: error.message };
    }
}