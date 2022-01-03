Feature: This feature tests that after completing a lesson without errors,
  - a lead sees a lesson end page with the Access Content button

  @no_errors @content_locked @smoke_test
  Scenario: Go through a lesson without errors and end up on the locked end page
    Given I visit the demo index page
     When I click on the "Vocabulary Click" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "VocabularyClick" trainer page
     When I complete the trainer with 0 mistakes
     Then I am on a "VocabularyClick" trainer page
     When I complete the trainer with 0 mistakes
     Then I am on a trainer end page
      And I should not see a Correct Errors button
      And I should not see a Return Home button
      And I should see that I correctly answered 7 out of 7 questions in the lesson
      And I should see that the Access Content button has the correct text
      And I check that the Access Content button leads to the prices page
