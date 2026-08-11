import React from 'react';
import { JudgeMeReview } from '@/lib/judgeme';
import FadeIn from '@/components/ui/FadeIn';

interface ReviewWidgetProps {
  reviews: JudgeMeReview[];
}

export function ReviewWidget({ reviews }: ReviewWidgetProps) {
  if (!reviews || reviews.length === 0) {
    return (
      <FadeIn>
        <section className="bg-black text-white w-full py-16">
          <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 uppercase tracking-widest text-white/40">
              Customer Reviews
            </h2>
            <p className="text-white/50">There are no reviews for this product yet.</p>
          </div>
        </section>
      </FadeIn>
    );
  }

  return (
    <FadeIn>
      <section className="bg-black text-white w-full py-16">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center uppercase tracking-widest">
            Customer Reviews
          </h2>
          
          <div className="flex flex-col gap-6">
            {reviews.map((review) => (
              <div 
                key={review.id} 
                className="border border-white/10 p-6 flex flex-col gap-4 rounded-sm"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <span className="font-semibold text-lg">{review.reviewer.name}</span>
                  
                  {/* Star Rating */}
                  <div className="flex text-[#2563EB]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg 
                        key={i} 
                        className={`w-5 h-5 ${i < review.rating ? 'fill-current' : 'fill-transparent border-current stroke-current stroke-[1.5px]'}`} 
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                        />
                      </svg>
                    ))}
                  </div>
                </div>

                {review.title && (
                  <h3 className="font-bold text-xl">{review.title}</h3>
                )}
                
                <p className="text-white/80 leading-relaxed md:text-lg">
                  {review.body}
                </p>
                
                <time className="text-sm text-white/50 mt-2 block">
                  {new Date(review.created_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
            ))}
          </div>
        </div>
      </section>
    </FadeIn>
  );
}
