Feature: Test the Writing interactions

  @smoke_test
  Scenario: Review completed gaps before continuing
    Given I visit the demo index page as a customer
      And I click on the "Card Fillin" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "CardFillin" trainer page
     When I cheat all gaps up to the next continue button
     Then I see the gaps
          | Guten  |
          | yes    |
          | Sonne  |
          | Es ist |

  @smoke_test @hint @no_purge @scoring
  Scenario: Use hint when distractors are present & Asking for the solution does not count as error
    Given I visit the "fillin-one-item" demo lesson as a customer
     Then I am on a "DialogFillin" trainer page
     When I ask for a hint
     Then I should see the letters of the first solution shuffled
     When I ask for the solution
     Then I should see the letters of the first solution in order
     When I wait for the animations to stop
      And I enter the correct solution
      And I hit the return key
      And I wait patiently for a continue button
     Then I should see a continue button
     When I click on the continue button
     Then I am on a trainer end page
      And I should see that I correctly answered 1 out of 1 questions in the lesson
      And I should not see a Correct Errors button

  @typo @no_purge @scoring
  Scenario: Making a typo does not count as error
    Given I visit the "fillin-one-item" demo lesson as a customer
     Then I am on a "DialogFillin" trainer page
     When I enter "sipelen" into the gap
      And I hit the return key
     Then I see that I made a typo
     When I hit the return key
      And I wait for the animations to stop
     Then I should see a continue button
     When I click on the continue button
     Then I am on a trainer end page
      And I should see that I correctly answered 1 out of 1 questions in the lesson
      And I should not see a Correct Errors button

  @scoring @errors
  Scenario: Fillin: Making a mistake counts as mistake
    Given I visit the "fillin-one-item" demo lesson as a customer
     Then I am on a "DialogFillin" trainer page
     When I enter an incorrect solution
      And I hit the return key
     Then I see that I made a mistake
     When I hit the return key
      And I enter the correct solution
      And I hit the return key
     Then I wait patiently for a continue button
     When I click on the continue button
     Then I am on a trainer end page
      And I should see that I correctly answered 0 out of 1 questions in the lesson
      And I should see a Correct Errors button
      And I should see that the Correct Errors button has the text "1"

  @smoke_test
  Scenario: Solved item, no feedback, gap is no longer active
    Given I visit the demo index page as a customer
      And I click on the "Card Fillin" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "CardFillin" trainer page
     When the "Guten" gap is active
     When I enter "Guten" into the gap
      And I hit the return key
     Then I do not see the feedback
      And the "Guten" gap is not active

  @smoke_test
  Scenario: Mistaken and auto-dismissal of feedback after continuing to type
    Given I visit the demo index page as a customer
      And I click on the "Card Fillin" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "CardFillin" trainer page
     When the "Guten" gap is active
     When I enter "Foo" into the gap
      And I hit the return key
     Then I see that I was mistaken
      And the "Guten" gap is still active
     When I clear the gap
     When I enter "G" into the gap
     Then I do not see the feedback
     When I enter "uten" into the gap
      And I hit the return key
     Then I do not see the feedback
      And the "Guten" gap is not active

  Scenario: White-space match
    Given I visit the demo index page as a customer
      And I click on the "Card Fillin" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "CardFillin" trainer page
     When the "Guten" gap is active
     When I enter " Guten  " into the gap
      And I hit the return key
     Then I do not see the feedback
      And the "Guten" gap is not active

  Scenario: Case insensitive match
    Given I visit the demo index page as a customer
      And I click on the "Card Fillin" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "CardFillin" trainer page
     When the "Guten" gap is active
     When I enter "guTeN" into the gap
      And I hit the return key
     Then I do not see the feedback
      And the "Guten" gap is not active

  Scenario: Partial match
    Given I visit the demo index page as a customer
      And I click on the "Card Fillin" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "CardFillin" trainer page
     When the "Guten" gap is active
     When I enter "Gut" into the gap
      And I hit the return key
     Then I see that I was mistaken
      And the "Guten" gap is still active
     When I enter "en" into the gap
      And I hit the return key
     Then I do not see the feedback
      And the "Guten" gap is not active

  Scenario: Partial match with completed word and trailing white-space
    Given I visit the demo index page as a customer
      And I click on the "Card Fillin" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "CardFillin" trainer page
     When I cheat to the "Es ist" gap
     When I enter "Es " into the gap
      And I hit the return key
     Then I see that I was mistaken
      And the "Es ist" gap is still active
     When I enter "ist" into the gap
      And I hit the return key
     Then I do not see the feedback
      And the "Es ist" gap is not active

  Scenario: Partial match keeps white space before next word
    Given I visit the demo index page as a customer
      And I click on the "Card Fillin" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "CardFillin" trainer page
     When I cheat to the "Es ist" gap
     When I enter "Es " into the gap
      And I hit the return key
     Then I see that I was mistaken
      And the "Es ist" gap is still active
     When I enter " ist" into the gap
      And I hit the return key
     Then I do not see the feedback
      And the "Es ist" gap is not active

  @alternative_solution @no_purge @scoring
  Scenario: Fillin: Choosing alternative solution does not count as error
    Given I visit the "fillin-one-item" demo lesson as a customer
     Then I am on a "DialogFillin" trainer page
     When I enter the alternative solution
      And I hit the return key
      And I patiently wait for a continue button
     Then I should see a continue button
     When I click on the continue button
     Then I am on a trainer end page
      And I should see that I correctly answered 1 out of 1 questions in the lesson
      And I should not see a Correct Errors button

  @alternative_solution @hint
  Scenario: There is also a hint for the alternative solution
    Given I visit the demo index page as a customer
      And I click on the "Card Fillin" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "CardFillin" trainer page
     When I cheat to the "Sonne" gap
     When I ask for a hint
     Then I should see the unordered "Sonne" letters in the hint
     When I enter "Lat" into the gap
     Then I should see the unordered "Laterne" letters in the hint
     When I clear the gap
      And I enter "Son" into the gap
     Then I should see the unordered "Sonne" letters in the hint
     When I clear the gap
      And I enter "Lat" into the gap
     Then I should see the unordered "Laterne" letters in the hint
     When I enter "erne" into the gap
      And I hit the return key
     Then I do not see the feedback
      And the "Sonne" gap is not active

  @scoring
  Scenario: Cheat all gaps
    Given I visit the demo index page as a customer
      And I click on the "Card Fillin" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "CardFillin" trainer page
     When I cheat all gaps
     Then I am on a trainer end page
      And I should see that I correctly answered 3 out of 3 questions in the lesson

  @submit_hint
  Scenario: Trainer submit hint
    Given I visit the demo index page as a customer
      And I click on the "Card Fillin" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "CardFillin" trainer page
     When the "Guten" gap is active
     When I enter "guten" into the gap
     Then I wait for something to happen
      And I should see a submit hint
     When I hit the return key
     Then I should not see a submit hint
     When I dismiss the info text
     Then the "yes" gap is active
     When I enter "ye" into the gap
     Then I should not see a submit hint
     When I wait for something to happen
     Then I should see a submit hint
     When I focus on something else
     Then I should not see a submit hint

  @sanity_test @scoring @errors @correct_errors
  Scenario: Full flow with two purge rounds
    Given I visit the demo index page as a customer
      And I click on the "Card Fillin" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "CardFillin" trainer page
      And the "Guten" gap is active
    # Mistake on first item
     When I enter "Gu" into the gap
      And I hit the return key
     Then I see that I was mistaken
      And the "Guten" gap is still active
     When I choose to try again
      And I enter "Guten" into the gap
      And I hit the return key
     Then the "Guten" gap is not active
      And the info text is shown
     When I dismiss the info text
     Then the info text is not shown
    # Solve gap of second item
      And the "yes" gap is active
     When I enter "yes" into the gap
      And I hit the return key
     Then the "yes" gap is not active
      And the info text is shown
     When I dismiss the info text using the escape key
     Then the info text is not shown
    # Solve first gap of last item
      And the "Sonne" gap is active
     When I enter "Sonne" into the gap
      And I hit the return key
     Then the "Sonne" gap is not active
    # Mistake second gap of last item
      And the "Es ist" gap is active
     When I enter "Es i" into the gap
      And I hit the return key
     Then I see that I was mistaken
     When I choose to try again
     Then the "Es ist" gap is still active
     When I enter "Es ist" into the gap
      And I hit the return key
     Then I should not see an active gap
      And I wait patiently for a continue button
     # Finish trainer
     When I click on the continue button
     Then I am on a trainer end page
      And I should see that I correctly answered 1 out of 3 questions in the lesson
      And I should see that the Correct Errors button has the text "2"
     # First Purge
     When I click on the Correct Errors button
     Then I am on a "CardFillin" trainer page
      And I see the gaps
          | Guten |
    # Mistake on first purge item
      And the "Guten" gap is active
      And I should see that the 1st item is noninteractive
      And I should see that the 2nd item is interactive
     When I enter "Gut" into the gap
      And I hit the return key
     Then I see that I was mistaken
     When I choose to try again
     Then the "Guten" gap is still active
     When I enter "Guten" into the gap
      And I hit the return key
     Then the "Guten" gap is not active
      And the info text is shown
     When I dismiss the info text
     Then the info text is not shown
    # Solve first gap of last item
      And the "Sonne" gap is active
      And I see the gaps
          | Guten |
          | Sonne |
          | Es ist |
      And I should see that the 1st item is noninteractive
      And I should see that the 2nd item is noninteractive
      And I should see that the 3rd item is noninteractive
      And I should see that the 4th item is interactive
      And I should see that the 5th item is noninteractive
     When I enter "Sonne" into the gap
      And I hit the return key
     Then the "Sonne" gap is not active
    # Solve second gap of last item
      But the "Es ist" gap is active
      And I should see that the 1st item is noninteractive
      And I should see that the 2nd item is noninteractive
      And I should see that the 3rd item is noninteractive
      And I should see that the 4th item is interactive
      And I should see that the 5th item is noninteractive
     When I enter "Es ist" into the gap
      And I hit the return key
     Then I should not see an active gap
     When I wait patiently for a continue button
     Then I should see that the 1st item is noninteractive
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
     # Second Purge
     When I click on the Correct Errors button
     Then I am on a "CardFillin" trainer page
      And I see the gaps
          | Guten |
      And the "Guten" gap is active
     When I enter "Guten" into the gap
      And I hit the return key
     Then I should not see an active gap
      And the info text is shown
     When I dismiss the info text
     Then the info text is not shown
     When I wait patiently for a continue button
     Then I should see that the 1st item is noninteractive
      And I should see that the 2nd item is noninteractive
      And I should see that the 3rd item is noninteractive
      And I should see that the 4th item is noninteractive
      And I should see that the 5th item is noninteractive
      And I should see that the 6th item is noninteractive
     # Finish trainer
     When I click on the continue button
     Then I am on a trainer end page
      And I should see that I correctly answered 1 out of 1 questions in the lesson
