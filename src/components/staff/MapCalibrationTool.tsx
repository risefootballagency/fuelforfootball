import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sharedSupabase as supabase } from "@/integrations/supabase/sharedClient";
import { toast } from "sonner";
import { MapPin, Wand2, CheckCircle2, AlertCircle, RefreshCw, RotateCcw } from "lucide-react";
import { getClubCoordinates, getCountryCenter } from "@/lib/europeanCityCoordinates";
import { hardcodedClubPositions, getHardcodedPosition } from "@/lib/hardcodedClubPositions";

interface MapClub { id: string; club_name: string; country: string | null; x_position: number | null; y_position: number | null; latitude: number | null; longitude: number | null; is_calibration_point: boolean; }
interface CalibrationPoint { lat: number; lng: number; x: number; y: number; }
interface MapCalibrationToolProps { clubs: MapClub[]; onRefresh: () => void; selectedCountry: string; }

export const MapCalibrationTool = ({ clubs, onRefresh, selectedCountry }: MapCalibrationToolProps) => {
  const [calibrating, setCalibrating] = useState(false);
  const [populatingCoords, setPopulatingCoords] = useState(false);
  const [resettingPositions, setResettingPositions] = useState(false);

  const handleResetToHardcoded = async () => {
    setResettingPositions(true);
    try {
      let updated = 0, notFound = 0;
      for (const club of clubs) {
        if (club.is_calibration_point) continue;
        const hardcoded = getHardcodedPosition(club.club_name);
        if (hardcoded) { const { error } = await supabase.from("club_map_positions").update({ x_position: hardcoded.x, y_position: hardcoded.y }).eq("id", club.id); if (!error) updated++; } else { notFound++; }
      }
      toast.success(notFound > 0 ? `Reset ${updated} clubs (${notFound} not found)` : `Reset ${updated} clubs`); onRefresh();
    } catch (error) { console.error("Error resetting positions:", error); toast.error("Failed to reset positions"); } finally { setResettingPositions(false); }
  };

  const calibrationStats = useMemo(() => {
    const stats: Record<string, { total: number; calibrated: number; withLatLng: number }> = {};
    clubs.forEach(club => {
      const country = club.country || "Unknown"; if (!stats[country]) stats[country] = { total: 0, calibrated: 0, withLatLng: 0 };
      stats[country].total++; if (club.is_calibration_point && club.x_position && club.y_position) stats[country].calibrated++; if (club.latitude && club.longitude) stats[country].withLatLng++;
    });
    return stats;
  }, [clubs]);

  const countryClubs = useMemo(() => selectedCountry === "all" ? clubs : clubs.filter(c => c.country === selectedCountry), [clubs, selectedCountry]);
  const allCalibrationPoints = useMemo(() => clubs.filter(c => c.is_calibration_point && c.x_position !== null && c.y_position !== null && c.latitude !== null && c.longitude !== null), [clubs]);
  const calibrationPoints = useMemo(() => countryClubs.filter(c => c.is_calibration_point && c.x_position !== null && c.y_position !== null && c.latitude !== null && c.longitude !== null), [countryClubs]);

  const handlePopulateCoordinates = async () => {
    const clubsToUpdate = clubs.filter((c) => c.latitude == null || c.longitude == null);
    if (clubsToUpdate.length === 0) { toast.info("All clubs already have coordinates"); return; }
    setPopulatingCoords(true);
    try {
      let updated = 0, usedFallback = 0;
      for (const club of clubsToUpdate) {
        let coords = getClubCoordinates(club.club_name, club.country || ""); let usedCountryFallback = false;
        if (!coords && club.country) { const countryCenter = getCountryCenter(club.country); if (countryCenter) { coords = countryCenter; usedCountryFallback = true; } }
        if (coords) { const { error } = await supabase.from("club_map_positions").update({ latitude: coords.lat, longitude: coords.lng }).eq("id", club.id); if (!error) { updated++; if (usedCountryFallback) usedFallback++; } }
      }
      toast.success(usedFallback > 0 ? `Updated ${updated} clubs (${usedFallback} via fallback)` : `Updated ${updated} clubs`); onRefresh();
    } catch (error) { console.error("Error populating coordinates:", error); toast.error("Failed to populate coordinates"); } finally { setPopulatingCoords(false); }
  };

  const calculateTransformation = (points: CalibrationPoint[]) => {
    if (points.length < 2) return null;
    const lngs = points.map((p) => p.lng), lats = points.map((p) => p.lat), xs = points.map((p) => p.x), ys = points.map((p) => p.y);
    const linearFit = (input: number[], output: number[]) => {
      const n = input.length, meanIn = input.reduce((s, v) => s + v, 0) / n, meanOut = output.reduce((s, v) => s + v, 0) / n;
      let num = 0, den = 0; for (let i = 0; i < n; i++) { const di = input[i] - meanIn; num += di * (output[i] - meanOut); den += di * di; }
      if (Math.abs(den) < 1e-6) return null; const slope = num / den; return { slope, intercept: meanOut - slope * meanIn };
    };
    const xFit = linearFit(lngs, xs), yFit = linearFit(lats, ys); if (!xFit || !yFit) return null;
    return { transform: (lat: number, lng: number) => ({ x: xFit.slope * lng + xFit.intercept, y: yFit.slope * lat + yFit.intercept }) };
  };

  const calibrateCountry = async (countryName: string, countryClubsList: MapClub[]) => {
    const countryCalibrationPoints = countryClubsList.filter(c => c.is_calibration_point && c.x_position !== null && c.y_position !== null && c.latitude !== null && c.longitude !== null);
    if (countryCalibrationPoints.length < 3) return { updated: 0, skipped: true };
    const points: CalibrationPoint[] = countryCalibrationPoints.map(c => ({ lat: c.latitude!, lng: c.longitude!, x: c.x_position!, y: c.y_position! }));
    const transformation = calculateTransformation(points); if (!transformation) return { updated: 0, skipped: true };
    const countryUncalibratedClubs = countryClubsList.filter(c => !c.is_calibration_point && c.latitude !== null && c.longitude !== null);
    let updated = 0;
    for (const club of countryUncalibratedClubs) {
      if (club.latitude && club.longitude) {
        const { x, y } = transformation.transform(club.latitude, club.longitude);
        const { error } = await supabase.from("club_map_positions").update({ x_position: Math.round((x + (Math.random() - 0.5) * 8) * 10) / 10, y_position: Math.round((y + (Math.random() - 0.5) * 8) * 10) / 10 }).eq("id", club.id);
        if (!error) updated++;
      }
    }
    return { updated, skipped: false };
  };

  const handleApplyGlobalCalibration = async () => {
    if (allCalibrationPoints.length < 3) { toast.error("Need at least 3 calibration points."); return; }
    setCalibrating(true);
    try {
      const calPoints = allCalibrationPoints.map((c) => ({ lat: c.latitude!, lng: c.longitude!, x: c.x_position!, y: c.y_position! }));
      const transformation = calculateTransformation(calPoints); if (!transformation) { toast.error("Failed to calculate transformation"); return; }
      const xValues = calPoints.map((p) => p.x), yValues = calPoints.map((p) => p.y);
      const minX = Math.min(...xValues), maxX = Math.max(...xValues), minY = Math.min(...yValues), maxY = Math.max(...yValues);
      const xRange = maxX - minX || 1, yRange = maxY - minY || 1, padX = Math.max(30, xRange * 0.3), padY = Math.max(30, yRange * 0.3);
      const boundMinX = minX - padX, boundMaxX = maxX + padX, boundMinY = minY - padY, boundMaxY = maxY + padY;
      const uncalibrated = clubs.filter((c) => !c.is_calibration_point && c.latitude !== null && c.longitude !== null);
      let updated = 0;
      for (const club of uncalibrated) {
        if (club.latitude != null && club.longitude != null) {
          const { x, y } = transformation.transform(club.latitude, club.longitude);
          const clampedX = Math.max(boundMinX, Math.min(boundMaxX, x)), clampedY = Math.max(boundMinY, Math.min(boundMaxY, y));
          const { error } = await supabase.from("club_map_positions").update({ x_position: Math.round((clampedX + (Math.random() - 0.5) * 8) * 10) / 10, y_position: Math.round((clampedY + (Math.random() - 0.5) * 8) * 10) / 10 }).eq("id", club.id);
          if (!error) updated++;
        }
      }
      toast.success(`Calibrated ${updated} clubs`); onRefresh();
    } catch (error) { console.error("Error applying calibration:", error); toast.error("Failed to apply calibration"); } finally { setCalibrating(false); }
  };

  const currentStats = selectedCountry === "all" ? Object.values(calibrationStats).reduce((acc, s) => ({ total: acc.total + s.total, calibrated: acc.calibrated + s.calibrated, withLatLng: acc.withLatLng + s.withLatLng }), { total: 0, calibrated: 0, withLatLng: 0 }) : calibrationStats[selectedCountry] || { total: 0, calibrated: 0, withLatLng: 0 };

  return (
    <Card>
      <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Wand2 className="h-4 w-4" />Geo-Calibration Tool</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2"><Badge variant="outline" className="gap-1"><MapPin className="h-3 w-3" />{currentStats.total} clubs</Badge><Badge variant={currentStats.calibrated >= 3 ? "default" : "secondary"} className="gap-1"><CheckCircle2 className="h-3 w-3" />{currentStats.calibrated} calibration points</Badge><Badge variant={currentStats.withLatLng > 0 ? "outline" : "destructive"} className="gap-1">{currentStats.withLatLng} with coordinates</Badge></div>
        <div className="text-sm text-muted-foreground space-y-1"><p><strong>How to position clubs on the map:</strong></p><ol className="list-decimal list-inside space-y-1 text-xs"><li>Click "Reset to Hardcoded" to snap known clubs to the artwork positions</li><li>Drag any remaining logos to their correct place on the map</li><li>Optionally mark those clubs as calibration points so they stay fixed</li></ol></div>
        <div className="flex flex-wrap gap-2"><Button variant="default" size="sm" onClick={handleResetToHardcoded} disabled={resettingPositions}><RotateCcw className={`h-3 w-3 mr-1 ${resettingPositions ? 'animate-spin' : ''}`} />Reset to Hardcoded</Button><Button variant="outline" size="sm" onClick={handlePopulateCoordinates} disabled={populatingCoords}><RefreshCw className={`h-3 w-3 mr-1 ${populatingCoords ? 'animate-spin' : ''}`} />Populate Coordinates</Button></div>
        {allCalibrationPoints.length > 0 && <div className="text-xs"><p className="font-medium mb-1">Calibration points ({allCalibrationPoints.length}):</p><div className="flex flex-wrap gap-1">{allCalibrationPoints.map(c => <Badge key={c.id} variant="secondary" className="text-xs">{c.club_name}</Badge>)}</div></div>}
        {allCalibrationPoints.length < 3 && <div className="flex items-start gap-2 text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/30 p-2 rounded"><AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" /><span>Need at least 3 calibration points. Position clubs on the map, save, then mark them as calibration points.</span></div>}
      </CardContent>
    </Card>
  );
};
