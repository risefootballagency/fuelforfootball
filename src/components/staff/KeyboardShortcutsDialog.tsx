import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface KeyboardShortcutsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const KeyboardShortcutsDialog = ({ open, onOpenChange }: KeyboardShortcutsDialogProps) => {
  const shortcuts = [
    { keys: ['⌘', 'K'], description: 'Open search' },
    { keys: ['?'], description: 'Show keyboard shortcuts' },
    { keys: ['Esc'], description: 'Go to Overview' },
    { keys: ['1-9'], description: 'Jump to category' },
    { keys: ['↑', '↓'], description: 'Navigate sections' },
    { keys: ['⌘', '⇧', 'F'], description: 'Create new fixture (in analysis)' },
    { keys: ['⌘', '⇧', 'L'], description: 'Import fixture details (in analysis)' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {shortcuts.map((shortcut, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{shortcut.description}</span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key, j) => (
                  <kbd key={j} className="px-2 py-1 text-xs font-mono bg-muted border rounded">
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
