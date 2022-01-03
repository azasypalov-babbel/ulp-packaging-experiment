Feature: Test the Dictate Wordorder Trainer

  @no_errors @content_locked
  Scenario: Finish the trainer without mistakes
    Given I visit the demo index page
     When I click on the "Dictate Wordorder" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "DictateWordorder" trainer page
     When I complete the trainer with 0 mistakes
     Then I am on a trainer end page
      And I should see that I correctly answered 4 out of 4 questions in the lesson
      And I should see that the Access Content button has the correct text
     Then I check that the Access Content button leads to the prices page

  @continue_button @info_texts
  Scenario: Trainer end continue button
    Given I visit the demo index page
     When I click on the "Dictate Wordorder" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "DictateWordorder" trainer page
     When I enter the correct answer
      And I patiently wait for a continue button
     Then I should see a continue button
     When I click on the continue button
     Then I should not see a continue button
     When I enter the correct answer
      And I patiently wait for a continue button
     Then I should see a continue button
     When I click on the continue button
     Then I should not see a continue button
     When I enter the correct answer
      And I patiently wait for a continue button
     Then I should see a continue button
      And the info text is shown
     When I dismiss the info text
     Then the info text is not shown
     When I click on the continue button
     Then I should not see a continue button
     When I enter the correct answer
      And I patiently wait for a continue button
     Then I should see a continue button
     When I click on the continue button
     Then I am on a trainer end page
      And I should not see a continue button

  @errors @content_unlocked @correct_errors
  Scenario: Finish the trainer with some mistakes
   Given I visit the demo index page as a customer
    When I click on the "Dictate Wordorder" button
    Then I am on the Learning Tip Page
    When I click on the Got It button
    Then I am on a "DictateWordorder" trainer page
    When I complete the trainer with 2 mistakes
    Then I am on a trainer end page
     And I should see that I correctly answered 2 out of 4 questions in the lesson
    When I click on the Correct Errors button
    Then I am on a "DictateWordorder" trainer page
