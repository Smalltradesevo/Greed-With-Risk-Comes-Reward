# Add PlayerPanel component and updated GameBoard with multiplayer + score tracking

# Directories
player_panel_path = components_dir / "PlayerPanel.jsx"

# PlayerPanel.jsx
player_panel_code = '''\
const PlayerPanel = ({ players, currentPlayer }) => {
  return (
    <div className="flex justify-around items-center mb-4">
      {players.map((player, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <div
            className={\`text-4xl \${idx === currentPlayer ? 'animate-bounce' : ''}\`}
            role="img"
            aria-label="player"
          >
            {player.emoji}
          </div>
          <div className="text-sm font-semibold">
            {player.name}
          </div>
          <div className="text-lg font-bold">
            {player.score} pts
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlayerPanel;
'''

# Updated GameBoard.jsx with multiplayer turn logic
gameboard_updated_jsx = '''\
import React, { useState } from 'react';
import Dice from './Dice';
import Scoreboard from './Scoreboard';
import PlayerPanel from './PlayerPanel';
import { calculateScore, getScoringDiceIndices } from '../utils/scoring';

const initialDice = () => Array(5).fill(0).map(() => Math.floor(Math.random() * 6) + 1);

const initialPlayers = [
  { name: 'Player 1', emoji: '🧑‍🦱', score: 0 },
  { name: 'Player 2', emoji: '🧑‍🦰', score: 0 },
  { name: 'Player 3', emoji: '🧔', score: 0 },
];

const GameBoard = () => {
  const [dice, setDice] = useState(initialDice());
  const [selected, setSelected] = useState([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("Welcome to GREED!");
  const [canBank, setCanBank] = useState(false);
  const [onBoard, setOnBoard] = useState(false);
  const [players, setPlayers] = useState(initialPlayers);
  const [currentPlayer, setCurrentPlayer] = useState(0);

  const toggleSelect = (i) => {
    if (selected.includes(i)) {
      setSelected(selected.filter(idx => idx !== i));
    } else {
      setSelected([...selected, i]);
    }
  };

  const rollDice = () => {
    if (selected.length === 0) {
      setMessage("You must select at least one scoring die.");
      return;
    }

    const newDice = dice.map((d, i) => selected.includes(i) ? d : Math.floor(Math.random() * 6) + 1);
    const rollScore = calculateScore(newDice);

    if (rollScore === 0) {
      setMessage("No scoring dice! You lost unbanked points.");
      setScore(0);
      setSelected([]);
      setCanBank(false);
      endTurn(false);
      return;
    }

    const totalScore = score + rollScore;
    setScore(totalScore);
    setDice(newDice);
    setSelected([]);
    setCanBank(true);
    setMessage(`Scored ${rollScore} pts! Select dice and roll again or bank.`);

    if (!onBoard && totalScore >= 450) {
      setOnBoard(true);
      setMessage("You're on the board! 🎉 Now you can bank.");
    }
  };

  const bankPoints = () => {
    if (!onBoard) {
      setMessage("You must reach 450 points before banking.");
      return;
    }

    const updated = [...players];
    updated[currentPlayer].score += score;
    setPlayers(updated);

    setMessage(\`\${updated[currentPlayer].name} banked \${score} pts!\`);
    endTurn(true);
  };

  const endTurn = (success) => {
    setScore(0);
    setSelected([]);
    setCanBank(false);
    setOnBoard(false);
    setDice(initialDice());
    setCurrentPlayer((currentPlayer + 1) % players.length);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold text-center">🎲 GREED: The Ultimate Challenge</h1>
      <PlayerPanel players={players} currentPlayer={currentPlayer} />
      <div className="flex justify-center space-x-2">
        {dice.map((d, i) => (
          <Dice key={i} value={d} selected={selected.includes(i)} onClick={() => toggleSelect(i)} />
        ))}
      </div>
      <p className="text-center text-lg">{message}</p>
      <div className="flex justify-center space-x-4">
        <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={rollDice}>Roll</button>
        <button className="bg-yellow-500 text-white px-4 py-2 rounded" onClick={bankPoints} disabled={!canBank}>Bank</button>
      </div>
      <Scoreboard score={score} banked={players[currentPlayer].score} />
    </div>
  );
};

export default GameBoard;
'''

# Write new/updated files
(player_panel_path).write_text(player_panel_code)
(components_dir / "GameBoard.jsx").write_text(gameboard_updated_jsx)

# Re-zip updated project
updated_zip_path = "/mnt/data/GreedGame_FullProject_WithPlayers.zip"
with zipfile.ZipFile(updated_zip_path, "w") as zipf:
    for folder, _, files in os.walk(project_root):
        for file in files:
            file_path = os.path.join(folder, file)
            arcname = os.path.relpath(file_path, project_root)
            zipf.write(file_path, arcname)

updated_zip_path
