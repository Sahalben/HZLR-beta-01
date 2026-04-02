import { Link } from "react-router-dom";

const footerLinks = {
  Workers: [
    { label: "Find Gigs", href: "/worker/gigs" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Digital Resume", href: "#" },
    { label: "Reliability Score", href: "#" },
  ],
  Employers: [
    { label: "Post a Job", href: "/employer/post" },
    { label: "Pricing", href: "#pricing" },
    { label: "Bulk Hiring", href: "#" },
    { label: "API Access", href: "#" },
  ],
  Company: [
    { label: "About Us", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Refund Policy", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-black tracking-tight">
                HZLR<span className="text-seafoam">.</span>
              </span>
            </Link>
            <p className="text-sm text-primary-foreground/60 mb-6">
              India's first secure daily gig marketplace with guaranteed fair pay.
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                <span className="text-xs">𝕏</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                <span className="text-xs">in</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                <span className="text-xs">IG</span>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-primary-foreground mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-primary-foreground/50">
            © {new Date().getFullYear()} HZLR. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-primary-foreground/50">
            <span>Escrow protected by RBI guidelines</span>
            <span>•</span>
            <span>e-KYC compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
