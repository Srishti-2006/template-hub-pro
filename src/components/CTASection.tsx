import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl bg-hero-gradient p-12 md:p-20 text-center overflow-hidden"
        >
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-32 h-32 rounded-full border-2 border-primary-foreground/30" />
            <div className="absolute bottom-10 right-20 w-48 h-48 rounded-full border-2 border-primary-foreground/20" />
            <div className="absolute top-1/2 left-1/3 w-20 h-20 rounded-full border border-primary-foreground/20" />
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-primary-foreground mb-4">
              Ready to Create Something Amazing?
            </h2>
            <p className="text-primary-foreground/80 text-lg max-w-lg mx-auto mb-8">
              Join thousands of creators using TemplateHub to bring their ideas to life. Start free today.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/templates">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
