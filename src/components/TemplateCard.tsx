import { motion } from "framer-motion";
import { Heart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface TemplateCardProps {
  id?: string;
  title: string;
  category: string;
  image: string;
  likes?: number;
  views?: number;
}

const TemplateCard = React.forwardRef<HTMLDivElement, TemplateCardProps>(({ id, title, category, image, likes = 0, views = 0 }, ref) => {
  const navigate = useNavigate();

  const handleUseTemplate = () => {
    if (id) {
      localStorage.setItem("templateId", id);
    }
    navigate("/editor");
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group rounded-xl overflow-hidden bg-card border border-border/50 card-shadow hover:card-shadow-hover transition-shadow"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded-full glass-surface flex items-center justify-center">
              <Heart className="w-3.5 h-3.5 text-primary-foreground" />
            </button>
          </div>
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">{category}</p>
        <h3 className="font-display font-semibold text-foreground text-sm truncate">{title}</h3>
        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{likes}</span>
          <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{views}</span>
        </div>
        <Button
          size="sm"
          className="w-full mt-3 text-xs"
          onClick={handleUseTemplate}
        >
          Use Template
        </Button>
      </div>
    </motion.div>
  );
};

export default TemplateCard;
