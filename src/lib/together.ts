const getApiKey = () => {
  const customKey = localStorage.getItem('togetherApiKey');
  return customKey || import.meta.env.VITE_TOGETHER_API_KEY;
};

export const streamBookGeneration = async function*(prompt: string) {
  const response = await fetch('https://api.together.xyz/inference', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getApiKey()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
      prompt,
      max_tokens: 4096,
      temperature: 0.7,
      stream: true
    })
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
};