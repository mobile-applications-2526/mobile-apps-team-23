describe("Login flow", () => {
  it("allows a user to fill in credentials and press login", () => {
    cy.visit("/");

    cy.get('[data-testid="email"]').type("test@test.com");
    cy.get('[data-testid="password"]').type("123456");

    cy.get('[data-testid="login-button"]').click();
  });
});
