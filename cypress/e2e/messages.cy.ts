describe("Private Messages screen navigation", () => {
  it("navigates to the messages tab and shows the messages screen", () => {
    cy.visit("/");

    cy.get('[data-testid="tab-messages"]').click();

    cy.get('[data-testid="screen-messages"]').should("exist");
  });

  it("shows the 'Private Messages' header when no chat is open", () => {
    cy.visit("/");

    cy.get('[data-testid="tab-messages"]').click();

    cy.contains("Private Messages").should("be.visible");
  });
});
