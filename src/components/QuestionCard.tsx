
import { useState, useEffect } from 'react';
import { Question } from '../types';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { motion } from 'framer-motion';

interface QuestionCardProps {
  question: Question;
  onAnswer: (selectedOption: number) => void;
  timeUp: () => void;
}

export function QuestionCard({ question, onAnswer, timeUp }: QuestionCardProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(question.timeLimit);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!isAnswered) {
            timeUp();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAnswered, timeUp]);

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    
    setSelectedOption(index);
    setIsAnswered(true);
    onAnswer(index);
  };

  const progressPercentage = (timeLeft / question.timeLimit) * 100;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">{question.question}</CardTitle>
        <div className="mt-2">
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-right text-sm mt-1">{timeLeft}s</p>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.options.map((option, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              variant={selectedOption === index ? "default" : "outline"}
              className={`w-full h-16 text-lg ${
                isAnswered && index === question.correctAnswer
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : isAnswered && selectedOption === index && index !== question.correctAnswer
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : ""
              }`}
              onClick={() => handleSelectOption(index)}
              disabled={isAnswered}
            >
              {option}
            </Button>
          </motion.div>
        ))}
      </CardContent>
      <CardFooter className="flex justify-center">
        {isAnswered && (
          <p className="text-center font-medium">
            {selectedOption === question.correctAnswer
              ? "Correct! Well done! 🎉"
              : `Wrong! The correct answer is: ${question.options[question.correctAnswer]}`}
          </p>
        )}
      </CardFooter>
    </Card>
  );
}