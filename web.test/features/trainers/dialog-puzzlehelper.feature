Feature: Test the Dialog Puzzlehelper Trainer

  @no_errors @content_locked
  Scenario: Answer all questions without errors
    Given I visit the demo index page
     When I click on the "Dialog Puzzlehelper" button
     Then I am on a "DialogPuzzlehelper" trainer page
     When I complete the trainer with 0 mistakes
     Then I am on a trainer end page
      And I should see that I correctly answered 3 out of 3 questions in the lesson
      And I should not see a Return Home button
      And I should not see a Correct Errors button

  @continue_button @info_texts
  Scenario: Trainer end continue button
    Given I visit the demo index page
     When I click on the "Dialog Puzzlehelper" button
     Then I am on a "DialogPuzzlehelper" trainer page
      And the info text is not shown
     When I cheat to the "nächsten" gap
      And I enter the correct solution using the puzzlehelper buttons
      And I click on the done button
     Then I do not see the feedback
      And I should not see an active gap
      But the info text is shown
     When I dismiss the info text
     Then the info text is not shown
     When I should see a continue button
     Then I click on the continue button
     Then I should not see a continue button
      And I am on a trainer end page

  @errors @content_unlocked @correct_errors
  Scenario: Answer some questions with errors then purge those errors
    Given I visit the demo index page as a customer
     When I click on the "Dialog Puzzlehelper" button
     Then I am on a "DialogPuzzlehelper" trainer page
     When I complete the trainer with 2 mistakes
     Then I am on a trainer end page
      And I should see that I correctly answered 1 out of 3 questions in the lesson
      And I should see a Return Home button
      And I should see that the Correct Errors button contains the text "2"
     When I click on the Correct Errors button
     Then I am on a "DialogPuzzlehelper" trainer page
