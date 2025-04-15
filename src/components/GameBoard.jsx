# GameBoard.jsx
gameboard_jsx = '''\
import React, { useState } from 'react';
import Dice from './Dice';
import Scoreboard from './Scoreboard';
import { calculateScore, getScoringDiceIndices } from '../utils/scoring';

const initialDice = () => Array(5).fill(0).map(() => Math.floor(Math.random() * 6) + 1);

const GameBoard = () => {
  const [dice, setDice] = useState(initialDice());
  const [selected, setSelected] = useState([]);
  const [score, setScore] = useState(0);
  const [banked, setBanked] = useState(0);
  const [message, setMessage] = useState("Welcome to GREED!");
  const [canBank, setCanBank] = useState(false);
  const [onBoard, setOnBoard] = useState(false);

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
    setBanked(banked + score);
    setScore(0);
    setSelected([]);
    setCanBank(false);
    setDice(initialDice());
    setMessage("Points banked! 🎯 Next player's turn.");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold text-center">🎲 GREED: The Ultimate Challenge</h1>
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
      <Scoreboard score={score} banked={banked} />
    </div>
  );
};

export default GameBoard;
'''

# Dice.jsx
dice_jsx = '''\
const Dice = ({ value, selected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={\`w-16 h-16 flex justify-center items-center rounded-full border-2 m-1 cursor-pointer text-xl font-bold \${selected ? 'bg-yellow-300' : 'bg-green-500'}\`}
    >
      {value}
    </div>
  );
};

export default Dice;
'''

# Scoreboard.jsx
scoreboard_jsx = '''\
const Scoreboard = ({ score, banked }) => (
  <div className="text-center mt-4">
    <p>Unbanked Score: <strong>{score}</strong></p>
    <p>Total Banked: <strong>{banked}</strong></p>
  </div>
);

export default Scoreboard;
'''

# scoring.js
scoring_js = '''\
export function calculateScore(dice) {
  const counts = Array(7).fill(0);
  dice.forEach(d => counts[d]++);

  let score = 0;
  const triple = [];

  for (let i = 1; i <= 6; i++) {
    if (counts[i] >= 3) {
      score += i === 1 ? 1000 : i * 100;
      counts[i] -= 3;
      triple.push(i);
    }
  }

  score += counts[1] * 100;
  score += counts[5] * 50;

  return score;
}

export function getScoringDiceIndices(dice) {
  const scoring = [];
  const counts = Array(7).fill(0);
  dice.forEach(d => counts[d]++);

  for (let i = 1; i <= 6; i++) {
    if (counts[i] >= 3) {
      let found = 0;
      for (let j = 0; j < dice.length; j++) {
        if (dice[j] === i && found < 3) {
          scoring.push(j);
          found++;
        }
      }
    }
  }

  dice.forEach((d, i) => {
    if ((d === 1 || d === 5) && !scoring.includes(i)) {
      scoring.push(i);
    }
  });

  return scoring;
}
'''

# Write files
(src_dir / "App.jsx").write_text(app_jsx)
(components_dir / "GameBoard.jsx").write_text(gameboard_jsx)
(components_dir / "Dice.jsx").write_text(dice_jsx)
(components_dir / "Scoreboard.jsx").write_text(scoreboard_jsx)
(utils_dir / "scoring.js").write_text(scoring_js)
