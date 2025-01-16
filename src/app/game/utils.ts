import { Card, CardType } from "./types";

export const getRoleDistribution = (numPlayers: number) => {
  const distribution = {
    7: { pirates: 3, marins: 3, sirene: 1 },
    8: { pirates: 3, marins: 4, sirene: 1 },
    9: { pirates: 4, marins: 4, sirene: 1 },
    10: { pirates: 4, marins: 5, sirene: 1 },
    11: { pirates: 5, marins: 5, sirene: 1 },
    12: { pirates: 5, marins: 6, sirene: 1 },
    13: { pirates: 6, marins: 6, sirene: 1 },
    14: { pirates: 6, marins: 7, sirene: 1 },
    15: { pirates: 7, marins: 7, sirene: 1 },
    16: { pirates: 7, marins: 8, sirene: 1 },
    17: { pirates: 8, marins: 8, sirene: 1 },
    18: { pirates: 8, marins: 9, sirene: 1 },
    19: { pirates: 9, marins: 9, sirene: 1 },
    20: { pirates: 9, marins: 10, sirene: 1 }
  };
  
  return distribution[numPlayers as keyof typeof distribution];
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const createBonusDeck = async () => {
  const response = await fetch('/api/admin/cards');
  const cards = await response.json();

  const bonusCards = cards.filter((card: Card) => card.type === CardType.BONUS).map((card: Card) => card.nom);
  
  return shuffleArray([...bonusCards]);
};

export const createActionDeck = () => {
  const actionCards = [
    ...Array(6).fill("ile"),
    ...Array(6).fill("poison")
  ] as const;
  
  return shuffleArray([...actionCards]);
};

export const drawBonusCard = (deck: string[]) => {
  if (deck.length === 0) return null;
  return deck.pop() || null;
};

export const checkVictoryCondition = (score: { pirates: number; marines: number }) => {
  if (score.pirates >= 5) return "pirates";
  if (score.marines >= 5) return "marines";
  return null;
}; 