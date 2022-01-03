Feature: Test the Comprehension Audio Trainer

  @no_errors @content_locked @content_locked
  Scenario: Finish trainer without mistakes
    Given I visit the demo index page
     When I click on the "Comprehension Audio" button
     Then I am on a "ComprehensionAudio" trainer page
     When I complete the trainer with 0 mistakes
     Then I should see a continue button
     When I click on the continue button
     Then I am on a trainer end page
      And I should see that I correctly answered 2 out of 2 questions in the lesson
      And I should not see a Return Home button
      And I should not see a Correct Errors button
      And I should see that the Access Content button has the correct text
      And I check that the Access Content button leads to the prices page

  @errors @content_unlocked @no_purge @continue_button
  Scenario: Fill in with one mistake, user does not listen to the audio
    Given I visit the demo index page as a customer
     When I click on the "Comprehension Audio" button
      And I wait 2 seconds
     Then I am on a "ComprehensionAudio" trainer page
      And I wait for the animations to stop
     When I open the solution slider
      And I wait for the animations to stop
     Then I should see that the button with the correct answer turns green when clicked
     When I wait for the animations to stop
     Then I should see that the button with the incorrect answer turns red when clicked
     When I wait for the animations to stop
     Then I should see that the button with the incorrect answer turns red when clicked
     When I wait for the animations to stop
     Then I should see that the button with the correct answer turns green when clicked
     When I wait for the animations to stop
     Then I should see a continue button
     When I click on the continue button
     Then I am on a trainer end page
      And I should see that I correctly answered 1 out of 2 questions in the lesson
      And I should not see a Correct Errors button

  @sound_player @question_sheet
  Scenario: Trainer and Player component look as expected
    Given I visit the demo index page as a customer
      And I set the URL param "translation_visibility" to "full"
     When I click on the "Comprehension Audio" button
      And I wait 2 seconds
     Then I am on a "ComprehensionAudio" trainer page
      And I should see a title
      And I should see a description
      And I should see a sound player with "play" symbol
      And I should not see a sound player tooltip
      And I should see a "disabled" sound "back" button
      And I should see an "enabled" sound "forward" button
      And I should see 5 white sound nuggets
      And I should not see a translation string
      And I should not see a translation toggle symbol
      And I should not see any item text
      And I should not see the question sheet
      And I should see a "white" "up" arrow button
     When I wait 3 seconds
     Then I should see a sound player tooltip

     When I click on the comprehension audio button
      And I wait 1 second
     Then I should see a sound player with "pause" symbol
      And I wait 0.5 second
     When I click on the comprehension pause button
     Then I should see a sound player with "paused" symbol
      And I should not see a sound player tooltip
      And I should see an "enabled" sound "back" button
      And I should see an "enabled" sound "forward" button
      And I should see some white sound nuggets
      And I should see some blue sound nuggets
      And I should not see the question sheet
      And I should see a "white" "up" arrow button

     When I click on the comprehension audio button
      And I wait 4 seconds
     Then I should see a sound player with "replay" symbol
      And I should not see a sound player tooltip
      And I should see an "enabled" sound "back" button
      And I should see a "disabled" sound "forward" button
      And I should see 5 blue sound nuggets
      And I should not see the question sheet
      And I should see an "orange" "up" arrow button

     When I click on the sound backward button
     Then I should see a sound player with "pause" symbol
     When I wait until I see the replay button
      And I click on the comprehension replay button
     Then I should see a sound player with "pause" symbol

     When I open the solution slider
     Then I should see a "white" "down" arrow button
      And I should see that I am answering question 1 of 2
      And I should see a question
      And I should see at least one correct answer
     When I click on the correct answer
      And I wait for the animations to stop
     Then I should see that I am answering question 2 of 2
     When I click on the correct answer
     Then I should see a continue button
      And I should not see any arrow button
      And I should not see the question sheet
