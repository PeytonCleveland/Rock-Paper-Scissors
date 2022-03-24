// Library imports
import determineWinner from "./lib/determine-winner.js";
import generateCpuMove from "./lib/generate-cpu-move.js";
import setHTML from "./lib/set-html.js";

// Constant variables
const VALID_ROUNDS = [5, 7, 9];
const VALID_MOVES = ["rock", "paper", "scissors"];
const MENU_BUTTONS = ["start", "rules", "settings"];
const GAME_OVER_OPTIONS = ["restart", "main"];

// Game class
class Game {
  constructor() {
    this.currentRound = 0;
    this.playerOneScore = 0;
    this.playerTwoScore = 0;
  }
}

// App class
class App {
  constructor() {
    this._rounds = 5;
    this.changeScreens("menu", "game", () => {
      MENU_BUTTONS.forEach((button) => {
        document
          .getElementById(button)
          .addEventListener("click", (e) => this.handleMenuClick(e));
      });
    });
    this.game = null;
    this.hasMoveListeners = false;
  }
  set rounds(value) {
    if (VALID_ROUNDS.includes(value)) {
      this._rounds = value;
    } else {
      throw new Error(
        "Invalid number of rounds, must be 5, 7, or 9.  You entered: " + value
      );
    }
  }

  get rounds() {
    return this._rounds;
  }

  changeScreens(openedScreen, closedScreen, onChange) {
    document.getElementById(openedScreen).style.display = "flex";
    document.getElementById(closedScreen).style.display = "none";
    if (onChange) {
      onChange();
    }
  }

  startGame() {
    this.game = new Game();
    this.changeScreens("game", "menu", () => {
      setHTML("rounds", this.rounds);
      setHTML("playerOneScore", 0);
      setHTML("playerTwoScore", 0);
      if (!this.hasMoveListeners) {
        VALID_MOVES.forEach((move) => {
          document
            .getElementById(move)
            .addEventListener("click", (e) =>
              this.handleMove(e.currentTarget.id)
            );
        });
        document
          .getElementById("back")
          .addEventListener("click", (e) => this.changeScreens("menu", "game"));
        this.hasMoveListeners = true;
      }
    });
  }

  updateGame() {
    if (
      this.game.playerOneScore >= this.rounds / 2 ||
      this.game.playerTwoScore >= this.rounds / 2
    ) {
      this.endGame();
    }
  }

  endGame() {
    this.changeScreens("gameOverScreen", "game", () => {
      setHTML(
        "final-result",
        this.game.playerOneScore > this.game.playerTwoScore
          ? "Game Over, You win!"
          : "Game Over, You lose!"
      );
      GAME_OVER_OPTIONS.forEach((option) => {
        document
          .getElementById(option)
          .addEventListener("click", (e) => this.handleGameOverClick(e));
      });
    });
  }

  handleGameOverClick(e) {
    if (e.currentTarget.id === "restart") {
      this.startGame();
    } else {
      console.log("back");
      this.changeScreens("menu", "gameOverScreen");
    }
  }

  handleMove(move) {
    if (VALID_MOVES.includes(move)) {
      const computerMove = generateCpuMove(VALID_MOVES);
      const winner = determineWinner(move, computerMove);
      this.showResult(move, computerMove, winner);
      if (winner === "player") {
        this.game.playerOneScore++;
        setHTML("playerOneScore", this.game.playerOneScore);
      } else if (winner === "cpu") {
        this.game.playerTwoScore++;
        setHTML("playerTwoScore", this.game.playerTwoScore);
      }
      this.currentRound++;
      this.updateGame();
    } else {
      throw new Error("Invalid move");
    }
  }

  async showResult(playerMove, cpuMove, winner) {
    document.getElementById("move-controls").style.display = "none";
    document.getElementById("result").style.display = "flex";
    setHTML("player-move-text", playerMove);
    setHTML("cpu-move-text", cpuMove);
    setHTML(
      "player-move-icon",
      playerMove === "rock" ? "👊🏼" : playerMove === "paper" ? "✋🏼" : "✌🏼"
    );
    setHTML(
      "cpu-move-icon",
      cpuMove === "rock" ? "👊🏼" : cpuMove === "paper" ? "✋🏼" : "✌🏼"
    );
    const resultText =
      winner === "player" ? "Beats" : winner === "cpu" ? "Loses to" : "Draws";
    setHTML("result-text", resultText);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    document.getElementById("move-controls").style.display = "flex";
    document.getElementById("result").style.display = "none";
  }

  handleMenuClick(e) {
    if (e.currentTarget.id === "start") {
      this.startGame();
    } else if (e.currentTarget.id === "rules") {
      this.changeScreens("rulesScreen", "menu");
    } else if (e.currentTarget.id === "settings") {
      this.changeScreens("settingsScreen", "menu", () => {
        VALID_ROUNDS.forEach((round) => {
          document.getElementById(round).addEventListener("click", (e) => {
            this.changeScreens("menu", "settingsScreen", () => {
              this.rounds = parseInt(e.currentTarget.id);
            });
          });
        });
      });
    }
  }
}

// Launch the app when the DOM is ready
const launchApp = () => {
  const app = new App();
};

window.onload = launchApp;
