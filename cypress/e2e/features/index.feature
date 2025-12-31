Feature: Index Page
  Scenario: Logging in
    Given I visit the home page
    And I insert my email into the email field
    And I insert my password into the password field
    When I click the "Sign in" button
    Then I am on the home page