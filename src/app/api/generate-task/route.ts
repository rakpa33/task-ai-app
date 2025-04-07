import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  if (!prompt) {
    return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
  }

  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'mistral',
        prompt: `Break down this task into 3–6 subtasks.\nRespond only with a bullet list, no extra text or explanation:\n\n"${prompt}"`,
        stream: false
      })
    });

    const data = await response.json();
    const result = data.response || 'No result';

    return NextResponse.json({ result });
  } catch (err) {
    console.error('Ollama API error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}