Feature: Account Page
  Scenario: Navigate to the account page
    Given I visit the home page
    And I insert my email into the email field
    And I insert my password into the password field
    When I click the "Sign in" button
    And I click the "Account" tab
    Then I am on the account page
    And I see the text "Friends"
    And I see the text "Friend Requests"
    And I see the text "Add friend"

  Scenario: Open add friend dialog and send request
    Given I visit the home page
    And account data is stubbed for adding a friend
    And I insert my email into the email field
    And I insert my password into the password field
    When I click the "Sign in" button
    And I click the "Account" tab
    And I open the add friend dialog
    And I send a friend request with code "DAAN-123"
    Then I see the text "Add new friend"
