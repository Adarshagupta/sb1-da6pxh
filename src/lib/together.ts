const TOGETHER_API_KEY = '118839dc9c48cdebd33af58b5175fbb02f8a30b8ab57567d018d0a49e2623c3a';
const API_URL = 'https://api.together.xyz/inference';

export async function* streamBookGeneration(prompt: string) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOGETHER_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo',
      prompt,
      max_tokens: 2000,
      temperature: 0.7,
      stream: true,
    }),
  });

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No reader available');

  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value);
    const lines = chunk.split('\n').filter(line => line.trim() !== '');
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = JSON.parse(line.slice(6));
        yield data.choices[0].text;
      }
    }
  }
}