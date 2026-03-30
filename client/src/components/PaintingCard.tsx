import { useState } from "react";
import type { Painting } from "@shared/types";

interface PaintingCardProps {
  painting: Painting;
  onClick: (painting: Painting) => void;
}

export default function PaintingCard({ painting, onClick }: PaintingCardProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="group cursor-pointer bg-card rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
      onClick={() => onClick(painting)}
    >
      <div className="relative overflow-hidden bg-muted">
        {!loaded && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}
        <img
          src={painting.imageUrl}
          alt={painting.title}
          className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setLoaded(true)}
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-300 flex items-center justify-center">
          <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-foreground/60 px-4 py-2 rounded-sm">
            View Details
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-serif text-base font-semibold text-foreground leading-snug mb-1 line-clamp-1">
          {painting.title}
        </h3>
        {painting.medium && (
          <p className="text-xs text-muted-foreground">{painting.medium}</p>
        )}
        {painting.dimensions && (
          <p className="text-xs text-muted-foreground">{painting.dimensions}</p>
        )}
        {painting.price && (
          <p className="text-sm font-semibold text-accent mt-2">
            ${Number(painting.price).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}
