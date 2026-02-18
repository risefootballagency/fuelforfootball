import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

interface ExportDialogProps {
  canvasRef: React.RefObject<HTMLDivElement>;
  projectName: string;
  width: number;
  height: number;
}

export function ExportDialog({ canvasRef, projectName, width, height }: ExportDialogProps) {
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const [scale, setScale] = useState('1');
  const [open, setOpen] = useState(false);

  const handleExport = async () => {
    if (!canvasRef.current) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const s = parseFloat(scale);
      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: null,
        scale: s,
        width,
        height,
        useCORS: true,
        allowTaint: true,
      });
      const dataUrl = canvas.toDataURL(format === 'jpeg' ? 'image/jpeg' : 'image/png', 0.95);
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `${projectName.replace(/\s+/g, '_')}.${format}`;
      a.click();
      toast.success('Exported successfully');
      setOpen(false);
    } catch (err) {
      console.error('Export failed:', err);
      toast.error('Export failed');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5">
          <Download className="h-3 w-3" /> Export
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-sm">Export Design</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">Format</Label>
            <Select value={format} onValueChange={v => setFormat(v as 'png' | 'jpeg')}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="png">PNG (transparent)</SelectItem>
                <SelectItem value="jpeg">JPEG (solid bg)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Scale</Label>
            <Select value={scale} onValueChange={setScale}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1× ({width}×{height})</SelectItem>
                <SelectItem value="2">2× ({width * 2}×{height * 2})</SelectItem>
                <SelectItem value="3">3× ({width * 3}×{height * 3})</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleExport} className="w-full h-8 text-xs">
            <Download className="h-3 w-3 mr-1.5" /> Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
