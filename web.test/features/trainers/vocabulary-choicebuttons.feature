Feature: Test the Vocabulary Choicebuttons Trainer

  @no_errors @content_unlocked @translation_visibility @continue_button @info_popup
  Scenario: Complete the trainer without mistakes and check continue buttons
    Given I visit the demo index page as a customer
     When I click on the "Vocabulary Choicebuttons" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "VocabularyChoicebuttons" trainer page
      And I should not see a translation toggle symbol
      And I should see a translation string
     When I enter the correct answer
      And I enter the correct answer
      And I patiently wait for a continue button
     Then the info text is shown
     When I dismiss the info text
     Then I should see a continue button
     When I click on the continue button
      And I enter the correct answer
      And I patiently wait for a continue button
     Then I should see a continue button
     When I click on the continue button
      And I enter the correct answer
      And I enter the correct answer
      And I patiently wait for a continue button
     Then the info text is shown
     When I dismiss the info text
     Then the info text is not shown
      And I should see a continue button
     When I click on the continue button
      And I enter the correct answer
      And I patiently wait for a continue button
     Then I should see a continue button
     When I click on the continue button
     Then I am on a trainer end page
      And I should see that I correctly answered 4 out of 4 questions in the lesson
      And I should see a Return Home button
      And I should not see a Correct Errors button

  @errors @content_locked @sanity_test
  Scenario: Finish the lesson with 2 mistakes
    Given I visit the demo index page
     When I click on the "Vocabulary Choicebuttons" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "VocabularyChoicebuttons" trainer page
     When I complete the trainer with 2 mistakes
     Then I am on a trainer end page
      And I should see that I correctly answered 2 out of 4 questions in the lesson
      And I should see that the Access Content button has the correct text
      And I should not see a Return Home button
      And I should not see a Correct Errors button
      And I check that the Access Content button leads to the prices page

  @errors @content_unlocked @correct_errors @sanity_test
  Scenario: Complete the trainer with three mistakes
    Given I visit the demo index page as a customer
     When I click on the "Vocabulary Choicebuttons" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "VocabularyChoicebuttons" trainer page
     When I complete the trainer with 1 mistake
     Then I am on a trainer end page
      And I should see that I correctly answered 3 out of 4 questions in the lesson
      And I should see a Return Home button
      And I should see that the Correct Errors button has the text "1"
     When I click on the Correct Errors button
     Then I am on a "VocabularyChoicebuttons" trainer page
     When I complete the trainer with 0 mistakes
     Then I am on a trainer end page
      And I should see that I correctly answered 1 out of 1 questions in the lesson
      And I should not see a Correct Errors button
