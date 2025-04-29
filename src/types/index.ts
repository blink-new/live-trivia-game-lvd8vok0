
export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  timeLimit: number;
}

export interface Game {
  id: string;
  name: string;
  hostId: string;
  players: Player[];
  questions: Question[];
  currentQuestionIndex: number;
  status: 'waiting' | 'playing' | 'finished';
}

export interface Player {
  id: string;
  name: string;
  score: number;
  answers: {
    questionId: string;
    selectedOption: number;
    isCorrect: boolean;
    timeSpent: number;
  }[];
}

export interface GameState {
  currentGame: Game | null;
  currentPlayer: Player | null;
  isHost: boolean;
}