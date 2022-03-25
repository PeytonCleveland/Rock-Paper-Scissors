const postResult = async (winner, loser) => {
  const result = await fetch(`http://localhost:3000/results`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      winner,
      loser
    })
  });
  const json = await result.json();
  return json;
};

export default postResult;
