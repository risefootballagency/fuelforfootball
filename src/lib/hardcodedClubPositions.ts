export interface HardcodedClubPosition { name: string; country: string; x: number; y: number; }

export const hardcodedClubPositions: HardcodedClubPosition[] = [
  { name: "Arsenal FC", country: "England", x: 335, y: 385 }, { name: "Chelsea FC", country: "England", x: 332, y: 386 },
  { name: "Liverpool FC", country: "England", x: 312, y: 365 }, { name: "Manchester United", country: "England", x: 317, y: 364 },
  { name: "Paris Saint-Germain", country: "France", x: 358, y: 420 }, { name: "Olympique Marseille", country: "France", x: 378, y: 495 },
  { name: "Bayern Munich", country: "Germany", x: 435, y: 425 }, { name: "Borussia Dortmund", country: "Germany", x: 405, y: 375 },
  { name: "Real Madrid", country: "Spain", x: 310, y: 520 }, { name: "FC Barcelona", country: "Spain", x: 360, y: 515 },
  { name: "AC Milan", country: "Italy", x: 446, y: 456 }, { name: "Juventus FC", country: "Italy", x: 405, y: 455 },
  { name: "Ajax Amsterdam", country: "Netherlands", x: 378, y: 355 }, { name: "SL Benfica", country: "Portugal", x: 235, y: 536 }
];

export const hardcodedPositionsMap = new Map<string, HardcodedClubPosition>();
hardcodedClubPositions.forEach((club) => { hardcodedPositionsMap.set(club.name, club); });

export function getHardcodedPosition(clubName: string): { x: number; y: number } | null {
  const club = hardcodedPositionsMap.get(clubName);
  return club ? { x: club.x, y: club.y } : null;
}
