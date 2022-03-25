// Library imports
import checkLocalStorage from "./lib/check-local-storage.js";
import setLocalStorage from "./lib/set-local-storage.js";
import generateCpuMove from "./lib/generate-cpu-move.js";
import determineWinner from "./lib/determine-winner.js";
import fetchOpponent from "./lib/fetch-opponent.js";
import compareStats from "./lib/compare-stats.js";
import fetchResults from "./lib/fetch-results.js";
import postResult from "./lib/post-result.js";
import setHTML from "./lib/set-html.js";

// Constant variables
const VALID_ROUNDS = [5, 7, 9];
const VALID_MOVES = ["rock", "paper", "scissors"];
const MENU_BUTTONS = ["start", "leaderboard-button", "settings"];
const GAME_OVER_OPTIONS = ["restart", "main"];

// Game class
class Game {
  constructor(playerOne, playerTwo) {
    this.currentRound = 0;
    this.playerOneScore = 0;
    this.playerTwoScore = 0;
    this.playerOne = playerOne;
    this.playerTwo = playerTwo;
  }
}

// App class
class App {
  constructor() {
    this._rounds = 5;
    // Launches the main menu, and sets up listeners for menu buttons
    this.changeScreens("menu", "game", () => {
      MENU_BUTTONS.forEach((button) => {
        document
          .getElementById(button)
          .addEventListener("click", (e) => this.handleMenuClick(e));
      });
    });
    // Stores the current game object
    this.game = null;
    // Stores whether or not move listeners have been added
    this.hasMoveListeners = false;
    this._user = checkLocalStorage();
  }

  // Setter for rounds, validates input
  set rounds(value) {
    if (VALID_ROUNDS.includes(value)) {
      this._rounds = value;
    } else {
      throw new Error(
        "Invalid number of rounds, must be 5, 7, or 9.  You entered: " + value
      );
    }
  }

  // Getter for rounds
  get rounds() {
    return this._rounds;
  }

  set user(user) {
    this._user = user;
  }

  get user() {
    return this._user;
  }

  // Changes screens and executes callback function, if provided
  changeScreens(openedScreen, closedScreen, onChange) {
    document.getElementById(openedScreen).style.display = "flex";
    document.getElementById(closedScreen).style.display = "none";
    if (onChange) {
      onChange();
    }
  }

  getUserInformation() {
    this.changeScreens("info", "menu", () => {
      document.getElementById("playerOneNameInput").value = "";
      document.getElementById("info-button").addEventListener("click", () => {
        let user = document.getElementById("playerOneNameInput").value;
        setLocalStorage(user);
        this.user = user;
        this.startGame("info", user);
      });
    });
  }

  // Starts a new game and sets up listeners for move buttons
  startGame(screen, playerOne) {
    this.changeScreens("loading", screen);
    fetchOpponent()
      .then((opponent) => {
        this.game = new Game(
          playerOne,
          opponent.firstName + " " + opponent.lastName
        );
        this.changeScreens("game", "loading", () => {
          setHTML("rounds", this.rounds);
          setHTML("playerOneScore", 0);
          setHTML("playerTwoScore", 0);
          setHTML("playerOneName", this.game.playerOne);
          setHTML("playerTwoName", this.game.playerTwo);
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
              .addEventListener("click", (e) =>
                this.changeScreens("menu", "game")
              );
            this.hasMoveListeners = true;
          }
        });
      })
      .catch((error) => {
        console.log(error);
        setHTML(
          "loading-message",
          "Server appears down, are you sure it's running?"
        );
        setHTML("searching", "Failed to connect");
      });
  }

  // Checks if the game is over, and ends it if it is
  updateGame() {
    if (
      this.game.playerOneScore >= this.rounds / 2 ||
      this.game.playerTwoScore >= this.rounds / 2
    ) {
      this.endGame();
    }
  }

  // Determines a winner and displays the result
  endGame() {
    this.changeScreens("gameOverScreen", "game", () => {
      let winner;
      let loser;
      if (this.game.playerOneScore > this.game.playerTwoScore) {
        winner = this.game.playerOne;
        loser = this.game.playerTwo;
      } else {
        winner = this.game.playerTwo;
        loser = this.game.playerOne;
      }
      postResult(winner, loser).finally(() => {
        setHTML(
          "final-result",
          winner === this.game.playerOne
            ? "Game Over, You win!"
            : "Game Over, You lose!"
        );
        GAME_OVER_OPTIONS.forEach((option) => {
          document
            .getElementById(option)
            .addEventListener("click", (e) => this.handleGameOverClick(e));
        });
      });
    });
  }

  // Handles menu button clicks for the game over screen
  handleGameOverClick(e) {
    if (e.currentTarget.id === "restart") {
      this.startGame("gameOverScreen", this.user);
    } else {
      this.changeScreens("menu", "gameOverScreen");
    }
  }

  // Handles move button clicks within the game
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

  async loadLeaderboard() {
    let table = document.getElementById("table");
    table.innerHTML = "";
    let results = await fetchResults();
    results.sort(compareStats);
    let labels = ["Rank", "Name", "Wins", "Losses"];
    let row = document.createElement("tr");
    labels.forEach((label) => {
      let cell = document.createElement("td");
      cell.innerHTML = label;
      row.appendChild(cell);
      table.appendChild(row);
    });
    results.forEach((result, index) => {
      let row = document.createElement("tr");
      let rank = document.createElement("td");
      let player = document.createElement("td");
      let wins = document.createElement("td");
      let losses = document.createElement("td");
      rank.innerHTML = index + 1;
      player.innerHTML = result.name;
      wins.innerHTML = result.stats.wins;
      losses.innerHTML = result.stats.losses;
      row.appendChild(rank);
      row.appendChild(player);
      row.appendChild(wins);
      row.appendChild(losses);
      table.appendChild(row);
    });
  }

  // Displays the result of a round
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

  // Handles menu button clicks for the main menu
  handleMenuClick(e) {
    if (e.currentTarget.id === "start") {
      this.user ? this.startGame("menu", this.user) : this.getUserInformation();
    } else if (e.currentTarget.id === "leaderboard-button") {
      this.changeScreens("leaderboard", "menu", () => {
        this.loadLeaderboard();
        document
          .getElementById("leaderboard-back")
          .addEventListener("click", (e) =>
            this.changeScreens("menu", "leaderboard")
          );
      });
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
