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
        
        {/* Improved Close button - larger, more visible */}
        <button 
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 z-[60] px-4 py-2 rounded-lg bg-accent text-black font-bebas tracking-wider hover:bg-accent/90 transition-colors flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          CLOSE
        </button>

        {/* Prevent horizontal overflow */}
        <div className="h-full overflow-y-auto overflow-x-hidden">
          <div className="w-full max-w-full">
            <PortalExample isEmbedded />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
