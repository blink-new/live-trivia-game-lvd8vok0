
import { useState, useEffect } from 'react';
import { GameProvider } from './context/GameContext';
import { useGame } from './context/GameContext';
import { GameLobby } from './components/GameLobby';
import { GamePlay } from './components/GamePlay';
import { Toaster } from './components/ui/toaster';
import { ThemeProvider } from './components/ThemeProvider';
import { Button } from './components/ui/button';
import { MoonIcon, SunIcon } from 'lucide-react';

function GameContainer() {
  const { gameState } = useGame();
  
  if (!gameState.currentGame) {
    return <GameLobby />;
  }
  
  if (gameState.currentGame.status === 'waiting') {
    return <GameLobby />;
  }
  
  return <GamePlay />;
}

function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme}
      className="absolute top-4 right-4"
    >
      {theme === 'light' ? <MoonIcon size={20} /> : <SunIcon size={20} />}
    </Button>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="trivia-theme">
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
        <ThemeToggle />
        <div className="container mx-auto py-8 md:py-12">
          <GameProvider>
            <GameContainer />
          </GameProvider>
        </div>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;