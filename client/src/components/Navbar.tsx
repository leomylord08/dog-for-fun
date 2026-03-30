import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, PawPrint } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <PawPrint className="w-6 h-6 text-accent" />
          <span className="font-serif text-xl font-semibold tracking-wide text-foreground">
            Paw &amp; Canvas
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium tracking-wide transition-colors hover:text-accent ${
                location === link.href ? "text-accent border-b border-accent pb-0.5" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated && user?.role === "admin" && (
            <Link
              href="/admin"
              className={`text-sm font-medium tracking-wide transition-colors hover:text-accent ${
                location.startsWith("/admin") ? "text-accent" : "text-muted-foreground"
              }`}
            >
              Admin
            </Link>
          )}
          {!isAuthenticated && (
            <a
              href={getLoginUrl()}
              className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors"
            >
              Login
            </a>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`text-sm font-medium tracking-wide transition-colors ${
                  location === link.href ? "text-accent" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && user?.role === "admin" && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-muted-foreground"
              >
                Admin
              </Link>
            )}
            {!isAuthenticated && (
              <a
                href={getLoginUrl()}
                className="text-sm font-medium text-muted-foreground"
              >
                Login
              </a>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
