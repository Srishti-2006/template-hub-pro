import { motion } from "framer-motion";
import { Video, Image, FileText, Presentation, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    icon: Video,
    title: "Video Templates",
    description: "Reels, birthday videos, promos & more",
    count: "500+",
    color: "from-primary/20 to-primary/5",
    href: "/templates?cat=video",
  },
  {
    icon: Image,
    title: "Photo Templates",
    description: "Posters, social media, thumbnails",
    count: "800+",
    color: "from-accent/20 to-accent/5",
    href: "/templates?cat=photo",
  },
  {
    icon: Presentation,
    title: "Slideshow Videos",
    description: "Photo-based videos with music",
    count: "300+",
    color: "from-primary/15 to-accent/10",
    href: "/templates?cat=slideshow",
  },
  {
    icon: FileText,
    title: "Resume Templates",
    description: "Professional, modern & creative",
    count: "200+",
    color: "from-muted to-secondary",
    href: "/templates?cat=resume",
  },
];

const CategorySection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            What Will You Create Today?
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Browse our curated collection of templates across every category.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={cat.href}
                className="group block p-6 rounded-2xl bg-gradient-to-br border border-border/50 card-shadow hover:card-shadow-hover transition-all"
                style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4`}>
                  <cat.icon className="w-6 h-6 text-foreground" />
                </div>
                <h3 className="font-display font-bold text-foreground mb-1">{cat.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{cat.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-primary">{cat.count} templates</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
