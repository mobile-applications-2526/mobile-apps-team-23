Feature: Settings Page
  Scenario: Navigate to the settings page
    Given I visit the home page
    And I insert my email into the email field
    And I insert my password into the password field
    When I click the "Sign in" button
    And I click the "Settings" tab
    Then I am on the settings page
    And I see the text "Account"
    And I see the text "Sign Out"

  Scenario: Sign out from the settings page
    Given I visit the home page
    And I insert my email into the email field
    And I insert my password into the password field
    When I click the "Sign in" button
    And I click the "Settings" tab
    When I click the "Sign Out" button in settings
    Then I have sent a logout request
