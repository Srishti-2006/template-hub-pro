import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TemplateCard from "@/components/TemplateCard";
import templateBirthday from "@/assets/template-birthday.jpg";
import templateTravel from "@/assets/template-travel.jpg";
import templateSocial from "@/assets/template-social.jpg";
import templateResume from "@/assets/template-resume.jpg";
import templatePromo from "@/assets/template-promo.jpg";
import templateSlideshow from "@/assets/template-slideshow.jpg";
import templateThumbnail from "@/assets/template-thumbnail.jpg";

const allTemplates = [
  { title: "Birthday Celebration", category: "video", image: templateBirthday, likes: 2340, views: 12500 },
  { title: "Adventure Travel Reel", category: "video", image: templateTravel, likes: 1890, views: 9800 },
  { title: "Product Promo", category: "video", image: templatePromo, likes: 1560, views: 8700 },
  { title: "Social Story Gradient", category: "photo", image: templateSocial, likes: 3120, views: 18200 },
  { title: "YouTube Thumbnail", category: "photo", image: templateThumbnail, likes: 3890, views: 21300 },
  { title: "Wedding Slideshow", category: "slideshow", image: templateSlideshow, likes: 2780, views: 15400 },
  { title: "Photo Memories", category: "slideshow", image: templateSlideshow, likes: 1920, views: 10200 },
  { title: "Professional CV", category: "resume", image: templateResume, likes: 4560, views: 25100 },
  { title: "Modern Resume", category: "resume", image: templateResume, likes: 5120, views: 28900 },
  { title: "Birthday Party Invite", category: "video", image: templateBirthday, likes: 1450, views: 7800 },
  { title: "Travel Vlog Intro", category: "video", image: templateTravel, likes: 2100, views: 11200 },
  { title: "Instagram Post", category: "photo", image: templateSocial, likes: 2870, views: 16500 },
];

const tabs = [
  { key: "all", label: "All" },
  { key: "video", label: "Videos" },
  { key: "photo", label: "Photos" },
  { key: "slideshow", label: "Slideshows" },
  { key: "resume", label: "Resumes" },
];

const Templates = () => {
  const [searchParams] = useSearchParams();
  const catParam = searchParams.get("cat") || "all";
  const [activeTab, setActiveTab] = useState(catParam);

  const filtered = activeTab === "all"
    ? allTemplates
    : allTemplates.filter((t) => t.category === activeTab);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
              Browse Templates
            </h1>
            <p className="text-muted-foreground">Find the perfect starting point for your next project.</p>
          </motion.div>

          <div className="flex justify-center gap-2 mb-10 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-muted"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((t, i) => (
              <motion.div
                key={t.title + i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <TemplateCard {...t} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Templates;
