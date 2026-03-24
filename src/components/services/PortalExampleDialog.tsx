import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, ArrowRight } from "lucide-react";
import { PortalExample } from "@/pages/PortalExample";
import { Button } from "@/components/ui/button";
import { LocalizedLink } from "@/components/LocalizedLink";

interface PortalExampleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialSection?: string;
  serviceContext?: {
    serviceName: string;
    serviceId?: string;
    analysisTab?: "performance" | "video";
    reportHint?: string;
  };
}

export const PortalExampleDialog = ({ open, onOpenChange, initialSection, serviceContext }: PortalExampleDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-full h-[95vh] bg-background border-white/10 p-0 overflow-hidden flex flex-col">
        <DialogHeader className="sr-only">
          <DialogTitle>Player Portal Example</DialogTitle>
        </DialogHeader>
        
        {/* Close button */}
        <button 
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 z-[60] px-4 py-2 rounded-lg bg-accent text-black font-bebas tracking-wider hover:bg-accent/90 transition-colors flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          CLOSE
        </button>

        {/* Demo badge */}
        <div className="flex-shrink-0 bg-accent/10 border-b border-accent/30 px-4 py-2 flex items-center justify-between">
          <span className="font-bebas tracking-wider text-accent text-sm">
            EXAMPLE PORTAL — CRISTIANO RONALDO
          </span>
        </div>

        {/* Portal content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="w-full max-w-full">
            {open && (
              <PortalExample 
                isEmbedded 
                initialSection={initialSection}
                serviceContext={serviceContext}
              />
            )}
          </div>
        </div>

        {/* Contextual footer linking back to service */}
        {serviceContext && (
          <div className="flex-shrink-0 bg-card border-t border-accent/30 px-4 py-3 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Want this for yourself? Get <span className="text-accent font-medium">{serviceContext.serviceName}</span>
            </p>
            <LocalizedLink to={serviceContext.serviceId ? `/services?service=${serviceContext.serviceId}` : '/services'}>
              <Button 
                size="sm" 
                className="font-bebas tracking-wider bg-accent hover:bg-accent/90 text-black"
                onClick={() => onOpenChange(false)}
              >
                VIEW SERVICE
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </LocalizedLink>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
