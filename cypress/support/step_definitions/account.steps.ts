import { Given, When } from "@badeball/cypress-cucumber-preprocessor";

const SUPABASE_URL = "https://acmctsiuvvhusxkwxfil.supabase.co";

Given("account data is stubbed for adding a friend", () => {
  const userId = "00000000-0000-0000-0000-000000000000";

  // Stub the userinfo used by UserService.getOwnUserinfo (for own code)
  cy.intercept("GET", `${SUPABASE_URL}/rest/v1/userinfo*`, (req) => {
    if (req.url.includes("id=")) {
      req.reply({
        statusCode: 200,
        body: [
          {
            id: userId,
            name: "Test User",
            user_code: "MY-CODE-123",
          },
        ],
      });
    } else if (req.url.includes("user_code=")) {
      // Lookup by friend code when sending a request
      req.reply({
        statusCode: 200,
        body: [
          {
            id: "friend-id-123",
            name: "Friend Target",
            user_code: "ABC123",
          },
        ],
      });
    } else {
      req.reply({ statusCode: 200, body: [] });
    }
  }).as("userinfoRequests");

  // No existing friendship, then insert a new one
  cy.intercept("GET", `${SUPABASE_URL}/rest/v1/friendship*`, {
    statusCode: 200,
    body: [],
  }).as("findExistingFriendship");

  cy.intercept("POST", `${SUPABASE_URL}/rest/v1/friendship*`, {
    statusCode: 201,
    body: [{ id: 1 }],
  }).as("createFriendship");
});

When("I open the add friend dialog", () => {
  cy.contains("button", "Add friend").click();
});

When("I send a friend request with code {string}", (code: string) => {
  cy.get('input[placeholder="Friend\'s code"]').type(code);
  cy.contains("button", "Send Request").click();
});
