describe("Home screen navigation", () => {
  it("navigates to the Home tab and shows the home screen", () => {
    cy.visit("/");

    cy.get('[data-testid="tab-home"]').click();

    cy.get('[data-testid="screen-home"]').should("exist");
  });
});
