Feature: Test the Dialog Fillin Trainer

  @no_errors @content_locked
  Scenario: Answer all questions without errors
    Given I visit the demo index page
     When I click on the "Dialog Fillin Short" button
     Then I am on a "DialogFillin" trainer page
     When I complete the trainer with 0 mistakes
     Then I am on a trainer end page
      And I should see that I correctly answered 2 out of 2 questions in the lesson
      And I should not see a Correct Errors button
      And I should not see a Return Home button
      And I should see that the Access Content button has the correct text
     Then I check that the Access Content button leads to the prices page

  @no_errors @content_unlocked @continue_button @info_texts
  Scenario: Trainer end continue button
    Given I visit the demo index page as a customer
     When I click on the "Dialog Fillin" button
     Then I am on a "DialogFillin" trainer page
      And I cheat to the "auf" gap
      And I enter the correct answer
      And I hit the return key
     Then I should not see an active gap
      And I do not see the feedback
      And the info text is shown
     When I wait patiently for a continue button
      And I click on the continue button
     Then I should not see a continue button
      And I am on a trainer end page
      And I should see that I correctly answered 3 out of 3 questions in the lesson
      And I should see a Return Home button
      And I should not see a Correct Errors button

  @errors @correct_errors @content_unlocked
  Scenario: Answer some questions with errors
    Given I visit the demo index page as a customer
     When I click on the "Dialog Fillin Short" button
     Then I am on a "DialogFillin" trainer page
     When I complete the trainer with 1 mistake
     Then I am on a trainer end page
      And I should see that the Correct Errors button has the text "1"
      And I should see that I correctly answered 1 out of 2 questions in the lesson
      And I should see a Return Home button
     When I click on the Correct Errors button
     Then I am on a "DialogFillin" trainer page
