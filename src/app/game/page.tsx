"use client";

import { useState } from "react";
import { GameState, Player } from "./types";
import {
  getRoleDistribution,
  shuffleArray,
  createBonusDeck,
  createActionDeck,
  drawBonusCard,
} from "./utils";

export default function Game() {
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

  const [validPlayersNumber, setValidPlayersNumber] = useState<boolean>(false);
  const [playerCount, setPlayerCount] = useState<number>(7);
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [showingRole, setShowingRole] = useState<number | null>(null);
  const [votesForCaptain, setVotesForCaptain] = useState<{
    [key: number]: number;
  }>({});
  const [votesForSiren, setVotesForSiren] = useState<{ [key: number]: number }>(
    {}
  );

  const initializeGame = (numPlayers: number) => {
    if (playerCount >= 7 && playerCount <= 20) {
      const uniqueNames = new Set(playerNames.filter((name) => name.trim() !== ""));
      
      if (uniqueNames.size !== playerCount) {
        alert("Tous les noms doivent être uniques et non vides.");
        return;
      }
    }
    const roles = [];
    const distribution = getRoleDistribution(numPlayers);

    for (let i = 0; i < distribution.pirates; i++) roles.push("pirate");
    for (let i = 0; i < distribution.marins; i++) roles.push("marin");
    roles.push("sirene");

    const shuffledRoles = shuffleArray(roles);
    const bonusCards = createBonusDeck();

    const players = Array(numPlayers)
      .fill(null)
      .map((_, index) => ({
        id: index,
        name: playerNames[index] || `Joueur ${index + 1}`,
        role: shuffledRoles[index],
        bonusCard: drawBonusCard(bonusCards),
        hasVoted: false,
        isInCrew: false,
        selectedCard: null,
      }));

    setGameState({
      ...gameState,
      phase: "captain-vote",
      players: players as Player[],
      bonusCardsDeck: bonusCards,
      actionCardsDeck: createActionDeck(),
    });

    setVotesForCaptain({});
  };

  const handleVoteForCaptain = (voterId: number, targetId: number) => {
    setVotesForCaptain((prev) => {
      const newVotes = { ...prev };
      newVotes[voterId] = targetId;

      // Si tout le monde a voté, on détermine le capitaine
      if (Object.keys(newVotes).length === gameState.players.length) {
        // Compter les votes
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

  const handlePhaseChange = () => {
    switch (gameState.phase) {
      case "distribution":
        setGameState((prev) => ({ ...prev, phase: "eyes-closed" }));
        break;
      case "eyes-closed":
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

  // Rendu des différentes phases
  const renderPhase = () => {
    switch (gameState.phase) {
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
                  <input type="range" min="7" max="20" value={playerCount} className="w-full mb-4"
                    onChange={(e) => { 
                      const count = Number(e.target.value); setPlayerCount(count);
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
                      <input type="text" value={playerNames[index] || ""}
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
                    onClick={() => initializeGame(playerCount)}
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

      case "captain-vote":
        return (
          <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Élection du Capitaine</h2>
            <div className="grid grid-cols-2 gap-4">
              {gameState.players.map((voter) => {
                const hasVoted = votesForCaptain[voter.id] !== undefined;
                return (
                  <div key={voter.id} className="p-4 border rounded">
                    <h3 className="font-bold mb-2">{voter.name}</h3>
                    {!hasVoted ? (
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
                                onClick={() =>
                                  handleVoteForCaptain(voter.id, candidate.id)
                                }
                                className="bg-indigo-600 text-white py-1 px-3 rounded hover:bg-indigo-700 transition-colors"
                              >
                                Voter pour {candidate.name}
                              </button>
                            ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-green-600">
                        A voté pour{" "}
                        {
                          gameState.players.find(
                            (p) => p.id === votesForCaptain[voter.id]
                          )?.name
                        }
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );

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
                    onClick={() => setShowingRole(player.id)}
                    className="mt-2 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
                  >
                    Voir mon rôle
                  </button>
                  {showingRole === player.id && (
                    <div className="mt-2">
                      <p>Rôle : {player.role}</p>
                      <p>Carte bonus : {player.bonusCard}</p>
                    </div>
                  )}
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

      case "eyes-open":
        return (
          <div className="max-w-4xl mx-auto p-4 text-center">
            <h2 className="text-3xl font-bold mb-8">Pirates et Sirène</h2>
            <p className="mb-4">Regardez qui sont vos alliés...</p>
            <button
              onClick={handlePhaseChange}
              className="bg-indigo-600 text-white py-2 px-4 rounded"
            >
              Fermer les yeux et commencer la partie
            </button>
          </div>
        );

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
                onClick={() =>
                  setGameState((prev) => ({ ...prev, phase: "card-playing" }))
                }
                className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded"
              >
                Confirmer l'équipage
              </button>
            )}
          </div>
        );

      case "card-playing":
        return (
          <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Phase de jeu</h2>
            <div className="grid grid-cols-1 gap-4">
              {gameState.selectedCrew.map((crewId) => {
                const player = gameState.players.find((p) => p.id === crewId);
                return (
                  <div key={crewId} className="p-4 border rounded">
                    <h3 className="font-bold">{player?.name}</h3>
                    {!player?.selectedCard && (
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
                  </div>
                );
              })}
            </div>
          </div>
        );

      case "reveal-cards":
        return (
          <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Révélation des cartes</h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {gameState.selectedCrew.map((crewId) => {
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

      case "result":
        return (
          <div className="max-w-4xl mx-auto p-4">
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
              <p className="text-center text-gray-600">
                Manche {gameState.currentRound}/19
              </p>
            </div>

            {gameState.score.pirates >= 10 || gameState.score.marines >= 10 ? (
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Fin de la partie !</h3>
                {gameState.score.pirates >= 10 ? (
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
                  <>
                    <p className="text-xl mb-4">
                      Les Marines et la Sirène ont gagné !
                    </p>
                    <button
                      onClick={() => window.location.reload()}
                      className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded"
                    >
                      Nouvelle partie
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="text-center">
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

      case "final-vote":
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
              {piratesAndSiren.map((voter) => {
                const hasVoted = votesForSiren[voter.id] !== undefined;
                return (
                  <div key={voter.id} className="p-4 border rounded">
                    <h3 className="font-bold mb-2">{voter.name}</h3>
                    {!hasVoted ? (
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
                                onClick={() =>
                                  handleSirenVote(voter.id, suspect.id)
                                }
                                className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700 transition-colors"
                              >
                                Voter contre {suspect.name}
                              </button>
                            ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-green-600">
                        A voté contre{" "}
                        {
                          gameState.players.find(
                            (p) => p.id === votesForSiren[voter.id]
                          )?.name
                        }
                      </p>
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
                  onClick={() => window.location.reload()}
                  className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
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

  return <div className="min-h-screen bg-gray-100">{renderPhase()}</div>;
}
