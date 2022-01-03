Feature: Test the Progress Bar in a composite lesson in the Lesson-player Demo

  @errors @correct_errors @content_unlocked
  Scenario: Finish the lesson with 5 mistakes and watch the progress bar
    Given I visit the demo index page
     When I click on the "Composite One" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "DialogDictatefillin" trainer page
      And I should see "1/3" in the progress bar
     When I finish the trainer with 1 mistake

     Then I am on a "CardChoicebuttons" trainer page
      And I should see "2/3" in the progress bar
     When I finish the trainer with 2 mistakes

     Then I am on a "VocabularyWordorder" trainer page
      And I should see "3/3" in the progress bar
     When I finish the trainer with 1 mistake

     Then I am on a trainer end page
      And I should see "3/3" in the progress bar
      And I should see that I correctly answered 3 out of 7 questions in the lesson
      And I should see a Return Home button
      And I should see a Correct Errors button

     When I click on the Correct Errors button
     Then I am on a "DialogDictatefillin" trainer page
      And I should see "1/3" in the progress bar
     When I finish the trainer with 0 mistakes

     Then I am on a "CardChoicebuttons" trainer page
      And I should see "2/3" in the progress bar
     When I finish the trainer with 0 mistakes

     Then I am on a "VocabularyWordorder" trainer page
      And I should see "3/3" in the progress bar
     When I finish the trainer with 0 mistakes

     Then I am on a trainer end page
      And I should see "3/3" in the progress bar
      And I should see that I correctly answered 4 out of 4 questions in the lesson
      And I should not see a Correct Errors button
      And I should see a Return Home button

  @errors @ios_only
  Scenario: Finish the lesson with 5 mistakes and watch the progress bar
    Given I visit the demo index page
     When I click on the "Composite One" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "DialogDictatefillin" trainer page
      And I should see "1/3" in the progress bar
     When I finish the trainer with 2 mistakes

     Then I am on a "CardChoicebuttons" trainer page
      And I should see "2/3" in the progress bar
     When I finish the trainer with 2 mistakes

     Then I am on a "VocabularyWordorder" trainer page
      And I should see "3/3" in the progress bar
     When I finish the trainer with 2 mistakes
      And I wait for the animations to stop

     Then I am on a trainer end page
      And I should see "3/3" in the progress bar
      And I should see that I correctly answered 2 out of 7 questions in the lesson
      And I should see a Return Home button
