const PlayerPanel = ({ players, currentPlayer }) => {
  return (
    <div className="flex justify-around items-center mb-4">
      {players.map((player, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <div
            className={`text-4xl ${idx === currentPlayer ? 'animate-bounce' : ''}`}
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
