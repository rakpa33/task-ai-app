import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

  const HF_MODEL = "google/flan-t5-base";

  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/${HF_MODEL}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Hugging Face API error:', error);
      return NextResponse.json({ error }, { status: response.status });
    }

    const data = await response.json();
    const result = data?.[0]?.generated_text || data?.[0] || "No result";

    return NextResponse.json({ result });
  } catch (err) {
    console.error('Request failed:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
