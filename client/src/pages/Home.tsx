import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Star } from "lucide-react";
import { trpc } from "@/lib/trpc";
import Lightbox from "@/components/Lightbox";
import PaintingCard from "@/components/PaintingCard";
import type { Painting } from "@shared/types";

export default function Home() {
  const [lightboxPainting, setLightboxPainting] = useState<Painting | null>(null);
  const { data: featured } = trpc.paintings.featured.useQuery();
  const { data: allPaintings } = trpc.paintings.list.useQuery();

  const recentPaintings = allPaintings?.slice(0, 6) ?? [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center bg-primary overflow-hidden">
        {featured?.imageUrl && (
          <div className="absolute inset-0">
            <img
              src={featured.imageUrl}
              alt={featured.title}
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/70 to-primary/30" />
          </div>
        )}
        {!featured?.imageUrl && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/70" />
        )}

        <div className="container relative z-10 py-20">
          <div className="max-w-2xl">
            <p className="text-accent text-sm font-medium tracking-widest uppercase mb-4">
              Original Dog Paintings
            </p>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-6">
              Art That Celebrates Your Best Friend
            </h1>
            <p className="text-primary-foreground/70 text-lg leading-relaxed mb-8 max-w-lg">
              Each painting is a one-of-a-kind original, crafted with care to capture the personality, spirit, and soul of our canine companions.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 bg-accent text-accent-foreground font-medium px-6 py-3 rounded-sm hover:bg-accent/90 transition-colors"
              >
                Browse the Collection
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 border border-primary-foreground/30 text-primary-foreground font-medium px-6 py-3 rounded-sm hover:bg-primary-foreground/10 transition-colors"
              >
                Commission a Piece
              </Link>
            </div>
          </div>
        </div>

        {featured && (
          <div className="hidden lg:block absolute right-16 top-1/2 -translate-y-1/2 w-80 z-10">
            <div
              className="bg-card rounded-sm shadow-2xl overflow-hidden cursor-pointer group"
              onClick={() => setLightboxPainting(featured)}
            >
              <img
                src={featured.imageUrl}
                alt={featured.title}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="p-4">
                <div className="flex items-center gap-1 mb-1">
                  <Star className="w-3 h-3 text-accent fill-accent" />
                  <span className="text-xs text-accent font-medium uppercase tracking-wide">Featured</span>
                </div>
                <h3 className="font-serif text-base font-semibold text-foreground">{featured.title}</h3>
                {featured.medium && <p className="text-xs text-muted-foreground">{featured.medium}</p>}
                {featured.price && (
                  <p className="text-sm font-semibold text-accent mt-1">${Number(featured.price).toLocaleString()}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Stats bar */}
      <section className="bg-secondary border-y border-border">
        <div className="container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "100%", label: "Original Works" },
              { value: "Oil & Acrylic", label: "Fine Art Media" },
              { value: "Worldwide", label: "Shipping Available" },
              { value: "Bespoke", label: "Commissions Welcome" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-serif text-xl font-semibold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Works */}
      {recentPaintings.length > 0 && (
        <section className="py-20">
          <div className="container">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-accent text-xs font-medium tracking-widest uppercase mb-2">The Collection</p>
                <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">Recent Works</h2>
              </div>
              <Link
                href="/gallery"
                className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-accent transition-colors"
              >
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPaintings.map((painting) => (
                <PaintingCard
                  key={painting.id}
                  painting={painting}
                  onClick={setLightboxPainting}
                />
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 border border-border text-foreground font-medium px-6 py-3 rounded-sm hover:bg-muted transition-colors"
              >
                View Full Gallery <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Empty state when no paintings yet */}
      {recentPaintings.length === 0 && (
        <section className="py-20">
          <div className="container text-center">
            <p className="text-accent text-xs font-medium tracking-widest uppercase mb-2">The Collection</p>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-4">Coming Soon</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              The gallery is being curated. Check back soon to explore original dog paintings.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-medium px-6 py-3 rounded-sm hover:bg-primary/90 transition-colors"
            >
              Get Notified
            </Link>
          </div>
        </section>
      )}

      {/* About teaser */}
      <section className="py-20 bg-secondary border-t border-border">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-accent text-xs font-medium tracking-widest uppercase mb-2">The Artist</p>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-6">
              Painted with Passion, Crafted with Care
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Every brushstroke is guided by a deep love for dogs and a commitment to capturing what makes each one unique — their gaze, their energy, their unmistakable soul. Each painting is an original work created in oil or acrylic on canvas.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-accent transition-colors border-b border-foreground/30 pb-0.5"
            >
              Read the Artist's Story <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {lightboxPainting && (
        <Lightbox painting={lightboxPainting} onClose={() => setLightboxPainting(null)} />
      )}
    </div>
  );
}
