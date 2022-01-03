Feature: Test the Comprehension Text Trainer

  @no_errors @content_unlocked @translation_visibility
  Scenario: Finish trainer without mistakes
    Given I visit the demo index page as a customer
     When I click on the "Comprehension Text" button
     Then I am on a "ComprehensionText" trainer page
      And I should not see a translation string
      And I should see a translation toggle symbol
     When I toggle the translation
     Then I should see a translation string
     When I complete the trainer with 0 mistakes
     Then I should see a continue button
     When I click on the continue button
     Then I am on a trainer end page
      And I should see that I correctly answered 3 out of 3 questions in the lesson
      And I should not see a Correct Errors button
      And I should see a Return Home button

  @translation_visibility
  Scenario: Translations are not shown if t.visibility is set to none
    Given I visit the demo index page as a customer
      And I set the URL param "translationVisibility" to "none"
     When I click on the "Comprehension Text" button
     Then I am on a "ComprehensionText" trainer page
      And I should not see a translation string
      And I should not see a translation toggle symbol
     When I open the solution slider
      And I wait for the animations to stop
      And I enter the correct answer
     Then I should not see a translation string
      And I should not see a translation toggle symbol

  @continue_button @errors @content_locked @no_purge
  Scenario: Finish trainer with mistake
    Given I visit the demo index page
     When I click on the "Comprehension Text" button
     Then I am on a "ComprehensionText" trainer page
     When I open the solution slider
      And I wait for the animations to stop
     Then I should see that the button with the incorrect answer turns red when clicked
      And I wait for the animations to stop
     Then I should see that the button with the incorrect answer turns red when clicked
      And I wait for the animations to stop
     Then I should see that the button with the correct answer turns green when clicked
      And I wait for the animations to stop
     Then I should see that the button with the incorrect answer turns red when clicked
      And I wait for the animations to stop
     Then I should see that the button with the correct answer turns green when clicked
      And I wait for the animations to stop
     When I enter the correct answer
      And I wait for the animations to stop
     Then I should see a continue button
     When I click on the continue button
     Then I am on a trainer end page
      And I should not see a continue button
      And I should see that I correctly answered 1 out of 3 questions in the lesson
      And I should not see a Correct Errors button

  @question_sheet @translation_visibility
  Scenario: Trainer and Player component look as expected. T.visibility is set to full
   Given I visit the demo index page as a customer
    # 'full' works as 'partial' in this trainer!
     And I set the URL param "translationVisibility" to "full"
    When I click on the "Comprehension Text" button
    Then I am on a "ComprehensionText" trainer page
     And I should see a title
     And I should see a description
     And I should see a "white" "up" arrow button
     And I should not see a translation string
     And I should see a translation toggle symbol
    When I wait 2 seconds
    Then I should see an item text
     And I should not see the question sheet
     And I should see an "orange" "up" arrow button
    When I open the solution slider
    Then I should see a "white" "down" arrow button
     And I should see that I am answering question 1 of 3
     And I should see a question
     And I should see at least one correct answer
    When I click on the correct answer
     And I wait for the animations to stop
    Then I should see that I am answering question 2 of 3
    When I enter an incorrect answer
     And I wait for the animations to stop
    Then I should see that I am answering question 2 of 3
    When I click on the correct answer
     And I wait for the animations to stop
    Then I should see that I am answering question 3 of 3
    When I click on the correct answer
    Then I should see a continue button
     And I should not see any arrow button
     And I should not see the question sheet
