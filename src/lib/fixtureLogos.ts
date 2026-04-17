/**
 * Fetches a map of YYYY-MM-DD date → opposition club logo URL,
 * using pre-match analyses linked to fixtures.
 *
 * Player's club is provided so we can pick the *opposition* side's logo
 * (the one that ISN'T the player's club).
 */
import { sharedSupabase } from "@/integrations/supabase/sharedClient";

export interface FixtureLogoEntry {
  fixtureId: string;
  oppositionLogo: string | null;
  oppositionTeam: string;
  homeTeam: string;
  awayTeam: string;
  matchDate: string;
}

const normalise = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

export const fetchFixtureLogosByDate = async (
  playerId: string | null | undefined,
  playerClub: string | null | undefined,
): Promise<Map<string, FixtureLogoEntry>> => {
  const map = new Map<string, FixtureLogoEntry>();
  if (!playerClub) return map;

  // Step 1: collect fixture ids relevant to the player.
  let fixtureIds: string[] = [];
  if (playerId) {
    const { data: pf } = await sharedSupabase
      .from("player_fixtures" as any)
      .select("fixture_id")
      .eq("player_id", playerId);
    fixtureIds = (pf as any[] | null)?.map((r) => r.fixture_id).filter(Boolean) || [];
  }

  // Fallback: query fixtures by club name match
  let fixtures: any[] = [];
  if (fixtureIds.length > 0) {
    const { data } = await sharedSupabase
      .from("fixtures")
      .select("id, match_date, home_team, away_team")
      .in("id", fixtureIds);
    fixtures = data || [];
  } else {
    const { data } = await sharedSupabase
      .from("fixtures")
      .select("id, match_date, home_team, away_team")
      .or(`home_team.ilike.%${playerClub}%,away_team.ilike.%${playerClub}%`);
    fixtures = data || [];
  }

  if (fixtures.length === 0) return map;

  // Step 2: pre-match analyses for those fixtures
  const { data: analyses } = await sharedSupabase
    .from("analyses")
    .select("fixture_id, home_team, away_team, home_team_logo, away_team_logo")
    .in("fixture_id", fixtures.map((f) => f.id))
    .eq("analysis_type", "pre-match");

  const analysisByFixture = new Map<string, any>();
  (analyses || []).forEach((a: any) => {
    if (a.fixture_id) analysisByFixture.set(a.fixture_id, a);
  });

  const playerClubKey = normalise(playerClub);

  for (const fix of fixtures) {
    const analysis = analysisByFixture.get(fix.id);
    if (!analysis) continue;
    const homeKey = normalise(analysis.home_team || fix.home_team || "");
    const awayKey = normalise(analysis.away_team || fix.away_team || "");
    let oppositionLogo: string | null = null;
    let oppositionTeam = "";
    if (homeKey.includes(playerClubKey) || playerClubKey.includes(homeKey)) {
      oppositionLogo = analysis.away_team_logo || null;
      oppositionTeam = analysis.away_team || fix.away_team || "";
    } else {
      oppositionLogo = analysis.home_team_logo || null;
      oppositionTeam = analysis.home_team || fix.home_team || "";
    }
    if (!oppositionLogo) continue;
    const dateKey = String(fix.match_date).slice(0, 10);
    map.set(dateKey, {
      fixtureId: fix.id,
      oppositionLogo,
      oppositionTeam,
      homeTeam: analysis.home_team || fix.home_team || "",
      awayTeam: analysis.away_team || fix.away_team || "",
      matchDate: fix.match_date,
    });
  }

  return map;
};
