"use client";

import { useState, useEffect } from "react";
import { BonusCard, GameState, Player, Role } from "./types";
import {
  getRoleDistribution,
  shuffleArray,
  createBonusDeck,
  createActionDeck,
  drawBonusCard,
} from "./utils";
import { useRouter } from "next/navigation";

export default function Game() {
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

  // Ne pas afficher le timer tant qu'il n'est pas chargé
  const displayTimer = isTimerLoading ? null : timerForRoleRevel;

  const initializeGame = async (numPlayers: number, keepPlayers: boolean) => {
    // Vérification des noms des joueurs
    const uniqueNames = new Set(
      playerNames.filter((name) => name.trim() !== "")
    );
    if (uniqueNames.size !== numPlayers) {
      alert("Veuillez entrer un nom unique pour chaque joueur.");
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
        roles.push("pirate" as Role);
      for (let i = 0; i < distribution.marins; i++) roles.push("marin" as Role);
      roles.push("sirene" as Role);

      const shuffledRoles = shuffleArray(roles);
      const bonusCards = createBonusDeck();

      const players = keepPlayers
        ? gameState.players.map((player, index) => ({
            ...player,
            role: shuffledRoles[index] as Role,
            bonusCard: drawBonusCard(bonusCards) as BonusCard,
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
              bonusCard: drawBonusCard(bonusCards) as BonusCard,
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
        bonusCardsDeck: bonusCards,
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
    setVotesForCaptain((prev) => {
      const newVotes = { ...prev };
      newVotes[voterId] = targetId;

      // Si tout le monde a voté, on détermine le capitaine
      if (Object.keys(newVotes).length === gameState.players.length) {
        // Compter les votes pour chaque joueur
        const voteCounts: { [key: number]: number } = {};
        Object.values(newVotes).forEach((vote) => {
          voteCounts[vote] = (voteCounts[vote] || 0) + 1;
        });

        // Trouver le joueur avec le plus de votes
        let maxVotes = 0;
        let captainId = 0;
        Object.entries(voteCounts).forEach(([playerId, votes]) => {
          if (votes > maxVotes) {
            maxVotes = votes;
            captainId = parseInt(playerId);
          }
        });

        // Passer à la phase suivante avec le nouveau capitaine
        setGameState((prev) => ({
          ...prev,
          phase: "distribution",
          currentCaptain: captainId,
        }));
      }

      return newVotes;
    });
  };

  // Fonction pour confirmer la révélation du rôle d'un joueur
  const confirmRoleRevel = (playerId: number) => {
    // Demande de confirmation pour s'assurer que le joueur est bien celui qu'il prétend être
    const confirmReveal = window.confirm(
      "Êtes-ce que tu es bien " + gameState.players[playerId].name + " ?"
    );

    if (confirmReveal) {
      // Si la confirmation est positive, on met à jour l'état pour montrer le rôle du joueur
      setShowingRole(playerId);

      // Affichage d'une alerte avec le rôle du joueur
      alert("Tu es " + gameState.players[playerId].role + " !");

      // Si le joueur a une carte bonus, on affiche également une alerte avec cette information
      if (gameState.players[playerId].bonusCard !== null) {
        alert("Ta carte bonus est : " + gameState.players[playerId].bonusCard);
      }
    }
  };


  // Confirmation de l'équipage
  const handleConfirmCrew = () => {
    const confirmCrew = window.confirm(
      "Est-ce que tout le monde est d'accord avec cet équipage ?"
    );
    if (confirmCrew) {
      setGameState((prev) => ({ ...prev, phase: "card-playing" }));
    } else {
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
      (card) => card === "poison"
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
          <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold text-center mb-8">ICO!</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">
                Configuration de la partie
              </h2>
              <div className="mb-6">
                {/* Sélection du nombre de joeurs */}
                {!validPlayersNumber && (
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">
                      Nombre de joueurs (7-20)
                    </label>
                    <input
                      type="range"
                      min="7"
                      max="20"
                      value={playerCount}
                      className="w-full mb-4"
                      onChange={(e) => {
                        const count = Number(e.target.value);
                        setPlayerCount(count);
                        setPlayerNames(Array(count).fill(""));
                      }}
                    />
                    <div className="text-center text-gray-700 mb-4">
                      {playerCount} joueurs
                    </div>

                    <button
                      onClick={() => setValidPlayersNumber(true)}
                      className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
                    >
                      Valider le nombre de joueurs
                    </button>
                  </div>
                )}

                {/* Saisie des noms des joueurs */}
                {validPlayersNumber && (
                  <div className="space-y-3">
                    {Array.from({ length: playerCount }, (_, index) => (
                      <div key={index} className="flex items-center">
                        <label className="w-24">Joueur {index + 1}:</label>
                        <input
                          type="text"
                          value={playerNames[index] || ""}
                          onChange={(e) => {
                            const newNames = [...playerNames];
                            newNames[index] = e.target.value;
                            setPlayerNames(newNames);
                          }}
                          placeholder={`Nom du joueur ${index + 1}`}
                          className="flex-1 p-2 border rounded"
                        />
                      </div>
                    ))}

                    <button
                      onClick={() => initializeGame(playerCount, false)}
                      className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
                    >
                      Commencer la partie
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      // Phase de vote pour le capitaine
      case "captain-vote":
        return (
          <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Élection du Capitaine</h2>
            <div className="grid grid-cols-2 gap-4">
              {gameState.players.map((voter, index) => {
                // Vérifier si le joueur a déjà voté
                const hasVoted = votesForCaptain[voter.id] !== undefined;

                // Vérifier si c'est le tour du joueur actuel
                const isCurrentVoter =
                  Object.keys(votesForCaptain).length === index;

                return (
                  <div key={voter.id} className="p-4 border rounded">
                    <h3 className="font-bold mb-2">{voter.name}</h3>
                    {!hasVoted && isCurrentVoter ? (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          Votez pour un capitaine :
                        </p>
                        <div className="grid gap-2">
                          {gameState.players
                            .filter((p) => p.id !== voter.id)
                            .map((candidate) => (
                              <button
                                key={candidate.id}
                                className="bg-indigo-600 text-white py-1 px-3 rounded hover:bg-indigo-700 transition-colors"
                                onClick={() =>
                                  handleVoteForCaptain(voter.id, candidate.id)
                                }
                              >
                                Voter pour {candidate.name}
                              </button>
                            ))}
                        </div>
                      </div>
                    ) : hasVoted ? (
                      <p className="text-green-600">
                        A voté pour{" "}
                        {
                          gameState.players.find(
                            (p) => p.id === votesForCaptain[voter.id]
                          )?.name
                        }
                      </p>
                    ) : (
                      <p className="text-gray-600">En attente de vote...</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );

      // Phase de distribution des rôles
      case "distribution":
        return (
          <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Distribution des rôles</h2>
            <p className="mb-4">
              Capitaine : {gameState.players[gameState.currentCaptain]?.name}
            </p>
            <div className="grid grid-cols-2 gap-4">
              {gameState.players.map((player) => (
                <div key={player.id} className="p-4 border rounded">
                  <h3 className="font-bold">{player.name}</h3>
                  <button
                    onClick={() => confirmRoleRevel(player.id)}
                    className="mt-2 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
                  >
                    Voir mon rôle
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                setShowingRole(null);
                handlePhaseChange();
              }}
              className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
            >
              Fermer les yeux
            </button>
          </div>
        );

      // Phase de transition
      case "eyes-closed":
        return (
          <div className="max-w-4xl mx-auto p-4 text-center">
            <h2 className="text-3xl font-bold mb-8">
              Tout le monde ferme les yeux
            </h2>
            <p className="mb-4">
              Le capitaine va appeler les pirates et la sirène...
            </p>
            <button
              onClick={handlePhaseChange}
              className="bg-indigo-600 text-white py-2 px-4 rounded"
            >
              Appeler les pirates et la sirène
            </button>
          </div>
        );

      // Phase de révélation des rôles
      case "eyes-open":
        return (
          <div className="max-w-4xl mx-auto p-4 text-center">
            <h2 className="text-3xl font-bold mb-8">Pirates et Sirène</h2>
            <p className="mb-4">Regardez qui sont vos alliés...</p>
            <p className="text-2xl font-bold mb-4">
              {timerShowROle} secondes restantes
            </p>
            <button
              onClick={handlePhaseChange}
              className="bg-indigo-600 text-white py-2 px-4 rounded"
            >
              Ouvrer les yeux et commencer la partie
            </button>
          </div>
        );

      // Phase de sélection de l'équipage
      case "crew-selection":
        return (
          <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Sélection de l'équipage</h2>
            <p className="mb-4">
              Capitaine ({gameState.players[gameState.currentCaptain]?.name}),
              sélectionnez 3 membres d'équipage :
            </p>
            <div className="grid grid-cols-2 gap-4">
              {gameState.players.map((player) => (
                <div
                  key={player.id}
                  onClick={() => selectCrewMember(player.id)}
                  className={`p-4 border rounded cursor-pointer ${
                    player.isInCrew ? "bg-indigo-100 border-indigo-500" : ""
                  }`}
                >
                  <h3>{player.name}</h3>
                  {player.isInCrew && (
                    <span className="text-indigo-600">Sélectionné</span>
                  )}
                </div>
              ))}
            </div>
            {gameState.selectedCrew.length === 3 && (
              <button
                onClick={() => {
                  handleConfirmCrew();
                }}
                className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded"
              >
                Confirmer l'équipage
              </button>
            )}
          </div>
        );

      // Phase de jeu
      case "card-playing":
        return (
          <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Phase de jeu</h2>
            <div className="grid grid-cols-1 gap-4">
              {gameState.selectedCrew.map((crewId, index) => {
                // Récupérer le joueur correspondant à l'ID
                const player = gameState.players.find((p) => p.id === crewId);

                // Vérifier si c'est le tour du joueur actuel
                const isCurrentPlayer = index === gameState.playedCards.length;
                return (
                  <div key={crewId} className="p-4 border rounded">
                    <h3 className="font-bold">{player?.name}</h3>
                    {isCurrentPlayer && !player?.selectedCard && (
                      <div className="mt-2 space-x-2">
                        <button
                          onClick={() => playCard(crewId, "ile")}
                          className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 transition-colors"
                        >
                          Jouer Île
                        </button>
                        {player?.role === "pirate" && (
                          <button
                            onClick={() => playCard(crewId, "poison")}
                            className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition-colors"
                          >
                            Jouer Poison
                          </button>
                        )}
                      </div>
                    )}
                    {player?.selectedCard && <p>Carte jouée ✓</p>}
                    {!isCurrentPlayer && !player?.selectedCard && (
                      <p>En attente...</p>
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
          <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Révélation des cartes</h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {shuffleArray(gameState.selectedCrew).map((crewId) => {
                // Récupérer le joueur correspondant à l'ID
                const player = gameState.players.find((p) => p.id === crewId);
                return (
                  <div key={crewId} className="p-4 border rounded text-center">
                    <h3 className="font-bold">{player?.name}</h3>
                    <p
                      className={`mt-2 font-bold ${
                        player?.selectedCard === "poison"
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {player?.selectedCard === "poison"
                        ? "☠️ Poison"
                        : "🏝️ Île"}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="text-center">
              <p className="text-xl mb-4">
                {gameState.playedCards.some((card) => card === "poison")
                  ? "L'équipage a été empoisonné ! Les pirates gagnent la manche !"
                  : "L'équipage est arrivé sain et sauf ! Les marines gagnent la manche !"}
              </p>
              <button
                onClick={handlePhaseChange}
                className="bg-indigo-600 text-white py-2 px-4 rounded"
              >
                Voir le score
              </button>
            </div>
          </div>
        );

      // Phase de résultat
      case "result":
        return (
          <div className="max-w-4xl mx-auto p-4">
            {/* Résultat du round */}
            <h2 className="text-2xl font-bold mb-6">Résultat de la manche</h2>
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">Pirates</h3>
                  <p className="text-3xl">{gameState.score.pirates}</p>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">Marines</h3>
                  <p className="text-3xl">{gameState.score.marines}</p>
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
                      className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded"
                    >
                      Passer au vote final
                    </button>
                  </>
                ) : (
                  <div className="mt-8">
                    <button
                      onClick={() => {
                        initializeGame(gameState.players.length, true); // Réinitialise avec les mêmes joueurs
                      }}
                      className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Recommencer avec les mêmes joueurs
                    </button>
                    <button
                      onClick={() => window.location.reload()}
                      className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors ml-4"
                    >
                      Nouvelle partie
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                {/* Anonce du prochain capitaine */}
                <p className="mb-4">
                  Le prochain capitaine sera :{" "}
                  {
                    gameState.players[
                      (gameState.currentCaptain + 1) % gameState.players.length
                    ].name
                  }
                </p>
                <button
                  onClick={nextRound}
                  className="bg-indigo-600 text-white py-2 px-4 rounded"
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
                        <p className="text-sm text-gray-600">
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
                      <p className="text-gray-600">En attente de vote...</p>
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
                  className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Recommencer avec les mêmes joueurs
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors ml-4"
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

  return <div className="min-h-screen bg-gray-100">{renderPhase()}</div>;
}
