import { MatchAnalysis } from '@/types';
import { ScoreBar } from '@/components/ui/ScoreBar';

interface AnalysisBreakdownProps {
  analysis: MatchAnalysis;
  isPostMatch: boolean;
  locale: 'fr' | 'en';
  labels: {
    breakdown: string;
    stakes: string;
    starPower: string;
    recentForm: string;
    performances: string;
    clutch: string;
    gameDynamics: string;
    pace: string;
    physicality: string;
    shooting: string;
    standoutPlayers: string;
    keyFactors: string;
  };
  dynamicsLabels: {
    slow: string;
    medium: string;
    fast: string;
    soft: string;
    moderate: string;
    intense: string;
    cold: string;
    average: string;
    hot: string;
  };
}

export function AnalysisBreakdown({
  analysis,
  isPostMatch,
  locale,
  labels,
  dynamicsLabels,
}: AnalysisBreakdownProps) {
  const prematchBreakdown = analysis.prematch_breakdown;
  const postmatchBreakdown = analysis.interest_breakdown;
  const gameDynamics = analysis.game_dynamics;
  const standoutPlayers = analysis.standout_players;
  const keyTakeaways = locale === 'fr'
    ? (analysis.key_takeaways_fr || analysis.key_takeaways)
    : (analysis.key_takeaways_en || analysis.key_takeaways);

  const getDynamicsLabel = (type: string, value: string) => {
    const mapping: Record<string, Record<string, string>> = {
      pace: { slow: dynamicsLabels.slow, medium: dynamicsLabels.medium, fast: dynamicsLabels.fast },
      physicality: { soft: dynamicsLabels.soft, moderate: dynamicsLabels.moderate, intense: dynamicsLabels.intense },
      shooting_quality: { cold: dynamicsLabels.cold, average: dynamicsLabels.average, hot: dynamicsLabels.hot },
    };
    return mapping[type]?.[value] || value;
  };

  return (
    <div className="bg-card rounded-xl border border-card-border p-6">
      <h3 className="text-xl font-bold text-foreground mb-6">{labels.breakdown}</h3>

      {/* Pre-match breakdown */}
      {!isPostMatch && prematchBreakdown && (
        <div className="space-y-1">
          <ScoreBar label={labels.stakes} value={prematchBreakdown.stakes} maxValue={55} />
          <ScoreBar label={labels.starPower} value={prematchBreakdown.star_power} maxValue={15} />
          <ScoreBar label={labels.recentForm} value={prematchBreakdown.recent_form} maxValue={30} />
        </div>
      )}

      {/* Post-match breakdown */}
      {isPostMatch && postmatchBreakdown && (
        <div className="space-y-1">
          <ScoreBar label={labels.stakes} value={postmatchBreakdown.stakes} maxValue={30} />
          <ScoreBar label={labels.starPower} value={postmatchBreakdown.star_power} maxValue={15} />
          <ScoreBar label={labels.performances} value={postmatchBreakdown.performances} maxValue={20} />
          <ScoreBar label={labels.clutch} value={postmatchBreakdown.clutch_factor} maxValue={35} />
        </div>
      )}

      {/* Game Dynamics */}
      {gameDynamics && (
        <div className="mt-8 pt-6 border-t border-card-border">
          <h4 className="text-lg font-semibold text-foreground mb-4">{labels.gameDynamics}</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-xs text-foreground-secondary mb-1">{labels.pace}</p>
              <p className="text-sm font-medium text-foreground">
                {getDynamicsLabel('pace', gameDynamics.pace)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-foreground-secondary mb-1">{labels.physicality}</p>
              <p className="text-sm font-medium text-foreground">
                {getDynamicsLabel('physicality', gameDynamics.physicality)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-foreground-secondary mb-1">{labels.shooting}</p>
              <p className="text-sm font-medium text-foreground">
                {getDynamicsLabel('shooting_quality', gameDynamics.shooting_quality)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Standout Players */}
      {standoutPlayers && standoutPlayers.length > 0 && (
        <div className="mt-8 pt-6 border-t border-card-border">
          <h4 className="text-lg font-semibold text-foreground mb-4">{labels.standoutPlayers}</h4>
          <div className="space-y-3">
            {standoutPlayers.map((player, index) => {
              const contribution = locale === 'fr'
                ? (player.contribution_fr || player.contribution)
                : (player.contribution_en || player.contribution);

              return (
                <div key={index} className="flex flex-wrap gap-2">
                  <span className="font-semibold text-foreground">{player.name}</span>
                  <span className="text-foreground-secondary">({player.team})</span>
                  <span className="text-foreground-secondary">-</span>
                  <span className="text-foreground">{contribution}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Key Takeaways */}
      {keyTakeaways && keyTakeaways.length > 0 && (
        <div className="mt-8 pt-6 border-t border-card-border">
          <h4 className="text-lg font-semibold text-foreground mb-4">{labels.keyFactors}</h4>
          <ul className="space-y-2">
            {keyTakeaways.map((takeaway, index) => (
              <li key={index} className="flex gap-2">
                <span className="text-primary">•</span>
                <span className="text-foreground">{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
