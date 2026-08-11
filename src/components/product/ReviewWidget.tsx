'use client';

import React, { useState } from 'react';
import { JudgeMeReview } from '@/lib/judgeme';
import FadeIn from '@/components/ui/FadeIn';

interface ReviewWidgetProps {
  reviews: JudgeMeReview[];
  productId?: string;
}

export function ReviewWidget({ reviews, productId }: ReviewWidgetProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a star rating.');
      return;
    }
    if (!productId) {
      setError('Product ID is missing, cannot submit review.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: productId,
          name,
          email,
          rating,
          title,
          body,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong submitting your review.');
      }

      setIsSuccess(true);
      
      // Reset form
      setRating(0);
      setName('');
      setEmail('');
      setTitle('');
      setBody('');
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FadeIn>
      <section className="bg-black text-white w-full py-20 border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
            
            {/* Left Column: Form */}
            <div className="flex-1 max-w-xl">
              <h2 className="text-2xl font-light uppercase tracking-[0.15em] mb-10 text-white/90">
                Write a Review
              </h2>

              {isSuccess ? (
                <div className="p-10 border border-white/10 text-center space-y-6 rounded-sm bg-white/[0.02]">
                  <div className="text-[#2563EB] mb-4">
                    <svg className="w-14 h-14 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl tracking-[0.1em] font-light uppercase">Thank You</h3>
                  <p className="text-white/60 font-light leading-relaxed">Your review has been successfully submitted and is pending approval.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                  {error && (
                    <div className="p-4 border border-red-500/30 bg-red-500/10 text-red-400 text-sm font-light">
                      {error}
                    </div>
                  )}

                  {/* Star Rating */}
                  <div className="flex flex-col gap-4">
                    <label className="text-xs font-semibold text-white/60 uppercase tracking-widest">Rating</label>
                    <div className="flex gap-3" onMouseLeave={() => setHoveredRating(0)}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <svg 
                            className={`w-7 h-7 transition-all duration-300 ${
                              star <= (hoveredRating || rating) 
                                ? 'fill-[#2563EB] text-[#2563EB]' 
                                : 'fill-transparent text-white/30 stroke-current stroke-[1.5px]'
                            }`} 
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path strokeLinecap="square" strokeLinejoin="miter" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2">
                    <div className="flex flex-col relative group">
                      <label className="text-[10px] font-semibold text-white/50 uppercase tracking-[0.2em] absolute -top-2 left-3 bg-black px-1 z-10 transition-colors group-focus-within:text-white">Name</label>
                      <input 
                        type="text" required value={name} onChange={(e) => setName(e.target.value)}
                        className="bg-transparent border border-white/20 p-4 text-white text-sm font-light focus:outline-none focus:border-white/60 transition-colors rounded-none w-full"
                      />
                    </div>
                    <div className="flex flex-col relative group">
                      <label className="text-[10px] font-semibold text-white/50 uppercase tracking-[0.2em] absolute -top-2 left-3 bg-black px-1 z-10 transition-colors group-focus-within:text-white">Email</label>
                      <input 
                        type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                        className="bg-transparent border border-white/20 p-4 text-white text-sm font-light focus:outline-none focus:border-white/60 transition-colors rounded-none w-full"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col relative group">
                    <label className="text-[10px] font-semibold text-white/50 uppercase tracking-[0.2em] absolute -top-2 left-3 bg-black px-1 z-10 transition-colors group-focus-within:text-white">Review Title</label>
                    <input 
                      type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                      className="bg-transparent border border-white/20 p-4 text-white text-sm font-light focus:outline-none focus:border-white/60 transition-colors rounded-none w-full"
                    />
                  </div>

                  <div className="flex flex-col relative group">
                    <label className="text-[10px] font-semibold text-white/50 uppercase tracking-[0.2em] absolute -top-2 left-3 bg-black px-1 z-10 transition-colors group-focus-within:text-white">Review Body</label>
                    <textarea 
                      required rows={5} value={body} onChange={(e) => setBody(e.target.value)}
                      className="bg-transparent border border-white/20 p-4 text-white text-sm font-light focus:outline-none focus:border-white/60 transition-colors resize-none rounded-none w-full leading-relaxed"
                    />
                  </div>

                  <button 
                    type="submit" disabled={isLoading}
                    className="w-full sm:w-auto self-start mt-4 border border-white px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black disabled:opacity-50 transition-all duration-500"
                  >
                    {isLoading ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}
            </div>

            {/* Right Column: Existing Reviews */}
            <div className="flex-1 flex flex-col mt-16 lg:mt-0">
              <h2 className="text-2xl font-light uppercase tracking-[0.15em] mb-10 text-white/90 border-b border-white/10 pb-6">
                Customer Reviews
              </h2>
              
              {(!reviews || reviews.length === 0) ? (
                <div className="text-white/40 font-light italic mt-4">
                  Be the first to share your experience with this item.
                </div>
              ) : (
                <div className="flex flex-col gap-10 divide-y divide-white/10">
                  {reviews.map((review) => (
                    <div key={review.id} className="pt-10 first:pt-0 flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold tracking-wide text-sm">{review.reviewer?.name || 'Anonymous'}</span>
                        <div className="flex text-[#2563EB]">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg 
                              key={i} 
                              className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'fill-transparent border-current stroke-current stroke-[1.5px]'}`} 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="square" strokeLinejoin="miter" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                          ))}
                        </div>
                      </div>

                      {review.title && (
                        <h3 className="font-bold text-lg tracking-wide">{review.title}</h3>
                      )}
                      
                      <p className="text-white/70 font-light leading-relaxed text-sm md:text-base">
                        {review.body}
                      </p>
                      
                      <time className="text-[11px] text-white/40 uppercase tracking-widest mt-2">
                        {new Date(review.created_at).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </time>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
          </div>
        </div>
      </section>
    </FadeIn>
  );
}
