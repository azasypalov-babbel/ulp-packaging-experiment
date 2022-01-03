Feature: Tests the Flashcards Review Mode

  @no_errors @next @feedback_message
  Scenario: Answer all questions without errors
    Given I visit the demo review page
     When I choose the "Flashcards" review
     Then I am on a "Flashcard" trainer page
     When I complete the trainer with 0 mistakes
     Then I am on a review end page
      And I should see that there are 2 items in the 'Correct' box
      And I should see that the feedback message grade is "high"
     When I choose to review more items
     Then I am on a "Flashcard" trainer page
     When I complete the trainer with 0 mistakes
     Then I am on a review end page
      And I should see that there are 2 items in the 'Correct' box
      And I should see that the feedback message grade is "high"

  @continue_button
  Scenario: Trainer end continue button
    Given I visit the demo review page
     When I choose the "Flashcards" review
     Then I am on a "Flashcard" trainer page
     When I click on the correct answer
      And I wait for the animations to stop
      And I click on the correct answer
    #  Flashcard does not have a continue button
     Then I am on a review end page

  @errors @next @content_unlocked @feedback_message
  Scenario: Answer all questions with some errors
    Given I visit the demo review page as a customer
     When I choose the "Flashcards" review
     Then I am on a "Flashcard" trainer page
     When I complete the trainer with 0 mistakes
     Then I am on a review end page
      And I should see that there are 2 items in the 'Correct' box
      And I should see that the feedback message grade is "high"
     When I choose to review more items
     Then I am on a "Flashcard" trainer page
     When I complete the trainer with 1 mistake
     Then I am on a review end page
      And I should see that there is 1 item in the 'Incorrect' box
      And I should see that there is 1 item in the 'Correct' box
      And I should see that the feedback message grade is "medium"
      And I should see that I can correct my 1 mistake

  @errors @correct_errors @feedback_message
  Scenario: Answer all questions with some errors
    Given I visit the demo review page
     When I choose the "Flashcards" review
     Then I am on a "Flashcard" trainer page
     When I complete the trainer with 1 mistake
     Then I am on a review end page
      And I should see that there is 1 item in the 'Incorrect' box
      And I should see that there is 1 item in the 'Correct' box
      And I should see that the feedback message grade is "medium"
      And I should see a Review More button
      And I should see that I can correct my 1 mistake
     When I choose to correct my errors
     Then I am on a "Flashcard" trainer page
     When I complete the trainer with 0 mistakes
     Then I am on a review end page
      And I should see that there is 1 item in the 'Correct' box
      And I should see that the feedback message grade is "high"

  @errors @correct_errors @feedback_message @keyboard_shortcuts
  Scenario: Finish the flashcard review with an error and use the keyboard to interact
    Given I visit the demo review page
     When I choose the "Flashcards" review
     Then I am on a "Flashcard" trainer page
      And I want to use the keyboard shortcuts
     When I complete the trainer with 2 mistakes
     Then I am on a review end page
      And I should see that there are 2 items in the 'Incorrect' box
      And I should see that the feedback message grade is "low"
     When I choose to correct my errors
     Then I am on a "Flashcard" trainer page
      And I want to use the keyboard shortcuts
     When I complete the trainer with 0 mistakes
     Then I am on a review end page
