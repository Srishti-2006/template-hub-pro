import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImg from "@/assets/hero-illustration.jpg";

const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background gradient blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Play className="w-3.5 h-3.5" />
              Now with AI-powered templates
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold leading-tight mb-6">
              Create Stunning{" "}
              <span className="text-gradient">Videos, Designs</span>{" "}
              & Resumes in Minutes
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg mb-8">
              Choose from hundreds of professional templates or build from scratch.
              No design skills needed — just pick, customize, and export.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link to="/templates">
                  Start Creating
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/templates">Browse Templates</Link>
              </Button>
            </div>

            <div className="flex items-center gap-6 mt-10">
              {[
                { value: "10K+", label: "Templates" },
                { value: "50K+", label: "Users" },
                { value: "4.9★", label: "Rating" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden card-shadow">
              <img
                src={heroImg}
                alt="TemplateHub creative workspace"
                width={1280}
                height={800}
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/10 to-transparent" />
            </div>
            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 -left-4 glass-surface rounded-xl px-4 py-3 card-shadow border border-border/50"
            >
              <p className="text-sm font-semibold text-foreground">🎬 500+ Video Templates</p>
            </motion.div>
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -top-4 -right-4 glass-surface rounded-xl px-4 py-3 card-shadow border border-border/50"
            >
              <p className="text-sm font-semibold text-foreground">📄 Resume Builder</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
