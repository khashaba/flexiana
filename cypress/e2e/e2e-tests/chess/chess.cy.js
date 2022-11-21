/// <reference types="Cypress" />

describe("e2e chess test", () => {
  before(() => {
    cy.visit("https://www.gamesforthebrain.com/game/checkers/");
    cy.get("#board").should("be.visible");
  });

  it("User should be able to restart the game", () => {
    cy.restartGame();
  });

  it("User should make their first move", () => {
    cy.getTile("space42").click();
    cy.shouldBeSelected("space42");
    cy.getTile("space33").click();
    cy.shouldBeMine("space33");
  });

  it("User should wait for the computer to play", () => {
    cy.get("#message").should("not.have.text", "Please wait.");
    cy.get("#message").should("have.text", "Make a move.");
    cy.get(".line")
      .eq(3)
      .find("[src='me1.gif']")
      .should("be.visible")
  });

  it("User should make their second move", () => {
    cy.getTile("space33").click();
    cy.get("#message").should(
      "not.have.text",
      "Please wait."
    );
    cy.shouldBeSelected("space33");
    cy.getTile("space24").click();
    cy.shouldNotBeMine("space33");
  });

  it("Computer take the user's piece", () => {
    cy.shouldNotBeMine("space24");
    cy.shouldBeTheComputer("space13");
  });

  it("User should be able to restart the game", () => {
    cy.restartGame();
  });
});
