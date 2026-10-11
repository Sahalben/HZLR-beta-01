import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "How it Works", href: "#how-it-works" },
  { label: "For Workers", href: "#workers" },
  { label: "For Employers", href: "#employers" },
  { label: "Pricing", href: "#pricing" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <header className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl">
      {/* Liquid Glass Island Dock Container */}
      <div 
        className={cn(
          "relative w-full rounded-full px-6 py-2.5 md:py-3",
          "border border-white/15 bg-white/5 dark:bg-black/20",
          "backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.25)]",
          "flex items-center justify-between transition-all duration-300"
        )}
      >
        {/* Layer 1: Color Burn Overlay */}
        <div 
          className="absolute inset-0 rounded-full bg-white/5 mix-blend-color-burn pointer-events-none"
          aria-hidden="true"
        />
        {/* Layer 2: Gloss Reflection Highlight */}
        <div 
          className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-transparent mix-blend-overlay pointer-events-none shadow-[inset_1px_1px_1px_rgba(255,255,255,0.4),_inset_-1px_-1px_1px_rgba(0,0,0,0.1)]"
          aria-hidden="true"
        />

        {/* Logo */}
        <Link to="/" className="flex items-center z-10 relative group">
          <span className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-0.5">
            HZLR
            <span className="text-emerald-400 group-hover:scale-125 transition-transform duration-300">.</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 z-10 relative">
          {navLinks.map((link, idx) => (
            <a
              key={link.label}
              href={link.href}
              className="relative px-4 py-2 text-sm font-semibold text-white/80 hover:text-white transition-colors duration-200"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Hover bubble background effect */}
              {hoveredIndex === idx && (
                <motion.span
                  layoutId="nav-hover-bubble"
                  className="absolute inset-0 rounded-full bg-white/10 -z-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-2.5 z-10 relative">
          <Link 
            to="/login"
            className="px-4 py-2 text-sm font-semibold text-white hover:text-white/80 transition-colors"
          >
            Log In
          </Link>
          <Button 
            variant="default"
            size="sm"
            className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-2 shadow-glow/10 border border-emerald-400/20"
            asChild
          >
            <Link to="/signup" className="flex items-center gap-1">
              Get Started
              <ArrowRight size={14} />
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          className="md:hidden p-2 text-white/80 hover:text-white z-10 relative transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <motion.div
            initial={false}
            animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.div>
        </button>

        {/* Mobile Floating Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="absolute top-[calc(100%+0.75rem)] left-0 right-0 rounded-3xl border border-white/10 bg-[#021c12]/90 dark:bg-black/80 backdrop-blur-xl p-5 shadow-2xl z-50 flex flex-col gap-3"
            >
              {/* Overlay reflection layers for mobile dropdown too */}
              <div 
                className="absolute inset-0 rounded-3xl bg-white/5 mix-blend-color-burn pointer-events-none"
                aria-hidden="true"
              />
              <div 
                className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/10 to-transparent mix-blend-overlay pointer-events-none shadow-[inset_1px_1px_1px_rgba(255,255,255,0.2)]"
                aria-hidden="true"
              />

              <nav className="flex flex-col gap-1 relative z-10">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-base font-semibold text-white/80 hover:text-white py-2 px-4 rounded-xl hover:bg-white/5 transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                
                <div className="flex flex-col gap-3 pt-4 border-t border-white/10 mt-2">
                  <Link 
                    to="/login"
                    className="w-full text-center py-2.5 rounded-full border border-white/10 text-sm font-semibold text-white hover:bg-white/5 transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log In
                  </Link>
                  <Button 
                    variant="default"
                    className="w-full rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5"
                    asChild
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Link to="/signup">
                      Get Started
                    </Link>
                  </Button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
