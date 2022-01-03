Feature: Test the Keyboard Trainer

  @no_errors @content_locked
  Scenario: Answer all questions without errors
    Given I visit the demo index page
     When I click on the "Keyboard" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "Keyboard" trainer page
     When I complete the trainer with 0 mistakes
     Then I am on a trainer end page
      And I should see that I correctly answered 3 out of 3 questions in the lesson
      And I check that the Access Content button leads to the prices page

  Scenario: Seeing transliteration instructions
    Given I visit the demo index page
     When I click on the "Keyboard" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "Keyboard" trainer page
      And the "й" gap is active
      And I should see transliteration instructions "press j, j and ⏎"

  @errors @content_unlocked @no_purge @info_texts @alternative_solution
  Scenario: Answer some questions with errors
    Given I visit the "RUS" demo index page as a customer
     When I click on the "Keyboard" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "Keyboard" trainer page

     When I enter the alternative solution
      And I hit the return key
     Then I wait until I see the next question and answer

     When I enter an incorrect answer
      And I hit the return key
      And I wait 0.3 seconds
      And I hit the return key
      And I wait until I see the next question and answer
     # using the transliteration table
      And I enter the alternative solution
      And I hit the return key
     Then the info text is shown
      And I wait until I see the next question and answer
     When I dismiss the info text

      And I enter the correct answer
      And I hit the return key
     Then I wait until I see View All Tips(2)
      And I should see a continue button

     When I dismiss the info text
     Then the info text is not shown
     When I click on the continue button
     Then I am on a trainer end page
      And I should see that I correctly answered 2 out of 3 questions in the lesson
      And I should not see a Correct Errors button
