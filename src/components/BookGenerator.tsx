import React, { useState, useRef, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import ReactMarkdown from 'react-markdown';
import { Download, BookOpen, Settings2, Wand2, Save, Share2 } from 'lucide-react';
import { streamBookGeneration } from '../lib/together';
import { Loader } from './ui/Loader';
import { Notification } from './ui/Notification';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, getUserTokens, updateUserTokens } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { SEO } from './common/SEO';

interface GenerationSettings {
  genre: string;
  style: string;
  length: 'short' | 'medium' | 'long';
  tone: string;
  targetAudience: string;
}

interface BookGeneratorProps {
  // ... existing props
}

const genres = [
  'fantasy',
  'science-fiction',
  'mystery',
  'romance',
  'thriller',
  'horror',
  'historical',
  'adventure'
];

const styles = [
  'descriptive',
  'concise',
  'poetic',
  'humorous',
  'dramatic',
  'conversational'
];

const tones = [
  'casual',
  'formal',
  'playful',
  'serious',
  'mysterious',
  'inspirational'
];

export const BookGenerator: React.FC<BookGeneratorProps> = ({ /* ... */ }) => {
  const [user] = useAuthState(auth);
  const [prompt, setPrompt] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<GenerationSettings>({
    genre: 'fantasy',
    style: 'descriptive',
    length: 'medium',
    tone: 'casual',
    targetAudience: 'young-adult'
  });
  const abortController = useRef<AbortController | null>(null);
  const [tokens, setTokens] = useState<number>(0);
  const { user: authUser } = useAuth();

  useEffect(() => {
    const loadTokens = async () => {
      if (authUser) {
        const userTokens = await getUserTokens(authUser.uid);
        setTokens(userTokens);
      }
    };
    loadTokens();
  }, [authUser]);

  const calculateTokenCost = (wordCount: number) => {
    return Math.ceil(wordCount / 100);
  };

  const generateBook = async () => {
    if (isGenerating) return '';
    
    setIsGenerating(true);
    setGeneratedText('');
    abortController.current = new AbortController();

    const enhancedPrompt = `
      Generate a ${settings.length} story with the following specifications:
      Genre: ${settings.genre}
      Writing Style: ${settings.style}
      Tone: ${settings.tone}
      Target Audience: ${settings.targetAudience}
      
      Story Prompt: ${prompt}
    `;

    try {
      const stream = streamBookGeneration(enhancedPrompt);
      let fullText = '';
      
      for await (const chunk of stream) {
        if (abortController.current?.signal.aborted) break;
        fullText += chunk;
        setGeneratedText(fullText);
      }
      
      setNotification({ type: 'success', message: 'Book generated successfully!' });
      return fullText;
    } catch (error) {
      setNotification({ 
        type: 'error', 
        message: error instanceof Error ? error.message : 'Failed to generate book' 
      });
      return '';
    } finally {
      setIsGenerating(false);
    }
  };

  const saveToLibrary = async () => {
    if (!user || !generatedText) return;
    
    try {
      const bookData = {
        userId: user.uid,
        content: generatedText,
        prompt,
        settings,
        createdAt: serverTimestamp(),
        title: prompt.slice(0, 50) + (prompt.length > 50 ? '...' : '')
      };

      await addDoc(collection(db, 'books'), bookData);
      setNotification({ type: 'success', message: 'Book saved to your library!' });
    } catch (error) {
      console.error('Error saving book:', error);
      setNotification({ 
        type: 'error', 
        message: 'Failed to save book to library' 
      });
    }
  };

  const downloadPDF = () => {
    const pdf = new jsPDF();
    const splitText = pdf.splitTextToSize(generatedText, 180);
    let yPosition = 20;
    
    pdf.setFontSize(12);
    splitText.forEach((text: string) => {
      if (yPosition > 280) {
        pdf.addPage();
        yPosition = 20;
      }
      pdf.text(text, 15, yPosition);
      yPosition += 7;
    });
    
    pdf.save('generated-book.pdf');
    setNotification({ type: 'success', message: 'Book downloaded successfully!' });
  };

  const handleGenerate = async () => {
    if (!authUser) {
      alert('Please login to generate books');
      return;
    }

    // Calculate estimated word count based on your parameters
    const estimatedWords = 1000; // Adjust based on your actual estimation
    const requiredTokens = calculateTokenCost(estimatedWords);

    if (tokens < requiredTokens) {
      alert(`Not enough tokens. You need ${requiredTokens} tokens but have ${tokens}`);
      return;
    }

    try {
      // Call generateBook and store the result
      const result = await generateBook();
      
      if (result) {  // Check if result exists
        // Calculate actual tokens used based on generated word count
        const actualWords = result.split(/\s+/).length;
        const tokensUsed = calculateTokenCost(actualWords);
        
        // Update tokens in Firebase and local state
        const newTokenCount = tokens - tokensUsed;
        await updateUserTokens(authUser.uid, newTokenCount);
        setTokens(newTokenCount);
      }
    } catch (error) {
      console.error('Error generating book:', error);
      alert('Failed to generate book');
    }
  };

  return (
    <>
      <SEO 
        title="Create AI-Generated Books | BookAI"
        description="Create professional books instantly with AI. Our advanced book generator helps you write, format, and export books in minutes. Start creating for free!"
        ogType="website"
        keywords="AI book generator, book writing tool, automated book creation, AI writer, free book generator"
      />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Main Content Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-100 rounded-xl">
                  <BookOpen className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">AI Book Generator</h1>
                  <p className="text-sm text-gray-600">Create unique stories with AI</p>
                </div>
              </div>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors duration-200"
              >
                <Settings2 className="w-5 h-5" />
                <span>Settings</span>
              </button>
            </div>
            

            {/* Settings Panel */}
            {showSettings && (
              <div className="mb-8 p-6 bg-white rounded-xl border border-gray-100 shadow-sm space-y-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Story Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Genre</label>
                    <select
                      value={settings.genre}
                      onChange={(e) => setSettings({ ...settings, genre: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    >
                      {genres.map(genre => (
                        <option key={genre} value={genre}>
                          {genre.charAt(0).toUpperCase() + genre.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Writing Style</label>
                    <select
                      value={settings.style}
                      onChange={(e) => setSettings({ ...settings, style: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    >
                      {styles.map(style => (
                        <option key={style} value={style}>
                          {style.charAt(0).toUpperCase() + style.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Length</label>
                    <select
                      value={settings.length}
                      onChange={(e) => setSettings({ ...settings, length: e.target.value as 'short' | 'medium' | 'long' })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="short">Short</option>
                      <option value="medium">Medium</option>
                      <option value="long">Long</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Tone</label>
                    <select
                      value={settings.tone}
                      onChange={(e) => setSettings({ ...settings, tone: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    >
                      {tones.map(tone => (
                        <option key={tone} value={tone}>
                          {tone.charAt(0).toUpperCase() + tone.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Prompt Input */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Describe your book idea
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 h-32 resize-none"
                  placeholder="Enter a detailed description of the book you want to generate..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader size="small" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      <span>Generate Book</span>
                    </>
                  )}
                </button>

                {generatedText && (
                  <>
                    <button
                      onClick={saveToLibrary}
                      className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white py-3 px-6 rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      <Save className="w-5 h-5" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={downloadPDF}
                      className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      <Download className="w-5 h-5" />
                      <span>Download</span>
                    </button>
                  </>
                )}
              </div>

              {/* Generated Content */}
              {generatedText && (
                <div className="mt-8">
                  <div className="bg-white rounded-xl p-8 prose max-w-none border border-gray-100 shadow-sm">
                    <ReactMarkdown>{generatedText}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
    </>
  );
};