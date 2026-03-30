import { motion } from "framer-motion";
import TemplateCard from "./TemplateCard";
import templateBirthday from "@/assets/template-birthday.jpg";
import templateTravel from "@/assets/template-travel.jpg";
import templateSocial from "@/assets/template-social.jpg";
import templateResume from "@/assets/template-resume.jpg";
import templatePromo from "@/assets/template-promo.jpg";
import templateSlideshow from "@/assets/template-slideshow.jpg";
import templateThumbnail from "@/assets/template-thumbnail.jpg";

const trending = [
  { title: "Birthday Celebration", category: "Video", image: templateBirthday, likes: 2340, views: 12500 },
  { title: "Adventure Travel Reel", category: "Video", image: templateTravel, likes: 1890, views: 9800 },
  { title: "Social Story Gradient", category: "Photo", image: templateSocial, likes: 3120, views: 18200 },
  { title: "Professional CV", category: "Resume", image: templateResume, likes: 4560, views: 25100 },
  { title: "Product Showcase", category: "Video", image: templatePromo, likes: 1560, views: 8700 },
  { title: "Wedding Slideshow", category: "Slideshow", image: templateSlideshow, likes: 2780, views: 15400 },
  { title: "YouTube Thumbnail", category: "Photo", image: templateThumbnail, likes: 3890, views: 21300 },
  { title: "Modern Resume", category: "Resume", image: templateResume, likes: 5120, views: 28900 },
];

const TrendingSection = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
              🔥 Trending Templates
            </h2>
            <p className="text-muted-foreground">Most popular picks from our community this week.</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {trending.map((t, i) => (
            <motion.div
              key={t.title + i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <TemplateCard {...t} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
