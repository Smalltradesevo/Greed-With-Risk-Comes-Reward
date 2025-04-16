export function calculateScore(dice, isFirstRoll = false) {
  const counts = Array(7).fill(0); // index 0 is unused
  dice.forEach(d => counts[d]++);

  let score = 0;

  // Check for straight: 1-2-3-4-5 or 2-3-4-5-6
  const sorted = [...dice].sort().join('');
  const isStraight = sorted === '12345' || sorted === '23456';

  if (isFirstRoll && isStraight) {
    return 1200;
  }

  // Handle 3-of-a-kind (or more)
  for (let i = 1; i <= 6; i++) {
    if (counts[i] >= 3) {
      score += (i === 1) ? 1000 : i * 100;
      counts[i] -= 3;
    }
  }

  // Add leftover 1s and 5s
  score += counts[1] * 100;
  score += counts[5] * 50;

  return score;
}

export function getScoringDiceIndices(dice) {
  const scoring = [];
  const counts = Array(7).fill(0);
  dice.forEach(d => counts[d]++);

  // Add indices of triple values
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

  // Add remaining 1s and 5s
  dice.forEach((d, i) => {
    if ((d === 1 || d === 5) && !scoring.includes(i)) {
      scoring.push(i);
    }
  });

  return scoring;
}
