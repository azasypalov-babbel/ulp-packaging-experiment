Feature: Test that a trainer can be completed even if a sound does not play properly due to a wrong sound id

  Scenario: Finish whole lesson with broken sound ids and microphone disabled
    Given I visit the "whole-lesson-with-wrong-sounds" demo lesson as a customer
     When I choose to continue without speech recognition

     Then I am on a "VocabularySpeakChrome" trainer page
      And I wait patiently for a continue button
     When I click on the continue button
      And I click on the continue button

     Then I am on a "DialogSpeak" trainer page
     When I patiently wait for a continue button
      And I click on the continue button

     Then I am on a "VocabularyFillin" trainer page
     When I complete the trainer with 0 mistakes

     Then I am on a "VocabularyClick" trainer page
     When I complete the trainer with 0 mistakes

     Then I am on a "VocabularyWordorder" trainer page
     When I complete the trainer with 0 mistakes

     Then I am on a "VocabularyPuzzlehelper" trainer page
     When I complete the trainer with 0 mistakes

     Then I am on a "VocabularyChoicebuttons" trainer page
     When I complete the trainer with 0 mistakes

     Then I am on a "CardChoicebuttons" trainer page
     When I complete the trainer with 0 mistakes

     Then I am on a "CardFillin" trainer page
     When I complete the trainer with 0 mistakes

     Then I am on a "CardPuzzlehelper" trainer page
     When I complete the trainer with 0 mistakes

     Then I am on a "Keyboard" trainer page
     When I complete the trainer with 0 mistakes

     Then I am on a "DialogFillin" trainer page
     When I complete the trainer with 0 mistakes

     Then I am on a "DialogChoicebuttons" trainer page
     When I complete the trainer with 0 mistakes

     Then I am on a "DialogDictatefillin" trainer page
     When I complete the trainer with 0 mistakes

     Then I am on a "DialogDictatechoice" trainer page
     When I complete the trainer with 0 mistakes

     Then I am on a "DialogPuzzlehelper" trainer page
     When I complete the trainer with 0 mistakes

     Then I am on a "ComprehensionText" trainer page
     When I complete the trainer with 0 mistakes
      And I click on the continue button

     Then I am on a "ComprehensionAudio" trainer page
     When I complete the trainer with 0 mistakes
      And I click on the continue button

     # matching type 1
     Then I am on a "Matching" trainer page
     When I complete the trainer with 0 mistakes
      And I patiently wait for a continue button
      And I click on the continue button

     # matching type 2
     Then I am on a "Matching" trainer page
     When I complete the trainer with 0 mistakes
      And I patiently wait for a continue button
      And I click on the continue button

     Then I am on a "DictateWordorder" trainer page
     When I complete the trainer with 0 mistakes

     Then I am on a "DictateFillin" trainer page
     When I complete the trainer with 0 mistakes

     Then I am on a "DictatePuzzlehelper" trainer page
     When I complete the trainer with 0 mistakes

     Then I am on a "DictateChoicebuttons" trainer page
     When I complete the trainer with 0 mistakes

     Then I am on a trainer end page

  Scenario: Finish Vocabulary & Dialog Speak with microphone enabled
    Given I visit the "whole-lesson-with-wrong-sounds" demo lesson as a customer
      And I set the URL param "is_web_speech_mock" to "on"
     When I choose to continue with speech recognition
      And I make my way around the speech permissions

     Then I am on a "VocabularySpeakChrome" trainer page
      And I wait 3 seconds
     When I wait patiently for a continue button
      And I click on the continue button
      And I wait patiently for a continue button
      And I click on the continue button

     Then I am on a "DialogSpeak" trainer page
     When I wait patiently for a continue button
      And I click on the continue button
      And I wait patiently for a continue button
      And I click on the continue button

     Then I am on a "VocabularyFillin" trainer page

  Scenario: Finish writing review with broken sound id
    Given I visit the demo review page with "review_items_with_wrong_sounds"
     When I choose the "Writing" review
     Then I am on a "VocabularyFillin" trainer page
     When I complete the trainer with 0 mistakes
     Then I am on a review end page

  Scenario: Finish listening review with broken sound id
    Given I visit the demo review page with "review_items_with_wrong_sounds"
     When I choose the "Listening" review
     Then I am on a "Listening" trainer page
     When I complete the trainer with 0 mistakes
     Then I am on a review end page

  Scenario: Finish flashcard review with broken sound id
    Given I visit the demo review page with "review_items_with_wrong_sounds"
     When I choose the "Flashcards" review
     Then I am on a "Flashcard" trainer page
     When I complete the trainer with 0 mistakes
     Then I am on a review end page

  Scenario: Finish spoken review with broken sound id
    Given I visit the demo review page with "review_items_with_wrong_sounds"
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
