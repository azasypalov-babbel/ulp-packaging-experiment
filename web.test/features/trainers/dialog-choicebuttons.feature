Feature: Test the Dialog Choicebuttons Trainer

  @no_errors @content_locked
  Scenario: Finish trainer without mistakes
    Given I visit the demo index page
     When I click on the "Dialog Choicebuttons" button
     Then I am on a "DialogChoicebuttons" trainer page
     When I complete the trainer with 0 mistakes
     Then I am on a trainer end page
      And I should see that I correctly answered 3 out of 3 questions in the lesson
      And I should see that the Access Content button has the correct text
      And I should not see a Return Home button
      And I should not see a Correct Errors button

  @errors @correct_errors @content_unlocked @continue_button @info_texts @sanity_test @alternative_solution
  Scenario: Trainer end continue button
    Given I visit the demo index page as a customer
     When I click on the "Dialog Choicebuttons" button
     Then I am on a "DialogChoicebuttons" trainer page
      And I should not see a continue button
     When I enter the correct answer
     Then I should not see a continue button
     When I enter an incorrect answer
      And I wait for the animations to stop
      And I enter the correct answer
     Then the info text is shown
     When I dismiss the info text
     Then the info text is not shown
     When I enter an incorrect answer
      And I wait for the animations to stop
      And I enter the correct answer
      And I enter the alternative answer
      And I patiently wait for the continue button
      And I click on the continue button
     Then I should not see a continue button
      And I am on a trainer end page
      And I should see a Return Home button
      And I should see a Correct Errors button
      And I should see that I correctly answered 2 out of 3 questions in the lesson
      And I should see that the Correct Errors button has the text "1"
     When I click on the Correct Errors button
     Then I am on a "DialogChoicebuttons" trainer page
      And I wait until I see the next question and answer
     When I complete the trainer with 0 mistakes
     Then I am on a trainer end page
      And I should see that I correctly answered 1 out of 1 questions in the lesson
      And I should see a Return Home button
      And I should not see a Correct Errors button

  @errors @content_locked
  Scenario: Answer all questions and make some errors, go through the purge flow
    Given I visit the demo index page
     When I click on the "Dialog Choicebuttons" button
     Then I am on a "DialogChoicebuttons" trainer page
     When I complete the trainer with 2 mistakes
     Then I am on a trainer end page
      And I should see that I correctly answered 1 out of 3 questions in the lesson
      And I should not see a Return Home button
      And I should not see a Correct Errors button
      And I should see that the Access Content button has the correct text
