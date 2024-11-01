import { createParser } from 'eventsource-parser';

const getApiKey = () => {
  const customKey = localStorage.getItem('togetherApiKey');
  return customKey || import.meta.env.VITE_TOGETHER_API_KEY;
};

export async function* streamBookGeneration(prompt: string) {
  const response = await fetch('https://api.together.xyz/inference', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getApiKey()}`,
    },
    body: JSON.stringify({
      model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
      prompt: prompt,
      max_tokens: 4096,
      temperature: 0.7,
      top_p: 0.7,
      top_k: 50,
      repetition_penalty: 1,
      stream: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const parser = createParser((event) => {
    if (event.type === 'event') {
      try {
        if (event.data === '[DONE]') return;
        const data = JSON.parse(event.data);
        return data.choices[0]?.text || '';
      } catch (e) {
        console.warn('Error parsing JSON:', e);
        return ''; // Return empty string on parse error
      }
    }
  });

  const decoder = new TextDecoder();
  const reader = response.body?.getReader();
  if (!reader) throw new Error('No reader available');

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      parser.feed(chunk);

      const lines = chunk.split('\n').filter(line => line.trim() !== '');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            const text = parsed.choices[0]?.text || '';
            if (text) yield text;
          } catch (e) {
            console.warn('Error parsing chunk:', e);
            continue; // Skip invalid chunks
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}