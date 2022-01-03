Feature: Test the Dictate Fillin Trainer

  @no_errors @content_unlocked
  Scenario: Answer all questions without errors
    Given I visit the demo index page as a customer
     When I click on the "Dictate Fillin" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "DictateFillin" trainer page
     When I complete the trainer with 0 mistakes
     Then I am on a trainer end page
      And I should see that I correctly answered 3 out of 3 questions in the lesson
      And I should not see a Correct Errors button
      And I should see a Return Home button

  @errors @content_unlocked @correct_errors @continue_button
  Scenario: Trainer end continue button
    Given I visit the demo index page as a customer
     When I click on the "Dictate Fillin" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "DictateFillin" trainer page
      And I cheat to the "üüü" gap
      And I enter an incorrect answer
      And I hit the return key
     Then I see that I was mistaken
     When I choose to try again
      And I enter the correct solution
      And I hit the return key
     Then I do not see the feedback
      And I should not see an active gap
     When I should see a continue button
     When I click on the continue button
     Then I am on a trainer end page
      And I should not see a continue button
      And I should see that I correctly answered 2 out of 3 questions in the lesson
      And I should see that the Correct Errors button has the text "1"
      And I should see a Return Home button
     When I click on the Correct Errors button
     Then I am on a "DictateFillin" trainer page

  @errors @content_locked
  Scenario: Answer all questions with errors
    Given I visit the demo index page
     When I click on the "Dictate Fillin" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "DictateFillin" trainer page
     When I complete the trainer with 2 mistakes
     Then I am on a trainer end page
      And I should see that I correctly answered 1 out of 3 questions in the lesson
      And I should see that the feedback message grade is "medium"
      And I should see that the Access Content button has the correct text
      And I should not see a Return Home button
      And I should not see a Correct Errors button
      And I check that the Access Content button leads to the prices page
