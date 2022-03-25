const compareStats = (a, b) => {
  if (a.stats.wins < b.stats.wins) {
    return 1;
  }
  if (a.stats.wins > b.stats.wins) {
    return -1;
  }
  return 0;
};

export default compareStats;
