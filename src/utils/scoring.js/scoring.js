export function calculateScore(dice) {
  const counts = Array(7).fill(0);
  dice.forEach(d => counts[d]++);

  let score = 0;
  const isStraight = counts.slice(1).every(c => c === 1);
  const threePairs = counts.filter(c => c === 2).length === 3;

  if (isStraight) return 1500;
  if (threePairs) return 750;

  for (let i = 1; i <= 6; i++) {
    if (counts[i] >= 3) {
      score += i === 1 ? 1000 : i * 100;
      counts[i] -= 3;
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

  // Check triples
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

  // Add individual 1s and 5s not already used
  dice.forEach((d, i) => {
    if ((d === 1 || d === 5) && !scoring.includes(i)) {
      scoring.push(i);
    }
  });

  return scoring;
}
