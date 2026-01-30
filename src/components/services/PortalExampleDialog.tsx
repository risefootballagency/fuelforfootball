import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { PortalExample } from "@/pages/PortalExample";

interface PortalExampleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PortalExampleDialog = ({ open, onOpenChange }: PortalExampleDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-full h-[95vh] bg-background border-white/10 p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Player Portal Example</DialogTitle>
        </DialogHeader>
        
        {/* Close button */}
        <button 
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 z-[60] p-2 rounded-full bg-black/70 text-white/70 hover:text-white hover:bg-black/90 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="h-full overflow-y-auto">
          <PortalExample isEmbedded />
        </div>
      </DialogContent>
    </Dialog>
  );
};
