const fetchOpponent = async () => {
  const opponentData = await fetch(
    `https://rock-paper-scissors-delta-neon.vercel.app/api/user`
  );
  const opponentJson = await opponentData.json();

  // Simulate a loading time
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return opponentJson;
};

export default fetchOpponent;
