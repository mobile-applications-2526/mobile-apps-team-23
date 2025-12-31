import { Given, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("I visit the home page", () => {
  cy.visit("/");
});

Then("I see the text {string}", (text: string) => {
  cy.contains(text).should("be.visible");
});

Then("I am on the home page", () => {
  cy.url().should("eq", `${Cypress.config().baseUrl}/home`);
});
