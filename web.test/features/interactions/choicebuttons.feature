Feature: Test the Choicebuttons interactions

  @alternative_solution @no_purge
  Scenario: Choosing an alternative solution does not count as error
    Given I visit the "choicebuttons-one-item" demo lesson as a customer
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "VocabularyChoicebuttons" trainer page
      And I wait for the animations to stop
     When I enter the alternative solution
     Then I should see that the 1st item is noninteractive
      And I patiently wait for the continue button
     When I click on the trainer end continue button
     Then I am on a trainer end page
      And I should see that I correctly answered 1 out of 1 questions in the lesson
      And I should not see a Correct Errors button

  @errors @correct_errors @content_unlocked
  Scenario: Make errors, go through purge
    Given I visit the demo index page as a customer
     When I click on the "Vocabulary Choicebuttons" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "VocabularyChoicebuttons" trainer page
      And I wait for the animations to stop
    # no mistake in 1st item
      And I hit the "1" key
      And I wait until I see the next question and answers
      And I hit the "2" key
      And I patiently wait for the continue button
      And I click on the continue button
    # mistake and then alternative solution in 2nd item
    # this is the "der" gap, the solutons are "der" and "yes"
      And I hit the "1" key
      And I wait until I see the next question and answers
      And I hit the "4" key
      And I patiently wait for the continue button
      And I click on the continue button
    # no mistake in 3rd item
      And I hit the "2" key
      And I wait until I see the next question and answers
      And I hit the "1" key
      And I patiently wait for the continue button
      And I click on the continue button
    # mistake in 4th item
    # this is the "Der" gap, the solutions are "Der" and "yes"
      And I hit the "2" key
      And I wait until I see the next question and answers
      And I hit the "3" key
      And I patiently wait for the continue button
      And I click on the continue button
    # end page
     Then I am on a trainer end page
      And I should see that I correctly answered 2 out of 4 questions in the lesson
     When I click on the Correct Errors button
    # first purge
     Then I am on a "VocabularyChoicebuttons" trainer page
      And the "der" gap is active
     When I enter the correct solution
      And I patiently wait for the continue button
      And I click on the continue button
     Then the "Das" gap is active
     When I enter an incorrect solution
      And I wait until I see the next question and answers
      And I hit the "3" key
      And I patiently wait for the continue button
      And I click on the continue button
    # end page
     Then I am on a trainer end page
      And I should see that I correctly answered 1 out of 2 questions in the lesson
     When I click on the Correct Errors button
    # second purge
     Then I am on a "VocabularyChoicebuttons" trainer page
      And the "Das" gap is active
     When I enter the correct solution
      And I patiently wait for the continue button
      And I click on the continue button
    # end page
     Then I am on a trainer end page
      And I should see that I correctly answered 1 out of 1 questions in the lesson
      And I should not see a Correct Errors button

  Scenario: The user sees the correct answer and different distractors as choicebuttons
    Given I visit the "choicebuttons-one-item" demo lesson as a customer
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "VocabularyChoicebuttons" trainer page
      And I wait for the animations to stop
      And I should see at least 1 correct answer
      And I should see at least 1 incorrect answer
      And I should see at least 1 alternative answer

  Scenario: Choicebuttons need to work, even if there is only one choice
    Given I visit the "choicebuttons-edge-cases" demo lesson as a customer
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "VocabularyChoicebuttons" trainer page
      And I wait for the animations to stop
      And I should see exactly 1 correct answer
      And I should see exactly 0 incorrect answers
      And I should see exactly 0 alternative answers

  Scenario: The numbered shortcuts select the respective options on the screen
    # Choices can be single letters or solutions that start with non-letter symbols
    Given I visit the "choicebuttons-edge-cases" demo lesson as a customer
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "VocabularyChoicebuttons" trainer page
      And I wait for the animations to stop
     When I enter the correct solution
      And I hit the return key
      And I patiently wait for the continue button
      And I click on the continue button
      And I wait until I see the next question and answers
    # works with correct solution
      And I hit the "4" key
     Then I see "Wie viel Zeit hast du heute?" in the gap
     When I hit the return key
      And I wait until I see the next question and answers
    # works with alternative solution
      And I hit the "3" key
    # solution with non-letter symbol '-ûyor'
     Then I see "-ûyor" in the gap
      And I patiently wait for the continue button
     When I click on the continue button
      And I wait until I see the next question and answers
     # single letter solution 'u'
     # many choices in this answer
      And I hit the "5" key
     Then I see "u" in the gap
      And I patiently wait for the continue button
      And I wait for the animations to stop
     When I click on the continue button
     Then I am on a trainer end page

  Scenario: Should show babbel markdown in the text on the choicebuttons
    Given I visit the "choicebuttons-edge-cases" demo lesson as a customer
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "VocabularyChoicebuttons" trainer page
      And I wait for the animations to stop
     When I enter the correct solution
      And I hit the return key
      And I patiently wait for the continue button
      And I click on the continue button
      And I wait until I see the next question and answers
     Then I should see "hast" on the choicebutton with the number 1 in bold
      And I should see "Wie viel" on the choicebutton with the number 1 in italic

  @button_feedback_color
  Scenario: Correct answers are momentarily highlighted in green, incorrect answers in red
    Given I visit the "choicebuttons-one-item" demo lesson as a customer
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "VocabularyChoicebuttons" trainer page
      And I wait for the animations to stop
      And I should see that an unclicked choicebutton has a black border
      And I should see that the button with the incorrect answer turns red when clicked
      And I wait for the animations to stop
      And I should see that the button with the correct answer turns green when clicked
     When I patiently wait for a continue button
     Then I should see a continue button
