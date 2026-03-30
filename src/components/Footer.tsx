import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-hero-gradient flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-foreground">TemplateHub</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Create stunning videos, designs & resumes with professional templates.
            </p>
          </div>
          {[
            {
              title: "Product",
              links: ["Video Templates", "Photo Templates", "Resume Builder", "Slideshow Maker"],
            },
            {
              title: "Company",
              links: ["About", "Blog", "Careers", "Contact"],
            },
            {
              title: "Support",
              links: ["Help Center", "Community", "Privacy", "Terms"],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-display font-semibold text-foreground mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">© 2026 TemplateHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
