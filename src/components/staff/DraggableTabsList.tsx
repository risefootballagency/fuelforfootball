import React, { useState, useEffect } from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

export interface TabItem {
  value: string;
  label: string;
  icon: React.ReactNode;
}

interface DraggableTabsTriggerProps {
  tab: TabItem;
}

const DraggableTabsTrigger = ({ tab }: DraggableTabsTriggerProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tab.value });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <TabsTrigger
        value={tab.value}
        className="flex items-center gap-2 w-full data-[state=active]:bg-primary data-[state=active]:text-[hsl(var(--fff-green-dark))]"
      >
        <span
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-40 transition-opacity absolute left-0.5"
        >
          <GripVertical className="w-3 h-3" />
        </span>
        <span className="flex-shrink-0">{tab.icon}</span>
        <span>{tab.label}</span>
      </TabsTrigger>
    </div>
  );
};

interface DraggableTabsListProps {
  tabs: TabItem[];
  storageKey?: string;
  className?: string;
}

export const DraggableTabsList = ({
  tabs,
  storageKey = "player-tabs-order",
  className,
}: DraggableTabsListProps) => {
  const [orderedTabs, setOrderedTabs] = useState<TabItem[]>(tabs);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const savedOrder: string[] = JSON.parse(saved);
        const reordered = savedOrder
          .map((v) => tabs.find((t) => t.value === v))
          .filter(Boolean) as TabItem[];
        // Add any new tabs not in saved order
        const missing = tabs.filter((t) => !savedOrder.includes(t.value));
        setOrderedTabs([...reordered, ...missing]);
      } catch {
        setOrderedTabs(tabs);
      }
    }
  }, [tabs, storageKey]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = orderedTabs.findIndex((t) => t.value === active.id);
    const newIndex = orderedTabs.findIndex((t) => t.value === over.id);
    const newOrder = arrayMove(orderedTabs, oldIndex, newIndex);
    setOrderedTabs(newOrder);
    localStorage.setItem(
      storageKey,
      JSON.stringify(newOrder.map((t) => t.value))
    );
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={orderedTabs.map((t) => t.value)} strategy={horizontalListSortingStrategy}>
        <TabsList
          className={className || `hidden md:grid md:grid-cols-${orderedTabs.length} w-full gap-1.5 bg-sidebar-accent/50 backdrop-blur-sm rounded-lg p-1.5 mb-4`}
        >
          {orderedTabs.map((tab) => (
            <DraggableTabsTrigger key={tab.value} tab={tab} />
          ))}
        </TabsList>
      </SortableContext>
    </DndContext>
  );
};
