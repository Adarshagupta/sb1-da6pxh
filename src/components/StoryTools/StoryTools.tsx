import React, { useState } from 'react';
import { Book, Users, Globe, Layout, FileText } from 'lucide-react';
import { SEO } from '../common/SEO';

interface StoryElement {
  id: string;
  content: string;
}

interface Character {
  id: string;
  name: string;
  role: string;
  description: string;
  motivation: string;
  background: string;
}

interface WorldElement {
  id: string;
  name: string;
  description: string;
  rules: string;
  culture: string;
}

interface Chapter {
  id: string;
  title: string;
  summary: string;
  scenes: Scene[];
}

interface Scene {
  id: string;
  setting: string;
  characters: string[];
  action: string;
  goal: string;
}

export const StoryTools = () => {
  const [plotPoints, setPlotPoints] = useState<StoryElement[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [worldElements, setWorldElements] = useState<WorldElement[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [activeTab, setActiveTab] = useState<'plot' | 'characters' | 'world' | 'chapters' | 'scenes'>('plot');

  const addPlotPoint = () => {
    const newPoint: StoryElement = {
      id: Date.now().toString(),
      content: ''
    };
    setPlotPoints([...plotPoints, newPoint]);
  };

  const addCharacter = () => {
    const newCharacter: Character = {
      id: Date.now().toString(),
      name: '',
      role: '',
      description: '',
      motivation: '',
      background: ''
    };
    setCharacters([...characters, newCharacter]);
  };

  const addWorldElement = () => {
    const newElement: WorldElement = {
      id: Date.now().toString(),
      name: '',
      description: '',
      rules: '',
      culture: ''
    };
    setWorldElements([...worldElements, newElement]);
  };

  const addChapter = () => {
    const newChapter: Chapter = {
      id: Date.now().toString(),
      title: '',
      summary: '',
      scenes: []
    };
    setChapters([...chapters, newChapter]);
  };

  const addScene = (chapterId: string) => {
    const newScene: Scene = {
      id: Date.now().toString(),
      setting: '',
      characters: [],
      action: '',
      goal: ''
    };
    setChapters(chapters.map(chapter => {
      if (chapter.id === chapterId) {
        return {
          ...chapter,
          scenes: [...chapter.scenes, newScene]
        };
      }
      return chapter;
    }));
  };

  return (
    <>
      <SEO 
        title="Story Writing Tools | BookAI"
        description="Professional story development tools for writers. Create character profiles, plot outlines, world-building elements, and organize your chapters with our comprehensive toolkit."
        keywords="story planning tools, character creator, plot generator, world building, chapter organizer, writing software, story structure"
        ogType="website"
        imageAlt="Story Writing Tools Dashboard"
      />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-2 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 md:p-8 border border-white/20">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6 md:mb-8">
              <div className="p-2 md:p-3 bg-indigo-100 rounded-xl">
                <Book className="w-6 h-6 md:w-8 md:h-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">Story Structure Tools</h1>
                <p className="text-xs md:text-sm text-gray-600">Build your story elements</p>
              </div>
            </div>

            {/* Navigation Tabs - Scrollable on mobile */}
            <div className="overflow-x-auto -mx-4 px-4 md:overflow-visible md:px-0 mb-6 md:mb-8">
              <div className="flex space-x-2 md:space-x-4 border-b min-w-max md:min-w-0">
                {[
                  { id: 'plot', label: 'Plot Outline', icon: FileText },
                  { id: 'characters', label: 'Characters', icon: Users },
                  { id: 'world', label: 'World Building', icon: Globe },
                  { id: 'chapters', label: 'Chapters', icon: Layout }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id as any)}
                    className={`flex items-center gap-1 md:gap-2 px-3 py-2 md:px-4 whitespace-nowrap text-sm md:text-base
                      ${activeTab === id ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="space-y-4 md:space-y-6">
              {/* Plot Outline */}
              {activeTab === 'plot' && (
                <div className="space-y-4">
                  <button
                    onClick={addPlotPoint}
                    className="w-full md:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Add Plot Point
                  </button>
                  <div className="space-y-4">
                    {plotPoints.map((point, index) => (
                      <div key={point.id} className="p-4 bg-white rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm md:text-base">Plot Point {index + 1}</span>
                        </div>
                        <textarea
                          value={point.content}
                          onChange={(e) => {
                            const newPoints = [...plotPoints];
                            newPoints[index].content = e.target.value;
                            setPlotPoints(newPoints);
                          }}
                          className="w-full p-2 border rounded-lg text-sm md:text-base"
                          rows={3}
                          placeholder="Describe the plot point..."
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Character Profiles */}
              {activeTab === 'characters' && (
                <div className="space-y-4">
                  <button
                    onClick={addCharacter}
                    className="w-full md:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Add Character
                  </button>
                  <div className="space-y-4">
                    {characters.map((character, index) => (
                      <div key={character.id} className="p-4 bg-white rounded-lg border">
                        <h3 className="font-medium mb-4 text-sm md:text-base">Character {index + 1}</h3>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                              type="text"
                              value={character.name}
                              onChange={(e) => {
                                const newCharacters = [...characters];
                                newCharacters[index].name = e.target.value;
                                setCharacters(newCharacters);
                              }}
                              className="w-full p-2 border rounded-lg text-sm md:text-base"
                              placeholder="Character Name"
                            />
                            <input
                              type="text"
                              value={character.role}
                              onChange={(e) => {
                                const newCharacters = [...characters];
                                newCharacters[index].role = e.target.value;
                                setCharacters(newCharacters);
                              }}
                              className="w-full p-2 border rounded-lg text-sm md:text-base"
                              placeholder="Role in Story"
                            />
                          </div>
                          <textarea
                            value={character.description}
                            onChange={(e) => {
                              const newCharacters = [...characters];
                              newCharacters[index].description = e.target.value;
                              setCharacters(newCharacters);
                            }}
                            className="w-full p-2 border rounded-lg text-sm md:text-base"
                            rows={3}
                            placeholder="Physical Description"
                          />
                          <textarea
                            value={character.motivation}
                            onChange={(e) => {
                              const newCharacters = [...characters];
                              newCharacters[index].motivation = e.target.value;
                              setCharacters(newCharacters);
                            }}
                            className="w-full p-2 border rounded-lg text-sm md:text-base"
                            rows={3}
                            placeholder="Motivation"
                          />
                          <textarea
                            value={character.background}
                            onChange={(e) => {
                              const newCharacters = [...characters];
                              newCharacters[index].background = e.target.value;
                              setCharacters(newCharacters);
                            }}
                            className="w-full p-2 border rounded-lg text-sm md:text-base"
                            rows={3}
                            placeholder="Background"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* World Building */}
              {activeTab === 'world' && (
                <div className="space-y-4">
                  <button
                    onClick={addWorldElement}
                    className="w-full md:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Add World Element
                  </button>
                  <div className="space-y-4">
                    {worldElements.map((element, index) => (
                      <div key={element.id} className="p-4 bg-white rounded-lg border">
                        <h3 className="font-medium mb-4 text-sm md:text-base">World Element {index + 1}</h3>
                        <div className="space-y-4">
                          <input
                            type="text"
                            value={element.name}
                            onChange={(e) => {
                              const newElements = [...worldElements];
                              newElements[index].name = e.target.value;
                              setWorldElements(newElements);
                            }}
                            className="w-full p-2 border rounded-lg text-sm md:text-base"
                            placeholder="Element Name"
                          />
                          <textarea
                            value={element.description}
                            onChange={(e) => {
                              const newElements = [...worldElements];
                              newElements[index].description = e.target.value;
                              setWorldElements(newElements);
                            }}
                            className="w-full p-2 border rounded-lg text-sm md:text-base"
                            rows={3}
                            placeholder="Description"
                          />
                          <textarea
                            value={element.rules}
                            onChange={(e) => {
                              const newElements = [...worldElements];
                              newElements[index].rules = e.target.value;
                              setWorldElements(newElements);
                            }}
                            className="w-full p-2 border rounded-lg text-sm md:text-base"
                            rows={3}
                            placeholder="Rules and Laws"
                          />
                          <textarea
                            value={element.culture}
                            onChange={(e) => {
                              const newElements = [...worldElements];
                              newElements[index].culture = e.target.value;
                              setWorldElements(newElements);
                            }}
                            className="w-full p-2 border rounded-lg text-sm md:text-base"
                            rows={3}
                            placeholder="Cultural Elements"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Chapters and Scenes */}
              {activeTab === 'chapters' && (
                <div className="space-y-4">
                  <button
                    onClick={addChapter}
                    className="w-full md:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Add Chapter
                  </button>
                  <div className="space-y-4">
                    {chapters.map((chapter, chapterIndex) => (
                      <div key={chapter.id} className="p-4 bg-white rounded-lg border">
                        <h3 className="font-medium mb-4 text-sm md:text-base">Chapter {chapterIndex + 1}</h3>
                        <div className="space-y-4">
                          <input
                            type="text"
                            value={chapter.title}
                            onChange={(e) => {
                              const newChapters = [...chapters];
                              newChapters[chapterIndex].title = e.target.value;
                              setChapters(newChapters);
                            }}
                            className="w-full p-2 border rounded-lg text-sm md:text-base"
                            placeholder="Chapter Title"
                          />
                          <textarea
                            value={chapter.summary}
                            onChange={(e) => {
                              const newChapters = [...chapters];
                              newChapters[chapterIndex].summary = e.target.value;
                              setChapters(newChapters);
                            }}
                            className="w-full p-2 border rounded-lg text-sm md:text-base"
                            rows={3}
                            placeholder="Chapter Summary"
                          />
                          <div className="space-y-4">
                            <button
                              onClick={() => addScene(chapter.id)}
                              className="w-full md:w-auto px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors"
                            >
                              Add Scene
                            </button>
                            {chapter.scenes.map((scene, sceneIndex) => (
                              <div key={scene.id} className="p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-medium mb-2 text-sm md:text-base">Scene {sceneIndex + 1}</h4>
                                <div className="space-y-2">
                                  <input
                                    type="text"
                                    value={scene.setting}
                                    onChange={(e) => {
                                      const newChapters = [...chapters];
                                      newChapters[chapterIndex].scenes[sceneIndex].setting = e.target.value;
                                      setChapters(newChapters);
                                    }}
                                    className="w-full p-2 border rounded-lg text-sm md:text-base"
                                    placeholder="Scene Setting"
                                  />
                                  <input
                                    type="text"
                                    value={scene.characters.join(', ')}
                                    onChange={(e) => {
                                      const newChapters = [...chapters];
                                      newChapters[chapterIndex].scenes[sceneIndex].characters = e.target.value.split(',').map(c => c.trim());
                                      setChapters(newChapters);
                                    }}
                                    className="w-full p-2 border rounded-lg text-sm md:text-base"
                                    placeholder="Characters (comma-separated)"
                                  />
                                  <textarea
                                    value={scene.action}
                                    onChange={(e) => {
                                      const newChapters = [...chapters];
                                      newChapters[chapterIndex].scenes[sceneIndex].action = e.target.value;
                                      setChapters(newChapters);
                                    }}
                                    className="w-full p-2 border rounded-lg text-sm md:text-base"
                                    rows={2}
                                    placeholder="Scene Action"
                                  />
                                  <input
                                    type="text"
                                    value={scene.goal}
                                    onChange={(e) => {
                                      const newChapters = [...chapters];
                                      newChapters[chapterIndex].scenes[sceneIndex].goal = e.target.value;
                                      setChapters(newChapters);
                                    }}
                                    className="w-full p-2 border rounded-lg text-sm md:text-base"
                                    placeholder="Scene Goal"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}; 