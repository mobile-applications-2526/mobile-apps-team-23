import { When, Then } from "@badeball/cypress-cucumber-preprocessor";

const SUPABASE_URL = "https://acmctsiuvvhusxkwxfil.supabase.co";

When('I click the "Sign Out" button in settings', () => {
  cy.intercept("POST", `${SUPABASE_URL}/auth/v1/logout*`, {
    statusCode: 200,
    body: {},
  }).as("logoutRequest");

  cy.contains("button", "Sign Out").click();
});

Then("I have sent a logout request", () => {
  cy.wait("@logoutRequest");
});
