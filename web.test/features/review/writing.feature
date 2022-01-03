Feature: Test the Writing Review Mode

  @no_errors @next
  Scenario: Finish the writing review without making mistakes
    Given I visit the demo review page
     When I choose the "Writing" review
     Then I am on a "VocabularyFillin" trainer page
     When I complete the trainer with 0 mistakes
     Then I am on a review end page
      And I should see that there are 2 items in the 'Correct' box
      And I should not see an 'Incorrect' box
     When I choose to review more items
     Then I am on a "VocabularyWordorder" trainer page
     When I complete the trainer with 0 mistakes
     Then I am on a review end page

  @errors @correct_errors @info_texts @formatting_chars
  Scenario: Finish the writing review with mistakes
    Given I visit the demo review page as a customer
     When I choose the "Writing" review
     Then I am on a "VocabularyFillin" trainer page
     # the words are marked as bold or italic
      And I should see "die" within "phrase interactive" in italic
      And I should see "kleine" within "phrase interactive" in bold
     When I enter an incorrect answer
      And I hit the return key
     Then I should see a negative feedback message
     When I choose to try again
      And I enter the correct answer
      And I hit the return key
      And I patiently wait for a continue button
      And I click on the continue button
     Then I should see "die" within "phrase interactive" in bold
     When I enter an incorrect answer
      And I hit the return key
     Then I should see a negative feedback message
     When I choose to try again
      And I enter the correct answer
      And I hit the return key
     Then I do not see the feedback
     When I hit the return key
      And I patiently wait for a continue button
      And I click on the continue button
     Then I am on a review end page
     When I wait for the animations to stop
     Then I should see that there are 2 items in the 'Incorrect' box
     # no bold or italic on the review end screen
      And I should not see "die" within "incorrect box" in either bold or italic
      And I should not see "kleine" within "incorrect box" in either bold or italic
      And I should not see a 'Correct' box
      And I should see that I can correct my 2 mistakes
     When I choose to correct my errors
     Then I am on a "VocabularyFillin" trainer page
     When I complete the trainer with 1 mistake
     Then I am on a review end page
      And I should see that there is 1 item in the 'Incorrect' box
      And I should see that there is 1 item in the 'Correct' box
      And I should not see "die" within "correct box" in either bold or italic
      And I should not see "die" within "incorrect box" in either bold or italic
      And I should see that I can correct my 1 mistake
     When I choose to correct my errors
     Then I am on a "VocabularyFillin" trainer page
