/// <reference types="cypress" />
describe("home page end to end tests", () => {
  beforeEach("login and visite the home page", () => {
    cy.login();
    cy.visit("/home");
  });
  it("button clicks should work", () => {
    cy.get("#askButton").click();
    cy.url().should("eq", "http://localhost:4200/ask");
    cy.visit("/home");
    cy.get("#sendButton").click();
    cy.url().should("eq", "http://localhost:4200/send");
  });
});
