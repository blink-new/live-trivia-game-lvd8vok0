
import { createContext, useContext, useState, ReactNode } from 'react';
import { Game, Player, GameState } from '../types';
import { mockQuestions } from '../data/mockQuestions';

// For now, we'll use mock data and local state
// In a real app, this would connect to a backend service

interface GameContextType {
  gameState: GameState;
  createGame: (name: string, playerName: string) => void;
  joinGame: (gameId: string, playerName: string) => void;
  startGame: () => void;
  submitAnswer: (questionId: string, selectedOption: number) => void;
  nextQuestion: () => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>({
    currentGame: null,
    currentPlayer: null,
    isHost: false,
  });

  const createGame = (name: string, playerName: string) => {
    const playerId = `player-${Date.now()}`;
    const gameId = `game-${Date.now()}`;
    
    const newPlayer: Player = {
      id: playerId,
      name: playerName,
      score: 0,
      answers: [],
    };
    
    const newGame: Game = {
      id: gameId,
      name,
      hostId: playerId,
      players: [newPlayer],
      questions: mockQuestions,
      currentQuestionIndex: 0,
      status: 'waiting',
    };
    
    setGameState({
      currentGame: newGame,
      currentPlayer: newPlayer,
      isHost: true,
    });
  };
  
  const joinGame = (gameId: string, playerName: string) => {
    // In a real app, this would make an API call
    // For now, we'll simulate joining a game
    if (gameState.currentGame && gameState.currentGame.id === gameId) {
      const playerId = `player-${Date.now()}`;
      
      const newPlayer: Player = {
        id: playerId,
        name: playerName,
        score: 0,
        answers: [],
      };
      
      const updatedGame = {
        ...gameState.currentGame,
        players: [...gameState.currentGame.players, newPlayer],
      };
      
      setGameState({
        currentGame: updatedGame,
        currentPlayer: newPlayer,
        isHost: false,
      });
    }
  };
  
  const startGame = () => {
    if (gameState.currentGame && gameState.isHost) {
      setGameState({
        ...gameState,
        currentGame: {
          ...gameState.currentGame,
          status: 'playing',
        },
      });
    }
  };
  
  const submitAnswer = (questionId: string, selectedOption: number) => {
    if (!gameState.currentGame || !gameState.currentPlayer) return;
    
    const currentQuestion = gameState.currentGame.questions[gameState.currentGame.currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    
    // Calculate score based on correctness
    const scoreToAdd = isCorrect ? 100 : 0;
    
    const answer = {
      questionId,
      selectedOption,
      isCorrect,
      timeSpent: 5, // In a real app, this would be calculated
    };
    
    const updatedPlayer = {
      ...gameState.currentPlayer,
      score: gameState.currentPlayer.score + scoreToAdd,
      answers: [...gameState.currentPlayer.answers, answer],
    };
    
    // Update the player in the game's players array
    const updatedPlayers = gameState.currentGame.players.map(player => 
      player.id === updatedPlayer.id ? updatedPlayer : player
    );
    
    setGameState({
      ...gameState,
      currentGame: {
        ...gameState.currentGame,
        players: updatedPlayers,
      },
      currentPlayer: updatedPlayer,
    });
  };
  
  const nextQuestion = () => {
    if (!gameState.currentGame || !gameState.isHost) return;
    
    const nextIndex = gameState.currentGame.currentQuestionIndex + 1;
    const isLastQuestion = nextIndex >= gameState.currentGame.questions.length;
    
    setGameState({
      ...gameState,
      currentGame: {
        ...gameState.currentGame,
        currentQuestionIndex: nextIndex,
        status: isLastQuestion ? 'finished' : 'playing',
      },
    });
  };
  
  const resetGame = () => {
    setGameState({
      currentGame: null,
      currentPlayer: null,
      isHost: false,
    });
  };
  
  return (
    <GameContext.Provider
      value={{
        gameState,
        createGame,
        joinGame,
        startGame,
        submitAnswer,
        nextQuestion,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}