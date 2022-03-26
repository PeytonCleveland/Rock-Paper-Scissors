const fetchOpponent = async () => {
  const opponentData = await fetch(
    `https://rock-paper-scissors-delta-neon.vercel.app/api/user`
  );
  const opponentJson = await opponentData.json();
  return opponentJson;
};

export default fetchOpponent;
