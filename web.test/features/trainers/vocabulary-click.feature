Feature: Test the VocabularyClick Trainer

  @continue_button
  Scenario: Trainer end continue button
    Given I visit the demo index page as a customer
     When I click on the "Vocabulary Click" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "VocabularyClick" trainer page
     When I wait for the animations to stop
      And I click on the correct card
      And I wait for the animations to stop
      And I click on the correct card
      And I wait for the animations to stop
      And I click on the correct card
      And I wait for the animations to stop
     Then I should see a continue button
     When I click on the continue button
     Then I am on a "VocabularyClick" trainer page
     When I wait for the animations to stop
      And I click on the correct card
      And I wait for the animations to stop
      And I click on the correct card
      And I wait for the animations to stop
      And I click on the correct card
      And I wait for the animations to stop
      And I click on the correct card
     Then I should see a continue button
     When I click on the continue button
     Then I am on a trainer end page
      And I should not see a continue button

  @no_errors @content_locked
  Scenario: Finish trainer without mistakes
    Given I visit the demo index page
     When I click on the "Vocabulary Click" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "VocabularyClick" trainer page
     When I complete the trainer with 0 mistakes
     Then I am on a "VocabularyClick" trainer page
     When I complete the trainer with 0 mistakes
     Then I am on a trainer end page
      And I should see that I correctly answered 7 out of 7 questions in the lesson
      And I should see that the Access Content button has the correct text
     Then I check that the Access Content button leads to the prices page

  @errors @correct_errors @content_unlocked
   Scenario: Answer only two questions correctly
    Given I visit the demo index page as a customer
     When I click on the "Vocabulary Click" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "VocabularyClick" trainer page
     When I complete the trainer with 2 mistakes
     Then I am on a "VocabularyClick" trainer page
     When I complete the trainer with 2 mistakes
     Then I am on a trainer end page
      And I should see that I correctly answered 3 out of 7 questions in the lesson
      And I should see that the Correct Errors button has the text "4"
     When I click on the Correct Errors button
     Then I am on a "VocabularyClick" trainer page
