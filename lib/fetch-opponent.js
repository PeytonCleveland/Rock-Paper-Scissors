const fetchOpponent = async () => {
  const opponentData = await fetch(`http://localhost:3000/user`);
  const opponentJson = await opponentData.json();

  // Simulate a loading time
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return opponentJson;
};

export default fetchOpponent;
