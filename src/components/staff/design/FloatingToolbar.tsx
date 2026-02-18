import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  MousePointer2, Type, Square, Minus, Hand, Image,
  Circle, Triangle, Star, ArrowRight, Diamond, Hexagon, Pentagon,
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { Tool, ShapeType } from './types';

interface FloatingToolbarProps {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
  onAddShape: (shape: ShapeType) => void;
  onAddImage: () => void;
}

const SHAPE_ICONS: Record<ShapeType, React.ReactNode> = {
  rectangle: <Square className="h-3.5 w-3.5" />,
  circle: <Circle className="h-3.5 w-3.5" />,
  triangle: <Triangle className="h-3.5 w-3.5" />,
  star: <Star className="h-3.5 w-3.5" />,
  arrow: <ArrowRight className="h-3.5 w-3.5" />,
  diamond: <Diamond className="h-3.5 w-3.5" />,
  hexagon: <Hexagon className="h-3.5 w-3.5" />,
  pentagon: <Pentagon className="h-3.5 w-3.5" />,
};

export function FloatingToolbar({ activeTool, onToolChange, onAddShape, onAddImage }: FloatingToolbarProps) {
  const tools: { tool: Tool; icon: React.ReactNode; label: string }[] = [
    { tool: 'select', icon: <MousePointer2 className="h-4 w-4" />, label: 'Select (V)' },
    { tool: 'hand', icon: <Hand className="h-4 w-4" />, label: 'Pan (H)' },
    { tool: 'text', icon: <Type className="h-4 w-4" />, label: 'Text (T)' },
    { tool: 'line', icon: <Minus className="h-4 w-4" />, label: 'Line (L)' },
  ];

  return (
    <TooltipProvider delayDuration={200}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-1 bg-background/95 backdrop-blur border rounded-lg p-1 shadow-lg">
        {tools.map(t => (
          <Tooltip key={t.tool}>
            <TooltipTrigger asChild>
              <Button
                variant={activeTool === t.tool ? 'default' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => onToolChange(t.tool)}
              >
                {t.icon}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">{t.label}</TooltipContent>
          </Tooltip>
        ))}

        {/* Shape picker */}
        <Popover>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button variant={activeTool === 'shape' ? 'default' : 'ghost'} size="icon" className="h-8 w-8">
                  <Square className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">Shapes (S)</TooltipContent>
          </Tooltip>
          <PopoverContent side="right" className="w-auto p-1.5" align="start">
            <div className="grid grid-cols-4 gap-1">
              {(Object.keys(SHAPE_ICONS) as ShapeType[]).map(s => (
                <Button key={s} variant="ghost" size="icon" className="h-8 w-8" onClick={() => { onAddShape(s); onToolChange('select'); }}>
                  {SHAPE_ICONS[s]}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Image upload */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onAddImage}>
              <Image className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="text-xs">Upload Image (I)</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
