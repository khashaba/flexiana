Cypress.Commands.add("restartGame", () => {
  cy.get(".footnote").contains("Restart...").click();
  cy.get("#board").should("be.visible");
  cy.get("#message").should("have.text","Select an orange piece to move.");
});

Cypress.Commands.add("getTile", (name) => {
  cy.get(`[name='${name}']`);
});

Cypress.Commands.add("shouldBeMine", (name) => {
  cy.getTile(name).should("have.attr", "src").and("eq", "you1.gif");
});
Cypress.Commands.add("shouldNotBeMine", (name) => {
  cy.getTile(name).should("have.attr", "src").and("not.eq", "you1.gif");
  cy.getTile(name).should("have.attr", "src").and("not.eq", "you2.gif");
});
Cypress.Commands.add("shouldBeSelected", (name) => {
  cy.getTile(name).should("have.attr", "src").and("eq", "you2.gif");
});
Cypress.Commands.add("shouldBeTheComputer", (name) => {
  cy.getTile(name).should("have.attr", "src").and("eq", "me1.gif");
});
