import { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { googleFonts, loadGoogleFont, getFontValue, getFontNameFromValue } from "@/lib/google-fonts";

interface GoogleFontPickerProps {
  value: string;
  onChange: (value: string) => void;
}

const systemFonts = [
  { label: "System Default", value: "system-ui, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Courier New", value: '"Courier New", monospace' },
  { label: "Impact", value: "Impact, sans-serif" },
  { label: "Times New Roman", value: '"Times New Roman", serif' },
  { label: "Arial", value: "Arial, Helvetica, sans-serif" },
  { label: "Verdana", value: "Verdana, sans-serif" },
];

export function GoogleFontPicker({ value, onChange }: GoogleFontPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const currentFontName = getFontNameFromValue(value);

  // Load current font
  useEffect(() => {
    if (googleFonts.includes(currentFontName)) {
      loadGoogleFont(currentFontName);
    }
  }, [currentFontName]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const gFonts = googleFonts
      .filter((f) => f.toLowerCase().includes(q))
      .sort((a, b) => a.localeCompare(b));
    const sFonts = systemFonts.filter((f) => f.label.toLowerCase().includes(q));
    return { google: gFonts, system: sFonts };
  }, [search]);

  // Preload visible fonts when popover opens
  useEffect(() => {
    if (open) {
      // Load first 20 fonts for preview
      filtered.google.slice(0, 20).forEach(loadGoogleFont);
    }
  }, [open, filtered.google]);

  const handleSelect = (fontName: string, isGoogle: boolean) => {
    if (isGoogle) {
      loadGoogleFont(fontName);
      onChange(getFontValue(fontName));
    } else {
      const sys = systemFonts.find((f) => f.label === fontName);
      if (sys) onChange(sys.value);
    }
    setOpen(false);
    setSearch("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="w-full h-8 px-3 text-xs text-left rounded-md border border-input bg-background hover:bg-accent/50 transition-colors truncate"
          style={{ fontFamily: value }}
        >
          {currentFontName}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <div className="p-2 border-b border-border">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Search fonts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-7 text-xs"
              autoFocus
            />
          </div>
        </div>
        <ScrollArea className="h-[280px]">
          {filtered.system.length > 0 && (
            <div className="p-1">
              <p className="px-2 py-1 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">System</p>
              {filtered.system.map((f) => (
                <button
                  key={f.label}
                  onClick={() => handleSelect(f.label, false)}
                  className={`w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent/50 transition-colors ${
                    value === f.value ? "bg-accent text-accent-foreground" : ""
                  }`}
                  style={{ fontFamily: f.value }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}
          {filtered.google.length > 0 && (
            <div className="p-1">
              <p className="px-2 py-1 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Google Fonts</p>
              {filtered.google.map((name) => (
                <button
                  key={name}
                  onClick={() => handleSelect(name, true)}
                  onMouseEnter={() => loadGoogleFont(name)}
                  className={`w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent/50 transition-colors ${
                    currentFontName === name ? "bg-accent text-accent-foreground" : ""
                  }`}
                  style={{ fontFamily: getFontValue(name) }}
                >
                  {name}
                </button>
              ))}
            </div>
          )}
          {filtered.google.length === 0 && filtered.system.length === 0 && (
            <p className="text-center text-xs text-muted-foreground py-6">No fonts found</p>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
