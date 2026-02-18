import { useState, useRef, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { sharedSupabase as supabase } from "@/integrations/supabase/sharedClient";
import { toast } from "sonner";
import {
  Video, Plus, Trash2, Play, Pause, SkipBack, SkipForward, Tag,
  Clock, Save, Upload, Scissors, ChevronDown, ChevronUp, X, Edit, Eye,
} from "lucide-react";

interface VideoClip {
  id: string;
  title: string;
  start_time: number;
  end_time: number;
  tags: string[];
  notes: string;
  half: 1 | 2;
}

interface MatchVideo {
  id: string;
  title: string;
  video_url: string;
  match_date: string;
  home_team: string;
  away_team: string;
  clips: VideoClip[];
  created_at: string;
}

const ACTION_TAGS = [
  "Build-up", "Pressing", "Box Entry", "Set Piece", "Counter Attack",
  "Transition", "Goal", "Chance", "Defensive Action", "Key Pass",
  "Dribble", "Tackle", "Interception", "Error", "Save",
];

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

export const VideoAnalysis = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videos, setVideos] = useState<MatchVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<MatchVideo | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [clipStart, setClipStart] = useState<number | null>(null);
  const [editingClip, setEditingClip] = useState<VideoClip | null>(null);
  const [showAddVideo, setShowAddVideo] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [half, setHalf] = useState<1 | 2>(1);
  const [expandedClip, setExpandedClip] = useState<string | null>(null);

  // New video form
  const [newTitle, setNewTitle] = useState("");
  const [newHomeTeam, setNewHomeTeam] = useState("");
  const [newAwayTeam, setNewAwayTeam] = useState("");
  const [newMatchDate, setNewMatchDate] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);

  // Clip form
  const [clipTitle, setClipTitle] = useState("");
  const [clipTags, setClipTags] = useState<string[]>([]);
  const [clipNotes, setClipNotes] = useState("");

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    const { data } = await supabase
      .from("coaching_analysis" as any)
      .select("*")
      .eq("analysis_type", "video_analysis")
      .order("created_at", { ascending: false });
    
    if (data) {
      setVideos(data.map((d: any) => ({
        id: d.id,
        title: d.title,
        video_url: d.content || "",
        match_date: d.description || "",
        home_team: d.category || "",
        away_team: d.folder || "",
        clips: Array.isArray(d.attachments) ? d.attachments : [],
        created_at: d.created_at,
      })));
    }
  };

  const handleUploadVideo = async () => {
    if (!videoFile || !newTitle) {
      toast.error("Please provide a title and video file");
      return;
    }
    setUploading(true);
    try {
      const ext = videoFile.name.split(".").pop();
      const path = `video-analysis/${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage
        .from("analysis-videos")
        .upload(path, videoFile);
      if (uploadErr) throw uploadErr;

      const { data: urlData } = supabase.storage.from("analysis-videos").getPublicUrl(path);
      
      const { error } = await supabase.from("coaching_analysis" as any).insert({
        title: newTitle,
        analysis_type: "video_analysis",
        content: urlData.publicUrl,
        description: newMatchDate,
        category: newHomeTeam,
        folder: newAwayTeam,
        attachments: [],
      });
      if (error) throw error;

      toast.success("Video uploaded");
      setShowAddVideo(false);
      setNewTitle("");
      setNewHomeTeam("");
      setNewAwayTeam("");
      setNewMatchDate("");
      setVideoFile(null);
      loadVideos();
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    }
    setUploading(false);
  };

  const saveClips = async (video: MatchVideo, clips: VideoClip[]) => {
    const { error } = await supabase
      .from("coaching_analysis" as any)
      .update({ attachments: clips as any })
      .eq("id", video.id);
    if (error) {
      toast.error("Failed to save clips");
    } else {
      setSelectedVideo({ ...video, clips });
      loadVideos();
    }
  };

  const handleMarkIn = () => {
    if (videoRef.current) {
      setClipStart(videoRef.current.currentTime);
      toast.info(`Clip start: ${formatTime(videoRef.current.currentTime)}`);
    }
  };

  const handleMarkOut = () => {
    if (!videoRef.current || clipStart === null) {
      toast.error("Set clip start first");
      return;
    }
    const end = videoRef.current.currentTime;
    if (end <= clipStart) {
      toast.error("End must be after start");
      return;
    }
    setEditingClip({
      id: crypto.randomUUID(),
      title: "",
      start_time: clipStart,
      end_time: end,
      tags: [],
      notes: "",
      half,
    });
    setClipTitle("");
    setClipTags([]);
    setClipNotes("");
  };

  const handleSaveClip = () => {
    if (!editingClip || !selectedVideo) return;
    const clip: VideoClip = {
      ...editingClip,
      title: clipTitle || `Clip ${selectedVideo.clips.length + 1}`,
      tags: clipTags,
      notes: clipNotes,
    };
    const updated = [...selectedVideo.clips, clip];
    saveClips(selectedVideo, updated);
    setEditingClip(null);
    setClipStart(null);
    toast.success("Clip saved");
  };

  const handleDeleteClip = (clipId: string) => {
    if (!selectedVideo) return;
    const updated = selectedVideo.clips.filter(c => c.id !== clipId);
    saveClips(selectedVideo, updated);
    toast.success("Clip deleted");
  };

  const playClip = (clip: VideoClip) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = clip.start_time;
    videoRef.current.play();
    setIsPlaying(true);
    
    const checkEnd = () => {
      if (videoRef.current && videoRef.current.currentTime >= clip.end_time) {
        videoRef.current.pause();
        setIsPlaying(false);
        videoRef.current.removeEventListener("timeupdate", checkEnd);
      }
    };
    videoRef.current.addEventListener("timeupdate", checkEnd);
  };

  const toggleTag = (tag: string) => {
    setClipTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) { videoRef.current.pause(); } else { videoRef.current.play(); }
    setIsPlaying(!isPlaying);
  };

  const skip = (seconds: number) => {
    if (videoRef.current) videoRef.current.currentTime += seconds;
  };

  const handleDeleteVideo = async (videoId: string) => {
    const { error } = await supabase.from("coaching_analysis" as any).delete().eq("id", videoId);
    if (error) toast.error("Delete failed");
    else {
      toast.success("Video deleted");
      if (selectedVideo?.id === videoId) setSelectedVideo(null);
      loadVideos();
    }
  };

  // ── Video list view ──
  if (!selectedVideo) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Video className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">Video Analysis</h2>
              <p className="text-sm text-muted-foreground">
                {videos.length} video{videos.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <Button onClick={() => setShowAddVideo(true)} size="sm">
            <Plus className="w-4 h-4 mr-1" /> Add Video
          </Button>
        </div>

        {videos.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No videos yet</p>
              <p className="text-sm">Upload match footage to start clipping and tagging</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {videos.map(v => (
              <Card key={v.id} className="cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => setSelectedVideo(v)}>
                <CardContent className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <Video className="w-5 h-5 text-primary shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium truncate">{v.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {v.home_team && v.away_team ? `${v.home_team} vs ${v.away_team}` : ""}
                        {v.match_date ? ` • ${v.match_date}` : ""}
                        {` • ${v.clips.length} clip${v.clips.length !== 1 ? "s" : ""}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleDeleteVideo(v.id); }}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add Video Dialog */}
        <Dialog open={showAddVideo} onOpenChange={setShowAddVideo}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Match Video</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Title *</Label>
                <Input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g. vs Arsenal - GW12" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Home Team</Label>
                  <Input value={newHomeTeam} onChange={e => setNewHomeTeam(e.target.value)} />
                </div>
                <div>
                  <Label>Away Team</Label>
                  <Input value={newAwayTeam} onChange={e => setNewAwayTeam(e.target.value)} />
                </div>
              </div>
              <div>
                <Label>Match Date</Label>
                <Input type="date" value={newMatchDate} onChange={e => setNewMatchDate(e.target.value)} />
              </div>
              <div>
                <Label>Video File *</Label>
                <Input type="file" accept="video/*" onChange={e => setVideoFile(e.target.files?.[0] || null)} />
              </div>
              <Button onClick={handleUploadVideo} disabled={uploading} className="w-full">
                {uploading ? "Uploading..." : "Upload & Create"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // ── Video editor view ──
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => setSelectedVideo(null)}>
          ← Back
        </Button>
        <h2 className="text-lg font-semibold truncate">{selectedVideo.title}</h2>
        {selectedVideo.home_team && selectedVideo.away_team && (
          <Badge variant="outline" className="shrink-0">
            {selectedVideo.home_team} vs {selectedVideo.away_team}
          </Badge>
        )}
      </div>

      {/* Video Player */}
      <div className="relative bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          src={selectedVideo.video_url}
          className="w-full max-h-[50vh] object-contain"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={() => {
            if (videoRef.current) setDuration(videoRef.current.duration);
          }}
          onEnded={() => setIsPlaying(false)}
        />
      </div>

      {/* Transport Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button variant="outline" size="sm" onClick={() => skip(-10)}>
          <SkipBack className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={togglePlayPause}>
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        <Button variant="outline" size="sm" onClick={() => skip(10)}>
          <SkipForward className="w-4 h-4" />
        </Button>
        <span className="text-xs text-muted-foreground font-mono">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <Select value={String(half)} onValueChange={v => setHalf(Number(v) as 1 | 2)}>
            <SelectTrigger className="w-24 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1st Half</SelectItem>
              <SelectItem value="2">2nd Half</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" variant={clipStart !== null ? "default" : "outline"} onClick={handleMarkIn}>
            <Scissors className="w-4 h-4 mr-1" /> In
          </Button>
          <Button size="sm" onClick={handleMarkOut} disabled={clipStart === null}>
            <Scissors className="w-4 h-4 mr-1" /> Out
          </Button>
        </div>
      </div>

      {/* Timeline bar */}
      <div className="relative h-6 bg-muted rounded-full overflow-hidden cursor-pointer"
        onClick={(e) => {
          if (!videoRef.current) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const pct = (e.clientX - rect.left) / rect.width;
          videoRef.current.currentTime = pct * duration;
        }}
      >
        <div className="absolute left-0 top-0 h-full bg-primary/30" style={{ width: `${(currentTime / duration) * 100}%` }} />
        {selectedVideo.clips.map(clip => (
          <div
            key={clip.id}
            className="absolute top-0 h-full bg-primary/50 border-x border-primary"
            style={{
              left: `${(clip.start_time / duration) * 100}%`,
              width: `${((clip.end_time - clip.start_time) / duration) * 100}%`,
            }}
            title={clip.title}
          />
        ))}
        {clipStart !== null && (
          <div
            className="absolute top-0 h-full bg-destructive/30 border-l-2 border-destructive"
            style={{ left: `${(clipStart / duration) * 100}%`, width: "2px" }}
          />
        )}
      </div>

      {/* Clip Editor Dialog */}
      {editingClip && (
        <Card className="border-primary">
          <CardContent className="pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">New Clip: {formatTime(editingClip.start_time)} → {formatTime(editingClip.end_time)}</h3>
              <Button variant="ghost" size="sm" onClick={() => { setEditingClip(null); setClipStart(null); }}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <Input value={clipTitle} onChange={e => setClipTitle(e.target.value)} placeholder="Clip title" />
            <div>
              <Label className="text-xs">Tags</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {ACTION_TAGS.map(tag => (
                  <Badge
                    key={tag}
                    variant={clipTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer text-[10px]"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <Textarea value={clipNotes} onChange={e => setClipNotes(e.target.value)} placeholder="Notes..." rows={2} />
            <Button onClick={handleSaveClip} size="sm" className="w-full">
              <Save className="w-4 h-4 mr-1" /> Save Clip
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Clips List */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Tag className="w-4 h-4" />
          Clips ({selectedVideo.clips.length})
        </h3>
        {selectedVideo.clips.length === 0 ? (
          <p className="text-xs text-muted-foreground">No clips yet. Use In/Out to create clips.</p>
        ) : (
          selectedVideo.clips.map(clip => (
            <Card key={clip.id} className="hover:bg-muted/20 transition-colors">
              <CardContent className="py-2 px-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0 cursor-pointer" onClick={() => playClip(clip)}>
                    <Play className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="text-sm font-medium truncate">{clip.title}</span>
                    <span className="text-[10px] text-muted-foreground font-mono shrink-0">
                      {formatTime(clip.start_time)} - {formatTime(clip.end_time)}
                    </span>
                    <Badge variant="outline" className="text-[9px] shrink-0">H{clip.half}</Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setExpandedClip(expandedClip === clip.id ? null : clip.id)}>
                      {expandedClip === clip.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleDeleteClip(clip.id)}>
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </Button>
                  </div>
                </div>
                {expandedClip === clip.id && (
                  <div className="mt-2 space-y-1">
                    {clip.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {clip.tags.map(t => <Badge key={t} variant="secondary" className="text-[9px]">{t}</Badge>)}
                      </div>
                    )}
                    {clip.notes && <p className="text-xs text-muted-foreground">{clip.notes}</p>}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
