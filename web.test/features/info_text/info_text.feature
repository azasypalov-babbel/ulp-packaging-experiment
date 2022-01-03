Feature: Test the functionality of the InfoText component
  - Variant A works (dialog). tips only disappear when user clicks close
  - Variant B works (dictate). tips also disappear on transition to next item
  - Show/fillin/puzzlehelper/choicebuttons interactions work
    - They appear one by one, and max. 1 info text per gap
    - They can be viewed and closed.
    - After dismissing, old info texts re-appear when another info text is shown
  - Close and View All buttons work
  - Number of shown info texts in top bar and in sidebox is correct

  @info_texts
  Scenario: We can close the info texts by clicking on 'close'
    Given I visit the demo index page
     When I click on the "Dialog Speak" button
      And I choose to continue without speech recognition
     Then I am on a "DialogSpeak" trainer page
      And I wait patiently for a continue button
      And the info text is shown
      And I wait until I see View All Tips(7)
      And I should see a Close Tips button
     When I dismiss the info text
     Then the info text is not shown

  @info_texts
  Scenario: We can view all info texts by clicking 'view all tips'
    Given I visit the demo index page
     When I click on the "Dialog Speak" button
      And I choose to continue without speech recognition
     Then I am on a "DialogSpeak" trainer page
      And I wait patiently for a continue button
      And the info text is shown
      And I wait until I see View All Tips(7)
     When I click on View All Tips
     Then I should see a side box with 7 tips
      And the info text is not shown
      And I should see an X to close the side box
     When I click on the X to close the side box
     Then the side box is not shown
      And the info text is not shown

  @info_texts
  Scenario: Info Text work in interaction/show (Variant A). They appear one by one and do not disappear.
    Given I visit the demo index page
     When I click on the "Dialog Speak" button
      And I choose to continue without speech recognition
     Then I am on a "DialogSpeak" trainer page
      And the info text is shown
      And I should not see the View All Tips button
      But I should see a Close Tips button
     Then I wait until I see View All Tips(2)
      And I wait until I see View All Tips(3)
      And I wait until I see View All Tips(4)
      And I wait until I see View All Tips(5)
      And I wait until I see View All Tips(6)
      And I wait until I see View All Tips(7)

  @info_texts
  Scenario: (Variant B) Info Texts always disappear on transition to next item. They only reappear if another info text is shown.
    Given I visit the demo index page
     When I click on the "Dictate Fillin" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "DictateFillin" trainer page
     When I enter the correct answer
      And I hit the return key
     Then the info text is shown
     When I click on the continue button
     Then the info text is not shown
     When I enter an incorrect answer
      And I hit the return key
     Then the info text is not shown
      And I see that I was mistaken
     When I choose to try again
      And I enter the correct answer
      And I hit the return key
     Then the info text is shown
      And I wait until I see View All Tips(2)
     When I click on the continue button
     Then the info text is not shown
     When I enter the correct answer
      And I hit the return key
     Then the info text is not shown
     When I enter an incorrect answer
      And I hit the return key
     Then I see that I was mistaken
      And the info text is not shown
     When I choose to try again
      And I enter the correct answer
      And I hit the return key
     Then the info text is not shown
      And I should see a continue button

  @info_texts
  Scenario: Info Text work in interaction/write
    Given I visit the demo index page
     When I click on the "Dialog Fillin" button
     Then I am on a "DialogFillin" trainer page
     When I enter the correct answer
      And I hit the return key
     Then the info text is shown
      And I should not see the View All Tips button
     When I enter the correct answer
      And I hit the return key
     Then the info text is shown
      And I should see View All Tips(2)
      But I should see a Close Tips button
     When I dismiss the info text
     Then the info text is not shown
     When I enter the correct answer
      And I hit the return key
      And I enter the correct answer
      And I hit the return key
     Then the info text is shown
      And I should see View All Tips(3)
      And I should see a Close Tips button
     When I click on View All Tips
     Then I should see a side box with 3 tips
     When I click on the X to close the side box
     Then the side box is not shown
      And the info text is not shown

  @info_texts
  Scenario: Info Text work in interaction/puzzlehelper
    Given I visit the demo index page
     When I click on the "Dialog Puzzlehelper" button
     Then I am on a "DialogPuzzlehelper" trainer page
     When I enter "IH" using the puzzlehelper buttons
      And I hit the return key
     Then the info text is not shown
      And I see that I was mistaken
     When I choose to try again
      And I enter "HI" using the puzzlehelper buttons
      And I click on the done button
     Then the info text is shown
     When I dismiss the info text
     Then the info text is not shown
     When I enter "UZ TUN" using the puzzlehelper buttons
      And I hit the return key
     Then I see that I was mistaken
      And the info text is not shown
     When I hit the return key
      And I click on the done button
      And I click on the continue button
     Then the info text is not shown
     When I enter the correct answer
      And I click on the done button
     Then I do not see the feedback
     When I enter the correct answer
      And I click on the done button
     Then I wait until I see View All Tips(2)
      And I should not see an active gap
     When I click on View All Tips
     Then I should see a side box with 2 tips
     When I click on the X to close the side box
     Then the side box is not shown
      And the info text is not shown

  @info_texts
  Scenario: Info Text work in interaction/choicebuttons
    Given I visit the demo index page
     When I click on the "Card Choicebuttons" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "CardChoicebuttons" trainer page
     When I click on the correct answer
      And I wait until I see the next question and answers
     Then the info text is shown
     When I dismiss the info text
     Then the info text is not shown
     When I click on a wrong answer
      And I wait until I see the next question and answers
     Then I do not see the feedback
      And the info text is not shown
     When I click on the correct answer
      And I wait until I see the next question and answers
     Then the info text is not shown
     When I click on the correct answer
      And I wait until I see the next question and answers
      And I click on a wrong answer
      And I wait until I see the next question and answers
      And I click on the correct answer
      And I wait for the animations to stop
      And I wait for the animations to stop
     Then the info text is shown
      And I should see View All Tips(2)
      And I should see a Close Tips button
     When I click on View All Tips
     Then I should see a side box with 2 tips
     When I click on the X to close the side box
     Then the side box is not shown
      And the info text is not shown

  @info_texts @translation_visibility
  Scenario: Translation Toggle can be used when info text is shown on top (card)
    Given I visit the demo index page
      And I click on the "Card Fillin" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "CardFillin" trainer page
      And the info text is shown
      And I should see a translation toggle symbol
      And I should not see a translation string
     When I toggle the translation
     Then I should see a translation string

  @info_texts @translation_visibility
  Scenario: Translation Toggle can be used when info text is shown on top (dialog)
    Given I visit the demo index page
      And I click on the "Dialog Choicebuttons" button
     When I set the URL param "translationVisibility" to "partial"
     Then I am on a "DialogChoicebuttons" trainer page
      And I should see a translation toggle symbol
      And I should not see a translation string
     When I enter the correct solution
      And I wait for the animations to stop
     Then the info text is shown
     When I toggle the translation
     Then I should see a translation string

  @info_texts @translation_visibility
  Scenario: Translation Toggle can be used when info text is shown on top (vocabulary)
    Given I visit the demo index page
      And I click on the "Vocabulary Choicebuttons" button
     When I set the URL param "translationVisibility" to "partial"
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "VocabularyChoicebuttons" trainer page
      And I should see a translation toggle symbol
      And I should not see a translation string
     When I enter the correct solution
      And I wait for the animations to stop
      And I enter the correct solution
      And I wait for the animations to stop
     Then the info text is shown
     When I toggle the translation
     Then I should see a translation string
