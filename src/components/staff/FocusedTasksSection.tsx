import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Users,
  Megaphone,
  MessageSquare,
  Lightbulb,
  PenLine,
  ImagePlus,
  FileText,
  LayoutList
} from "lucide-react";
import ClubNetworkManagement from "./ClubNetworkManagement";
import { MarketingIdeas, ContentCreator } from "./marketing";

type TaskType = "club-networking" | "player-networking" | "content-creation";

const TASK_CONFIG = {
  "club-networking": { name: "Club Networking", icon: Building2 },
  "player-networking": { name: "Player Networking", icon: Users },
  "content-creation": { name: "Content Creation", icon: Megaphone }
};

export const FocusedTasksSection = () => {
  const [activeTask, setActiveTask] = useState<TaskType>("club-networking");
  const [clubSubTab, setClubSubTab] = useState("network");
  const [contentSubTab, setContentSubTab] = useState("ideas");

  const ActiveIcon = TASK_CONFIG[activeTask].icon;

  return (
    <div className="w-full">
      {/* Header with dropdown */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-lg font-medium text-foreground">
          <ActiveIcon className="h-5 w-5 text-primary" />
          <span className="font-bebas uppercase tracking-wider">{TASK_CONFIG[activeTask].name}</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <LayoutList className="h-4 w-4" />
              Switch Task
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover">
            {(Object.keys(TASK_CONFIG) as TaskType[]).map((taskId) => {
              const Icon = TASK_CONFIG[taskId].icon;
              return (
                <DropdownMenuItem
                  key={taskId}
                  onClick={() => setActiveTask(taskId)}
                  className={activeTask === taskId ? "bg-accent" : ""}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {TASK_CONFIG[taskId].name}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Club Networking */}
      {activeTask === "club-networking" && (
        <Tabs value={clubSubTab} onValueChange={setClubSubTab} className="w-full">
          <TabsList className="w-full h-10 p-1 grid grid-cols-2 mb-4">
            <TabsTrigger value="network" className="gap-2">
              <Building2 className="h-4 w-4" />
              Network
            </TabsTrigger>
            <TabsTrigger value="messages" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Outreach
            </TabsTrigger>
          </TabsList>
          <TabsContent value="network" className="mt-3">
            <ClubNetworkManagement />
          </TabsContent>
          <TabsContent value="messages" className="mt-3">
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Quick message templates coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Player Networking */}
      {activeTask === "player-networking" && (
        <Tabs defaultValue="outreach" className="w-full">
          <TabsList className="w-full h-10 p-1 grid grid-cols-2 mb-4">
            <TabsTrigger value="outreach" className="gap-2">
              <Users className="h-4 w-4" />
              Outreach
            </TabsTrigger>
            <TabsTrigger value="messages" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Templates
            </TabsTrigger>
          </TabsList>
          <TabsContent value="outreach" className="mt-3">
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Player outreach management coming soon</p>
            </div>
          </TabsContent>
          <TabsContent value="messages" className="mt-3">
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Quick message templates coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Content Creation */}
      {activeTask === "content-creation" && (
        <Tabs value={contentSubTab} onValueChange={setContentSubTab} className="w-full">
          <TabsList className="w-full h-auto p-1 grid grid-cols-2 sm:grid-cols-4 gap-1 mb-4">
            <TabsTrigger value="ideas" className="gap-1 text-[10px] sm:text-xs py-2">
              <Lightbulb className="h-3 w-3" />
              <span className="hidden sm:inline">Ideas</span>
              <span className="sm:hidden">Ideas</span>
            </TabsTrigger>
            <TabsTrigger value="write" className="gap-1 text-[10px] sm:text-xs py-2">
              <PenLine className="h-3 w-3" />
              Write
            </TabsTrigger>
            <TabsTrigger value="image" className="gap-1 text-[10px] sm:text-xs py-2">
              <ImagePlus className="h-3 w-3" />
              <span className="hidden sm:inline">Image</span>
              <span className="sm:hidden">Img</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="gap-1 text-[10px] sm:text-xs py-2">
              <FileText className="h-3 w-3" />
              <span className="hidden sm:inline">Schedule</span>
              <span className="sm:hidden">Sch</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="ideas" className="mt-3">
            <MarketingIdeas />
          </TabsContent>
          <TabsContent value="write" className="mt-3">
            <div className="text-center py-8 text-muted-foreground">
              <PenLine className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Content writer coming soon</p>
            </div>
          </TabsContent>
          <TabsContent value="image" className="mt-3">
            <ContentCreator />
          </TabsContent>
          <TabsContent value="schedule" className="mt-3">
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Content scheduler coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
