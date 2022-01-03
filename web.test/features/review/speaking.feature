Feature: Test the Speaking Review Mode in a Browser with disabled microphone

  Scenario: Visiting the old speaking review with disabled microphone sends you to return_url
    Given I visit the demo review page
      And I set the URL param "is_analyzer_lib_recognizer" to "on"
     Then I see different review choices
     When I choose the "Speaking" review
      And I choose to continue without microphone
     Then I see different review choices

  Scenario: Visiting the new speaking review with disabled microphone shows an error page
    Given I visit the demo review page
      And I set the URL param "is_analyzer_lib_recognizer" to "off"
     Then I see different review choices
     When I choose the "Speaking" review
      And I click on the speaking continue button
     Then I am on a "B4SpokenReview" trainer page

  @next @content_unlocked @feedback_message @errors
  Scenario: Finishing the new speaking review with enabled microphone
    Given I visit the demo review page as a customer
      And I set the URL param "is_analyzer_lib_recognizer" to "off"
      And I set the URL param "is_web_speech_mock" to "on"
     Then I see different review choices
     When I choose the "Speaking" review
      And I make my way around the speech permissions
     Then I am on a "B4SpokenReview" trainer page
     When I patiently wait for a continue button
      And I click on the continue button
      And I click on the Got It button
      And I patiently wait for a continue button
      And I click on the continue button
     Then I am on a review end page
     When I wait 2 seconds
     Then I should see that there are 2 items in the 'Incorrect' box
      And I should see that the feedback message grade is "low"
     When I choose to review more items
     Then I am on a "B4SpokenReview" trainer page
