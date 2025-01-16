export type Role = "pirate" | "marin" | "sirene" | null;
export type ActionCard = "ile" | "poison" | null;

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

export interface Player {
  id: number;
  name: string;
  role: Role;
  bonusCard: Card;
  hasVoted: boolean;
  isInCrew: boolean;
  selectedCard: "ile" | "poison" | null;
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
  bonusCardsDeck: Card[];
  actionCardsDeck: Card[];
  winner: "pirates" | "marines" | "sirene" | null;
}

export enum CardType {
  ROLE = "ROLE",
  BONUS = "BONUS",
  ACTION = "ACTION"
}

export interface Card {
  id: number;
  nom: string;
  description: string;
  type: CardType;
  createdAt: Date;
  updatedAt: Date;
}
