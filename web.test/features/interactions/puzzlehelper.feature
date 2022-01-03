Feature: Test the PuzzleHelper interaction

  Background: Open demo lesson, ensure that the gaps match the test setup
    Given I visit the demo index page as a customer
      And I click on the "Card Puzzlehelper" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "CardPuzzlehelper" trainer page

  @smoke_test
  Scenario: Review completed gaps before continuing
    Given I cheat all gaps up to the next continue button
      And I see the gaps
      | ä-x  |
      | yes  |
      | sind die |
      | die  |

  @smoke_test
  Scenario: Solved using keyboard and dismissal of feedback
    Given I cheat to the "sind die" gap
    # Given the 1st gap is active
    # TODO change this back to "ä-x" when possible
    # several letters can (no longer?) be sent via selenium, or example ä, z, y, -
     When I enter "sind die" into the gap
      And I press return on the gap
      And I wait until I see the next question and answer
     Then the 3rd gap is not active

  @sanity_test
  Scenario: Observing puzzlehelper button state while using buttons and keyboard input
    Given the 1st gap is active
     Then I should see that the "ä-x" puzzlehelper buttons are enabled
     # TODO change this back to "ä" when possible
     When I enter "A" into the gap
     Then I should see that the "ä" puzzlehelper button is disabled
      And I should see that the "-x" puzzlehelper buttons are enabled
     When I enter "-x" using the puzzlehelper buttons
     Then I should see that the "ä-x" puzzlehelper buttons are disabled
     When I press return on the gap
     Then the info text is shown
     When I dismiss the info text
      And I wait until I see the next question and answer
     Then the 2st gap is active
      And I should see that the "yes" puzzlehelper buttons are enabled
     When I enter "ye" using the puzzlehelper buttons
     Then I should see that the "ye" puzzlehelper buttons are disabled
      And I should see that the "s" puzzlehelper button is enabled
     When I enter "s" into the gap
     Then I should see that the "yes" puzzlehelper buttons are disabled
     When I press return on the gap
     Then the info text is shown
     When I dismiss the info text
      And I wait until I see the next question and answer
     Then the 3rd gap is active
      And I should see that the "sind die" puzzlehelper buttons are enabled
     When I enter "sind " into the gap
     Then I should see that the "sind " puzzlehelper buttons are disabled
      And I should see that the "die" puzzlehelper buttons are enabled
     When I enter "die" using the puzzlehelper buttons
     Then I should see that the "sind die" puzzlehelper buttons are disabled

  @smoke_test
  Scenario: Solved using buttons and dismissal of feedback
    Given the 1st gap is active
     When I enter the correct solution using the puzzlehelper buttons
      And I hit the return key
     Then I do not see the feedback
     When I wait until I see the next question and answer
     Then the 1st gap is not active
      But the 2nd gap is active

  @smoke_test
  Scenario: Mistaken and auto-dismissal of feedback after continuing to type
    Given the 1st gap is active
     When I enter an incorrect solution using the puzzlehelper buttons
      And I click on the done button
     Then I see that I was mistaken
      And the 1st gap is still active
     When I choose to try again
      And I enter "ä" using the puzzlehelper buttons
     Then I do not see the feedback
     When I enter "-x" using the puzzlehelper buttons
      And I click on the done button
     Then I do not see the feedback
     When I wait until I see the next question and answer
     Then the 1st gap is not active
      But the 2nd gap is active

  @scoring
  Scenario: Cheat all gaps
    Given I cheat all gaps
     Then I am on a trainer end page
      And I should see that I correctly answered 3 out of 3 questions in the lesson

  Scenario: Fix attempt before submitting
    Given the 1st gap is active
     When I enter an incorrect solution using the puzzlehelper buttons
      And I click delete 3 times
      And I enter the correct solution using the puzzlehelper buttons
      And I click on the done button
     Then I do not see the feedback
     When I wait until I see the next question and answer
     Then the 1st gap is not active
      But the 2nd gap is active

  @scoring @errors
  Scenario: Skip until last gap and make mistake
    Given I cheat to the "die" gap
     When I enter an incorrect solution using the puzzlehelper buttons
      And I click on the done button
     Then I see that I was mistaken
      And the 4th gap is still active
     When I choose to try again
      And I enter the correct solution using the puzzlehelper buttons
      And I click on the done button
     Then I do not see the feedback
      And I should not see an active gap
      And I patiently wait for a continue button
     When I click on the continue button
     Then I am on a trainer end page
      And I should see that I correctly answered 2 out of 3 questions in the lesson
      And I should see that the Correct Errors button has the text "1"

  @typo @no_purge @scoring
  Scenario: Making a typo does not count as error
    Given I visit the "puzzlehelper-one-item" demo lesson as a customer
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "VocabularyPuzzlehelper" trainer page
     When I enter "im Gatren" into the gap
      And I hit the return key
     Then I should see that I made a typo
     When I hit the return key
      And I patiently wait for a continue button
      And I click on the continue button
     Then I am on a trainer end page
      And I should see that I correctly answered 1 out of 1 questions in the lesson
      And I should not see a Correct Errors button

  @sanity_test @scoring @errors @correct_errors
  Scenario: Full flow with two purge rounds
    Given I visit the demo index page as a customer
     When I click on the "Dialog Puzzlehelper" button
     Then I am on a "DialogPuzzlehelper" trainer page
    # Mistake on first item
      And the "Hi" gap is active
      And I see the gaps
      | Hi       |
     When I enter an incorrect solution using the puzzlehelper buttons
      And I click on the done button
     Then I see that I was mistaken
      And the "Hi" gap is still active
     When I choose to try again
      And I enter the correct solution
      And I click on the done button
     Then the "Hi" gap is not active
      And the info text is shown
      And the "zu tun" gap is active
      And I see the gaps
      | Hi       |
      | zu tun   |
     When I dismiss the info text using the escape key
    # Solve gap of second item
      And I enter the correct solution using the puzzlehelper buttons
      And I hit the return key
      And I wait until I see the next question and answers
     Then the "zu tun" gap is not active
    # Solve 1st gap of last item, make mistake on 2nd gap
      But the "bis" gap is active
      And I see the gaps
      | Hi       |
      | zu tun   |
      | bis      |
      | nächsten |
     When I enter "bis" into the gap
      And I click on the done button
     Then the "bis" gap is not active
      But the "nächsten" gap is active
     When I enter an incorrect solution using the puzzlehelper buttons
      And I click on the done button
     Then I see that I was mistaken
     When I choose to try again
     Then the "nächsten" gap is still active
     When I enter the correct solution
      And I click on the done button
      And I wait patiently for a continue button
     Then I should see a continue button
    # Finish trainer
     When I click on the continue button
     Then I am on a trainer end page
      And I should see that I correctly answered 1 out of 3 questions in the lesson
      And I should see that the Correct Errors button has the text "2"
     When I click on the Correct Errors button
    # First Purge
     Then I am on a "DialogPuzzlehelper" trainer page
    # Solve first item
      And the "Hi" gap is active
      And I see the gaps
      | Hi       |
      And I should see that the 1st item is noninteractive
      And I should see that the 2nd item is interactive
      And I should see that the 3rd item is noninteractive
      And I should see that the 4th item is noninteractive
      And I should see that the 5th item is noninteractive
      And I should see that the 6th item is noninteractive
     When I enter the correct solution
      And I click on the done button
     Then the "Hi" gap is not active
      And the info text is shown
     When I dismiss the info text
    # make mistake on 2nd item
     Then the "bis" gap is active
      And I see the gaps
      | Hi       |
      | bis      |
      | nächsten |
      And I should see that the 1st item is noninteractive
      And I should see that the 2nd item is noninteractive
      And I should see that the 3rd item is noninteractive
      And I should see that the 4th item is noninteractive
      And I should see that the 5th item is interactive
      And I should see that the 6th item is noninteractive
     When I enter an incorrect solution
      And I click on the done button
      And I choose to try again
      And I enter the correct solution
      And I click on the done button
     Then the "nächsten" gap is active
      And I see the gaps
      | Hi       |
      | bis      |
      | nächsten |
     When I enter the correct solution
      And I click on the done button
     Then the info text is shown
     When I dismiss the info text
     Then I should not see an active gap
     When I wait patiently for a continue button
     Then I should see a continue button
      And I should see that the 1st item is noninteractive
      And I should see that the 2nd item is noninteractive
      And I should see that the 3rd item is noninteractive
      And I should see that the 4th item is noninteractive
      And I should see that the 5th item is noninteractive
      And I should see that the 6th item is noninteractive
    # Finish trainer
     When I click on the continue button
     Then I am on a trainer end page
      And I should see that I correctly answered 1 out of 2 questions in the lesson
      And I should see that the Correct Errors button has the text "1"
     When I click on the Correct Errors button
    # Second Purge
     Then I am on a "DialogPuzzlehelper" trainer page
     When I wait until I see the next question and answers
     Then the "bis" gap is active
      And I should see that the 1st item is noninteractive
      And I should see that the 2nd item is noninteractive
      And I should see that the 3rd item is noninteractive
      And I should see that the 4th item is noninteractive
      And I should see that the 5th item is interactive
      And I should see that the 6th item is noninteractive
      And I see the gaps
      | bis      |
      | nächsten |
     When I enter the correct solution using the puzzlehelper buttons
      And I hit the return key
     Then the "nächsten" gap is active
     When I enter the correct solution using the puzzlehelper buttons
      And I hit the return key
     Then I should not see an active gap
     When I wait patiently for a continue button
     Then I should see a continue button
      And I should see that the 1st item is noninteractive
      And I should see that the 2nd item is noninteractive
      And I should see that the 3rd item is noninteractive
      And I should see that the 4th item is noninteractive
      And I should see that the 5th item is noninteractive
      And I should see that the 6th item is noninteractive
    # Finish trainer
     When I click on the continue button
     Then I am on a trainer end page
      And I should see that I correctly answered 1 out of 1 questions in the lesson
      And I should not see a Correct Errors button
      And I should see a Return Home button
