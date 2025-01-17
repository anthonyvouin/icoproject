"use client";

import { useState, useEffect } from "react";
import { Role, GameState, Player, Card, CardType } from "./types";
import {
  getRoleDistribution,
  shuffleArray,
  createBonusDeck,
  createActionDeck,
  drawBonusCard,
} from "./utils";
import {CardPopin, CardAction, CardConfirm, CardInfo} from "../../components/Card";

import { useRouter } from "next/navigation";

export default function Game() {
  const [currentPlayerDistributionIndex, setCurrentPlayerDistributionIndex] = useState(0); 
  const router = useRouter();

  const [gameState, setGameState] = useState<GameState>({
    phase: "setup",
    players: [],
    currentCaptain: 0,
    currentRound: 0,
    selectedCrew: [],
    playedCards: [],
    score: {
      pirates: 0,
      marines: 0,
    },
    bonusCardsDeck: [],
    actionCardsDeck: [],
    winner: null,
  });

  const [gameId, setGameId] = useState<number | null>(null);
  const [validPlayersNumber, setValidPlayersNumber] = useState<boolean>(false);
  const [playerCount, setPlayerCount] = useState<number>(7);
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [showingRole, setShowingRole] = useState<number | null>(null);
  const [timerForRoleRevel, setTimerForRoleRevel] = useState(10);
  const [roundsForWin, setRoundsForWin] = useState(2);

  const [roleCards, setRoleCards] = useState<Card[]>([]);
  const [bonusCards, setBonusCards] = useState<Card[]>([]);
  const [actionCards, setActionCards] = useState<Card[]>([]);

  const [popinMessage, setPopinMessage] = useState<string>("");
  const [onPopinResponse, setOnPopinResponse] = useState<((response: boolean) => void) | null>(null);
  const [showCardPopin, setShowCardPopin] = useState(false);
  const [selectedCardPopin, setSelectedCardPopin] = useState<string | null>(null);

  const [timerShowROle, setTimerShowROle] = useState(timerForRoleRevel);
  const [votesForCaptain, setVotesForCaptain] = useState<{
    [key: number]: number;
  }>({});
  const [votesForSiren, setVotesForSiren] = useState<{ [key: number]: number }>(
    {}
  );

  const [isTimerLoading, setIsTimerLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/admin/game-settings");
        const data = await response.json();
        if (response.ok) {
          setRoundsForWin(data.roundsToWin);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des paramètres:", error);
      }
    };

    fetchSettings();
  }, []);

  useEffect(() => {  
    const fetchTimer = async () => {
      setIsTimerLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const response = await fetch("/api/admin/timer");
        const data = await response.json();
        if (data.timer) {
          setTimerForRoleRevel(data.timer);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du timer:", error);
      } finally {
        setIsTimerLoading(false);
      }
    };
    fetchTimer();

    const getRolesCard = async () => {
      const response = await fetch('/api/admin/cards');
      const cards = await response.json();
      const role_cards = cards.filter((card: Card) => card.type === 'ROLE' as CardType);    
      setRoleCards(role_cards);

      const bonus_cards = cards.filter((card: Card) => card.type === 'BONUS' as CardType);    
      setBonusCards(bonus_cards);

      const action_cards = cards.filter((card: Card) => card.type === 'ACTION' as CardType);    
      setActionCards(action_cards);
    };
    getRolesCard();

  }, []);

  useEffect(() => {
    setTimerShowROle(timerForRoleRevel);
  }, [timerForRoleRevel]);

  // Démarrer le décompte quand on entre dans la phase eyes-open
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (gameState.phase === "eyes-open" && timerShowROle > 0) {
      interval = setInterval(() => {
        setTimerShowROle((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handlePhaseChange();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [gameState.phase, timerShowROle]);
  
  const [isFilled, setIsFilled] = useState<boolean[]>([]);

  const handleInputChange = (index: number, value: string) => {
    const newPlayerNames = [...playerNames];
    newPlayerNames[index] = value;
    setPlayerNames(newPlayerNames);

    const newIsFilled = [...isFilled];
    newIsFilled[index] = value.trim() !== "";
    setIsFilled(newIsFilled);
  };

  const handleShowPopin = (playerId: number, type: string) => {
    // Demande de confirmation pour s'assurer que le joueur est bien celui qu'il prétend être
    const confirmReveal = window.confirm(
      "Êtes-ce que tu es bien " + gameState.players[playerId].name + " ?"
    );

    if (confirmReveal) {
      setShowingRole(playerId);
      if(type === 'role') {
        setSelectedCardPopin(gameState.players[playerId].role);
        setShowCardPopin(true);
      } else if(type === 'bonus') {
        setSelectedCardPopin(gameState.players[playerId].bonusCard.nom);
        setShowCardPopin(true);
      } else if(type === 'action') {
        setSelectedCardPopin(gameState.players[playerId].selectedCard);
        setShowCardPopin(true);
      }
    }
  };

  // Ne pas afficher le timer tant qu'il n'est pas chargé
  const displayTimer = isTimerLoading ? null : timerForRoleRevel;

  const initializeGame = async (numPlayers: number, keepPlayers: boolean) => {
    // Vérification des noms des joueurs
    const uniqueNames = new Set(
      playerNames.filter((name) => name.trim() !== "")
    );
    if (uniqueNames.size !== numPlayers) {
      setShowCardPopin(true);
      setPopinMessage("Veuillez entrer un nom unique pour chaque joueur !");
      return;
    }

    try {
      // Créer une nouvelle partie dans la base de données
      const response = await fetch("/api/game/start", {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.error || "Erreur lors de la création de la partie"
        );
      }

      const gameData = await response.json();
      setGameId(gameData.id);

      const roles = [];
      const distribution = getRoleDistribution(numPlayers);

      for (let i = 0; i < distribution.pirates; i++)
        roles.push("pirate");
      for (let i = 0; i < distribution.marins; i++) roles.push("marin");
      roles.push("sirene");

      const shuffledRoles = shuffleArray(roles);
      const bonusCards = await createBonusDeck();

      const players = keepPlayers
        ? gameState.players.map((player, index) => ({
            ...player,
            role: shuffledRoles[index] as Role,
            bonusCard: drawBonusCard(bonusCards as Card[]) || { id: 0, nom: '', description: '', type: 'BONUS' as CardType, image: '', createdAt: new Date(), updatedAt: new Date() },
            hasVoted: false,
            isInCrew: false,
            selectedCard: null,
          }))
        : Array(numPlayers)
            .fill(null)
            .map((_, index) => ({
              id: index,
              name: playerNames[index] || `Joueur ${index + 1}`,
              role: shuffledRoles[index] as Role,
              bonusCard: drawBonusCard(bonusCards as Card[]) || { id: 0, nom: '', description: '', type: 'BONUS' as CardType, image: '', createdAt: new Date(), updatedAt: new Date() },
              hasVoted: false,
              isInCrew: false,
              selectedCard: null,
            }));

      setGameState({
        phase: "captain-vote",
        players,
        currentCaptain: 0,
        currentRound: 0,
        selectedCrew: [],
        playedCards: [],
        score: {
          pirates: 0,
          marines: 0,
        },
        bonusCardsDeck: bonusCards as Card[],
        actionCardsDeck: createActionDeck(),
        winner: null,
      });

      setVotesForCaptain({});
      setVotesForSiren({});
    } catch (error) {
      console.error("Erreur lors de la création de la partie:", error);
      alert("Erreur lors de la création de la partie. Veuillez réessayer.");
      return;
    }
  };

  const handleVoteForCaptain = (voterId: number, targetId: number) => {
    setPopinMessage(`Est-ce que tu es sûr de vouloir voter pour ${gameState.players[targetId].name} ?`);
    setShowCardPopin(true);
  
    const handleResponse = (response: boolean) => {
      if (!response) return;
  
      setVotesForCaptain((prev) => {
        const newVotes = { ...prev };
        newVotes[voterId] = targetId;
  
        // Si tout le monde a voté, on détermine le capitaine
        if (Object.keys(newVotes).length === gameState.players.length) {
          const voteCounts: { [key: number]: number } = {};
          Object.values(newVotes).forEach((vote) => {
            voteCounts[vote] = (voteCounts[vote] || 0) + 1;
          });
  
          let maxVotes = 0;
          let captainId = 0;
          Object.entries(voteCounts).forEach(([playerId, votes]) => {
            if (votes > maxVotes) {
              maxVotes = votes;
              captainId = parseInt(playerId);
            }
          });
  
          setGameState((prev) => ({
            ...prev,
            phase: "distribution",
            currentCaptain: captainId,
          }));
        }
  
        return newVotes;
      });
    };
  
    setOnPopinResponse(() => handleResponse); // Enregistrez la fonction pour être utilisée par la modale.
  };

  // Confirmation de l'équipage
  const handleConfirmCrew = () => {
    setShowCardPopin(true);
    setPopinMessage("Est-ce que tout le monde est d'accord avec cet équipage ?");
  
    const handleResponse = (response: boolean) => {
      if (response) {
        // Si l'utilisateur confirme
        setGameState((prev) => ({ ...prev, phase: "card-playing" }));
      } else {
        // Si l'utilisateur refuse
        setGameState((prev) => ({
          ...prev,
          currentCaptain: (prev.currentCaptain + 1) % prev.players.length,
          selectedCrew: [],
          players: prev.players.map((player) => ({
            ...player,
            isInCrew: false,
          })),
        }));
      }
    };
  
    setOnPopinResponse(() => handleResponse); // Enregistrez la logique à exécuter après la réponse.
  };
  
  // Vote pour la sirène
  const handleSirenVote = (voterId: number, targetId: number) => {
    setVotesForSiren((prev) => {
      const newVotes = { ...prev };
      newVotes[voterId] = targetId;

      // Si tous les pirates ET la sirène ont voté
      const piratesAndSiren = gameState.players.filter(
        (p) => p.role === "pirate" || p.role === "sirene"
      );
      if (Object.keys(newVotes).length === piratesAndSiren.length) {
        // Compter les votes
        const voteCounts: { [key: number]: number } = {};
        Object.values(newVotes).forEach((vote) => {
          voteCounts[vote] = (voteCounts[vote] || 0) + 1;
        });

        // Trouver le joueur le plus voté
        let maxVotes = 0;
        let accusedId = 0;
        Object.entries(voteCounts).forEach(([playerId, votes]) => {
          if (votes > maxVotes) {
            maxVotes = votes;
            accusedId = parseInt(playerId);
          }
        });

        // Vérifier si c'est la sirène
        const accusedPlayer = gameState.players.find((p) => p.id === accusedId);
        setGameState((prev) => ({
          ...prev,
          phase: "game-over",
          winner: accusedPlayer?.role === "sirene" ? "pirates" : "sirene",
        }));
      }

      return newVotes;
    });
  };

  // Fonction pour gérer les changements de phase
  const handlePhaseChange = () => {
    switch (gameState.phase) {
      case "distribution":
        setGameState((prev) => ({ ...prev, phase: "eyes-closed" }));
        break;
      case "eyes-closed":
        setTimerShowROle(timerForRoleRevel);
        setGameState((prev) => ({ ...prev, phase: "eyes-open" }));
        break;
      case "eyes-open":
        setGameState((prev) => ({ ...prev, phase: "crew-selection" }));
        break;
      case "reveal-cards":
        evaluateRound();
        break;
      case "result":
        if (gameState.score.pirates >= 10 || gameState.score.marines >= 10) {
          setGameState((prev) => ({ ...prev, phase: "final-vote" }));
        } else {
          nextRound();
        }
        break;
    }
  };

  // Fonction pour sélectionner un membre d'équipage
  const selectCrewMember = (playerId: number) => {
    if (
      gameState.selectedCrew.length >= 3 &&
      !gameState.selectedCrew.includes(playerId)
    )
      return;

    setGameState((prev) => ({
      ...prev,
      selectedCrew: prev.selectedCrew.includes(playerId)
        ? prev.selectedCrew.filter((id) => id !== playerId)
        : [...prev.selectedCrew, playerId],
      players: prev.players.map((player) => ({
        ...player,
        isInCrew: player.id === playerId ? !player.isInCrew : player.isInCrew,
      })),
    }));
  };

  // Fonction pour jouer une carte
  const playCard = (playerId: number, card: "ile" | "poison") => {
    const player = gameState.players.find((player) => player.id === playerId);

    if((player?.role == "marin" || player?.role == "sirene") && card == "poison") {
      setShowCardPopin(true);
      setPopinMessage("Tu n'es pas un pirate donc joue la carte île !");
      return
    }

    setGameState((prev) => {
      const updatedPlayers = prev.players.map((player) =>
        player.id === playerId ? { ...player, selectedCard: card } : player
      );

      const updatedPlayedCards = [...prev.playedCards, card];

      const allCrewPlayed = prev.selectedCrew.every(
        (crewId) =>
          updatedPlayers.find((p) => p.id === crewId)?.selectedCard !== null
      );

      if (allCrewPlayed) {
        return {
          ...prev,
          players: updatedPlayers,
          playedCards: updatedPlayedCards,
          phase: "reveal-cards",
        };
      }

      return {
        ...prev,
        players: updatedPlayers,
        playedCards: updatedPlayedCards,
      };
    });
  };

  // Fonction pour évaluer la manche
  const evaluateRound = () => {
    const poisonPlayed = gameState.playedCards.some(
      (card) => card == "poison"
    );
    const newScore = { ...gameState.score };

    if (poisonPlayed) {
      newScore.pirates += 1;
    } else {
      newScore.marines += 1;
    }

    if (newScore.pirates >= 10) {
      // Les pirates gagnent la manche, ils doivent maintenant trouver la sirène
      setGameState((prev) => ({
        ...prev,
        phase: "final-vote",
        score: newScore,
      }));
      setVotesForSiren({});
    } else if (newScore.marines >= 10) {
      // Les marines gagnent directement
      setGameState((prev) => ({
        ...prev,
        phase: "game-over",
        score: newScore,
        winner: "marines",
      }));
    } else {
      // La partie continue
      setGameState((prev) => ({
        ...prev,
        phase: "result",
        score: newScore,
        currentRound: prev.currentRound + 1,
      }));
    }
  };

  // Fonction pour passer au tour suivant
  const nextRound = () => {
    setGameState((prev) => ({
      ...prev,
      phase: "crew-selection",
      currentCaptain: (prev.currentCaptain + 1) % prev.players.length,
      selectedCrew: [],
      playedCards: [],
      players: prev.players.map((player) => ({
        ...player,
        isInCrew: false,
        selectedCard: null,
        hasVoted: false,
      })),
    }));
  };

  const renderPhase = () => {
    switch (gameState.phase) {
      // Phase de configuration de la partie
      case "setup":
        return (
          <div className="max-w-7xl mx-8 px-4 sm:px-8 lg:px-10 py-12 md:py-24 m-4">
            <div className="bg-[#E9DBC2] rounded-lg shadow p-4 mb-2">
              <div className="bg-[#FFF7EE] rounded-lg shadow p-4">
                <h2 className="text-black text-center font-bold">Configuration de la partie</h2>
              </div>
                
                {/* Sélection du nombre de joueurs */}
                <div>
                    {!validPlayersNumber && (
                      <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Nombre de joueurs (7-20)</label>
                        <input 
                          type="range" 
                          min="7" 
                          max="20" 
                          value={playerCount} 
                          className="w-full mb-4 curseur-personnalise" 
                          onChange={(e) => { 
                            const count = Number(e.target.value); 
                            setPlayerCount(count);
                            setPlayerNames(Array(count).fill(""));

                            // Mettre à jour l'arrière-plan du curseur
                            const percentage = ((count - 7) / (20 - 7)) * 100;
                            e.target.style.background = `linear-gradient(to right, #383837 ${percentage}%, #ddd ${percentage}%)`;

                            // Afficher la distribution des rôles
                            const distribution = getRoleDistribution(count);
                            console.log(distribution);
                          }}
                          style={{
                            appearance: 'none',
                            background: 'linear-gradient(to right,#383837 0%, #ddd 0%)',
                            borderRadius: '10px',
                            height: '8px',
                            outline: 'none',
                          }}
                        />
          
                        <div className="text-center text-gray-700 mb-4">
                          {playerCount} joueurs
                        </div>
          
                        <button
                          onClick={() => setValidPlayersNumber(true)}
                          className="w-full bg-[#383837]  text-white py-2 px-4 rounded "
                        >
                          Valider le nombre de joueurs
                        </button>
                      </div>
                    )}
                </div>
            </div>
            
            <div>
              {/* Distribution des rôles */}
              <div className="mb-4">
                {!validPlayersNumber && (
                  <div className="text-black gap-2">
                    
                    <div className="grid grid-cols-2 gap-4 p-2">
                    {
                      roleCards.map((card) => (
                        <div key={"card" + card.id} className="relative bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                          {/* Image des cards  */}
                          <img
                            src={card.image}
                            alt={card.image}
                            className="w-full object-cover"
                          />
                          {/* Petit carré pour le nombre */}
                          <div className="absolute top-1 right-0 bg-[#383837] text-white rounded-none w-6 h-6 flex items-center justify-center text-xs font-bold">
                            {card.nom === "pirate" ? getRoleDistribution(playerCount).pirates : null}
                            {card.nom === "marin" ? getRoleDistribution(playerCount).marins : null}
                            {card.nom === "sirene" ? getRoleDistribution(playerCount).sirene : null}
                          </div>
                        </div>
                      ))
                    }
                    </div>
                  </div>
                )}
              </div>
              {/* Saisie des noms des joueurs */}
              {validPlayersNumber && (
                  <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 xl:space-y-8">
                      <div>
                        {Array.from({ length: playerCount }, (_, index) => (
                          <div key={index} className="bg-[#E9DBC2] p-1 rounded-lg mt-4 flex items-center">
                            <label className="rounded-lg p-4 text-black">
                              <img src="/Icon - joueur-conf.png" alt="Player Icon" />
                            </label>
                            <input
                              type="text"
                              value={playerNames[index] || ""}
                              onChange={(e) => handleInputChange(index, e.target.value)}
                              placeholder={`Nom du joueur ${index + 1}`}
                              className={`flex-1 text-black p-2 mr-2 rounded-lg ${
                                isFilled[index] ? "bg-[#E9DBC2]" : ""
                              }`}
                            />
                          </div>
                        ))}
                      </div>
                    <button
                      onClick={() => initializeGame(playerCount, false)}
                      className="w-full bg-[#383837]  text-white py-2 px-4 rounded-lg "
                    >
                      Commencer la partie
                    </button>
                  </div>
                )}
            </div>

            {/* Affichage conditionnel de la modale */}
            {showCardPopin && (
              <CardInfo nom={popinMessage} onClose={() => setShowCardPopin(false)} />
            )}
          </div>
        );

      // Phase de vote pour le capitaine
      case "captain-vote":
        return (
          <div className="max-w-4xl mx-auto p-4">
            <h2 className="bg-[#E9DBC2] text-black font-bold rounded-lg shadow-md p-4">
              Élection du Capitaine
            </h2>
            <div className="grid grid-cols-2">
              {gameState.players.map((voter, index) => {
                // Vérifier si le joueur a déjà voté
                const hasVoted = votesForCaptain[voter.id] !== undefined;

                // Vérifier si c'est le tour du joueur actuel
                const isCurrentVoter =
                  Object.keys(votesForCaptain).length === index;

                return (
                  <div 
                    key={voter.id} 
                    className="p-4 m-4 bg-[#383837] border rounded-lg"
                  >
                    <h3 className="font-bold mb-2 text-[#E9DAC2]">{voter.name}</h3>
                    {!hasVoted && isCurrentVoter ? (
                      <div className="space-y-2 ">
                        <p className="text-sm text-[#E9DBC2] mt-4">
                          Votez pour un capitaine :
                        </p>
                        <div className="grid gap-2">
                          {gameState.players
                            .filter((p) => p.id !== voter.id)
                            .map((candidate) => (
                              <button
                                key={candidate.id}
                                className="bg-[#E9DBC2] text-black font-bold p-2 rounded transition-colors"
                                onClick={() =>
                                  handleVoteForCaptain(voter.id, candidate.id)
                                }
                              >
                               {candidate.name}
                              </button>
                            ))}
                        </div>
                      </div>
                    ) : hasVoted ? (
                      <p className="bg-[#E9DBC2] text-black font-bold py-1 px-3 rounded transition-colors">
                        A voté pour{" "}
                        {
                          gameState.players.find(
                            (p) => p.id === votesForCaptain[voter.id]
                          )?.name
                        }
                      </p>
                    ) : (
                      <p className="text-[#E9DAC2]">En attente de vote...</p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Affichage conditionnel de la modale */}
            {showCardPopin && (
              <CardConfirm
                nom={popinMessage}
                onClose={() => setShowCardPopin(false)}
                onConfirm={(response) => {
                  if (onPopinResponse) onPopinResponse(response);
                  setShowCardPopin(false);
                }}
              />
            )}
          </div>
        );
      // Phase de distribution des rôles
      
      case "distribution":
        const currentPlayer = gameState.players[currentPlayerDistributionIndex]; // Joueur actuel
      
        return (
          <div className="max-w-4xl mx-auto p-4">
            {/* Titre */}
            <h2 className="bg-[#E9DBC2] text-black font-bold rounded-lg shadow-md p-4">
              Distribution des rôles
            </h2>
      
            {/* Affichage du rôle du capitaine */}
            <p className="bg-[#E9DBC2] mt-2 text-black p-2 rounded-lg mb-4">
              Capitaine : {gameState.players[gameState.currentCaptain]?.name}
            </p>
      
            {/* Affichage du joueur actuel */}
            <div className="p-4 bg-[#383837] border rounded-lg text-white text-center">
              <h3 className="font-bold text-lg">{currentPlayer?.name}</h3>
              <p className="mt-2">
                {currentPlayerDistributionIndex === gameState.currentCaptain
                  ? "Rôle : Capitaine"
                  : "Rôle : Joueur"}
              </p>
      
              <div className="flex gap-2 justify-center mt-4">
                <button
                  onClick={() => handleShowPopin(currentPlayer.id, "role")}
                  className="bg-[#E9DBC2] text-black font-bold py-2 px-4 rounded-lg"
                >
                  Voir mon rôle
                </button>
      
                {currentPlayer?.bonusCard?.nom && (
                  <button
                    onClick={() => handleShowPopin(currentPlayer.id, "bonus")}
                    className="bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg"
                  >
                    Voir mon bonus
                  </button>
                )}
              </div>
            </div>
      
            {/* Navigation entre les joueurs */}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setCurrentPlayerDistributionIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentPlayerDistributionIndex === 0}
                className={`py-2 px-4 rounded-lg ${
                  currentPlayerDistributionIndex === 0
                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                    : "bg-[#E9DBC2] text-black font-bold"
                }`}
              >
                Précédent
              </button>
              <button
                onClick={() =>
                  setCurrentPlayerDistributionIndex((prev) =>
                    Math.min(gameState.players.length - 1, prev + 1)
                  )
                }
                disabled={currentPlayerDistributionIndex === gameState.players.length - 1}
                className={`py-2 px-4 rounded-lg ${
                  currentPlayerDistributionIndex === gameState.players.length - 1
                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                    : "bg-[#E9DBC2] text-black font-bold"
                }`}
              >
                Suivant
              </button>
            </div>
      
            {/* Passage à l'étape suivante */}
            {currentPlayerDistributionIndex === gameState.players.length - 1 && (
              <button
                onClick={() => {
                  setShowingRole(null);
                  handlePhaseChange();
                }}
                className="mt-4 bg-[#E9DBC2] text-black font-black py-2 px-4 rounded-lg w-full"
              >
                Fermer les yeux
              </button>
            )}
      
            {/* Affichage conditionnel de la modale */}
            {showCardPopin && selectedCardPopin && (
              <CardPopin nom={selectedCardPopin} onClose={() => setShowCardPopin(false)} />
            )}
          </div>
        );
      
      // Phase de transition
      case "eyes-closed":
        return (
          <div className="flex justify-center items-center h-screen md:h-auto">
            <div className="bg-[#E9DBC2] mx-6 max-w-md mx-auto p-4 text-center rounded-lg md:max-w-lg lg:max-w-4xl">
              <h2 className="text-3xl font-bold mb-8">
                Tout le monde ferme les yeux
              </h2>
              
              <p className="mb-4">
                Le capitaine va appeler les pirates et la sirène...
              </p>
              <button
                onClick={handlePhaseChange}
                className="bg-[#383837] text-[#E9DBC2] py-2 px-4 rounded"
              >
                Appeler les pirates et la sirène
              </button>
            </div>
          </div>
        );

      // Phase de révélation des rôles
      case "eyes-open":
        return (
          <div className="flex justify-center items-center h-screen md:h-auto">
            <div className="bg-[#E9DBC2] max-w-md mx-auto p-4 text-center rounded-lg shadow md:max-w-lg lg:max-w-4xl">
              <h2 className="text-3xl font-bold mb-8">Pirates et Sirène</h2>
              <p className="mb-4">Regardez qui sont vos alliés...</p>
              <p className="text-2xl font-bold mb-4">
                {timerShowROle} secondes restantes
              </p>
              <button
                onClick={handlePhaseChange}
                className="bg-[#383837] text-[#E9DBC2] py-2 px-4 rounded"
              >
                Ouvrer les yeux et commencer la partie
              </button>
            </div>
          </div>
        );
      
        // Phase de sélection de l'équipage
      case "crew-selection":
        return (
          <div className="max-w-4xl mx-auto p-4 mt-6">
            <h2 className="bg-[#E9DBC2] rounded-lg text-black font-bold shadow p-2">Sélection de l'équipage</h2>
            <p className="bg-[#E9DBC2] rounded-lg text-black font-bold shadow p-2 mt-20">
              Capitaine : ({gameState.players[gameState.currentCaptain]?.name}) !
            </p>
            <div className="bg-[#383837] p-2 mt-2 mb-4 rounded-lg shadow">
              <p className=" text-white font-bold mt-4 mb-2">sélectionnez 3 membres d'équipage :
              </p>
              <div className="grid  grid-cols-2 gap-4">
                {gameState.players.map((player) => (
                  <div
                    key={player.id}
                    onClick={() => selectCrewMember(player.id)}
                    className={`p-4 border text-black bg-[#E9DBC2] rounded-lg cursor-pointer ${
                      player.isInCrew ? "bg-[#FFF7EE] font-bold" : "bg-[#7D4E1D]"
                    }`}
                  >
                    <h3>{player.name}</h3>
                  </div>
                ))}
              </div>
            </div>
            {gameState.selectedCrew.length === 3 && (
              <button
                onClick={() => {
                  handleConfirmCrew();
                }}
                className="mt-4 flex bg-[#383837] text-white py-2 px-4 rounded-lg "
              >
                Confirmer l'équipage
              </button>
            )}

            {/* Affichage conditionnel de la modale */}
            {showCardPopin && (
              <CardConfirm
                nom={popinMessage}
                onClose={() => setShowCardPopin(false)}
                onConfirm={(response) => {
                  if (onPopinResponse) onPopinResponse(response);
                  setShowCardPopin(false);
                }}
              />
            )}
          </div>
        );

      // Phase de jeu
      case "card-playing":
        return (
          <div className="max-w-4xl mx-auto p-4 ">
            <h2 className="bg-[#E9DBC2] rounded-lg shadow p-2 text-black font-bold">Phase de jeu</h2>
            <div className="mt-4 shadow rounded-lg grid grid-cols-1 gap-4">
              {gameState.selectedCrew.map((crewId, index) => {
                // Récupérer le joueur correspondant à l'ID
                const player = gameState.players.find((p) => p.id === crewId);

                // Vérifier si c'est le tour du joueur actuel
                const isCurrentPlayer = index === gameState.playedCards.length;
                return (
                  <div key={crewId} className="p-4 bg-[#E9DBC2] border rounded shadow ">
                    <h3 className="font-bold text-black">{player?.name}</h3>
                    {isCurrentPlayer && !player?.selectedCard && (
                      <div className="mt-2 space-x-4 text-center">
                        <button
                          onClick={() => playCard(crewId, "ile")}
                        >
                          <CardAction nom={"ile"}  />
                        </button>
                        <button
                          onClick={() => playCard(crewId, "poison")}
                        >
                          <CardAction nom={"poison"}  />
                        </button>
                      </div>
                    )}
                    {player?.selectedCard && <p className="font-bold text-[#7D4E1D]"> Carte jouée ✓</p>}
                    {!isCurrentPlayer && !player?.selectedCard && (
                      <p className="font-bold text-[#7D4E1D]">
                         En attente...
                      </p>
                    )}

                  {/* Affichage conditionnel de la modale */}
                  {showCardPopin && (
                    <CardInfo nom={popinMessage} onClose={() => setShowCardPopin(false)} />
                  )}
                  </div>
                );
              })}
            </div>
          </div>
        );

      // Phase de révélation des cartes
      case "reveal-cards":
        return (
          <div className="max-w-4xl mx-auto p-4 flex flex-col justify-between">
            <div>
              <h2 className="text-black font-bold mb-4 bg-[#E9DBC2] rounded-lg shadow p-2">
                Révélation des cartes
              </h2>

              <div className="grid grid-cols-1 gap-4">
                {/* Container pour les cartes de l'équipage */}
                <div className="grid grid-cols-3 gap-4">
                  {shuffleArray(gameState.selectedCrew).map((crewId) => {
                    // Récupérer le joueur correspondant à l'ID
                    const player = gameState.players.find((p) => p.id === crewId);
                    return (
                      <div key={crewId} className="">
                        <div className="mt-2">
                          {player?.selectedCard === "poison" ? (
                            <div className="relative bg-[#E9DBC2] border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                              {/* Image Poison */}
                              <img
                                src="/img/poison_illu.png"
                                alt="Poison"
                                className="w-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="relative bg-[#E9DBC2] border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                              {/* Image Île */}
                              <img
                                src="/img/ile-illu.png"
                                alt="Île"
                                className="w-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Résultat de la manche */}
              <div className="text-center mt-4">
                <p className="text-lg text-black rounded-lg shadow border bg-[#E9DBC2] rounded-lg mb-4 p-4">
                  {gameState.playedCards.some((card) => card === "poison")
                    ? "L'équipage a été empoisonné ! Les pirates gagnent la manche !"
                    : "L'équipage est arrivé sain et sauf ! Les marines gagnent la manche !"}
                </p>

                {/* Bouton pour voir le score */}
                <button
                  onClick={handlePhaseChange}
                  className="bg-[#383837] text-white py-2 px-4 rounded-lg hover:bg-[#2c2a29] transition-all"
                >
                  Voir le score
                </button>
              </div>
            </div>
          </div>
        );
        

      // Phase de résultat
      case "result":
        return (
          <div className="max-w-4xl mx-auto p-4">
            {/* Résultat du round */}
            <h2 className="text-2xl text-black font-bold mb-6 bg-[#E9DBC2] rounded-lg shadow p-2">Résultat de la manche</h2>
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <h3 className="text-xl text-black font-bold mb-2">Pirates</h3>
                  <p className="text-3xl text-[#383837]">{gameState.score.pirates}</p>
                </div>
                <div className="text-center">
                  <h3 className="text-xl text-black font-bold mb-2">Marines</h3>
                  <p className="text-3xl text-[#383837]">{gameState.score.marines}</p>
                </div>
              </div>
            </div>

            {/* Résultat si une des deux équpe a gagné */}
            {gameState.score.pirates >= roundsForWin ||
            gameState.score.marines >= roundsForWin ? (
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Fin de la partie !</h3>
                {gameState.score.pirates >= roundsForWin ? (
                  <>
                    <p className="text-xl mb-4">Les Pirates ont gagné !</p>
                    <p>Ils doivent maintenant identifier la Sirène...</p>
                    <button
                      onClick={() =>
                        setGameState((prev) => ({
                          ...prev,
                          phase: "final-vote",
                        }))
                      }
                      className="mt-4 bg-[#383837] text-white py-2 px-4 rounded-lg"
                    >
                      Passer au vote final
                    </button>
                  </>
                ) : (
                  <div className="flex mt-8 gap-4">
                    <button
                      onClick={() => {
                        initializeGame(gameState.players.length, true); // Réinitialise avec les mêmes joueurs
                      }}
                      className="bg-[#383837] text-white py-2 px-6 rounded-lg  transition-colors"
                    >
                      Recommencer avec les mêmes joueurs
                    </button>
                    <button
                      onClick={() => window.location.reload()}
                      className="bg-[#383837] text-white py-2 px-6 rounded-lg  transition-colors ml-4"
                    >
                      Nouvelle partie
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                {/* Anonce du prochain capitaine */}
                <p className="mb-4 text-black font-bold ">
                  Le prochain capitaine sera :{" "}
                  {
                    gameState.players[
                      (gameState.currentCaptain + 1) % gameState.players.length
                    ].name
                  }
                </p>
                <button
                  onClick={nextRound}
                  className="bg-[#383837] text-white py-2 px-4 rounded"
                >
                  Tour suivant
                </button>
              </div>
            )}
          </div>
        );

      // Phase de vote final pirates/sirène
      case "final-vote":
        // Sélection des pirates et de la sirène
        const piratesAndSiren = gameState.players.filter(
          (p) => p.role === "pirate" || p.role === "sirene"
        );

        return (
          <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">
              Vote Final - Trouver la Sirène
            </h2>
            <p className="text-lg mb-6">
              Pirates et Sirène, vous devez voter pour éliminer un joueur !
            </p>
            <div className="grid grid-cols-2 gap-4">
              {piratesAndSiren.map((voter, index) => {
                // Vérifier si le joueur a déjà voté
                const hasVoted = votesForSiren[voter.id] !== undefined;

                // Vérifier si c'est le tour du joueur actuel
                const isCurrentVoter =
                  Object.keys(votesForSiren).length === index;

                return (
                  <div key={voter.id} className="p-4 border rounded">
                    <h3 className="font-bold mb-2">{voter.name}</h3>
                    {!hasVoted && isCurrentVoter ? (
                      <div className="space-y-2">
                        <p className="text-sm bg-[#7D4E1D]">
                          Votez pour éliminer un joueur :
                        </p>
                        <div className="grid gap-2">
                          {gameState.players
                            .filter(
                              (p) =>
                                p.id !== voter.id &&
                                (p.role === "pirate" || p.role === "sirene")
                            )
                            .map((suspect) => (
                              <button
                                key={suspect.id}
                                className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700 transition-colors"
                                onClick={() =>
                                  handleSirenVote(voter.id, suspect.id)
                                }
                              >
                                Voter contre {suspect.name}
                              </button>
                            ))}
                        </div>
                      </div>
                    ) : hasVoted ? (
                      <p className="text-green-600">
                        A voté contre{" "}
                        {
                          gameState.players.find(
                            (p) => p.id === votesForSiren[voter.id]
                          )?.name
                        }
                      </p>
                    ) : (
                      <p className="bg-[#7D4E1D]">En attente de vote...</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );

      case "game-over":
        return (
          <div className="max-w-4xl mx-auto p-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Fin de la partie !</h2>
            <div className="bg-white rounded-lg shadow-lg p-8">
              {gameState.winner === "pirates" && (
                <>
                  <h3 className="text-2xl text-red-600 font-bold mb-4">
                    Les Pirates ont gagné !
                  </h3>
                  <p className="text-lg mb-4">Ils ont trouvé la Sirène !</p>
                </>
              )}
              {gameState.winner === "marines" && (
                <>
                  <h3 className="text-2xl text-blue-600 font-bold mb-4">
                    Les Marines ont gagné !
                  </h3>
                  <p className="text-lg mb-4">L'ordre est maintenu !</p>
                </>
              )}
              {gameState.winner === "sirene" && (
                <>
                  <h3 className="text-2xl text-purple-600 font-bold mb-4">
                    La Sirène a gagné !
                  </h3>
                  <p className="text-lg mb-4">
                    Les pirates n'ont pas réussi à la trouver !
                  </p>
                </>
              )}
              <div className="mt-8">
                <button
                  onClick={() => {
                    initializeGame(gameState.players.length, true); // Réinitialise avec les mêmes joueurs
                  }}
                  className="bg-[#383837] text-white py-2 px-6 rounded-lg  transition-colors"
                >
                  Recommencer avec les mêmes joueurs
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-[#383837] text-white py-2 px-6 rounded-lg  transition-colors ml-4"
                >
                  Nouvelle partie
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  useEffect(() => {
    const endGame = async () => {
      if (gameState.winner && gameId) {
        try {
          const response = await fetch("/api/game/end", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ gameId }),
          });

          if (!response.ok) {
            throw new Error("Erreur lors de la fin de la partie");
          }
        } catch (error) {
          console.error("Erreur lors de la fin de la partie:", error);
        }
      }
    };

    endGame();
  }, [gameState.winner, gameId]);

  return <div className="min-h-screen bg-carte-acceuil bg-cover bg-center">{renderPhase()}</div>;
}

