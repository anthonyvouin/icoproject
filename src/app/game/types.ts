export type Role = "pirate" | "marin" | "sirene" | null;
export type GamePhase =
  | "setup"
  | "captain-vote"
  | "distribution"
  | "eyes-closed"
  | "eyes-open"
  | "crew-selection"
  | "card-playing"
  | "reveal-cards"
  | "vote"
  | "result"
  | "final-vote"
  | "game-over";

export type BonusCard =
  | "mal-de-mer"
  | "mer-agitee"
  | "antidote"
  | "observateur"
  | "tribord"
  | "par-dessus-bord"
  | "carte-tresor"
  | "malandrin"
  | "voyage-express"
  | "amarrage"
  | "chanceux"
  | "perroquet"
  | "charlatan"
  | "double"
  | "leviathan"
  | "meduse"
  | "troc"
  | "marchand"
  | "solitaire"
  | "typhon"
  | null;

export type ActionCard = "ile" | "poison" | null;

export interface Player {
  id: number;
  name: string;
  role: Role;
  bonusCard: BonusCard;
  hasVoted: boolean;
  isInCrew: boolean;
  selectedCard: ActionCard;
}

export interface GameState {
  phase: GamePhase;
  players: Player[];
  currentCaptain: number;
  currentRound: number;
  selectedCrew: number[];
  playedCards: ActionCard[];
  score: {
    pirates: number;
    marines: number;
  };
  bonusCardsDeck: BonusCard[];
  actionCardsDeck: ActionCard[];
  winner: "pirates" | "marines" | "sirene" | null;
}
