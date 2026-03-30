import { motion } from "framer-motion";
import { Wand2, Download, Layers, Zap } from "lucide-react";

const features = [
  {
    icon: Layers,
    title: "Drag & Drop Editor",
    description: "Intuitive editor with timeline, layers, and real-time preview for all your creative projects.",
  },
  {
    icon: Wand2,
    title: "AI-Powered Suggestions",
    description: "Get smart template recommendations and auto-generate videos from your photos and music.",
  },
  {
    icon: Download,
    title: "Multi-Format Export",
    description: "Export in MP4, PNG, or PDF. Optimized for every platform — social, print, or web.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Cloud-powered rendering means your projects export in seconds, not minutes.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Everything You Need to Create
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Professional tools made simple for everyone.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <f.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display font-bold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
