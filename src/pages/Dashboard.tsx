import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FolderOpen,
  Layout,
  Bookmark,
  Download,
  Plus,
  MoreHorizontal,
  Clock,
  FileText,
  Video,
  Image,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import templateBirthday from "@/assets/template-birthday.jpg";
import templateTravel from "@/assets/template-travel.jpg";
import templateResume from "@/assets/template-resume.jpg";
import templateSocial from "@/assets/template-social.jpg";

const tabs = [
  { key: "projects", label: "My Projects", icon: FolderOpen },
  { key: "templates", label: "My Templates", icon: Layout },
  { key: "saved", label: "Saved", icon: Bookmark },
  { key: "exports", label: "Export History", icon: Download },
];

const mockProjects = [
  { id: 1, title: "Birthday Video for Mom", type: "video", image: templateBirthday, updatedAt: "2 hours ago", status: "Draft" },
  { id: 2, title: "Travel Vlog Intro", type: "video", image: templateTravel, updatedAt: "1 day ago", status: "Completed" },
  { id: 3, title: "My Resume 2026", type: "resume", image: templateResume, updatedAt: "3 days ago", status: "Completed" },
  { id: 4, title: "Instagram Story Pack", type: "photo", image: templateSocial, updatedAt: "1 week ago", status: "Draft" },
];

const mockExports = [
  { id: 1, title: "Birthday Video for Mom", format: "MP4", size: "24.5 MB", date: "Mar 28, 2026" },
  { id: 2, title: "My Resume 2026", format: "PDF", size: "1.2 MB", date: "Mar 25, 2026" },
  { id: 3, title: "Instagram Story Pack", format: "PNG", size: "3.8 MB", date: "Mar 20, 2026" },
];

const typeIcons: Record<string, typeof Video> = { video: Video, photo: Image, resume: FileText };

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("projects");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground mt-1">Manage your projects and templates.</p>
              </div>
              <Button asChild>
                <Link to="/editor">
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Projects", value: "12", icon: FolderOpen },
              { label: "Templates", value: "5", icon: Layout },
              { label: "Saved", value: "28", icon: Bookmark },
              { label: "Exports", value: "34", icon: Download },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-xl border border-border/50 p-4 card-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-8 overflow-x-auto pb-2 border-b border-border">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? "bg-card text-foreground border border-border border-b-card -mb-px"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          {(activeTab === "projects" || activeTab === "templates" || activeTab === "saved") && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {mockProjects.map((project, i) => {
                const TypeIcon = typeIcons[project.type] || FileText;
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group bg-card rounded-xl border border-border/50 overflow-hidden card-shadow hover:card-shadow-hover transition-shadow"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 right-2">
                        <button className="w-8 h-8 rounded-full glass-surface flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="w-4 h-4 text-foreground" />
                        </button>
                      </div>
                      <div className="absolute top-2 left-2">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          project.status === "Completed"
                            ? "bg-primary/20 text-primary"
                            : "bg-accent/20 text-accent"
                        }`}>
                          {project.status}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display font-semibold text-foreground text-sm truncate">
                            {project.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <TypeIcon className="w-3 h-3" />
                            <span className="capitalize">{project.type}</span>
                            <span>·</span>
                            <Clock className="w-3 h-3" />
                            <span>{project.updatedAt}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1 text-xs" asChild>
                          <Link to={project.type === "resume" ? "/resume-builder" : "/editor"}>Edit</Link>
                        </Button>
                        <Button size="sm" className="flex-1 text-xs">Export</Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {activeTab === "exports" && (
            <div className="bg-card rounded-xl border border-border/50 overflow-hidden card-shadow">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Format</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Size</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                      <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockExports.map((exp) => (
                      <tr key={exp.id} className="border-b border-border/50 last:border-0">
                        <td className="px-4 py-3 text-sm font-medium text-foreground">{exp.title}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                            {exp.format}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{exp.size}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{exp.date}</td>
                        <td className="px-4 py-3 text-right">
                          <Button size="sm" variant="ghost" className="text-xs">
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
