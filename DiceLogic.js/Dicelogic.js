// Greed: The Ultimate Challenge – Dice Logic (JavaScript Version)

function rollDice(num) {
  return Array.from({ length: num }, () => Math.floor(Math.random() * 6) + 1);
}

function scoreRoll(dice) {
  let counts = [0, 0, 0, 0, 0, 0];
  dice.forEach(d => counts[d - 1]++);

  let score = 0;
  let scoringDice = [];

  // Check for straight (1–6)
  if (counts.every(count => count === 1)) {
    score += 1200;
    scoringDice = [...dice];
    return { score, scoringDice, allScored: true, special: "straight" };
  }

  // Check for three of a kind
  for (let i = 0; i < 6; i++) {
    if (counts[i] >= 3) {
      let baseScore = i === 0 ? 1000 : (i + 1) * 100;
      score += baseScore;
      scoringDice.push(...Array(3).fill(i + 1));
      counts[i] -= 3;
    }
  }

  // Check for 1s and 5s
  score += counts[0] * 100;
  score += counts[4] * 50;
  scoringDice.push(...Array(counts[0]).fill(1));
  scoringDice.push(...Array(counts[4]).fill(5));

  let allScored = scoringDice.length === dice.length;
  return { score, scoringDice, allScored };
}

// Example turn:
let dice = rollDice(5);
let result = scoreRoll(dice);
console.log("Rolled:", dice);
console.log("Scored:", result);
