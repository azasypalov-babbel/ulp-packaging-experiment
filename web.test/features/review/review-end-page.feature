Feature: This feature tests the review end page behavior
  - In our fixtures, there are only enough review items for 2 rounds
  - Smoke Test: Minimal scenario to test that the review cycle is not broken
  - Both leads and paying customers can do a review session and end up on the review end page
  - In case the user makes errors, these show up in a red box and can be corrected
  - After the 1st round, the user can choose to review more items
  - After the 1st round and after correcting errors, the user can choose to review more items
  - After the 2nd round, the user can NOT choose to review more items
  - After the 2nd round and after correcting errors, the user can NOT choose to review more items

  @smoke_test @correct_errors
  Scenario: Finish the review with one mistake and be able to correct it
    Given I visit the demo index page
      # Lead or Customer does not matter here
      And I click on the "Review As Lead" button
     Then I am on the demo review page
     When I choose the "Writing" review
     Then I am on a "VocabularyFillin" trainer page
     When I complete the trainer with 1 mistake
     Then I am on a review end page
      # CAN PURGE
      And I should see that I can correct my 1 mistake
     When I choose to correct my errors
     Then I am on a "VocabularyFillin" trainer page
     When I complete the trainer with 0 mistakes
     Then I am on a review end page

  @no_errors
  Scenario: Finish the writing review without making mistakes as a lead
    Given I visit the demo index page
      And I click on the "Review As Lead" button
     Then I am on the demo review page
     When I choose the "Writing" review
     # FIRST ROUND - review more is possible
     Then I am on a "VocabularyFillin" trainer page
     When I complete the trainer with 0 mistakes
     Then I am on a review end page
      And I should see a Review More button
      And I should not see a Close button
      And I should not see a review Correct Errors button
     When I choose to review more items
     # SECOND ROUND - no review more
     Then I am on a "VocabularyWordorder" trainer page
     When I complete the trainer with 0 mistakes
     Then I am on a review end page
      And I should see a Close button
      And I should not see a Review More button
      And I should not see a review Correct Errors button

  @errors @sanity_test
  Scenario: Finish the writing review with at least one mistake as a customer
    Given I visit the demo index page as a customer
      And I click on the "Review As Customer" button
     Then I am on the demo review page
     When I choose the "Writing" review
     # FIRST ROUND with errors - review more and correct errors are possible
     Then I am on a "VocabularyFillin" trainer page
     When I complete the trainer with 1 mistake
     Then I am on a review end page
      And I should see that I can correct my 1 mistake
      And I should see a Review More button
      And I should not see a Close button
     # CORRECT ERRORS FIRST ROUND - review more is possible
     When I choose to correct my errors
     Then I am on a "VocabularyFillin" trainer page
     When I complete the trainer with 0 mistakes
     Then I am on a review end page
      And I should not see a Close button
      And I should see a Review More button
      And I should not see a review Correct Errors button

  @errors @sanity_test
  Scenario: Finish the writing review with at least one mistake as a lead
    Given I visit the demo index page
      And I click on the "Review As Customer" button
     Then I am on the demo review page
     When I choose the "Writing" review
     Then I am on a "VocabularyFillin" trainer page
     When I complete the trainer with 0 mistakes
     Then I am on a review end page
     When I choose to review more items
     # SECOND ROUND - with errors - no review more but correct errors
     Then I am on a "VocabularyWordorder" trainer page
     When I complete the trainer with 1 mistake
     Then I am on a review end page
      And I should see a Close button
      And I should not see a Review More button
      And I should see that I can correct my 1 mistake
     # CORRECT ERRORS SECOND ROUND - no review more button
     When I choose to correct my errors
     Then I am on a "VocabularyWordorder" trainer page
     When I complete the trainer with 0 mistakes
     Then I am on a review end page
      And I should see a Close button
      And I should not see a Review More button
      And I should not see a review Correct Errors button
