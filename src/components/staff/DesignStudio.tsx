import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, ExternalLink, Sparkles, Copy, Check, Type, Image, Layers } from "lucide-react";
import { toast } from "sonner";

const BRAND_COLORS = [
  { name: "Primary Green", hex: "#00FF87", usage: "Headings, CTAs, accents" },
  { name: "Dark Background", hex: "#0A0A0A", usage: "Page backgrounds" },
  { name: "Card Surface", hex: "#111111", usage: "Card backgrounds" },
  { name: "Muted Text", hex: "#888888", usage: "Secondary text" },
  { name: "White", hex: "#FFFFFF", usage: "Primary text" },
  { name: "Accent Gold", hex: "#FFD700", usage: "Awards, highlights" },
  { name: "Error Red", hex: "#FF4444", usage: "Errors, warnings" },
];

const BRAND_FONTS = [
  { name: "Bebas Neue", usage: "Headings, titles, navigation", style: "font-bebas" },
  { name: "Inter", usage: "Body text, paragraphs, UI elements", style: "font-sans" },
];

const CANVA_LINKS = [
  { title: "Main Brand Kit", url: "https://www.canva.com/design/DAG0N9vOwtg/6ZmTuSDkJzR9_b0nl7czJA/edit", description: "All templates, brand assets, and designs" },
];

const DESIGN_TEMPLATES = [
  { name: "Match Day Graphic", size: "1080×1080", platform: "Instagram" },
  { name: "Player Announcement", size: "1080×1350", platform: "Instagram" },
  { name: "Story Template", size: "1080×1920", platform: "Stories" },
  { name: "Twitter Banner", size: "1500×500", platform: "X/Twitter" },
  { name: "YouTube Thumbnail", size: "1280×720", platform: "YouTube" },
  { name: "LinkedIn Post", size: "1200×627", platform: "LinkedIn" },
];

export const DesignStudio = () => {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    toast.success(`Copied ${hex}`);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Palette className="w-5 h-5 text-primary" />
        <h2 className="font-bebas text-2xl text-foreground tracking-wider">Design Studio</h2>
      </div>

      <Tabs defaultValue="brand" className="w-full">
        <TabsList>
          <TabsTrigger value="brand">Brand Kit</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="tools">Design Tools</TabsTrigger>
        </TabsList>

        {/* Brand Kit */}
        <TabsContent value="brand" className="space-y-4">
          {/* Colours */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Palette className="w-4 h-4 text-primary" /> Brand Colours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {BRAND_COLORS.map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => copyColor(color.hex)}
                    className="group text-left"
                  >
                    <div
                      className="w-full aspect-square rounded-lg border border-border mb-1.5 transition-transform group-hover:scale-105 flex items-center justify-center"
                      style={{ backgroundColor: color.hex }}
                    >
                      {copiedColor === color.hex && <Check className="w-5 h-5 text-background" />}
                    </div>
                    <p className="text-xs font-medium text-foreground truncate">{color.name}</p>
                    <p className="text-[10px] text-muted-foreground">{color.hex}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{color.usage}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Typography */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Type className="w-4 h-4 text-primary" /> Typography
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {BRAND_FONTS.map((font) => (
                <div key={font.name} className="flex items-start gap-4 p-3 rounded-lg bg-muted/30 border border-border">
                  <div className="flex-1">
                    <p className={`text-2xl ${font.style} text-foreground`}>{font.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{font.usage}</p>
                  </div>
                  <div className={`text-sm ${font.style} text-muted-foreground`}>
                    ABCDEFGHIJKLM<br />abcdefghijklm<br />0123456789
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" /> Template Sizes
              </CardTitle>
              <CardDescription>Quick reference for design dimensions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {DESIGN_TEMPLATES.map((tpl) => (
                  <div key={tpl.name} className="p-3 rounded-lg border border-border bg-muted/20">
                    <p className="text-sm font-medium text-foreground">{tpl.name}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-muted-foreground">{tpl.size}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-primary/20 text-primary">{tpl.platform}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tools */}
        <TabsContent value="tools" className="space-y-4">
          {CANVA_LINKS.map((link) => (
            <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="block">
              <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20 hover:border-purple-500/50 transition-all hover:shadow-lg cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-500/20">
                        <Sparkles className="w-6 h-6 text-purple-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{link.title}</h3>
                        <p className="text-xs text-muted-foreground">{link.description}</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}

          {/* Quick Colour Picker */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Colour Converter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Label className="text-xs text-muted-foreground whitespace-nowrap">Pick colour:</Label>
                <Input type="color" defaultValue="#00FF87" className="w-12 h-10 p-1 cursor-pointer" onChange={(e) => {
                  navigator.clipboard.writeText(e.target.value);
                  toast.success(`Copied ${e.target.value}`);
                }} />
                <p className="text-xs text-muted-foreground">Click to pick, value auto-copies</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DesignStudio;
