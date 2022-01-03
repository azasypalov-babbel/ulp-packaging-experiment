Feature: Test the Wordorder interaction

  Background: Open demo lesson, ensure that the gaps match the test setup
    Given I visit the demo index page as a customer
      And I click on the "Vocabulary Wordorder" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "VocabularyWordorder" trainer page
      And the words are
      | Ich  |
      | bin  |
      | aus  |
      | Zürich |
      | ! |

  @smoke_test
  Scenario: Solved using buttons and dismissal of feedback
    Given I see that the wordorder gap is active
     When I press the "Ich" wordorder button
      And I press the "bin" wordorder button
      And I press the "aus" wordorder button
      And I press the "Zürich" wordorder button
      And I press the "!" wordorder button
      And I wait for the animations to stop
     Then I do not see the feedback
      And I should see that the wordorder gap is not active
      And I should see a continue button

  Scenario: Regression: Typos are not accepted
    Given I cheat to the "I can do better than that." gap
     When I press the "I" wordorder button
      And I press the "can" wordorder button
      And I press the "do" wordorder button
      And I press the "better" wordorder button
      And I press the "that" wordorder button
    # Wordorder should not accept "that" as an answer for "than"
     Then I see the "that" wordorder button is enabled
      And I see the "than" wordorder button is enabled
     When I press the "than" wordorder button
      And I press the "that" wordorder button
      And I wait for the animations to stop
     Then I do not see the feedback
      And I should see that the wordorder gap is not active
      And I should see a continue button

  Scenario: Wordorder can be solved using the keyboard and when two words start with the same letter, wordorder automatically chooses the first correct answer when the user types that letter
    Given I cheat to the "I can do better than that." gap
     Then I see that the wordorder gap is active
     When I hit the "I" key
      And I hit the "c" key
      And I hit the "d" key
      And I hit the "b" key
     When I hit the "t" key
     Then I see that the wordorder gap is active
      And I see that the "than" wordorder button is disabled
      And I see that the "that" wordorder button is enabled
     When I hit the "t" key
     Then I do not see the feedback
      And I should see that the wordorder gap is not active
      And I should see a continue button

  @sanity_test
  Scenario: Observing wordorder buttons state and input gap while using buttons
    # Solve first word
    Given I see that the wordorder gap is active
      And I see the "Ich" wordorder button is enabled
     When I press the "Ich" wordorder button
     Then I see the "Ich" wordorder button is disabled
      And I see "Ich" in the gap
      And I wait for the animations to stop
    # Solve second word
      And I should see that the wordorder gap is still active
      And I see the "bin" wordorder button is enabled
     When I press the "bin" wordorder button
     Then I see the "bin" wordorder button is disabled
      And I see "Ich bin" in the gap
      And I wait for the animations to stop
    # Make a mistake on the third word
      And I should see that the wordorder gap is still active
      And I see the "Zürich" wordorder button is enabled
     When I press the "Zürich" wordorder button
     Then I see the "Zürich" wordorder button is enabled
      And I see "Ich bin" in the gap
      And I wait for the animations to stop
    # Solve third word
      And I should see that the wordorder gap is still active
      And I see the "aus" wordorder button is enabled
     When I press the "aus" wordorder button
     Then I see the "aus" wordorder button is disabled
      And I see "Ich bin aus" in the gap
      And I wait for the animations to stop
    # Solve 4th word
      And I should see that the wordorder gap is still active
      And I see the "Zürich" wordorder button is enabled
     When I press the "Zürich" wordorder button
     Then I see "Ich bin aus Zürich" in the gap
      And I wait for the animations to stop
    # Solve final word
      And I should see that the wordorder gap is still active
      And I see the "!" wordorder button is enabled
     When I press the "!" wordorder button
      And I wait for the animations to stop
     Then I see "Ich bin aus Zürich!" in the gap
      And I should see that the wordorder gap is not active
      And I should see a continue button
      And I click on the continue button

  @scoring
  Scenario: Cheat all gaps
    Given I cheat all gaps
     Then I am on a trainer end page
      And I should see that I correctly answered 3 out of 3 questions in the lesson

  @scoring @errors
  Scenario: Skip until last gap and make mistake
    Given I cheat to the "I can do better than that." gap
      And the words are
      | I      |
      | can    |
      | do     |
      | better |
      | than   |
      | that   |
     When I press the "than" wordorder button
     Then I see "" in the gap
     When I press the "I" wordorder button
      And I press the "can" wordorder button
      And I press the "do" wordorder button
      And I press the "better" wordorder button
      And I press the "than" wordorder button
      And I press the "that" wordorder button
     Then I see "I can do better than that." in the gap
     When I click on the continue button
     Then I am on a trainer end page
      And I should see that I correctly answered 2 out of 3 questions in the lesson

  @sanity_test @scoring @errors @correct_errors
  Scenario: Full flow with two purge rounds
    # Mistake on first item
    Given I see that the wordorder gap is active
     When I press the "Zürich" wordorder button
     Then I see "" in the gap
     When I press the "Ich" wordorder button
      And I press the "bin" wordorder button
      And I press the "aus" wordorder button
      And I press the "Zürich" wordorder button
      And I press the "!" wordorder button
     Then I see "Ich bin aus Zürich!" in the gap
     When I patiently wait for a continue button
      And I click on the continue button
    # no mistake on 2nd item
     When I enter the correct solution
      And I patiently wait for a continue button
      And I click on the continue button
    # mistake on 3rd item
     When I enter an incorrect solution
      And I wait for the animations to stop
      And I enter the correct solution
      And I patiently wait for a continue button
      And I click on the continue button
    # trainer end page
     Then I am on a trainer end page
      And I should see that I correctly answered 1 out of 3 questions in the lesson
      And I should see that the Correct Errors button has the text "2"
    # First Purge
     When I click on the Correct Errors button
     Then I am on a "VocabularyWordorder" trainer page
    # no mistake on first purge item
      And I should see that the wordorder gap is active
      And the words are
          | Ich    |
          | bin    |
          | aus    |
          | Zürich |
          | !      |
     When I enter the correct solution
      And I wait patiently for a continue button
      And I hit the return key
    # mistake on second purge item
     Then I should see that the wordorder gap is active
      And the words are
          | I      |
          | can    |
          | do     |
          | better |
          | than   |
          | that   |
     When I enter an incorrect solution
      And I hit the return key
      And I wait for the animations to stop
      And I enter the correct solution
      And I wait patiently for a continue button
      And I hit the return key
    # Finish trainer
     Then I am on a trainer end page
      And I should see that I correctly answered 1 out of 2 questions in the lesson
      And I should see that the Correct Errors button has the text "1"
    # Second Purge
     When I click on the Correct Errors button
     Then I am on a "VocabularyWordorder" trainer page
      And I should see that the wordorder gap is active
      And the words are
          | I      |
          | can    |
          | do     |
          | better |
          | than   |
          | that   |
     When I enter the correct solution
      And I wait patiently for a continue button
      And I hit the return key
    # Finish trainer
     Then I am on a trainer end page
      And I should see that I correctly answered 1 out of 1 questions in the lesson
      And I should not see a Correct Errors button
