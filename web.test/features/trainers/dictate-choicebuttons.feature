Feature: Test the Dictate Choicebuttons Trainer

  @no_errors @content_locked
  Scenario: Answer all questions without errors
    Given I visit the demo index page
     When I click on the "Dictate Choicebuttons" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "DictateChoicebuttons" trainer page
     When I complete the trainer with 0 mistakes
     Then I am on a trainer end page
      And I should see that I correctly answered 3 out of 3 questions in the lesson

  @continue_button @info_texts
  Scenario: Trainer end continue button
    Given I visit the demo index page
     When I click on the "Dictate Choicebuttons" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "DictateChoicebuttons" trainer page
     When I enter the correct answer
      And I enter the correct answer
      And I patiently wait for a continue button
     Then I should see a continue button
     When I click on the continue button

     Then I wait until I see the next question and answer
     When I enter the correct answer
     Then the info text is shown
      And I should see a continue button
     When I click on the continue button

     Then I wait until I see the next question and answer
     When I enter the correct answer
     Then the info text is shown
      And I should see View All Tips(2)
     When I dismiss the info text
     Then the info text is not shown
     When I click on the continue button
     Then I am on a trainer end page
      And I should not see a continue button

  @errors @correct_errors @content_unlocked
  Scenario: Answer all questions with a mistake
    Given I visit the demo index page as a customer
     When I click on the "Dictate Choicebuttons" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "DictateChoicebuttons" trainer page
     When I complete the trainer with 1 mistake
     Then I am on a trainer end page
      And I should see that I correctly answered 2 out of 3 questions in the lesson
      And I should see a Return Home button
      And I should see that the Correct Errors button has the text "1"
     When I click on the Correct Errors button
     Then I am on a "DictateChoicebuttons" trainer page
     When I complete the trainer with 0 mistakes
     Then I am on a trainer end page
      And I should see that I correctly answered 1 out of 1 questions in the lesson
      And I should see a Return Home button
      And I should not see a Correct Errors button
