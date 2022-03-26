const fetchResults = async () => {
  const results = await fetch(
    `https://rock-paper-scissors-delta-neon.vercel.app/api/results`
  );
  const json = await results.json();

  // Simulate a loading time
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return json;
};

export default fetchResults;
