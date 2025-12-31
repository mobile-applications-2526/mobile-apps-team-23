describe("Account screen navigation", () => {
  it("navigates to the Account tab and shows the account screen", () => {
    cy.visit("/");

    cy.get('[data-testid="tab-account"]').click();

    cy.get('[data-testid="screen-account"]').should("exist");
  });
});
