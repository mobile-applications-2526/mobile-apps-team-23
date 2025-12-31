import { Given, When } from "@badeball/cypress-cucumber-preprocessor";

const SUPABASE_URL = "https://acmctsiuvvhusxkwxfil.supabase.co";

Given("I insert my email into the email field", () => {
  cy.get("input[placeholder='email@address.com']").click();
  cy.get("input[placeholder='email@address.com']").type("user@email.com");
});

Given("I insert my password into the password field", () => {
  cy.get("input[placeholder='Password']").click();
  cy.get("input[placeholder='Password']").type("password01");
});

When('I click the "Sign in" button', () => {
  cy.intercept("POST", `${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    statusCode: 200,
    body: {
      access_token: "fake-access-token",
      token_type: "bearer",
      expires_in: 3600,
      refresh_token: "fake-refresh-token",
      user: {
        id: "00000000-0000-0000-0000-000000000000",
        email: "user@email.com",
        user_metadata: { name: "Test User" },
        aud: "authenticated",
        role: "authenticated",
      },
    },
  }).as("loginRequest");

  cy.intercept("GET", `${SUPABASE_URL}/auth/v1/user`, {
    statusCode: 200,
    body: [
      {
        id: "00000000-0000-0000-0000-000000000000",
        email: "user@email.com",
        name: "Test User",
      },
    ],
  }).as("getProfileRequest");

  cy.get("button").contains("Sign in").click();

  cy.wait("@loginRequest");
});
