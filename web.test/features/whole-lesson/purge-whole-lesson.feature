Feature: Test the Purge Error Flow in a composite lesson in the Lesson-player Demo

  @errors @correct_errors @content_unlocked
  Scenario: Finish the lesson with several mistakes and see that everything is purged correctly
    Given I visit the demo index page as a customer
     When I click on the "Composite One" button

     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "DialogDictatefillin" trainer page
     When I complete the trainer with 2 mistakes

     Then I am on a "CardChoicebuttons" trainer page
     When I complete the trainer with 1 mistake

     Then I am on a "VocabularyWordorder" trainer page
     When I finish the trainer with 2 mistakes

     Then I am on a trainer end page
      And I should see that I correctly answered 3 out of 7 questions in the lesson
      And I should see that the Correct Errors button has the text "4"
      And I should see a Return Home button
     When I click on the Correct Errors button

    # P U R G E
     Then I am on a "DialogDictatefillin" trainer page
     When I complete the trainer with 0 mistakes

     Then I am on a "CardChoicebuttons" trainer page
     When I complete the trainer with 0 mistakes

     Then I am on a "VocabularyWordorder" trainer page
     When I complete the trainer with 0 mistakes

     Then I am on a trainer end page
      And I should see that I correctly answered 4 out of 4 questions in the lesson
      And I should not see a Correct Errors button
      And I should see a Return Home button
