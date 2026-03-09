import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { ExportProgressFloat } from "@/components/staff/ExportProgressFloat";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Search, Menu, ChevronRight, ChevronLeft, Star, Plus, X, MoreHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { StaffBreadcrumb } from "@/components/staff/StaffBreadcrumb";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import PlayerManagement from "@/components/staff/PlayerManagement";
import { PlayerList } from "@/components/staff/PlayerList";
import BlogManagement from "@/components/staff/BlogManagement";
import DailyFuelManagement from "@/components/staff/DailyFuelManagement";
import { CoachingDatabase } from "@/components/staff/CoachingDatabase";
import { AnalysisManagement } from "@/components/staff/AnalysisManagement";
import { FormSubmissionsManagement } from "@/components/staff/FormSubmissionsManagement";
import { SiteVisitorsManagement } from "@/components/staff/SiteVisitorsManagement";
import { InvoiceManagement } from "@/components/staff/InvoiceManagement";
import { UpdatesManagement } from "@/components/staff/UpdatesManagement";
import { StaffSchedule } from "@/components/staff/StaffSchedule";
import { StaffOverview } from "@/components/staff/StaffOverview";
import { GoalsTasksManagement } from "@/components/staff/GoalsTasksManagement";
import { VisionBoardSection } from "@/components/staff/VisionBoardSection";
import { FocusedTasksSection } from "@/components/staff/FocusedTasksSection";
import { StaffNotificationsDropdown } from "@/components/staff/StaffNotificationsDropdown";
import { StaffAvailabilityManagement } from "@/components/staff/StaffAvailabilityManagement";
import { StaffSchedulesManagement } from "@/components/staff/StaffSchedulesManagement";
import { MarketingManagement } from "@/components/staff/MarketingManagement";
import { ContentCreator, MarketingIdeas } from "@/components/staff/marketing";
import { RecruitmentManagement } from "@/components/staff/RecruitmentManagement";
import { ScoutingCentreManagement } from "@/components/staff/ScoutingCentreManagement";
import { PlayerDatabaseManagement } from "@/components/staff/PlayerDatabaseManagement";
import { StaffAccountManagement } from "@/components/staff/StaffAccountManagement";
import { PlayerPasswordManagement } from "@/components/staff/PlayerPasswordManagement";
import ClubNetworkManagement from "@/components/staff/ClubNetworkManagement";
import LegalManagement from "@/components/staff/LegalManagement";
import { CaseStudyManagement } from "@/components/staff/CaseStudyManagement";
import { LanguagesManagement } from "@/components/staff/LanguagesManagement";
import { StreamsManagement } from "@/components/staff/StreamsManagement";
import { DesignStudio } from "@/components/staff/DesignStudio";
import { StaffPWAInstall } from "@/components/staff/StaffPWAInstall";
import { StaffOfflineManager } from "@/components/staff/StaffOfflineManager";
import { ServiceCatalogManagement } from "@/components/staff/ServiceCatalogManagement";
import { ServiceStatsManager } from "@/components/staff/sales/ServiceStatsManager";
import { StaffPushNotifications } from "@/components/staff/StaffPushNotifications";
import { HighlightMaker } from "@/components/staff/HighlightMaker";
import { HighlightCompiler } from "@/components/staff/HighlightCompiler";
import { SportscodeActionTypes } from "@/components/staff/SportscodeActionTypes";
import { RecruitmentRulesTab } from "@/components/staff/RecruitmentRulesTab";
import { PortalManagementAdmin } from "@/components/staff/PortalManagementAdmin";
import { useStaffNotifications } from "@/hooks/useStaffNotifications";
import { ExpensesManagement } from "@/components/staff/ExpensesManagement";
import { TaxRecordsManagement } from "@/components/staff/TaxRecordsManagement";
import { BudgetsManagement } from "@/components/staff/BudgetsManagement";
import { FinancialReports } from "@/components/staff/FinancialReports";
import { PaymentsManagement } from "@/components/staff/PaymentsManagement";
import { AthleteCentre } from "@/components/staff/AthleteCentre";
import { CoachingAIChat } from "@/components/staff/coaching/CoachingAIChat";
import { SalesManagement } from "@/components/staff/SalesManagement";
import { ShopCatalogManagement } from "@/components/staff/ShopCatalogManagement";
import { ContractSignature } from "@/components/staff/ContractSignature";
import { VersionManager } from "@/lib/versionManager";
import { RetentionTracker, SalesTracker, OutreachTracker, SalesHub, TimeManagement } from "@/components/staff/sales";
import { JobsManagement } from "@/components/staff/JobsManagement";
import { PartnersManagement } from "@/components/staff/PartnersManagement";
import { MarketingTipsManagement } from "@/components/staff/MarketingTipsManagement";
import { PressReleasesManagement } from "@/components/staff/PressReleasesManagement";
import { DocsSection } from "@/components/staff/sections/DocsSection";
import { SheetsSection } from "@/components/staff/sections/SheetsSection";
import { ServiceAudit } from "@/components/staff/coaching/ServiceAudit";
import { TransferHub } from "@/components/staff/TransferHub";
import PageLoading from "@/components/PageLoading";
import { SiteTextManagement } from "@/components/staff/SiteTextManagement";

// New Rise-aligned imports
import { AnnotationProjects } from "@/components/staff/annotations/AnnotationProjects";
import { VideoAnalysis } from "@/components/staff/coaching/VideoAnalysis";
import { TacticsBoard } from "@/components/staff/coaching/TacticsBoard";
import { Meetings } from "@/components/staff/coaching/Meetings";
import { CoachingDataSection } from "@/components/staff/CoachingDataSection";
import { StrengthPowerSpeedSection } from "@/components/staff/programming/StrengthPowerSpeedSection";
import { NutritionSection } from "@/components/staff/programming/NutritionSection";
import { ActivityLog } from "@/components/staff/ActivityLog";
import { DatabaseExport } from "@/components/staff/DatabaseExport";
import { RequestsManagement } from "@/components/staff/RequestsManagement";
import { PublicContentManagement } from "@/components/staff/PublicContentManagement";
import { NotificationSettingsManagement } from "@/components/staff/NotificationSettingsManagement";
import { StaffSMSNotifications } from "@/components/staff/StaffSMSNotifications";
import { KeyboardShortcutsDialog } from "@/components/staff/KeyboardShortcutsDialog";
import { SalesDeck } from "@/components/staff/marketing/SalesDeck";
import { VideoDownloaderSection } from "@/components/staff/VideoDownloaderSection";
import { VideoCompressor } from "@/components/staff/VideoCompressor";
import { MobileScrollButtons } from "@/components/staff/MobileScrollButtons";
import { SectionGridPicker } from "@/components/staff/SectionGridPicker";
import { StaffMusicPlayer } from "@/components/staff/StaffMusicPlayer";

import { sharedSupabase as supabase } from "@/integrations/supabase/sharedClient";
import type { User } from "@supabase/supabase-js";
import { Checkbox } from "@/components/ui/checkbox";

import { 
  Calendar, Users, UserCog, Target, Dumbbell, LineChart, Megaphone, Newspaper, FileText, Mail, Eye, FileCheck, BellRing, Network, Scale, Shield, Lock, Download, HardDrive, Bell, ClipboardList, Settings, Languages, Film, Building2, Wallet, Receipt, Calculator, PiggyBank, TrendingUp, FileSpreadsheet, UserRound, MessageSquare, ShoppingCart, Package, Radio, Palette, Pencil, LayoutGrid, Briefcase, Handshake, Database, Tv, Apple, Video, Globe, Presentation, ScrollText, Monitor,
} from "lucide-react";

// ──────────────── Tab Types ────────────────
interface HeaderTab {
  id: string;
  title: string;
  icon: string; // lucide icon name stored as string for localStorage
}

const MAX_STORED_TABS = 12;
const MAX_VISIBLE_TABS = 3;
const MAX_VISIBLE_TABS_MOBILE = 2;

// Icon lookup for header tabs
const ICON_MAP: Record<string, any> = {
  Calendar, Users, UserCog, Target, Dumbbell, LineChart, Megaphone, Newspaper, FileText, Mail, Eye, FileCheck, BellRing, Network, Scale, Shield, Lock, Download, HardDrive, Bell, ClipboardList, Settings, Languages, Film, Building2, Wallet, Receipt, Calculator, PiggyBank, TrendingUp, FileSpreadsheet, UserRound, MessageSquare, ShoppingCart, Package, Radio, Palette, Pencil, LayoutGrid, Briefcase, Handshake, Database, Tv, Apple, Video, Globe, Presentation, ScrollText, Monitor,
};

const Staff = () => {
  const isMobile = useIsMobile();
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [isStaff, setIsStaff] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMarketeer, setIsMarketeer] = useState(false);
  const [isAnalyst, setIsAnalyst] = useState(false);
  const [isActualStaff, setIsActualStaff] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [pinnedSections, setPinnedSections] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('staff_pinned_sections') || '[]'); } catch { return []; }
  });

  // Header tabs state
  const [openTabs, setOpenTabs] = useState<HeaderTab[]>(() => {
    try { return JSON.parse(localStorage.getItem('staff_open_tabs') || '[]'); } catch { return []; }
  });
  const [tabOverflowOpen, setTabOverflowOpen] = useState(false);
  const [newTabPickerOpen, setNewTabPickerOpen] = useState(false);
  const [draggingTabId, setDraggingTabId] = useState<string | null>(null);
  const [dragOverTabId, setDragOverTabId] = useState<string | null>(null);
  const dragStartXRef = useRef<number>(0);
  const isDragConfirmedRef = useRef(false);

  // Keyboard shortcuts dialog
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  
  // Notification triggers memoized
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => { setIsHydrated(true); }, []);
  const notificationTriggers = useMemo(() => {
    if (!isHydrated) return {};
    return { onVisitor: true, onFormSubmission: true, onClipUpload: true, onPlaylistChange: true };
  }, [isHydrated]);
  useStaffNotifications(notificationTriggers);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [sidebarSearchOpen, setSidebarSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{
    id: string;
    title: string;
    description?: string;
    section: string;
    sectionId: string;
    type: string;
  }>>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Persist tabs
  useEffect(() => {
    localStorage.setItem('staff_open_tabs', JSON.stringify(openTabs.slice(0, MAX_STORED_TABS)));
  }, [openTabs]);

  // Persist pins
  useEffect(() => {
    localStorage.setItem('staff_pinned_sections', JSON.stringify(pinnedSections));
  }, [pinnedSections]);

  const togglePin = (sectionId: string) => {
    setPinnedSections(prev =>
      prev.includes(sectionId) ? prev.filter(id => id !== sectionId) : [...prev, sectionId]
    );
  };

  // ──────────────── Header Tab Functions ────────────────
  const addSectionAsTab = useCallback(() => {
    if (!expandedSection) return;
    if (openTabs.some(t => t.id === expandedSection)) {
      toast.info("Already open as a tab");
      return;
    }
    const cats = buildCategories();
    const section = cats.flatMap(c => c.sections).find(s => s.id === expandedSection && !(s as any).isGroupLabel);
    if (!section) return;
    const iconName = Object.entries(ICON_MAP).find(([, v]) => v === section.icon)?.[0] || 'FileText';
    const newTab: HeaderTab = { id: section.id, title: section.title, icon: iconName };
    setOpenTabs(prev => [...prev.slice(0, MAX_STORED_TABS - 1), newTab]);
    toast.success(`Added "${section.title}" tab`);
  }, [expandedSection, openTabs]);

  const removeTab = useCallback((tabId: string) => {
    setOpenTabs(prev => {
      const updated = prev.filter(t => t.id !== tabId);
      // If removing the active tab, switch to the last remaining tab or overview
      if (expandedSection === tabId) {
        if (updated.length > 0) {
          const nextSection = updated[updated.length - 1].id;
          setExpandedSection(nextSection);
          setSearchParams({ section: nextSection });
          localStorage.setItem('staff_active_tab', nextSection);
        } else {
          setExpandedSection('overview');
          setSearchParams({ section: 'overview' });
          localStorage.setItem('staff_active_tab', 'overview');
        }
      }
      return updated;
    });
  }, [expandedSection]);

  // Tab drag handlers (native HTML5 drag)
  const handleTabDragStart = (e: React.DragEvent, tabId: string) => {
    setDraggingTabId(tabId);
    dragStartXRef.current = e.clientX;
    isDragConfirmedRef.current = false;
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleTabDragOver = (e: React.DragEvent, tabId: string) => {
    e.preventDefault();
    if (!isDragConfirmedRef.current && Math.abs(e.clientX - dragStartXRef.current) > 5) {
      isDragConfirmedRef.current = true;
    }
    if (isDragConfirmedRef.current) {
      setDragOverTabId(tabId);
    }
  };

  const handleTabDragEnd = () => {
    if (isDragConfirmedRef.current && draggingTabId && dragOverTabId && draggingTabId !== dragOverTabId) {
      setOpenTabs(prev => {
        const arr = [...prev];
        const fromIdx = arr.findIndex(t => t.id === draggingTabId);
        const toIdx = arr.findIndex(t => t.id === dragOverTabId);
        if (fromIdx === -1 || toIdx === -1) return prev;
        const [item] = arr.splice(fromIdx, 1);
        arr.splice(toIdx, 0, item);
        return arr;
      });
    }
    setDraggingTabId(null);
    setDragOverTabId(null);
    isDragConfirmedRef.current = false;
  };

  // Check URL parameters for section, fallback to localStorage
  useEffect(() => {
    if (!isStaff) return;
    const urlSection = searchParams.get('section');
    const section = urlSection || localStorage.getItem('staff_active_tab') || 'overview';
    setExpandedSection(section);
    localStorage.setItem('staff_active_tab', section);
    const cats = buildCategories();
    const parentCat = cats.find(c => c.sections.some(s => s.id === section));
    if (parentCat) setExpandedCategory(parentCat.id);
  }, [searchParams, isStaff]);

  // Persist active section to localStorage whenever it changes
  useEffect(() => {
    if (expandedSection) {
      localStorage.setItem('staff_active_tab', expandedSection);
    }
  }, [expandedSection]);

  // Keyboard shortcuts
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSidebarSearchOpen((open) => !open);
        return;
      }
      if (e.key === "?") {
        e.preventDefault();
        setShortcutsOpen(o => !o);
        return;
      }
      if (e.key === "Escape") {
        setExpandedSection('overview');
        setExpandedCategory('overview');
        return;
      }
      const num = parseInt(e.key);
      if (num >= 1 && num <= 9) {
        const cats = buildCategories();
        const target = cats[num - 1];
        if (target) {
          setExpandedCategory(target.id);
          const realSections = target.sections.filter(s => !(s as any).isGroupLabel);
          if (realSections.length === 1) {
            handleSectionToggle(realSections[0].id);
          }
        }
        return;
      }
      if ((e.key === "ArrowUp" || e.key === "ArrowDown") && expandedCategory) {
        e.preventDefault();
        const cat = buildCategories().find(c => c.id === expandedCategory);
        if (!cat) return;
        const realSections = cat.sections.filter(s => !(s as any).isGroupLabel);
        const currentIdx = realSections.findIndex(s => s.id === expandedSection);
        const nextIdx = e.key === "ArrowDown"
          ? Math.min(currentIdx + 1, realSections.length - 1)
          : Math.max(currentIdx - 1, 0);
        handleSectionToggle(realSections[nextIdx].id);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [expandedCategory, expandedSection]);

  const handleSectionToggle = (section: string, replaceCurrentTab = false) => {
    setExpandedSection(section);
    setSearchParams({ section });
    localStorage.setItem('staff_active_tab', section);
    
    // Auto-add section as tab (matching RISE behavior)
    try {
      const cats = buildCategories();
      const sectionData = cats.flatMap(c => c.sections).find(s => s.id === section && !(s as any).isGroupLabel);
      if (sectionData) {
        setOpenTabs(prev => {
          if (prev.some(t => t.id === section)) return prev;
          const iconName = Object.entries(ICON_MAP).find(([, v]) => v === sectionData.icon)?.[0] || 'FileText';
          const newTab: HeaderTab = { id: sectionData.id, title: sectionData.title, icon: iconName };
          
          if (replaceCurrentTab) {
            const prevActive = localStorage.getItem('staff_active_tab_prev');
            const activeIdx = prev.findIndex(t => t.id === prevActive);
            if (activeIdx !== -1) {
              const updated = [...prev];
              updated[activeIdx] = newTab;
              return updated.slice(-MAX_STORED_TABS);
            }
          }
          return [...prev, newTab].slice(-MAX_STORED_TABS);
        });
      }
    } catch {}
    
    localStorage.setItem('staff_active_tab_prev', section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load saved email and remember me preference on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("staff_saved_email");
    const savedRememberMe = localStorage.getItem("staff_remember_me");
    if (savedEmail) setEmail(savedEmail);
    if (savedRememberMe === "true") setRememberMe(true);
    if (navigator.onLine) {
      VersionManager.initialize(true);
    }
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          checkStaffRole(session.user.id);
        } else {
          setIsStaff(false); setIsAdmin(false); setIsActualStaff(false); setIsMarketeer(false); setIsAnalyst(false); setLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkStaffRole(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkStaffRole = async (userId: string) => {
    try {
      const { data, error } = await supabase.from('user_roles').select('role').eq('user_id', userId);
      if (error) {
        console.error('Error checking staff role:', error);
        setIsStaff(false); setIsAdmin(false); setIsActualStaff(false); setIsMarketeer(false); setIsAnalyst(false);
      } else {
        const hasStaffOrAdmin = data?.some(row => row.role === 'staff' || row.role === 'admin') ?? false;
        const hasMarketeer = data?.some(row => row.role === 'marketeer') ?? false;
        const hasAnalyst = data?.some(row => row.role === 'analyst') ?? false;
        setIsStaff(hasStaffOrAdmin || hasMarketeer || hasAnalyst);
        setIsActualStaff(hasStaffOrAdmin);
        setIsAdmin(data?.some(row => row.role === 'admin') ?? false);
        setIsMarketeer(hasMarketeer);
        setIsAnalyst(hasAnalyst);
        if (hasAnalyst && !hasStaffOrAdmin && !hasMarketeer) {
          setExpandedSection('analysis');
          setExpandedCategory('coaching');
        }
      }
    } catch (err) {
      console.error('Error:', err);
      setIsStaff(false); setIsAdmin(false); setIsActualStaff(false); setIsMarketeer(false); setIsAnalyst(false);
    } finally {
      setLoading(false);
    }
  };

  const performGlobalSearch = async (query: string) => {
    if (!query || query.length < 2) { setSearchResults([]); return; }
    setSearchLoading(true);
    const results: Array<{ id: string; title: string; description?: string; section: string; sectionId: string; type: string; }> = [];
    try {
      const searchTerm = `%${query}%`;
      const [playersRes, updatesRes, blogsRes, analysesRes, prospectsRes, scoutingRes, invoicesRes, drillsRes, sessionsRes, exercisesRes, contactsRes, playerAnalysisRes] = await Promise.all([
        supabase.from('players').select('id, name, position, club').ilike('name', searchTerm).limit(10),
        supabase.from('updates').select('id, title, content, date').or(`title.ilike.${searchTerm},content.ilike.${searchTerm}`).limit(5),
        supabase.from('blog_posts').select('id, title, excerpt').or(`title.ilike.${searchTerm},excerpt.ilike.${searchTerm}`).limit(5),
        supabase.from('analyses').select('id, title, analysis_type').ilike('title', searchTerm).limit(5),
        supabase.from('prospects').select('id, name, position, current_club').ilike('name', searchTerm).limit(5),
        supabase.from('scouting_reports').select('id, player_name, position, current_club, status').ilike('player_name', searchTerm).limit(5),
        supabase.from('invoices').select('id, invoice_number, description, amount').or(`invoice_number.ilike.${searchTerm},description.ilike.${searchTerm}`).limit(5),
        supabase.from('coaching_drills').select('id, title, category').ilike('title', searchTerm).limit(5),
        supabase.from('coaching_sessions').select('id, title, category').ilike('title', searchTerm).limit(5),
        supabase.from('coaching_exercises').select('id, title, category').ilike('title', searchTerm).limit(5),
        supabase.from('club_network_contacts').select('id, name, club_name, position').or(`name.ilike.${searchTerm},club_name.ilike.${searchTerm}`).limit(5),
        supabase.from('player_analysis').select('id, player_name, analysis_date').ilike('player_name', searchTerm).limit(5),
      ]);
      playersRes.data?.forEach(p => results.push({ id: p.id, title: p.name, description: `${p.position}${p.club ? ` at ${p.club}` : ''}`, section: 'Players', sectionId: 'players', type: 'player' }));
      updatesRes.data?.forEach(u => results.push({ id: u.id, title: u.title, description: u.content?.substring(0, 80) + '...', section: 'Player Updates', sectionId: 'updates', type: 'update' }));
      blogsRes.data?.forEach(b => results.push({ id: b.id, title: b.title, description: b.excerpt?.substring(0, 80), section: 'News Articles', sectionId: 'blog', type: 'blog' }));
      analysesRes.data?.forEach(a => results.push({ id: a.id, title: a.title || 'Untitled Analysis', description: a.analysis_type, section: 'Analysis', sectionId: 'analysis', type: 'analysis' }));
      prospectsRes.data?.forEach(p => results.push({ id: p.id, title: p.name, description: `${p.position || ''}${p.current_club ? ` at ${p.current_club}` : ''}`, section: 'Recruitment', sectionId: 'recruitment', type: 'prospect' }));
      scoutingRes.data?.forEach(r => results.push({ id: r.id, title: r.player_name, description: `${r.position || ''}${r.current_club ? ` at ${r.current_club}` : ''} - ${r.status}`, section: 'Scouting Centre', sectionId: 'scoutingcentre', type: 'scouting_report' }));
      invoicesRes.data?.forEach(i => results.push({ id: i.id, title: i.invoice_number, description: `${i.description || ''} - €${i.amount}`, section: 'Invoices', sectionId: 'invoices', type: 'invoice' }));
      drillsRes.data?.forEach(d => results.push({ id: d.id, title: d.title, description: d.category || 'Drill', section: 'Coaching Database', sectionId: 'coaching', type: 'drill' }));
      sessionsRes.data?.forEach(s => results.push({ id: s.id, title: s.title, description: s.category || 'Session', section: 'Coaching Database', sectionId: 'coaching', type: 'coaching_session' }));
      exercisesRes.data?.forEach(e => results.push({ id: e.id, title: e.title, description: e.category || 'Exercise', section: 'Coaching Database', sectionId: 'coaching', type: 'coaching_exercise' }));
      contactsRes.data?.forEach(c => results.push({ id: c.id, title: c.name, description: `${c.position || ''}${c.club_name ? ` at ${c.club_name}` : ''}`, section: 'Club Network', sectionId: 'clubnetwork', type: 'contact' }));
      playerAnalysisRes.data?.forEach(pa => results.push({ id: pa.id, title: pa.player_name || 'Unknown', description: pa.analysis_date, section: 'Data', sectionId: 'data', type: 'player_analysis' }));
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const normalizedEmail = email.toLowerCase().trim();
      const { data, error } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password });
      if (error) { toast.error(error.message); setLoading(false); return; }
      if (data.user) {
        if (rememberMe) {
          localStorage.setItem("staff_saved_email", normalizedEmail);
          localStorage.setItem("staff_remember_me", "true");
        } else {
          localStorage.removeItem("staff_saved_email");
          localStorage.removeItem("staff_remember_me");
        }
        await checkStaffRole(data.user.id);
        toast.success("Login successful");
      }
    } catch (err) {
      toast.error("An error occurred during login");
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null); setIsStaff(false); setIsAdmin(false); setIsActualStaff(false); setIsMarketeer(false); setIsAnalyst(false);
    setEmail(""); setPassword("");
    toast.success("Logged out");
  };

  if (loading) return <PageLoading />;

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center overflow-x-hidden">
        <div className="max-w-md w-full mx-4">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Staff Login</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4" autoComplete="on">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="username" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="staff@example.com" required autoFocus autoComplete="username" autoCapitalize="none" autoCorrect="off" spellCheck={false} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember-me-staff" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(checked as boolean)} />
                  <Label htmlFor="remember-me-staff" className="text-sm cursor-pointer">Remember me</Label>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>{loading ? "Logging in..." : "Access Dashboard"}</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!isStaff) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center overflow-x-hidden">
        <div className="max-w-md w-full mx-4">
          <Card className="w-full">
            <CardHeader><CardTitle className="text-2xl font-bold text-center text-destructive">Access Denied</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-muted-foreground">You do not have staff permissions to access this page.</p>
              <Button onClick={handleLogout} className="w-full" variant="outline">Logout</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isAnalystOnly = isAnalyst && !isActualStaff && !isMarketeer;

  const buildCategories = () => {
    if (isAnalystOnly) {
      return [{
        id: 'coaching', title: 'Analysis', icon: LineChart, locked: false,
        sections: [{ id: 'analysis', title: 'Analysis', icon: LineChart }]
      }];
    }

    if (isMarketeer && !isAdmin && !isActualStaff) {
      return [
        {
          id: 'overview', title: 'Overview', icon: Calendar, locked: false,
          sections: [
            { id: 'overview', title: 'Overview', icon: Calendar },
            { id: 'focusedtasks', title: 'Focused Tasks', icon: ClipboardList },
            { id: 'visionboard', title: 'Vision Board', icon: Target },
            { id: 'docs', title: 'Docs', icon: FileText },
            { id: 'sheets', title: 'Sheets', icon: FileSpreadsheet },
          ],
        },
        {
          id: 'management', title: 'Management', icon: UserCog, locked: false,
          sections: [{ id: 'players', title: 'Player Management', icon: UserCog }]
        },
        {
          id: 'network', title: 'Network & Recruitment', icon: Network, locked: false,
          sections: [
            { id: 'clubnetwork', title: 'Club Network', icon: Network },
            { id: 'playerlist', title: 'Player List', icon: Users },
            { id: 'recruitment', title: 'Recruitment', icon: Target },
            { id: 'playerdatabase', title: 'Player Database', icon: Users },
            { id: 'scoutingcentre', title: 'Scouting Centre', icon: ClipboardList },
            { id: 'submissions', title: 'Form Submissions', icon: Mail },
          ]
        },
        {
          id: 'marketing', title: 'Marketing & Brand', icon: Megaphone, locked: false,
          sections: [
            { id: 'marketing', title: 'Marketing', icon: Megaphone },
            { id: 'contentcreator', title: 'Content Creator', icon: Film },
            { id: 'visitors', title: 'Site Visitors', icon: Eye },
          ]
        },
        {
          id: 'admin', title: 'Admin & Legal', icon: Scale, locked: false,
          sections: [
            { id: 'legal', title: 'Legal', icon: Scale },
            { id: 'pwainstall', title: 'PWA Install', icon: Download },
            { id: 'offlinemanager', title: 'Offline Content', icon: HardDrive },
          ]
        }
      ];
    }

    // Full staff/admin - Rise structure with FFF extras
    return [
      {
        id: 'overview', title: 'Overview', icon: Calendar, locked: false,
        sections: [
          { id: 'overview', title: 'Overview', icon: Calendar },
          { id: '_group_schedule', title: 'Schedule', isGroupLabel: true } as any,
          { id: 'schedule', title: 'Schedule', icon: Calendar },
          { id: 'meetings', title: 'Meetings', icon: Users },
          { id: 'staffschedules', title: 'Staff Schedules', icon: Users },
          { id: '_group_tasks', title: 'Tasks', isGroupLabel: true } as any,
          { id: 'focusedtasks', title: 'Focused Tasks', icon: ClipboardList },
          { id: 'visionboard', title: 'Vision Board', icon: Target },
        ],
      },
      {
        id: 'apps', title: 'Apps', icon: LayoutGrid, locked: false,
        sections: [
          { id: 'docs', title: 'Docs', icon: FileText },
          { id: 'sheets', title: 'Sheets', icon: FileSpreadsheet },
          { id: 'designstudio', title: 'Design Studio', icon: Palette },
          { id: 'annotations', title: 'Annotations', icon: Film },
          { id: 'videoanalysis', title: 'Video Analysis', icon: Film },
          { id: 'streams', title: 'Streams', icon: Tv },
          { id: 'videocompressor', title: 'Video Compressor', icon: Film },
          { id: 'highlightcompiler', title: 'Highlight Compiler', icon: Film },
          { id: 'videodownloader', title: 'Video Downloader', icon: Download },
        ],
      },
      {
        id: 'coaching', title: 'Coaching', icon: Dumbbell, locked: false,
        sections: [
          { id: 'coaching', title: 'Coaching Database', icon: Dumbbell },
          { id: 'coachingchat', title: 'AI Chat', icon: MessageSquare },
          { id: '_group_analysis', title: 'Analysis', isGroupLabel: true } as any,
          { id: 'analysis', title: 'Analysis', icon: LineChart },
          { id: 'coachingdata', title: 'Data', icon: Database },
          { id: '_group_planning', title: 'Planning', isGroupLabel: true } as any,
          { id: 'athletecentre', title: 'Athlete Centre', icon: UserRound },
          { id: 'tacticsboard', title: 'Tactics Board', icon: LayoutGrid },
          { id: 'serviceaudit', title: 'Service Audit', icon: Calculator },
          { id: 'sportscodeactions', title: 'Sportscode Actions', icon: Video },
          { id: '_group_programming', title: 'Programming', isGroupLabel: true } as any,
          { id: 'sps', title: 'Strength Power & Speed', icon: Dumbbell },
          { id: 'nutrition', title: 'Nutrition', icon: Apple },
        ]
      },
      {
        id: 'management', title: 'Management', icon: UserCog, locked: false,
        sections: [
          { id: 'players', title: 'Players', icon: UserCog },
          { id: 'highlightmaker', title: 'Highlight Maker', icon: Film },
          { id: '_group_transfers', title: 'Transfers', isGroupLabel: true } as any,
          { id: 'transferhub', title: 'Transfer Hub', icon: Building2 },
          { id: 'updates', title: 'Player Updates', icon: BellRing },
          { id: 'requests', title: 'Requests', icon: Target },
          { id: '_group_portal', title: 'Portal', isGroupLabel: true } as any,
          { id: 'portalmanagement', title: 'Portal', icon: Monitor },
        ]
      },
      {
        id: 'marketing', title: 'Marketing & Brand', icon: Megaphone, locked: false,
        sections: [
          { id: '_group_content', title: 'Content', isGroupLabel: true } as any,
          { id: 'marketing', title: 'Marketing', icon: Megaphone },
          { id: 'contentcreator', title: 'Content Creator', icon: Film },
          { id: 'publiccontent', title: 'Public Content', icon: Globe },
          { id: '_group_commercial', title: 'Commercial', isGroupLabel: true } as any,
          { id: 'salesdeck', title: 'Sales Deck', icon: Presentation },
          { id: 'visitors', title: 'Site Visitors', icon: Eye },
          { id: '_group_publishing', title: 'Publishing', isGroupLabel: true } as any,
          { id: 'marketingideas', title: 'Marketing Ideas', icon: Target },
          { id: 'marketingtips', title: 'Tips & Lessons', icon: Target },
          { id: 'blog', title: 'News Articles', icon: Newspaper },
          { id: 'dailyfuel', title: 'Daily Fuel', icon: FileText },
          { id: 'pressreleases', title: 'Press Releases', icon: Newspaper },
        ]
      },
      {
        id: 'sales', title: 'Sales', icon: ShoppingCart, locked: false,
        sections: [
          { id: 'sales', title: 'Sales & Pay Links', icon: ShoppingCart },
          { id: 'catalogue', title: 'Service Catalogue', icon: FileText },
          { id: 'shopcatalogue', title: 'Shop Catalogue', icon: Package },
          { id: 'salestracker', title: 'Sales Tracker', icon: TrendingUp },
          { id: 'retention', title: 'Retention', icon: Users },
          { id: 'outreach', title: 'Outreach', icon: UserCog },
          { id: 'saleshub', title: 'Sales Hub', icon: FileText },
          
        ]
      },
      {
        id: 'financial', title: 'Financial', icon: Wallet, locked: false,
        sections: [
          { id: '_group_billing', title: 'Billing', isGroupLabel: true } as any,
          { id: 'invoices', title: 'Invoices', icon: FileCheck },
          { id: 'payments', title: 'Payments In/Out', icon: Receipt },
          { id: '_group_tracking', title: 'Tracking', isGroupLabel: true } as any,
          { id: 'expenses', title: 'Expenses', icon: Calculator },
          { id: 'taxrecords', title: 'Tax Records', icon: FileSpreadsheet },
          { id: '_group_overview_fin', title: 'Overview', isGroupLabel: true } as any,
          { id: 'budgets', title: 'Budgets', icon: PiggyBank },
          { id: 'financialreports', title: 'Reports', icon: TrendingUp },
        ]
      },
      {
        id: 'network', title: 'Network & Recruitment', icon: Network, locked: false,
        sections: [
          { id: '_group_network', title: 'Network', isGroupLabel: true } as any,
          { id: 'clubnetwork', title: 'Club Network', icon: Network },
          { id: 'playerlist', title: 'Player List', icon: Users },
          { id: 'casestudies', title: 'Case Studies', icon: MessageSquare },
          { id: '_group_scouting', title: 'Scouting', isGroupLabel: true } as any,
          { id: 'recruitment', title: 'Recruitment', icon: Target },
          { id: 'recruitmentrules', title: 'Recruitment Rules', icon: Scale },
          { id: 'playerdatabase', title: 'Player Database', icon: Users },
          { id: 'scoutingcentre', title: 'Scouting Centre', icon: ClipboardList },
          { id: 'submissions', title: 'Form Submissions', icon: Mail },
        ]
      },
      {
        id: 'legal', title: 'Legal', icon: Scale, locked: false,
        sections: [
          { id: 'legal', title: 'Legal', icon: Scale },
          { id: 'contracts', title: 'Contracts', icon: FileCheck },
          { id: 'partners', title: 'Partners', icon: Handshake },
          { id: 'jobs', title: 'Jobs', icon: Briefcase },
        ]
      },
      {
        id: 'admin', title: 'Admin', icon: Shield, locked: false,
        sections: [
          { id: '_group_site', title: 'Site', isGroupLabel: true } as any,
          { id: 'sitetext', title: 'Site Text', icon: Settings },
          { id: 'languages', title: 'Languages', icon: Languages },
          ...(isAdmin ? [
            { id: '_group_comms', title: 'Communications', isGroupLabel: true } as any,
            { id: 'notifications', title: 'Notifications', icon: Bell },
            { id: 'sms', title: 'SMS', icon: MessageSquare },
          ] : []),
          ...(isAdmin ? [
            { id: '_group_access', title: 'Access', isGroupLabel: true } as any,
            { id: 'passwords', title: 'Player Passwords', icon: Lock },
            { id: 'staffaccounts', title: 'Staff Accounts', icon: Shield },
            { id: '_group_data', title: 'Data', isGroupLabel: true } as any,
            { id: 'activitylog', title: 'Activity Log', icon: ScrollText },
            { id: 'dataexport', title: 'Data Export', icon: HardDrive },
          ] : []),
          { id: '_group_system', title: 'System', isGroupLabel: true } as any,
          { id: 'pwainstall', title: 'PWA Install', icon: Download },
          { id: 'offlinemanager', title: 'Offline Content', icon: HardDrive },
          { id: 'pushnotifications', title: 'Push Notifications', icon: Bell },
          { id: 'timemanagement', title: 'Time Management', icon: Calendar },
        ]
      }
    ];
  };

  const categories = buildCategories();

  // Keyword map for search
  const SECTION_KEYWORDS: Record<string, string[]> = {
    coaching: ['drills', 'sessions', 'exercises', 'database', 'training'],
    analysis: ['match', 'pre-match', 'post-match', 'video', 'reports'],
    players: ['player', 'management', 'squad', 'roster', 'profile'],
    marketing: ['campaigns', 'social', 'brand', 'content', 'posts'],
    invoices: ['billing', 'payments', 'fees', 'charges'],
    legal: ['contracts', 'documents', 'compliance', 'agreements'],
    clubnetwork: ['contacts', 'clubs', 'agents', 'scouts', 'network'],
    casestudies: ['messaging', 'conversations', 'case studies', 'outreach', 'examples'],
    recruitment: ['prospects', 'signings', 'targets', 'transfers'],
    expenses: ['costs', 'receipts', 'spending', 'reimbursement'],
    athletecentre: ['athlete', 'development', 'programming', 'periodisation'],
    nutrition: ['nutrition', 'diet', 'food', 'macros', 'calories', 'meal'],
    streams: ['stream', 'live', 'watch', 'channel', 'broadcast', 'tv'],
    scoutingcentre: ['scouting', 'reports', 'scouts', 'evaluations'],
    transferhub: ['transfers', 'outreach', 'clubs', 'deals'],
    videoanalysis: ['video', 'footage', 'clips', 'tagging'],
    sps: ['strength', 'power', 'speed', 'gym', 'weights'],
    annotations: ['draw', 'annotate', 'freeze', 'overlay'],
    activitylog: ['audit', 'history', 'log', 'actions'],
    dataexport: ['export', 'csv', 'json', 'download'],
    tacticsboard: ['tactics', 'formation', 'set piece'],
    meetings: ['meeting', 'agenda', 'minutes'],
    coachingdata: ['performance', 'statistics', 'stats', 'metrics'],
    videodownloader: ['download', 'mp4', 'extract', 'links'],
  };

  const filteredCategories = categories.map(category => ({
    ...category,
    sections: category.sections.filter(section => {
      if ((section as any).isGroupLabel) return true;
      const q = searchQuery.toLowerCase();
      if (!q) return true;
      if (section.title.toLowerCase().includes(q)) return true;
      const keywords = SECTION_KEYWORDS[section.id] || [];
      return keywords.some(kw => kw.includes(q));
    })
  })).filter(category => category.sections.filter(s => !(s as any).isGroupLabel).length > 0);

  const visibleTabCount = isMobile ? MAX_VISIBLE_TABS_MOBILE : MAX_VISIBLE_TABS;
  const visibleTabs = openTabs.slice(0, visibleTabCount);
  const overflowTabs = openTabs.slice(visibleTabCount);

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Marble background */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `url(${marbleBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.25,
        }}
      />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border pwa-safe-top">
        <div className="flex items-center h-16 px-4">
          {/* Left: Tabs */}
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            {visibleTabs.map((tab) => {
              const TabIcon = ICON_MAP[tab.icon] || FileText;
              const isActive = expandedSection === tab.id;
              return (
                <div
                  key={tab.id}
                  draggable
                  onDragStart={(e) => handleTabDragStart(e, tab.id)}
                  onDragOver={(e) => handleTabDragOver(e, tab.id)}
                  onDragEnd={handleTabDragEnd}
                  className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all select-none ${
                   isActive
                       ? 'bg-accent text-accent-foreground shadow-md'
                       : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground'
                  } ${draggingTabId === tab.id ? 'opacity-50' : ''} ${dragOverTabId === tab.id ? 'ring-2 ring-accent' : ''}`}
                  onClick={() => {
                    handleSectionToggle(tab.id);
                    const parent = categories.find(c => c.sections.some(s => s.id === tab.id));
                    if (parent) setExpandedCategory(parent.id);
                  }}
                >
                  <TabIcon className="w-3 h-3 shrink-0" />
                  <span className="truncate max-w-[80px]">{tab.title}</span>
                  <button
                    className="opacity-0 group-hover:opacity-100 transition-opacity ml-0.5 p-0.5 rounded-full hover:bg-background/30"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTab(tab.id);
                    }}
                    aria-label={`Close ${tab.title} tab`}
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              );
            })}

            {/* Overflow button */}
            {overflowTabs.length > 0 && (
              <Dialog open={tabOverflowOpen} onOpenChange={setTabOverflowOpen}>
                <button
                  onClick={() => setTabOverflowOpen(true)}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-full text-xs bg-muted/50 hover:bg-muted text-muted-foreground transition-all"
                >
                  <MoreHorizontal className="w-3 h-3" />
                  <span>+{overflowTabs.length}</span>
                </button>
                <DialogContent className="sm:max-w-sm">
                  <DialogHeader><DialogTitle>Open Tabs</DialogTitle></DialogHeader>
                  <div className="space-y-1">
                    {overflowTabs.map(tab => {
                      const TabIcon = ICON_MAP[tab.icon] || FileText;
                      return (
                        <div key={tab.id} className="flex items-center justify-between p-2 rounded hover:bg-muted/50 cursor-pointer" onClick={() => {
                          handleSectionToggle(tab.id);
                          const parent = categories.find(c => c.sections.some(s => s.id === tab.id));
                          if (parent) setExpandedCategory(parent.id);
                          setTabOverflowOpen(false);
                        }}>
                          <div className="flex items-center gap-2">
                            <TabIcon className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{tab.title}</span>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); removeTab(tab.id); }} className="p-1 hover:bg-destructive/10 rounded">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </DialogContent>
              </Dialog>
            )}

            {/* Add tab button - opens section picker */}
            <button
              onClick={() => setNewTabPickerOpen(true)}
              className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
              title="Open new section"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Centre: Logo */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <img 
              src="/fff_logo.png"
              alt="Fuel For Football"
              className="h-8 w-auto cursor-pointer"
              onClick={() => {
                handleSectionToggle('overview');
                setExpandedCategory('overview');
              }}
            />
          </div>

          {/* Right: Notifications + Logout */}
          <div className="flex items-center gap-2 ml-auto">
            <StaffMusicPlayer />
            <StaffNotificationsDropdown userId={user?.id || ''} />
            <Button onClick={handleLogout} variant="ghost" size="sm" className="text-xs hidden md:flex">
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Global Search Dialog */}
      <Dialog open={sidebarSearchOpen} onOpenChange={setSidebarSearchOpen}>
        <DialogContent className="sm:max-w-2xl p-0">
          <Command className="rounded-lg border-none shadow-none">
            <CommandInput
              placeholder="Search sections, players, analyses..."
              onValueChange={(val) => {
                if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
                searchTimeoutRef.current = setTimeout(() => performGlobalSearch(val), 300);
              }}
            />
            <CommandList className="max-h-[400px]">
              {searchResults.length > 0 && (
                <CommandGroup heading="Results">
                  {searchResults.map((result) => (
                    <CommandItem
                      key={`${result.type}-${result.id}`}
                      onSelect={() => {
                        setExpandedSection(result.sectionId);
                        setExpandedCategory(categories.find(c => c.sections.some(s => s.id === result.sectionId))?.id || null);
                        if (result.type === 'player') {
                          navigate(`/staff?section=${result.sectionId}&player=${result.id}`);
                        }
                        toast.success(`Opening ${result.section}`);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        setSidebarSearchOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      <div className="flex flex-col gap-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{result.title}</span>
                          <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary">{result.section}</span>
                        </div>
                        {result.description && <span className="text-xs text-muted-foreground line-clamp-1">{result.description}</span>}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {searchResults.length === 0 && (
                <CommandEmpty>{searchLoading ? 'Searching...' : 'No results found.'}</CommandEmpty>
              )}
              <CommandGroup heading="Jump to Section">
                {categories.flatMap(category => 
                  category.sections.filter(s => !(s as any).isGroupLabel).map(section => ({ section, category }))
                ).map(({ section, category }) => {
                  const Icon = section.icon;
                  return (
                    <CommandItem
                      key={section.id}
                      onSelect={() => {
                        handleSectionToggle(section.id);
                        setExpandedCategory(category.id);
                        setSidebarSearchOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      <span>{section.title}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>

      {/* Keyboard Shortcuts Dialog */}
      <KeyboardShortcutsDialog open={shortcutsOpen} onOpenChange={setShortcutsOpen} />

      {/* New Tab Picker Dialog */}
      <Dialog open={newTabPickerOpen} onOpenChange={setNewTabPickerOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[85vh] p-0 overflow-hidden">
          <DialogHeader className="sr-only"><DialogTitle>Open Section</DialogTitle></DialogHeader>
          <SectionGridPicker
            categories={categories}
            onSelect={(sectionId, categoryId) => {
              handleSectionToggle(sectionId);
              setExpandedCategory(categoryId);
              if (!openTabs.some(t => t.id === sectionId)) {
                const section = categories.flatMap(c => c.sections).find(s => s.id === sectionId && !(s as any).isGroupLabel);
                if (section) {
                  const iconName = Object.entries(ICON_MAP).find(([, v]) => v === section.icon)?.[0] || 'FileText';
                  setOpenTabs(prev => [...prev.slice(0, MAX_STORED_TABS - 1), { id: section.id, title: section.title, icon: iconName }]);
                }
              }
              setNewTabPickerOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Sidebar Collapse Toggle */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className={`fixed top-[68px] left-2 z-20 p-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border shadow-lg hover:bg-background transition-all duration-300 ${sidebarCollapsed ? 'opacity-50 hover:opacity-100' : ''}`}
        aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      {/* Left Sidebar */}
      <div className={`fixed top-16 left-0 bottom-0 border-r bg-muted/30 backdrop-blur-sm flex flex-col items-start py-4 pb-20 gap-2 overflow-y-auto scrollbar-thin z-10 transition-all duration-300 ${
        sidebarCollapsed ? 'w-0 border-0 opacity-0 pointer-events-none' : 'w-14 md:w-24'
      }`}>
        {/* Pinned Sections */}
        {pinnedSections.length > 0 && !expandedCategory && (
          <div className="w-full space-y-1 pb-1">
            {pinnedSections.map(pinId => {
              const section = categories.flatMap(c => c.sections).find(s => s.id === pinId && !(s as any).isGroupLabel);
              if (!section) return null;
              const PinIcon = section.icon;
              const isActive = expandedSection === pinId;
              return (
                <button
                  key={pinId}
                  onClick={() => {
                    handleSectionToggle(pinId);
                    const parent = categories.find(c => c.sections.some(s => s.id === pinId));
                    if (parent) setExpandedCategory(parent.id);
                  }}
                  className={`group w-full rounded-lg flex flex-col items-center justify-center py-1.5 px-1 transition-all ${isActive ? 'bg-accent text-accent-foreground shadow-md' : 'hover:bg-accent/10'}`}
                  title={section.title}
                >
                  <PinIcon className={`w-4 h-4 ${isActive ? 'text-accent-foreground' : 'text-accent'}`} />
                </button>
              );
            })}
            <div className="w-full px-2 py-1">
              <div className="h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />
            </div>
          </div>
        )}

        {/* Search Button */}
        <button
          onClick={() => setSidebarSearchOpen(true)}
          className="group w-full rounded-lg flex flex-col items-center justify-center py-2 md:py-3 px-1 md:px-2 transition-all hover:bg-accent/20"
          title="Search sections (⌘K)"
        >
          <div className="p-1.5 md:p-2 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors border border-accent/20">
            <Search className="w-3 h-3 md:w-4 md:h-4 text-accent" />
          </div>
        </button>
        {filteredCategories.map((category, index) => {
          const CategoryIcon = category.icon;
          const isExpanded = expandedCategory === category.id;
          const hasActiveSection = category.sections.filter(s => !(s as any).isGroupLabel).some(s => s.id === expandedSection);
          const realSections = category.sections.filter(s => !(s as any).isGroupLabel);
          const isSingleSection = realSections.length === 1;
          const shouldShow = !expandedCategory || expandedCategory === category.id;
          
          return (
            <div key={category.id} className={`w-full ${!shouldShow ? 'hidden' : ''}`}>
              <button
                onClick={() => {
                  if (category.locked) { toast.error("You don't have permission to access this section"); return; }
                  if (isSingleSection) { handleSectionToggle(realSections[0].id); }
                  else { setExpandedCategory(isExpanded ? null : category.id); }
                }}
                className={`group relative w-full rounded-lg flex flex-col items-center justify-center py-2 md:py-3 px-1 md:px-2 transition-all ${
                  category.locked ? 'opacity-50 cursor-not-allowed hover:bg-muted/30' : 'hover:bg-accent/20'
                } ${hasActiveSection || isExpanded ? 'bg-gradient-to-br from-accent via-accent to-accent shadow-lg' : ''}`}
              >
                <CategoryIcon className={`w-5 h-5 md:w-6 md:h-6 mb-0.5 md:mb-1 ${hasActiveSection || isExpanded ? 'text-accent-foreground' : ''}`} />
                <span className={`text-[6px] sm:text-[7px] leading-tight text-center px-0.5 font-medium uppercase tracking-tight ${hasActiveSection || isExpanded ? 'text-accent-foreground' : 'text-muted-foreground'}`}>
                  {category.title.split(' ').map((word, i) => <span key={i} className="block">{word}</span>)}
                </span>
                {category.locked && <Lock className="absolute bottom-1 right-1 w-2.5 h-2.5 md:w-3 md:h-3 text-muted-foreground" />}
              </button>

              <AnimatePresence>
              {isExpanded && !isSingleSection && (
                <motion.div
                  className="w-full space-y-1 mt-2 pb-16"
                  initial="hidden" animate="show" exit="hidden"
                  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
                >
                  {category.sections.map((section) => {
                    if ((section as any).isGroupLabel) {
                      return (
                        <motion.div key={section.id} className="pt-2 pb-0.5 px-1"
                          variants={{ hidden: { x: -10, opacity: 0 }, show: { x: 0, opacity: 1 } }}>
                          <span className="text-[5px] sm:text-[6px] uppercase tracking-widest text-accent/60 font-bold text-center block">
                            {section.title}
                          </span>
                          <div className="h-px bg-accent/20 mt-0.5" />
                        </motion.div>
                      );
                    }
                    const SectionIcon = section.icon;
                    const isActive = expandedSection === section.id;
                    const isPinned = pinnedSections.includes(section.id);
                    return (
                      <motion.div key={section.id}
                        variants={{ hidden: { x: -10, opacity: 0 }, show: { x: 0, opacity: 1 } }}>
                        <button
                          onClick={() => handleSectionToggle(section.id)}
                          className={`group relative w-full rounded-lg flex flex-col items-center justify-center py-1.5 md:py-2 px-1 transition-all ${
                            isActive ? 'bg-accent text-accent-foreground shadow-md' : 'hover:bg-accent/10'
                          }`}
                        >
                          <SectionIcon className={`w-4 h-4 md:w-5 md:h-5 mb-0.5 md:mb-1 ${isActive ? 'text-accent-foreground' : ''}`} />
                          <span className={`text-[5px] sm:text-[6px] leading-tight text-center px-0.5 font-medium uppercase tracking-tight ${isActive ? 'text-accent-foreground' : 'text-muted-foreground'}`}>
                            {section.title.split(' ').map((word, i) => <span key={i} className="block">{word}</span>)}
                          </span>
                          <span
                            role="button"
                            onClick={(e) => { e.stopPropagation(); togglePin(section.id); }}
                            className={`absolute -top-0.5 -right-0.5 p-0.5 rounded-full transition-all ${isPinned ? 'opacity-100 text-accent' : 'opacity-0 group-hover:opacity-60 text-muted-foreground hover:text-accent'}`}
                            title={isPinned ? 'Unpin section' : 'Pin section'}
                          >
                            <Star className={`w-2.5 h-2.5 ${isPinned ? 'fill-primary' : ''}`} />
                          </span>
                        </button>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
              </AnimatePresence>
              
              {index < filteredCategories.length - 1 && (
                <div className="w-full px-2 py-2">
                  <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Main Content Area */}
      <main className={`flex-1 overflow-y-auto scrollbar-thin relative z-10 transition-all duration-300 pt-20 ${
        sidebarCollapsed ? 'ml-0' : 'ml-14 md:ml-24'
      } ${isMobile ? 'pb-[60px]' : ''}`}>
        {expandedSection ? (
          <div className="container mx-auto px-3 md:px-6 py-4 md:py-6">
            {/* Breadcrumb */}
            {(() => {
              const parentCat = categories.find(c => c.sections.some(s => s.id === expandedSection && !(s as any).isGroupLabel));
              const activeSection = parentCat?.sections.find(s => s.id === expandedSection && !(s as any).isGroupLabel);
              if (parentCat && activeSection) {
                return (
                  <StaffBreadcrumb
                    categoryTitle={parentCat.title}
                    categoryIcon={parentCat.icon}
                    sectionTitle={activeSection.title}
                    onCategoryClick={() => {
                      setExpandedCategory(parentCat.id);
                      setExpandedSection(null);
                      setSearchParams({});
                    }}
                  />
                );
              }
              return null;
            })()}
            <Card className="animate-in fade-in slide-in-from-top-4 duration-300">
              <CardContent className="pt-6">
                {expandedSection === 'overview' && <StaffOverview isAdmin={isAdmin} userId={user?.id} isMarketeer={isMarketeer} />}
                {expandedSection === 'schedule' && (
                  <div className="space-y-6">
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold mb-2">Staff Availability</h3>
                      <p className="text-sm text-muted-foreground">Manage your availability hours and view the team schedule</p>
                    </div>
                    <StaffAvailabilityManagement isAdmin={isAdmin} />
                  </div>
                )}
                {expandedSection === 'meetings' && <Meetings />}
                {expandedSection === 'videocompressor' && <VideoCompressor />}
                {expandedSection === 'visionboard' && <VisionBoardSection />}
                {expandedSection === 'focusedtasks' && <FocusedTasksSection />}
                {expandedSection === 'staffschedules' && <StaffSchedulesManagement />}
                {expandedSection === 'docs' && <DocsSection />}
                {expandedSection === 'sheets' && <SheetsSection />}
                {expandedSection === 'designstudio' && <DesignStudio />}
                <div className={expandedSection === 'annotations' ? '' : 'hidden'}><AnnotationProjects /></div>
                <div className={expandedSection === 'videoanalysis' ? '' : 'hidden'}><VideoAnalysis /></div>
                {expandedSection === 'streams' && <StreamsManagement />}
                {expandedSection === 'playerlist' && <PlayerList isAdmin={isAdmin} />}
                <div className={expandedSection === 'players' ? '' : 'hidden'}><PlayerManagement isAdmin={isAdmin} /></div>
                {expandedSection === 'recruitment' && <RecruitmentManagement isAdmin={isAdmin} />}
                {expandedSection === 'playerdatabase' && <PlayerDatabaseManagement isAdmin={isAdmin} />}
                {expandedSection === 'scoutingcentre' && <ScoutingCentreManagement isAdmin={isAdmin} />}
                {expandedSection === 'coaching' && <CoachingDatabase isAdmin={isAdmin} />}
                {expandedSection === 'coachingchat' && <CoachingAIChat />}
                {expandedSection === 'serviceaudit' && <ServiceAudit />}
                {expandedSection === 'nutrition' && <NutritionSection />}
                {expandedSection === 'sps' && <StrengthPowerSpeedSection />}
                {expandedSection === 'coachingdata' && <CoachingDataSection />}
                {expandedSection === 'videodownloader' && <VideoDownloaderSection />}
                <div className={expandedSection === 'analysis' ? '' : 'hidden'}><AnalysisManagement isAdmin={isAdmin} currentUserId={user?.id} isAnalystOnly={isAnalystOnly} /></div>
                {expandedSection === 'athletecentre' && <AthleteCentre />}
                {expandedSection === 'tacticsboard' && <TacticsBoard />}
                {expandedSection === 'highlightmaker' && <HighlightMaker isAdmin={isAdmin} />}
                {expandedSection === 'highlightcompiler' && <HighlightCompiler />}
                {expandedSection === 'sportscodeactions' && <SportscodeActionTypes />}
                {expandedSection === 'recruitmentrules' && <RecruitmentRulesTab isAdmin={isAdmin} />}
                
                {expandedSection === 'transferhub' && <TransferHub isAdmin={isAdmin} />}
                {expandedSection === 'updates' && <UpdatesManagement isAdmin={isAdmin} />}
                {expandedSection === 'requests' && <RequestsManagement />}
                {expandedSection === 'marketing' && <MarketingManagement isAdmin={isAdmin} isMarketeer={isMarketeer} />}
                {expandedSection === 'contentcreator' && <ContentCreator />}
                {expandedSection === 'publiccontent' && <PublicContentManagement />}
                {expandedSection === 'salesdeck' && <SalesDeck />}
                {expandedSection === 'marketingideas' && <MarketingIdeas />}
                {expandedSection === 'marketingtips' && <MarketingTipsManagement isAdmin={isAdmin} />}
                {expandedSection === 'casestudies' && <CaseStudyManagement />}
                {expandedSection === 'blog' && <BlogManagement isAdmin={isAdmin} />}
                {expandedSection === 'dailyfuel' && <DailyFuelManagement isAdmin={isAdmin} />}
                {expandedSection === 'pressreleases' && <PressReleasesManagement isAdmin={isAdmin} />}
                {expandedSection === 'submissions' && <FormSubmissionsManagement isAdmin={isAdmin} />}
                {expandedSection === 'visitors' && <SiteVisitorsManagement isAdmin={isAdmin} />}
                {expandedSection === 'clubnetwork' && <ClubNetworkManagement />}
                {expandedSection === 'invoices' && <InvoiceManagement isAdmin={isAdmin} />}
                {expandedSection === 'payments' && <PaymentsManagement isAdmin={isAdmin} />}
                {expandedSection === 'expenses' && <ExpensesManagement isAdmin={isAdmin} />}
                {expandedSection === 'taxrecords' && <TaxRecordsManagement isAdmin={isAdmin} />}
                {expandedSection === 'budgets' && <BudgetsManagement isAdmin={isAdmin} />}
                {expandedSection === 'financialreports' && <FinancialReports isAdmin={isAdmin} />}
                {expandedSection === 'sales' && <SalesManagement isAdmin={isAdmin} />}
                {expandedSection === 'catalogue' && (
                  <div className="space-y-6">
                    <ServiceCatalogManagement isAdmin={isAdmin} />
                    <ServiceStatsManager />
                  </div>
                )}
                {expandedSection === 'shopcatalogue' && <ShopCatalogManagement isAdmin={isAdmin} />}
                {expandedSection === 'salestracker' && <SalesTracker />}
                {expandedSection === 'retention' && <RetentionTracker />}
                {expandedSection === 'outreach' && <OutreachTracker />}
                {expandedSection === 'saleshub' && <SalesHub />}
                {expandedSection === 'portalmanagement' && <PortalManagementAdmin />}
                {expandedSection === 'legal' && <LegalManagement isAdmin={isAdmin} />}
                {expandedSection === 'contracts' && <ContractSignature />}
                {expandedSection === 'partners' && <PartnersManagement isAdmin={isAdmin} />}
                {expandedSection === 'jobs' && <JobsManagement isAdmin={isAdmin} />}
                {expandedSection === 'sitetext' && <SiteTextManagement isAdmin={isAdmin} />}
                {expandedSection === 'languages' && <LanguagesManagement isAdmin={isAdmin} />}
                {expandedSection === 'notifications' && <NotificationSettingsManagement />}
                {expandedSection === 'sms' && <StaffSMSNotifications userEmail={user?.email} />}
                {expandedSection === 'passwords' && isAdmin && <PlayerPasswordManagement />}
                {expandedSection === 'staffaccounts' && isAdmin && <StaffAccountManagement />}
                {expandedSection === 'activitylog' && isAdmin && <ActivityLog />}
                {expandedSection === 'dataexport' && isAdmin && <DatabaseExport />}
                {expandedSection === 'pwainstall' && <StaffPWAInstall />}
                {expandedSection === 'offlinemanager' && <StaffOfflineManager />}
                {expandedSection === 'pushnotifications' && <StaffPushNotifications />}
                {expandedSection === 'timemanagement' && <TimeManagement />}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <p className="text-lg mb-2">Select a section from the sidebar</p>
              <p className="text-sm">or use the search bar to find what you need</p>
            </div>
          </div>
        )}
      </main>

      {/* Search Bar - Bottom */}
      <div className={`border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${isMobile ? 'fixed bottom-0 left-0 right-0' : 'sticky bottom-0'} z-10 relative`}>
        <div className="container mx-auto px-3 md:px-4 py-3">
          <div className="flex items-center justify-between gap-2 md:gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-4 overflow-y-auto scrollbar-thin">
                <div className="space-y-6">
                  {filteredCategories.map((category) => (
                    <div key={category.id} className="space-y-2">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2">{category.title}</h3>
                      <div className="space-y-1">
                        {category.sections.map((section) => {
                          if ((section as any).isGroupLabel) {
                            return <p key={section.id} className="text-[10px] font-bold uppercase tracking-wider text-accent/60 px-2 pt-2">{section.title}</p>;
                          }
                          const Icon = section.icon;
                          return (
                            <Button key={section.id} variant={expandedSection === section.id ? "default" : "ghost"} className="w-full justify-start text-sm h-10" onClick={() => handleSectionToggle(section.id)}>
                              <Icon className="w-4 h-4 mr-2 shrink-0" /><span className="truncate">{section.title}</span>
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
            
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search sections..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm" className="shrink-0 md:hidden">
              Logout
            </Button>
            <button onClick={() => setShortcutsOpen(true)} className="hidden md:flex text-xs text-muted-foreground hover:text-foreground transition-colors" title="Keyboard shortcuts">
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-muted border rounded">?</kbd>
            </button>
          </div>
        </div>
      </div>
      <MobileScrollButtons />
      <ExportProgressFloat />
    </div>
  );
};

export default Staff;
