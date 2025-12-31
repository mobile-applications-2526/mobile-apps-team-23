import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

const SUPABASE_URL = "https://acmctsiuvvhusxkwxfil.supabase.co";

Given("private conversations are stubbed", () => {
  const userId = "00000000-0000-0000-0000-000000000000";
  const friendId = "11111111-1111-1111-1111-111111111111";

  // Stub auth.getUser inside getAuth()
  cy.intercept("GET", `${SUPABASE_URL}/auth/v1/user`, {
    statusCode: 200,
    body: [{ id: userId, email: "user@email.com" }],
  }).as("getAuthUserForMessages");

  // Stub conversation summaries and later chat history with a simple call counter
  let messageCallCount = 0;
  cy.intercept("GET", `${SUPABASE_URL}/rest/v1/privatemessage*`, (req) => {
    messageCallCount += 1;
    if (messageCallCount === 1) {
      // First call: conversation summaries
      req.reply({
        statusCode: 200,
        body: [
          {
            id: 10,
            sender_id: friendId,
            receiver_id: userId,
            content: "Last message content",
            created_at: new Date().toISOString(),
          },
        ],
      });
    } else {
      // Subsequent calls: chat history including the sent message
      req.reply({
        statusCode: 200,
        body: [
          {
            id: 11,
            sender_id: userId,
            receiver_id: friendId,
            content: "Hello Alice!",
            created_at: new Date().toISOString(),
          },
        ],
      });
    }
  }).as("getPrivateMessages");

  // Stub user info lookups for own user and friends
  cy.intercept("GET", `${SUPABASE_URL}/rest/v1/userinfo*`, (req) => {
    if (req.url.includes("id=in")) {
      // getUsersByIds for conversation list
      req.reply({
        statusCode: 200,
        body: [
          {
            id: friendId,
            name: "Alice Example",
          },
        ],
      });
    } else if (req.url.includes(`id=eq.${userId}`)) {
      // getOwnUserinfo
      req.reply({
        statusCode: 200,
        body: [
          {
            id: userId,
            name: "Current User",
          },
        ],
      });
    } else if (req.url.includes(`id=eq.${friendId}`)) {
      // getUserinfoById when opening chat via friendId
      req.reply({
        statusCode: 200,
        body: [
          {
            id: friendId,
            name: "Alice Example",
          },
        ],
      });
    } else {
      req.reply({ statusCode: 200, body: [] });
    }
  }).as("userinfoForMessages");

  // Stub friend list used when opening new chat picker, matching FriendService.getMyFriends shape
  cy.intercept("GET", `${SUPABASE_URL}/rest/v1/friendship*`, {
    statusCode: 200,
    body: [
      {
        accepted: true,
        sender: { id: friendId, name: "Alice Example" },
        receiver: { id: userId, name: "Current User" },
      },
    ],
  }).as("getFriendsForMessages");

  // Stub send message
  cy.intercept("POST", `${SUPABASE_URL}/rest/v1/privatemessage*`, {
    statusCode: 201,
    body: [
      {
        id: 12,
        sender_id: userId,
        receiver_id: friendId,
        content: "Hello Alice!",
        created_at: new Date().toISOString(),
      },
    ],
  }).as("sendPrivateMessage");
});

When("I open the new chat friend picker", () => {
  cy.contains("Private Messages");
  cy.get("[data-testid='new-chat-button']").click({ force: true });
});

When("I select the friend {string}", (friendName: string) => {
  cy.get(`[data-testid='friend-item-${friendName}']`).click({ force: true });
});

When("I send a private message {string}", (message: string) => {
  cy.get("textarea[placeholder='Type a message to send...']").type(message);
  cy.get("[data-testid='send-message-button']").click({ force: true });
  cy.wait("@sendPrivateMessage");
});

Then("the private message {string} has been sent", (message: string) => {
  cy.wait("@getPrivateMessages");
  cy.contains(message).should("be.visible");
});
