const generateCPUMove = (validMoves) => {
  return validMoves[Math.floor(Math.random() * validMoves.length)];
};

export default generateCPUMove;
