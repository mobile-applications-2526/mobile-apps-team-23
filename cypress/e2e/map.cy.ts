describe("Map screen navigation", () => {
  it("navigates to the Map tab and shows the map screen", () => {
    cy.visit("/");

    cy.get('[data-testid="tab-map"]').click();

    cy.get('[data-testid="screen-map"]').should("exist");
  });
});
