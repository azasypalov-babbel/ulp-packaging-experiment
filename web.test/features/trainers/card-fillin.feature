Feature: Test the Card Fillin Trainer

  @smoke_test
  Scenario: Gaps being revealed throughout the trainer
    Given I visit the demo index page
     When I click on the "Card Fillin" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "CardFillin" trainer page
     When I wait for the animations to stop
     Then I see the gaps
          | Guten |
     When I cheat to the "yes" gap
      And I wait for the animations to stop
     Then I see the gaps
          | Guten |
          | yes |
          | Sonne |
          | Es ist |

  @no_errors @content_locked @translation_visibility
  Scenario: Fill in with correct answers
    Given I visit the demo index page
     When I click on the "Card Fillin" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "CardFillin" trainer page
      And I should not see a translation string
      And I should see a translation toggle symbol
     When I complete the trainer with 0 mistakes
     Then I am on a trainer end page
      And I should see that I correctly answered 3 out of 3 questions in the lesson

  @continue_button @info_texts @formatting_chars
  Scenario: Trainer end continue button
    Given I visit the demo index page
     When I click on the "Card Fillin" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "CardFillin" trainer page
      And I should see "family members" within "task noninteractive" in bold
      And I should see "roles" within "task noninteractive" in italic
     When I enter the correct answer
      And I hit the return key
      And I do not see the feedback
      And I wait until I see the next question and answer
     Then I should see "the present tense" within "task interactive" in bold
      And I should see "what is happening right now" within "task interactive" in italic
      And I should see "er" within "phrase noninteractive" in bold
      And I should see "wichtige Frage" within "phrase noninteractive" in italic
      And I should see "Cousin" within "phrase interactive" in bold
      And I should see "Morgen" within "phrase interactive" in italic
     When I cheat to the "Es ist" gap
      And I enter the correct answer
      And I hit the return key
     Then I do not see the feedback
      And I should not see an active gap
      But the info text is shown
      And I should see "Stadt" within "info text" in bold
      And I should see "Straße" within "info text" in italic
      And I should see "Sandra" within "info text" in bold
      And I should see "Sandra" within "info text" in italic
     When I dismiss the info text
     Then the info text is not shown
     When I click on the translation toggle button
     Then I should see "dear" within "translation" in bold
      And I should see "shining" within "translation" in bold
      And I should see "Which" within "translation" in bold
      And I should see "Good morning" within "translation" in italic
      And I should see "sun" within "translation" in italic
      And I should see "important question" within "translation" in italic
      And I should not see any babbel markup characters anywhere on the page
      But I should see a continue button
     When I click on the continue button
     Then I should not see a continue button
      And I am on a trainer end page

  @errors @correct_errors @content_unlocked @smoke_test
  Scenario: Fill in with mistakes and correct errors
    Given I visit the demo index page as a customer
     When I click on the "Card Fillin" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "CardFillin" trainer page
     When I complete the trainer with 2 mistakes
     Then I am on a trainer end page
      And I should see a Return Home button
      And I should see that I correctly answered 1 out of 3 questions in the lesson
      And I should see that the Correct Errors button has the text "2"
     When I click on the Correct Errors button
      And I wait for the animations to stop
     Then I am on a "CardFillin" trainer page
     When I complete the trainer with 0 mistakes
     Then I am on a trainer end page
      And I should see that I correctly answered 2 out of 2 questions in the lesson
      And I should not see a Correct Errors button
      And I should see a Return Home button
