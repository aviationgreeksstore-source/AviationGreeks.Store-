import { NextResponse } from 'next/server';
import { submitProductReview } from '@/lib/judgeme';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate required fields
    const { id, name, email, rating, title, body: reviewBody } = body;
    
    if (!id || !name || !email || !rating || !reviewBody) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const response = await submitProductReview({
      id,
      name,
      email,
      rating: Number(rating),
      title: title || '',
      body: reviewBody,
    });

    return NextResponse.json({ success: true, data: response });
  } catch (error: any) {
    console.error('API Route Error submitting review:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit review' },
      { status: 500 }
    );
  }
}
