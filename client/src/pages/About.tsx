import { Link } from "wouter";
import { ArrowRight, Palette, Heart, Award } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Page header */}
      <section className="bg-secondary border-b border-border py-14">
        <div className="container text-center">
          <p className="text-accent text-xs font-medium tracking-widest uppercase mb-2">The Artist</p>
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mb-4">
            About Paw &amp; Canvas
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            A studio dedicated to celebrating the beauty and character of dogs through original fine art paintings.
          </p>
        </div>
      </section>

      {/* Artist story */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image placeholder */}
            <div className="relative">
              <div className="aspect-[4/5] bg-muted rounded-sm overflow-hidden">
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-muted">
                  <div className="text-center text-muted-foreground">
                    <Palette className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-sm opacity-50">Artist portrait</p>
                  </div>
                </div>
              </div>
              {/* Decorative accent */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-accent/10 rounded-sm -z-10" />
            </div>

            {/* Text */}
            <div>
              <p className="text-accent text-xs font-medium tracking-widest uppercase mb-3">My Story</p>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-6 leading-snug">
                A Lifelong Love of Dogs, Expressed Through Paint
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  I have been painting dogs for over a decade, drawn to the challenge of capturing what makes each one irreplaceable — the warmth in their eyes, the tilt of their head, the energy in their posture. Dogs are endlessly expressive subjects, and no two are ever the same.
                </p>
                <p>
                  My work is rooted in careful observation. Before I pick up a brush, I spend time studying the subject — understanding the way light falls across their coat, the subtle asymmetries that give them character, the mood of a particular moment. The result is a painting that feels alive.
                </p>
                <p>
                  I work primarily in oil and acrylic on stretched canvas, using a palette that honours the natural tones of each animal while bringing a warmth and richness that elevates the work beyond a simple portrait.
                </p>
              </div>

              <div className="mt-8">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-medium px-6 py-3 rounded-sm hover:bg-primary/90 transition-colors"
                >
                  Commission a Painting <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values / approach */}
      <section className="py-20 bg-secondary border-t border-border">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-accent text-xs font-medium tracking-widest uppercase mb-2">My Approach</p>
            <h2 className="font-serif text-3xl font-semibold text-foreground">What Sets Each Painting Apart</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Heart className="w-6 h-6 text-accent" />,
                title: "Painted with Intention",
                body: "Every painting begins with careful study of the subject. I look for the details that make each dog unique — the way they hold their ears, the depth in their gaze, the texture of their coat.",
              },
              {
                icon: <Palette className="w-6 h-6 text-accent" />,
                title: "Fine Art Materials",
                body: "I use professional-grade oil and acrylic paints on archival-quality stretched canvas. Each piece is designed to last generations without fading or deterioration.",
              },
              {
                icon: <Award className="w-6 h-6 text-accent" />,
                title: "One-of-a-Kind Originals",
                body: "Every painting in the collection is a unique original. No prints, no reproductions. When you acquire a piece, you own the only one in existence.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-card rounded-sm p-6 border border-border">
                <div className="mb-4">{item.icon}</div>
                <h3 className="font-serif text-lg font-semibold text-foreground mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Studio */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <p className="text-accent text-xs font-medium tracking-widest uppercase mb-2">The Studio</p>
            <h2 className="font-serif text-3xl font-semibold text-foreground mb-6">Where the Work Happens</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                The studio is a quiet, light-filled space where each painting takes shape over days or weeks. I work slowly and deliberately, building up layers of paint to achieve depth, luminosity, and texture. There is no rushing a painting — it is finished when it is finished.
              </p>
              <p>
                Commissions are welcome. If you have a dog you would like immortalised in paint, I would love to hear from you. I work from high-quality photographs and take the time to understand what makes your dog special before beginning.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 border border-border text-foreground font-medium px-6 py-3 rounded-sm hover:bg-muted transition-colors"
              >
                View the Gallery <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-medium px-6 py-3 rounded-sm hover:bg-primary/90 transition-colors"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
