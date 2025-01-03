import fetch from 'node-fetch';

const OLLAMA_URL = 'http://127.0.0.1:11434/api/generate';

export async function generateResponse(message) {
  const response = await fetch(OLLAMA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3.2',
      prompt: message,
      stream: false
    })
  });
  
  const data = await response.json();
  return data.response;
}