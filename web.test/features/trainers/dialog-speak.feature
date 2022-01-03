Feature: Test the Dialog Speak trainer in Show mode

  @no_errors @continue_button @no_purge
  Scenario: Run through the trainer using 'can't speak right now'
    Given I visit the demo index page as a customer
     When I click on the "Dialog Speak" button
      And I choose to continue without speech recognition
     Then I am on a "DialogSpeak" trainer page
      And I should not see a continue button
      And I wait patiently for a continue button
     When I should see a continue button
      And I click on the continue button
     Then I am on a trainer end page
      And I should not see a continue button
      And I should see that I correctly answered 0 out of 0 questions in the lesson
      And I should not see a Correct Errors button

  @no_errors @info_texts
  Scenario: Run through the trainer using mocked speak without mistakes
    Given I visit the demo index page
     When I click on the "Dialog Speak" button
      And I set the URL param "is_web_speech_mock" to "on"
      And I choose to continue with speech recognition
      And I make my way around the speech permissions
     Then I am on a "DialogSpeak" trainer page
     When I wait 1 second
     Then I can see a tooltip with the text "Speak now..."
     When I cheat
      And I wait 5 seconds
     Then I see a mic button in "listening" state
      And I can see a tooltip with the text "Speak now..."
     When I cheat
     Then the info text is shown
     When I dismiss the info text
     Then the info text is not shown
     When I wait 2 seconds
     Then I see a mic button in "listening" state
      And I can see a tooltip with the text "Speak now..."
     When I cheat
     Then the info text is shown
     When I dismiss the info text using the escape key
     Then the info text is not shown
     When I patiently wait for a continue button
     Then I should see a continue button
     When I click on the continue button
     Then I am on a trainer end page
      And I should see that I correctly answered 3 out of 3 questions in the lesson

  @errors @correct_errors
  Scenario: Run through the trainer using mocked speak making mistakes
    Given I visit the demo index page as a customer
     When I click on the "Dialog Speak" button
      And I set the URL param "is_web_speech_mock" to "on"
      And I choose to continue with speech recognition
      And I make my way around the speech permissions
     Then I am on a "DialogSpeak" trainer page
      And I should not see a continue button
     When I wait 6 seconds  # this will trigger the negative attempt
     Then I see that I made a mistake
     When I click on the continue button
      And I wait 8 seconds  # this will trigger the negative attempt
     Then I see that I made a mistake
     When I click on the continue button
      And I wait 1 second
     Then I can see a tooltip with the text "Speak now..."
     When I cheat
      And I patiently wait for a continue button
      And I click on the continue button
     Then I am on a trainer end page
      And I should see that I correctly answered 1 out of 3 questions in the lesson
      And I should see that the Correct Errors button has the text "2"
     When I click on the Correct Errors button
     Then I am on a "DialogSpeak" trainer page

  @errors
  Scenario: Try again button works and user sees same item again
    Given I visit the demo index page
     When I click on the "Dialog Speak" button
      And I set the URL param "is_web_speech_mock" to "on"
      And I choose to continue with speech recognition
      And I make my way around the speech permissions
     Then I am on a "DialogSpeak" trainer page
      And the current speaker image is for "f1"
      And the current dialog text is ...
     When I wait 2 seconds
     Then I can see a tooltip with the text "Speak now..."
      And the speak item should not be highlighted
      And the speak item text is "Hi, du bist Nicole, oder?"
     When I wait 3 seconds  # this will trigger the negative attempt
     Then I see that I made a mistake
      And the speak item should be highlighted in red
      And the speak item text is "Hi, du bist Nicole, oder?"
      And I should see a Try Again button
     When I click on the Try Again button
     Then the current speaker image is for "f1"
      And the current dialog text is ...
      And the speak item should not be highlighted
      And the speak item text is "Hi, du bist Nicole, oder?"
     When I cheat
     Then the speak item text is "Hi, du bist Nicole, oder?"
      And the speak item should be highlighted in green
     When I wait 5 seconds
     Then I see a mic button in "listening" state
      And the speak item text is "Ich bin Kani, die neue Entwicklerin im Hodwer-Team."
      And the current dialog text is ...
      And I should see a solved dialog item with the text "Hi, du bist Nicole, oder?"
