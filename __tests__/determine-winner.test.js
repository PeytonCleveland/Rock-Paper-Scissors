import { expect, describe } from "@jest/globals";
import determineWinner from "../lib/determine-winner.js";

describe("determineWinner", () => {
  it("returns the winner of a rock-paper-scissors game", () => {
    expect(determineWinner("rock", "scissors")).toEqual("player");
    expect(determineWinner("rock", "paper")).toEqual("cpu");
    expect(determineWinner("rock", "rock")).toEqual("draw");
    expect(determineWinner("paper", "scissors")).toEqual("cpu");
    expect(determineWinner("paper", "rock")).toEqual("player");
    expect(determineWinner("paper", "paper")).toEqual("draw");
    expect(determineWinner("scissors", "rock")).toEqual("cpu");
    expect(determineWinner("scissors", "paper")).toEqual("player");
    expect(determineWinner("scissors", "scissors")).toEqual("draw");
  });
});
