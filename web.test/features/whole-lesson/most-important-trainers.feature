Feature: This feature tests a lesson that is made of short versions of
  the most used trainer types in sale relevant language combinations

  @no_errors @sanity_test
  Scenario: Quickly run through the most important trainer types - unlocked content, no errors
    Given I visit the demo index page
      And I click on the "Most Important Trainers" button
      And I choose to continue without speech recognition
     Then I am on a "VocabularyChoicebuttons" trainer page
     When I complete the trainer with 0 mistakes
     Then I am on a "VocabularyFillin" trainer page
     When I complete the trainer with 0 mistakes
     Then I am on a "CardChoicebuttons" trainer page
     When I complete the trainer with 0 mistakes
     Then I am on a "CardFillin" trainer page
     When I complete the trainer with 0 mistakes
     Then I am on a "VocabularyClick" trainer page
     When I complete the trainer with 0 mistakes
     Then I am on a "VocabularySpeakChrome" trainer page
     When I complete the trainer with 0 mistakes
     Then I am on a "VocabularyPuzzlehelper" trainer page
     When I complete the trainer with 0 mistakes
     Then I am on a "VocabularyWordorder" trainer page
     When I complete the trainer with 0 mistakes
     Then I am on a trainer end page
