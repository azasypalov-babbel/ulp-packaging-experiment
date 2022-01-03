Feature: Test the Vocabulary Fillin Trainer

  @no_errors @translation_visibility
  Scenario: Finish the lesson without making mistakes
    Given I visit the demo index page as a customer
     When I click on the "Vocabulary Fillin" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "VocabularyFillin" trainer page
      And I should not see a translation string
     When I toggle the translation
     Then I should see a translation string
     When I complete the trainer with 0 mistakes
     Then I am on a "VocabularyFillin" trainer page
      And I should see a translation string
     When I complete the trainer with 0 mistakes
     Then I am on a trainer end page
      And I should see that I correctly answered 6 out of 6 questions in the lesson

  @errors @correct_errors @content_unlocked @continue_button @info_texts @formatting_chars
  Scenario: Trainer end continue button
    Given I visit the demo index page as a customer
     When I click on the "Vocabulary Fillin" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "VocabularyFillin" trainer page
     When I enter an incorrect answer
      And I hit the return key
     Then I see that I made a mistake
     When I choose to try again
      And I enter the correct answer
      And I hit the return key
      And I patiently wait for a continue button
      And I click on the continue button
      And I enter the correct answer
      And I hit the return key
      And I patiently wait for a continue button
     Then the info text is shown
     When I dismiss the info text
     Then the info text is not shown
     When I click on the continue button
      And I enter the correct answer
      And I hit the return key
      And I patiently wait for a continue button
     Then I do not see the feedback
      And I should not see an active gap
      And I should see a continue button
     When I click on the continue button
     # old content - item one
     Then I am on a "VocabularyFillin" trainer page
      And I wait for the animations to stop
      And I should see "können" within "phrase interactive" in bold
      And I should see "can" within "translation" in bold
     When I enter "booo!" into the gap
      And I hit the return key
     Then I see that I was mistaken
     When I hit the return key
      And I enter the correct solution
      And I hit the return key
     Then the info text is shown
      And I should see "spectacular" within "info text" in bold
     When I click on the continue button
     # item two
     Then I should see "ist" within "phrase interactive" in italic
      And I should see "is" within "translation" in italic
     When I enter the correct answer
      And I hit the return key
      And I patiently wait for a continue button
     Then the info text is shown
      And I should see "tatsächlich" within "info text" in italic
     When I dismiss the info text
     Then the info text is not shown
     When I click on the continue button
     # item three with two gaps
     Then I should see "erkläre" within "phrase interactive" in bold
      And I should see "erkläre" within "phrase interactive" in italic
      And I should see "explain" within "translation" in bold
      And I should see "explain" within "translation" in italic
     When I enter the correct answer
      And I hit the return key
     Then I do not see the feedback
      And I should not see a continue button
     When I enter the correct answer
      And I hit the return key
      And I patiently wait for a continue button
     Then I do not see the feedback
      And I should not see an active gap
      And I should see a continue button
     # lesson end screen
     When I click on the continue button
     Then I am on a trainer end page
      And I should not see a continue button
      But I should see that the Correct Errors button has the text "2"
      And I should see that I correctly answered 4 out of 6 questions in the lesson
      And I should see a Return Home button
     When I click on the Correct Errors button
     Then I am on a "VocabularyFillin" trainer page
