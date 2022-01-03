Feature: Test the Card Choicebuttons Trainer

  @smoke_test
  Scenario: Gaps being revealed throughout the trainer
    Given I visit the demo index page
     When I click on the "Card Choicebuttons" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "CardChoicebuttons" trainer page
      And I see the gaps
          | Hallo  |
          | nicht  |
     When I cheat to the "right" gap
     Then I see the gaps
          | Hallo  |
          | nicht  |
          | right  |
          | yes    |

  @no_errors @content_locked @translation_visibility @feedback_message
  Scenario: Finish trainer without mistakes
    Given I visit the demo index page
     When I click on the "Card Choicebuttons" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "CardChoicebuttons" trainer page
      And I should see a translation string
      And I should not see a translation toggle symbol
     When I complete the trainer with 0 mistakes
     Then I am on a trainer end page
      And I should see that the feedback message grade is "high"
      And I should see that I correctly answered 3 out of 3 questions in the lesson
      And I should see that the Access Content button has the correct text
      And I should not see a Return Home button
      And I should not see a Correct Errors button
      And I check that the Access Content button leads to the prices page

  @errors @correct_errors @continue_button @info_texts @content_unlocked
  Scenario: Trainer end continue button
    Given I visit the demo index page as a customer
     When I click on the "Card Choicebuttons" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "CardChoicebuttons" trainer page
     When I enter the alternative solution
      And I wait for the animations to stop
     Then the info text is shown
     When I dismiss the info text
     Then the info text is not shown
     When I enter an incorrect answer
      And I wait for the animations to stop
      And I enter the correct answer
      And I wait until I see the next question and answer
      And I enter the correct answer
      And I wait until I see the next question and answer
      And I enter the correct answer
      And I wait for the animations to stop
     Then I should not see any babbel markup characters anywhere on the page
     When I patiently wait for a continue button
     Then I should see a continue button
     When I click on the continue button
     Then I should not see a continue button
      And I am on a trainer end page
      And I should see a Return Home button
      And I should see a Correct Errors button
      And I should see that I correctly answered 2 out of 3 questions in the lesson
      And I should see that the Correct Errors button has the text "1"
     When I click on the Correct Errors button
     Then I am on a "CardChoicebuttons" trainer page

  @errors @content_locked @feedback_message
  Scenario: Fill in with two mistakes
    Given I visit the demo index page
     When I click on the "Card Choicebuttons" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "CardChoicebuttons" trainer page
     When I complete the trainer with 2 mistakes
     Then I am on a trainer end page
      And I should see that the feedback message grade is "medium"
      And I should see that I correctly answered 1 out of 3 questions in the lesson
      And I should see that the Access Content button has the correct text
      And I should not see a Return Home button
      And I should not see a Correct Errors button
