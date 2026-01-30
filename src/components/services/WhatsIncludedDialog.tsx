import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Play, FileText, BarChart3 } from "lucide-react";

interface WhatsIncludedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceType: string;
}

const exampleContent: Record<string, {
  title: string;
  subtitle: string;
  description: string;
  videoUrl?: string;
  imageUrl: string;
  keyPoints: string[];
}> = {
  "pre-match": {
    title: "Slovakia vs England",
    subtitle: "PRE-MATCH OPPOSITION ANALYSIS",
    description: "Comprehensive breakdown of Slovakia's defensive structure and attacking patterns ahead of the Euro 2024 Round of 16 clash.",
    imageUrl: "https://static.wixstatic.com/media/c4f4b1_25e04aa87e0040c98ae2bee0a8c3b6b2f003.jpg/v1/fill/w_940,h_334,q_90,enc_avif,quality_auto/c4f4b1_25e04aa87e0040c98ae2bee0a8c3b6b2f003.jpg",
    keyPoints: [
      "Defensive line positioning analysis",
      "Key player tendencies and weaknesses",
      "Set-piece vulnerabilities identified",
      "Pressing trigger points mapped"
    ]
  },
  "post-match": {
    title: "Máté Sajbán vs Debrecen",
    subtitle: "POST-MATCH PERFORMANCE ANALYSIS",
    description: "Detailed review of individual performance including positioning, decision-making moments, and tactical contributions.",
    imageUrl: "https://static.wixstatic.com/media/c4f4b1_ebc7223a00854d46a2b7930e3230fc67f003.jpg/v1/fill/w_940,h_334,q_90,enc_avif,quality_auto/c4f4b1_ebc7223a00854d46a2b7930e3230fc67f003.jpg",
    keyPoints: [
      "78 individual actions analysed",
      "Key moments with video clips",
      "Strengths and areas to develop",
      "Actionable development plan"
    ]
  },
  "positional": {
    title: "Winger Positioning & Movement",
    subtitle: "POSITIONAL GUIDE",
    description: "Elite-level breakdown using examples from world-class wingers to explain advanced positional concepts.",
    imageUrl: "https://static.wixstatic.com/media/c4f4b1_73bcabee53f44b339d8241c83f3e10f8f003.jpg/v1/fill/w_848,h_334,q_90,enc_avif,quality_auto/c4f4b1_73bcabee53f44b339d8241c83f3e10f8f003.jpg",
    keyPoints: [
      "Movement patterns explained",
      "When to stay wide vs come inside",
      "Creating overloads in the final third",
      "Decision-making triggers"
    ]
  },
  "efficiency": {
    title: "Michael Mulligan (23/24)",
    subtitle: "PLAYER EFFICIENCY REPORT",
    description: "Data-driven performance analysis comparing statistics against positional benchmarks and league averages.",
    imageUrl: "https://static.wixstatic.com/media/c4f4b1_52a05da011a64119a92fb43810dad5eb~mv2.png/v1/fill/w_400,h_300,q_90,enc_avif,quality_auto/c4f4b1_52a05da011a64119a92fb43810dad5eb~mv2.png",
    keyPoints: [
      "Season-long statistical analysis",
      "Comparison to positional benchmarks",
      "Strengths evidenced by data",
      "Professional report format for agents/clubs"
    ]
  }
};

export const WhatsIncludedDialog = ({ open, onOpenChange, serviceType }: WhatsIncludedDialogProps) => {
  const content = exampleContent[serviceType] || exampleContent["post-match"];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] h-[90vh] bg-gradient-to-b from-[#0a2f1a] via-[#081f12] to-[#051208] border-white/10 p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>{content.title}</DialogTitle>
        </DialogHeader>
        
        {/* Close button */}
        <button 
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 z-50 p-2 rounded-full bg-black/50 text-white/70 hover:text-white hover:bg-black/70 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="h-full overflow-y-auto">
          {/* Hero Image */}
          <div className="relative h-48 md:h-64">
            <img 
              src={content.imageUrl}
              alt={content.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a2f1a] via-transparent to-transparent" />
            
            {/* Play button overlay for video content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-accent/90 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                <Play className="w-8 h-8 text-black ml-1" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 space-y-6">
            {/* Title */}
            <div>
              <p className="text-accent font-bebas text-sm tracking-widest mb-2">
                {content.subtitle}
              </p>
              <h2 className="font-bebas text-3xl md:text-4xl text-white tracking-wide">
                {content.title}
              </h2>
            </div>

            {/* Description */}
            <p className="text-white/80 leading-relaxed">
              {content.description}
            </p>

            {/* Key Points */}
            <div className="bg-black/30 border border-white/10 rounded-xl p-5">
              <h3 className="font-bebas text-lg text-accent tracking-wide mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                WHAT'S INCLUDED
              </h3>
              <ul className="space-y-3">
                {content.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-3 text-white/90">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Stats Preview */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-black/30 border border-white/10 rounded-lg p-4 text-center">
                <BarChart3 className="w-6 h-6 text-accent mx-auto mb-2" />
                <p className="font-bebas text-2xl text-white">HD</p>
                <p className="text-white/60 text-xs">Video Quality</p>
              </div>
              <div className="bg-black/30 border border-white/10 rounded-lg p-4 text-center">
                <FileText className="w-6 h-6 text-accent mx-auto mb-2" />
                <p className="font-bebas text-2xl text-white">PDF</p>
                <p className="text-white/60 text-xs">Report Format</p>
              </div>
              <div className="bg-black/30 border border-white/10 rounded-lg p-4 text-center">
                <Play className="w-6 h-6 text-accent mx-auto mb-2" />
                <p className="font-bebas text-2xl text-white">15+</p>
                <p className="text-white/60 text-xs">Video Clips</p>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-4">
              <Button 
                onClick={() => onOpenChange(false)}
                className="w-full font-bebas tracking-wider bg-accent text-black hover:bg-accent/90 py-6 text-lg"
              >
                CLOSE PREVIEW
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
