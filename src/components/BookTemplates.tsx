import React from 'react';
import { BookOpen } from 'lucide-react';

export const templates = [
  {
    name: "Hero's Journey",
    prompt: "A young hero discovers they have special powers and must embark on an epic quest to save their world from a rising darkness.",
    settings: { 
      genre: 'fantasy', 
      style: 'descriptive', 
      length: 'long' as const,
      tone: 'serious',
      targetAudience: 'young-adult'
    }
  },
  {
    name: "Mystery Solver",
    prompt: "A brilliant detective investigates a series of mysterious disappearances in a small coastal town.",
    settings: { 
      genre: 'mystery', 
      style: 'concise', 
      length: 'medium' as const,
      tone: 'mysterious',
      targetAudience: 'adult'
    }
  },
  {
    name: "Romance in the City",
    prompt: "Two strangers keep crossing paths in the bustling city, their lives intertwining in unexpected ways.",
    settings: { 
      genre: 'romance', 
      style: 'poetic', 
      length: 'medium' as const,
      tone: 'playful',
      targetAudience: 'adult'
    }
  }
];

interface TemplatePickerProps {
  onSelect: (template: typeof templates[0]) => void;
}

export const TemplatePicker: React.FC<TemplatePickerProps> = ({ onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {templates.map((template, index) => (
        <div
          key={index}
          onClick={() => onSelect(template)}
          className="bg-white rounded-xl p-6 border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <BookOpen className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-800">{template.name}</h3>
          </div>
          <p className="text-sm text-gray-600 line-clamp-3">{template.prompt}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs">
              {template.settings.genre}
            </span>
            <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded-full text-xs">
              {template.settings.length}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}; 