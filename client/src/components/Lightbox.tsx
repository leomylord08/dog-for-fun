import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { Painting } from "@shared/types";
import { Link } from "wouter";

interface LightboxProps {
  painting: Painting;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export default function Lightbox({ painting, onClose, onPrev, onNext, hasPrev, hasNext }: LightboxProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && onPrev) onPrev();
      if (e.key === "ArrowRight" && onNext) onNext();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  return (
    <div
      className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Prev button */}
      {hasPrev && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev?.(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
          aria-label="Previous"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Next button */}
      {hasNext && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext?.(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
          aria-label="Next"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Content */}
      <div
        className="flex flex-col md:flex-row gap-6 max-w-5xl w-full max-h-[90vh] bg-card rounded-sm overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="flex-1 bg-muted flex items-center justify-center min-h-[300px] md:min-h-0">
          <img
            src={painting.imageUrl}
            alt={painting.title}
            className="w-full h-full object-contain max-h-[70vh] md:max-h-[90vh]"
          />
        </div>

        {/* Details panel */}
        <div className="md:w-72 p-6 flex flex-col justify-between shrink-0">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-foreground mb-2">{painting.title}</h2>
            {painting.medium && (
              <p className="text-sm text-muted-foreground mb-1">
                <span className="font-medium text-foreground">Medium:</span> {painting.medium}
              </p>
            )}
            {painting.dimensions && (
              <p className="text-sm text-muted-foreground mb-1">
                <span className="font-medium text-foreground">Dimensions:</span> {painting.dimensions}
              </p>
            )}
            {painting.price && (
              <p className="text-lg font-semibold text-accent mt-3">
                ${Number(painting.price).toLocaleString()}
              </p>
            )}
            {painting.description && (
              <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{painting.description}</p>
            )}
          </div>

          <div className="mt-6 space-y-3">
            <Link
              href={`/contact?painting=${painting.id}&title=${encodeURIComponent(painting.title)}`}
              onClick={onClose}
              className="block w-full text-center bg-primary text-primary-foreground text-sm font-medium py-2.5 px-4 rounded-sm hover:bg-primary/90 transition-colors"
            >
              Enquire About This Piece
            </Link>
            <button
              onClick={onClose}
              className="block w-full text-center border border-border text-foreground text-sm font-medium py-2.5 px-4 rounded-sm hover:bg-muted transition-colors"
            >
              Continue Browsing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
