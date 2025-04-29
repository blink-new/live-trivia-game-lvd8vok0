
import { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { QuestionCard } from './QuestionCard';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { motion, AnimatePresence } from 'framer-motion';

export function GamePlay() {
  const { gameState, submitAnswer, nextQuestion } = useGame();
  const [showResults, setShowResults] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const currentGame = gameState.currentGame;
  const isHost = gameState.isHost;

  if (!currentGame) return null;

  const currentQuestionIndex = currentGame.currentQuestionIndex;
  const currentQuestion = currentGame.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === currentGame.questions.length - 1;

  useEffect(() => {
    // Reset the results view when moving to a new question
    setShowResults(false);
    
    // Start a countdown before showing the question
    setCountdown(3);
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [currentQuestionIndex]);

  const handleAnswer = (selectedOption: number) => {
    submitAnswer(currentQuestion.id, selectedOption);
    setShowResults(true);
  };

  const handleTimeUp = () => {
    // If time is up and no answer was submitted, submit a default "no answer"
    submitAnswer(currentQuestion.id, -1);
    setShowResults(true);
  };

  const handleNextQuestion = () => {
    nextQuestion();
  };

  // Show countdown before question
  if (countdown !== null) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <motion.div
          key={countdown}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="text-6xl font-bold"
        >
          {countdown}
        </motion.div>
        <p className="mt-4 text-xl">Get ready!</p>
      </div>
    );
  }

  // Show game finished screen
  if (currentGame.status === 'finished') {
    // Sort players by score in descending order
    const sortedPlayers = [...currentGame.players].sort((a, b) => b.score - a.score);
    
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Game Finished!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-4">Final Scores</h3>
              <div className="space-y-3">
                {sortedPlayers.map((player, index) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-3 rounded-lg flex justify-between items-center ${
                      index === 0 ? "bg-yellow-100 dark:bg-yellow-900" : 
                      index === 1 ? "bg-gray-100 dark:bg-gray-800" : 
                      index === 2 ? "bg-amber-100 dark:bg-amber-900" : 
                      "bg-secondary"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-lg">{index + 1}</span>
                      <span>{player.name}</span>
                    </div>
                    <span className="font-bold">{player.score} pts</span>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button onClick={() => window.location.reload()}>
                Play Again
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <span className="text-sm font-medium">Question</span>
          <h2 className="text-xl font-bold">{currentQuestionIndex + 1} of {currentGame.questions.length}</h2>
        </div>
        <div className="text-right">
          <span className="text-sm font-medium">Players</span>
          <p className="font-bold">{currentGame.players.length}</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <QuestionCard
            question={currentQuestion}
            onAnswer={handleAnswer}
            timeUp={handleTimeUp}
          />
        </motion.div>
      </AnimatePresence>

      {isHost && showResults && (
        <div className="mt-6 flex justify-center">
          <Button 
            onClick={handleNextQuestion}
            size="lg"
            className="animate-pulse"
          >
            {isLastQuestion ? "Show Final Results" : "Next Question"}
          </Button>
        </div>
      )}

      {!isHost && showResults && (
        <div className="mt-6 text-center">
          <p className="text-muted-foreground">Waiting for host to continue...</p>
        </div>
      )}
    </div>
  );
}