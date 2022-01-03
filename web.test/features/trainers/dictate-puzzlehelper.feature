Feature: Test the Dictate Puzzlehelper Trainer

  @no_errors @content_locked
  Scenario: Answer all questions without mistakes
    Given I visit the demo index page
     When I click on the "Dictate Puzzlehelper" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "DictatePuzzlehelper" trainer page
     When I complete the trainer with 0 mistakes
     Then I am on a trainer end page
      And I should see that I correctly answered 3 out of 3 questions in the lesson

  @continue_button @info_texts
  Scenario: Trainer end continue button
    Given I visit the demo index page
     When I click on the "Dictate Puzzlehelper" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "DictatePuzzlehelper" trainer page
     When I cheat to the "in" gap
      And I enter the correct solution using the puzzlehelper buttons
      And I click on the done button
     Then I do not see the feedback
      And I should not see an active gap
     Then the info text is shown
     When I dismiss the info text
     Then the info text is not shown
      And I should see a continue button
     When I click on the continue button
     Then I should not see a continue button
      And I am on a trainer end page

  @errors @content_unlocked @correct_errors
  Scenario: Answer all questions with mistakes
    Given I visit the demo index page as a customer
     When I click on the "Dictate Puzzlehelper" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "DictatePuzzlehelper" trainer page
     When I complete the trainer with 2 mistakes
     Then I am on a trainer end page
      And I should see that I correctly answered 2 out of 3 questions in the lesson
     When I click on the Correct Errors button
     Then I am on a "DictatePuzzlehelper" trainer page
