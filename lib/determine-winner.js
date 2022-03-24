const determineWinner = (move, cpuMove) => {
  if (move === "rock") {
    if (cpuMove === "rock") {
      return "draw";
    } else if (cpuMove === "paper") {
      return "cpu";
    } else {
      return "player";
    }
  } else if (move === "paper") {
    if (cpuMove === "rock") {
      return "player";
    } else if (cpuMove === "paper") {
      return "draw";
    } else {
      return "cpu";
    }
  } else if (move === "scissors") {
    if (cpuMove === "rock") {
      return "cpu";
    } else if (cpuMove === "paper") {
      return "player";
    } else {
      return "draw";
    }
  }
};

export default determineWinner;
