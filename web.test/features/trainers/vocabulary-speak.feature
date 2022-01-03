Feature: Test the VocabularySpeak Trainer without actual speak interaction
  - In this mode, it is not possible to make errors

  @no_errors @content_locked @continue_button
  Scenario: Listen to the sentences
    Given I visit the demo index page
     When I click on the "Vocabulary Speak B3" button
      And I choose to continue without speech recognition
     Then I am on a "VocabularySpeak" trainer page
     When I complete the trainer with 0 mistakes
     Then I am on a "VocabularySpeak" trainer page
     When I complete the trainer with 0 mistakes
     Then I am on a trainer end page
      And I should not see a continue button
      And I should see that I correctly answered 5 out of 5 questions in the lesson
      And I should see that the Access Content button has the correct text
      And I check that the Access Content button leads to the prices page

  @no_errors @content_unlocked @continue_button
  Scenario: Listen to the sentences
    Given I visit the demo index page as a customer
     When I click on the "Vocabulary Speak B4" button
      And I choose to continue without speech recognition
     Then I am on a "VocabularySpeakChrome" trainer page
      And I wait patiently for a continue button
     When I click on the continue button
      And I click on the continue button
      And I click on the continue button
     Then I am on a "VocabularySpeakChrome" trainer page
      And I should see a continue button
     When I click on the continue button
      And I click on the continue button
     Then I am on a trainer end page
      And I should not see a continue button
      And I should see that I correctly answered 5 out of 5 questions in the lesson
      And I should see a Return Home button
      And I should not see a Correct Errors button
