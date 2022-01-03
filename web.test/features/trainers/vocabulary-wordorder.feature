Feature: Test the Vocabulary Wordorder Trainer

  @no_errors @content_locked
  Scenario: Finish the trainer without mistakes
    Given I visit the demo index page
     When I click on the "Vocabulary Wordorder" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "VocabularyWordorder" trainer page
     When I complete the trainer with 0 mistakes
     Then I am on a trainer end page
      And I should see that I correctly answered 3 out of 3 questions in the lesson
      And I should not see a Correct Errors button
      And I should not see a Return Home button
      And I should see that the Access Content button has the correct text

  @continue_button @info_texts
  Scenario: Trainer end continue button
    Given I visit the demo index page
     When I click on the "Vocabulary Wordorder" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "VocabularyWordorder" trainer page
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
     Then the info text is shown
     When I dismiss the info text
     Then I should see a continue button
     When I click on the continue button
     Then I should not see a continue button
      And I am on a trainer end page

  @errors @correct_errors @content_unlocked
  Scenario: Finish the trainer with some mistakes
    Given I visit the demo index page as a customer
     When I click on the "Vocabulary Wordorder" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "VocabularyWordorder" trainer page
     When I complete the trainer with 2 mistakes
     Then I am on a trainer end page
      And I should see that I correctly answered 1 out of 3 questions in the lesson
      And I should see that the Correct Errors button has the text "2"
     When I click on the Correct Errors button
     Then I am on a "VocabularyWordorder" trainer page
