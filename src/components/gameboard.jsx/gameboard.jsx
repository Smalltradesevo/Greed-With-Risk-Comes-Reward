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
  const [message, setMessage] = useState("🎲 Welcome to GREED!");
  const [canBank, setCanBank] = useState(false);
  const [onBoard, setOnBoard] = useState(false);
  const [isFirstRoll, setIsFirstRoll] = useState(true);
  const [celebrate, setCelebrate] = useState(false);

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
      setMessage("⚠️ Select at least one scoring die!");
      return;
    }

    const newDice = dice.map((d, i) => selected.includes(i) ? d : Math.floor(Math.random() * 6) + 1);
    const rollScore = calculateScore(newDice, isFirstRoll);
    const scoring = getScoringDiceIndices(newDice);

    if (rollScore === 0) {
      setMessage("😵 No scoring dice! Turn over.");
      resetTurn(false);
      return;
    }

    const totalScore = score + rollScore;
    setScore(totalScore);
    setDice(newDice);
    setSelected([]);
    setCanBank(true);
    setIsFirstRoll(false);

    if (scoring.length === 5) {
      // All 5 dice scored — explode into new roll
      setCelebrate(true);
      setTimeout(() => {
        setCelebrate(false);
        setDice(initialDice());
        setIsFirstRoll(true);
        setMessage("🎉 All dice scored! New roll or bank?");
      }, 1500);
    } else {
      setMessage(`✅ Scored ${rollScore} pts. Keep going or bank?`);
    }

    if (!onBoard && totalScore >= 450) {
      setOnBoard(true);
      setMessage("🎯 You're on the board! You may bank now.");
    }
  };

  const bankPoints = () => {
    if (!onBoard) {
      setMessage("❌ You must reach 450 pts before banking.");
      return;
    }

    const updated = [...players];
    updated[currentPlayer].score += score;
    setPlayers(updated);

    setMessage(`💰 ${updated[currentPlayer].name} banked ${score} pts!`);
    resetTurn(true);
  };

  const resetTurn = (success) => {
    setScore(0);
    setSelected([]);
    setCanBank(false);
    setOnBoard(false);
    setIsFirstRoll(true);
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
      {celebrate && (
        <div className="text-center text-2xl font-bold text-red-500 animate-bounce">🎉 All Five Scored! 🎉</div>
      )}
      <p className="text-center text-lg">{message}</p>
      <div className="flex justify-center space-x-4">
        <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={rollDice}>🎲 Roll</button>
        <button className="bg-yellow-500 text-white px-4 py-2 rounded" onClick={bankPoints} disabled={!canBank}>💰 Bank</button>
      </div>
      <Scoreboard score={score} banked={players[currentPlayer].score} />
    </div>
  );
};

export default GameBoard;
