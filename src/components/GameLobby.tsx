
import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export function GameLobby() {
  const { gameState, createGame, joinGame, startGame } = useGame();
  const [gameName, setGameName] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [gameId, setGameId] = useState('');
  const [activeTab, setActiveTab] = useState('create');

  const handleCreateGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameName && playerName) {
      createGame(gameName, playerName);
    }
  };

  const handleJoinGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameId && playerName) {
      joinGame(gameId, playerName);
    }
  };

  const handleStartGame = () => {
    startGame();
  };

  // If already in a game lobby, show the waiting room
  if (gameState.currentGame && gameState.currentGame.status === 'waiting') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Game Lobby</CardTitle>
          <CardDescription className="text-center">
            Game ID: <span className="font-mono font-bold">{gameState.currentGame.id}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Players</h3>
              <ul className="space-y-2">
                {gameState.currentGame.players.map((player) => (
                  <li key={player.id} className="p-2 bg-secondary rounded-md flex justify-between items-center">
                    <span>{player.name}</span>
                    {player.id === gameState.currentGame?.hostId && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">Host</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          {gameState.isHost && (
            <Button 
              onClick={handleStartGame} 
              className="w-full"
              disabled={gameState.currentGame.players.length < 1}
            >
              Start Game
            </Button>
          )}
          {!gameState.isHost && (
            <p className="text-center text-muted-foreground">Waiting for host to start the game...</p>
          )}
        </CardFooter>
      </Card>
    );
  }

  // Otherwise, show the create/join game form
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Live Trivia Game</CardTitle>
        <CardDescription className="text-center">Create or join a game to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create Game</TabsTrigger>
            <TabsTrigger value="join">Join Game</TabsTrigger>
          </TabsList>
          <TabsContent value="create" className="space-y-4 mt-4">
            <form onSubmit={handleCreateGame} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="gameName" className="text-sm font-medium">
                  Game Name
                </label>
                <Input
                  id="gameName"
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                  placeholder="Enter a name for your game"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="playerName" className="text-sm font-medium">
                  Your Name
                </label>
                <Input
                  id="playerName"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>
              <Button type="submit" className="w-full">Create Game</Button>
            </form>
          </TabsContent>
          <TabsContent value="join" className="space-y-4 mt-4">
            <form onSubmit={handleJoinGame} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="gameId" className="text-sm font-medium">
                  Game ID
                </label>
                <Input
                  id="gameId"
                  value={gameId}
                  onChange={(e) => setGameId(e.target.value)}
                  placeholder="Enter the game ID"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="joinPlayerName" className="text-sm font-medium">
                  Your Name
                </label>
                <Input
                  id="joinPlayerName"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>
              <Button type="submit" className="w-full">Join Game</Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}