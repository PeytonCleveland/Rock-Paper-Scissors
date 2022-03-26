const fetchResults = async () => {
  const results = await fetch(
    `https://rock-paper-scissors-delta-neon.vercel.app/api/results`
  );
  const json = await results.json();
  return json;
};

export default fetchResults;
