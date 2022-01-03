Feature: Test the Progress Bar in the Writing and Flashcards Review Mode

  @errors @correct_errors
  Scenario: Finish the writing review with three mistakes and watch the progress bar
    Given I visit the demo review page
     When I choose the "Writing" review
     Then I am on a "VocabularyFillin" trainer page
      And I want to see that the number in the progress bar increases after every item
      And I should see "0/2" in the progress bar
     When I complete the trainer with 2 mistakes and check that the progress bar end score is "2/2"
     Then I am on a review end page
      And I should see "2/2" in the progress bar
     When I choose to correct my errors
     Then I am on a "VocabularyFillin" trainer page
      And I should see "0/2" in the progress bar
      And I want to see that the number in the progress bar increases after every item
     When I complete the trainer with 0 mistakes and check that the progress bar end score is "2/2"
     Then I am on a review end page
      And I should see "2/2" in the progress bar

  @errors @correct_errors
  Scenario: Finish the new listening review with some errors and watch the progress bar
    Given I visit the demo review page
     When I choose the "Listening" review
     Then I am on a "Listening" trainer page
      And I want to see that the number in the progress bar increases after every item
      And I should see "0/2" in the progress bar
     When I complete the trainer with 2 mistakes and check that the progress bar end score is "2/2"
     Then I am on a review end page
      And I should see "2/2" in the progress bar
      And I should see that there are 2 items in the 'Incorrect' box
      And I should not see a 'Correct' box
      And I should see that I can correct my 2 mistakes
     When I choose to correct my errors
     Then I am on a "Listening" trainer page
      And I want to see that the number in the progress bar increases after every item
      And I should see "0/2" in the progress bar
     When I complete the trainer with 0 mistakes and check that the progress bar end score is "2/2"
     Then I am on a review end page
      And I should see "2/2" in the progress bar

  @errors @correct_errors
  Scenario: Finish the flashcards review with some errors and watch the progress bar
    Given I visit the demo review page
     When I choose the "Flashcards" review
     Then I am on a "Flashcard" trainer page
      And I want to see that the number in the progress bar increases after every item
      And I should see "0/2" in the progress bar
     When I complete the trainer with 1 mistakes and check that the progress bar end score is "2/2"
     Then I am on a review end page
      And I should see that there is 1 item in the 'Incorrect' box
      And I should see that there is 1 item in the 'Correct' box
      And I should see that I can correct my 1 mistake
     When I choose to correct my errors
     Then I am on a "Flashcard" trainer page
      And I want to see that the number in the progress bar increases after every item
      And I should see "0/1" in the progress bar
     When I complete the trainer with 0 mistakes and check that the progress bar end score is "1/1"
     Then I am on a review end page
      And I should see that there is 1 item in the 'Correct' box
      And I should not see an 'Incorrect' box
      And I should see "1/1" in the progress bar

  @ios_only
  Scenario: Finish the writing review with three mistakes and watch the progress bar
    Given I visit the demo review page
     When I choose the "Writing" review
     Then I am on a "VocabularyFillin" trainer page
      And I want to see that the number in the progress bar increases after every item
      And I should see "0/2" in the progress bar
     When I complete the trainer with 0 mistakes and check that the progress bar end score is "2/2"
     Then I am on a review end page
      And I should see "2/2" in the progress bar
      And I should see that there are 2 items in the 'Correct' box
      And I should not see an 'Incorrect' box

  @errors @ios_only
  Scenario: Finish the new listening review with some errors and watch the progress bar
    Given I visit the demo review page
     When I choose the "Listening" review
     Then I am on a "Listening" trainer page
      And I want to see that the number in the progress bar increases after every item
      And I should see "0/2" in the progress bar
     When I complete the trainer with 2 mistakes and check that the progress bar end score is "2/2"
     Then I am on a review end page
      And I should see "2/2" in the progress bar
      And I should see that there are 2 items in the 'Incorrect' box
      And I should not see a 'Correct' box
      And I should see that I can correct my 2 mistakes

  @errors @ios_only
  Scenario: Finish the flashcards review with some errors and watch the progress bar
    Given I visit the demo review page
     When I choose the "Flashcards" review
     Then I am on a "Flashcard" trainer page
      And I want to see that the number in the progress bar increases after every item
      And I should see "0/2" in the progress bar
     When I complete the trainer with 1 mistakes and check that the progress bar end score is "2/2"
     Then I am on a review end page
      And I should see that there is 1 item in the 'Incorrect' box
      And I should see that there is 1 item in the 'Correct' box
      And I should see that I can correct my 1 mistake
