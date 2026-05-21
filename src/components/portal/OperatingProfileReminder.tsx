import { ClipboardList, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  visible: boolean;
  inProgress: boolean;
  onOpen: () => void;
  onDismiss: () => void;
}

export const OperatingProfileReminder = ({ visible, inProgress, onOpen, onDismiss }: Props) => {
  if (!visible) return null;
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] px-3 sm:px-4 pwa-safe-bottom w-full max-w-xl">
      <div className="mx-auto">
        <div className="rounded-xl border border-accent/40 bg-card/95 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.45)] px-3 sm:px-4 py-2.5 flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
            <ClipboardList className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium leading-tight">
              {inProgress ? "Pick up where you left off" : "Tell us about you"}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {inProgress ? "Your operating profile is saved - finish it when you get time." : "A quick operating profile helps us tailor your plan."}
            </div>
          </div>
          <Button size="sm" className="h-8 bg-accent text-black hover:bg-accent/90" onClick={onOpen}>
            {inProgress ? "Continue" : "Start"}
          </Button>
          <button type="button" onClick={onDismiss} aria-label="Dismiss" className="p-1 text-muted-foreground hover:text-foreground rounded-md">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
