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
  pageCount: number;
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
    targetAudience: 'young-adult',
    pageCount: 1
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

    // A4 page can fit approximately 500-600 words with standard formatting
    const WORDS_PER_PAGE = 500;

    const enhancedPrompt = `
      Generate a ${settings.length} story with the following specifications:
      Genre: ${settings.genre}
      Writing Style: ${settings.style}
      Tone: ${settings.tone}
      Target Audience: ${settings.targetAudience}
      Number of Pages: ${settings.pageCount}

      IMPORTANT FORMATTING REQUIREMENTS:
      1. Each page MUST contain EXACTLY ${WORDS_PER_PAGE} words
      2. Start each page with "Page X:" (where X is the page number)
      3. Each page must be a complete and coherent unit
      4. Do not break sentences or paragraphs across pages
      5. Each page should fill exactly one A4 page
      6. Maintain consistent formatting and spacing
      7. End each page at a natural break point
      8. Generate exactly ${settings.pageCount} pages, each with ${WORDS_PER_PAGE} words

      Story Prompt: ${prompt}

      Remember: Each page must be EXACTLY ${WORDS_PER_PAGE} words, no exceptions.
      Do not move to the next page until the current page is completely filled.
    `;

    try {
      const stream = streamBookGeneration(enhancedPrompt);
      let fullText = '';
      
      for await (const chunk of stream) {
        if (abortController.current?.signal.aborted) break;
        fullText += chunk;
        
        // Format the text with proper page numbers and ensure consistent length
        const formattedText = fullText
          .split(/Page \d+:/)
          .filter(page => page.trim() !== '')
          .map((page, index) => {
            const words = page.trim().split(/\s+/);
            
            // Ensure each page has exactly WORDS_PER_PAGE words
            if (words.length > WORDS_PER_PAGE) {
              // Find the last complete sentence within the word limit
              let cutoff = WORDS_PER_PAGE;
              while (cutoff > 0 && !words[cutoff - 1].endsWith('.')) {
                cutoff--;
              }
              return `Page ${index + 1}:\n\n${words.slice(0, cutoff).join(' ')}`;
            } else if (words.length < WORDS_PER_PAGE) {
              // If page is not complete, show it's still generating
              return `Page ${index + 1}:\n\n${words.join(' ')}${words.length < WORDS_PER_PAGE ? '\n[Generating...]' : ''}`;
            }
            return `Page ${index + 1}:\n\n${words.join(' ')}`;
          })
          .join('\n\n---\n\n');
        
        setGeneratedText(formattedText);
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
    // A4 dimensions in points (72 points per inch)
    // A4 is 210mm × 297mm or 8.27in × 11.69in
    const pdf = new jsPDF({
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;
    const margin = 20; // 20mm margins
    const usableWidth = pageWidth - (2 * margin);
    const usableHeight = pageHeight - (2 * margin);
    
    // Split the text into pages
    const pages = generatedText.split(/Page \d+:/).filter(page => page.trim());
    
    pages.forEach((pageContent, pageIndex) => {
      if (pageIndex > 0) {
        pdf.addPage();
      }
      
      // Set font and size
      pdf.setFont('helvetica');
      pdf.setFontSize(11); // Standard font size for documents
      
      // Add page number at the top
      const pageNumber = `Page ${pageIndex + 1}`;
      pdf.setFont('helvetica', 'bold');
      pdf.text(pageNumber, margin, margin);
      pdf.setFont('helvetica', 'normal');
      
      // Split and format the content
      const content = pageContent.trim();
      const splitText = pdf.splitTextToSize(content, usableWidth);
      
      let yPosition = margin + 10;
      splitText.forEach((line: string) => {
        if (yPosition > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(line, margin, yPosition);
        yPosition += 6; // Line height in mm
      });
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
        title="Create AI Books | BookAI"
        description="Generate professional books instantly with our AI-powered book creator. Choose your genre, style, and let AI craft your story. Create unlimited books with advanced AI technology."
        keywords="AI book creator, story generator, automated writing, book writing software, AI writer, creative writing tool, novel generator"
        ogType="website"
        imageAlt="AI Book Generator Interface"
      />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-2 md:p-6 pt-20 md:pt-6">
        <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
          {/* Main Content Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 md:p-8 border border-white/20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 md:p-3 bg-indigo-100 rounded-xl">
                  <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-800">Create Professional Books with AI</h1>
                  <h2 className="text-xs md:text-sm text-gray-600">Generate unique stories instantly</h2>
                </div>
              </div>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors duration-200 text-sm md:text-base"
              >
                <Settings2 className="w-4 h-4 md:w-5 md:h-5" />
                <span>Settings</span>
              </button>
            </div>

            {/* Settings Panel */}
            {showSettings && (
              <div className="mb-6 md:mb-8 p-4 md:p-6 bg-white rounded-xl border border-gray-100 shadow-sm space-y-4">
                <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-4">Story Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Number of Pages</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={settings.pageCount}
                        onChange={(e) => setSettings({ 
                          ...settings, 
                          pageCount: Math.max(1, Math.min(50, parseInt(e.target.value) || 1))
                        })}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      />
                      <span className="text-sm text-gray-500">page{settings.pageCount > 1 ? 's' : ''}</span>
                    </div>
                    <p className="text-xs text-gray-500">Each page is approximately 500 words</p>
                  </div>
                </div>
              </div>
            )}

            {/* Prompt Input */}
            <div className="space-y-4 md:space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Describe your book idea
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 h-24 md:h-32 resize-none text-sm md:text-base"
                  placeholder="Enter a detailed description of the book you want to generate..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 md:py-3 px-4 md:px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg text-sm md:text-base"
                >
                  {isGenerating ? (
                    <>
                      <Loader size="small" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 md:w-5 md:h-5" />
                      <span>Generate Book</span>
                    </>
                  )}
                </button>

                {generatedText && (
                  <>
                    <button
                      onClick={saveToLibrary}
                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white py-2.5 md:py-3 px-4 md:px-6 rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all duration-200 shadow-md hover:shadow-lg text-sm md:text-base"
                    >
                      <Save className="w-4 h-4 md:w-5 md:h-5" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={downloadPDF}
                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2.5 md:py-3 px-4 md:px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg text-sm md:text-base"
                    >
                      <Download className="w-4 h-4 md:w-5 md:h-5" />
                      <span>Download</span>
                    </button>
                  </>
                )}
              </div>

              {/* Generated Content */}
              {generatedText && (
                <div className="mt-6 md:mt-8">
                  <div className="bg-white rounded-xl p-4 md:p-8 shadow-sm">
                    <div className="max-w-[210mm] mx-auto"> {/* A4 width */}
                      <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none">
                        {/* A4 page simulation */}
                        <div className="bg-white shadow-lg p-[20mm] min-h-[297mm] w-[210mm] mx-auto">
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => (
                                <p className="mb-4 text-gray-800 leading-relaxed">{children}</p>
                              ),
                              h1: ({ children }) => (
                                <h1 className="text-2xl font-bold mb-6 text-gray-900">{children}</h1>
                              ),
                              h2: ({ children }) => (
                                <h2 className="text-xl font-semibold mb-4 text-gray-900">{children}</h2>
                              ),
                              hr: () => (
                                <hr className="my-8 border-t-2 border-gray-100" />
                              ),
                            }}
                          >
                            {generatedText}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
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