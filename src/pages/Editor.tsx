import { useState, useRef, useCallback, useEffect } from "react";
import html2canvas from "html2canvas";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Type,
  Image as ImageIcon,
  Square,
  Circle,
  Download,
  Save,
  Undo2,
  Redo2,
  Trash2,
  Move,
  ZoomIn,
  ZoomOut,
  Palette,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  Layers,
  Music,
  Play,
  Pause,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

type ElementType = "text" | "image" | "rect" | "circle";

interface CanvasElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  color?: string;
  fontSize?: number;
  fontWeight?: string;
  fontStyle?: string;
  textAlign?: string;
  fontFamily?: string;
  letterSpacing?: number;
  lineHeight?: number;
  textDecoration?: string;
  textTransform?: string;
  textShadow?: string;
  src?: string;
  opacity?: number;
}

const CANVAS_W = 1080;
const CANVAS_H = 1080;

const colorPresets = [
  "hsl(174, 62%, 47%)", "hsl(12, 80%, 62%)", "hsl(220, 25%, 10%)",
  "hsl(260, 60%, 58%)", "hsl(45, 93%, 58%)", "hsl(340, 82%, 52%)",
  "hsl(0, 0%, 100%)", "hsl(0, 0%, 50%)", "hsl(200, 70%, 55%)",
];

const Editor = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [projectId, setProjectId] = useState<string | null>(searchParams.get("project"));
  const [projectTitle, setProjectTitle] = useState("Untitled Project");
  const [saving, setSaving] = useState(false);
  const [elements, setElements] = useState<CanvasElement[]>([
    {
      id: "default-text",
      type: "text",
      x: 200,
      y: 400,
      width: 680,
      height: 80,
      content: "Your Amazing Title",
      color: "hsl(220, 25%, 10%)",
      fontSize: 64,
      fontWeight: "bold",
      textAlign: "center",
      opacity: 1,
    },
  ]);
  const [selectedId, setSelectedId] = useState<string | null>("default-text");
  const [zoom, setZoom] = useState(0.5);
  const [dragInfo, setDragInfo] = useState<{ id: string; startX: number; startY: number; elX: number; elY: number } | null>(null);
  const [activeTool, setActiveTool] = useState<string>("select");
  const [isPlaying, setIsPlaying] = useState(false);
  const [timelinePosition, setTimelinePosition] = useState(0);
  const [templateData, setTemplateData] = useState<{ Title: string; Thumbnail: string; Text: string } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Load existing project from Supabase
  useEffect(() => {
    if (!projectId) return;
    const loadProject = async () => {
      const { data, error } = await (supabase as any)
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .maybeSingle();
      if (error) {
        console.log("Error loading project:", error);
      } else if (data) {
        setProjectTitle(data.title);
        setElements(data.canvas_data as unknown as CanvasElement[]);
        toast({ title: "Project loaded", description: data.title });
      }
    };
    loadProject();
  }, [projectId]);

  const handleSave = async () => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please log in to save your project.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      if (projectId) {
        const { error } = await (supabase as any)
          .from('projects')
          .update({ title: projectTitle, canvas_data: JSON.parse(JSON.stringify(elements)) })
          .eq('id', projectId);
        if (error) throw error;
        toast({ title: "Project saved!" });
      } else {
        const { data, error } = await (supabase as any)
          .from('projects')
          .insert({ user_id: user.id, title: projectTitle, canvas_data: JSON.parse(JSON.stringify(elements)), template_id: localStorage.getItem("templateId") || null })
          .select('id')
          .single();
        if (error) throw error;
        setProjectId(data.id);
        toast({ title: "Project saved!" });
      }
    } catch (err: any) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      handleSave();
    }, 30000);
    return () => clearInterval(interval);
  }, [user, elements, projectTitle, projectId]);

  // Load template from Supabase if templateId is in localStorage
  useEffect(() => {
    const templateId = localStorage.getItem("templateId");
    if (!templateId) return;
    console.log("Template ID:", templateId);

    const getTemplate = async () => {
      const { data, error } = await supabase
        .from('Templates')
        .select('*')
        .eq('Id', templateId)
        .maybeSingle();

      if (error) {
        console.log(error);
      } else if (data) {
        console.log("Loaded template:", data);
        console.log("Thumbnail:", data.Thumbnail);
        setTemplateData(data);
        // Set initial canvas elements from template
        const newElements: CanvasElement[] = [];
        // Add thumbnail as background image if available
        if (data.Thumbnail) {
          newElements.push({
            id: "template-bg",
            type: "image",
            x: 0,
            y: 0,
            width: CANVAS_W,
            height: CANVAS_H,
            src: data.Thumbnail,
            opacity: 1,
          });
        }
        newElements.push({
          id: "template-text",
          type: "text",
          x: 200,
          y: 400,
          width: 680,
          height: 80,
          content: data.Title,
          color: "hsl(0, 0%, 100%)",
          fontSize: 64,
          fontWeight: "bold",
          textAlign: "center",
          opacity: 1,
        });
        setElements(newElements);
        toast({ title: "Template loaded", description: data.Title });
      }
    };
    getTemplate();
  }, []);

  const selected = elements.find((e) => e.id === selectedId);

  const addElement = useCallback((type: ElementType) => {
    const newEl: CanvasElement = {
      id: Date.now().toString(),
      type,
      x: 300 + Math.random() * 200,
      y: 300 + Math.random() * 200,
      width: type === "text" ? 400 : type === "circle" ? 200 : 250,
      height: type === "text" ? 60 : type === "circle" ? 200 : 200,
      content: type === "text" ? "Edit this text" : undefined,
      color: type === "text" ? "hsl(220, 25%, 10%)" : "hsl(174, 62%, 47%)",
      fontSize: type === "text" ? 32 : undefined,
      fontWeight: "normal",
      textAlign: "left",
      opacity: 1,
    };
    setElements((prev) => [...prev, newEl]);
    setSelectedId(newEl.id);
    setActiveTool("select");
  }, []);

  const updateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
    setElements((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  }, []);

  const deleteElement = useCallback((id: string) => {
    setElements((prev) => prev.filter((e) => e.id !== id));
    setSelectedId(null);
  }, []);

  const handleCanvasMouseDown = (e: React.MouseEvent, elId: string) => {
    e.stopPropagation();
    setSelectedId(elId);
    const el = elements.find((el) => el.id === elId);
    if (!el) return;
    setDragInfo({ id: elId, startX: e.clientX, startY: e.clientY, elX: el.x, elY: el.y });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!dragInfo) return;
    const dx = (e.clientX - dragInfo.startX) / zoom;
    const dy = (e.clientY - dragInfo.startY) / zoom;
    updateElement(dragInfo.id, { x: dragInfo.elX + dx, y: dragInfo.elY + dy });
  };

  const handleCanvasMouseUp = () => setDragInfo(null);

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        const img = new window.Image();
        img.onload = () => {
          const ratio = img.width / img.height;
          const w = 400;
          const h = w / ratio;
          const newEl: CanvasElement = {
            id: Date.now().toString(),
            type: "image",
            x: 340,
            y: 340,
            width: w,
            height: h,
            src: url,
            opacity: 1,
          };
          setElements((prev) => [...prev, newEl]);
          setSelectedId(newEl.id);
        };
        img.src = url;
      }
    };
    input.click();
  };

  const tools = [
    { id: "select", icon: Move, label: "Select", action: () => setActiveTool("select") },
    { id: "text", icon: Type, label: "Text", action: () => addElement("text") },
    { id: "image", icon: ImageIcon, label: "Image", action: handleImageUpload },
    { id: "rect", icon: Square, label: "Rectangle", action: () => addElement("rect") },
    { id: "circle", icon: Circle, label: "Circle", action: () => addElement("circle") },
  ];

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Top bar */}
      <div className="h-14 border-b border-border/50 glass-surface flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/dashboard"><ArrowLeft className="w-4 h-4" /></Link>
          </Button>
          <input
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            className="font-display font-semibold text-foreground text-sm bg-transparent border-none outline-none w-40 md:w-56 focus:ring-1 focus:ring-primary rounded px-1"
            placeholder="Project title..."
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon"><Undo2 className="w-4 h-4" /></Button>
          <Button variant="ghost" size="icon"><Redo2 className="w-4 h-4" /></Button>
          <div className="h-6 w-px bg-border mx-1" />
          <Button variant="ghost" size="icon" onClick={() => setZoom((z) => Math.max(0.2, z - 0.1))}><ZoomOut className="w-4 h-4" /></Button>
          <span className="text-xs text-muted-foreground w-12 text-center">{Math.round(zoom * 100)}%</span>
          <Button variant="ghost" size="icon" onClick={() => setZoom((z) => Math.min(2, z + 0.1))}><ZoomIn className="w-4 h-4" /></Button>
          <div className="h-6 w-px bg-border mx-1" />
          <Button size="sm" variant="outline" onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">{saving ? "Saving..." : "Save"}</span>
          </Button>
          <Button size="sm" onClick={async () => {
            if (!canvasRef.current) return;
            try {
              // Temporarily remove transform for accurate capture
              const el = canvasRef.current;
              const origTransform = el.style.transform;
              el.style.transform = "scale(1)";
              const canvas = await html2canvas(el, { useCORS: true, allowTaint: true, scale: 2 });
              el.style.transform = origTransform;
              const link = document.createElement("a");
              link.download = `${projectTitle || "template"}.png`;
              link.href = canvas.toDataURL("image/png");
              link.click();
              toast({ title: "Exported!", description: "Your design has been downloaded." });
            } catch (err: any) {
              toast({ title: "Export failed", description: err.message, variant: "destructive" });
            }
          }}>
            <Download className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left toolbar */}
        <div className="w-14 md:w-16 border-r border-border/50 bg-card flex flex-col items-center py-4 gap-1 flex-shrink-0">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={tool.action}
              title={tool.label}
              className={`w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center transition-colors ${
                activeTool === tool.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              <tool.icon className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          ))}
          <div className="h-px w-8 bg-border my-2" />
          <button
            title="Music"
            className="w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors"
          >
            <Music className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <button
            title="Layers"
            className="w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors"
          >
            <Layers className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>

        {/* Canvas area */}
        <div
          className="flex-1 overflow-auto bg-secondary/50 flex items-center justify-center relative"
          onClick={() => setSelectedId(null)}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
        >
          <div
            ref={canvasRef}
            className="relative bg-card card-shadow rounded-lg"
            style={{
              width: CANVAS_W,
              height: CANVAS_H,
              transform: `scale(${zoom})`,
              transformOrigin: "center center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grid */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }} />

            {elements.map((el) => {
              const isSelected = el.id === selectedId;
              return (
                <motion.div
                  key={el.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: el.opacity ?? 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  onMouseDown={(e) => handleCanvasMouseDown(e, el.id)}
                  className={`absolute cursor-move ${isSelected ? "ring-2 ring-primary ring-offset-2" : ""}`}
                  style={{
                    left: el.x,
                    top: el.y,
                    width: el.width,
                    height: el.height,
                  }}
                >
                  {el.type === "text" && (
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => updateElement(el.id, { content: e.currentTarget.textContent || "" })}
                      className="w-full h-full outline-none"
                      style={{
                        color: el.color,
                        fontSize: el.fontSize,
                        fontWeight: el.fontWeight,
                        fontStyle: el.fontStyle,
                        textAlign: el.textAlign as any,
                        fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
                        lineHeight: 1.2,
                      }}
                    >
                      {el.content}
                    </div>
                  )}
                  {el.type === "rect" && (
                    <div className="w-full h-full rounded-lg" style={{ backgroundColor: el.color }} />
                  )}
                  {el.type === "circle" && (
                    <div className="w-full h-full rounded-full" style={{ backgroundColor: el.color }} />
                  )}
                  {el.type === "image" && el.src && (
                    <motion.img
                      src={el.src}
                      alt=""
                      className="w-full h-full object-cover rounded-lg"
                      draggable={false}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  )}
                  {/* Resize handle */}
                  {isSelected && (
                    <div className="absolute -right-1.5 -bottom-1.5 w-3 h-3 rounded-full bg-primary border-2 border-card cursor-se-resize" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right properties panel */}
        {selected && (
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-64 border-l border-border/50 bg-card p-4 overflow-y-auto flex-shrink-0 hidden md:block"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-foreground text-sm capitalize">{selected.type} Properties</h3>
              <Button variant="ghost" size="icon" onClick={() => deleteElement(selected.id)}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Position */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Position</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-muted-foreground">X</label>
                    <Input type="number" value={Math.round(selected.x)} onChange={(e) => updateElement(selected.id, { x: Number(e.target.value) })} className="h-8 text-xs" />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground">Y</label>
                    <Input type="number" value={Math.round(selected.y)} onChange={(e) => updateElement(selected.id, { y: Number(e.target.value) })} className="h-8 text-xs" />
                  </div>
                </div>
              </div>

              {/* Size */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Size</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-muted-foreground">W</label>
                    <Input type="number" value={Math.round(selected.width)} onChange={(e) => updateElement(selected.id, { width: Number(e.target.value) })} className="h-8 text-xs" />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground">H</label>
                    <Input type="number" value={Math.round(selected.height)} onChange={(e) => updateElement(selected.id, { height: Number(e.target.value) })} className="h-8 text-xs" />
                  </div>
                </div>
              </div>

              {/* Opacity */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Opacity</p>
                <Slider
                  value={[(selected.opacity ?? 1) * 100]}
                  min={0} max={100} step={1}
                  onValueChange={([v]) => updateElement(selected.id, { opacity: v / 100 })}
                />
              </div>

              {/* Text options */}
              {selected.type === "text" && (
                <>
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Font Size</p>
                    <Input type="number" value={selected.fontSize} onChange={(e) => updateElement(selected.id, { fontSize: Number(e.target.value) })} className="h-8 text-xs" />
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => updateElement(selected.id, { fontWeight: selected.fontWeight === "bold" ? "normal" : "bold" })}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${selected.fontWeight === "bold" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => updateElement(selected.id, { fontStyle: selected.fontStyle === "italic" ? "normal" : "italic" })}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${selected.fontStyle === "italic" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                      <Italic className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => updateElement(selected.id, { textAlign: "left" })}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${selected.textAlign === "left" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                      <AlignLeft className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => updateElement(selected.id, { textAlign: "center" })}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${selected.textAlign === "center" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                      <AlignCenter className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              )}

              {/* Color */}
              {(selected.type === "text" || selected.type === "rect" || selected.type === "circle") && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                    <Palette className="w-3 h-3" /> Color
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {colorPresets.map((c) => (
                      <button
                        key={c}
                        onClick={() => updateElement(selected.id, { color: c })}
                        className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${selected.color === c ? "border-primary scale-110" : "border-border"}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Timeline */}
      <div className="h-20 border-t border-border/50 bg-card flex-shrink-0 flex items-center px-4 gap-4">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="w-8 h-8"><SkipBack className="w-3.5 h-3.5" /></Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8"><SkipForward className="w-3.5 h-3.5" /></Button>
        </div>
        <span className="text-xs text-muted-foreground font-mono w-20">
          0:{String(timelinePosition).padStart(2, "0")} / 0:30
        </span>
        <div className="flex-1">
          <Slider
            value={[timelinePosition]}
            min={0} max={30} step={1}
            onValueChange={([v]) => setTimelinePosition(v)}
          />
        </div>
        <div className="hidden md:flex gap-1">
          {elements.map((el) => (
            <div
              key={el.id}
              onClick={() => setSelectedId(el.id)}
              className={`h-8 rounded px-2 flex items-center text-xs cursor-pointer ${
                el.id === selectedId ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
              }`}
            >
              {el.type === "text" ? "T" : el.type === "image" ? "📷" : el.type === "rect" ? "□" : "○"}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Editor;
