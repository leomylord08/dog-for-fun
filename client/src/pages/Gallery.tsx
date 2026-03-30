import { useState } from "react";
import { trpc } from "@/lib/trpc";
import PaintingCard from "@/components/PaintingCard";
import Lightbox from "@/components/Lightbox";
import type { Painting } from "@shared/types";
import { Loader2 } from "lucide-react";

export default function Gallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const { data: paintings, isLoading } = trpc.paintings.list.useQuery();

  const openLightbox = (painting: Painting) => {
    const idx = paintings?.findIndex((p) => p.id === painting.id) ?? -1;
    if (idx !== -1) setLightboxIndex(idx);
  };

  const closeLightbox = () => setLightboxIndex(null);

  const goNext = () => {
    if (lightboxIndex !== null && paintings && lightboxIndex < paintings.length - 1) {
      setLightboxIndex(lightboxIndex + 1);
    }
  };

  const goPrev = () => {
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1);
    }
  };

  const activePainting = lightboxIndex !== null && paintings ? paintings[lightboxIndex] : null;

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <section className="bg-secondary border-b border-border py-14">
        <div className="container text-center">
          <p className="text-accent text-xs font-medium tracking-widest uppercase mb-2">The Collection</p>
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mb-4">
            Dog Paintings Gallery
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Browse our collection of original dog paintings. Each piece is a unique, hand-crafted work of art available for purchase or enquiry.
          </p>
        </div>
      </section>

      {/* Gallery grid */}
      <section className="py-16">
        <div className="container">
          {isLoading && (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {!isLoading && (!paintings || paintings.length === 0) && (
            <div className="text-center py-24">
              <p className="font-serif text-2xl text-foreground mb-3">The gallery is being curated</p>
              <p className="text-muted-foreground">New paintings will be added soon. Check back shortly.</p>
            </div>
          )}

          {!isLoading && paintings && paintings.length > 0 && (
            <>
              <p className="text-sm text-muted-foreground mb-8">
                {paintings.length} {paintings.length === 1 ? "work" : "works"} in the collection
              </p>
              {/* Masonry-style responsive grid */}
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                {paintings.map((painting) => (
                  <div key={painting.id} className="break-inside-avoid">
                    <PaintingCard painting={painting} onClick={openLightbox} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {activePainting && (
        <Lightbox
          painting={activePainting}
          onClose={closeLightbox}
          onPrev={goPrev}
          onNext={goNext}
          hasPrev={lightboxIndex !== null && lightboxIndex > 0}
          hasNext={lightboxIndex !== null && paintings !== undefined && lightboxIndex < paintings.length - 1}
        />
      )}
    </div>
  );
}
