import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  FolderOpen,
  Layout,
  Bookmark,
  Download,
  Plus,
  MoreHorizontal,
  Clock,
  FileText,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const tabs = [
  { key: "projects", label: "My Projects", icon: FolderOpen },
  { key: "templates", label: "My Templates", icon: Layout },
  { key: "saved", label: "Saved", icon: Bookmark },
  { key: "exports", label: "Export History", icon: Download },
];

interface Project {
  id: string;
  title: string;
  canvas_data: any;
  template_id: string | null;
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;
    const getProjects = async () => {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.log("Error fetching projects:", error);
      } else {
        setProjects(data || []);
      }
      setLoading(false);
    };
    getProjects();
  }, [user]);

  const handleDelete = async (id: string) => {
    const { error } = await (supabase as any)
      .from('projects')
      .delete()
      .eq('id', id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    } else {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast({ title: "Project deleted" });
    }
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

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
              { label: "Projects", value: String(projects.length), icon: FolderOpen },
              { label: "Templates", value: "0", icon: Layout },
              { label: "Saved", value: "0", icon: Bookmark },
              { label: "Exports", value: "0", icon: Download },
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
          {activeTab === "projects" && (
            <div>
              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : projects.length === 0 ? (
                <div className="text-center py-20">
                  <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-display font-semibold text-foreground mb-2">No projects yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first project to get started.</p>
                  <Button asChild>
                    <Link to="/editor"><Plus className="w-4 h-4 mr-2" />New Project</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {projects.map((project, i) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="group bg-card rounded-xl border border-border/50 overflow-hidden card-shadow hover:card-shadow-hover transition-shadow"
                    >
                      <div className="relative aspect-video overflow-hidden bg-secondary flex items-center justify-center">
                        {project.thumbnail_url ? (
                          <img
                            src={project.thumbnail_url}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <FileText className="w-10 h-10 text-muted-foreground" />
                        )}
                        <div className="absolute top-2 right-2">
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="w-8 h-8 rounded-full glass-surface flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-display font-semibold text-foreground text-sm truncate">
                          {project.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{timeAgo(project.updated_at)}</span>
                        </div>
                        <div className="mt-3">
                          <Button size="sm" className="w-full text-xs" asChild>
                            <Link to={`/editor?project=${project.id}`}>Edit</Link>
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {(activeTab === "templates" || activeTab === "saved") && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">Coming soon.</p>
            </div>
          )}

          {activeTab === "exports" && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No exports yet.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
