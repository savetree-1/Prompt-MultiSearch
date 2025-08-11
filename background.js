// Background service worker for Prompt MultiSearch Extension

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'searchLLMs') {
        handleLLMSearch(request.prompt)
            .then(results => sendResponse(results))
            .catch(error => {
                console.error('Background search error:', error);
                sendResponse({
                    huggingface: { success: false, error: error.message },
                    cohere: { success: false, error: error.message },
                    ai21: { success: false, error: error.message },
                    groq: { success: false, error: error.message }
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
        huggingface: searchHuggingFace(prompt, keys.huggingface),
        cohere: searchCohere(prompt, keys.cohere),
        ai21: searchAI21(prompt, keys.ai21),
        groq: searchGroq(prompt, keys.groq)
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
        huggingface: searchHuggingFace,
        cohere: searchCohere,
        ai21: searchAI21,
        groq: searchGroq
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
        chrome.storage.sync.get(['huggingface_key', 'cohere_key', 'ai21_key', 'groq_key'], (result) => {
            resolve({
                huggingface: result.huggingface_key,
                cohere: result.cohere_key,
                ai21: result.ai21_key,
                groq: result.groq_key
            });
        });
    });
}

// Hugging Face Inference API
async function searchHuggingFace(prompt, apiKey) {
    if (!apiKey) {
        return { success: false, error: 'NO_API_KEY' };
    }

    try {
        // Using microsoft/DialoGPT-medium for conversational responses
        const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    max_length: 1000,
                    temperature: 0.7,
                    return_full_text: false
                },
                options: {
                    wait_for_model: true
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        const data = await response.json();
        
        // Handle different response formats from Hugging Face
        let content;
        if (Array.isArray(data) && data[0]) {
            content = data[0].generated_text || data[0].summary_text || data[0].translation_text;
        } else if (data.generated_text) {
            content = data.generated_text;
        }
        
        if (!content) {
            throw new Error('No content in response');
        }

        return { success: true, data: content };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Cohere API
async function searchCohere(prompt, apiKey) {
    if (!apiKey) {
        return { success: false, error: 'NO_API_KEY' };
    }

    try {
        const response = await fetch('https://api.cohere.ai/v1/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'command-light',
                prompt: prompt,
                max_tokens: 1000,
                temperature: 0.7,
                k: 0,
                stop_sequences: [],
                return_likelihoods: 'NONE'
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP ${response.status}`);
        }

        const data = await response.json();
        const content = data.generations?.[0]?.text;
        
        if (!content) {
            throw new Error('No content in response');
        }

        return { success: true, data: content.trim() };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// AI21 Labs API
async function searchAI21(prompt, apiKey) {
    if (!apiKey) {
        return { success: false, error: 'NO_API_KEY' };
    }

    try {
        const response = await fetch('https://api.ai21.com/studio/v1/j2-light/complete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                prompt: prompt,
                numResults: 1,
                maxTokens: 1000,
                temperature: 0.7,
                topKReturn: 0,
                topP: 1,
                stopSequences: []
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || errorData.message || `HTTP ${response.status}`);
        }

        const data = await response.json();
        const content = data.completions?.[0]?.data?.text;
        
        if (!content) {
            throw new Error('No content in response');
        }

        return { success: true, data: content.trim() };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Groq API
async function searchGroq(prompt, apiKey) {
    if (!apiKey) {
        return { success: false, error: 'NO_API_KEY' };
    }

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'llama3-8b-8192',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
                max_tokens: 1000,
                top_p: 1,
                stream: false
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