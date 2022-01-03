Feature: Test the Dialog Dictatefillin Trainer

  @no_errors @content_locked
  Scenario: Answer all questions without errors
    Given I visit the demo index page
     When I click on the "Dialog Dictatefillin" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "DialogDictatefillin" trainer page
     When I complete the trainer with 0 mistakes
     Then I am on a trainer end page
      And I should see that I correctly answered 4 out of 4 questions in the lesson
      And I should see that the Access Content button has the correct text
     Then I check that the Access Content button leads to the prices page

  @continue_button @info_texts
  Scenario: Trainer end continue button
    Given I visit the demo index page
     When I click on the "Dialog Dictatefillin" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "DialogDictatefillin" trainer page
      And I cheat to the "eine sehr gute" gap
      And I enter the correct answer
      And I hit the return key
     Then I do not see the feedback
      And I should not see an active gap
      And the info text is shown
     When I dismiss the info text
     Then the info text is not shown
      And I should see a continue button
     When I click on the continue button
     Then I should not see a continue button
      And I am on a trainer end page

  @errors @content_unlocked @correct_errors
  Scenario: Answer some questions with errors
    Given I visit the demo index page as a customer
     When I click on the "Dialog Dictatefillin" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "DialogDictatefillin" trainer page
     When I complete the trainer with 2 mistakes
     Then I am on a trainer end page
      And I should see that I correctly answered 2 out of 4 questions in the lesson
      And I should see a Return Home button
      And I should see that the Correct Errors button has the text "2"
     When I click on the Correct Errors button
     Then I am on a "DialogDictatefillin" trainer page
