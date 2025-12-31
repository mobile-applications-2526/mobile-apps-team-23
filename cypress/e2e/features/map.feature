Feature: Map Page
  Scenario: Navigate to the map page
    Given I visit the home page
    And I insert my email into the email field
    And I insert my password into the password field
    When I click the "Sign in" button
    And I click the "Map" tab
    Then I am on the map page

  Scenario: Fetch locations on the map
    Given I visit the home page
    And map locations are stubbed
    And I insert my email into the email field
    And I insert my password into the password field
    When I click the "Sign in" button
    And I click the "Map" tab
    Then I am on the map page
    And locations have been requested for the map
    And I see the text "Map view not supported on Web"
