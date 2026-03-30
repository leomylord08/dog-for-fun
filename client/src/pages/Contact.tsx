import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Mail, MapPin, Clock, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function Contact() {
  const [location] = useLocation();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  // Pre-fill message if coming from a painting enquiry
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paintingTitle = params.get("title");
    if (paintingTitle) {
      setForm((f) => ({
        ...f,
        message: `I am interested in enquiring about "${decodeURIComponent(paintingTitle)}". `,
      }));
    }
  }, [location]);

  const paintingId = new URLSearchParams(window.location.search).get("painting");
  const paintingTitle = new URLSearchParams(window.location.search).get("title");

  const submit = trpc.enquiries.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to send message. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    submit.mutate({
      name: form.name,
      email: form.email,
      message: form.message,
      paintingId: paintingId ? Number(paintingId) : undefined,
      paintingTitle: paintingTitle ? decodeURIComponent(paintingTitle) : undefined,
    });
  };

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <section className="bg-secondary border-b border-border py-14">
        <div className="container text-center">
          <p className="text-accent text-xs font-medium tracking-widest uppercase mb-2">Get in Touch</p>
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mb-4">
            Contact &amp; Enquiries
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Interested in a painting, a commission, or simply want to say hello? We would love to hear from you.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact info */}
            <div>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">Let's Connect</h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Whether you are interested in purchasing an existing painting, commissioning a custom portrait of your dog, or simply want to learn more about the work, please reach out. Every enquiry is answered personally.
              </p>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-sm bg-secondary flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Email</p>
                    <a href="mailto:hello@pawandcanvas.com" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                      hello@pawandcanvas.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-sm bg-secondary flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Studio</p>
                    <p className="text-sm text-muted-foreground">Available for studio visits by appointment</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-sm bg-secondary flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Response Time</p>
                    <p className="text-sm text-muted-foreground">All enquiries answered within 1–2 business days</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 p-6 bg-secondary rounded-sm border border-border">
                <h3 className="font-serif text-base font-semibold text-foreground mb-2">Commission a Painting</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  To commission a custom portrait of your dog, please send a clear photograph along with your message. Include any details about your dog's personality, favourite spots, or the mood you would like the painting to capture.
                </p>
              </div>
            </div>

            {/* Form */}
            <div>
              {submitted ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <CheckCircle className="w-14 h-14 text-accent mb-4" />
                  <h3 className="font-serif text-2xl font-semibold text-foreground mb-3">Message Sent</h3>
                  <p className="text-muted-foreground max-w-sm">
                    Thank you for reaching out. Your enquiry has been received and will be answered within 1–2 business days.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 text-sm font-medium text-accent hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5" htmlFor="name">
                      Full Name <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                      className="w-full border border-input rounded-sm px-4 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5" htmlFor="email">
                      Email Address <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="your@email.com"
                      className="w-full border border-input rounded-sm px-4 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5" htmlFor="message">
                      Message <span className="text-destructive">*</span>
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={6}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us about your enquiry, commission request, or anything else..."
                      className="w-full border border-input rounded-sm px-4 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submit.isPending}
                    className="w-full bg-primary text-primary-foreground font-medium py-3 px-6 rounded-sm hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submit.isPending ? "Sending..." : "Send Message"}
                  </button>

                  <p className="text-xs text-muted-foreground text-center">
                    Your information is kept private and will only be used to respond to your enquiry.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
