import { Star } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  text: string;
  name: string;
  date: string;
}

interface ReviewsProps {
  reviews?: Review[];
}

export default function Reviews({ reviews }: ReviewsProps) {
  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-border py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="text-2xl font-semibold text-foreground">Reviews</h2>
        <div className="mx-auto mt-2 h-0.5 w-10 rounded-full bg-accent-soft" />

        <div className="mt-8 space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-xl border border-border bg-surface p-5"
            >
              <div className="flex items-center gap-1">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-accent-soft text-accent-soft"
                  />
                ))}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-foreground">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  {review.name}
                </span>
                <span className="text-xs text-muted">{review.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}