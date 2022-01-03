Feature: Test the Listening Review Mode

  @no_errors @next
  Scenario: Finish the listening review without making mistakes
    Given I visit the demo review page
     When I choose the "Listening" review
     Then I am on a "Listening" trainer page
     When I complete the trainer with 0 mistakes
     Then I am on a review end page
      And I should see that there are 2 items in the 'Correct' box
      And I should not see an 'Incorrect' box
     When I choose to review more items
     Then I am on a "Listening" trainer page
     When I complete the trainer with 0 mistakes
     Then I am on a review end page

  @continue_button
  Scenario: Trainer end continue button
    Given I visit the demo review page
     When I choose the "Listening" review
     Then I am on a "Listening" trainer page
     Then I click on the correct answer
     Then I wait for the animations to stop
     Then I should see a continue button
     When I click on the continue button
     Then I should not see a continue button
     Then I wait for the animations to stop
      And I click on the correct answer
     Then I wait for the animations to stop
     Then I should see a continue button
     When I click on the continue button
     Then I should not see a continue button
     Then I am on a review end page

  @errors @correct_errors @content_unlocked
  Scenario: Finish the listening review with mistakes
    Given I visit the demo review page as a customer
     When I choose the "Listening" review
     Then I am on a "Listening" trainer page
     When I complete the trainer with 2 mistakes
     Then I am on a review end page
      And I should see that there are 2 items in the 'Incorrect' box
      And I should not see a 'Correct' box
     When I choose to correct my errors
     Then I am on a "Listening" trainer page
     When I complete the trainer with 0 mistakes
     Then I am on a review end page

  @errors @correct_errors @keyboard_shortcuts
  Scenario: Finish the listening review with an error and use the keyboard to interact
    Given I visit the demo review page
     When I choose the "Listening" review
     Then I am on a "Listening" trainer page
      And I want to use the keyboard shortcuts
     When I complete the trainer with 1 mistake
     Then I am on a review end page
      And I should see that there is 1 item in the 'Correct' box
      And I should see that there is 1 item in the 'Incorrect' box
     When I choose to correct my errors
     Then I am on a "Listening" trainer page
      And I want to use the keyboard shortcuts
     When I complete the trainer with 0 mistakes
     Then I am on a review end page

  @feedback_message_type
  Scenario: Finish some items and check the feedback message
    Given I visit the demo review page as a customer
     When I choose the "Listening" review
     Then I am on a "Listening" trainer page
      And I see on the sound button that the sound is not playing
     When I enter the correct answer
     Then I should see a positive feedback message
     When I hit the return key
      And I wait for the animations to stop
     # we have to wait for
     #   a) the choice buttons to reappear for the new item, and
     #   b) for the buttons' animations to finish
      And I wait for the choice list items to appear
      And I wait for the animations to stop
      And I wait for the animations to stop
     Then I see on the sound button that the sound is not playing
     When I enter an incorrect answer
     Then I should see a negative feedback message
