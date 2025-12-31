Feature: Index Page
  Scenario: Logging in
    Given I visit the home page
    And I insert my email into the email field
    And I insert my password into the password field
    When I click the "Sign in" button
    Then I am on the home page

  Scenario: Navigate to the map tab
    Given I visit the home page
    And I insert my email into the email field
    And I insert my password into the password field
    When I click the "Sign in" button
    And I click the "Map" tab
    Then I am on the map page

  Scenario: Navigate to the messages tab
    Given I visit the home page
    And I insert my email into the email field
    And I insert my password into the password field
    When I click the "Sign in" button
    And I click the "Berichten" tab
    Then I am on the messages page

  Scenario: Navigate to the account tab
    Given I visit the home page
    And I insert my email into the email field
    And I insert my password into the password field
    When I click the "Sign in" button
    And I click the "Account" tab
    Then I am on the account page