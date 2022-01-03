Feature: Test the Card Puzzlehelper Trainer

  @smoke_test
  Scenario: Gaps being revealed throughout the trainer
    Given I visit the demo index page
     When I click on the "Card Puzzlehelper" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "CardPuzzlehelper" trainer page
      And I see the gaps
          | ä-x  |
     When I cheat to the "yes" gap
     Then I see the gaps
          | ä-x  |
          | yes  |
          | sind die |
          | die  |

  @no_errors @content_unlocked @translation_visibility
  Scenario: Fill in with correct answers
   Given I visit the demo index page as a customer
    When I click on the "Card Puzzlehelper" button
    Then I am on the Learning Tip Page
     When I click on the Got It button
    Then I am on a "CardPuzzlehelper" trainer page
     And I should not see a translation string
     And I should not see a translation toggle symbol
    When I complete the trainer with 0 mistakes
    Then I am on a trainer end page
     And I should see that I correctly answered 3 out of 3 questions in the lesson
      And I should see a Return Home button
      And I should not see a Correct Errors button

  @continue_button @info_texts
  Scenario: Trainer end continue button
    Given I visit the demo index page
     When I click on the "Card Puzzlehelper" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "CardPuzzlehelper" trainer page
     When I enter the correct answer
      And I hit the return key
      And I wait for the animations to stop
      And I enter the correct answer
      And I hit the return key
     Then the info text is shown
      And I wait for the animations to stop
     When I dismiss the info text
     Then the info text is not shown
     When I enter the correct answer
      And I hit the return key
      And I enter the correct solution using the puzzlehelper buttons
      And I click on the done button
     Then I do not see the feedback
      And I should not see an active gap
      And I wait for the animations to stop
      And I should not see any babbel markup characters anywhere on the page
      But I should see a continue button
     When I click on the continue button
     Then I am on a trainer end page
      And I should not see a continue button

  @errors @content_unlocked @correct_errors
  Scenario: Fill in with mistakes, then go into purge flow and correct them
   Given I visit the demo index page as a customer
    When I click on the "Card Puzzlehelper" button
    Then I am on the Learning Tip Page
     When I click on the Got It button
    Then I am on a "CardPuzzlehelper" trainer page
    When I complete the trainer with 2 mistakes
    Then I am on a trainer end page
     And I should see that I correctly answered 1 out of 3 questions in the lesson
    When I click on the Correct Errors button
    Then I am on a "CardPuzzlehelper" trainer page

  Scenario: Regression: Continuing fast through the trainer by clicking
   Given I visit the demo index page as a customer
    When I click on the "Card Puzzlehelper" button
    Then I am on the Learning Tip Page
     When I click on the Got It button
    Then I am on a "CardPuzzlehelper" trainer page
     And I wait for the animations to stop
     And I click on the done button
     And I click on the continue button
     And I click on the done button
     And I wait for the animations to stop
    Then the "yes" gap is active
