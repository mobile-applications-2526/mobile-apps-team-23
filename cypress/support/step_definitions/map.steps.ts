import { Given, Then } from "@badeball/cypress-cucumber-preprocessor";

const SUPABASE_URL = "https://acmctsiuvvhusxkwxfil.supabase.co";

Given("map locations are stubbed", () => {
  cy.intercept("GET", `${SUPABASE_URL}/rest/v1/locations*`, {
    statusCode: 200,
    body: [],
  }).as("getLocations");
});

Then("locations have been requested for the map", () => {
  cy.wait("@getLocations");
});
