Feature: Test that lesson end page contains a localized feedback message plus display name

  @no_errors @localized_message
  Scenario: If the user is learning GERMAN the message should be displayed in GERMAN
    Given I visit the demo index page as a customer
     When I click on the "Vocabulary Click" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "VocabularyClick" trainer page
     When I complete the trainer with 0 mistakes
     Then I am on a "VocabularyClick" trainer page
     When I complete the trainer with 0 mistakes
     Then I am on a trainer end page
      And I should see that the motivational message is in "German"
      And I should see that the motivational message contains "User"
