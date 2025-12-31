Feature: Home Page
  Scenario: Create a post from the home page
    Given I visit the home page
    And I insert my email into the email field
    And I insert my password into the password field
    When I click the "Sign in" button
    And I create a new post with title "My test post" and content "This is a test post"
    Then I see a post with title "My test post" on the timeline

  Scenario: Like a post on the home page
    Given I visit the home page
    And I insert my email into the email field
    And I insert my password into the password field
    And there is a timeline post titled "Likeable post" with 0 likes
    When I click the "Sign in" button
    And I like the post titled "Likeable post"
    Then the post titled "Likeable post" has 1 likes
