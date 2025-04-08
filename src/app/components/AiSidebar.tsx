'use client';

import { useState } from 'react';

export default function AiSidebar({ onAddTasks }: { onAddTasks: (tasks: string[]) => void }) {
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  const generateTaskSuggestions = async () => {
    if (!aiPrompt.trim()) return;

    setAiLoading(true);
    try {
      const res = await fetch('/api/generate-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt }),
      });

      const data = await res.json();
      const raw = data.result || '';

      // Parse response into list of tasks
      const parsedTasks = raw
        .split('\n')
        .map((line: string) =>
            line
              .replace(/^(\d+[\).\s]+|[-•*]\s*)/, '')
              .trim()
              .replace(/^\w/, c => c.toUpperCase())
          )
        .filter(Boolean);
      setAiSuggestions(parsedTasks);

    } catch (err) {
      console.error('Failed to generate tasks:', err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleAddSelected = () => {
    onAddTasks(selectedSuggestions);
    setAiPrompt('');
    setAiSuggestions([]);
    setSelectedSuggestions([]);
  };

  return (
    <aside className="w-full md:w-1/3 p-4 border-r bg-gray-50">
      <h2 className="text-xl font-semibold mb-2">AI Task Generator</h2>

      <textarea
        className="p-2 border rounded w-full text-black mb-2 resize-none overflow-hidden transition-all duration-150"
        placeholder="e.g. Plan birthday party"
        value={aiPrompt}
        onChange={(e) => {
          const el = e.target as HTMLTextAreaElement;
          setAiPrompt(e.target.value);
          el.style.height = 'auto';
          el.style.height = `${el.scrollHeight}px`;
        }}
        rows={1}
      />

      <button
        className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        onClick={generateTaskSuggestions}
        disabled={aiLoading}
      >
        {aiLoading ? 'Generating...' : '✨ Generate Tasks'}
      </button>

      {aiSuggestions.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Suggestions</h3>
          <ul className="space-y-2 max-h-64 overflow-y-auto pr-2">
            {aiSuggestions.map((task, idx) => (
              <li key={idx}>
                <label className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    checked={selectedSuggestions.includes(task)}
                    onChange={() => {
                      setSelectedSuggestions((prev) =>
                        prev.includes(task)
                          ? prev.filter((t) => t !== task)
                          : [...prev, task]
                      );
                    }}
                  />
                  <span>{task}</span>
                </label>
              </li>
            ))}
          </ul>

          <button
            className="mt-4 w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={handleAddSelected}
          >
            ➕ Add Selected Tasks
          </button>
        </div>
      )}
    </aside>
  );
}
