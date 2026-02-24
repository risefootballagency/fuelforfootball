import { useState, useEffect, useMemo } from 'react';
import { sharedSupabase as supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { calculateAge, calculatePreciseAge, getEligibleDate } from '@/lib/ageUtils';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { FaInstagram } from 'react-icons/fa';
import { Plus, Edit, CheckCircle2, HelpCircle, Clock, Star, Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronDown, ChevronRight } from 'lucide-react';
import { getCountryFlagUrl } from '@/lib/countryFlags';
import { TableSettingsPopover, useTableSettings, type ColumnConfig } from './TableSettingsPopover';
import { findClubCountry, findClubRating as findClubRatingUtil } from '@/lib/clubNameUtils';
import { useHorizontalDragScroll } from '@/hooks/useHorizontalDragScroll';
import { useResizableColumns } from '@/hooks/useResizableColumns';

interface Props { type: 'youth' | 'pro'; }
interface AgeRule { country: string; country_code: string; min_contact_age: number | null; }
interface ClubRating { club_name: string; first_team_rating: string; academy_rating: string; }

const ClubRatingBadge = ({ rating }: { rating: string | null }) => {
  if (!rating) return null;
  const colorMap: Record<string, string> = { 'R1': 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30', 'R2': 'bg-green-500/20 text-green-600 border-green-500/30', 'R3': 'bg-amber-500/20 text-amber-600 border-amber-500/30', 'R4': 'bg-orange-500/20 text-orange-600 border-orange-500/30', 'R5': 'bg-red-500/20 text-red-600 border-red-500/30', };
  return <Badge variant="outline" className={`text-[10px] px-1 py-0 ml-1 ${colorMap[rating] || ''}`}>{rating}</Badge>;
};

const IgTooltipIcon = ({ handle }: { handle: string | null }) => {
  if (!handle || !handle.replace(/^@/, '').trim()) return null;
  const clean = handle.replace(/^@/, '').trim();
  return <TooltipProvider><Tooltip><TooltipTrigger asChild><button onClick={(e) => { e.stopPropagation(); window.open(`https://instagram.com/${clean}`, '_blank', 'noopener,noreferrer'); }} className="p-0.5 hover:scale-110 transition-transform"><FaInstagram className="h-4 w-4 text-[#E1306C]" /></button></TooltipTrigger><TooltipContent><p>@{clean}</p></TooltipContent></Tooltip></TooltipProvider>;
};

const ClubDisplay = ({ clubName, clubCountryMap, ageRules, clubRatings, isYouth }: { clubName: string | null; clubCountryMap: Record<string, string>; ageRules: AgeRule[]; clubRatings: ClubRating[]; isYouth: boolean; }) => {
  if (!clubName) return <span className="text-muted-foreground">-</span>;
  const clubCountry = findClubCountry(clubName, clubCountryMap);
  const rule = clubCountry ? ageRules.find(r => r.country.toLowerCase() === clubCountry.toLowerCase()) : null;
  return <TooltipProvider><Tooltip><TooltipTrigger asChild><span className="inline-flex items-center gap-1.5 flex-wrap">{clubCountry && <img src={getCountryFlagUrl(clubCountry)} alt={clubCountry} className="w-4 h-3 object-cover rounded-sm" />}<span className="truncate">{clubName}</span><ClubRatingBadge rating={findClubRatingUtil(clubName, clubRatings, isYouth)} />{rule?.min_contact_age != null && isYouth && <Badge variant="secondary" className="text-[10px] px-1 py-0">{rule.min_contact_age}</Badge>}</span></TooltipTrigger><TooltipContent><p>{clubName}{clubCountry ? ` (${clubCountry})` : ''}</p></TooltipContent></Tooltip></TooltipProvider>;
};

const EligibilityBadge = ({ item, type, clubCountryMap, ageRules }: { item: any; type: 'youth' | 'pro'; clubCountryMap: Record<string, string>; ageRules: AgeRule[]; }) => {
  if (type === 'pro') return <TooltipProvider><Tooltip><TooltipTrigger asChild><span className="inline-flex items-center"><Star className="h-4 w-4 text-amber-500 fill-amber-500" /></span></TooltipTrigger><TooltipContent><p>Pro player, can be contacted directly</p></TooltipContent></Tooltip></TooltipProvider>;
  if (!item.date_of_birth) return <TooltipProvider><Tooltip><TooltipTrigger asChild><span className="inline-flex items-center"><HelpCircle className="h-4 w-4 text-muted-foreground" /></span></TooltipTrigger><TooltipContent><p>No date of birth set</p></TooltipContent></Tooltip></TooltipProvider>;
  const clubCountry = findClubCountry(item.current_club, clubCountryMap);
  if (!clubCountry) return <TooltipProvider><Tooltip><TooltipTrigger asChild><span className="inline-flex items-center"><HelpCircle className="h-4 w-4 text-muted-foreground" /></span></TooltipTrigger><TooltipContent><p>Club country unknown</p></TooltipContent></Tooltip></TooltipProvider>;
  const rule = ageRules.find(r => r.country.toLowerCase() === clubCountry.toLowerCase());
  if (!rule || rule.min_contact_age === null) return <TooltipProvider><Tooltip><TooltipTrigger asChild><span className="inline-flex items-center"><HelpCircle className="h-4 w-4 text-muted-foreground" /></span></TooltipTrigger><TooltipContent><p>No age rules for {clubCountry}</p></TooltipContent></Tooltip></TooltipProvider>;
  const preciseAge = calculatePreciseAge(item.date_of_birth);
  if (preciseAge === null) return <HelpCircle className="h-4 w-4 text-muted-foreground" />;
  if (preciseAge >= rule.min_contact_age) return <TooltipProvider><Tooltip><TooltipTrigger asChild><span className="inline-flex items-center"><CheckCircle2 className="h-4 w-4 text-emerald-500" /></span></TooltipTrigger><TooltipContent><p>Eligible to contact (parent) in {clubCountry}</p></TooltipContent></Tooltip></TooltipProvider>;
  const eligibleDate = getEligibleDate(item.date_of_birth, rule.min_contact_age);
  return <TooltipProvider><Tooltip><TooltipTrigger asChild><span className="inline-flex items-center gap-1 text-[10px] text-amber-600"><Clock className="h-3.5 w-3.5" />{eligibleDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}</span></TooltipTrigger><TooltipContent><p>Can contact parent from {eligibleDate.toLocaleDateString('en-GB')} ({clubCountry}: min age {rule.min_contact_age})</p></TooltipContent></Tooltip></TooltipProvider>;
};

type SortField = 'player_name' | 'age' | 'current_club' | 'nationality' | 'date_of_birth';
const YOUTH_COLUMNS: ColumnConfig[] = [{ key: 'eligibility', label: 'Eligibility', defaultVisible: true }, { key: 'name', label: 'Name', defaultVisible: true }, { key: 'ig', label: 'Instagram', defaultVisible: true }, { key: 'nationality', label: 'Nationality', defaultVisible: true }, { key: 'position', label: 'Position', defaultVisible: true }, { key: 'age', label: 'Age', defaultVisible: true }, { key: 'dob', label: 'DOB', defaultVisible: true }, { key: 'club', label: 'Club', defaultVisible: true }, { key: 'parent', label: 'Parent', defaultVisible: true }, { key: 'parent_ig', label: 'Parent IG', defaultVisible: true }, { key: 'approval', label: 'Approval', defaultVisible: true }, { key: 'messaged', label: 'Messaged', defaultVisible: true }, { key: 'response', label: 'Response', defaultVisible: true }, { key: 'notes', label: 'Notes', defaultVisible: false }];
const PRO_COLUMNS: ColumnConfig[] = [{ key: 'eligibility', label: 'Eligibility', defaultVisible: true }, { key: 'name', label: 'Name', defaultVisible: true }, { key: 'ig', label: 'Instagram', defaultVisible: true }, { key: 'nationality', label: 'Nationality', defaultVisible: true }, { key: 'position', label: 'Position', defaultVisible: true }, { key: 'age', label: 'Age', defaultVisible: true }, { key: 'dob', label: 'DOB', defaultVisible: true }, { key: 'club', label: 'Club', defaultVisible: true }, { key: 'messaged', label: 'Messaged', defaultVisible: true }, { key: 'response', label: 'Response', defaultVisible: true }, { key: 'notes', label: 'Notes', defaultVisible: false }];

export const PlayerOutreachPanel = ({ type }: Props) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [ageRules, setAgeRules] = useState<AgeRule[]>([]);
  const [clubCountryMap, setClubCountryMap] = useState<Record<string, string>>({});
  const [clubRatings, setClubRatings] = useState<ClubRating[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<any>(null);
  const [detailEditMode, setDetailEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('player_name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({ notMessaged: true, noResponse: true, responded: true });
  const [ageFilter, setAgeFilter] = useState<string>('all');
  const [nationFilter, setNationFilter] = useState<string>('all');
  const [positionFilter, setPositionFilter] = useState<string[]>([]);
  const [dobFrom, setDobFrom] = useState('');
  const [dobTo, setDobTo] = useState('');

  const columns = type === 'youth' ? YOUTH_COLUMNS : PRO_COLUMNS;
  const settings = useTableSettings(`outreach-panel-${type}`, columns);
  const dragScrollRef = useHorizontalDragScroll();
  const { getHeaderProps, ResizeHandle } = useResizableColumns(`outreach-panel-${type}`);
  const isYouth = type === 'youth';
  const emptyForm = { player_name: '', ig_handle: '', current_club: '', date_of_birth: '', position: '', nationality: '', parents_name: '', parent_contact: '', parent_approval: false, messaged: false, response_received: false, initial_message: '', notes: '' };
  const [formData, setFormData] = useState<any>(emptyForm);

  useEffect(() => { fetchData(); }, [type]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const tableName = isYouth ? 'player_outreach_youth' : 'player_outreach_pro';
      const [dataResult, rulesResult, clubsResult, ratingsResult] = await Promise.all([
        supabase.from(tableName).select('*').order('created_at', { ascending: false }),
        supabase.from('recruitment_age_rules').select('country, country_code, min_contact_age'),
        supabase.from('club_map_positions').select('club_name, country'),
        supabase.from('club_ratings').select('club_name, first_team_rating, academy_rating')
      ]);
      const countryMap: Record<string, string> = {}; clubsResult.data?.forEach(club => { if (club.club_name && club.country) countryMap[club.club_name.toLowerCase()] = club.country; });
      let outreachData = dataResult.data || [];
      setAgeRules(rulesResult.data || []); setClubCountryMap(countryMap); setClubRatings(ratingsResult.data || []);
      if (isYouth) {
        const toMove = outreachData.filter(item => { if (!item.date_of_birth) return false; const age = calculateAge(item.date_of_birth); return age !== null && age >= 18; });
        if (toMove.length > 0) {
          for (const item of toMove) { await supabase.from('player_outreach_pro').insert({ player_name: item.player_name, ig_handle: item.ig_handle, current_club: item.current_club, date_of_birth: item.date_of_birth, messaged: item.messaged, response_received: item.response_received, initial_message: item.initial_message, notes: item.notes, age: 18, position: item.position, nationality: item.nationality }); await supabase.from('player_outreach_youth').delete().eq('id', item.id); }
          toast.info(`${toMove.length} player(s) auto-moved to Pro (turned 18)`);
          const { data: refreshed } = await supabase.from('player_outreach_youth').select('*').order('created_at', { ascending: false }); outreachData = refreshed || [];
        }
      }
      setData(outreachData);
    } catch (error) { console.error(`Error fetching ${type} outreach:`, error); toast.error(`Failed to load ${type} outreach data`); } finally { setLoading(false); }
  };

  const uniqueNations = useMemo(() => [...new Set(data.map(d => d.nationality).filter((n): n is string => !!n))].sort(), [data]);
  const uniquePositions = useMemo(() => [...new Set(data.map(d => d.position).filter((p): p is string => !!p))].sort(), [data]);

  const toggleField = async (id: string, field: string, currentValue: boolean) => {
    const tableName = isYouth ? 'player_outreach_youth' : 'player_outreach_pro';
    setData(prev => prev.map(item => item.id === id ? { ...item, [field]: !currentValue } : item));
    try { const { error } = await supabase.from(tableName).update({ [field]: !currentValue }).eq('id', id); if (error) throw error; } catch { setData(prev => prev.map(item => item.id === id ? { ...item, [field]: currentValue } : item)); toast.error('Failed to save'); }
  };

  const handleEdit = (item: any) => { setEditingItem(item); setFormData({ ...item }); setDialogOpen(true); };
  const openDetail = (item: any) => { setDetailItem(item); setDetailEditMode(false); setFormData({ ...item }); setDetailOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); const tableName = isYouth ? 'player_outreach_youth' : 'player_outreach_pro';
    const submitData = { ...formData }; if (submitData.date_of_birth) submitData.age = calculateAge(submitData.date_of_birth);
    try {
      if (editingItem) { const { error } = await supabase.from(tableName).update(submitData).eq('id', editingItem.id); if (error) throw error; toast.success('Entry updated'); }
      else { const { error } = await supabase.from(tableName).insert([submitData]); if (error) throw error; toast.success('Entry added'); }
      setDialogOpen(false); setEditingItem(null); setFormData(emptyForm); fetchData();
    } catch (error: any) { toast.error(error.message || 'Failed to save'); }
  };

  const handleDetailSave = async () => {
    if (!detailItem) return; const tableName = isYouth ? 'player_outreach_youth' : 'player_outreach_pro';
    const submitData = { ...formData }; if (submitData.date_of_birth) submitData.age = calculateAge(submitData.date_of_birth);
    try { const { error } = await supabase.from(tableName).update(submitData).eq('id', detailItem.id); if (error) throw error; toast.success('Updated'); setDetailOpen(false); fetchData(); } catch (error: any) { toast.error(error.message || 'Failed to save'); }
  };

  const handleDelete = async (id: string) => { if (!confirm('Delete this entry?')) return; const tableName = isYouth ? 'player_outreach_youth' : 'player_outreach_pro'; try { const { error } = await supabase.from(tableName).delete().eq('id', id); if (error) throw error; toast.success('Entry deleted'); fetchData(); } catch { toast.error('Failed to delete'); } };
  const handleSort = (field: SortField) => { if (sortField === field) setSortDir(prev => prev === 'asc' ? 'desc' : 'asc'); else { setSortField(field); setSortDir('asc'); } };
  const getSortIcon = (field: SortField) => sortField !== field ? <ArrowUpDown className="h-3 w-3 ml-1 opacity-50" /> : sortDir === 'asc' ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />;

  const sortAndFilter = (items: any[]) => {
    let result = items;
    if (searchQuery) { const q = searchQuery.toLowerCase(); result = result.filter(d => d.player_name?.toLowerCase().includes(q) || d.current_club?.toLowerCase().includes(q) || d.nationality?.toLowerCase().includes(q) || d.position?.toLowerCase().includes(q)); }
    if (ageFilter !== 'all') result = result.filter(d => { const age = d.date_of_birth ? calculateAge(d.date_of_birth) : null; if (!age) return false; switch(ageFilter) { case 'u18': return age < 18; case '18-21': return age >= 18 && age <= 21; case '22-25': return age >= 22 && age <= 25; case '26-30': return age >= 26 && age <= 30; case '30+': return age >= 30; default: return true; } });
    if (nationFilter !== 'all') result = result.filter(d => d.nationality === nationFilter);
    if (positionFilter.length > 0) result = result.filter(d => d.position && positionFilter.includes(d.position));
    if (dobFrom) result = result.filter(d => d.date_of_birth && d.date_of_birth >= dobFrom);
    if (dobTo) result = result.filter(d => d.date_of_birth && d.date_of_birth <= dobTo);
    result = [...result].sort((a, b) => {
      let cmp = 0;
      switch (sortField) { case 'player_name': cmp = (a.player_name || '').localeCompare(b.player_name || ''); break; case 'age': cmp = (calculateAge(a.date_of_birth) ?? 999) - (calculateAge(b.date_of_birth) ?? 999); break; case 'current_club': cmp = (a.current_club || 'ZZZ').localeCompare(b.current_club || 'ZZZ'); break; case 'nationality': cmp = (a.nationality || 'ZZZ').localeCompare(b.nationality || 'ZZZ'); break; case 'date_of_birth': cmp = (a.date_of_birth || '9999').localeCompare(b.date_of_birth || '9999'); break; }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return result;
  };

  const orderedVisibleKeys = settings.columnOrder.filter(k => settings.isVisible(k));
  const renderHeader = (key: string) => {
    switch (key) {
      case 'eligibility': return <TableHead key={key} className="relative w-10" {...getHeaderProps(key)}><ResizeHandle columnKey={key} /></TableHead>;
      case 'name': return <TableHead key={key} className="cursor-pointer relative" onClick={() => handleSort('player_name')} {...getHeaderProps(key)}><div className="flex items-center">Name {getSortIcon('player_name')}</div><ResizeHandle columnKey={key} /></TableHead>;
      case 'ig': return <TableHead key={key} className="relative w-12 text-center" {...getHeaderProps(key)}>IG<ResizeHandle columnKey={key} /></TableHead>;
      case 'nationality': return <TableHead key={key} className="cursor-pointer relative" onClick={() => handleSort('nationality')} {...getHeaderProps(key)}><div className="flex items-center">Nat {getSortIcon('nationality')}</div><ResizeHandle columnKey={key} /></TableHead>;
      case 'position': return <TableHead key={key} className="relative" {...getHeaderProps(key)}>Pos<ResizeHandle columnKey={key} /></TableHead>;
      case 'age': return <TableHead key={key} className="cursor-pointer relative" onClick={() => handleSort('age')} {...getHeaderProps(key)}><div className="flex items-center">Age {getSortIcon('age')}</div><ResizeHandle columnKey={key} /></TableHead>;
      case 'dob': return <TableHead key={key} className="cursor-pointer relative" onClick={() => handleSort('date_of_birth')} {...getHeaderProps(key)}><div className="flex items-center">DOB {getSortIcon('date_of_birth')}</div><ResizeHandle columnKey={key} /></TableHead>;
      case 'club': return <TableHead key={key} className="cursor-pointer relative" onClick={() => handleSort('current_club')} {...getHeaderProps(key)}><div className="flex items-center">Club {getSortIcon('current_club')}</div><ResizeHandle columnKey={key} /></TableHead>;
      case 'parent': return <TableHead key={key} className="relative" {...getHeaderProps(key)}>Parent<ResizeHandle columnKey={key} /></TableHead>;
      case 'parent_ig': return <TableHead key={key} className="relative w-10 text-center" {...getHeaderProps(key)}>P.IG<ResizeHandle columnKey={key} /></TableHead>;
      case 'approval': return <TableHead key={key} className="relative text-center" {...getHeaderProps(key)}>Apr<ResizeHandle columnKey={key} /></TableHead>;
      case 'messaged': return <TableHead key={key} className="relative text-center" {...getHeaderProps(key)}>MSG<ResizeHandle columnKey={key} /></TableHead>;
      case 'response': return <TableHead key={key} className="relative text-center" {...getHeaderProps(key)}>RSP<ResizeHandle columnKey={key} /></TableHead>;
      case 'notes': return <TableHead key={key} className="relative" {...getHeaderProps(key)}>Notes<ResizeHandle columnKey={key} /></TableHead>;
      default: return null;
    }
  };

  const renderCell = (key: string, item: any) => {
    switch (key) {
      case 'eligibility': return <TableCell key={key} className="py-1.5"><EligibilityBadge item={item} type={type} clubCountryMap={clubCountryMap} ageRules={ageRules} /></TableCell>;
      case 'name': return <TableCell key={key} className="bg-muted/30 font-bold py-1.5">{item.player_name}</TableCell>;
      case 'ig': return <TableCell key={key} className="text-center py-1.5"><IgTooltipIcon handle={item.ig_handle} /></TableCell>;
      case 'nationality': return <TableCell key={key} className="py-1.5">{item.nationality ? <TooltipProvider><Tooltip><TooltipTrigger asChild><img src={getCountryFlagUrl(item.nationality)} alt={item.nationality} className="w-5 h-auto rounded-sm" /></TooltipTrigger><TooltipContent><p>{item.nationality}</p></TooltipContent></Tooltip></TooltipProvider> : '-'}</TableCell>;
      case 'position': return <TableCell key={key} className="py-1.5">{item.position ? <Badge variant="outline" className="text-[10px] px-1 py-0">{item.position}</Badge> : '-'}</TableCell>;
      case 'age': return <TableCell key={key} className="py-1.5 text-sm">{calculateAge(item.date_of_birth) ?? '-'}</TableCell>;
      case 'dob': return <TableCell key={key} className="py-1.5 text-xs text-muted-foreground">{item.date_of_birth ? new Date(item.date_of_birth).toLocaleDateString('en-GB') : '-'}</TableCell>;
      case 'club': return <TableCell key={key} className="py-1.5"><ClubDisplay clubName={item.current_club} clubCountryMap={clubCountryMap} ageRules={ageRules} clubRatings={clubRatings} isYouth={isYouth} /></TableCell>;
      case 'parent': return <TableCell key={key} className="py-1.5 text-sm">{item.parents_name || '-'}</TableCell>;
      case 'parent_ig': return <TableCell key={key} className="text-center py-1.5"><IgTooltipIcon handle={item.parent_contact} /></TableCell>;
      case 'approval': return <TableCell key={key} className="text-center py-1.5"><Checkbox checked={item.parent_approval} onCheckedChange={() => toggleField(item.id, 'parent_approval', item.parent_approval)} /></TableCell>;
      case 'messaged': return <TableCell key={key} className="text-center py-1.5"><Checkbox checked={item.messaged} onCheckedChange={() => toggleField(item.id, 'messaged', item.messaged)} /></TableCell>;
      case 'response': return <TableCell key={key} className="text-center py-1.5"><Checkbox checked={item.response_received} onCheckedChange={() => toggleField(item.id, 'response_received', item.response_received)} /></TableCell>;
      case 'notes': return <TableCell key={key} className="py-1.5 text-xs text-muted-foreground max-w-[150px] truncate">{item.notes ? <TooltipProvider><Tooltip><TooltipTrigger asChild><span className="truncate block">{item.notes}</span></TooltipTrigger><TooltipContent><p>{item.notes}</p></TooltipContent></Tooltip></TooltipProvider> : '-'}</TableCell>;
      default: return null;
    }
  };

  if (loading) return <LoadingSpinner size="md" className="py-8" text={`Loading ${type} outreach...`} />;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs text-muted-foreground">{data.length} {type} outreach entries</div>
        <div className="flex items-center gap-1">
          <TableSettingsPopover storageKey={`outreach-panel-${type}`} columns={columns} visibleColumns={settings.visibleColumns} onToggleColumn={settings.toggleColumn} columnOrder={settings.columnOrder} onReorderColumns={settings.setColumnOrder} showViewToggle={false} filters={<div className="space-y-3 pt-2 border-t"><button onClick={clearAllFilters} className="text-xs text-muted-foreground hover:text-foreground w-full text-center py-1 border rounded">Clear All Filters</button></div>} />
          <Button size="sm" variant="outline" onClick={() => { setEditingItem(null); setFormData(emptyForm); setDialogOpen(true); }}><Plus className="w-3.5 h-3.5 mr-1" /> Add</Button>
        </div>
      </div>
      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search name, club, nationality..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 h-9" /></div>
      {['notMessaged', 'noResponse', 'responded'].map(section => {
        const items = section === 'notMessaged' ? data.filter(d => !d.messaged) : section === 'noResponse' ? data.filter(d => d.messaged && !d.response_received) : data.filter(d => d.response_received);
        const sorted = sortAndFilter(items);
        return (
          <Collapsible key={section} open={expandedSections[section]} onOpenChange={() => setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))}>
            <div className="border rounded-lg overflow-hidden mb-4">
              <CollapsibleTrigger asChild><button className="w-full bg-muted/50 px-3 py-2 font-semibold text-sm flex items-center justify-between hover:bg-muted/70 transition-colors"><span>{section === 'notMessaged' ? 'Not Messaged' : section === 'noResponse' ? 'Awaiting Response' : 'Responded'} ({sorted.length})</span>{expandedSections[section] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}</button></CollapsibleTrigger>
              <CollapsibleContent>
                <div ref={dragScrollRef} className="hidden lg:block overflow-x-auto cursor-grab active:cursor-grabbing"><Table className="table-fixed"><TableHeader><TableRow>{orderedVisibleKeys.map(key => renderHeader(key))}<TableHead className="w-10"></TableHead></TableRow></TableHeader><TableBody>{sorted.map(item => <TableRow key={item.id} className="cursor-pointer hover:bg-muted/30" onClick={() => openDetail(item)}>{orderedVisibleKeys.map(key => renderCell(key, item))}<TableCell className="py-1.5"><Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={(e) => { e.stopPropagation(); handleEdit(item); }}><Edit className="h-3 w-3" /></Button></TableCell></TableRow>)}</TableBody></Table></div>
                <div className="lg:hidden">{sorted.map(item => <div key={item.id} className="p-3 border-b last:border-b-0 cursor-pointer hover:bg-muted/20" onClick={() => openDetail(item)}><div className="flex items-center justify-between"><span className="font-semibold text-sm">{item.player_name}</span><Badge variant="outline">{item.position}</Badge></div></div>)}</div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        );
      })}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}><DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>{editingItem ? 'Edit' : 'Add'} {isYouth ? 'Youth' : 'Pro'} Outreach</DialogTitle></DialogHeader><form onSubmit={handleSubmit} className="space-y-4"><Input placeholder="Name" value={formData.player_name} onChange={e => setFormData({ ...formData, player_name: e.target.value })} /><Button type="submit">Save</Button></form></DialogContent></Dialog>
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}><DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>Player Details</DialogTitle></DialogHeader>{detailItem && <div><h3 className="font-bold">{detailItem.player_name}</h3></div>}</DialogContent></Dialog>
    </div>
  );
};
