Feature: Test the Writing interactions in Russian

  Background: Open demo lesson in russian, ensure that the gaps match the test setup
    Given I visit the "RUS" demo index page as a customer with flags "is_transliteration=on"
      And I click on the "Keyboard" button
     Then I am on the Learning Tip Page
     When I click on the Got It button
     Then I am on a "Keyboard" trainer page
      And the gaps are
          | й |
          | ж |
          | ь |

  @smoke_test
  Scenario: Solved using latin characters
    Given the "й" gap is active
     When I enter "jj" into the gap
      And I press return on the gap
      And I wait for the animations to stop
     Then I do not see the feedback
      And the "й" gap is not active

  @smoke_test
  Scenario: Solved using cyrillic characters
    Given the "й" gap is active
     When I enter "й" into the gap
      And I press return on the gap
      And I wait for the animations to stop
     Then I do not see the feedback
      And the "й" gap is not active
