import { Link } from "wouter";
import { PawPrint, Mail, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <PawPrint className="w-5 h-5 text-accent" />
              <span className="font-serif text-lg font-semibold">Paw &amp; Canvas</span>
            </div>
            <p className="text-sm text-primary-foreground/70 leading-relaxed max-w-xs">
              Original dog paintings celebrating the beauty, character, and spirit of our canine companions.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-serif text-sm font-semibold uppercase tracking-widest mb-4 text-primary-foreground/60">
              Explore
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/gallery", label: "Gallery" },
                { href: "/about", label: "About the Artist" },
                { href: "/contact", label: "Contact & Enquiries" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-sm font-semibold uppercase tracking-widest mb-4 text-primary-foreground/60">
              Get in Touch
            </h4>
            <div className="space-y-3">
              <a
                href="mailto:hello@pawandcanvas.com"
                className="flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              >
                <Mail className="w-4 h-4 shrink-0" />
                hello@pawandcanvas.com
              </a>
              <a
                href="#"
                className="flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              >
                <Instagram className="w-4 h-4 shrink-0" />
                @pawandcanvas
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-primary-foreground/40">
            &copy; {new Date().getFullYear()} Paw &amp; Canvas. All rights reserved.
          </p>
          <p className="text-xs text-primary-foreground/40">
            Original artwork. All paintings are one-of-a-kind.
          </p>
        </div>
      </div>
    </footer>
  );
}
