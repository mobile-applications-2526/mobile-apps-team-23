import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

const SUPABASE_URL = "https://acmctsiuvvhusxkwxfil.supabase.co";

When(
  "I create a new post with title {string} and content {string}",
  (title: string, content: string) => {
    const createdPost = {
      id: 1,
      title,
      description: content,
      creator: {
        id: "00000000-0000-0000-0000-000000000000",
        name: "Test User",
      },
      like_count: 1,
      is_liked_by_user: true,
      created_at: new Date().toISOString(),
    };

    // Whenever the home timeline fetches posts after creating,
    // return the created post from the backend.
    cy.intercept("GET", `${SUPABASE_URL}/rest/v1/posts*`, {
      statusCode: 200,
      body: [createdPost],
    }).as("getPostsAfterCreate");

    // Open the create post screen from the home page (force in case RN web hides underlying element)
    cy.contains("button", "Create Post").click({ force: true });

    // Fill in the title and content fields on the create screen
    cy.get('[data-testid="post-title-input"]').type(title, { force: true });

    cy.get('[data-testid="post-content-input"]').type(content, {
      force: true,
    });

    // Submit the form (force in case the button wrapper is visually hidden)
    cy.contains("button", "Create Post").click({ force: true });

    // After creating, navigate back to the home page so the
    // timeline refetches posts and shows the created one.
    cy.visit("/");
    cy.wait("@getPostsAfterCreate");
  }
);

Given(
  "there is a timeline post titled {string} with {int} likes",
  (title: string, likeCount: number) => {
    const initialPost = {
      id: 2,
      title,
      description: "Test description",
      creator: {
        id: "00000000-0000-0000-0000-000000000000",
        name: "Test User",
      },
      like_count: likeCount,
      is_liked_by_user: false,
      created_at: new Date().toISOString(),
    };

    const updatedPost = {
      ...initialPost,
      like_count: likeCount + 1,
      is_liked_by_user: true,
    };

    let callCount = 0;

    cy.intercept("GET", `${SUPABASE_URL}/rest/v1/posts*`, (req) => {
      callCount += 1;
      req.reply({
        statusCode: 200,
        body: callCount === 1 ? [initialPost] : [updatedPost],
      });
    }).as("getTimelinePosts");

    cy.intercept("POST", `${SUPABASE_URL}/rest/v1/postlikes*`, {
      statusCode: 201,
      body: {},
    }).as("likePost");
  }
);

When("I like the post titled {string}", (title: string) => {
  cy.wait("@getTimelinePosts");

  cy.contains(title)
    .parents()
    .first()
    .within(() => {
      // The like button shows the like count (starting at 0)
      cy.contains("button", "0").click();
    });

  cy.wait("@likePost");
  cy.wait("@getTimelinePosts");
});

Then("I see a post with title {string} on the timeline", (title: string) => {
  cy.contains(title).should("be.visible");
});

Then(
  "the post titled {string} has {int} likes",
  (title: string, expectedLikes: number) => {
    cy.contains(title)
      .parents()
      .first()
      .within(() => {
        cy.contains("button", expectedLikes.toString()).should("be.visible");
      });
  }
);
