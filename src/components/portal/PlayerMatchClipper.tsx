// Stub: PlayerMatchClipper — requires player-match-clipper edge function and player_match_videos table
// Full implementation will be ported once those dependencies are created

import { Film } from "lucide-react";

interface PlayerMatchClipperProps {
  playerId: string;
  playerEmail: string;
}

export const PlayerMatchClipper = ({ playerId, playerEmail }: PlayerMatchClipperProps) => {
  return (
    <div className="text-center py-8 text-muted-foreground text-sm">
      <Film className="h-8 w-8 mx-auto mb-2 opacity-50" />
      Match clipping tool will be available once video infrastructure is configured.
    </div>
  );
};
