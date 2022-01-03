Feature: Test the Vocabulary Puzzlehelper Trainer

  @no_errors @translation_visibility @content_unlocked
  Scenario: Finish the lesson without mistakes
   Given I visit the demo index page as a customer
    When I click on the "Vocabulary Puzzlehelper" button
    Then I am on the Learning Tip Page
    When I click on the Got It button
    Then I am on a "VocabularyPuzzlehelper" trainer page
     And I should not see a translation toggle symbol
     And I should see a translation string
    When I complete the trainer with 0 mistakes
    Then I am on a "VocabularyPuzzlehelper" trainer page
     And I should see a translation toggle symbol
    When I toggle the translation
    Then I should see a translation string
    When I complete the trainer with 0 mistakes
    Then I am on a trainer end page
     And I should see that I correctly answered 5 out of 5 questions in the lesson
     And I should see a Return Home button
     And I should not see a Correct Errors button

  @errors @content_unlocked @correct_errors @continue_button @info_popup
  Scenario: Trainer end continue button
    Given I visit the demo index page as a customer
     When I click on the "Vocabulary Puzzlehelper" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "VocabularyPuzzlehelper" trainer page
     When I cheat to the "Hyäne" gap
      And I enter an incorrect solution using the puzzlehelper buttons
      And I click on the done button
     Then I see that I was mistaken
     When I hit the return key
      And I enter the correct solution using the puzzlehelper buttons
      And I click on the done button
      And I patiently wait for a continue button
     Then I do not see the feedback
      And I should see a continue button
      And the info text is shown
     When I dismiss the info text
     Then the info text is not shown
     When I click on the continue button
     Then I am on a "VocabularyPuzzlehelper" trainer page
     When I enter the correct solution
      And I click on the done button
      And I patiently wait for a continue button
     Then I do not see the feedback
      And I should see a continue button
      And the info text is not shown
     When I click on the continue button
      And I enter an incorrect solution
      And I hit the return key
     Then I see that I was mistaken
     When I choose to try again
      And I enter the correct solution
      And I click on the done button
      And I enter the correct solution
      And I click on the done button
      And I patiently wait for a continue button
     Then I do not see the feedback
      And I should see a continue button
      And the info text is shown
     When I dismiss the info text
     Then the info text is not shown
     When I click on the continue button
     Then I am on a trainer end page
      And I should not see a continue button
      And I should see that I correctly answered 3 out of 5 questions in the lesson
      And I should see that the Correct Errors button has the text "2"
     When I click on the Correct Errors button
     Then I am on a "VocabularyPuzzlehelper" trainer page
