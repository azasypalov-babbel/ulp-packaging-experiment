Feature: Test the Matching trainer

  @no_errors @content_locked
  Scenario: Complete the matching trainer without errors
    Given I visit the demo index page
     When I click on the "Matching" button
     Then I am on a "Matching" trainer page
     When I complete the trainer with 0 mistakes
      And I patiently wait for a continue button
      And I click on the trainer end continue button
     Then I am on a "Matching" trainer page
     When I complete the trainer with 0 mistakes
      And I patiently wait for a continue button
      And I click on the trainer end continue button
     Then I am on a trainer end page
      And I should see that I correctly answered 9 out of 9 questions in the lesson
      And I should see that the Access Content button has the correct text
      And I check that the Access Content button leads to the prices page

  @no_errors @translation_visibility @button_feedback_color
  Scenario: Complete the matching trainer without errors
    Given I visit the demo index page as a customer
     When I click on the "Matching" button
     Then I am on a "Matching" trainer page
     When I click on the skip trainer forward button
     Then I am on a "Matching" trainer page
    # check translation toggle symbols
      And I should not see any translation toggle symbol
      And I should not see any tooltip
     When I wait until I see the next question and answer
     Then I should see that the button with the correct answer turns green when clicked
     When I wait until I see the next question and answer
     Then I should see that the button with the incorrect answer turns red when clicked
     When I wait until I see the next question and answer
      And I click on the correct answer
      And I wait until I see the next question and answer
      And I click on the correct answer
      And I wait until I see the next question and answer
     Then I should see that the item "drei" has a translation toggle symbol
      But I should not see that the item "sieben" has a translation toggle symbol
      But I should not see that the item "vier" has a translation toggle symbol
     When I click on the correct answer
      And I wait until I see the next question and answer
     Then I should see that the item "drei" has a translation toggle symbol
      And I should see that the item "sieben" has a translation toggle symbol
      But I should not see that the item "vier" has a translation toggle symbol
     When I click on the correct answer
      And I wait patiently for a continue button
     Then I should see that the item "drei" has a translation toggle symbol
      And I should see that the item "sieben" has a translation toggle symbol
      And I should see that the item "vier" has a translation toggle symbol
    # check tooltip contents
    # hacky way to put mouse focus somewhere else to get rid of the tooltip
     When I dismiss any info text
      And I click on the title
     Then I should not see any tooltip
     When I mouse over the 3rd translation toggle symbol
     Then I should see a tooltip with the text "3-0=3"
     When I click on the title
     Then I should not see any tooltip
     When I mouse over the 4th translation toggle symbol
     Then I should see a tooltip with the text "1+6=7"
     When I click on the title
     Then I should not see any tooltip
     When I mouse over the 5th translation toggle symbol
     Then I should see a tooltip with the text "2x2=4"
     When I click on the title
     Then I should not see any tooltip

  @info_texts @alternative_solution
  Scenario: User can click on either option when there are two options with same value
    Given I visit the demo index page
     When I click on the "Matching" button
     Then I am on a "Matching" trainer page
      And I wait until I see the next question and answer
     When I click on the correct answer
     Then the info text is shown
     When I dismiss the info text
     Then the info text is not shown
     When I click on the skip trainer forward button
     Then I am on a "Matching" trainer page
      And I wait until I see the next question and answer
     When I enter the alternative solution
     Then the info text is shown
      And the info text contains the text "ICH DARF"
     When I dismiss the info text
      And I mouse over the 1st translation toggle symbol
     Then I should see a tooltip with the text "I may"
     When I enter the alternative solution
     Then the info text is shown
      And the info text contains the text "ER DARF"
     When I dismiss the info text
      And I mouse over the 2nd translation toggle symbol
     Then I should see a tooltip with the text "he may"

  @errors @correct_errors @content_unlocked
  Scenario: Complete the matching trainer with some errors
    Given I visit the demo index page as a customer
     When I click on the "Matching" button
     Then I am on a "Matching" trainer page
     When I complete the trainer with 2 mistakes
      And I patiently wait for a continue button
      And I click on the trainer end continue button
     Then I am on a "Matching" trainer page
     When I complete the trainer with 2 mistakes
      And I patiently wait for a continue button
      And I click on the trainer end continue button
     Then I am on a trainer end page
      And I should see that I correctly answered 5 out of 9 questions in the lesson
      And I should see that the Correct Errors button has the text "4"
      And I should see a Return Home button
     When I click on the Correct Errors button
     Then I am on a "Matching" trainer page
     When I complete the trainer with 0 mistakes
      And I patiently wait for a continue button
      And I click on the trainer end continue button
     Then I am on a "Matching" trainer page
     When I complete the trainer with 0 mistakes
      And I patiently wait for a continue button
      And I click on the trainer end continue button
     Then I am on a trainer end page
      And I should see that I correctly answered 4 out of 4 questions in the lesson
      And I should see a Return Home button
      And I should not see a Correct Errors button
