Feature: Test that learning tip page is displayed properly (autoplay in the trainers works as expected)
  As a user of babbel
  I want the trainer audio to play when the trainer is displayed
  # because audio autoplay was disabled in browsers
  # there must be some user interaction to start the audio
  # so we added an extra page that displays a user tip and a button

  Scenario: start a (demo) lesson, see the learning tip page and click on the button
    Given I visit the demo index page as a customer
     When I click on the "Vocabulary Click" button
     Then I am on the Learning Tip Page
      And I can see an icon, a title, a tip, and a button
     When I click on the Got It button
     Then I am on a "VocabularyClick" trainer page

  Scenario: start a (demo) lesson, see the learning tip page and hit the return key
    Given I visit the demo index page
     When I click on the "Vocabulary Click" button
     Then I am on the Learning Tip Page
      And I can see an icon, a title, a tip, and a button
     When I hit the return key
     Then I am on a "VocabularyClick" trainer page
