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

Then("I am on the map page", () => {
  cy.url().should("eq", `${Cypress.config().baseUrl}/map`);
});

Then("I am on the messages page", () => {
  cy.url().should("eq", `${Cypress.config().baseUrl}/privateMessages`);
});

Then("I am on the account page", () => {
  cy.url().should("eq", `${Cypress.config().baseUrl}/account`);
});

Then("I am on the settings page", () => {
  cy.url().should("eq", `${Cypress.config().baseUrl}/settings`);
});
