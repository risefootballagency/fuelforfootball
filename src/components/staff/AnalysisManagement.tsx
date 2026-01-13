import { useState, useEffect } from "react";
import { sharedSupabase as supabase } from "@/integrations/supabase/sharedClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, X, Sparkles, Database, Copy, Settings, Eye, Users } from "lucide-react";
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

type AnalysisType = "pre-match" | "post-match" | "concept";

interface Analysis {
  id: string;
  analysis_type: AnalysisType;
  title: string | null;
  home_team?: string | null;
  away_team?: string | null;
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
  created_at: string;
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
}

export const AnalysisManagement = ({ isAdmin }: AnalysisManagementProps) => {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [preMatchDialogOpen, setPreMatchDialogOpen] = useState(false);
  const [postMatchDialogOpen, setPostMatchDialogOpen] = useState(false);
  const [conceptDialogOpen, setConceptDialogOpen] = useState(false);
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
  const [examplesCategory, setExamplesCategory] = useState<'pre-match' | 'post-match' | 'concept' | 'other' | 'scheme'>('pre-match');
  const [examplesType, setExamplesType] = useState<'point' | 'overview'>('point');
  const [examples, setExamples] = useState<any[]>([]);
  const [editingExample, setEditingExample] = useState<any | null>(null);
  const [exampleFormData, setExampleFormData] = useState({
    title: '',
    paragraph_1: '',
    paragraph_2: '',
    content: '',
    notes: ''
  });
  const [linkedPlayers, setLinkedPlayers] = useState<Record<string, any[]>>({});

  // Form states
  const [formData, setFormData] = useState<Partial<Analysis>>({
    points: [],
    matchups: [],
    starting_xi: [],
  });

  // Formation templates with position coordinates (x, y as percentages)
  const formationTemplates: Record<string, Array<{x: number, y: number, position: string}>> = {
    "4-4-2": [
      {x: 50, y: 90, position: "GK"},
      {x: 15, y: 70, position: "LB"}, {x: 35, y: 70, position: "CB"}, {x: 65, y: 70, position: "CB"}, {x: 85, y: 70, position: "RB"},
      {x: 15, y: 45, position: "LM"}, {x: 35, y: 45, position: "CM"}, {x: 65, y: 45, position: "CM"}, {x: 85, y: 45, position: "RM"},
      {x: 35, y: 20, position: "ST"}, {x: 65, y: 20, position: "ST"}
    ],
    "4-3-3": [
      {x: 50, y: 90, position: "GK"},
      {x: 15, y: 70, position: "LB"}, {x: 35, y: 70, position: "CB"}, {x: 65, y: 70, position: "CB"}, {x: 85, y: 70, position: "RB"},
      {x: 30, y: 50, position: "CM"}, {x: 50, y: 50, position: "CM"}, {x: 70, y: 50, position: "CM"},
      {x: 15, y: 20, position: "LW"}, {x: 50, y: 20, position: "ST"}, {x: 85, y: 20, position: "RW"}
    ],
    "4-2-3-1": [
      {x: 50, y: 90, position: "GK"},
      {x: 15, y: 70, position: "LB"}, {x: 35, y: 70, position: "CB"}, {x: 65, y: 70, position: "CB"}, {x: 85, y: 70, position: "RB"},
      {x: 35, y: 55, position: "CDM"}, {x: 65, y: 55, position: "CDM"},
      {x: 20, y: 35, position: "LM"}, {x: 50, y: 35, position: "CAM"}, {x: 80, y: 35, position: "RM"},
      {x: 50, y: 15, position: "ST"}
    ],
    "3-5-2": [
      {x: 50, y: 90, position: "GK"},
      {x: 25, y: 70, position: "CB"}, {x: 50, y: 70, position: "CB"}, {x: 75, y: 70, position: "CB"},
      {x: 10, y: 50, position: "LM"}, {x: 30, y: 50, position: "CM"}, {x: 50, y: 50, position: "CM"}, {x: 70, y: 50, position: "CM"}, {x: 90, y: 50, position: "RM"},
      {x: 35, y: 20, position: "ST"}, {x: 65, y: 20, position: "ST"}
    ],
    "5-3-2": [
      {x: 50, y: 90, position: "GK"},
      {x: 10, y: 70, position: "LWB"}, {x: 30, y: 75, position: "CB"}, {x: 50, y: 75, position: "CB"}, {x: 70, y: 75, position: "CB"}, {x: 90, y: 70, position: "RWB"},
      {x: 30, y: 45, position: "CM"}, {x: 50, y: 45, position: "CM"}, {x: 70, y: 45, position: "CM"},
      {x: 35, y: 20, position: "ST"}, {x: 65, y: 20, position: "ST"}
    ],
    "4-1-4-1": [
      {x: 50, y: 90, position: "GK"},
      {x: 15, y: 70, position: "LB"}, {x: 35, y: 70, position: "CB"}, {x: 65, y: 70, position: "CB"}, {x: 85, y: 70, position: "RB"},
      {x: 50, y: 55, position: "CDM"},
      {x: 15, y: 40, position: "LM"}, {x: 35, y: 40, position: "CM"}, {x: 65, y: 40, position: "CM"}, {x: 85, y: 40, position: "RM"},
      {x: 50, y: 15, position: "ST"}
    ],
    "3-4-3": [
      {x: 50, y: 90, position: "GK"},
      {x: 25, y: 70, position: "CB"}, {x: 50, y: 70, position: "CB"}, {x: 75, y: 70, position: "CB"},
      {x: 15, y: 50, position: "LM"}, {x: 40, y: 50, position: "CM"}, {x: 60, y: 50, position: "CM"}, {x: 85, y: 50, position: "RM"},
      {x: 20, y: 20, position: "LW"}, {x: 50, y: 20, position: "ST"}, {x: 80, y: 20, position: "RW"}
    ],
    "4-5-1": [
      {x: 50, y: 90, position: "GK"},
      {x: 15, y: 70, position: "LB"}, {x: 35, y: 70, position: "CB"}, {x: 65, y: 70, position: "CB"}, {x: 85, y: 70, position: "RB"},
      {x: 15, y: 45, position: "LM"}, {x: 35, y: 50, position: "CM"}, {x: 50, y: 50, position: "CM"}, {x: 65, y: 50, position: "CM"}, {x: 85, y: 45, position: "RM"},
      {x: 50, y: 15, position: "ST"}
    ],
    "4-1-2-1-2": [
      {x: 50, y: 90, position: "GK"},
      {x: 15, y: 70, position: "LB"}, {x: 35, y: 70, position: "CB"}, {x: 65, y: 70, position: "CB"}, {x: 85, y: 70, position: "RB"},
      {x: 50, y: 58, position: "CDM"},
      {x: 35, y: 45, position: "CM"}, {x: 65, y: 45, position: "CM"},
      {x: 50, y: 30, position: "CAM"},
      {x: 35, y: 15, position: "ST"}, {x: 65, y: 15, position: "ST"}
    ],
    "3-4-2-1": [
      {x: 50, y: 90, position: "GK"},
      {x: 25, y: 70, position: "CB"}, {x: 50, y: 70, position: "CB"}, {x: 75, y: 70, position: "CB"},
      {x: 15, y: 50, position: "LM"}, {x: 40, y: 50, position: "CM"}, {x: 60, y: 50, position: "CM"}, {x: 85, y: 50, position: "RM"},
      {x: 35, y: 30, position: "CAM"}, {x: 65, y: 30, position: "CAM"},
      {x: 50, y: 12, position: "ST"}
    ]
  };
  const [uploadingImage, setUploadingImage] = useState(false);
  const [players, setPlayers] = useState<any[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("none");
  const [performanceReports, setPerformanceReports] = useState<any[]>([]);
  const [selectedPerformanceReportId, setSelectedPerformanceReportId] = useState<string>("none");

  useEffect(() => {
    fetchAnalyses();
    fetchPlayers();
    fetchLinkedPlayers();
  }, []);

  useEffect(() => {
    if (selectedPlayerId && selectedPlayerId !== "none") {
      fetchPerformanceReports(selectedPlayerId);
    } else {
      setPerformanceReports([]);
      setSelectedPerformanceReportId("none");
    }
  }, [selectedPlayerId]);

  const fetchAnalyses = async () => {
    try {
      const { data, error } = await supabase
        .from("analyses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAnalyses((data as Analysis[]) || []);
    } catch (error: any) {
      toast.error("Failed to fetch analyses");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlayers = async () => {
    try {
      const { data, error } = await supabase
        .from("players")
        .select("id, name")
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
      setLinkedPlayers(grouped);
    } catch (error: any) {
      console.error("Failed to fetch linked players:", error);
    }
  };

  const handleOpenDialog = async (type: AnalysisType, analysis?: Analysis) => {
    setAnalysisType(type);
    if (analysis) {
      setEditingAnalysis(analysis);
      setFormData(analysis);
      
      const { data } = await supabase
        .from("player_analysis")
        .select("player_id, id")
        .eq("analysis_writer_id", analysis.id)
        .maybeSingle();
      
      if (data) {
        setSelectedPlayerId(data.player_id);
        setSelectedPerformanceReportId(data.id);
      }
    } else {
      setEditingAnalysis(null);
      setFormData({ analysis_type: type, points: [], matchups: [], starting_xi: [] });
      setSelectedPlayerId("none");
      setSelectedPerformanceReportId("none");
    }
    
    if (type === "pre-match") setPreMatchDialogOpen(true);
    else if (type === "post-match") setPostMatchDialogOpen(true);
    else if (type === "concept") setConceptDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setPreMatchDialogOpen(false);
    setPostMatchDialogOpen(false);
    setConceptDialogOpen(false);
    setEditingAnalysis(null);
    setFormData({ points: [], matchups: [], starting_xi: [] });
    setSelectedPlayerId("none");
    setSelectedPerformanceReportId("none");
  };

  const handleSchemeChange = (scheme: string) => {
    const template = formationTemplates[scheme];
    const startingXI = template.map((pos, idx) => ({
      ...pos,
      surname: "",
      number: "",
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

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("analysis-videos")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("analysis-videos").getPublicUrl(filePath);

      setFormData({ ...formData, video_url: publicUrl });
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
      const dataToSave = {
        ...formData,
        analysis_type: analysisType,
      };

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
          .insert([dataToSave])
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

      handleCloseDialog();
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
      fetchAnalyses();
    } catch (error: any) {
      toast.error("Failed to delete analysis");
      console.error(error);
    }
  };

  const addPoint = () => {
    setFormData({
      ...formData,
      points: [
        ...(formData.points || []),
        { title: "", paragraph_1: "", paragraph_2: "", images: [] },
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
      const { data, error } = await supabase
        .from('analysis_point_examples')
        .select('*')
        .eq('category', category)
        .eq('example_type', type)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExamples(data || []);
    } catch (error: any) {
      console.error('Error fetching examples:', error);
      toast.error('Failed to load examples');
    }
  };

  const handleSaveExample = async () => {
    try {
      if (editingExample) {
        const { error } = await supabase
          .from('analysis_point_examples')
          .update({
            ...exampleFormData,
            category: examplesCategory,
            example_type: examplesType
          })
          .eq('id', editingExample.id);

        if (error) throw error;
        toast.success('Example updated');
      } else {
        const { error } = await supabase
          .from('analysis_point_examples')
          .insert({
            ...exampleFormData,
            category: examplesCategory,
            example_type: examplesType
          });

        if (error) throw error;
        toast.success('Example added');
      }

      setExampleFormData({ title: '', paragraph_1: '', paragraph_2: '', content: '', notes: '' });
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
      const { error } = await supabase
        .from('analysis_point_examples')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Example deleted');
      fetchExamples(examplesCategory, examplesType);
    } catch (error: any) {
      console.error('Error deleting example:', error);
      toast.error('Failed to delete example');
    }
  };

  const generateWithAI = async (field: string, pointIndex?: number) => {
    setAiGenerating(true);
    try {
      let prompt = '';
      let context = '';
      let type = '';

      if (field === 'scheme_paragraph_1' || field === 'scheme_paragraph_2') {
        context = `Analysis Type: ${analysisType}\nTeams: ${formData.home_team} vs ${formData.away_team}\nTitle: ${formData.scheme_title || 'Not specified'}`;
        prompt = `Write a detailed tactical analysis paragraph for this match.`;
        type = 'analysis-paragraph';
      } else if (field === 'point_title') {
        prompt = `Create a concise, professional title for a match analysis section.`;
        type = 'analysis-point-title';
      } else if (field === 'point_paragraph_1' || field === 'point_paragraph_2') {
        const point = formData.points?.[pointIndex!];
        context = `Section Title: ${point?.title || 'Not specified'}`;
        prompt = `Write a detailed analysis paragraph for this section.`;
        type = 'analysis-paragraph';
      }

      const { data, error } = await supabase.functions.invoke('ai-write', {
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

      const { data, error } = await supabase.functions.invoke('ai-write', {
        body: {
          prompt: `Write a comprehensive overview paragraph for a ${overviewWriter.category} analysis based on this information: ${overviewWriter.overviewInfo}. Match the writing style, vocabulary level, and level of detail shown in the examples. This should be one cohesive paragraph.`,
          context: `Analysis Type: ${overviewWriter.category}${exampleContext}`,
          type: 'analysis-overview'
        }
      });

      if (error) throw error;

      const overview = data.text;

      setGeneratedContent({
        open: true,
        type: 'overview',
        content: overview,
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
      const { data: styleExamples } = await supabase
        .from('analysis_point_examples')
        .select('paragraph_1, paragraph_2')
        .eq('category', 'scheme')
        .eq('example_type', 'point')
        .limit(3);

      const exampleContext = styleExamples && styleExamples.length > 0
        ? `\n\nExample scheme writing style references:\n${styleExamples.map((ex, i) => 
            `Example ${i + 1}:\nParagraph 1: ${ex.paragraph_1 || ''}\nParagraph 2: ${ex.paragraph_2 || ''}`
          ).join('\n\n')}`
        : '';

      const { data, error } = await supabase.functions.invoke('ai-write', {
        body: {
          prompt: `Write two tactical scheme analysis paragraphs based on this information: ${schemeWriter.schemeInfo}. Match the writing style, vocabulary level, and level of detail shown in the examples. Separate the two paragraphs with a double line break.`,
          context: `Analysis Type: scheme${exampleContext}`,
          type: 'analysis-paragraph'
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
        const { data: data1, error: error1 } = await supabase.functions.invoke('ai-write', {
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
    return analyses.filter(a => a.analysis_type === type).map((analysis) => (
      <div 
        key={analysis.id}
        className="flex items-center justify-between p-3 bg-card border border-border/50 rounded-lg hover:border-accent/30 transition-colors"
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">
              {analysis.title || `${analysis.home_team} vs ${analysis.away_team}`}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(analysis.created_at).toLocaleDateString()}
            </p>
          </div>
          {linkedPlayers[analysis.id] && linkedPlayers[analysis.id].length > 0 && (
            <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="w-3 h-3" />
              <span>{linkedPlayers[analysis.id].map(p => p.playerName).join(', ')}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => window.open(`/analysis/${analysis.id}`, '_blank')}>
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(type, analysis)}>
            <Pencil className="w-4 h-4" />
          </Button>
          {isAdmin && (
            <Button variant="ghost" size="sm" onClick={() => handleDelete(analysis.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    ));
  };

  return (
    <div className="space-y-4">
      {/* Header with Settings button */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Analysis</h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setSettingsDialogOpen(true)}
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>

      <Tabs defaultValue="pre-match" className="space-y-4">
        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
          <TabsList className="inline-flex w-max md:w-full md:grid md:grid-cols-4 gap-1 h-auto p-1">
            <TabsTrigger value="pre-match" className="text-xs md:text-sm px-3 md:px-4 py-2 whitespace-nowrap">Pre-Match</TabsTrigger>
            <TabsTrigger value="post-match" className="text-xs md:text-sm px-3 md:px-4 py-2 whitespace-nowrap">Post-Match</TabsTrigger>
            <TabsTrigger value="concepts" className="text-xs md:text-sm px-3 md:px-4 py-2 whitespace-nowrap">Concepts</TabsTrigger>
            <TabsTrigger value="other" className="text-xs md:text-sm px-3 md:px-4 py-2 whitespace-nowrap">Other</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="pre-match" className="space-y-4">
          <Button 
            onClick={() => handleOpenDialog("pre-match")}
            className="bg-gradient-to-r from-slate-300 to-slate-400 text-slate-900 hover:from-slate-400 hover:to-slate-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Pre-Match Analysis
          </Button>
          <div className="grid gap-2">{renderAnalysisList("pre-match")}</div>
        </TabsContent>

        <TabsContent value="post-match" className="space-y-4">
          <Button 
            onClick={() => handleOpenDialog("post-match")}
            className="bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900 hover:from-amber-500 hover:to-yellow-600"
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
          <div className="grid gap-2">{renderAnalysisList("concept")}</div>
        </TabsContent>

        <TabsContent value="other" className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button 
              onClick={() => setAiWriter({ ...aiWriter, open: true, category: 'other', paragraph1Info: '', paragraph2Info: '' })}
              variant="outline"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI Point Writer
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Pre-Match Dialog */}
      <Dialog open={preMatchDialogOpen} onOpenChange={setPreMatchDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
          <DialogHeader>
            <DialogTitle>{editingAnalysis ? "Edit" : "New"} Pre-Match Analysis</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <AnalysisMatchDetails
              formData={formData}
              setFormData={setFormData}
              handleImageUpload={handleImageUpload}
              uploadingImage={uploadingImage}
              analysisType="pre-match"
              addMatchup={addMatchup}
              removeMatchup={removeMatchup}
              updateMatchup={updateMatchup}
            />

            <AnalysisSchemeSection
              formData={formData}
              setFormData={setFormData}
              handleSchemeChange={handleSchemeChange}
              updateStartingXIPlayer={updateStartingXIPlayer}
              generateWithAI={generateWithAI}
              aiGenerating={aiGenerating}
              formationTemplates={formationTemplates}
            />

            <AnalysisPointsSection
              formData={formData}
              setFormData={setFormData}
              addPoint={addPoint}
              removePoint={removePoint}
              updatePoint={updatePoint}
              handleImageUpload={handleImageUpload}
              removeImageFromPoint={removeImageFromPoint}
              uploadingImage={uploadingImage}
              generateWithAI={generateWithAI}
              aiGenerating={aiGenerating}
              analysisType="pre-match"
            />

            <AnalysisOverviewSection
              formData={formData}
              setFormData={setFormData}
              handleVideoUpload={handleVideoUpload}
              uploadingImage={uploadingImage}
              players={players}
              selectedPlayerId={selectedPlayerId}
              setSelectedPlayerId={setSelectedPlayerId}
              performanceReports={performanceReports}
              selectedPerformanceReportId={selectedPerformanceReportId}
              setSelectedPerformanceReportId={setSelectedPerformanceReportId}
              analysisType="pre-match"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t mt-4">
            <Button variant="outline" onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSave}>Save Analysis</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Post-Match Dialog */}
      <Dialog open={postMatchDialogOpen} onOpenChange={setPostMatchDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
          <DialogHeader>
            <DialogTitle>{editingAnalysis ? "Edit" : "New"} Post-Match Analysis</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <AnalysisMatchDetails
              formData={formData}
              setFormData={setFormData}
              handleImageUpload={handleImageUpload}
              uploadingImage={uploadingImage}
              analysisType="post-match"
            />

            <AnalysisPointsSection
              formData={formData}
              setFormData={setFormData}
              addPoint={addPoint}
              removePoint={removePoint}
              updatePoint={updatePoint}
              handleImageUpload={handleImageUpload}
              removeImageFromPoint={removeImageFromPoint}
              uploadingImage={uploadingImage}
              generateWithAI={generateWithAI}
              aiGenerating={aiGenerating}
              analysisType="post-match"
            />

            <AnalysisOverviewSection
              formData={formData}
              setFormData={setFormData}
              handleVideoUpload={handleVideoUpload}
              uploadingImage={uploadingImage}
              players={players}
              selectedPlayerId={selectedPlayerId}
              setSelectedPlayerId={setSelectedPlayerId}
              performanceReports={performanceReports}
              selectedPerformanceReportId={selectedPerformanceReportId}
              setSelectedPerformanceReportId={setSelectedPerformanceReportId}
              analysisType="post-match"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t mt-4">
            <Button variant="outline" onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSave}>Save Analysis</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Concept Dialog */}
      <Dialog open={conceptDialogOpen} onOpenChange={setConceptDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
          <DialogHeader>
            <DialogTitle>{editingAnalysis ? "Edit" : "New"} Concept</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <AnalysisOverviewSection
              formData={formData}
              setFormData={setFormData}
              handleVideoUpload={handleVideoUpload}
              uploadingImage={uploadingImage}
              players={players}
              selectedPlayerId={selectedPlayerId}
              setSelectedPlayerId={setSelectedPlayerId}
              performanceReports={performanceReports}
              selectedPerformanceReportId={selectedPerformanceReportId}
              setSelectedPerformanceReportId={setSelectedPerformanceReportId}
              analysisType="concept"
            />

            <AnalysisPointsSection
              formData={formData}
              setFormData={setFormData}
              addPoint={addPoint}
              removePoint={removePoint}
              updatePoint={updatePoint}
              handleImageUpload={handleImageUpload}
              removeImageFromPoint={removeImageFromPoint}
              uploadingImage={uploadingImage}
              generateWithAI={generateWithAI}
              aiGenerating={aiGenerating}
              analysisType="concept"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t mt-4">
            <Button variant="outline" onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSave}>Save Concept</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Analysis Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Manage the example writing styles used by the AI to generate prose for each analysis type.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => { setExamplesCategory('pre-match'); setExamplesType('point'); setExamplesDialogOpen(true); fetchExamples('pre-match', 'point'); setSettingsDialogOpen(false); }}>
                Pre-Match Point Examples
              </Button>
              <Button variant="outline" onClick={() => { setExamplesCategory('pre-match'); setExamplesType('overview'); setExamplesDialogOpen(true); fetchExamples('pre-match', 'overview'); setSettingsDialogOpen(false); }}>
                Pre-Match Overview Examples
              </Button>
              <Button variant="outline" onClick={() => { setExamplesCategory('post-match'); setExamplesType('point'); setExamplesDialogOpen(true); fetchExamples('post-match', 'point'); setSettingsDialogOpen(false); }}>
                Post-Match Point Examples
              </Button>
              <Button variant="outline" onClick={() => { setExamplesCategory('post-match'); setExamplesType('overview'); setExamplesDialogOpen(true); fetchExamples('post-match', 'overview'); setSettingsDialogOpen(false); }}>
                Post-Match Overview Examples
              </Button>
              <Button variant="outline" onClick={() => { setExamplesCategory('concept'); setExamplesType('point'); setExamplesDialogOpen(true); fetchExamples('concept', 'point'); setSettingsDialogOpen(false); }}>
                Concept Examples
              </Button>
              <Button variant="outline" onClick={() => { setExamplesCategory('scheme'); setExamplesType('point'); setExamplesDialogOpen(true); fetchExamples('scheme', 'point'); setSettingsDialogOpen(false); }}>
                Scheme Examples
              </Button>
              <Button variant="outline" onClick={() => { setExamplesCategory('other'); setExamplesType('point'); setExamplesDialogOpen(true); fetchExamples('other', 'point'); setSettingsDialogOpen(false); }}>
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
          <DialogHeader>
            <DialogTitle>
              {examplesCategory.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} {examplesType === 'overview' ? 'Overview' : 'Point'} Examples
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{editingExample ? 'Edit' : 'Add'} Example</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Title (Optional)</Label>
                  <Input
                    value={exampleFormData.title}
                    onChange={(e) => setExampleFormData({ ...exampleFormData, title: e.target.value })}
                    placeholder="e.g., Defensive Positioning Analysis"
                  />
                </div>
                {examplesType === 'overview' ? (
                  <div>
                    <Label>Overview Paragraph</Label>
                    <Textarea
                      value={exampleFormData.content}
                      onChange={(e) => setExampleFormData({ ...exampleFormData, content: e.target.value })}
                      placeholder="Example overview paragraph showing desired writing style..."
                      rows={6}
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <Label>Paragraph 1</Label>
                      <Textarea
                        value={exampleFormData.paragraph_1}
                        onChange={(e) => setExampleFormData({ ...exampleFormData, paragraph_1: e.target.value })}
                        placeholder="Example paragraph showing desired writing style..."
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label>Paragraph 2</Label>
                      <Textarea
                        value={exampleFormData.paragraph_2}
                        onChange={(e) => setExampleFormData({ ...exampleFormData, paragraph_2: e.target.value })}
                        placeholder="Example paragraph showing desired writing style..."
                        rows={4}
                      />
                    </div>
                  </>
                )}
                <div>
                  <Label>Notes (Optional)</Label>
                  <Textarea
                    value={exampleFormData.notes}
                    onChange={(e) => setExampleFormData({ ...exampleFormData, notes: e.target.value })}
                    placeholder="Notes about this example..."
                    rows={2}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSaveExample}>
                    {editingExample ? 'Update' : 'Add'} Example
                  </Button>
                  {editingExample && (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setEditingExample(null);
                        setExampleFormData({ title: '', paragraph_1: '', paragraph_2: '', content: '', notes: '' });
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
                    <CardHeader>
                      <CardTitle className="text-sm flex justify-between items-start">
                        <span>{example.title || 'Untitled Example'}</span>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingExample(example);
                              setExampleFormData({
                                title: example.title || '',
                                paragraph_1: example.paragraph_1 || '',
                                paragraph_2: example.paragraph_2 || '',
                                content: example.content || '',
                                notes: example.notes || ''
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
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {example.content && <p className="text-sm">{example.content}</p>}
                      {example.paragraph_1 && <p className="text-sm">{example.paragraph_1}</p>}
                      {example.paragraph_2 && <p className="text-sm">{example.paragraph_2}</p>}
                      {example.notes && <p className="text-xs text-muted-foreground italic">{example.notes}</p>}
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
