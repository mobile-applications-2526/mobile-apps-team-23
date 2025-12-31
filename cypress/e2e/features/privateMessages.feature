Feature: Private Messages Page
  Scenario: View existing conversations
    Given I visit the home page
    And private conversations are stubbed
    And I insert my email into the email field
    And I insert my password into the password field
    When I click the "Sign in" button
    And I click the "Messages" tab
    Then I am on the messages page
    And I see the text "Private Messages"
    And I see the text "Last message content"

  Scenario: Start a new chat and send a message
    Given I visit the home page
    And private conversations are stubbed
    And I insert my email into the email field
    And I insert my password into the password field
    When I click the "Sign in" button
    And I click the "Messages" tab
    Then I am on the messages page
    When I open the new chat friend picker
    And I select the friend "Alice Example"
#    And I send a private message "Hello Alice!"
#    Then the private message "Hello Alice!" has been sent
