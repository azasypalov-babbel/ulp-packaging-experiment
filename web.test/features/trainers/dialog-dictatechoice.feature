Feature: Test the Dialog Dictatechoice Trainer

  @errors @content_unlocked @correct_errors
  Scenario: Answer all questions correctly
    Given I visit the demo index page as a customer
     When I click on the "Dialog Dictatechoice" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "DialogDictatechoice" trainer page
     When I complete the trainer with 1 mistake
     Then I am on a trainer end page
      And I should see that I correctly answered 2 out of 3 questions in the lesson
      And I should see a Return Home button
      And I should see a Correct Errors button
      And I should see that the Correct Errors button has the text "1"
     When I click on the Correct Errors button
     Then I am on a "DialogDictatechoice" trainer page

  @no_errors @continue_button @info_texts @content_unlocked
  Scenario: Trainer end continue button
    Given I visit the demo index page
     When I click on the "Dialog Dictatechoice" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "DialogDictatechoice" trainer page
      And I should not see a continue button
     When I enter the correct answer
     Then the info text is shown
     When I dismiss the info text
     Then the info text is not shown
     When I enter the correct answer
      And I enter the correct answer
     Then I should not see a continue button
     When I enter the correct answer
      And I wait for the animations to stop
     Then I should see a continue button
     When I click on the continue button
     Then I should not see a continue button
      And I am on a trainer end page

  @errors @content_locked
  Scenario: Answer all questions and make some errors
    Given I visit the demo index page
     When I click on the "Dialog Dictatechoice" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "DialogDictatechoice" trainer page
      And I complete the trainer with 2 mistakes
     Then I am on a trainer end page
      And I should see that I correctly answered 1 out of 3 questions in the lesson
      And I should not see a Correct Errors button
      And I should not see a Return Home button
      And I should see that the Access Content button has the correct text
     Then I check that the Access Content button leads to the prices page
