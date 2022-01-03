Feature: Test some purge item edge cases in the card trainer which supports "make items noninteractive"

  Scenario: Fillin. Make mistakes in every item, see that it appears correctly in 1st, 2nd and 3rd round
    Given I visit the "card-fillin-purge-edge-cases" demo lesson as a customer
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "CardFillin" trainer page
     When I click on the transliteration toggle button
    # 1st item
      And I enter an incorrect solution
      And I hit the return key
      And I hit the return key
      And I enter the correct solution
      And I hit the return key
     Then the solved item's full text is "Das Waschbecken ist zu klein"
    # 2nd item
     When I enter an incorrect solution
      And I hit the return key
      And I hit the return key
      And I enter the correct solution
      And I hit the return key
     Then the solved item's full text is "niemals"
    # 3rd item
     When I enter an incorrect solution
      And I hit the return key
      And I hit the return key
      And I enter the correct solution
      And I hit the return key
     Then the solved item's full text is "Pfannkuchen"
    # 4th item
     When I enter an incorrect solution
      And I hit the return key
      And I hit the return key
      And I enter the correct solution
      And I hit the return key
     Then the solved item's full text is "Heute scheint der Mond hell."
    # 5th item
     When I enter an incorrect solution
      And I hit the return key
      And I hit the return key
      And I enter the correct solution
      And I hit the return key
     Then the solved item's full text is "Aber die Sonne scheint dafür heute überhaupt nicht."
    # 6th item
     When I enter an incorrect solution
      And I hit the return key
      And I hit the return key
      And I enter the correct solution
      And I hit the return key
     Then the solved item's full text is "Das ist ein trister Ort."
    # 7th item
     When I enter an incorrect solution
      And I hit the return key
      And I hit the return key
      And I enter the correct solution
      And I hit the return key
     Then the solved item's full text is "Hallo da drüben"
    # 8th item
     When I enter an incorrect solution
      And I hit the return key
      And I hit the return key
      And I enter the correct solution
      And I hit the return key
     Then the solved item's full text is "Hallo da drüben!"
    # 9th item
     When I enter the correct solution
      And I hit the return key
      And I enter an incorrect solution
      And I hit the return key
      And I click on the continue button
     Then the solved item's full text is "Wie ist das Wetter in Eritrea, und was isst Fred zum Frühstück?"
    # end page and choose purge
     When I click on the continue button
     # And I click on the continue button
     Then I am on a trainer end page
     When I click on the Correct Errors button

    # first purge round. all items need to be corrected and should be correctly
    # displayed on the page
     Then I am on a "CardFillin" trainer page
    # 1st item
     When I enter an incorrect solution
      And I hit the return key
      And I hit the return key
      And I enter the correct solution
      And I hit the return key
     Then the solved item's full text is "Das Waschbecken ist zu klein"
    # 2nd item
     When I enter the correct solution
      And I hit the return key
     Then the solved item's full text is "niemals"
    # 3rd item
     When I enter the correct solution
      And I hit the return key
     Then the solved item's full text is "Pfannkuchen"
    # 4th item
     When I enter the correct solution
      And I hit the return key
     Then the solved item's full text is "Heute scheint der Mond hell."
    # 5th item
     When I enter the correct solution
      And I hit the return key
     Then the solved item's full text is "Aber die Sonne scheint dafür heute überhaupt nicht."
    # 6th item
     When I enter the correct solution
      And I hit the return key
     Then the solved item's full text is "Das ist ein trister Ort."
    # 7th item
     When I enter the correct solution
      And I hit the return key
     Then the solved item's full text is "Hallo da drüben"
    # 8th item
     When I enter the correct solution
      And I hit the return key
     Then the solved item's full text is "Hallo da drüben!"
    # 9th item
     When I enter the correct solution
      And I hit the return key
      And I enter the correct solution
      And I hit the return key
     Then the solved item's full text is "Wie ist das Wetter in Eritrea, und was isst Fred zum Frühstück?"
    # end page and choose purge
     When I click on the continue button
     #  And I click on the continue button
     Then I am on a trainer end page
     When I click on the Correct Errors button

    # second purge round. only one item should be active, and all other sentences
    # should be correctly written on the page
     Then I am on a "CardFillin" trainer page
    # 1st item
     When I enter an incorrect solution
      And I hit the return key
      And I hit the return key
      And I enter the correct solution
      And I hit the return key
    # wait until all items' sounds have played
      And I wait patiently for a continue button
     Then the solved item's full text is "Das Waschbecken ist zu klein"
      And I should see a solved item with the text "niemals"
      And I should see a solved item with the text "Pfannkuchen"
      And I should see a solved item with the text "Heute scheint der Mond hell."
      And I should see a solved item with the text "Aber die Sonne scheint dafür heute überhaupt nicht."
      And I should see a solved item with the text "Das ist ein trister Ort."
      And I should see a solved item with the text "Hallo da drüben"
      And I should see a solved item with the text "Hallo da drüben!"
      And I should see a solved item with the text "Wie ist das Wetter in Eritrea, und was isst Fred zum Frühstück?"

  Scenario: Puzzlehelper. Make mistakes in every item, see that it appears correctly in 1st, 2nd and 3rd round
    Given I visit the "card-puzzlehelper-purge-edge-cases" demo lesson as a customer
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "CardPuzzlehelper" trainer page
    # 1st item
     When I enter an incorrect solution
      And I hit the return key
      And I wait for the animations to stop
      And I hit the return key
      And I enter the correct solution
      And I hit the return key
     Then the solved item's full text is "Das Waschbecken ist zu klein"
    # 2nd item
     When I enter an incorrect solution
      And I hit the return key
      And I hit the return key
      And I enter the correct solution
      And I hit the return key
     Then the solved item's full text is "niemals"
    # 3rd item
     When I enter an incorrect solution
      And I hit the return key
      And I hit the return key
      And I enter the correct solution
      And I hit the return key
     Then the solved item's full text is "Pfannkuchen"
    # 4th item
     When I enter an incorrect solution
      And I hit the return key
      And I hit the return key
      And I enter the correct solution
      And I hit the return key
     Then the solved item's full text is "Heute scheint der Mond hell."
    # 5th item
     When I enter an incorrect solution
      And I hit the return key
      And I hit the return key
      And I enter the correct solution
      And I hit the return key
     Then the solved item's full text is "Aber die Sonne scheint dafür heute überhaupt nicht."
    # 6th item
     When I enter an incorrect solution
      And I hit the return key
      And I hit the return key
      And I enter the correct solution
      And I hit the return key
     Then the solved item's full text is "Das ist ein trister Ort."
    # 7th item
     When I enter an incorrect solution
      And I hit the return key
      And I hit the return key
      And I enter the correct solution
      And I hit the return key
     Then the solved item's full text is "Hallo da drüben"
    # 8th item
     When I enter an incorrect solution
      And I hit the return key
      And I hit the return key
      And I enter the correct solution
      And I hit the return key
     Then the solved item's full text is "Hallo da drüben!"
    # 9th item
     When I enter the correct solution
      And I hit the return key
      And I enter an incorrect solution
      And I hit the return key
      And I wait for the animations to stop
      And I click on the continue button
     Then the solved item's full text is "Wie ist das Wetter in Eritrea, und was isst Fred zum Frühstück?"
    # end page and choose purge
     When I click on the continue button
     Then I am on a trainer end page
     When I click on the Correct Errors button

    # first purge round. all items need to be corrected and should be correctly
    # displayed on the page
     Then I am on a "CardPuzzlehelper" trainer page
    # 1st item
     When I enter an incorrect solution
      And I hit the return key
      And I hit the return key
      And I enter the correct solution
      And I hit the return key
     Then the solved item's full text is "Das Waschbecken ist zu klein"
    # 2nd item
     When I enter the correct solution
      And I hit the return key
     Then the solved item's full text is "niemals"
    # 3rd item
     When I enter the correct solution
      And I hit the return key
     Then the solved item's full text is "Pfannkuchen"
    # 4th item
     When I enter the correct solution
      And I hit the return key
     Then the solved item's full text is "Heute scheint der Mond hell."
    # 5th item
     When I enter the correct solution
      And I hit the return key
     Then the solved item's full text is "Aber die Sonne scheint dafür heute überhaupt nicht."
    # 6th item
     When I enter the correct solution
      And I hit the return key
     Then the solved item's full text is "Das ist ein trister Ort."
    # 7th item
      When I enter the correct solution
      And I hit the return key
     Then the solved item's full text is "Hallo da drüben"
    # 8th item
     When I enter the correct solution
      And I hit the return key
     Then the solved item's full text is "Hallo da drüben!"
    # 9th item
     When I enter the correct solution
      And I hit the return key
      And I enter the correct solution
      And I hit the return key
      And I wait for the animations to stop
     Then the solved item's full text is "Wie ist das Wetter in Eritrea, und was isst Fred zum Frühstück?"
    # end page and choose purge
     When I click on the continue button
     Then I am on a trainer end page
     When I click on the Correct Errors button

    # second purge round. only one item should be active, and all other sentences
    # should be correctly written on the page
     Then I am on a "CardPuzzlehelper" trainer page
    # 1st item
     When I enter an incorrect solution
      And I hit the return key
      And I hit the return key
      And I enter the correct solution
      And I hit the return key
    # wait until all items' sounds have played
      And I wait patiently for a continue button
     Then the solved item's full text is "Das Waschbecken ist zu klein"
      And I should see a solved item with the text "niemals"
      And I should see a solved item with the text "Pfannkuchen"
      And I should see a solved item with the text "Heute scheint der Mond hell."
      And I should see a solved item with the text "Aber die Sonne scheint dafür heute überhaupt nicht."
      And I should see a solved item with the text "Das ist ein trister Ort."
      And I should see a solved item with the text "Hallo da drüben"
      And I should see a solved item with the text "Hallo da drüben!"
      And I should see a solved item with the text "Wie ist das Wetter in Eritrea, und was isst Fred zum Frühstück?"

  Scenario: Choicebuttons. Make mistakes in every item, see that it appears correctly in 1st, 2nd and 3rd round
    Given I visit the "card-choicebuttons-purge-edge-cases" demo lesson as a customer
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "CardChoicebuttons" trainer page
    # 1st item
     When I enter an incorrect solution
      And I wait for the animations to stop
      And I enter the correct solution
      And I wait for the animations to stop
     Then the solved item's full text is "der"
    # 2nd item
     When I enter an incorrect solution
      And I wait for the animations to stop
      And I enter the correct solution
      And I wait for the animations to stop
     Then the solved item's full text is "nie"
    # 3rd item
     When I enter an incorrect solution
      And I wait for the animations to stop
      And I enter the correct solution
      And I wait for the animations to stop
     Then the solved item's full text is "Ich mag Pfannkuchen sehr gerne."
    # 4th item
     When I enter an incorrect solution
      And I wait for the animations to stop
      And I enter the correct solution
      And I wait for the animations to stop
     Then the solved item's full text is "Scheint der Mond heute?"
    # 5th item
     When I enter an incorrect solution
      And I wait for the animations to stop
      And I enter the correct solution
      And I wait for the animations to stop
     Then the solved item's full text is "Er glaubt, dass die Sonne scheint"
     # 6th item
     When I enter an incorrect solution
      And I wait for the animations to stop
      And I enter the correct solution
      And I wait for the animations to stop
      And I enter the correct solution
      And I wait for the animations to stop
     Then the solved item's full text is "Wie ist das Wetter in Eritrea, und was isst Fred zum Frühstück?"
    # 7th item
     When I enter an incorrect solution
      And I wait for the animations to stop
      And I enter the correct solution
      And I wait for the animations to stop
      And I enter the correct solution
      And I wait for the animations to stop
     Then the solved item's full text is "Wie ist das Wetter in Eritrea, und was isst Fred zum Frühstück?"
    # end page and choose purge
     When I click on the continue button
     Then I am on a trainer end page
     When I click on the Correct Errors button

     # first purge round. all items need to be corrected and should be correctly
     # displayed on the page
      Then I am on a "CardChoicebuttons" trainer page
     # 1st item
      When I enter an incorrect solution
       And I wait for the animations to stop
       And I enter the correct solution
       And I wait for the animations to stop
      Then the solved item's full text is "der"
     # 2nd item
      When I enter the correct solution
       And I wait for the animations to stop
      Then the solved item's full text is "nie"
     # 3rd item
      When I enter the correct solution
       And I wait for the animations to stop
      Then the solved item's full text is "Ich mag Pfannkuchen sehr gerne."
     # 4th item
      When I enter the correct solution
       And I wait for the animations to stop
      Then the solved item's full text is "Scheint der Mond heute?"
     # 5th item
      When I enter the correct solution
       And I wait for the animations to stop
      Then the solved item's full text is "Er glaubt, dass die Sonne scheint"
     # 6th item
      When I enter the correct solution
       And I wait for the animations to stop
       And I enter the correct solution
       And I wait for the animations to stop
      Then the solved item's full text is "Wie ist das Wetter in Eritrea, und was isst Fred zum Frühstück?"
     # 7th item
      When I enter the correct solution
       And I wait for the animations to stop
       And I enter the correct solution
       And I wait for the animations to stop
      Then the solved item's full text is "Wie ist das Wetter in Eritrea, und was isst Fred zum Frühstück?"
     # end page and choose purge
      When I click on the continue button
      Then I am on a trainer end page
      When I click on the Correct Errors button

     # second purge round. only one item should be active, and all other sentences
     # should be correctly written on the page
      Then I am on a "CardChoicebuttons" trainer page
     # 1st item
      When I enter an incorrect solution
       And I hit the return key
       And I hit the return key
       And I enter the correct solution
       And I hit the return key
     # wait until all items' sounds have played
       And I wait patiently for a continue button
      Then the solved item's full text is "der"
       And I should see a solved item with the text "nie"
       And I should see a solved item with the text "Ich mag Pfannkuchen sehr gerne."
       And I should see a solved item with the text "Scheint der Mond heute?"
       And I should see a solved item with the text "Er glaubt, dass die Sonne scheint"
       And I should see a solved item with the text "Wie ist das Wetter in Eritrea, und was isst Fred zum Frühstück?"
       And I should see a solved item with the text "Wie ist das Wetter in Eritrea, und was isst Fred zum Frühstück?"
