import { useState, useCallback } from "react";
import html2pdf from "html2pdf.js";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Eye,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Plus,
  Trash2,
  Edit3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
}

interface Education {
  id: string;
  degree: string;
  school: string;
  period: string;
}

interface ResumeData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
}

const initialData: ResumeData = {
  name: "Alex Johnson",
  title: "Senior Product Designer",
  email: "alex@example.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  summary: "Creative and detail-oriented product designer with 6+ years of experience crafting user-centered digital experiences. Passionate about design systems, accessibility, and creating delightful interfaces.",
  skills: ["UI/UX Design", "Figma", "React", "Design Systems", "User Research", "Prototyping", "Accessibility", "Motion Design"],
  experience: [
    { id: "1", title: "Senior Product Designer", company: "TechCorp Inc.", period: "2022 – Present", description: "Lead design for the core product platform, managing a design system used by 50+ engineers. Increased user engagement by 35% through redesigned onboarding flows." },
    { id: "2", title: "Product Designer", company: "StartupXYZ", period: "2019 – 2022", description: "Designed and shipped 12 major features from concept to launch. Established the company's first comprehensive design system." },
  ],
  education: [
    { id: "1", degree: "B.S. in Computer Science", school: "Stanford University", period: "2015 – 2019" },
  ],
};

const ResumeBuilder = () => {
  const [data, setData] = useState<ResumeData>(initialData);
  const [newSkill, setNewSkill] = useState("");
  const [activePanel, setActivePanel] = useState<"edit" | "preview">("edit");
  const { toast } = useToast();

  const updateField = useCallback(<K extends keyof ResumeData>(field: K, value: ResumeData[K]) => {
    setData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const addSkill = () => {
    if (newSkill.trim()) {
      updateField("skills", [...data.skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    updateField("skills", data.skills.filter((_, i) => i !== index));
  };

  const addExperience = () => {
    const newExp: Experience = { id: Date.now().toString(), title: "", company: "", period: "", description: "" };
    updateField("experience", [...data.experience, newExp]);
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    updateField("experience", data.experience.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };

  const removeExperience = (id: string) => {
    updateField("experience", data.experience.filter((e) => e.id !== id));
  };

  const addEducation = () => {
    const newEd: Education = { id: Date.now().toString(), degree: "", school: "", period: "" };
    updateField("education", [...data.education, newEd]);
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    updateField("education", data.education.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };

  const removeEducation = (id: string) => {
    updateField("education", data.education.filter((e) => e.id !== id));
  };

  const handleExport = () => {
    const element = document.getElementById("resume");
    if (!element) return;
    const opt = {
      margin: 0.5,
      filename: `${data.name || "resume"}.pdf`,
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in" as const, format: "letter" as const, orientation: "portrait" as const },
    };
    html2pdf().set(opt).from(element).save();
    toast({ title: "Resume exported!", description: "Your resume has been downloaded as PDF." });
  };

  // Edit panel
  const EditPanel = () => (
    <div className="space-y-6 p-4 md:p-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
      <div>
        <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
          <Edit3 className="w-4 h-4 text-primary" /> Personal Info
        </h3>
        <div className="space-y-3">
          <Input value={data.name} onChange={(e) => updateField("name", e.target.value)} placeholder="Full Name" />
          <Input value={data.title} onChange={(e) => updateField("title", e.target.value)} placeholder="Job Title" />
          <Input value={data.email} onChange={(e) => updateField("email", e.target.value)} placeholder="Email" />
          <Input value={data.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="Phone" />
          <Input value={data.location} onChange={(e) => updateField("location", e.target.value)} placeholder="Location" />
          <Textarea value={data.summary} onChange={(e) => updateField("summary", e.target.value)} placeholder="Professional summary" rows={4} />
        </div>
      </div>

      <div>
        <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
          <Award className="w-4 h-4 text-primary" /> Skills
        </h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {data.skills.map((skill, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
              {skill}
              <button onClick={() => removeSkill(i)} className="hover:text-destructive">
                <Trash2 className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Add skill" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())} />
          <Button size="sm" variant="outline" onClick={addSkill}><Plus className="w-4 h-4" /></Button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-primary" /> Experience
          </h3>
          <Button size="sm" variant="outline" onClick={addExperience}><Plus className="w-4 h-4 mr-1" />Add</Button>
        </div>
        {data.experience.map((exp) => (
          <div key={exp.id} className="mb-4 p-4 rounded-lg border border-border/50 bg-secondary/30 space-y-2">
            <div className="flex justify-between">
              <Input value={exp.title} onChange={(e) => updateExperience(exp.id, "title", e.target.value)} placeholder="Job Title" className="bg-card" />
              <Button size="icon" variant="ghost" onClick={() => removeExperience(exp.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
            </div>
            <Input value={exp.company} onChange={(e) => updateExperience(exp.id, "company", e.target.value)} placeholder="Company" className="bg-card" />
            <Input value={exp.period} onChange={(e) => updateExperience(exp.id, "period", e.target.value)} placeholder="Period (e.g. 2022 – Present)" className="bg-card" />
            <Textarea value={exp.description} onChange={(e) => updateExperience(exp.id, "description", e.target.value)} placeholder="Description" rows={3} className="bg-card" />
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-primary" /> Education
          </h3>
          <Button size="sm" variant="outline" onClick={addEducation}><Plus className="w-4 h-4 mr-1" />Add</Button>
        </div>
        {data.education.map((ed) => (
          <div key={ed.id} className="mb-4 p-4 rounded-lg border border-border/50 bg-secondary/30 space-y-2">
            <div className="flex justify-between">
              <Input value={ed.degree} onChange={(e) => updateEducation(ed.id, "degree", e.target.value)} placeholder="Degree" className="bg-card" />
              <Button size="icon" variant="ghost" onClick={() => removeEducation(ed.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
            </div>
            <Input value={ed.school} onChange={(e) => updateEducation(ed.id, "school", e.target.value)} placeholder="School" className="bg-card" />
            <Input value={ed.period} onChange={(e) => updateEducation(ed.id, "period", e.target.value)} placeholder="Period" className="bg-card" />
          </div>
        ))}
      </div>
    </div>
  );

  // Preview panel
  const PreviewPanel = () => (
    <div className="bg-card rounded-xl border border-border/50 card-shadow p-8 md:p-10 max-w-2xl mx-auto">
      {/* Header */}
      <div className="border-b-2 border-primary pb-6 mb-6">
        <h1 className="text-3xl font-display font-bold text-foreground">{data.name || "Your Name"}</h1>
        <p className="text-lg text-primary font-medium mt-1">{data.title || "Job Title"}</p>
        <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
          {data.email && <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{data.email}</span>}
          {data.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{data.phone}</span>}
          {data.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{data.location}</span>}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="mb-6">
          <h2 className="text-sm font-display font-bold text-foreground uppercase tracking-wider mb-2">Summary</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{data.summary}</p>
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-display font-bold text-foreground uppercase tracking-wider mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, i) => (
              <span key={i} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{skill}</span>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-display font-bold text-foreground uppercase tracking-wider mb-3">Experience</h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-4 last:mb-0">
              <div className="flex justify-between items-baseline">
                <h3 className="font-display font-semibold text-foreground text-sm">{exp.title}</h3>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{exp.period}</span>
              </div>
              <p className="text-sm text-primary font-medium">{exp.company}</p>
              {exp.description && <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{exp.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div>
          <h2 className="text-sm font-display font-bold text-foreground uppercase tracking-wider mb-3">Education</h2>
          {data.education.map((ed) => (
            <div key={ed.id} className="mb-3 last:mb-0">
              <div className="flex justify-between items-baseline">
                <h3 className="font-display font-semibold text-foreground text-sm">{ed.degree}</h3>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{ed.period}</span>
              </div>
              <p className="text-sm text-muted-foreground">{ed.school}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 glass-surface border-b border-border/50 h-14">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/dashboard"><ArrowLeft className="w-4 h-4" /></Link>
            </Button>
            <span className="font-display font-semibold text-foreground text-sm">Resume Builder</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Mobile toggle */}
            <div className="flex md:hidden rounded-lg bg-secondary p-1">
              <button
                onClick={() => setActivePanel("edit")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${activePanel === "edit" ? "bg-card text-foreground card-shadow" : "text-muted-foreground"}`}
              >
                Edit
              </button>
              <button
                onClick={() => setActivePanel("preview")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${activePanel === "preview" ? "bg-card text-foreground card-shadow" : "text-muted-foreground"}`}
              >
                Preview
              </button>
            </div>
            <Button size="sm" variant="outline">
              <Eye className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Preview</span>
            </Button>
            <Button size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Export PDF</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pt-14 flex h-[calc(100vh)]">
        {/* Edit panel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`w-full md:w-[420px] lg:w-[480px] border-r border-border/50 bg-background flex-shrink-0 overflow-y-auto ${
            activePanel === "preview" ? "hidden md:block" : "block"
          }`}
        >
          <EditPanel />
        </motion.div>

        {/* Preview panel */}
        <div className={`flex-1 bg-secondary/30 overflow-y-auto p-6 md:p-10 ${
          activePanel === "edit" ? "hidden md:block" : "block"
        }`}>
          <PreviewPanel />
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
