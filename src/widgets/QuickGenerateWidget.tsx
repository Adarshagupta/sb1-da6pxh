import React, { useState } from 'react';
import { Wand2 } from 'lucide-react';
import { streamBookGeneration } from '../lib/together';
import { auth, getUserTokens, updateUserTokens } from '../lib/firebase';

export const QuickGenerateWidget = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!auth.currentUser || !prompt || isGenerating) return;

    setIsGenerating(true);
    try {
      const userTokens = await getUserTokens(auth.currentUser.uid);
      if (userTokens < 1000) {
        alert('Not enough tokens');
        return;
      }

      const stream = streamBookGeneration(prompt);
      let fullText = '';
      
      for await (const chunk of stream) {
        fullText += chunk;
      }

      // Update tokens
      await updateUserTokens(auth.currentUser.uid, userTokens - 1000);

      // Open the main app to view the generated book
      window.open('/', '_blank');
    } catch (error) {
      console.error('Error generating book:', error);
      alert('Failed to generate book');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Generate</h3>
      <div className="space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your book idea..."
          className="w-full p-2 border rounded-lg resize-none h-24"
        />
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          <Wand2 className="w-4 h-4" />
          <span>{isGenerating ? 'Generating...' : 'Generate'}</span>
        </button>
      </div>
    </div>
  );
}; 