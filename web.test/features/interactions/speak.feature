Feature: Tests features related to the speak interaction

  Background: Reach Dialog Speak page with microphone enabled
   Given I visit the demo index page
     When I click on the "Dialog Speak" button
      And I set the URL param "is_web_speech_mock" to "on"
      And I choose to continue with speech recognition
      And I make my way around the speech permissions
     Then I am on a "DialogSpeak" trainer page

  Scenario: Automatic state transitions from and to: "listening" & "recording"
    Given I see a mic button in "listening" state
      And I cannot see any tooltip
    # waiting triggers tooltip and state changes
     Then I can see a tooltip with the text "Speak now..."
     When I wait 1 second
     Then I see a mic button in "recording" state
      And I cannot see any tooltip
     Then I can see a tooltip with the text "Speak now..."

  Scenario: Manual toggling between "resting" and "listening"
    # click on button toggles between listening and resting
    Given I see a mic button in "listening" state
     When I click on the mic button
     Then I can see a mic button in "resting" state
      And I cannot see any tooltip
     Then I can see a tooltip with the text "Press and start speaking"
     When I click on the mic button
      And I wait 0.5 seconds
     Then I can see a mic button in "listening" state
      And I cannot see any tooltip
      And I can see a tooltip with the text "Speak now..."

  Scenario: Return to "listening" after speak item sound completes
    Given I can see a mic button in "listening" state
     When I click on the speak item
     Then I see a mic button in "resting" state
      And I cannot see any tooltip
      And I can see a mic button in "listening" state
      And I cannot see any tooltip
      And I can see a tooltip with the text "Speak now..."
      And I wait 0.5 seconds
     When I click on the speak item
     Then I see a mic button in "resting" state
      And I cannot see any tooltip
     Then I can see a mic button in "listening" state

  Scenario: Toggle "resting" by clicking on a solved dialog row
    Given I can see a mic button in "listening" state
     When I click on the latest dialog row
     Then I see a mic button in "resting" state
      And I cannot see any tooltip
      And I can see a tooltip with the text "Press and start speaking"
     When I click on the mic button
      And I wait 0.5 seconds
     Then I can see a mic button in "listening" state
      And I cannot see any tooltip
      And I can see a tooltip with the text "Speak now..."
     When I click on the latest dialog row
     Then I see a mic button in "resting" state
      And I wait 1.0 seconds
     When I click on the latest dialog row
     Then I see a mic button in "resting" state

  Scenario: Toggle Dialog Show interaction by clicking "can't speak right now"
    Given I can see a mic button in "listening" state
     When I click on the mic toggle button
     Then I cannot see a mic button
      But I can see a mic toggle button
     When I wait patiently for a continue button
     Then I should see a continue button
     When I click on the continue button
     Then I am on a trainer end page

  Scenario: Toggle Dialog Speak interaction by clicking "can speak now"
    Given I can see a mic button in "listening" state
     When I wait 3 seconds
      And I choose to try again
     Then I can see a mic button in "listening" state
     When I click on the mic toggle button
     Then I cannot see a mic button
     When I wait 0.2 seconds
     # for some reason, the info text on top blocks the mic toggle button
     # selenium cannot click on the mic toggle while the info text is shown
     # manually, it works as expected
      And I hit the backspace key
      And I click on the mic toggle button
      And I wait 4 seconds
     Then I can see a mic button in "listening" state
      And I can see a mic toggle button

  Scenario: Positive response does not show a continue button but auto-continues
    Given I can see a mic button in "listening" state
      And the speak item text is "Hi, du bist Nicole, oder?"
     When I cheat
     Then the speak item should be highlighted in green
      And I should not see a continue button
     When I wait 4 seconds
     Then I see a mic button in "listening" state
      And the speak item text is "Ich bin Kani, die neue Entwicklerin im Hodwer-Team."

  Scenario: Negative response shows a try again and continue button. Try again button leads back to previous item
    Given I can see a mic button in "listening" state
      And the speak item text is "Hi, du bist Nicole, oder?"
     When I patiently wait for a continue button
     Then the speak item should be highlighted in red
      And I should see a continue button
      And I should see a Try Again button
     When I click on the Try Again button
     Then I see a mic button in "listening" state
      And the speak item text is "Hi, du bist Nicole, oder?"

  Scenario: Negative response shows a try again and continue button. Continue button leads to next item
    Given I can see a mic button in "listening" state
      And the speak item text is "Hi, du bist Nicole, oder?"
     When I patiently wait for a continue button
     Then the speak item should be highlighted in red
      And I should see a continue button
      And I should see a Try Again button
     When I click on the continue button
      And I wait 2 seconds
     Then I see a mic button in "listening" state
      And the speak item text is "Ich bin Kani, die neue Entwicklerin im Hodwer-Team."
