import { ClipboardList, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  visible: boolean;
  inProgress: boolean;
  /** When true the reminder is suppressed even if `visible` — used to hide it for pre-rollout players who haven't started a profile yet. */
  legacyHidden?: boolean;
  onOpen: () => void;
  onDismiss: () => void;
}

export const OperatingProfileReminder = ({ visible, inProgress, legacyHidden, onOpen, onDismiss }: Props) => {
  if (!visible || legacyHidden) return null;
  return (
    <div className="sticky top-16 z-40 px-3 sm:px-4 pwa-safe-top">
      <div className="mx-auto max-w-4xl mt-2">
        <div className="rounded-xl border border-accent/40 bg-card/80 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.35)] px-3 sm:px-4 py-2.5 flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
            <ClipboardList className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium leading-tight">
              {inProgress ? "Pick up where you left off" : "What makes you tick?"}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {inProgress ? "Your operating profile is saved - finish it when you get time." : "Help us to know how to provide the best support to you"}
            </div>
          </div>
          <Button size="sm" className="h-8 bg-accent text-accent-foreground hover:bg-accent/90" onClick={onOpen}>
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
