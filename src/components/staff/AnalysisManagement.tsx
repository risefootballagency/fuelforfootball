import { useState, useEffect, useCallback } from "react";
import * as tus from 'tus-js-client';
import { useNavigate } from "react-router-dom";
import { sharedSupabase as supabase } from "@/integrations/supabase/sharedClient";
import { supabase as localSupabase } from "@/integrations/supabase/client";
import { invokeEdgeFunction } from "@/lib/edgeFunctionHelper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { logActivity } from "@/lib/activityLogger";
import { Pencil, Trash2, Plus, X, Sparkles, Database, Copy, Settings, Eye, Users, FileEdit, EyeOff, ArrowLeftRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createAnalysisSlug } from "@/lib/urlHelpers";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalysisMatchDetails } from "./analysis/AnalysisMatchDetails";
import { AnalysisSchemeSection } from "./analysis/AnalysisSchemeSection";
import { AnalysisPointsSection } from "./analysis/AnalysisPointsSection";
import { AnalysisOverviewSection } from "./analysis/AnalysisOverviewSection";
import { AnalysisQuickLink } from "./analysis/AnalysisQuickLink";
import { ActionReportsList } from "./analysis/ActionReportsList";

type AnalysisType = "pre-match" | "post-match" | "concept";

interface Analysis {
  id: string;
  analysis_type: AnalysisType;
  title: string | null;
  home_team?: string | null;
  away_team?: string | null;
  home_team_bold?: boolean | null;
  away_team_bold?: boolean | null;
  match_date?: string | null;
  home_team_logo?: string | null;
  away_team_logo?: string | null;
  match_image_url?: string | null;
  home_team_bg_color?: string | null;
  away_team_bg_color?: string | null;
  home_score?: number | null;
  away_score?: number | null;
  key_details?: string | null;
  opposition_strengths?: string | null;
  opposition_weaknesses?: string | null;
  matchups?: any[];
  selected_scheme?: string | null;
  starting_xi?: any[];
  kit_primary_color?: string | null;
  kit_secondary_color?: string | null;
  kit_collar_color?: string | null;
  kit_number_color?: string | null;
  kit_stripe_style?: string | null;
  player_team?: string | null;
  scheme_title?: string | null;
  scheme_paragraph_1?: string | null;
  scheme_paragraph_2?: string | null;
  scheme_image_url?: string | null;
  player_image_url?: string | null;
  strengths_improvements?: string | null;
  concept?: string | null;
  explanation?: string | null;
  points?: any[];
  video_url?: string | null;
  visibility_status?: "draft" | "hidden" | "live" | null;
  estimated_ready_at?: string | null;
  created_at: string;
  player_name?: string | null;
}

interface Point {
  title: string;
  paragraph_1: string;
  paragraph_2: string;
  images: string[];
}

interface Matchup {
  name: string;
  shirt_number: string;
  image_url: string;
  notes?: string;
}

interface AIWriterState {
  open: boolean;
  category: 'pre-match' | 'post-match' | 'concept' | 'other';
  paragraph1Info: string;
  paragraph2Info: string;
  targetPointIndex?: number;
}

interface AnalysisManagementProps {
  isAdmin: boolean;
  currentUserId?: string;
  isAnalystOnly?: boolean;
  defaultPlayerId?: string;
}

const MAX_VIDEO_UPLOAD_BYTES = 50 * 1024 * 1024 * 1024;

const toDateTimeLocalValue = (iso?: string | null) => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (v: number) => String(v).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const fromDateTimeLocalValue = (value: string) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

export const AnalysisManagement = ({ isAdmin, currentUserId, isAnalystOnly = false, defaultPlayerId }: AnalysisManagementProps) => {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'list' | 'pre-match' | 'post-match' | 'concept'>('list');
  const [activeListTab, setActiveListTab] = useState<string>("pre-match");
  const [editingAnalysis, setEditingAnalysis] = useState<Analysis | null>(null);
  const [analysisType, setAnalysisType] = useState<AnalysisType>("pre-match");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiWriter, setAiWriter] = useState<AIWriterState>({
    open: false,
    category: 'pre-match',
    paragraph1Info: '',
    paragraph2Info: ''
  });
  const [overviewWriter, setOverviewWriter] = useState({
    open: false,
    category: 'pre-match' as 'pre-match' | 'post-match',
    overviewInfo: ''
  });
  const [schemeWriter, setSchemeWriter] = useState({
    open: false,
    schemeInfo: ''
  });
  const [generatedContent, setGeneratedContent] = useState<{
    open: boolean;
    type: 'point' | 'overview' | 'scheme';
    content: string;
    paragraph1?: string;
    paragraph2?: string;
    category: string;
  }>({
    open: false,
    type: 'point',
    content: '',
    category: 'pre-match'
  });
  const [tweakDialog, setTweakDialog] = useState({
    open: false,
    tweakInstructions: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [examplesDialogOpen, setExamplesDialogOpen] = useState(false);
  const [examplesCategory, setExamplesCategory] = useState<string>('pre-match');
  const [examplesType, setExamplesType] = useState<'point' | 'overview'>('point');
  const [examples, setExamples] = useState<any[]>([]);
  const [editingExample, setEditingExample] = useState<any | null>(null);
  const [exampleFormData, setExampleFormData] = useState({
    paragraph_1: '',
    content: ''
  });
  const [linkedPlayers, setLinkedPlayers] = useState<Record<string, any[]>>({});
  const [concepts, setConcepts] = useState<any[]>([]);
  const [taggedPlayerIds, setTaggedPlayerIds] = useState<string[]>([]);

  // Form states
  const [formData, setFormData] = useState<Record<string, any>>({
    points: [],
    matchups: [],
    starting_xi: [],
  });

  // Formation templates with position coordinates (x, y as percentages)
  const formationTemplates: Record<string, Array<{x: number, y: number, position: string}>> = {
    "4-3-3": [
      {x: 50, y: 90, position: "GK"},
      {x: 15, y: 70, position: "LB"}, {x: 35, y: 70, position: "CB"}, {x: 65, y: 70, position: "CB"}, {x: 85, y: 70, position: "RB"},
      {x: 30, y: 50, position: "CM"}, {x: 50, y: 50, position: "CM"}, {x: 70, y: 50, position: "CM"},
      {x: 15, y: 20, position: "LW"}, {x: 50, y: 20, position: "ST"}, {x: 85, y: 20, position: "RW"}
    ],
    "4-2-1-3": [
      {x: 50, y: 90, position: "GK"},
      {x: 15, y: 70, position: "LB"}, {x: 35, y: 70, position: "CB"}, {x: 65, y: 70, position: "CB"}, {x: 85, y: 70, position: "RB"},
      {x: 35, y: 55, position: "CDM"}, {x: 65, y: 55, position: "CDM"},
      {x: 50, y: 38, position: "CAM"},
      {x: 15, y: 18, position: "LW"}, {x: 50, y: 15, position: "ST"}, {x: 85, y: 18, position: "RW"}
    ],
    "4-2-4": [
      {x: 50, y: 90, position: "GK"},
      {x: 15, y: 70, position: "LB"}, {x: 35, y: 70, position: "CB"}, {x: 65, y: 70, position: "CB"}, {x: 85, y: 70, position: "RB"},
      {x: 35, y: 50, position: "CM"}, {x: 65, y: 50, position: "CM"},
      {x: 15, y: 20, position: "LW"}, {x: 40, y: 18, position: "ST"}, {x: 60, y: 18, position: "ST"}, {x: 85, y: 20, position: "RW"}
    ],
    "4-2-2": [
      {x: 50, y: 90, position: "GK"},
      {x: 15, y: 70, position: "LB"}, {x: 35, y: 70, position: "CB"}, {x: 65, y: 70, position: "CB"}, {x: 85, y: 70, position: "RB"},
      {x: 35, y: 50, position: "CM"}, {x: 65, y: 50, position: "CM"},
      {x: 15, y: 28, position: "LW"}, {x: 40, y: 20, position: "ST"}, {x: 60, y: 20, position: "ST"}, {x: 85, y: 28, position: "RW"}
    ],
    "4-3-1-2": [
      {x: 50, y: 90, position: "GK"},
      {x: 15, y: 70, position: "LB"}, {x: 35, y: 70, position: "CB"}, {x: 65, y: 70, position: "CB"}, {x: 85, y: 70, position: "RB"},
      {x: 30, y: 50, position: "CM"}, {x: 50, y: 55, position: "CDM"}, {x: 70, y: 50, position: "CM"},
      {x: 50, y: 32, position: "CAM"},
      {x: 35, y: 15, position: "ST"}, {x: 65, y: 15, position: "ST"}
    ],
    "3-4-3": [
      {x: 50, y: 90, position: "GK"},
      {x: 25, y: 70, position: "CB"}, {x: 50, y: 70, position: "CB"}, {x: 75, y: 70, position: "CB"},
      {x: 15, y: 50, position: "LM"}, {x: 40, y: 50, position: "CM"}, {x: 60, y: 50, position: "CM"}, {x: 85, y: 50, position: "RM"},
      {x: 20, y: 20, position: "LW"}, {x: 50, y: 18, position: "ST"}, {x: 80, y: 20, position: "RW"}
    ],
    "3-3-1-3": [
      {x: 50, y: 90, position: "GK"},
      {x: 25, y: 70, position: "CB"}, {x: 50, y: 70, position: "CB"}, {x: 75, y: 70, position: "CB"},
      {x: 30, y: 52, position: "CM"}, {x: 50, y: 55, position: "CDM"}, {x: 70, y: 52, position: "CM"},
      {x: 50, y: 35, position: "CAM"},
      {x: 20, y: 18, position: "LW"}, {x: 50, y: 15, position: "ST"}, {x: 80, y: 18, position: "RW"}
    ],
    "3-3-4": [
      {x: 50, y: 90, position: "GK"},
      {x: 25, y: 70, position: "CB"}, {x: 50, y: 70, position: "CB"}, {x: 75, y: 70, position: "CB"},
      {x: 30, y: 48, position: "CM"}, {x: 50, y: 50, position: "CM"}, {x: 70, y: 48, position: "CM"},
      {x: 15, y: 22, position: "LW"}, {x: 40, y: 18, position: "ST"}, {x: 60, y: 18, position: "ST"}, {x: 85, y: 22, position: "RW"}
    ],
    "3-3-2-2": [
      {x: 50, y: 90, position: "GK"},
      {x: 25, y: 70, position: "CB"}, {x: 50, y: 70, position: "CB"}, {x: 75, y: 70, position: "CB"},
      {x: 30, y: 50, position: "CM"}, {x: 50, y: 52, position: "CM"}, {x: 70, y: 50, position: "CM"},
      {x: 30, y: 30, position: "CAM"}, {x: 70, y: 30, position: "CAM"},
      {x: 35, y: 15, position: "ST"}, {x: 65, y: 15, position: "ST"}
    ],
    "3-4-1-2": [
      {x: 50, y: 90, position: "GK"},
      {x: 25, y: 70, position: "CB"}, {x: 50, y: 70, position: "CB"}, {x: 75, y: 70, position: "CB"},
      {x: 15, y: 50, position: "LM"}, {x: 40, y: 50, position: "CM"}, {x: 60, y: 50, position: "CM"}, {x: 85, y: 50, position: "RM"},
      {x: 50, y: 30, position: "CAM"},
      {x: 35, y: 15, position: "ST"}, {x: 65, y: 15, position: "ST"}
    ]
  };
  const [uploadingImage, setUploadingImage] = useState(false);
  const [players, setPlayers] = useState<any[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(defaultPlayerId || "none");
  const [performanceReports, setPerformanceReports] = useState<any[]>([]);
  const [selectedPerformanceReportId, setSelectedPerformanceReportId] = useState<string>("none");
  const [performanceReportClips, setPerformanceReportClips] = useState<any[]>([]);

  useEffect(() => {
    fetchAnalyses();
    fetchPlayers();
    fetchLinkedPlayers();
    fetchConcepts();
  }, []);

  useEffect(() => {
    if (selectedPlayerId && selectedPlayerId !== "none") {
      fetchPerformanceReports(selectedPlayerId);
    } else {
      setPerformanceReports([]);
      setSelectedPerformanceReportId("none");
      setPerformanceReportClips([]);
    }
  }, [selectedPlayerId]);

  useEffect(() => {
    if (defaultPlayerId) {
      setSelectedPlayerId(defaultPlayerId);
    }
  }, [defaultPlayerId]);

  // Auto-populate player_name from first tagged player
  useEffect(() => {
    if (taggedPlayerIds.length > 0 && players.length > 0) {
      const firstTagged = players.find(p => p.id === taggedPlayerIds[0]);
      if (firstTagged) {
        const upperName = firstTagged.name.toUpperCase();
        if (formData.player_name !== upperName) {
          setFormData((prev: any) => ({ ...prev, player_name: upperName }));
        }
      }
    }
  }, [taggedPlayerIds, players]);

  // Fetch clips when a performance report is selected
  useEffect(() => {
    if (selectedPerformanceReportId && selectedPerformanceReportId !== "none") {
      fetchPerformanceReportClips(selectedPerformanceReportId);
    } else {
      setPerformanceReportClips([]);
    }
  }, [selectedPerformanceReportId]);

  const fetchAnalyses = async () => {
    try {
      let query = supabase
        .from("analyses")
        .select("*")
        .order("created_at", { ascending: false });

      // Analysts only see analyses assigned to them
      if (isAnalystOnly && currentUserId) {
        query = query.eq("writer_user_id", currentUserId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setAnalyses((data as Analysis[]) || []);
    } catch (error: any) {
      if (!isAnalystOnly) {
        toast.error("Failed to fetch analyses");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlayers = async () => {
    try {
      const { data, error } = await supabase
        .from("players")
        .select("id, name, representation_status, club, club_logo")
        .order("name");

      if (error) throw error;
      setPlayers(data || []);
    } catch (error: any) {
      console.error("Failed to fetch players:", error);
    }
  };

  const fetchPerformanceReports = async (playerId: string) => {
    try {
      const { data, error } = await supabase
        .from("player_analysis")
        .select("*")
        .eq("player_id", playerId)
        .order("analysis_date", { ascending: false });

      if (error) throw error;
      setPerformanceReports(data || []);
    } catch (error: any) {
      console.error("Failed to fetch performance reports:", error);
    }
  };

  const fetchPerformanceReportClips = async (reportId: string) => {
    try {
      const { data, error } = await supabase
        .from("performance_report_actions")
        .select("id, video_url, action_type, action_number, minute, action_score")
        .eq("analysis_id", reportId)
        .not("video_url", "is", null)
        .order("action_number");

      if (error) throw error;
      setPerformanceReportClips(data || []);
    } catch (error: any) {
      console.error("Failed to fetch performance report clips:", error);
    }
  };

  const fetchLinkedPlayers = async () => {
    try {
      const { data, error } = await supabase
        .from("player_analysis")
        .select("analysis_writer_id, player_id, players(name)")
        .not("analysis_writer_id", "is", null);

      if (error) throw error;
      
      const grouped: Record<string, any[]> = {};
      (data || []).forEach((item: any) => {
        const analysisId = item.analysis_writer_id;
        if (!grouped[analysisId]) {
          grouped[analysisId] = [];
        }
        grouped[analysisId].push({
          playerId: item.player_id,
          playerName: item.players?.name || 'Unknown Player'
        });
      });

      // Also fetch manually tagged players
      const { data: tagData } = await supabase
        .from("analysis_player_tags")
        .select("analysis_id, player_id");

      if (tagData && tagData.length > 0) {
        const tagPlayerIds = [...new Set(tagData.map(t => t.player_id))];
        const { data: tagPlayers } = await supabase
          .from("players")
          .select("id, name")
          .in("id", tagPlayerIds);
        const playerNameMap: Record<string, string> = {};
        (tagPlayers || []).forEach(p => { playerNameMap[p.id] = p.name; });

        tagData.forEach((item: any) => {
          const analysisId = item.analysis_id;
          if (!grouped[analysisId]) {
            grouped[analysisId] = [];
          }
          const exists = grouped[analysisId].some(p => p.playerId === item.player_id);
          if (!exists) {
            grouped[analysisId].push({
              playerId: item.player_id,
              playerName: playerNameMap[item.player_id] || 'Unknown Player'
            });
          }
        });
      }

      setLinkedPlayers(grouped);
    } catch (error: any) {
      console.error("Failed to fetch linked players:", error);
    }
  };

  const fetchConcepts = async () => {
    try {
      const { data, error } = await supabase
        .from("coaching_analysis")
        .select("*")
        .eq("analysis_type", "concept")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setConcepts(data || []);
    } catch (error: any) {
      console.error("Failed to fetch concepts:", error);
    }
  };

  const handleOpenDialog = async (type: AnalysisType, analysis?: Analysis) => {
    setAnalysisType(type);
    setActiveView(type);
    
    if (analysis) {
      setEditingAnalysis(analysis);
      // Assign stable _id to any points that don't have one
      const pointsWithIds = (analysis.points || []).map((p: any) => ({
        ...p,
        _id: p._id || crypto.randomUUID(),
      }));
      setFormData({ ...analysis, points: pointsWithIds });
      
      try {
        const { data } = await supabase
          .from("player_analysis")
          .select("player_id, id")
          .eq("analysis_writer_id", analysis.id)
          .maybeSingle();
        
        if (data) {
          setSelectedPlayerId(data.player_id);
          setSelectedPerformanceReportId(data.id);
        }

        // Load tagged players
        const { data: tags } = await supabase
          .from("analysis_player_tags")
          .select("player_id")
          .eq("analysis_id", analysis.id);
        setTaggedPlayerIds((tags || []).map(t => t.player_id));
      } catch (error) {
        console.error("Error loading analysis details:", error);
      }
    } else {
      setEditingAnalysis(null);
      setFormData({
        analysis_type: type,
        points: [],
        matchups: [],
        starting_xi: [],
        visibility_status: "live",
        estimated_ready_at: null,
      });
      setSelectedPlayerId(defaultPlayerId || "none");
      setSelectedPerformanceReportId("none");
      setTaggedPlayerIds(defaultPlayerId ? [defaultPlayerId] : []);
    }
  };

  const handleCloseDialog = () => {
    setActiveView('list');
    setEditingAnalysis(null);
    setFormData({ points: [], matchups: [], starting_xi: [] });
    setSelectedPlayerId(defaultPlayerId || "none");
    setSelectedPerformanceReportId("none");
    setTaggedPlayerIds(defaultPlayerId ? [defaultPlayerId] : []);
  };

  const handleSchemeChange = (scheme: string) => {
    const template = formationTemplates[scheme];
    const existingXI = formData.starting_xi || [];
    
    const startingXI = template.map((pos, idx) => ({
      ...pos,
      surname: existingXI[idx]?.surname || "",
      number: existingXI[idx]?.number || "",
      id: idx
    }));
    setFormData({ ...formData, selected_scheme: scheme, starting_xi: startingXI });
  };

  const updateStartingXIPlayer = (index: number, field: 'surname' | 'number', value: string) => {
    const updatedXI = [...(formData.starting_xi || [])];
    updatedXI[index] = { ...updatedXI[index], [field]: value };
    setFormData({ ...formData, starting_xi: updatedXI });
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string,
    pointIndex?: number,
    isMultiple?: boolean,
    matchupIndex?: number
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `analysis-files/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("analysis-files")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("analysis-files").getPublicUrl(filePath);

      if (matchupIndex !== undefined) {
        const updatedMatchups = [...(formData.matchups || [])];
        updatedMatchups[matchupIndex].image_url = publicUrl;
        setFormData({ ...formData, matchups: updatedMatchups });
      } else if (pointIndex !== undefined && isMultiple) {
        const updatedPoints = [...(formData.points || [])];
        updatedPoints[pointIndex].images.push(publicUrl);
        setFormData({ ...formData, points: updatedPoints });
      } else {
        setFormData({ ...formData, [field]: publicUrl });
      }

      toast.success("Image uploaded successfully");
    } catch (error: any) {
      toast.error("Failed to upload image");
      console.error(error);
    } finally {
      setUploadingImage(false);
    }
  };

  // TUS resumable video upload
  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_VIDEO_UPLOAD_BYTES) {
      toast.error("This file exceeds the 50GB upload limit");
      return;
    }

    setUploadingImage(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data: session } = await supabase.auth.getSession();
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const token = session.session?.access_token;

      if (!token) {
        // Fallback to basic upload if no auth
        const { error: uploadError } = await supabase.storage
          .from("analysis-videos")
          .upload(filePath, file);
        if (uploadError) throw uploadError;
      } else {
        await new Promise<void>((resolve, reject) => {
          const upload = new tus.Upload(file, {
            endpoint: `https://${projectId}.storage.supabase.co/storage/v1/upload/resumable`,
            retryDelays: [0, 3000, 5000, 10000, 20000],
            headers: {
              apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
              authorization: `Bearer ${token}`,
              'x-upsert': 'false'
            },
            uploadDataDuringCreation: false,
            removeFingerprintOnSuccess: true,
            metadata: { bucketName: 'analysis-videos', objectName: filePath, contentType: file.type || 'video/mp4' },
            chunkSize: 6 * 1024 * 1024,
            onError: (error) => reject(new Error(error.message)),
            onSuccess: () => resolve(),
          });
          upload.start();
        });
      }

      const { data: { publicUrl } } = supabase.storage.from("analysis-videos").getPublicUrl(filePath);
      setFormData({ ...formData, video_url: publicUrl });
      toast.success("Video uploaded successfully");
    } catch (error: any) {
      toast.error("Failed to upload video");
      console.error(error);
    } finally {
      setUploadingImage(false);
    }
  };

  // TUS resumable video upload for points - supports multi-video (video_urls array)
  const handleVideoUploadForPoint = async (event: React.ChangeEvent<HTMLInputElement>, pointIndex: number) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_VIDEO_UPLOAD_BYTES) {
      toast.error("This file exceeds the 50GB upload limit");
      return;
    }

    setUploadingImage(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data: session } = await supabase.auth.getSession();
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const token = session.session?.access_token;

      if (!token) {
        const { error: uploadError } = await supabase.storage
          .from("analysis-videos")
          .upload(filePath, file);
        if (uploadError) throw uploadError;
      } else {
        await new Promise<void>((resolve, reject) => {
          const upload = new tus.Upload(file, {
            endpoint: `https://${projectId}.storage.supabase.co/storage/v1/upload/resumable`,
            retryDelays: [0, 3000, 5000, 10000, 20000],
            headers: {
              apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
              authorization: `Bearer ${token}`,
              'x-upsert': 'false'
            },
            uploadDataDuringCreation: false,
            removeFingerprintOnSuccess: true,
            metadata: { bucketName: 'analysis-videos', objectName: filePath, contentType: file.type || 'video/mp4' },
            chunkSize: 6 * 1024 * 1024,
            onError: (error) => reject(new Error(error.message)),
            onSuccess: () => resolve(),
          });
          upload.start();
        });
      }

      const { data: { publicUrl } } = supabase.storage.from("analysis-videos").getPublicUrl(filePath);
      const updatedPoints = [...(formData.points || [])];
      const currentVideos = updatedPoints[pointIndex].video_urls || (updatedPoints[pointIndex].video_url ? [updatedPoints[pointIndex].video_url] : []);
      updatedPoints[pointIndex] = { ...updatedPoints[pointIndex], video_urls: [...currentVideos, publicUrl], video_url: undefined };
      setFormData({ ...formData, points: updatedPoints });
      toast.success("Video uploaded successfully");
    } catch (error: any) {
      toast.error("Failed to upload video");
      console.error(error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    try {
      // Only include columns that exist in the database schema
      const validColumns = [
        'title', 'home_team', 'away_team', 'key_details', 'opposition_strengths',
        'opposition_weaknesses', 'matchups', 'scheme_title', 'scheme_paragraph_1',
        'scheme_paragraph_2', 'scheme_image_url', 'player_image_url', 'strengths_improvements',
        'concept', 'explanation', 'points', 'home_score', 'away_score', 'fixture_id',
        'match_date', 'home_team_logo', 'away_team_logo', 'selected_scheme', 'starting_xi',
        'kit_primary_color', 'kit_secondary_color', 'kit_number_color', 'kit_collar_color',
        'kit_stripe_style', 'match_image_url', 'home_team_bg_color',
        'away_team_bg_color', 'video_url', 'player_name', 'player_team',
        'visibility_status', 'estimated_ready_at', 'home_team_bold', 'away_team_bold',
        'linked_video_analysis_ids', 'translated_content'
      ];

      const dataToSave: Record<string, any> = {
        analysis_type: analysisType,
        ...(currentUserId && isAnalystOnly ? { writer_user_id: currentUserId } : {}),
      };

      // Only copy valid columns from formData
      validColumns.forEach(col => {
        if (formData[col] !== undefined) {
          dataToSave[col] = formData[col];
        }
      });

      if (dataToSave.visibility_status === "live") {
        dataToSave.estimated_ready_at = null;
      }

      let analysisId = editingAnalysis?.id;

      if (editingAnalysis) {
        const { error } = await supabase
          .from("analyses")
          .update(dataToSave)
          .eq("id", editingAnalysis.id);

        if (error) throw error;
        toast.success("Analysis updated successfully");
      } else {
        const { data, error } = await supabase
          .from("analyses")
          .insert([dataToSave as any])
          .select()
          .single();

        if (error) throw error;
        analysisId = data.id;
        toast.success("Analysis created successfully");
      }

      if (selectedPerformanceReportId && selectedPerformanceReportId !== "none" && analysisId) {
        const { error: linkError } = await supabase
          .from("player_analysis")
          .update({ analysis_writer_id: analysisId })
          .eq("id", selectedPerformanceReportId);

        if (linkError) {
          console.error("Failed to link analysis:", linkError);
          toast.error("Analysis saved but failed to link to performance report");
        }
      }

      // Save tagged players
      if (analysisId) {
        await supabase
          .from("analysis_player_tags")
          .delete()
          .eq("analysis_id", analysisId);

        if (taggedPlayerIds.length > 0) {
          const tagsToInsert = taggedPlayerIds.map(playerId => ({
            player_id: playerId,
            analysis_id: analysisId,
          }));
          const { error: tagError } = await supabase
            .from("analysis_player_tags")
            .insert(tagsToInsert);
          if (tagError) {
            console.error("Failed to save player tags:", tagError);
          }
        }
      }

      if (!editingAnalysis) {
        const { data: newAnalysis } = await supabase
          .from("analyses")
          .select("*")
          .eq("id", analysisId)
          .single();
        if (newAnalysis) {
          setEditingAnalysis(newAnalysis as Analysis);
        }
      }
      fetchAnalyses();
      fetchLinkedPlayers();
    } catch (error: any) {
      toast.error("Failed to save analysis");
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this analysis?")) return;

    try {
      const { error } = await supabase.from("analyses").delete().eq("id", id);

      if (error) throw error;
      toast.success("Analysis deleted successfully");
      logActivity({ action: 'deleted', entityType: 'analysis', entityId: id });
      fetchAnalyses();
    } catch (error: any) {
      toast.error("Failed to delete analysis");
      console.error(error);
    }
  };

  const handleDeleteConcept = async (id: string) => {
    if (!confirm("Are you sure you want to delete this concept?")) return;

    try {
      const { error } = await supabase.from("coaching_analysis").delete().eq("id", id);

      if (error) throw error;
      toast.success("Concept deleted successfully");
      fetchConcepts();
    } catch (error: any) {
      toast.error("Failed to delete concept");
      console.error(error);
    }
  };

  const addPoint = () => {
    setFormData({
      ...formData,
      points: [
        ...(formData.points || []),
        { _id: crypto.randomUUID(), title: "", paragraph_1: "", paragraph_2: "", images: [] },
      ],
    });
  };

  const removePoint = (index: number) => {
    const updatedPoints = [...(formData.points || [])];
    updatedPoints.splice(index, 1);
    setFormData({ ...formData, points: updatedPoints });
  };

  const updatePoint = (index: number, field: keyof Point, value: any) => {
    const updatedPoints = [...(formData.points || [])];
    updatedPoints[index][field] = value;
    setFormData({ ...formData, points: updatedPoints });
  };

  const addMatchup = () => {
    setFormData({
      ...formData,
      matchups: [
        ...(formData.matchups || []),
        { name: "", shirt_number: "", image_url: "" },
      ],
    });
  };

  const removeMatchup = (index: number) => {
    const updatedMatchups = [...(formData.matchups || [])];
    updatedMatchups.splice(index, 1);
    setFormData({ ...formData, matchups: updatedMatchups });
  };

  const updateMatchup = (index: number, field: keyof Matchup, value: string) => {
    const updatedMatchups = [...(formData.matchups || [])];
    updatedMatchups[index][field] = value;
    setFormData({ ...formData, matchups: updatedMatchups });
  };

  const removeImageFromPoint = (pointIndex: number, imageIndex: number) => {
    const updatedPoints = [...(formData.points || [])];
    updatedPoints[pointIndex].images.splice(imageIndex, 1);
    setFormData({ ...formData, points: updatedPoints });
  };

  const fetchExamples = async (category: string, type: 'point' | 'overview' = 'point') => {
    try {
      const [sharedResult, localResult] = await Promise.all([
        supabase
          .from('analysis_point_examples')
          .select('*')
          .eq('category', category)
          .eq('example_type', type)
          .order('created_at', { ascending: false }),
        localSupabase
          .from('analysis_point_examples')
          .select('*')
          .eq('category', category)
          .eq('example_type', type)
          .order('created_at', { ascending: false })
      ]);

      const sharedData = sharedResult.data || [];
      const localData = localResult.data || [];
      const seenIds = new Set(sharedData.map(e => e.id));
      const mergedData = [...sharedData, ...localData.filter(e => !seenIds.has(e.id))];
      
      mergedData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      setExamples(mergedData);
    } catch (error: any) {
      console.error('Error fetching examples:', error);
      toast.error('Failed to load examples');
    }
  };

  const handleSaveExample = async () => {
    try {
      if (editingExample) {
        const dataToUpdate = examplesType === 'overview' 
          ? { content: exampleFormData.content, category: examplesCategory, example_type: examplesType }
          : { paragraph_1: exampleFormData.paragraph_1, category: examplesCategory, example_type: examplesType };
        
        let { error } = await supabase
          .from('analysis_point_examples')
          .update(dataToUpdate)
          .eq('id', editingExample.id);

        if (error?.code === '23514') {
          const localResult = await localSupabase
            .from('analysis_point_examples')
            .update(dataToUpdate)
            .eq('id', editingExample.id);
          error = localResult.error;
        }

        if (error) throw error;
        toast.success('Example updated');
      } else {
        const dataToInsert = examplesType === 'overview'
          ? { content: exampleFormData.content, category: examplesCategory, example_type: examplesType }
          : { paragraph_1: exampleFormData.paragraph_1, category: examplesCategory, example_type: examplesType };
        
        let { error } = await supabase
          .from('analysis_point_examples')
          .insert(dataToInsert);

        if (error?.code === '23514') {
          const localResult = await localSupabase
            .from('analysis_point_examples')
            .insert(dataToInsert);
          error = localResult.error;
        }

        if (error) throw error;
        toast.success('Example added');
      }

      setExampleFormData({ paragraph_1: '', content: '' });
      setEditingExample(null);
      fetchExamples(examplesCategory, examplesType);
    } catch (error: any) {
      console.error('Error saving example:', error);
      toast.error('Failed to save example');
    }
  };

  const handleDeleteExample = async (id: string) => {
    if (!confirm('Delete this example?')) return;

    try {
      let { error } = await supabase
        .from('analysis_point_examples')
        .delete()
        .eq('id', id);

      if (error) {
        const localResult = await localSupabase
          .from('analysis_point_examples')
          .delete()
          .eq('id', id);
        error = localResult.error;
      }

      if (error) throw error;
      toast.success('Example deleted');
      fetchExamples(examplesCategory, examplesType);
    } catch (error: any) {
      console.error('Error deleting example:', error);
      toast.error('Failed to delete example');
    }
  };

  // AI Restyle mode - requires existing content
  const generateWithAI = async (field: string, pointIndex?: number) => {
    setAiGenerating(true);
    try {
      let prompt = '';
      let context = '';
      let type = '';

      if (field === 'scheme_paragraph_1') {
        const schemeCategory = 'scheme-p1';
        const { data: styleExamples } = await supabase
          .from('analysis_point_examples')
          .select('paragraph_1')
          .eq('category', schemeCategory)
          .eq('example_type', 'point')
          .limit(3);

        const existingContent = formData.scheme_paragraph_1 || '';
        const styleExamplesText = styleExamples && styleExamples.length > 0
          ? styleExamples.map((ex, i) => `Style Example ${i + 1}: ${ex.paragraph_1 || ''}`).join('\n\n')
          : '';

        if (!existingContent.trim()) {
          toast.error('Please write some content first - AI will restyle it, not create new content');
          setAiGenerating(false);
          return;
        }

        context = `STYLE EXAMPLES (copy the tone, vocabulary, and sentence structure from these):\n${styleExamplesText}\n\n---`;
        prompt = `SOURCE CONTENT TO RESTYLE (keep ALL these points/facts, just improve the writing style):\n${existingContent}\n\nRewrite the source content using the writing style from the examples. Keep ALL the same tactical points and observations - only change HOW it's written, not WHAT it says.`;
        type = 'analysis-paragraph';
      } else if (field === 'scheme_paragraph_2') {
        const schemeCategory = 'scheme-p2';
        const { data: styleExamples } = await supabase
          .from('analysis_point_examples')
          .select('paragraph_1')
          .eq('category', schemeCategory)
          .eq('example_type', 'point')
          .limit(3);

        const existingContent = formData.scheme_paragraph_2 || '';
        const styleExamplesText = styleExamples && styleExamples.length > 0
          ? styleExamples.map((ex, i) => `Style Example ${i + 1}: ${ex.paragraph_1 || ''}`).join('\n\n')
          : '';

        if (!existingContent.trim()) {
          toast.error('Please write some content first - AI will restyle it, not create new content');
          setAiGenerating(false);
          return;
        }

        context = `STYLE EXAMPLES (copy the tone, vocabulary, and sentence structure from these):\n${styleExamplesText}\n\n---`;
        prompt = `SOURCE CONTENT TO RESTYLE (keep ALL these points/facts, just improve the writing style):\n${existingContent}\n\nRewrite the source content using the writing style from the examples. Keep ALL the same tactical points and observations - only change HOW it's written, not WHAT it says.`;
        type = 'analysis-paragraph';
      } else if (field === 'point_title') {
        prompt = `Create a concise, professional title for a match analysis section.`;
        type = 'analysis-point-title';
      } else if (field === 'point_paragraph_1') {
        const point = formData.points?.[pointIndex!];
        const paragraphCategory = `${analysisType}-p1`;
        
        const { data: styleExamples } = await supabase
          .from('analysis_point_examples')
          .select('paragraph_1')
          .eq('category', paragraphCategory)
          .eq('example_type', 'point')
          .limit(3);

        const existingContent = point?.paragraph_1 || '';
        const styleExamplesText = styleExamples && styleExamples.length > 0
          ? styleExamples.map((ex, i) => `Style Example ${i + 1}: ${ex.paragraph_1 || ''}`).join('\n\n')
          : '';

        if (!existingContent.trim()) {
          toast.error('Please write some content first - AI will restyle it, not create new content');
          setAiGenerating(false);
          return;
        }

        context = `Section Title: ${point?.title || 'Not specified'}\n\nSTYLE EXAMPLES (copy the tone, vocabulary, and sentence structure from these):\n${styleExamplesText}\n\n---`;
        prompt = `SOURCE CONTENT TO RESTYLE (keep ALL these points/facts, just improve the writing style):\n${existingContent}\n\nRewrite the source content using the writing style from the examples. Keep ALL the same tactical points and observations - only change HOW it's written, not WHAT it says.`;
        type = 'analysis-paragraph';
      } else if (field === 'point_paragraph_2') {
        const point = formData.points?.[pointIndex!];
        const paragraphCategory = `${analysisType}-p2`;
        
        const { data: styleExamples } = await supabase
          .from('analysis_point_examples')
          .select('paragraph_1')
          .eq('category', paragraphCategory)
          .eq('example_type', 'point')
          .limit(3);

        const existingContent = point?.paragraph_2 || '';
        const styleExamplesText = styleExamples && styleExamples.length > 0
          ? styleExamples.map((ex, i) => `Style Example ${i + 1}: ${ex.paragraph_1 || ''}`).join('\n\n')
          : '';

        if (!existingContent.trim()) {
          toast.error('Please write some content first - AI will restyle it, not create new content');
          setAiGenerating(false);
          return;
        }

        context = `Section Title: ${point?.title || 'Not specified'}\nFirst Paragraph for context: ${point?.paragraph_1 || ''}\n\nSTYLE EXAMPLES (copy the tone, vocabulary, and sentence structure from these):\n${styleExamplesText}\n\n---`;
        prompt = `SOURCE CONTENT TO RESTYLE (keep ALL these points/facts, just improve the writing style):\n${existingContent}\n\nRewrite the source content using the writing style from the examples. Keep ALL the same tactical points and observations - only change HOW it's written, not WHAT it says.`;
        type = 'analysis-paragraph';
      }

      const { data, error } = await invokeEdgeFunction('ai-write', {
        body: { prompt, context, type }
      });

      if (error) throw error;
      
      if (data.error) {
        if (data.error.includes('Rate limit')) {
          toast.error('AI rate limit reached. Please wait a moment and try again.');
        } else if (data.error.includes('credits')) {
          toast.error('AI credits exhausted. Please add credits in Settings > Workspace > Usage.');
        } else {
          throw new Error(data.error);
        }
        return;
      }

      if (field === 'scheme_paragraph_1') {
        setFormData({ ...formData, scheme_paragraph_1: data.text });
      } else if (field === 'scheme_paragraph_2') {
        setFormData({ ...formData, scheme_paragraph_2: data.text });
      } else if (field === 'point_title' && pointIndex !== undefined) {
        updatePoint(pointIndex, 'title', data.text);
      } else if (field === 'point_paragraph_1' && pointIndex !== undefined) {
        updatePoint(pointIndex, 'paragraph_1', data.text);
      } else if (field === 'point_paragraph_2' && pointIndex !== undefined) {
        updatePoint(pointIndex, 'paragraph_2', data.text);
      }

      toast.success('AI content generated!');
    } catch (error: any) {
      console.error('AI generation error:', error);
      toast.error('Failed to generate content with AI');
    } finally {
      setAiGenerating(false);
    }
  };

  // Generate overview from points content using AI restyle
  const generateOverviewFromPoints = async () => {
    const points = formData.points || [];
    const existingKeyDetails = formData.key_details || '';
    
    if (points.length === 0 && !existingKeyDetails.trim()) {
      toast.error("Please add some points or write key details before using AI");
      return;
    }

    setAiGenerating(true);
    try {
      let sourceContent = '';
      
      if (existingKeyDetails.trim()) {
        sourceContent += `EXISTING KEY DETAILS TO RESTYLE:\n${existingKeyDetails}\n\n`;
      }
      
      if (points.length > 0) {
        const pointsContent = points
          .map((p: any, i: number) => `Point ${i + 1}: ${p.title || 'Untitled'}\n${p.paragraph_1 || ''}\n${p.paragraph_2 || ''}`)
          .join('\n\n');
        sourceContent += `TACTICAL POINTS TO INCLUDE:\n${pointsContent}`;
      }

      const { data: styleExamples } = await supabase
        .from('analysis_point_examples')
        .select('content')
        .eq('category', analysisType)
        .eq('example_type', 'overview')
        .limit(3);

      const styleExamplesText = styleExamples && styleExamples.length > 0
        ? styleExamples.map((ex, i) => `Style Example ${i + 1}:\n${ex.content || ''}`).join('\n\n')
        : '';

      if (!styleExamplesText) {
        toast.warning("No overview examples found. Add examples via the settings icon for better results.");
      }

      const { data, error } = await invokeEdgeFunction('ai-write', {
        body: {
          prompt: `SOURCE CONTENT (preserve ALL tactical observations and facts from this - do NOT add new analysis):\n${sourceContent}\n\nRewrite this as a single cohesive overview paragraph. Keep ALL the facts and observations but apply the writing style from the examples.`,
          context: `Analysis Type: ${analysisType}\n\nSTYLE EXAMPLES (copy the EXACT tone, vocabulary, phrasing patterns, and sentence structure from these):\n${styleExamplesText || 'No examples provided - write in a professional football analysis style.'}`,
          type: 'analysis-overview'
        }
      });

      if (error) throw error;

      if (data.error) {
        if (data.error.includes('Rate limit')) {
          toast.error('AI rate limit reached. Please wait a moment and try again.');
        } else if (data.error.includes('credits')) {
          toast.error('AI credits exhausted.');
        } else {
          throw new Error(data.error);
        }
        return;
      }

      setFormData({ ...formData, key_details: data.text });
      toast.success('Overview generated!');
    } catch (error: any) {
      console.error('Error generating overview:', error);
      toast.error(error.message || "Failed to generate overview");
    } finally {
      setAiGenerating(false);
    }
  };

  const handleOpenOverviewSettings = (category: string) => {
    setExamplesCategory(category);
    setExamplesType('overview');
    setExamplesDialogOpen(true);
    fetchExamples(category, 'overview');
  };

  const generateOverview = async () => {
    if (!overviewWriter.overviewInfo.trim()) {
      toast.error("Please provide information for the overview");
      return;
    }

    setAiGenerating(true);
    try {
      const { data: styleExamples } = await supabase
        .from('analysis_point_examples')
        .select('content')
        .eq('category', overviewWriter.category)
        .eq('example_type', 'overview')
        .limit(3);

      const exampleContext = styleExamples && styleExamples.length > 0
        ? `\n\nExample overview writing style references:\n${styleExamples.map((ex, i) => 
            `Example ${i + 1}:\n${ex.content || ''}`
          ).join('\n\n')}`
        : '';

      const { data, error } = await invokeEdgeFunction('ai-write', {
        body: {
          prompt: `Write a comprehensive overview paragraph for a ${overviewWriter.category} analysis based on this information: ${overviewWriter.overviewInfo}. Match the writing style, vocabulary level, and level of detail shown in the examples. This should be one cohesive paragraph.`,
          context: `Analysis Type: ${overviewWriter.category}${exampleContext}`,
          type: 'analysis-overview'
        }
      });

      if (error) throw error;

      setGeneratedContent({
        open: true,
        type: 'overview',
        content: data.text,
        category: overviewWriter.category
      });
      setOverviewWriter({ open: false, category: 'pre-match', overviewInfo: '' });
    } catch (error: any) {
      console.error('Error generating overview:', error);
      toast.error(error.message || "Failed to generate overview");
    } finally {
      setAiGenerating(false);
    }
  };

  const generateScheme = async () => {
    if (!schemeWriter.schemeInfo.trim()) {
      toast.error("Please provide information for the scheme");
      return;
    }

    setAiGenerating(true);
    try {
      const { data: p1Examples } = await supabase
        .from('analysis_point_examples')
        .select('paragraph_1')
        .eq('category', 'scheme-p1')
        .eq('example_type', 'point')
        .limit(3);

      const { data: p2Examples } = await supabase
        .from('analysis_point_examples')
        .select('paragraph_1')
        .eq('category', 'scheme-p2')
        .eq('example_type', 'point')
        .limit(3);

      const p1Context = p1Examples && p1Examples.length > 0
        ? `\n\nExample writing style for FIRST paragraph:\n${p1Examples.map((ex, i) => 
            `Example ${i + 1}: ${ex.paragraph_1 || ''}`
          ).join('\n\n')}`
        : '';

      const p2Context = p2Examples && p2Examples.length > 0
        ? `\n\nExample writing style for SECOND paragraph:\n${p2Examples.map((ex, i) => 
            `Example ${i + 1}: ${ex.paragraph_1 || ''}`
          ).join('\n\n')}`
        : '';

      const { data, error } = await invokeEdgeFunction('ai-write', {
        body: {
          prompt: `Write two tactical scheme paragraphs based on this information: ${schemeWriter.schemeInfo}. Return exactly two paragraphs separated by a blank line.${p1Context}${p2Context}`,
          context: `Scheme analysis for football match`,
          type: 'analysis-scheme'
        }
      });

      if (error) throw error;

      const text = data.text;
      const [p1, p2] = text.split('\n\n').filter((p: string) => p.trim());

      setGeneratedContent({
        open: true,
        type: 'scheme',
        content: text,
        paragraph1: p1 || '',
        paragraph2: p2 || '',
        category: 'scheme'
      });
      setSchemeWriter({ open: false, schemeInfo: '' });
    } catch (error: any) {
      console.error('Error generating scheme:', error);
      toast.error(error.message || "Failed to generate scheme");
    } finally {
      setAiGenerating(false);
    }
  };

  const generateWithAIWriter = async () => {
    if (!aiWriter.paragraph1Info.trim() && !aiWriter.paragraph2Info.trim()) {
      toast.error("Please provide information for at least one paragraph");
      return;
    }

    setAiGenerating(true);
    try {
      const { data: styleExamples } = await supabase
        .from('analysis_point_examples')
        .select('paragraph_1, paragraph_2')
        .eq('category', aiWriter.category)
        .limit(3);

      const exampleContext = styleExamples && styleExamples.length > 0
        ? `\n\nExample writing style references:\n${styleExamples.map((ex, i) => 
            `Example ${i + 1}:\n${ex.paragraph_1 || ''}\n${ex.paragraph_2 || ''}`
          ).join('\n\n')}`
        : '';

      let paragraph1 = '';
      let paragraph2 = '';

      if (aiWriter.paragraph1Info.trim()) {
        const { data: data1, error: error1 } = await invokeEdgeFunction('ai-write', {
          body: {
            prompt: `Write a professional analysis paragraph based on this information: ${aiWriter.paragraph1Info}. Match the writing style, vocabulary level, and level of detail shown in the examples.`,
            context: `Analysis Type: ${aiWriter.category}${exampleContext}`,
            type: 'analysis-paragraph'
          }
        });

        if (error1) throw error1;
        paragraph1 = data1.text;
      }

      if (aiWriter.paragraph2Info.trim()) {
        const { data: data2, error: error2 } = await supabase.functions.invoke('ai-write', {
          body: {
            prompt: `Write a professional analysis paragraph based on this information: ${aiWriter.paragraph2Info}. Match the writing style, vocabulary level, and level of detail shown in the examples.`,
            context: `Analysis Type: ${aiWriter.category}${exampleContext}`,
            type: 'analysis-paragraph'
          }
        });

        if (error2) throw error2;
        paragraph2 = data2.text;
      }

      setGeneratedContent({
        open: true,
        type: 'point',
        content: `${paragraph1}\n\n${paragraph2}`,
        paragraph1,
        paragraph2,
        category: aiWriter.category
      });
      setAiWriter({ open: false, category: 'pre-match', paragraph1Info: '', paragraph2Info: '' });
    } catch (error: any) {
      console.error('Error generating with AI:', error);
      toast.error(error.message || "Failed to generate content");
    } finally {
      setAiGenerating(false);
    }
  };

  const handleApplyGenerated = () => {
    if (generatedContent.type === 'overview') {
      setFormData({ ...formData, key_details: generatedContent.content });
    } else if (generatedContent.type === 'scheme') {
      setFormData({ 
        ...formData, 
        scheme_paragraph_1: generatedContent.paragraph1 || '',
        scheme_paragraph_2: generatedContent.paragraph2 || ''
      });
    } else if (generatedContent.type === 'point') {
      const newPoint = {
        _id: crypto.randomUUID(),
        title: "",
        paragraph_1: generatedContent.paragraph1 || '',
        paragraph_2: generatedContent.paragraph2 || '',
        images: []
      };
      setFormData({
        ...formData,
        points: [...(formData.points || []), newPoint]
      });
    }
    toast.success("Content applied!");
    setGeneratedContent({ open: false, type: 'point', content: '', category: 'pre-match' });
    setEditMode(false);
  };

  const handleCopyGenerated = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent.content);
      toast.success("Copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  const handleSaveToDatabase = async () => {
    try {
      const dataToSave: any = {
        category: generatedContent.category,
        example_type: generatedContent.type === 'overview' ? 'overview' : 'point'
      };

      if (generatedContent.type === 'overview') {
        dataToSave.content = generatedContent.content;
        dataToSave.title = `Generated ${new Date().toLocaleDateString()}`;
      } else {
        dataToSave.paragraph_1 = generatedContent.paragraph1 || '';
        dataToSave.paragraph_2 = generatedContent.paragraph2 || '';
        dataToSave.title = `Generated ${new Date().toLocaleDateString()}`;
      }

      const { error } = await supabase
        .from('analysis_point_examples')
        .insert(dataToSave);

      if (error) throw error;
      toast.success("Saved to examples database!");
    } catch (error) {
      console.error('Error saving to database:', error);
      toast.error("Failed to save to database");
    }
  };

  const handleTweak = async () => {
    if (!tweakDialog.tweakInstructions.trim()) return;

    setAiGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-write', {
        body: {
          prompt: `Adjust the following content according to these instructions: "${tweakDialog.tweakInstructions}"\n\nOriginal content:\n${generatedContent.content}`,
          context: `Category: ${generatedContent.category}`,
          type: 'tweak'
        }
      });

      if (error) throw error;

      const tweakedText = data.text;
      
      if (generatedContent.type === 'overview') {
        setGeneratedContent({
          ...generatedContent,
          content: tweakedText
        });
      } else {
        const [p1, p2] = tweakedText.split('\n\n').filter((p: string) => p.trim());
        setGeneratedContent({
          ...generatedContent,
          content: tweakedText,
          paragraph1: p1 || '',
          paragraph2: p2 || tweakedText
        });
      }

      toast.success("Content tweaked!");
      setTweakDialog({ open: false, tweakInstructions: '' });
    } catch (error) {
      console.error('Error tweaking content:', error);
      toast.error("Failed to tweak content");
    } finally {
      setAiGenerating(false);
    }
  };

  if (loading) {
    return <div>Loading analyses...</div>;
  }

  const renderAnalysisList = (type: AnalysisType) => {
    const filtered = analyses.filter(a => {
      if (a.analysis_type !== type) return false;
      if (defaultPlayerId) {
        const linked = linkedPlayers[a.id];
        return linked && linked.some(p => p.playerId === defaultPlayerId);
      }
      return true;
    });
    return filtered.map((analysis) => (
      <Card key={analysis.id} className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm sm:text-base truncate">
                {analysis.title || `${analysis.home_team} vs ${analysis.away_team}`}
              </h3>
              {analysis.visibility_status && analysis.visibility_status !== "live" && (
                <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0 ${
                  analysis.visibility_status === "draft"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-red-500/20 text-red-400"
                }`}>
                  {analysis.visibility_status === "draft" ? <FileEdit className="w-2.5 h-2.5" /> : <EyeOff className="w-2.5 h-2.5" />}
                  {analysis.visibility_status === "draft" ? "Draft" : "Hidden"}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {new Date(analysis.created_at).toLocaleDateString()}
            </p>
            {(analysis.visibility_status === "draft" || analysis.visibility_status === "hidden") && analysis.estimated_ready_at && (
              <p className="text-xs text-primary mt-1">
                Expected by {new Date(analysis.estimated_ready_at).toLocaleString("en-GB", {
                  day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                })}
              </p>
            )}
            {linkedPlayers[analysis.id] && linkedPlayers[analysis.id].length > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <Users className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{linkedPlayers[analysis.id].map(p => p.playerName).join(', ')}</span>
              </div>
            )}
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => navigate(createAnalysisSlug(analysis.home_team, analysis.away_team, analysis.id))}>
              <Eye className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleOpenDialog(type, analysis)}>
              <Pencil className="w-4 h-4" />
            </Button>
            {isAdmin && (
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleDelete(analysis.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    ));
  };

  const renderConceptsList = () => {
    return concepts.map((concept) => (
      <div key={concept.id} className="flex items-center justify-between p-3 bg-card border border-border/50 rounded-lg hover:border-accent/30 transition-colors">
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{concept.title || 'Untitled Concept'}</p>
          <p className="text-xs text-muted-foreground">{new Date(concept.created_at).toLocaleDateString()}</p>
          {concept.category && (
            <span className="text-xs bg-muted px-2 py-0.5 rounded mt-1 inline-block">{concept.category}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/staff/coaching?tab=analysis&edit=${concept.id}`)}>
            <Eye className="w-4 h-4" />
          </Button>
          {isAdmin && (
            <Button variant="ghost" size="sm" onClick={() => handleDeleteConcept(concept.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    ));
  };

  // If showing an editor view, render it directly instead of the list
  if (activeView !== 'list') {
    const isPreMatch = activeView === 'pre-match';
    const isPostMatch = activeView === 'post-match';
    const isConcept = activeView === 'concept';
    
    return (
      <div className="space-y-4">
        {/* Header with back button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleCloseDialog}>
              ← Back
            </Button>
            <h2 className="text-lg font-semibold">
              {editingAnalysis ? "Edit" : "New"} {isPreMatch ? "Pre-Match Analysis" : isPostMatch ? "Post-Match Analysis" : "Concept"}
            </h2>
          </div>
          {currentUserId && editingAnalysis && (
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  const { error } = await supabase
                    .from("analyses")
                    .update({ writer_user_id: currentUserId })
                    .eq("id", editingAnalysis.id);
                  if (error) throw error;
                  toast.success("Assigned to you");
                } catch (err: any) {
                  toast.error("Failed to assign");
                  console.error(err);
                }
              }}
            >
              Assign to Me
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {/* Quick Link - only show when creating new analysis (not for concepts) */}
          {!editingAnalysis && !isConcept && (
            <AnalysisQuickLink
              formData={formData}
              setFormData={setFormData}
              analysisType={activeView as "pre-match" | "post-match"}
              taggedPlayerIds={taggedPlayerIds}
              setTaggedPlayerIds={setTaggedPlayerIds}
            />
          )}

          {/* Match Details (Pre-Match and Post-Match only) */}
          {!isConcept && (
            <AnalysisMatchDetails
              formData={formData}
              setFormData={setFormData}
              handleImageUpload={handleImageUpload}
              handleVideoUpload={handleVideoUpload}
              uploadingImage={uploadingImage}
              analysisType={activeView as "pre-match" | "post-match"}
              players={players}
              selectedPlayerId={selectedPlayerId}
              setSelectedPlayerId={setSelectedPlayerId}
              performanceReports={performanceReports}
              selectedPerformanceReportId={selectedPerformanceReportId}
              setSelectedPerformanceReportId={setSelectedPerformanceReportId}
              showPlayerLinking={isPostMatch}
              taggedPlayerIds={taggedPlayerIds}
              setTaggedPlayerIds={setTaggedPlayerIds}
              defaultPlayerId={defaultPlayerId}
            />
          )}

          {/* Scheme Section (Pre-Match only) */}
          {isPreMatch && (
            <AnalysisSchemeSection
              formData={formData}
              setFormData={setFormData}
              handleSchemeChange={handleSchemeChange}
              updateStartingXIPlayer={updateStartingXIPlayer}
              generateWithAI={generateWithAI}
              aiGenerating={aiGenerating}
              formationTemplates={formationTemplates}
              handleImageUpload={handleImageUpload}
              handleVideoUpload={handleVideoUpload}
              uploadingImage={uploadingImage}
              hideAI={isAnalystOnly}
            />
          )}

          {/* Overview Section for Concept - shown first */}
          {isConcept && (
            <AnalysisOverviewSection
              formData={formData}
              setFormData={setFormData}
              handleVideoUpload={handleVideoUpload}
              handleImageUpload={handleImageUpload}
              uploadingImage={uploadingImage}
              players={players}
              selectedPlayerId={selectedPlayerId}
              setSelectedPlayerId={setSelectedPlayerId}
              performanceReports={performanceReports}
              selectedPerformanceReportId={selectedPerformanceReportId}
              setSelectedPerformanceReportId={setSelectedPerformanceReportId}
              analysisType="concept"
            />
          )}

          {/* Points Section */}
          <AnalysisPointsSection
            formData={formData}
            setFormData={setFormData}
            addPoint={addPoint}
            removePoint={removePoint}
            updatePoint={updatePoint}
            handleImageUpload={handleImageUpload}
            handleVideoUploadForPoint={handleVideoUploadForPoint}
            removeImageFromPoint={removeImageFromPoint}
            uploadingImage={uploadingImage}
            generateWithAI={generateWithAI}
            aiGenerating={aiGenerating}
            analysisType={activeView}
            hideAI={isAnalystOnly}
            performanceReportClips={performanceReportClips}
            analysisId={editingAnalysis?.id}
          />

          {/* Overview Section (Pre-Match and Post-Match - shown after points) */}
          {!isConcept && (
            <AnalysisOverviewSection
              formData={formData}
              setFormData={setFormData}
              handleVideoUpload={handleVideoUpload}
              handleImageUpload={handleImageUpload}
              uploadingImage={uploadingImage}
              players={players}
              selectedPlayerId={selectedPlayerId}
              setSelectedPlayerId={setSelectedPlayerId}
              performanceReports={performanceReports}
              selectedPerformanceReportId={selectedPerformanceReportId}
              setSelectedPerformanceReportId={setSelectedPerformanceReportId}
              analysisType={activeView as "pre-match" | "post-match"}
              addMatchup={addMatchup}
              removeMatchup={removeMatchup}
              updateMatchup={updateMatchup}
              generateOverviewWithAI={generateOverviewFromPoints}
              aiGenerating={aiGenerating}
              onOpenSettings={handleOpenOverviewSettings}
            />
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t mt-4 sticky bottom-0 bg-background py-4">
          <Button variant="outline" onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave}>{isConcept ? "Save Concept" : "Save Analysis"}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Settings button */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Analysis</h2>
        {!isAnalystOnly && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSettingsDialogOpen(true)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        )}
      </div>

      <Tabs value={activeListTab} onValueChange={setActiveListTab} className="space-y-4">
        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
          <TabsList className="inline-flex w-max md:w-full md:grid md:grid-cols-4 gap-1 h-auto p-1">
            <TabsTrigger value="pre-match" className="text-xs md:text-sm px-3 md:px-4 py-2 whitespace-nowrap">Pre-Match</TabsTrigger>
            <TabsTrigger value="post-match" className="text-xs md:text-sm px-3 md:px-4 py-2 whitespace-nowrap">Post-Match</TabsTrigger>
            <TabsTrigger value="concepts" className="text-xs md:text-sm px-3 md:px-4 py-2 whitespace-nowrap">Concepts</TabsTrigger>
            <TabsTrigger value="action-reports" className="text-xs md:text-sm px-3 md:px-4 py-2 whitespace-nowrap">Action Reports</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="pre-match" className="space-y-4">
          <Button 
            onClick={() => handleOpenDialog("pre-match")}
            className="bg-gradient-to-r from-muted to-muted/80 text-foreground hover:from-muted/80 hover:to-muted/60"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Pre-Match Analysis
          </Button>
          <div className="grid gap-2">{renderAnalysisList("pre-match")}</div>
        </TabsContent>

        <TabsContent value="post-match" className="space-y-4">
          <Button 
            onClick={() => handleOpenDialog("post-match")}
            className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Post-Match Analysis
          </Button>
          <div className="grid gap-2">{renderAnalysisList("post-match")}</div>
        </TabsContent>

        <TabsContent value="concepts" className="space-y-4">
          <Button onClick={() => handleOpenDialog("concept")}>
            <Plus className="w-4 h-4 mr-2" />
            New Concept
          </Button>
          <div className="grid gap-2">{renderConceptsList()}</div>
        </TabsContent>

        <TabsContent value="action-reports" className="space-y-4">
          <ActionReportsList
            onCreateReport={(playerId, playerName) => {
              toast.info(`Create report for ${playerName}`);
            }}
            onEditReport={(playerId, playerName, analysisId) => {
              toast.info(`Edit report for ${playerName}`);
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Settings Dialog */}
      <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Analysis Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Manage the example writing styles used by the AI to generate prose for each analysis type.
            </p>
            <div className="grid gap-2">
              <Button variant="outline" size="sm" onClick={() => { setExamplesCategory('pre-match-p1'); setExamplesType('point'); setExamplesDialogOpen(true); fetchExamples('pre-match-p1', 'point'); setSettingsDialogOpen(false); }}>
                Pre-Match Point First Paragraph
              </Button>
              <Button variant="outline" size="sm" onClick={() => { setExamplesCategory('pre-match-p2'); setExamplesType('point'); setExamplesDialogOpen(true); fetchExamples('pre-match-p2', 'point'); setSettingsDialogOpen(false); }}>
                Pre-Match Point Second Paragraph
              </Button>
              <Button variant="outline" size="sm" onClick={() => { setExamplesCategory('post-match-p1'); setExamplesType('point'); setExamplesDialogOpen(true); fetchExamples('post-match-p1', 'point'); setSettingsDialogOpen(false); }}>
                Post-Match Point First Paragraph
              </Button>
              <Button variant="outline" size="sm" onClick={() => { setExamplesCategory('post-match-p2'); setExamplesType('point'); setExamplesDialogOpen(true); fetchExamples('post-match-p2', 'point'); setSettingsDialogOpen(false); }}>
                Post-Match Point Second Paragraph
              </Button>
              <Button variant="outline" size="sm" onClick={() => { setExamplesCategory('scheme-p1'); setExamplesType('point'); setExamplesDialogOpen(true); fetchExamples('scheme-p1', 'point'); setSettingsDialogOpen(false); }}>
                Schemes First Paragraph
              </Button>
              <Button variant="outline" size="sm" onClick={() => { setExamplesCategory('scheme-p2'); setExamplesType('point'); setExamplesDialogOpen(true); fetchExamples('scheme-p2', 'point'); setSettingsDialogOpen(false); }}>
                Schemes Second Paragraph
              </Button>
              <Button variant="outline" size="sm" onClick={() => { setExamplesCategory('pre-match'); setExamplesType('overview'); setExamplesDialogOpen(true); fetchExamples('pre-match', 'overview'); setSettingsDialogOpen(false); }}>
                Pre-Match Overview Examples
              </Button>
              <Button variant="outline" size="sm" onClick={() => { setExamplesCategory('post-match'); setExamplesType('overview'); setExamplesDialogOpen(true); fetchExamples('post-match', 'overview'); setSettingsDialogOpen(false); }}>
                Post-Match Overview Examples
              </Button>
              <Button variant="outline" size="sm" onClick={() => { setExamplesCategory('other'); setExamplesType('point'); setExamplesDialogOpen(true); fetchExamples('other', 'point'); setSettingsDialogOpen(false); }}>
                Other Examples
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Writer Dialog */}
      <Dialog open={aiWriter.open} onOpenChange={(open) => setAiWriter({ ...aiWriter, open })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>AI {aiWriter.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} Point Writer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Paragraph 1 Information</Label>
              <p className="text-xs text-muted-foreground mb-2">Enter key details for the first paragraph</p>
              <Textarea
                value={aiWriter.paragraph1Info}
                onChange={(e) => setAiWriter({ ...aiWriter, paragraph1Info: e.target.value })}
                placeholder="Provide specific observations, statistics, tactical details..."
                rows={3}
              />
            </div>
            <div>
              <Label>Paragraph 2 Information</Label>
              <p className="text-xs text-muted-foreground mb-2">Enter key details for the second paragraph</p>
              <Textarea
                value={aiWriter.paragraph2Info}
                onChange={(e) => setAiWriter({ ...aiWriter, paragraph2Info: e.target.value })}
                placeholder="Add follow-up details, recommendations..."
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setAiWriter({ open: false, category: 'pre-match', paragraph1Info: '', paragraph2Info: '' })}>
                Cancel
              </Button>
              <Button onClick={generateWithAIWriter} disabled={aiGenerating || (!aiWriter.paragraph1Info.trim() && !aiWriter.paragraph2Info.trim())}>
                <Sparkles className="w-4 h-4 mr-2" />
                {aiGenerating ? 'Generating...' : 'Generate Point'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Overview Writer Dialog */}
      <Dialog open={overviewWriter.open} onOpenChange={(open) => setOverviewWriter({ ...overviewWriter, open })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>AI {overviewWriter.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} Overview Writer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Overview Information</Label>
              <p className="text-xs text-muted-foreground mb-2">Enter key details for the overview paragraph</p>
              <Textarea
                value={overviewWriter.overviewInfo}
                onChange={(e) => setOverviewWriter({ ...overviewWriter, overviewInfo: e.target.value })}
                placeholder="Provide comprehensive match/tactical information..."
                rows={5}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOverviewWriter({ open: false, category: 'pre-match', overviewInfo: '' })}>
                Cancel
              </Button>
              <Button onClick={generateOverview} disabled={aiGenerating || !overviewWriter.overviewInfo.trim()}>
                <Sparkles className="w-4 h-4 mr-2" />
                {aiGenerating ? 'Generating...' : 'Generate Overview'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Scheme Writer Dialog */}
      <Dialog open={schemeWriter.open} onOpenChange={(open) => setSchemeWriter({ ...schemeWriter, open })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>AI Scheme Writer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Scheme Information</Label>
              <p className="text-xs text-muted-foreground mb-2">Enter tactical scheme details and strategy</p>
              <Textarea
                value={schemeWriter.schemeInfo}
                onChange={(e) => setSchemeWriter({ ...schemeWriter, schemeInfo: e.target.value })}
                placeholder="Detail the opponent's formation, key personnel..."
                rows={5}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSchemeWriter({ open: false, schemeInfo: '' })}>
                Cancel
              </Button>
              <Button onClick={generateScheme} disabled={aiGenerating || !schemeWriter.schemeInfo.trim()}>
                <Sparkles className="w-4 h-4 mr-2" />
                {aiGenerating ? 'Generating...' : 'Generate Scheme'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Generated Content Preview Dialog */}
      <Dialog open={generatedContent.open} onOpenChange={(open) => {
        if (!open) {
          setGeneratedContent({ open: false, type: 'point', content: '', category: 'pre-match' });
          setEditMode(false);
        }
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Generated Content Preview</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {editMode ? (
              generatedContent.type === 'overview' ? (
                <div>
                  <Label>Edit Overview</Label>
                  <Textarea
                    value={generatedContent.content}
                    onChange={(e) => setGeneratedContent({ ...generatedContent, content: e.target.value })}
                    rows={10}
                  />
                </div>
              ) : (
                <>
                  <div>
                    <Label>Edit Paragraph 1</Label>
                    <Textarea
                      value={generatedContent.paragraph1 || ''}
                      onChange={(e) => setGeneratedContent({ 
                        ...generatedContent, 
                        paragraph1: e.target.value,
                        content: `${e.target.value}\n\n${generatedContent.paragraph2 || ''}`
                      })}
                      rows={6}
                    />
                  </div>
                  <div>
                    <Label>Edit Paragraph 2</Label>
                    <Textarea
                      value={generatedContent.paragraph2 || ''}
                      onChange={(e) => setGeneratedContent({ 
                        ...generatedContent, 
                        paragraph2: e.target.value,
                        content: `${generatedContent.paragraph1 || ''}\n\n${e.target.value}`
                      })}
                      rows={6}
                    />
                  </div>
                </>
              )
            ) : (
              <div className="p-4 bg-muted rounded-lg whitespace-pre-wrap">
                {generatedContent.content}
              </div>
            )}

            <div className="flex gap-2 flex-wrap">
              <Button onClick={() => setTweakDialog({ open: true, tweakInstructions: '' })}>
                <Sparkles className="w-4 h-4 mr-2" />
                Tweak
              </Button>
              <Button variant="outline" onClick={() => setEditMode(!editMode)}>
                <Pencil className="w-4 h-4 mr-2" />
                {editMode ? 'Preview' : 'Edit'}
              </Button>
              <Button variant="outline" onClick={handleCopyGenerated}>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button variant="outline" onClick={handleSaveToDatabase}>
                <Database className="w-4 h-4 mr-2" />
                Save to Database
              </Button>
              <Button onClick={handleApplyGenerated}>
                Apply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tweak Dialog */}
      <Dialog open={tweakDialog.open} onOpenChange={(open) => setTweakDialog({ open, tweakInstructions: '' })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tweak Content</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>What would you like to change?</Label>
              <Textarea
                value={tweakDialog.tweakInstructions}
                onChange={(e) => setTweakDialog({ ...tweakDialog, tweakInstructions: e.target.value })}
                placeholder="e.g., Make it more concise, add more technical details..."
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setTweakDialog({ open: false, tweakInstructions: '' })}>
                Cancel
              </Button>
              <Button onClick={handleTweak} disabled={aiGenerating || !tweakDialog.tweakInstructions.trim()}>
                <Sparkles className="w-4 h-4 mr-2" />
                {aiGenerating ? 'Tweaking...' : 'Apply Tweak'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Examples Database Dialog */}
      <Dialog open={examplesDialogOpen} onOpenChange={setExamplesDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => { 
                  setExamplesDialogOpen(false); 
                  setSettingsDialogOpen(true); 
                  setEditingExample(null);
                  setExampleFormData({ paragraph_1: '', content: '' });
                }}
              >
                ← Back
              </Button>
              <DialogTitle>
                {examplesCategory.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} {examplesType === 'overview' ? 'Overview' : 'Point'} Examples
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{editingExample ? 'Edit Example' : 'Add Example'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {examplesType === 'overview' ? (
                  <div>
                    <Label>Overview Paragraph Example</Label>
                    <Textarea
                      value={exampleFormData.content}
                      onChange={(e) => setExampleFormData({ ...exampleFormData, content: e.target.value })}
                      placeholder="Example overview paragraph showing desired writing style..."
                      rows={6}
                    />
                  </div>
                ) : (
                  <div>
                    <Label>Paragraph Example</Label>
                    <p className="text-xs text-muted-foreground mb-2">
                      Enter an example paragraph that demonstrates the desired writing style for this category.
                    </p>
                    <Textarea
                      value={exampleFormData.paragraph_1}
                      onChange={(e) => setExampleFormData({ ...exampleFormData, paragraph_1: e.target.value })}
                      placeholder="Example paragraph showing desired writing style..."
                      rows={6}
                    />
                  </div>
                )}
                <div className="flex gap-2">
                  <Button onClick={handleSaveExample}>
                    {editingExample ? 'Update Example' : 'Add Example'}
                  </Button>
                  {editingExample && (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setEditingExample(null);
                        setExampleFormData({ paragraph_1: '', content: '' });
                      }}
                    >
                      Cancel Edit
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <h3 className="font-semibold">Existing Examples</h3>
              {examples.length === 0 ? (
                <p className="text-sm text-muted-foreground">No examples yet. Add some to help the AI match your writing style.</p>
              ) : (
                examples.map((example) => (
                  <Card key={example.id}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start gap-4">
                        <p className="text-sm flex-1">{example.paragraph_1 || example.content || 'No content'}</p>
                        <div className="flex gap-2 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingExample(example);
                              setExampleFormData({
                                paragraph_1: example.paragraph_1 || '',
                                content: example.content || ''
                              });
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          {isAdmin && (
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteExample(example.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
